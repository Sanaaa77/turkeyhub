export type RecommendationCategory = "Overall" | "Budget" | "Career" | "Scholarship" | "Language" | "City";

export interface DecisionInsight {
  type: "positive" | "negative" | "neutral";
  text: string;
}

export interface RiskFactor {
  label: string;
  level: "low" | "medium" | "high";
  description: string;
}

export interface SmartRecommendation {
  category: RecommendationCategory;
  universityId: string;
  reasoning: string;
  confidenceScore: number;
  risks: RiskFactor[];
  pros: string[];
  cons: string[];
}

export interface BudgetBreakdown {
  label: string;
  percentage: number;
  amount: number;
  advice: string;
}

export interface MilestonePrediction {
  label: string;
  estimatedDate: string;
  certainty: number; // 0-100
}
