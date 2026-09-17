import * as THREE from "three";

/** A rounded-rectangle THREE.Shape centred on the origin. */
export function roundedRectShape(width: number, height: number, radius: number): THREE.Shape {
  const shape = new THREE.Shape();
  const w = width / 2;
  const h = height / 2;
  const r = Math.min(radius, w, h);

  shape.moveTo(-w + r, -h);
  shape.lineTo(w - r, -h);
  shape.quadraticCurveTo(w, -h, w, -h + r);
  shape.lineTo(w, h - r);
  shape.quadraticCurveTo(w, h, w - r, h);
  shape.lineTo(-w + r, h);
  shape.quadraticCurveTo(-w, h, -w, h - r);
  shape.lineTo(-w, -h + r);
  shape.quadraticCurveTo(-w, -h, -w + r, -h);

  return shape;
}

/** A rounded-rectangle THREE.Path (for use as a Shape hole), offset from centre. */
export function roundedRectHole(
  width: number,
  height: number,
  radius: number,
  cx = 0,
  cy = 0,
): THREE.Path {
  const path = new THREE.Path();
  const w = width / 2;
  const h = height / 2;
  const r = Math.min(radius, w, h);

  path.moveTo(cx - w + r, cy - h);
  path.lineTo(cx + w - r, cy - h);
  path.quadraticCurveTo(cx + w, cy - h, cx + w, cy - h + r);
  path.lineTo(cx + w, cy + h - r);
  path.quadraticCurveTo(cx + w, cy + h, cx + w - r, cy + h);
  path.lineTo(cx - w + r, cy + h);
  path.quadraticCurveTo(cx - w, cy + h, cx - w, cy + h - r);
  path.lineTo(cx - w, cy - h + r);
  path.quadraticCurveTo(cx - w, cy - h, cx - w + r, cy - h);

  return path;
}

/** Builds the multi-chamber UPVC profile cross-section used by the hero sample block. */
export function buildProfileShape(): THREE.Shape {
  const shape = roundedRectShape(2.2, 1.15, 0.09);
  shape.holes.push(
    roundedRectHole(0.62, 0.72, 0.07, -0.66, 0.0),
    roundedRectHole(0.5, 0.72, 0.06, 0.02, 0.0),
    roundedRectHole(0.34, 0.66, 0.05, 0.66, 0.02),
  );
  return shape;
}

/** A thin picture-frame "ring" shape used for the aluminium spacer bar. */
export function buildSpacerRingShape(width: number, height: number, thickness: number): THREE.Shape {
  const shape = roundedRectShape(width, height, 0.05);
  shape.holes.push(roundedRectHole(width - thickness * 2, height - thickness * 2, 0.03));
  return shape;
}
