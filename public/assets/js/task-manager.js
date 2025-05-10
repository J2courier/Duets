document.addEventListener('DOMContentLoaded', function() {
    const addTaskBtn = document.getElementById('addTaskBtn');
    const addLessonBtn = document.getElementById('addLessonBtn');
    const taskContainerBody = document.querySelector('.task-container-body');
    
   
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
    
    // Function to create task item
    function createTaskItem(title, category, type) {
        // Create task item container
        const taskItem = document.createElement('div');
        taskItem.className = 'task-item';
        
        // Get category color
        const categoryColor = getCategoryColor(category);
        
        // Create task item HTML
        taskItem.innerHTML = `
            <div class="task-item-header">
                <span class="task-type">${type}</span>
                <span class="task-category" style="background-color: ${categoryColor}">${category}</span>
            </div>
            <div class="task-item-body">
                <h4>${title}</h4>
            </div>
            <div class="task-item-footer">
                <button class="more-btn"><img src="assets/images/moreIconBlack.png" alt="More"></button>
                <div class="action-buttons" style="display: none;">
                    <button class="complete-btn">Complete</button>
                    <button class="delete-btn">Delete</button>
                </div>
            </div>
        `;
        
        // Add event listener for more button
        const moreBtn = taskItem.querySelector('.more-btn');
        const actionButtons = taskItem.querySelector('.action-buttons');
        
        moreBtn.addEventListener('click', function() {
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
            taskItem.classList.toggle('completed');
            actionButtons.style.display = 'none';
        });
        
        const deleteBtn = taskItem.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', function() {
            taskItem.remove();
        });
        
        // Close action buttons when clicking outside
        document.addEventListener('click', function(event) {
            if (!taskItem.contains(event.target)) {
                actionButtons.style.display = 'none';
            }
        });
        
        // Insert task item after the form (if exists) or at the top
        const existingForm = document.querySelector('.task-form');
        if (existingForm) {
            existingForm.after(taskItem);
        } else {
            taskContainerBody.prepend(taskItem);
        }
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
    

    addTaskBtn.addEventListener('click', function() {
        createForm('Task');
    });
    
    addLessonBtn.addEventListener('click', function() {
        createForm('Lesson');
    });
});





