type CoreWebVitals = {
  cls: number;
  fcpMs: number;
  lcpMs: number;
};

type MediaSize = {
  height: number;
  width: number;
};

type LayoutShiftInput = {
  finalHeight: number;
  reservedHeight: number;
  viewportHeight: number;
};

export const coreWebVitalsThresholds = {
  cls: 0.1,
  fcpMs: 1500,
  lcpMs: 2500
} as const;

export const meetsCoreWebVitals = ({cls, fcpMs, lcpMs}: CoreWebVitals) => {
  return (
    cls < coreWebVitalsThresholds.cls &&
    fcpMs <= coreWebVitalsThresholds.fcpMs &&
    lcpMs <= coreWebVitalsThresholds.lcpMs
  );
};

export const reserveMediaSpace = ({height, width}: MediaSize) => ({
  aspectRatio: `${width} / ${height}`,
  height,
  width
});

export const estimateLayoutShift = ({
  finalHeight,
  reservedHeight,
  viewportHeight
}: LayoutShiftInput) => {
  const unexpectedShift = Math.max(0, finalHeight - reservedHeight);

  return unexpectedShift / viewportHeight;
};
