/**
 * Analyzes the problem text for contextual keywords
 * Returns detected keywords to influence factor scoring
 */
function analyzeContext(problem) {
  const problemLower = problem.toLowerCase();
  
  const keywords = {
    family: problemLower.includes("family") || problemLower.includes("children") || problemLower.includes("spouse"),
    business: problemLower.includes("business") || problemLower.includes("startup") || problemLower.includes("company"),
    interest: problemLower.includes("interest") || problemLower.includes("passion") || problemLower.includes("love") || problemLower.includes("enjoy"),
    risk: problemLower.includes("risk") || problemLower.includes("danger") || problemLower.includes("uncertain"),
    growth: problemLower.includes("grow") || problemLower.includes("advance") || problemLower.includes("progress") || problemLower.includes("develop"),
    stability: problemLower.includes("stable") || problemLower.includes("secure") || problemLower.includes("safety") || problemLower.includes("comfort")
  };
  
  return keywords;
}

/**
 * Generates factor scores (0-100) based on decision type, risk, stress, and context
 */
function generateFactorScores(decision_type, risk, stress, keywords) {
  let factors = {
    Growth: 50,
    Salary: 50,
    Balance: 50,
    Passion: 50
  };

  // Base adjustments from risk and stress
  const riskFactor = (6 - risk) * 10; // Higher risk = lower growth score
  const stressFactor = (6 - stress) * 8; // Higher stress = lower balance
  
  // Decision type specific logic
  switch(decision_type) {
    case "Career":
      factors.Growth = 70 + riskFactor - 10;
      factors.Salary = 65 + (risk > 3 ? -10 : 10);
      factors.Balance = 50 - stressFactor;
      factors.Passion = keywords.interest ? 70 : 55;
      break;
    
    case "Finance":
      factors.Salary = 75 + (risk > 3 ? 10 : 0);
      factors.Growth = 60 + (risk < 3 ? 15 : -5);
      factors.Balance = 55 - (stress > 3 ? 15 : 0);
      factors.Passion = keywords.interest ? 65 : 45;
      break;
    
    case "Education":
      factors.Growth = 80 + (risk < 3 ? 10 : -5);
      factors.Passion = keywords.interest ? 85 : 60;
      factors.Salary = 55 + (risk > 2 ? 10 : 0);
      factors.Balance = 50 - stressFactor;
      break;
    
    case "Personal Life":
      factors.Balance = 75 - (stress > 3 ? 20 : 0);
      factors.Passion = keywords.interest ? 75 : 65;
      factors.Growth = 55 + (keywords.growth ? 15 : 0);
      factors.Salary = 40;
      break;
    
    case "Daily Choices":
      factors.Balance = 70 - stressFactor;
      factors.Passion = keywords.interest ? 75 : 60;
      factors.Growth = 50;
      factors.Salary = 45;
      break;
    
    default:
      break;
  }

  // Context-based adjustments
  if (keywords.family) {
    factors.Balance += 10;
    factors.Salary += 5;
    factors.Growth -= 5;
  }

  if (keywords.business) {
    factors.Growth += 15;
    factors.Salary += 10;
    factors.Balance -= 10;
  }

  if (keywords.stability) {
    factors.Balance += 15;
    factors.Growth -= 5;
    factors.Salary += 5;
  }

  if (keywords.risk) {
    factors.Growth -= 10;
    factors.Balance -= 5;
  }

  // Normalize scores to 0-100
  Object.keys(factors).forEach(key => {
    factors[key] = Math.max(0, Math.min(100, factors[key]));
  });

  return factors;
}

/**
 * Generates AI-like explanation based on decision context and factor dominance
 */
function generateExplanation(decision_type, risk, stress, keywords, factors) {
  const highestFactor = Object.keys(factors).reduce((a, b) => 
    factors[a] > factors[b] ? a : b
  );

  let explanation = "";
  
  // Build explanation based on decision type and context
  if (decision_type === "Career") {
    if (keywords.family) {
      explanation = `This career option balances your family needs with ${highestFactor.toLowerCase()} potential. `;
    } else if (keywords.growth) {
      explanation = `This path prioritizes your professional ${highestFactor.toLowerCase()} with calculated risk management. `;
    } else {
      explanation = `This option aligns with your career goals while emphasizing ${highestFactor.toLowerCase()}. `;
    }
  } else if (decision_type === "Finance") {
    if (risk > 3) {
      explanation = `This investment approach seeks growth while managing risk exposure. Your ${highestFactor.toLowerCase()} potential is significant. `;
    } else {
      explanation = `This conservative financial strategy prioritizes ${highestFactor.toLowerCase()} and security. `;
    }
  } else if (decision_type === "Education") {
    if (keywords.interest) {
      explanation = `This educational path aligns with your interests and maximizes ${highestFactor.toLowerCase()} opportunities. `;
    } else {
      explanation = `This learning opportunity offers strong ${highestFactor.toLowerCase()} potential for your future. `;
    }
  } else if (decision_type === "Personal Life") {
    if (stress > 3) {
      explanation = `This option prioritizes your well-being and ${highestFactor.toLowerCase()}, reducing stress factors. `;
    } else {
      explanation = `This choice supports your personal values while enhancing ${highestFactor.toLowerCase()} satisfaction. `;
    }
  } else if (decision_type === "Daily Choices") {
    explanation = `This decision optimizes your daily experience with focus on ${highestFactor.toLowerCase()} and immediate satisfaction. `;
  }

  // Add risk/stress consideration
  if (stress > 4) {
    explanation += "However, consider managing your stress levels for long-term success.";
  } else if (risk > 4) {
    explanation += "Ensure you have contingency plans for uncertain outcomes.";
  } else {
    explanation += "This is a well-balanced decision given your inputs.";
  }

  return explanation;
}

module.exports = {
  analyzeContext,
  generateFactorScores,
  generateExplanation
};
