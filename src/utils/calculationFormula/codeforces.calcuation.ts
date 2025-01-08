const calculation: (aggregatedSolveCounts: any) => number = (aggregatedSolveCounts: any) => {
    
    const safeGet = (key: string): number => aggregatedSolveCounts?.[key] || 0;
  
    // const onePoints: number =
    //   safeGet('800') + safeGet('900') + safeGet('1000') + safeGet('1100');
  
    
    // const twoPoints: number =
    //   safeGet('1200') + safeGet('1300');

    // const threePoints: number =
    //   safeGet('1400') + safeGet('1500');
  
    // const fourPoints: number =
    //   safeGet('1600') + safeGet('1700') + safeGet('1800') + safeGet('1900');
  
    // const total: number = safeGet('1800') ;
  
    // let fivePoints: number = total - (onePoints + twoPoints + threePoints + fourPoints);
    // if(fivePoints < 0 ) fivePoints = 0 ;
    // return onePoints + twoPoints * 2 + threePoints * 3 + fourPoints * 4 + fivePoints * 5;
    return safeGet('total')
  };
  
  export default calculation;
  