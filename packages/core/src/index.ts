/** Score 0–100 for one spot, one species, one hour. */
export interface ForecastScore {
  spotId: string;
  species: string;
  time: string; // ISO 8601, UTC
  score: number;
  allowed: boolean;
  reasons: string[]; // human-readable explanation of the score and the rules
}
