// Handle Tag Selection
const tagButtons = document.querySelectorAll('.tag-btn');
const selectedTags = new Set();

tagButtons.forEach(button => {
    button.addEventListener('click', () => {
        if (selectedTags.has(button.dataset.tag)) {
            selectedTags.delete(button.dataset.tag);
            button.classList.remove('selected');
        } else {
            selectedTags.add(button.dataset.tag);
            button.classList.add('selected');
        }
    });
});

document.getElementById('searchQuestion').addEventListener('input', function() {
    const searchValue = this.value.toLowerCase();
    const rows = document.querySelectorAll('#questionList tr');
    
    rows.forEach(row => {
        const questionName = row.cells[0].innerText.toLowerCase();
        if (questionName.includes(searchValue)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
});
