import calculateScore from "./calculate";
import backfetcher from "./backfetcher";

const getStoreAbleObject = async (name: string, post: string, datas: any) => {
  let totalScore: number = 0;
  const ProgressMatrixes: any = {};

  for (const { platform, username } of datas) {
    let aggregatedSolveCounts: any = {};
    let DailyUserActivity: any = {};
    let platformScore: number = 0;
    DailyUserActivity[new Date().toISOString().split("T")[0]] =
      aggregatedSolveCounts = await backfetcher(
        `/scrapper/${platform}/${username}`
      );

    platformScore = calculateScore(platform, aggregatedSolveCounts || {});
    ProgressMatrixes[platform] = {
      name: platform,
      username,
      aggregatedSolveCounts,
      DailyUserActivity,
      score: platformScore,
    };
    totalScore += platformScore;
  }

  return {
    name,
    post,
    flag: 0,
    ProgressMatrixes,
    score: totalScore,
  };
};

export default getStoreAbleObject;
