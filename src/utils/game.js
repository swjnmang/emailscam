// Kleine Hilfsfunktionen für das Spiel-Scoring und Entscheidungen
export function isDecisionCorrect(emailType, decision) {
  if (decision === 'keep' && emailType === 'legit') return true;
  if (decision === 'spam' && emailType === 'spam') return true;
  return false;
}

export function computeScore(currentScore, isCorrect) {
  return isCorrect ? currentScore + 100 : Math.max(0, currentScore - 50);
}
