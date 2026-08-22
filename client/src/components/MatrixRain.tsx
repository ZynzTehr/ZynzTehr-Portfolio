import React, { useRef, useEffect } from 'react';

interface MatrixRainProps {
  color?: string;
  fontSize?: number;
  speed?: number;
  className?: string;
}

const MatrixRain: React.FC<MatrixRainProps> = ({
  color = '#00ff41', // Classic Matrix Movie Phosphor Green
  fontSize = 12,
  speed = 33, // ~30-40fps for smooth movie cascade
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let lastTime = 0;

    // Set canvas dimensions
    const width = (canvas.width = canvas.parentElement?.clientWidth || 180);
    const height = (canvas.height = canvas.parentElement?.clientHeight || 120);

    // Authentic Matrix characters: Japanese Katakana, digits, math & binary
    const matrixChars =
      'ｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ0123456789:・."=*+-<>¦｜01';

    const columns = Math.floor(width / fontSize);
    
    // Each column has: y position, fall speed, stream length
    const drops: Array<{ y: number; speed: number; chars: string[] }> = Array.from(
      { length: columns },
      () => ({
        y: Math.floor(Math.random() * -30),
        speed: 0.8 + Math.random() * 0.6,
        chars: Array.from({ length: 30 }, () =>
          matrixChars.charAt(Math.floor(Math.random() * matrixChars.length))
        ),
      })
    );

    const render = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(render);

      if (currentTime - lastTime < speed) return;
      lastTime = currentTime;

      // Authentic trailing fade on pitch black background
      ctx.fillStyle = 'rgba(0, 5, 2, 0.16)';
      ctx.fillRect(0, 0, width, height);

      ctx.font = `bold ${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const drop = drops[i];
        const x = i * fontSize;
        const y = Math.floor(drop.y) * fontSize;

        // Mutate a random character in the stream (movie glyph-morphing effect)
        if (Math.random() < 0.08) {
          drop.chars[Math.floor(Math.random() * drop.chars.length)] =
            matrixChars.charAt(Math.floor(Math.random() * matrixChars.length));
        }

        const headChar = drop.chars[0] || '1';

        // 1. Draw Bright Glowing White/Green Head Character (The Leader)
        ctx.shadowColor = '#00ff41';
        ctx.shadowBlur = 6;
        ctx.fillStyle = '#e8ffea';
        ctx.fillText(headChar, x, y);

        // 2. Draw Vivid Matrix Green Trailing Character
        ctx.shadowBlur = 0;
        ctx.fillStyle = color;
        const trailChar1 = drop.chars[1] || '0';
        ctx.fillText(trailChar1, x, y - fontSize);

        // 3. Draw Deeper Matrix Green Secondary Trail
        ctx.fillStyle = '#008f11';
        const trailChar2 = drop.chars[2] || 'X';
        ctx.fillText(trailChar2, x, y - fontSize * 2);

        // Reset column when past screen with randomized delay
        if (y > height + 40 && Math.random() > 0.96) {
          drop.y = -Math.floor(Math.random() * 15);
        }

        drop.y += drop.speed;
      }
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [color, fontSize, speed]);

  return (
    <canvas
      ref={canvasRef}
      className={`tile-media-element matrix-canvas ${className}`}
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
        background: '#000000',
      }}
    />
  );
};

export default MatrixRain;
