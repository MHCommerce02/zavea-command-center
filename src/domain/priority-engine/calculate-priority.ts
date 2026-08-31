// Ported unchanged from the Phase 1 prototype's computePriority().
// Weights match the approved Phase 2 schema doc and the seeded data.

export interface PriorityFactors {
  urgency: number;
  businessImpact: number;
  confidence: number;
  dataQuality: number;
}

const WEIGHTS = {
  urgency: 0.35,
  businessImpact: 0.3,
  confidence: 0.2,
  dataQuality: 0.15,
} as const;

export function calculatePriority(factors: PriorityFactors): number {
  return Math.round(
    factors.urgency * WEIGHTS.urgency +
      factors.businessImpact * WEIGHTS.businessImpact +
      factors.confidence * WEIGHTS.confidence +
      factors.dataQuality * WEIGHTS.dataQuality
  );
}
