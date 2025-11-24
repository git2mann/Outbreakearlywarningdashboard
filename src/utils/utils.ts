// Utility to convert risk score (probability) to risk level
export const getPredictionRiskLevel = (probOutbreak: number): 'High' | 'Medium' | 'Low' => {
  if (probOutbreak >= 0.20) return 'High';
  if (probOutbreak >= 0.05) return 'Medium';
  return 'Low';
};
