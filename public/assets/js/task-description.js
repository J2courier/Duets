document.addEventListener('DOMContentLoaded', function() {
    // Initialize description functionality
    initTaskDescriptionHandlers();
});

function initTaskDescriptionHandlers() {
    // This function will be called when tasks are loaded
    // It's exposed globally so it can be called from task-page.js
    window.initTaskDescriptionHandlers = function() {
        const taskCards = document.querySelectorAll('.task-card');
        
        taskCards.forEach(card => {
            // Make sure we don't attach multiple listeners to the same card
            if (!card.dataset.descriptionHandlerAttached) {
                card.dataset.descriptionHandlerAttached = 'true';
                
                // Add click event to show description dialog
                card.addEventListener('click', function(e) {
                    // Don't show description dialog if clicking on buttons or action menu
                    if (e.target.tagName === 'BUTTON' || e.target.closest('button') || e.target.closest('.action-buttons')) {
                        return;
                    }
                    
                    const taskId = this.dataset.taskId;
                    const taskTitle = this.querySelector('.task-title').textContent;
                    const description = this.dataset.description || '';
                    
                    showDescriptionDialog(taskId, taskTitle, description, this);
                });
            }
        });
    };
}

function showDescriptionDialog(taskId, taskTitle, description, taskCard) {
    // Check if a description dialog already exists and remove it
    const existingDialog = document.querySelector('.description-dialog');
    if (existingDialog) {
        existingDialog.remove();
    }
    
    // Create dialog container
    const dialog = document.createElement('div');
    dialog.className = 'description-dialog';
    
    // Create dialog content
    dialog.innerHTML = `
        <div class="dialog-content">
            <h4>${taskTitle}</h4>
            <div class="form-group">
                <label for="taskDescription">Description</label>
                <textarea id="taskDescription" rows="5" placeholder="Add a description for this task...">${description}</textarea>
            </div>
            <div id="updateStatus" class="update-status" style="display: none; margin-top: 10px; padding: 5px; text-align: center;"></div>
            <div class="dialog-actions">
                <button class="cancel-btn">Cancel</button>
                <button class="save-btn">Save</button>
            </div>
        </div>
    `;
    
    // Add dialog to body
    document.body.appendChild(dialog);
    
    // Get elements
    const dialogContent = dialog.querySelector('.dialog-content');
    const cancelBtn = dialog.querySelector('.cancel-btn');
    const saveBtn = dialog.querySelector('.save-btn');
    const descriptionTextarea = dialog.querySelector('#taskDescription');
    const updateStatus = dialog.querySelector('#updateStatus');
    
    // Function to close dialog
    const closeDialog = () => {
        // Remove event listeners
        document.removeEventListener('keydown', handleKeyDown);
        dialog.remove();
    };
    
    // Handle ESC key
    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            closeDialog();
        }
    };
    
    // Add ESC key listener
    document.addEventListener('keydown', handleKeyDown);
    
    // Cancel button closes the dialog
    cancelBtn.addEventListener('click', closeDialog);
    
    // Save button updates the description
    saveBtn.addEventListener('click', function() {
        // Get input value
        const newDescription = descriptionTextarea.value.trim();
        
        // Disable save button and show loading status
        saveBtn.disabled = true;
        saveBtn.textContent = 'Saving...';
        updateStatus.textContent = 'Updating description...';
        updateStatus.style.display = 'block';
        updateStatus.style.backgroundColor = '#f8f9fa';
        updateStatus.style.color = '#333';
        
        // Update description in database
        updateTaskDescription(taskId, newDescription)
            .then(() => {
                // Update the task card's data attribute
                taskCard.dataset.description = newDescription;
                
                // Show success message
                updateStatus.textContent = 'Description saved successfully!';
                updateStatus.style.backgroundColor = '#d4edda';
                updateStatus.style.color = '#155724';
                
                // Close dialog after a short delay
                setTimeout(closeDialog, 1000);
            })
            .catch(errorMsg => {
                // Show error message
                updateStatus.textContent = 'Error: ' + errorMsg;
                updateStatus.style.backgroundColor = '#f8d7da';
                updateStatus.style.color = '#721c24';
                
                // Re-enable save button
                saveBtn.disabled = false;
                saveBtn.textContent = 'Save';
            });
    });
    
    // Clicking outside the dialog content closes it
    dialog.addEventListener('click', function(e) {
        if (e.target === dialog) {
            closeDialog();
        }
    });
    
    // Focus on the description textarea
    descriptionTextarea.focus();
}

// Function to update task description in database
function updateTaskDescription(taskId, description) {
    return fetch('api/update_task_description.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            task_id: taskId,
            description: description
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            console.log('Description updated successfully:', data);
            return Promise.resolve();
        } else {
            console.error('Error updating description:', data.message);
            return Promise.reject(data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        return Promise.reject(error.message || 'An error occurred while updating the description');
    });
}