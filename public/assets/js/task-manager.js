// Move updateCounters function outside the DOMContentLoaded event
// to make it globally accessible
function updateCounters() {
    fetch('api/get_task_counts.php')
    .then(response => response.json())
    .then(data => {
        document.querySelector('.counter-card-1 .counter').textContent = data.total;
        document.querySelector('.counter-card-2 .counter').textContent = data.work;
        document.querySelector('.counter-card-3 .counter').textContent = data.school;
        document.querySelector('.counter-card-4 .counter').textContent = data.personal;
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const addTaskBtn = document.getElementById('addTaskBtn');
    const addLessonBtn = document.getElementById('addLessonBtn');
    const taskContainerBody = document.querySelector('.task-container-body');
    
    // Initialize category filters
    initCategoryFilters();
    
    // Load tasks
    loadTasks();
    
    // Update counters
    updateCounters();
    
    // Function to initialize category filters
    function initCategoryFilters() {
        const categoriesContainer = document.querySelector('.categories');
        
        // Clear existing content
        categoriesContainer.innerHTML = '';
        
        // Create filter buttons
        const categories = [
            { id: 'all', name: 'All', color: '#0321a8' },
            { id: 'work', name: 'Work', color: '#8A2BE2' },
            { id: 'school', name: 'School', color: '#1E90FF' },
            { id: 'personal', name: 'Personal', color: '#00CED1' }
        ];
        
        categories.forEach(category => {
            const button = document.createElement('button');
            button.className = 'category-filter-btn';
            button.dataset.category = category.id;
            button.innerHTML = `
                <span class="category-dot" style="background-color: ${category.color}"></span>
                <span>${category.name}</span>
            `;
            
            // Set 'All' as active by default
            if (category.id === 'all') {
                button.classList.add('active');
            }
            
            // Add click event
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                document.querySelectorAll('.category-filter-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Filter tasks
                filterTasksByCategory(category.id);
            });
            
            categoriesContainer.appendChild(button);
        });
    }
    
    // Function to filter tasks by category
    function filterTasksByCategory(category) {
        const taskItems = document.querySelectorAll('.task-item');
        
        taskItems.forEach(item => {
            if (category === 'all' || item.querySelector('.task-category').textContent.toLowerCase() === category) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }
    
    // Modify loadTasks function to maintain filter after reload
    const originalLoadTasks = loadTasks;
    loadTasks = function() {
        // Get current active filter
        const activeFilter = document.querySelector('.category-filter-btn.active');
        const category = activeFilter ? activeFilter.dataset.category : 'all';
        
        // Call original function
        originalLoadTasks();
        
        // Apply filter after a short delay to ensure tasks are loaded
        setTimeout(() => {
            filterTasksByCategory(category);
        }, 100);
    };
    
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
            <div class="form-group">
                <label for="taskDueDate">Due Date (optional)</label>
                <input type="date" id="taskDueDate">
            </div>
            <div class="form-group">
                <label for="taskRepeatType">Repeat</label>
                <select id="taskRepeatType">
                    <option value="none">No repeat</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="custom">Custom</option>
                </select>
            </div>
            <div id="customRepeatOptions" class="form-group" style="display: none;">
                <label>Repeat on days:</label>
                <div class="weekday-selector">
                    <label><input type="checkbox" value="mon"> Mon</label>
                    <label><input type="checkbox" value="tue"> Tue</label>
                    <label><input type="checkbox" value="wed"> Wed</label>
                    <label><input type="checkbox" value="thu"> Thu</label>
                    <label><input type="checkbox" value="fri"> Fri</label>
                    <label><input type="checkbox" value="sat"> Sat</label>
                    <label><input type="checkbox" value="sun"> Sun</label>
                </div>
            </div>
            <div class="form-actions">
                <button class="cancel-btn">Cancel</button>
                <button class="add-btn">Add ${type}</button>
            </div>`;
        
        taskContainerBody.prepend(formDiv);
        
        // Show/hide custom repeat options based on selection
        const repeatTypeSelect = formDiv.querySelector('#taskRepeatType');
        const customRepeatOptions = formDiv.querySelector('#customRepeatOptions');
        
        repeatTypeSelect.addEventListener('change', function() {
            if (this.value === 'custom') {
                customRepeatOptions.style.display = 'block';
            } else {
                customRepeatOptions.style.display = 'none';
            }
        });
        
        const cancelBtn = formDiv.querySelector('.cancel-btn');
        cancelBtn.addEventListener('click', function() {
            formDiv.remove();
        });
        
        const addBtn = formDiv.querySelector('.add-btn');
        addBtn.addEventListener('click', function() {
            const titleInput = document.getElementById('taskTitle');
            const categorySelect = document.getElementById('taskCategory');
            const dueDateInput = document.getElementById('taskDueDate');
            const repeatTypeSelect = document.getElementById('taskRepeatType');
            const titleError = document.getElementById('titleError');
            const categoryError = document.getElementById('categoryError');
        
            titleError.style.display = 'none';
            categoryError.style.display = 'none';

            let isValid = true;
            
            if (!titleInput.value.trim()) {
                titleError.style.display = 'block';
                isValid = false;
            }
            
            if (!categorySelect.value) {
                categoryError.style.display = 'block';
                isValid = false;
            }
            
            // If valid, create task item
            if (isValid) {
                // Get repeat days if custom is selected
                let repeatDays = '';
                if (repeatTypeSelect.value === 'custom') {
                    const selectedDays = [];
                    formDiv.querySelectorAll('.weekday-selector input:checked').forEach(checkbox => {
                        selectedDays.push(checkbox.value);
                    });
                    repeatDays = selectedDays.join(',');
                }
                
                createTaskItem(
                    titleInput.value, 
                    categorySelect.value, 
                    type, 
                    dueDateInput.value, 
                    repeatTypeSelect.value, 
                    repeatDays
                );
                formDiv.remove(); // Remove form after successful submission
            }
        });
    }
    
    // Function to load tasks from database
    function loadTasks() {
        fetch('api/get_tasks.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Clear existing tasks
                const existingForm = document.querySelector('.task-form');
                if (existingForm) {
                    taskContainerBody.innerHTML = '';
                    taskContainerBody.appendChild(existingForm);
                } else {
                    taskContainerBody.innerHTML = '';
                }
                
                // Add tasks to container
                data.tasks.forEach(task => {
                    displayTaskItem(task);
                });
                
                // Initialize description handlers for the newly loaded tasks
                if (typeof window.initTaskDescriptionHandlers === 'function') {
                    window.initTaskDescriptionHandlers();
                }
            } else {
                console.error('Error loading tasks:', data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
    
    // Function to display a task item
    function displayTaskItem(task) {
        // Create task item container
        const taskItem = document.createElement('div');
        taskItem.className = 'task-item task-card';
        if (task.completed == 1) {
            taskItem.classList.add('completed');
        }
        
        // Store task ID and other data as attributes
        taskItem.dataset.taskId = task.id;
        taskItem.dataset.repeatType = task.repeat_type || 'none';
        taskItem.dataset.repeatDays = task.repeat_days || '';
        taskItem.dataset.description = task.description || '';
        
        // Get category color
        const categoryColor = getCategoryColor(task.category);
        
        // Format due date if exists
        let dueDateDisplay = '';
        if (task.due_date && task.due_date !== 'null' && task.due_date !== null) {
            const dueDate = new Date(task.due_date);
            dueDateDisplay = `<div class="due-date">Due: ${dueDate.toLocaleDateString()}</div>`;
        }
        
        // Show repeat indicator if task repeats
        let repeatIndicator = '';
        if (task.repeat_type && task.repeat_type !== 'none') {
            const repeatClass = `repeat-${task.repeat_type}`;
            const repeatLabel = task.repeat_type === 'daily' ? 'Daily' : 
                                task.repeat_type === 'weekly' ? 'Weekly' : 
                                task.repeat_type === 'custom' ? 'Custom' : '';
            
            repeatIndicator = `
                <div class="repeat-indicator ${repeatClass}" title="${getRepeatDescription(task.repeat_type, task.repeat_days)}">
                    <span class="repeat-icon">↻</span>
                    <span class="repeat-label">${repeatLabel}</span>
                </div>`;
        }
        
        // Create task item HTML
        taskItem.innerHTML = `
            <div class="task-item-header">
                <span class="task-type">${task.type}</span>
                <span class="task-category" style="background-color: ${categoryColor}">${task.category}</span>
                ${repeatIndicator}
            </div>
            <div class="task-item-body">
                <h4 class="task-title">${task.title}</h4>
                ${dueDateDisplay}
            </div>
            <div class="task-item-footer">
                <button class="more-btn">
                    <img src="assets/images/moreIconBlack.png" alt="More options" class="more-icon" onerror="this.outerHTML='⋮'">
                </button>
                <div class="action-buttons">
                    <button class="action-btn edit-btn">Edit</button>
                    <button class="action-btn ${task.completed == 1 ? 'incomplete-btn' : 'complete-btn'}">
                        ${task.completed == 1 ? 'Mark Incomplete' : 'Mark Complete'}
                    </button>
                    <button class="action-btn delete-btn">Delete</button>
                </div>
            </div>
        `;
        

            const moreBtn = taskItem.querySelector('.more-btn');
        const actionButtons = taskItem.querySelector('.action-buttons');
        
        moreBtn.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent event bubbling
            
            // Toggle action buttons visibility
            if (actionButtons.style.display === 'flex') {
                actionButtons.style.display = 'none';
            } else {
                // Hide all other action buttons first
                document.querySelectorAll('.action-buttons').forEach(btn => {
                    btn.style.display = 'none';
                });
                actionButtons.style.display = 'flex';
            }
        });
        
        // Close action buttons when clicking outside
        document.addEventListener('click', function() {
            actionButtons.style.display = 'none';
        });
        
        // Prevent the document click from closing the menu when clicking on the menu itself
        actionButtons.addEventListener('click', function(e) {
            e.stopPropagation();
        });
        
        // Add event listeners for action buttons
        const editBtn = taskItem.querySelector('.edit-btn');
        const completeBtn = taskItem.querySelector('.complete-btn') || taskItem.querySelector('.incomplete-btn');
        const deleteBtn = taskItem.querySelector('.delete-btn');

        // Edit button functionality
        editBtn.addEventListener('click', function() {
            // Hide action buttons
            actionButtons.style.display = 'none';
            
            // Get current task details
            const taskTitle = taskItem.querySelector('.task-item-body h4').textContent;
            const taskCategory = task.category;
            
            // Create edit form
            const editForm = document.createElement('div');
            editForm.className = 'task-form edit-form';
            editForm.innerHTML = `
                <h4>Edit ${task.type}</h4>
                <div class="form-group">
                    <label for="editTaskTitle">Title</label>
                    <input type="text" id="editTaskTitle" value="${taskTitle}">
                    <small class="error-message" id="editTitleError" style="color: red; display: none;">Please enter a title</small>
                </div>
                <div class="form-group">
                    <label for="editTaskCategory">Category</label>
                    <select id="editTaskCategory">
                        <option value="school" ${taskCategory === 'school' ? 'selected' : ''}>School</option>
                        <option value="work" ${taskCategory === 'work' ? 'selected' : ''}>Work</option>
                        <option value="personal" ${taskCategory === 'personal' ? 'selected' : ''}>Personal</option>
                    </select>
                    <small class="error-message" id="editCategoryError" style="color: red; display: none;">Please select a category</small>
                </div>
                <div class="form-actions">
                    <button class="cancel-edit-btn">Cancel</button>
                    <button class="save-edit-btn">Save Changes</button>
                </div>
            `;
            
            // Replace task item with edit form
            taskItem.replaceWith(editForm);
            
            // Cancel edit button
            const cancelEditBtn = editForm.querySelector('.cancel-edit-btn');
            cancelEditBtn.addEventListener('click', function() {
                // Remove edit form and reload tasks
                editForm.remove();
                loadTasks();
            });
            
            // Save edit button
            const saveEditBtn = editForm.querySelector('.save-edit-btn');
            saveEditBtn.addEventListener('click', function() {
                const editTitleInput = document.getElementById('editTaskTitle');
                const editCategorySelect = document.getElementById('editTaskCategory');
                const editTitleError = document.getElementById('editTitleError');
                const editCategoryError = document.getElementById('editCategoryError');
                
                editTitleError.style.display = 'none';
                editCategoryError.style.display = 'none';
                
                let isValid = true;
                
                if (!editTitleInput.value.trim()) {
                    editTitleError.style.display = 'block';
                    isValid = false;
                }
                
                if (!editCategorySelect.value) {
                    editCategoryError.style.display = 'block';
                    isValid = false;
                }
                
                if (isValid) {
                    // Update task in database
                    updateTask(task.id, editTitleInput.value, editCategorySelect.value);
                    // Remove edit form
                    editForm.remove();
                }
            });
        });

        // Complete/Incomplete button functionality
        completeBtn.addEventListener('click', function(e) {
            // Prevent event bubbling to avoid triggering the task card click
            e.stopPropagation();
            
            // Toggle completion status
            const newStatus = task.completed == 1 ? 0 : 1;
            
            // Update in database
            updateTaskStatus(task.id, newStatus);
            
            // Update UI
            if (newStatus === 1) {
                taskItem.classList.add('completed');
                completeBtn.textContent = 'Mark Incomplete';
                completeBtn.classList.remove('complete-btn');
                completeBtn.classList.add('incomplete-btn');
            } else {
                taskItem.classList.remove('completed');
                completeBtn.textContent = 'Mark Complete';
                completeBtn.classList.remove('incomplete-btn');
                completeBtn.classList.add('complete-btn');
            }
            
            // Hide action buttons
            actionButtons.style.display = 'none';
            
            // Update task object
            task.completed = newStatus;
            
            // Update progress bars
            if (typeof window.ProgressTracker !== 'undefined') {
                window.ProgressTracker.updateProgressBars(true, task.category);
            }
        });

        // Delete button functionality
        deleteBtn.addEventListener('click', function() {
            // Hide action buttons
            actionButtons.style.display = 'none';
            
            // Show delete confirmation
            showDeleteConfirmation(task.id, taskItem.querySelector('.task-item-body h4').textContent, taskItem, actionButtons);
        });
        
        // Insert task item at the top of the container
        const existingForm = document.querySelector('.task-form');
        if (existingForm) {
            existingForm.after(taskItem);
        } else {
            taskContainerBody.prepend(taskItem);
        }
    }
    
    // Function to create task item (for new tasks)
    function createTaskItem(title, category, type, dueDate = '', repeatType = 'none', repeatDays = '') {
        // Save task to database
        fetch('api/create_task.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: title,
                category: category,
                type: type,
                due_date: dueDate,
                repeat_type: repeatType,
                repeat_days: repeatDays
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Refresh tasks and counters
                loadTasks();
                updateCounters();
            } else {
                console.error('Error saving task:', data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
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
                // Refresh tasks and counters
                loadTasks();
                updateCounters();
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
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                // Task was deleted successfully
                console.log('Task deleted successfully');
                // Update counters to reflect the deleted task
                updateCounters();
            } else {
                console.error('Error deleting task:', data.message);
                alert('Failed to delete task: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while deleting the task. Please try again.');
        });
    }
    
    // Function to update task status in database
    function updateTaskStatus(taskId, completed) {
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
                // Refresh counters
                updateCounters();
            } else {
                console.error('Error updating task status:', data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    // Event listeners for add buttons
    addTaskBtn.addEventListener('click', function() {
        createForm('Task');
    });
    
    addLessonBtn.addEventListener('click', function() {
        createForm('Lesson');
    });
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
        modal.classList.add('fade-out');
        setTimeout(() => {
            modal.remove();
            // Restore focus to the element that had it before the modal was opened
            if (previouslyFocusedElement) {
                previouslyFocusedElement.focus();
            }
        }, 300);
    };
    
    // Cancel button event
    cancelBtn.addEventListener('click', closeModal);
    
    // Confirm button event
    confirmBtn.addEventListener('click', function() {
        // Disable buttons during deletion
        confirmBtn.disabled = true;
        cancelBtn.disabled = true;
        
        // Show loading message
        statusMessage.textContent = 'Deleting...';
        statusMessage.style.display = 'block';
        statusMessage.style.backgroundColor = '#f8f9fa';
        statusMessage.style.color = '#333';
        
        // Delete task
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
                statusMessage.style.backgroundColor = '#d4edda';
                statusMessage.style.color = '#155724';
                
                // Remove task item from DOM
                taskItem.remove();
                
                // Update counters
                updateCounters();
                
                // Update progress bars if available
                if (typeof window.ProgressTracker !== 'undefined') {
                    window.ProgressTracker.updateProgressBars(true);
                }
                
                // Close modal after a short delay
                setTimeout(closeModal, 1000);
            } else {
                throw new Error(data.message || 'Failed to delete task');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            
            // Show error message
            statusMessage.textContent = error.message || 'An error occurred while deleting the task';
            statusMessage.style.backgroundColor = '#f8d7da';
            statusMessage.style.color = '#721c24';
            
            // Re-enable buttons
            confirmBtn.disabled = false;
            cancelBtn.disabled = false;
        });
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

// Function to update task in database
function updateTask(taskId, title, category) {
    fetch('api/update_task.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            task_id: taskId,
            title: title,
            category: category
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Refresh tasks and counters
            loadTasks();
            updateCounters();
            
            // Update progress bars if available
            if (typeof window.ProgressTracker !== 'undefined') {
                window.ProgressTracker.updateProgressBars(true, category);
            }
            
            // Show success notification
            showNotification('Task updated successfully', 'success');
        } else {
            console.error('Error updating task:', data.message);
            showNotification('Failed to update task', 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showNotification('An error occurred', 'error');
    });
}

// Function to show notifications
function showNotification(message, type) {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        notification.remove();
    });
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Helper function to get a human-readable description of repeat settings
function getRepeatDescription(repeatType, repeatDays) {
    switch(repeatType) {
        case 'daily':
            return 'Repeats daily';
        case 'weekly':
            return 'Repeats weekly';
        case 'custom':
            const days = repeatDays.split(',');
            const dayNames = {
                'mon': 'Monday',
                'tue': 'Tuesday',
                'wed': 'Wednesday',
                'thu': 'Thursday',
                'fri': 'Friday',
                'sat': 'Saturday',
                'sun': 'Sunday'
            };
            const readableDays = days.map(day => dayNames[day] || day).join(', ');
            return `Repeats on: ${readableDays}`;
        default:
            return '';
    }
}

















