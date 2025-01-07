const getData = async () => {
    const url = `http://localhost:3000/api/leaderboard/getuserlist`;
    try {
        const response = await fetch(url);

        if (!response.ok) {
            // Handle HTTP errors
            throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        return { error, url };
    }
}


const updateData = async (data:any)=>{
    try {
        const response = await fetch('http://localhost:3000/api/leaderboard/updateActivity', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();
        console.log('Response:', responseData);
    } catch (error) {
        console.error('Error sending PATCH request:', error);
    }
}



const getPlatformData = async (platform :string , username: string ) => {
    const url = `http://localhost:3000/api/scrapper/${platform}/${username}`;
    console.log(url);
    
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        return { error, url };
    }
}

const getCurrentDate = ()=>{
    const currentDate = new Date();

    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(currentDate.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
}
const updateAll = async ()=>{
    const allusers = await getData();
    if(!allusers) return;
    allusers.forEach(async (alluser:any) =>{
        for(let key in alluser.ProgressMatrixes){
            const info = await getPlatformData(alluser.ProgressMatrixes?.[key]?.name , alluser.ProgressMatrixes?.[key]?.username) ;
            for(let pKey in info){
                await updateData({
                            userid:alluser?._id,
                            platformname:alluser.ProgressMatrixes?.[key]?.name,
                            questionType : pKey,
                            solved : info[pKey],
                            date : getCurrentDate()  
                    })
            }
        }
       
    })
    
}

export default updateAll ;