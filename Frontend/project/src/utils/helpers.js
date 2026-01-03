export function calculateScore({ email, phone, message }) {
  let score = 0;

  if (email) score += 30;           // Presence of email gives weight
  if (phone) score += 30;           // Presence of phone gives weight
  if (message && message.length > 20) score += 20; // Longer messages = more engagement

  // Base engagement score
  score += 20;

  // Maximum score capped at 100
  return Math.min(score, 100);
}

// Convert a numerical score into a category for quick understanding.
export function getCategory(score) {
  if (score >= 80) return "Professional Lead";
  if (score >= 50) return "Potential Contact";
  return "Casual";
}

export function getPriority(score) {
  if (score >= 80) return "High";
  if (score >= 50) return "Medium";
  return "Low";
}