// DOM Elements
const memberForm = document.getElementById('memberForm');
const memberList = document.getElementById('memberList');
const search = document.getElementById('search');
const emptyState = document.getElementById('empty-state');

// Toggle member details when clicking on member name or expand icon
memberList.addEventListener('click', (e) => {
    // Check if clicked on member name or expand icon
    if (e.target.classList.contains('member-name') || 
        e.target.classList.contains('expand-icon') || 
        e.target.closest('.member-name')) {
        
        const row = e.target.closest('.member-row');
        const detailsRow = row.nextElementSibling;
        
        if (detailsRow && detailsRow.classList.contains('member-details')) {
            detailsRow.classList.toggle('hidden');
            row.classList.toggle('collapsed');
            
            // Toggle the expand icon rotation
            const expandIcon = row.querySelector('.expand-icon');
            if (expandIcon) {
                expandIcon.style.transform = detailsRow.classList.contains('hidden') ? 
                    'rotate(0deg)' : 'rotate(90deg)';
            }
        }
    }
});

// Search functionality with improved UX
search.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase().trim();
    let matchFound = false;
    
    const memberRows = Array.from(memberList.querySelectorAll('.member-row'));
    
    memberRows.forEach(row => {
        const detailsRow = row.nextElementSibling;
        const shouldShow = row.innerText.toLowerCase().includes(term);
        
        row.style.display = shouldShow ? '' : 'none';
        
        if (detailsRow && detailsRow.classList.contains('member-details')) {
            detailsRow.style.display = shouldShow ? '' : 'none';
            
            // Hide details when searching
            if (shouldShow) {
                detailsRow.classList.add('hidden');
                row.classList.remove('collapsed');
                const expandIcon = row.querySelector('.expand-icon');
                if (expandIcon) expandIcon.style.transform = 'rotate(0deg)';
            }
        }
        
        if (shouldShow) matchFound = true;
    });
    
    // Show empty state if no matches
    emptyState.classList.toggle('hidden', matchFound);
});

// Flag a user
const flagUser = async (ID) => {
    try {
        const response = await sendFetchRequest(`/leaderboard/addflaguser`, 'PATCH', { userid: ID });
        
        if (response.success) {
            const flagEle = document.getElementById(ID).querySelector('.flag-count');
            const currentCount = parseInt(flagEle.innerText) || 0;
            flagEle.innerText = currentCount + 1;
            
            // Add visual feedback
            const flagBtn = document.getElementById(ID).querySelector('.flag-btn');
            addButtonFeedback(flagBtn, 'success');
        } else {
            throw new Error('Failed to flag user');
        }
    } catch (error) {
        console.error('Error flagging user:', error);
        showNotification('Failed to flag user', 'error');
    }
};

// Remove a user
const removeUser = async (ID) => {
    try {
        // Show confirmation dialog
        if (!confirm('Are you sure you want to remove this member?')) {
            return;
        }
        
        const data = await sendFetchRequest(`/leaderboard/deleteUser/${ID}`, 'DELETE');
        
        if (data.success) {
            // Get both the row and its details row
            const row = document.getElementById(ID);
            const detailsRow = row.nextElementSibling;
            
            // Add fade out animation
            row.style.transition = 'opacity 0.3s';
            row.style.opacity = '0';
            
            if (detailsRow) {
                detailsRow.style.transition = 'opacity 0.3s';
                detailsRow.style.opacity = '0';
            }
            
            // Remove after animation
            setTimeout(() => {
                row.remove();
                if (detailsRow) detailsRow.remove();
                
                // Check if list is empty after removal
                checkEmptyList();
                
                showNotification('Member removed successfully', 'success');
            }, 300);
        } else {
            throw new Error('Failed to remove user');
        }
    } catch (error) {
        console.error('Error removing user:', error);
        showNotification('Failed to remove member', 'error');
    }
};

// Helper function to add button feedback
function addButtonFeedback(button, type) {
    const originalColor = button.style.backgroundColor;
    
    if (type === 'success') {
        button.style.backgroundColor = '#27ae60';
    } else {
        button.style.backgroundColor = '#e74c3c';
    }
    
    setTimeout(() => {
        button.style.backgroundColor = originalColor;
    }, 500);
}

// Display notification
function showNotification(message, type = 'info') {
    // Create notification element if it doesn't exist
    let notification = document.querySelector('.notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.className = 'notification';
        document.body.appendChild(notification);
    }
    
    // Add appropriate class and message
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Show notification
    notification.style.display = 'flex';
    
    // Hide after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            notification.style.display = 'none';
            notification.style.opacity = '1';
        }, 300);
    }, 3000);
}

// Check if member list is empty
function checkEmptyList() {
    const visibleRows = Array.from(memberList.querySelectorAll('.member-row'))
        .filter(row => row.style.display !== 'none');
    
    emptyState.classList.toggle('hidden', visibleRows.length > 0);
}

// Add CSS for notifications
document.addEventListener('DOMContentLoaded', () => {
    // Create style element for notifications
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 12px 20px;
            background-color: white;
            color: #333;
            border-radius: 6px;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
            display: none;
            align-items: center;
            z-index: 1100;
            transition: opacity 0.3s;
        }
        
        .notification.success {
            border-left: 4px solid #27ae60;
        }
        
        .notification.error {
            border-left: 4px solid #e74c3c;
        }
        
        .notification.info {
            border-left: 4px solid #3498db;
        }
        
        .notification i {
            margin-right: 10px;
            font-size: 18px;
        }
        
        .notification.success i {
            color: #27ae60;
        }
        
        .notification.error i {
            color: #e74c3c;
        }
        
        .notification.info i {
            color: #3498db;
        }
    `;
    document.head.appendChild(style);
    
    // Add form submission handling
    if (memberForm) {
        memberForm.addEventListener('submit', (e) => {
            const submitBtn = memberForm.querySelector('.btn-submit');
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding...';
            submitBtn.disabled = true;
            // Form will submit normally
        });
    }
});