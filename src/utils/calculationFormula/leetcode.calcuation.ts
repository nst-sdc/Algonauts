const calculation: (aggregatedSolveCounts: any) => number = (aggregatedSolveCounts) => {
  console.log("leetcode: " , aggregatedSolveCounts);
  
  const safeGet = (key: string): number => aggregatedSolveCounts?.[key] || 0;

  const easyCount = safeGet('easy');
  const mediumCount = safeGet('medium');
  const hardCount = safeGet('hard');
  console.log("Leetcode calculation: ",easyCount , mediumCount , hardCount);
  
  return easyCount + mediumCount * 2 + hardCount * 3;
};

export default calculation;