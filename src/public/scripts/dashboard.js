// Handle Add Member
const memberForm = document.getElementById('memberForm');
const memberList = document.getElementById('memberList');
const search = document.getElementById('search');

memberList.addEventListener('click', (e) => {
    if (e.target.classList.contains('member-name')) {
        const row = e.target.closest('tr');
        const detailsRow = row.nextElementSibling;

        if (detailsRow && detailsRow.classList.contains('member-details')) {
            detailsRow.classList.toggle('hidden');
        }
    }
});

search.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    Array.from(memberList.querySelectorAll('.member-row')).forEach(row => {
        row.style.display = row.innerText.toLowerCase().includes(term) ? '' : 'none';
        const detailsRow = row.nextElementSibling;
        if (detailsRow && detailsRow.classList.contains('member-details')) {
            detailsRow.classList.add('hidden'); 
        }
    });
});


const flagUser = async (ID) => {
    
    const response = await sendFetchRequest(`/leaderboard/addflaguser` , 'PATCH', { userid: ID});
    
    if(response.success){
        const flagEle = document.getElementById(ID).querySelector('td:nth-child(3)') ; 
        flagEle.innerText = parseInt(flagEle.innerText) +1  ;
    }
    return response;

};


const removeUser = async (ID) => {
    const data = await sendFetchRequest(`/leaderboard/deleteUser/${ID}`,'DELETE');
    console.log("Removed");
    console.log(data);
    if(data.success){
      document.getElementById(ID).remove();
    }
  };
  
