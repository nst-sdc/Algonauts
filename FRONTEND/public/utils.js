const api_url = 'http://localhost:3000/api';
const sendFetchRequest = async (url , type , payload) => {
    if(!url){
        console.error("URL was not provided!");
        return {error : "URL must be passed"}
    }
    try {
        url = api_url + url;
        const response = await fetch(url, {
            method: type || 'GET', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: payload ? JSON.stringify(payload) : undefined,
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error during PATCH request:', error);
        return { error: error.message, url };
    }
};

const getFormatedDate = (date) => date.toISOString().split('T')[0] ;

const platformNames = ['codeforces', 'leetcode' , 'codechef' , 'cses'] ;