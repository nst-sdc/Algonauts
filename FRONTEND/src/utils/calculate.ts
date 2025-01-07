import codeforcesCalculation from "./calculationFormula/codeforces.calcuation";
import codechefCalculation from "./calculationFormula/codechef.calcuation";
import leetcodeCalculation from "./calculationFormula/leetcode.calcuation";
export default (platform: string, data: any) => {
  if (platform == "codeforces") {
    return codeforcesCalculation(data);
  } else if (platform == "codechef") {
    return codechefCalculation(data);
  } else if (platform == "leetcode") {
    return leetcodeCalculation(data);
  } else {
    return data?.total || 0;
  }
};
