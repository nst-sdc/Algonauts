const calcuation :(arg: any )=>number = (aggregatedSolveCounts : any )=>
{   
    if(aggregatedSolveCounts?.total == undefined){

        const safeGet = (key: string): number => aggregatedSolveCounts?.key || 0;
        console.log("went here");
        
        const easyCount = safeGet('easy');
        const mediumCount = safeGet('medium');
        const hardCount = safeGet('hard');    
        const total:number = easyCount + mediumCount + hardCount;
        return total || 0;
    }
    return parseInt(aggregatedSolveCounts?.total)
}
    
export default calcuation;