document.addEventListener('DOMContentLoaded', function() {
    const addTaskBtn = document.getElementById('addTaskBtn');
    const addLessonBtn = document.getElementById('addLessonBtn');
    const taskContainerBody = document.querySelector('.task-container-body');
    
    // Load tasks when page loads
    loadTasks();
    
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
            </div>`
            ;
        
        
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
                createTaskItem(titleInput.value, categorySelect.value, type);
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
        taskItem.className = 'task-item';
        if (task.completed == 1) {
            taskItem.classList.add('completed');
        }
        
        // Store task ID as data attribute
        taskItem.dataset.taskId = task.id;
        
        // Get category color
        const categoryColor = getCategoryColor(task.category);
        
        // Create task item HTML
        taskItem.innerHTML = `
            <div class="task-item-header">
                <span class="task-type">${task.type}</span>
                <span class="task-category" style="background-color: ${categoryColor}">${task.category}</span>
            </div>
            <div class="task-item-body">
                <h4>${task.title}</h4>
            </div>
            <div class="task-item-footer">
                <button class="more-btn"><img src="assets/images/moreIconBlack.png" alt="More"></button>
                <div class="action-buttons" style="display: none;">
                    <button class="complete-btn">${task.completed == 1 ? 'Uncomplete' : 'Complete'}</button>
                    <button class="delete-btn">Delete</button>
                </div>
            </div>
        `;
        
        // Add event listener for more button
        const moreBtn = taskItem.querySelector('.more-btn');
        const actionButtons = taskItem.querySelector('.action-buttons');
        
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
        
        // Add event listeners for complete and delete buttons
        const completeBtn = taskItem.querySelector('.complete-btn');
        completeBtn.addEventListener('click', function() {
            const taskId = taskItem.dataset.taskId;
            const isCompleted = taskItem.classList.contains('completed');
            
            // Toggle completed class
            taskItem.classList.toggle('completed');
            
            // Update button text
            completeBtn.textContent = isCompleted ? 'Complete' : 'Uncomplete';
            
            // Update in database
            updateTaskStatus(taskId, !isCompleted);
            
            // Hide action buttons
            actionButtons.style.display = 'none';
        });
        
        const deleteBtn = taskItem.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', function() {
            const taskId = taskItem.dataset.taskId;
            const taskTitle = taskItem.querySelector('.task-item-body h4').textContent;
            
            // Show custom confirmation dialog
            showDeleteConfirmation(taskId, taskTitle, taskItem, actionButtons);
        });
        
        // Close action buttons when clicking outside
        document.addEventListener('click', function(event) {
            if (!taskItem.contains(event.target)) {
                actionButtons.style.display = 'none';
            }
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
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Refresh counters
                updateCounters();
            } else {
                console.error('Error deleting task:', data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
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

    // Function to update counters
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
    
    // Create modal container
    const modal = document.createElement('div');
    modal.className = 'delete-confirmation-modal';
    
    // Create modal content
    modal.innerHTML = `
        <div class="modal-content">
            <h4>Confirm Deletion</h4>
            <p>Are you sure you want to delete "${taskTitle}"?</p>
            <div class="modal-actions">
                <button class="cancel-btn">Cancel</button>
                <button class="confirm-btn">Delete</button>
            </div>
        </div>
    `;
    
    // Add modal to body
    document.body.appendChild(modal);
    
    // Add event listeners
    const cancelBtn = modal.querySelector('.cancel-btn');
    const confirmBtn = modal.querySelector('.confirm-btn');
    
    // Cancel button closes the modal
    cancelBtn.addEventListener('click', function() {
        modal.remove();
        actionButtons.style.display = 'none';
    });
    
    // Confirm button deletes the task
    confirmBtn.addEventListener('click', function() {
        // Delete from database
        deleteTask(taskId);
        
        // Remove task from DOM
        taskItem.remove();
        
        // Remove modal
        modal.remove();
    });
    
    // Clicking outside the modal content closes it
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
            actionButtons.style.display = 'none';
        }
    });
}










