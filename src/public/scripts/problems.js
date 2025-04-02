document.addEventListener('DOMContentLoaded', function() {
    // Format existing difficulty cells with appropriate colors
    formatDifficultyCells();
    
    // Format existing tags
    formatTagCells();
    
    // Search functionality
    setupSearch();
    
    // Form submission handling
    setupFormSubmission();
    
    // Edit and remove button handlers
    setupActionButtons();
});

// Apply color classes to difficulty cells
function formatDifficultyCells() {
    const difficultyCells = document.querySelectorAll('#questionList tr td:nth-child(2)');
    
    difficultyCells.forEach(cell => {
        const difficulty = cell.textContent.trim().toLowerCase();
        cell.classList.add(`difficulty-${difficulty}`);
    });
}

// Format tag cells to use styled tag spans
function formatTagCells() {
    const tagCells = document.querySelectorAll('#questionList tr td:nth-child(3)');
    
    tagCells.forEach(cell => {
        const tagText = cell.textContent.trim();
        const tags = tagText.split('#').filter(tag => tag.trim() !== '');
        
        // Clear the cell
        cell.innerHTML = '';
        
        // Add styled tags
        tags.forEach(tag => {
            const tagSpan = document.createElement('span');
            tagSpan.className = 'tag';
            tagSpan.textContent = tag.trim();
            cell.appendChild(tagSpan);
        });
    });
}

// Search functionality
function setupSearch() {
    const searchInput = document.getElementById('searchQuestion');
    
    searchInput.addEventListener('input', function() {
        const searchValue = this.value.toLowerCase();
        const rows = document.querySelectorAll('#questionList tr');
        
        rows.forEach(row => {
            const questionName = row.cells[0].textContent.toLowerCase();
            const tags = row.cells[2].textContent.toLowerCase();
            const difficulty = row.cells[1].textContent.toLowerCase();
            
            // Search in name, tags, and difficulty
            if (questionName.includes(searchValue) || 
                tags.includes(searchValue) || 
                difficulty.includes(searchValue)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });
}

// Form submission handling with validation
function setupFormSubmission() {
    const form = document.getElementById('questionForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic validation
            const questionName = document.getElementById('questionName').value;
            const problemIndex = document.getElementById('problemIndex').value;
            const contestId = document.getElementById('contestId').value;
            const tags = document.getElementById('tagsContainer').value;
            
            if (!questionName || !problemIndex || !contestId || !tags) {
                showNotification('Please fill in all required fields', 'error');
                return;
            }
            
            // If validation passes, submit the form
            this.submit();
        });
    }
}

// Action buttons handling
function setupActionButtons() {
    // Edit buttons
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            const questionName = row.cells[0].textContent;
            
            // Populate the form with the row data
            document.getElementById('questionName').value = questionName;
            
            // Here you would need to add more code to get the actual problem index and contest ID
            // since they're not directly visible in the table
            
            const difficultyText = row.cells[1].textContent.trim().toLowerCase();
            const difficultySelect = document.getElementById('questionDifficulty');
            
            // Select the right option in difficulty dropdown
            for(let i = 0; i < difficultySelect.options.length; i++) {
                if(difficultySelect.options[i].value === difficultyText) {
                    difficultySelect.selectedIndex = i;
                    break;
                }
            }
            
            // Extract tags from the spans
            const tagSpans = row.cells[2].querySelectorAll('.tag');
            const tagsArray = Array.from(tagSpans).map(span => span.textContent.trim());
            document.getElementById('tagsContainer').value = tagsArray.join(',');
            
            // Set date
            document.getElementById('dateContainer').value = row.cells[3].textContent.trim();
            
            // Scroll to the form and focus the first field
            document.querySelector('.left-panel').scrollIntoView({ behavior: 'smooth' });
            document.getElementById('questionName').focus();
            
            // Potentially change the submit button to "Update Question"
            const submitButton = form.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.textContent = 'Update Question';
            }
        });
    });
    
    // Remove buttons
    document.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            const questionName = row.cells[0].textContent.trim();
            
            if (confirm(`Are you sure you want to remove "${questionName}"?`)) {
                // Here you would make an AJAX call to delete the item
                // For demo, let's just remove the row from DOM
                row.remove();
                
                showNotification('Question removed successfully', 'success');
            }
        });
    });
}

// Notification system
function showNotification(message, type = 'info') {
    // Create notification element if it doesn't exist
    let notification = document.getElementById('notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification';
        document.body.appendChild(notification);
        
        // Style the notification
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.padding = '12px 20px';
        notification.style.borderRadius = '6px';
        notification.style.fontWeight = '500';
        notification.style.zIndex = '9999';
        notification.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.1)';
        notification.style.transition = 'all 0.3s ease';
    }
    
    // Set type-specific styling
    if (type === 'error') {
        notification.style.backgroundColor = '#fee2e2';
        notification.style.color = '#dc2626';
        notification.style.borderLeft = '4px solid #dc2626';
    } else if (type === 'success') {
        notification.style.backgroundColor = '#dcfce7';
        notification.style.color = '#16a34a';
        notification.style.borderLeft = '4px solid #16a34a';
    } else {
        notification.style.backgroundColor = '#e0f2fe';
        notification.style.color = '#0284c7';
        notification.style.borderLeft = '4px solid #0284c7';
    }
    
    // Set message
    notification.textContent = message;
    
    // Show notification
    notification.style.opacity = '1';
    
    // Hide after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Date input formatter and validator
const dateInput = document.getElementById('dateContainer');
if (dateInput) {
    dateInput.addEventListener('blur', function() {
        const value = this.value.trim();
        
        // If empty, don't validate
        if (!value) return;
        
        // Check if it's in YYYY-MM-DD format
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        
        if (!regex.test(value)) {
            this.style.borderColor = '#dc2626';
            showNotification('Please use YYYY-MM-DD format for date', 'error');
        } else {
            this.style.borderColor = '#cbd5e1';
        }
    });
}