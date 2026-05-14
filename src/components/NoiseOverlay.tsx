import { useId } from "react";

export function NoiseOverlay() {
  const filterId = useId();

  return (
    <>
      <svg
        style={{
          visibility: "hidden",
          position: "absolute",
          width: 0,
          height: 0,
        }}
        aria-hidden="true">
        <title>Noise filter definition</title>
        <filter id={filterId}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.60"
            numOctaves={3}
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </svg>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          filter: `url(#${filterId})`,
          opacity: 0.05,
          pointerEvents: "none",
          zIndex: 9999,
        }}
        aria-hidden="true"
      />
    </>
  );
}

export default NoiseOverlay;
