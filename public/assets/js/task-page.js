document.addEventListener('DOMContentLoaded', function() {
    const addTaskBtn = document.getElementById('addTaskBtn');
    const addLessonBtn = document.getElementById('addLessonBtn');
    const taskContainerBody = document.querySelector('.task-container-body');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    // Current filter
    let currentFilter = 'all';
    
    // Load tasks when page loads
    loadTasks().then(() => {
        // Initialize description handlers after tasks are loaded
        if (window.initTaskDescriptionHandlers) {
            window.initTaskDescriptionHandlers();
        }
    });
    
    // Filter buttons event listeners
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));

            this.classList.add('active');
            
            // Set current filter
            currentFilter = this.dataset.filter;
            
            // Reload tasks with filter
            loadTasks();
        });
    });
    
    function createForm(type) {
        const existingForm = document.querySelector('.task-form');
        if (existingForm) {
            existingForm.remove();
        }
        
        const formDiv = document.createElement('div');
        formDiv.className = 'task-form';
        
        formDiv.innerHTML = `
            <h4>Add New ${type}</h4>
            <div class="form-group">
                <label for="taskTitle">Title</label>
                <input type="text" id="taskTitle" placeholder="Enter ${type} title">
                <small class="error-message" id="titleError" style="color: red; display: none;">Please enter a title</small>
            </div>
            <div class="form-group">
                <label for="taskCategory">Category</label>
                <select id="taskCategory">
                    <option value="">Select a category</option>
                    <option value="school">School</option>
                    <option value="work">Work</option>
                    <option value="personal">Personal</option>
                </select>
                <small class="error-message" id="categoryError" style="color: red; display: none;">Please select a category</small>
            </div>
            <div class="form-actions">
                <button class="cancel-btn">Cancel</button>
                <button class="add-btn">Add ${type}</button>
            </div>`;
        
        taskContainerBody.prepend(formDiv);
        
        const cancelBtn = formDiv.querySelector('.cancel-btn');
        cancelBtn.addEventListener('click', function() {
            formDiv.remove();
        });
        
        const addBtn = formDiv.querySelector('.add-btn');
        addBtn.addEventListener('click', function() {
            const titleInput = document.getElementById('taskTitle');
            const categorySelect = document.getElementById('taskCategory');
            const titleError = document.getElementById('titleError');
            const categoryError = document.getElementById('categoryError');
            
            // Reset error messages
            titleError.style.display = 'none';
            categoryError.style.display = 'none';
            
            // Validate inputs
            let isValid = true;
            
            if (!titleInput.value.trim()) {
                titleError.style.display = 'block';
                isValid = false;
            }
            
            if (!categorySelect.value) {
                categoryError.style.display = 'block';
                isValid = false;
            }
            
            if (isValid) {
                // Create task
                createTaskItem(titleInput.value.trim(), categorySelect.value, type);
                
                // Remove form
                formDiv.remove();
            }
        });
    }
    
    // Function to load tasks from database
    function loadTasks() {
        return new Promise((resolve) => {
            fetch('api/get_tasks.php')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Clear existing tasks
                    const taskCards = document.querySelectorAll('.task-card');
                    taskCards.forEach(card => card.remove());
                    
                    // Display tasks
                    data.tasks.forEach(task => {
                        displayTaskCard(task);
                    });
                    
                    // Initialize description handlers
                    if (window.initTaskDescriptionHandlers) {
                        window.initTaskDescriptionHandlers();
                    }
                    
                    resolve(); // Resolve the promise
                } else {
                    console.error('Error loading tasks:', data.message);
                    resolve(); // Resolve even on error
                }
            })
            .catch(error => {
                console.error('Error:', error);
                resolve(); // Resolve even on error
            });
        });
    }
    
    // Function to display a task card
    function displayTaskCard(task) {
        // Create task card
        const taskCard = document.createElement('div');
        taskCard.className = 'task-card';
        if (task.completed == 1) {
            taskCard.classList.add('completed');
        }
        
        // Store task ID and other data as attributes
        taskCard.dataset.taskId = task.id;
        taskCard.dataset.category = task.category;
        taskCard.dataset.type = task.type;
        taskCard.dataset.description = task.description || '';
        
        // Get category color
        const categoryColor = getCategoryColor(task.category);
        
        // Create task card HTML
        taskCard.innerHTML = `
            <div class="task-card-header">
                <span class="task-type">${task.type}</span>
                <span class="task-category" style="background-color: ${categoryColor}">${task.category}</span>
            </div>
            <h3 class="task-title">${task.title}</h3>
            <div class="task-card-footer">
                <div class="task-actions-dropdown">
                    <button class="more-btn"><img src="assets/images/moreIconBlack.png" alt="More"></button>
                    <div class="action-buttons" style="display: none;">
                        <button class="edit-btn">Edit</button>
                        <button class="complete-btn">${task.completed == 1 ? 'Uncomplete' : 'Complete'}</button>
                        <button class="delete-btn">Delete</button>
                    </div>
                </div>
            </div>
        `;
        
        // Add click event to show description dialog
        taskCard.addEventListener('click', function(e) {
            // Don't show description dialog if clicking on buttons
            if (e.target.tagName === 'BUTTON' || e.target.closest('button') || e.target.closest('.action-buttons')) {
                return;
            }
            
            showDescriptionDialog(task.id, task.title, task.description || '', taskCard);
        });
        
        // Add event listeners for buttons
        attachTaskCardEventListeners(taskCard, task);
        
        // Add task card to container
        taskContainerBody.appendChild(taskCard);
    }
    
    // Function to create task item (for new tasks)
    function createTaskItem(title, category, type) {
        // Save task to database
        saveTaskToDatabase(title, category, type);
    }
    
    function getCategoryColor(category) {
        switch(category) {
            case 'school':
                return '#1E90FF';
            case 'work':
                return '#8A2BE2'; 
            case 'personal':
                return '#00CED1'; 
            default:
                return '#FBBC05'; 
        }
    }
    
    // Function to save task to database
    function saveTaskToDatabase(title, category, type) {
        fetch('api/save_task.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: title,
                category: category,
                type: type
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Refresh tasks
                loadTasks();
            } else {
                console.error('Error saving task:', data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
    
    // Function to delete task from database
    function deleteTask(taskId) {
        fetch('api/delete_task.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                task_id: taskId
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Task was deleted successfully
                console.log('Task deleted successfully');
            } else {
                console.error('Error deleting task:', data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
    
    // Function to update task status in database
    function updateTaskStatus(taskId, completed, category) {
        fetch('api/update_task_status.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                task_id: taskId,
                completed: completed
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('Task status updated successfully');
                
                // Update progress bars immediately if ProgressTracker is available
                if (window.ProgressTracker) {
                    window.ProgressTracker.updateProgressBars(true, category);
                }
            } else {
                console.error('Error updating task status:', data.message);
                // Revert UI changes if server update failed
                revertTaskStatus(taskId, completed);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            // Revert UI changes if there was an error
            revertTaskStatus(taskId, completed);
        });
    }

    // Function to revert task status UI if server update fails
    function revertTaskStatus(taskId, wasCompleted) {
        const taskCard = document.querySelector(`.task-card[data-task-id="${taskId}"]`);
        if (taskCard) {
            // Revert the completed class
            if (wasCompleted) {
                taskCard.classList.add('completed');
            } else {
                taskCard.classList.remove('completed');
            }
            
            // Revert button text
            const completeBtn = taskCard.querySelector('.complete-btn');
            if (completeBtn) {
                completeBtn.textContent = wasCompleted ? 'Uncomplete' : 'Complete';
            }
        }
    }
    
    // Event listeners for add buttons
    if (addTaskBtn) {
        addTaskBtn.addEventListener('click', function() {
            createForm('Task');
        });
    }
    
    if (addLessonBtn) {
        addLessonBtn.addEventListener('click', function() {
            createForm('Lesson');
        });
    }
});

// Add this function to create a custom confirmation modal
function showDeleteConfirmation(taskId, taskTitle, taskItem, actionButtons) {
    // Check if a confirmation modal already exists and remove it
    const existingModal = document.querySelector('.delete-confirmation-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Store the element that had focus before opening the modal
    const previouslyFocusedElement = document.activeElement;
    
    // Create modal container
    const modal = document.createElement('div');
    modal.className = 'delete-confirmation-modal';
    
    // Create modal content
    modal.innerHTML = `
        <div class="modal-content">
            <h4>Confirm Deletion</h4>
            <p>Are you sure you want to delete "${taskTitle}"?</p>
            <div class="status-message" style="display: none; margin: 10px 0; padding: 8px; border-radius: 4px;"></div>
            <div class="modal-actions">
                <button class="cancel-btn">Cancel</button>
                <button class="confirm-btn">Delete</button>
            </div>
        </div>
    `;
    
    // Add modal to body
    document.body.appendChild(modal);
    
    // Get elements
    const cancelBtn = modal.querySelector('.cancel-btn');
    const confirmBtn = modal.querySelector('.confirm-btn');
    const statusMessage = modal.querySelector('.status-message');
    
    // Function to close the modal
    const closeModal = () => {
        // Remove the modal with a fade-out effect
        modal.classList.add('fade-out');
        
        // Remove keyboard event listener
        document.removeEventListener('keydown', handleKeyDown);
        
        // Wait for animation to complete before removing from DOM
        setTimeout(() => {
            modal.remove();
            
            // Return focus to the element that had it before
            if (previouslyFocusedElement && typeof previouslyFocusedElement.focus === 'function') {
                previouslyFocusedElement.focus();
            }
        }, 200);
    };
    
    // Handle keyboard events
    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            // ESC key closes the modal
            closeModal();
            actionButtons.style.display = 'none';
        } else if (e.key === 'Enter' && document.activeElement === confirmBtn) {
            // Enter key on confirm button triggers delete
            confirmBtn.click();
        }
    };
    
    // Add keyboard event listener
    document.addEventListener('keydown', handleKeyDown);
    
    // Cancel button closes the modal
    cancelBtn.addEventListener('click', function() {
        closeModal();
        actionButtons.style.display = 'none';
    });
    
    // Confirm button deletes the task
    confirmBtn.addEventListener('click', function() {
        // Show loading state
        confirmBtn.textContent = 'Deleting...';
        confirmBtn.disabled = true;
        cancelBtn.disabled = true;
        
        // Delete from database
        fetch('api/delete_task.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                task_id: taskId
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
                // Show success message
                statusMessage.textContent = 'Task deleted successfully!';
                statusMessage.style.display = 'block';
                statusMessage.style.backgroundColor = '#d4edda';
                statusMessage.style.color = '#155724';
                
                // Add fade-out animation to the task item
                taskItem.style.transition = 'opacity 0.3s, transform 0.3s';
                taskItem.style.opacity = '0';
                taskItem.style.transform = 'translateX(20px)';
                
                // Wait for animation to complete before removing from DOM
                setTimeout(() => {
                    taskItem.remove();
                    
                    // Close modal after a short delay
                    setTimeout(closeModal, 500);
                }, 300);
            } else {
                // Show error message in the modal
                statusMessage.textContent = 'Error: ' + data.message;
                statusMessage.style.display = 'block';
                statusMessage.style.backgroundColor = '#f8d7da';
                statusMessage.style.color = '#721c24';
                
                // Re-enable buttons
                confirmBtn.textContent = 'Delete';
                confirmBtn.disabled = false;
                cancelBtn.disabled = false;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            
            // Show error message in the modal
            statusMessage.textContent = 'An error occurred. Please try again.';
            statusMessage.style.display = 'block';
            statusMessage.style.backgroundColor = '#f8d7da';
            statusMessage.style.color = '#721c24';
            
            // Re-enable buttons
            confirmBtn.textContent = 'Delete';
            confirmBtn.disabled = false;
            cancelBtn.disabled = false;
        });
    });
    
    // Clicking outside the modal content closes it
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
            actionButtons.style.display = 'none';
        }
    });
    
    // Focus the cancel button by default (better accessibility)
    cancelBtn.focus();
}

// Function to show edit dialog
function showEditDialog(taskId, currentTitle, currentType, currentCategory) {
    // Check if an edit dialog already exists and remove it
    const existingDialog = document.querySelector('.edit-task-dialog');
    if (existingDialog) {
        existingDialog.remove();
    }
    
    // Create dialog container
    const dialog = document.createElement('div');
    dialog.className = 'edit-task-dialog';
    
    // Create dialog content
    dialog.innerHTML = `
        <div class="dialog-content">
            <h4>Edit Task</h4>
            <div class="form-group">
                <label for="editTaskTitle">Title</label>
                <input type="text" id="editTaskTitle" value="${currentTitle}">
                <small class="error-message" id="editTitleError" style="color: red; display: none;">Please enter a title</small>
            </div>
            <div class="form-group">
                <label for="editTaskType">Type</label>
                <select id="editTaskType">
                    <option value="Task" ${currentType === 'Task' ? 'selected' : ''}>Task</option>
                    <option value="Lesson" ${currentType === 'Lesson' ? 'selected' : ''}>Lesson</option>
                </select>
            </div>
            <div class="form-group">
                <label for="editTaskCategory">Category</label>
                <select id="editTaskCategory">
                    <option value="school" ${currentCategory === 'school' ? 'selected' : ''}>School</option>
                    <option value="work" ${currentCategory === 'work' ? 'selected' : ''}>Work</option>
                    <option value="personal" ${currentCategory === 'personal' ? 'selected' : ''}>Personal</option>
                </select>
                <small class="error-message" id="editCategoryError" style="color: red; display: none;">Please select a category</small>
            </div>
            <div id="updateStatus" class="update-status" style="display: none; margin-top: 10px; padding: 5px; text-align: center;"></div>
            <div class="dialog-actions">
                <button class="cancel-btn">Cancel</button>
                <button class="save-btn">Save Changes</button>
            </div>
        </div>
    `;
    
    // Add dialog to body
    document.body.appendChild(dialog);
    
    // Get elements
    const dialogContent = dialog.querySelector('.dialog-content');
    const cancelBtn = dialog.querySelector('.cancel-btn');
    const saveBtn = dialog.querySelector('.save-btn');
    const titleInput = dialog.querySelector('#editTaskTitle');
    const typeSelect = dialog.querySelector('#editTaskType');
    const categorySelect = dialog.querySelector('#editTaskCategory');
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
    
    // Save button updates the task
    saveBtn.addEventListener('click', function() {
        const titleError = dialog.querySelector('#editTitleError');
        const categoryError = dialog.querySelector('#editCategoryError');
        
        // Reset error messages
        titleError.style.display = 'none';
        categoryError.style.display = 'none';
        updateStatus.style.display = 'none';
        
        // Get input values
        const newTitle = titleInput.value.trim();
        const newType = typeSelect.value;
        const newCategory = categorySelect.value;
        
        // Validate inputs
        let isValid = true;
        
        if (!newTitle) {
            titleError.style.display = 'block';
            isValid = false;
        }
        
        if (!newCategory) {
            categoryError.style.display = 'block';
            isValid = false;
        }
        
        if (isValid) {
            // Disable save button and show loading status
            saveBtn.disabled = true;
            saveBtn.textContent = 'Saving...';
            updateStatus.textContent = 'Updating task...';
            updateStatus.style.display = 'block';
            updateStatus.style.backgroundColor = '#f8f9fa';
            updateStatus.style.color = '#333';
            
            // Use the standardized updateTask function
            updateTask(taskId, newTitle, newType, newCategory)
                .then(() => {
                    // Show success message
                    updateStatus.textContent = 'Task updated successfully!';
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
                    saveBtn.textContent = 'Save Changes';
                });
        }
    });
    
    // Clicking outside the dialog content closes it
    dialog.addEventListener('click', function(e) {
        if (e.target === dialog) {
            closeDialog();
        }
    });
    
    // Focus on the title input
    titleInput.focus();
}

// Function to update task in database
function updateTask(taskId, title, type, category) {
    // Show loading indicator or disable the form if needed
    
    fetch('api/update_task.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            task_id: taskId,
            title: title,
            type: type,
            category: category
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
            console.log('Task updated successfully:', data);
            // Fetch the updated task instead of reloading all tasks
            fetchSingleTask(taskId);
        } else {
            console.error('Error updating task:', data.message);
            // Return the error so it can be handled by the caller
            return Promise.reject(data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        // Return the error so it can be handled by the caller
        return Promise.reject(error.message || 'An error occurred while updating the task');
    });
}

// Function to fetch a single task and update its display
function fetchSingleTask(taskId) {
    fetch(`api/get_single_task.php?task_id=${taskId}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            // Find the existing task card
            const existingTaskCard = document.querySelector(`.task-card[data-task-id="${taskId}"]`);
            
            if (existingTaskCard) {
                // Update the task card with new data
                const task = data.task;
                
                // Update title
                const titleElement = existingTaskCard.querySelector('.task-title');
                if (titleElement) {
                    titleElement.textContent = task.title;
                }
                
                // Update category
                const categoryElement = existingTaskCard.querySelector('.task-category');
                if (categoryElement) {
                    categoryElement.textContent = task.category.charAt(0).toUpperCase() + task.category.slice(1);
                    categoryElement.style.backgroundColor = getCategoryColor(task.category);
                }
                
                // Update type if it's displayed
                const typeElement = existingTaskCard.querySelector('.task-type');
                if (typeElement) {
                    typeElement.textContent = task.type;
                }
                
                // Apply animation to highlight the updated card
                existingTaskCard.classList.add('task-updated');
                setTimeout(() => {
                    existingTaskCard.classList.remove('task-updated');
                }, 1500);
            } else {
                // If the card doesn't exist (rare case), reload all tasks
                console.log('Task card not found, reloading all tasks');
                loadTasks();
            }
        } else {
            console.error('Error fetching task:', data.message);
            // If there's an error, reload all tasks as a fallback
            loadTasks();
        }
    })
    .catch(error => {
        console.error('Error:', error);
        // If there's an error, reload all tasks as a fallback
        loadTasks();
    });
}

// Function to attach event listeners to a task card
function attachTaskCardEventListeners(taskCard, task) {
    // Add event listener for more button
    const moreBtn = taskCard.querySelector('.more-btn');
    const actionButtons = taskCard.querySelector('.action-buttons');
    
    moreBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        // Toggle visibility of action buttons
        const isVisible = actionButtons.style.display === 'flex';
        
        // Hide all other action buttons first
        document.querySelectorAll('.action-buttons').forEach(el => {
            el.style.display = 'none';
        });
        
        // Toggle this item's action buttons
        actionButtons.style.display = isVisible ? 'none' : 'flex';
    });
    
    // Add event listeners for edit, complete and delete buttons
    const editBtn = taskCard.querySelector('.edit-btn');
    editBtn.addEventListener('click', function() {
        const taskId = taskCard.dataset.taskId;
        const taskTitle = taskCard.querySelector('.task-title').textContent;
        const taskType = taskCard.querySelector('.task-type').textContent;
        
        // Show edit dialog
        showEditDialog(taskId, taskTitle, taskType, task.category);
        
        // Hide action buttons
        actionButtons.style.display = 'none';
    });
    
    const completeBtn = taskCard.querySelector('.complete-btn');
    completeBtn.addEventListener('click', function() {
        const taskId = taskCard.dataset.taskId;
        const isCompleted = taskCard.classList.contains('completed');
        const category = task.category; // Use the task object to get the category
        
        // Toggle completed class immediately
        taskCard.classList.toggle('completed');
        
        // Update button text
        completeBtn.textContent = isCompleted ? 'Complete' : 'Uncomplete';
        
        // Update in database
        updateTaskStatus(taskId, !isCompleted, category);
        
        // Hide action buttons
        actionButtons.style.display = 'none';
    });
    
    const deleteBtn = taskCard.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', function() {
        const taskId = taskCard.dataset.taskId;
        const taskTitle = taskCard.querySelector('.task-title').textContent;
        
        // Show custom confirmation dialog
        showDeleteConfirmation(taskId, taskTitle, taskCard, actionButtons);
    });
    
    // Close action buttons when clicking outside
    document.addEventListener('click', function(event) {
        if (!taskCard.contains(event.target)) {
            actionButtons.style.display = 'none';
        }
    });
}













