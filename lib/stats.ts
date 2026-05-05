export interface SignificanceResult {
  pValue: number;
  zScore: number;
  isSignificant: boolean;
  confidenceLevel: 99 | 95 | 90 | null;
  relativeUplift: number | null;
  insufficientData: boolean;
}

// Abramowitz & Stegun approximation of the standard normal CDF (error < 7.5e-8)
function normalCDF(z: number): number {
  const abs = Math.abs(z);
  const t = 1 / (1 + 0.2316419 * abs);
  const d = Math.exp((-abs * abs) / 2) / Math.sqrt(2 * Math.PI);
  const poly =
    t *
    (0.31938153 +
      t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
  const p = 1 - d * poly;
  return z >= 0 ? p : 1 - p;
}

// Two-proportion z-test (standard A/B test significance test)
// c1/n1 = control conversions/impressions, c2/n2 = treatment
export function calcSignificance(
  c1: number, n1: number,
  c2: number, n2: number,
): SignificanceResult {
  const MIN_SAMPLE = 30;

  if (n1 < MIN_SAMPLE || n2 < MIN_SAMPLE) {
    return { pValue: 1, zScore: 0, isSignificant: false, confidenceLevel: null, relativeUplift: null, insufficientData: true };
  }

  const p1 = c1 / n1;
  const p2 = c2 / n2;
  const pooled = (c1 + c2) / (n1 + n2);
  const se = Math.sqrt(pooled * (1 - pooled) * (1 / n1 + 1 / n2));

  if (se === 0) {
    return { pValue: 1, zScore: 0, isSignificant: false, confidenceLevel: null, relativeUplift: null, insufficientData: false };
  }

  const zScore = (p2 - p1) / se;
  const pValue = 2 * (1 - normalCDF(Math.abs(zScore)));

  const confidenceLevel = pValue < 0.01 ? 99 : pValue < 0.05 ? 95 : pValue < 0.1 ? 90 : null;
  const relativeUplift = p1 > 0 ? ((p2 - p1) / p1) * 100 : null;

  return {
    pValue,
    zScore,
    isSignificant: pValue < 0.05,
    confidenceLevel,
    relativeUplift,
    insufficientData: false,
  };
}
