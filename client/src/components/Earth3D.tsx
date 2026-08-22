import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import earthTextureUrl from '../assets/earth_texture.jpg';
import earthLightsUrl from '../assets/earth_lights.png';

interface Earth3DProps {
  reverse?: boolean;
  size?: number;
  interactive?: boolean;
}

const Earth3D: React.FC<Earth3DProps> = ({ reverse = true, size = 650, interactive = true }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [webGlSupported, setWebGlSupported] = useState(true);
  const [timePeriod, setTimePeriod] = useState<string>('Day');

  useEffect(() => {
    if (!mountRef.current) return;

    // Check WebGL availability safely
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setWebGlSupported(false);
        return;
      }
    } catch {
      setWebGlSupported(false);
      return;
    }

    // Helper: Compute real-time solar positioning and color grading
    const getTimeSettings = () => {
      // Check for URL query override (e.g. ?time=day, ?time=night, ?time=sunset, ?time=sunrise)
      const urlParams = new URLSearchParams(window.location.search);
      const timeParam = urlParams.get('time')?.toLowerCase();

      // Default to live local clock time
      const now = new Date();
      let hours = now.getHours() + now.getMinutes() / 60;

      // Optional manual URL parameter override for demos (?time=night, ?time=sunset, etc.)
      if (timeParam === 'sunrise' || timeParam === 'dawn') {
        hours = 6.5;
      } else if (timeParam === 'day' || timeParam === 'noon') {
        hours = 12;
      } else if (timeParam === 'sunset' || timeParam === 'dusk') {
        hours = 18.5;
      } else if (timeParam === 'night' || timeParam === 'midnight') {
        hours = 23;
      }

      // Sun angle: 12:00 = facing front, 00:00 = back, 06:00 = left, 18:00 = right
      const sunAngle = ((hours - 12) / 24) * Math.PI * 2;
      const sunDir = new THREE.Vector3(
        -Math.sin(sunAngle),
        0.3 * Math.sin(sunAngle),
        Math.cos(sunAngle)
      ).normalize();

      let atmosphereColor = new THREE.Color(0x00ffc8); // Default cyan
      let sunColor = new THREE.Color(1.0, 1.0, 0.95);
      let ambientIntensity = 0.15;
      let label = 'Day';

      if (hours >= 5.5 && hours < 8.0) {
        // Sunrise: Warm golden / orange-pink glow
        atmosphereColor = new THREE.Color(0xff8c42);
        sunColor = new THREE.Color(1.0, 0.65, 0.35);
        ambientIntensity = 0.18;
        label = 'Sunrise';
      } else if (hours >= 8.0 && hours < 17.0) {
        // Day: Crisp cyan & electric blue
        atmosphereColor = new THREE.Color(0x00ffc8);
        sunColor = new THREE.Color(1.0, 1.0, 0.98);
        ambientIntensity = 0.22;
        label = 'Day';
      } else if (hours >= 17.0 && hours < 20.0) {
        // Sunset: Fiery amber & violet twilight
        atmosphereColor = new THREE.Color(0xff5533);
        sunColor = new THREE.Color(1.0, 0.45, 0.2);
        ambientIntensity = 0.16;
        label = 'Sunset';
      } else {
        // Night: Deep electric indigo with brilliant city lights
        atmosphereColor = new THREE.Color(0x3a7bd5);
        sunColor = new THREE.Color(0.2, 0.25, 0.45);
        label = 'Night';
        ambientIntensity = 0.12;
      }

      return { sunDir, atmosphereColor, sunColor, ambientIntensity, label };
    };

    const initialSettings = getTimeSettings();
    setTimePeriod(initialSettings.label);

    // Scene & Camera (proportional camera distance to keep Earth visual scale identical while expanding star field)
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
    const baseVisualSize = 370;
    camera.position.z = 4.2 * (size / baseVisualSize);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebGlSupported(false);
      return;
    }

    renderer.setSize(size, size);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    mountRef.current.innerHTML = '';
    mountRef.current.appendChild(renderer.domElement);

    // Texture loaders
    const textureLoader = new THREE.TextureLoader();
    const dayTexture = textureLoader.load(earthTextureUrl);
    dayTexture.colorSpace = THREE.SRGBColorSpace;

    const nightTexture = textureLoader.load(earthLightsUrl);
    nightTexture.colorSpace = THREE.SRGBColorSpace;

    // 1. Earth Sphere with Custom Day/Night Real-Time Shader
    const geometry = new THREE.SphereGeometry(2, 48, 48);

    const customUniforms = {
      uDayTexture: { value: dayTexture },
      uNightTexture: { value: nightTexture },
      uSunDirection: { value: initialSettings.sunDir },
      uSunColor: { value: initialSettings.sunColor },
      uAtmosphereColor: { value: initialSettings.atmosphereColor },
      uAmbientIntensity: { value: initialSettings.ambientIntensity },
    };

    const earthShaderMaterial = new THREE.ShaderMaterial({
      uniforms: customUniforms,
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;

        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D uDayTexture;
        uniform sampler2D uNightTexture;
        uniform vec3 uSunDirection;
        uniform vec3 uSunColor;
        uniform vec3 uAtmosphereColor;
        uniform float uAmbientIntensity;

        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;

        void main() {
          vec3 dayColor = texture2D(uDayTexture, vUv).rgb;
          vec3 nightColor = texture2D(uNightTexture, vUv).rgb;

          // Compute directional sun alignment
          float dProd = dot(vNormal, uSunDirection);

          // Smooth transition between daylit side and nighttime side
          float dayFactor = smoothstep(-0.2, 0.25, dProd);

          // Atmospheric sunset / sunrise scattering along the terminator line
          float terminator = smoothstep(0.3, 0.0, abs(dProd)) * (1.0 - abs(dProd));
          vec3 twilightGlow = vec3(1.0, 0.42, 0.15) * terminator * 0.6;

          // Glowing night city lights on the dark hemisphere
          vec3 nightLights = nightColor * 2.4 * (1.0 - dayFactor);

          // Day surface lighting
          vec3 daySurface = dayColor * (uSunColor * max(dProd, 0.0) + vec3(uAmbientIntensity));

          // Base blended surface
          vec3 surfaceColor = mix(nightLights + dayColor * 0.06, daySurface, dayFactor) + twilightGlow;

          // Fresnel atmospheric rim glow
          vec3 viewDirection = normalize(-vPosition);
          float fresnel = pow(1.0 - max(dot(viewDirection, vNormal), 0.0), 3.2);
          surfaceColor += uAtmosphereColor * fresnel * 0.85;

          gl_FragColor = vec4(surfaceColor, 1.0);
        }
      `,
    });

    const earth = new THREE.Mesh(geometry, earthShaderMaterial);
    scene.add(earth);

    // 2. Atmospheric Atmosphere Glow Layer
    const atmosphereGeometry = new THREE.SphereGeometry(2.09, 36, 36);
    const atmosphereMaterial = new THREE.MeshBasicMaterial({
      color: initialSettings.atmosphereColor,
      transparent: true,
      opacity: 0.14,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
    });
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    scene.add(atmosphere);

    // Helper: Generate procedural 8-point sparkling celestial star texture in memory
    const createStarTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext('2d')!;
      const cx = 64;
      const cy = 64;

      ctx.clearRect(0, 0, 128, 128);

      // 1. Soft atmospheric halo
      const radialGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 58);
      radialGlow.addColorStop(0, 'rgba(255, 255, 255, 1)');
      radialGlow.addColorStop(0.25, 'rgba(255, 255, 255, 0.75)');
      radialGlow.addColorStop(0.6, 'rgba(255, 255, 255, 0.15)');
      radialGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = radialGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, 58, 0, Math.PI * 2);
      ctx.fill();

      // 2. Primary 4-pointed star spikes (Vertical & Horizontal flares)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';

      // Vertical spike
      ctx.beginPath();
      ctx.moveTo(cx, 2);
      ctx.quadraticCurveTo(cx, cy, cx + 6, cy);
      ctx.quadraticCurveTo(cx, cy, cx, 126);
      ctx.quadraticCurveTo(cx, cy, cx - 6, cy);
      ctx.quadraticCurveTo(cx, cy, cx, 2);
      ctx.fill();

      // Horizontal spike
      ctx.beginPath();
      ctx.moveTo(2, cy);
      ctx.quadraticCurveTo(cx, cy, cx, cy + 6);
      ctx.quadraticCurveTo(cx, cy, 126, cy);
      ctx.quadraticCurveTo(cx, cy, cx, cy - 6);
      ctx.quadraticCurveTo(cx, cy, 2, cy);
      ctx.fill();

      // 3. Secondary diagonal star glints (45 degrees)
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(Math.PI / 4);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';

      ctx.beginPath();
      ctx.moveTo(0, -38);
      ctx.quadraticCurveTo(0, 0, 3.5, 0);
      ctx.quadraticCurveTo(0, 0, 0, 38);
      ctx.quadraticCurveTo(0, 0, -3.5, 0);
      ctx.quadraticCurveTo(0, 0, 0, -38);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(-38, 0);
      ctx.quadraticCurveTo(0, 0, 0, 3.5);
      ctx.quadraticCurveTo(0, 0, 38, 0);
      ctx.quadraticCurveTo(0, 0, 0, -3.5);
      ctx.quadraticCurveTo(0, 0, -38, 0);
      ctx.fill();
      ctx.restore();

      // 4. Bright white diamond core
      const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, 10);
      core.addColorStop(0, '#ffffff');
      core.addColorStop(0.6, 'rgba(255, 255, 255, 0.9)');
      core.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(cx, cy, 10, 0, Math.PI * 2);
      ctx.fill();

      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      return texture;
    };

    // 3. Floating Sparkling Celestial Star Field
    const starCount = 55;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i += 3) {
      const radius = 2.3 + Math.random() * 1.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      starPositions[i] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starPositions[i + 2] = radius * Math.cos(phi);
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));

    const starTexture = createStarTexture();
    const starMaterial = new THREE.PointsMaterial({
      color: initialSettings.atmosphereColor,
      size: 0.18,
      map: starTexture,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // Mouse Interaction
    let targetRotationX = 0;
    let targetRotationY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      const rect = mountRef.current?.getBoundingClientRect();
      if (!rect) return;
      const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const mouseY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetRotationY = mouseX * 0.2;
      targetRotationX = mouseY * 0.15;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Periodic time check interval (every 30s to update lighting seamlessly)
    const timeInterval = setInterval(() => {
      const current = getTimeSettings();
      customUniforms.uSunDirection.value = current.sunDir;
      customUniforms.uSunColor.value = current.sunColor;
      customUniforms.uAtmosphereColor.value = current.atmosphereColor;
      customUniforms.uAmbientIntensity.value = current.ambientIntensity;
      atmosphereMaterial.color = current.atmosphereColor;
      starMaterial.color = current.atmosphereColor;
      setTimePeriod(current.label);
    }, 30000);

    // Animation Loop
    let animationFrameId: number;
    let clockTime = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      clockTime += 0.03;

      const baseSpeed = 0.0035;
      if (reverse) {
        earth.rotation.y -= baseSpeed;
        stars.rotation.y -= baseSpeed * 0.4;
      } else {
        earth.rotation.y += baseSpeed;
        stars.rotation.y += baseSpeed * 0.4;
      }

      // Celestial twinkle modulation
      starMaterial.opacity = 0.75 + Math.sin(clockTime * 2.5) * 0.2;

      // Smooth mouse parallax damping
      earth.rotation.x += (targetRotationX - earth.rotation.x) * 0.05;
      earth.rotation.y += targetRotationY * 0.01;
      atmosphere.rotation.y = earth.rotation.y;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(timeInterval);
      cancelAnimationFrame(animationFrameId);
      if (mountRef.current && renderer.domElement && mountRef.current.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      earthShaderMaterial.dispose();
      atmosphereGeometry.dispose();
      atmosphereMaterial.dispose();
      starGeometry.dispose();
      starMaterial.dispose();
      starTexture.dispose();
      dayTexture.dispose();
      nightTexture.dispose();
      renderer.dispose();
    };
  }, [reverse, size, interactive]);

  if (!webGlSupported) {
    return (
      <div
        className="earth-container fallback-earth"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '50%',
          background: 'radial-gradient(circle, #1a365d 0%, #0f172a 100%)',
          border: '2px solid var(--accent-color)',
          boxShadow: '0 0 30px var(--accent-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{ fontSize: '3rem' }}>🌍</span>
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      className="earth-container"
      title={`Real-Time Earth: ${timePeriod} Mode`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    />
  );
};

export default Earth3D;
