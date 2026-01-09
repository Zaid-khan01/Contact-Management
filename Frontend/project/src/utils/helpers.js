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

export function formatPhoneNumber(phone) {
  if (!phone) return "No Phone";
  
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format based on length
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  } else if (cleaned.length === 11) {
    return `+${cleaned[0]} (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  } else if (cleaned.length === 12) {
    return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 6)}-${cleaned.slice(6, 9)}-${cleaned.slice(9)}`;
  }
  
  // Default: just return cleaned version
  return cleaned;
}