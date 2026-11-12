/**
 * Builds the favicon set from the hex-orbit mark (the same geometry as
 * src/components/BrandMark.tsx, chosen from the owner's Flow concept mark-b-1).
 *
 *   node scripts/generate-favicon.js
 *
 * Outputs to public/assets: favicon.svg (adaptive), favicon.ico (16/32/48 from a
 * bolder small-size glyph), apple-touch-icon.png (180, opaque), icon-192.png,
 * icon-512.png, icon-maskable-512.png, and public/site.webmanifest.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.resolve(__dirname, "../public");
const OUT = path.join(PUBLIC, "assets");
const NAVY = "#03060f";

function hex(cx, cy, r) {
  return [-90, -30, 30, 90, 150, 210]
    .map((deg) => {
      const a = (deg * Math.PI) / 180;
      return `${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`;
    })
    .join(" ");
}

function corePoints(cx, cy, r) {
  return [-90, -30, 30, 90, 150, 210].map((deg) => {
    const a = (deg * Math.PI) / 180;
    return `${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`;
  });
}

const RING = { cx: 60, cy: 60, rx: 47, ry: 11.5, rotate: -31 };

function ringPoint(t) {
  const a = t * Math.PI * 2;
  const x0 = RING.rx * Math.cos(a);
  const y0 = -RING.ry * Math.sin(a);
  const r = (RING.rotate * Math.PI) / 180;
  return {
    x: RING.cx + x0 * Math.cos(r) - y0 * Math.sin(r),
    y: RING.cy + x0 * Math.sin(r) + y0 * Math.cos(r),
  };
}

/** The full mark in a 120 x 120 box (mirrors MarkArt variant="full"). */
function markBody({ ringStroke = 3.2, haloStroke = 7 } = {}) {
  const p = corePoints(60, 60, 20);
  const sat = ringPoint(0.13);
  const t = `rotate(${RING.rotate} ${RING.cx} ${RING.cy})`;
  return [
    `<polygon points="${hex(60, 60, 39)}" fill="#1c49d4"/>`,
    `<polygon points="${hex(60, 60, 35)}" fill="#2c62ef"/>`,
    `<polygon points="${hex(60, 60, 26)}" fill="${NAVY}"/>`,
    `<polygon points="${p[0]} ${p[1]} ${p[4]} ${p[5]}" fill="#4a80f8"/>`,
    `<polygon points="${p[1]} ${p[2]} ${p[3]} ${p[4]}" fill="#2563eb"/>`,
    `<ellipse cx="60" cy="60" rx="${RING.rx}" ry="${RING.ry}" transform="${t}" fill="none" stroke="${NAVY}" stroke-width="${haloStroke}"/>`,
    `<ellipse cx="60" cy="60" rx="${RING.rx}" ry="${RING.ry}" transform="${t}" fill="none" stroke="#7cc4f5" stroke-width="${ringStroke}"/>`,
    `<circle cx="${sat.x.toFixed(2)}" cy="${sat.y.toFixed(2)}" r="7.2" fill="${NAVY}"/>`,
    `<circle cx="${sat.x.toFixed(2)}" cy="${sat.y.toFixed(2)}" r="4.6" fill="#93d2fb"/>`,
  ].join("");
}

/** Bolder glyph for 16 to 48 px: thicker band and ring, no navy gap detail. */
function smallBody() {
  const sat = ringPoint(0.13);
  const t = `rotate(${RING.rotate} ${RING.cx} ${RING.cy})`;
  return [
    `<polygon points="${hex(60, 60, 44)}" fill="#2c62ef"/>`,
    `<polygon points="${hex(60, 60, 26)}" fill="${NAVY}"/>`,
    `<polygon points="${hex(60, 60, 17)}" fill="#4a80f8"/>`,
    `<ellipse cx="60" cy="60" rx="54" ry="13" transform="${t}" fill="none" stroke="${NAVY}" stroke-width="12"/>`,
    `<ellipse cx="60" cy="60" rx="54" ry="13" transform="${t}" fill="none" stroke="#93d2fb" stroke-width="7"/>`,
    `<circle cx="${(sat.x + 4).toFixed(2)}" cy="${(sat.y - 2).toFixed(2)}" r="9" fill="#eaf2ff"/>`,
  ].join("");
}

/**
 * @param {string} body
 * @param {{ bg?: string, pad?: number }} [options]
 */
const svg = (body, { bg = "", pad = 0 } = {}) => {
  const box = 120 + pad * 2;
  const back = bg ? `<rect width="${box}" height="${box}" fill="${bg}"/>` : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-pad} ${-pad} ${box} ${box}">${back}${body}</svg>`;
};

async function png(svgString, size, file) {
  await sharp(Buffer.from(svgString), { density: 384 })
    .resize(size, size)
    .png({ compressionLevel: 9 })
    .toFile(path.join(OUT, file));
}

/** Minimal ICO writer: PNG-compressed entries (supported by every current browser). */
async function ico(svgString, sizes, file) {
  const images = await Promise.all(
    sizes.map((s) => sharp(Buffer.from(svgString), { density: 384 }).resize(s, s).png().toBuffer()),
  );
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  const dir = Buffer.alloc(16 * images.length);
  let offset = 6 + dir.length;
  images.forEach((img, i) => {
    const s = sizes[i];
    dir.writeUInt8(s >= 256 ? 0 : s, i * 16);
    dir.writeUInt8(s >= 256 ? 0 : s, i * 16 + 1);
    dir.writeUInt8(0, i * 16 + 2);
    dir.writeUInt8(0, i * 16 + 3);
    dir.writeUInt16LE(1, i * 16 + 4);
    dir.writeUInt16LE(32, i * 16 + 6);
    dir.writeUInt32LE(img.length, i * 16 + 8);
    dir.writeUInt32LE(offset, i * 16 + 12);
    offset += img.length;
  });
  fs.writeFileSync(path.join(OUT, file), Buffer.concat([header, dir, ...images]));
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });

  // Adaptive SVG: the full mark normally, the bold glyph where the tab icon is tiny.
  fs.writeFileSync(path.join(OUT, "favicon.svg"), `${svg(markBody(), { pad: 2 })}\n`);

  await ico(svg(smallBody(), { pad: 2 }), [16, 32, 48], "favicon.ico");
  await png(svg(smallBody(), { pad: 2 }), 32, "favicon-32.png");
  await png(svg(markBody(), { bg: NAVY, pad: 14 }), 180, "apple-touch-icon.png");
  await png(svg(markBody(), { bg: NAVY, pad: 8 }), 192, "icon-192.png");
  await png(svg(markBody(), { bg: NAVY, pad: 8 }), 512, "icon-512.png");
  // Maskable: the mark inside the central 80% safe zone.
  await png(svg(markBody(), { bg: NAVY, pad: 30 }), 512, "icon-maskable-512.png");

  for (const stale of ["favicon.png"]) {
    const f = path.join(OUT, stale);
    if (fs.existsSync(f)) fs.rmSync(f);
  }

  const manifest = {
    name: "Jorge Bucio | Creative systems portfolio",
    short_name: "ZynzTehr",
    description: "Full-stack and creative systems work by Jorge Bucio (@ZynzTehr).",
    start_url: "/",
    display: "standalone",
    background_color: NAVY,
    theme_color: NAVY,
    icons: [
      { src: "/assets/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/assets/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/assets/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
  fs.writeFileSync(path.join(PUBLIC, "site.webmanifest"), `${JSON.stringify(manifest, null, 2)}\n`);

  for (const f of fs.readdirSync(OUT)) {
    console.log(`${f.padEnd(26)} ${fs.statSync(path.join(OUT, f)).size} bytes`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
