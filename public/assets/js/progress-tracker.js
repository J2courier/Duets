/**
 * Progress Tracker
 * Handles all functionality related to displaying and updating task progress
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize progress bars when the page loads
    updateProgressBars();
});

/**
 * Updates all progress bars based on current task completion data
 * @param {boolean} animate - Whether to animate the progress bars
 * @param {string} updatedCategory - The category that was just updated (for highlighting)
 */
function updateProgressBars(animate = false, updatedCategory = null) {
    fetch('api/get_task_progress.php')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            const progressContainerBody = document.querySelector('.progress-container-body');
            const existingOverallSection = progressContainerBody.querySelector('.progress-section.overall');
            
            // Update or create the overall progress section
            const totalStats = data.progress.total;
            const totalPercentage = totalStats.total > 0 ? Math.round((totalStats.completed / totalStats.total) * 100) : 0;
            const hasIncompleteTasks = totalStats.completed < totalStats.total && totalStats.total > 0;

            if (existingOverallSection) {
                // Update existing overall section
                // No asterisk for overall progress
                existingOverallSection.querySelector('.progress-header h3').innerHTML = 'Overall Progress';
                existingOverallSection.querySelector('.progress-count').textContent = `${totalPercentage}%`;
                const overallBar = existingOverallSection.querySelector('.progress-bar');
                overallBar.style.width = `${totalPercentage}%`;
                
                // Add incomplete indicator class if there are incomplete tasks
                existingOverallSection.classList.toggle('has-incomplete', hasIncompleteTasks);
                
                if (animate) {
                    // Add highlight effect
                    existingOverallSection.classList.add('highlight');
                    setTimeout(() => {
                        existingOverallSection.classList.remove('highlight');
                    }, 1500);
                }
            } else {
                // Create new overall section
                const overallSection = document.createElement('div');
                overallSection.className = 'progress-section overall';
                if (hasIncompleteTasks) {
                    overallSection.classList.add('has-incomplete');
                }
                
                // No asterisk for overall progress
                overallSection.innerHTML = `
                    <div class="progress-header">
                        <h3>Overall Progress</h3>
                        <span class="progress-count">${totalPercentage}%</span>
                    </div>
                    <div class="progress-bar-container">
                        <div class="progress-bar" style="width: ${totalPercentage}%; background-color: #0321a8;"></div>
                    </div>
                `;
                
                progressContainerBody.appendChild(overallSection);
            }
            
            // Create or update progress sections for each category
            const categories = [
                { name: 'work', label: 'Work', color: '#8A2BE2' },
                { name: 'school', label: 'School', color: '#1E90FF' },
                { name: 'personal', label: 'Personal', color: '#00CED1' }
            ];

            categories.forEach(category => {
                const stats = data.progress[category.name];
                const percentage = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
                const hasIncompleteTasks = stats.completed < stats.total && stats.total > 0;
                
                // Check if section already exists
                const existingSection = progressContainerBody.querySelector(`.progress-section[data-category="${category.name}"]`);
                
                if (existingSection) {
                    // Update existing section
                    const headerText = hasIncompleteTasks ? `${category.label} <span class="incomplete-indicator">*</span>` : category.label;
                    existingSection.querySelector('.progress-header h3').innerHTML = headerText;
                    existingSection.querySelector('.progress-count').textContent = `${stats.completed}/${stats.total}`;
                    const progressBar = existingSection.querySelector('.progress-bar');
                    progressBar.style.width = `${percentage}%`;
                    
                    // Add incomplete indicator class if there are incomplete tasks
                    existingSection.classList.toggle('has-incomplete', hasIncompleteTasks);
                    
                    // Highlight if this is the updated category
                    if (animate && updatedCategory === category.name) {
                        existingSection.classList.add('highlight');
                        setTimeout(() => {
                            existingSection.classList.remove('highlight');
                        }, 1500);
                    }
                } else {
                    // Create new section
                    const progressSection = document.createElement('div');
                    progressSection.className = 'progress-section';
                    progressSection.dataset.category = category.name;
                    if (hasIncompleteTasks) {
                        progressSection.classList.add('has-incomplete');
                    }
                    
                    const headerText = hasIncompleteTasks ? `${category.label} <span class="incomplete-indicator">*</span>` : category.label;
                    
                    progressSection.innerHTML = `
                        <div class="progress-header">
                            <h3>${headerText}</h3>
                            <span class="progress-count">${stats.completed}/${stats.total}</span>
                        </div>
                        <div class="progress-bar-container">
                            <div class="progress-bar" style="width: ${percentage}%; background-color: ${category.color};"></div>
                        </div>
                    `;
                    
                    progressContainerBody.appendChild(progressSection);
                }
            });
        } else {
            console.error('Error loading progress data:', data.message);
            showProgressError();
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showProgressError();
    });
}

/**
 * Displays an error message in the progress container
 */
function showProgressError() {
    const progressContainerBody = document.querySelector('.progress-container-body');
    
    progressContainerBody.innerHTML = `
        <div class="progress-error">
            <p>Unable to load progress data. Please try refreshing the page.</p>
            <button onclick="updateProgressBars()">Retry</button>
        </div>
    `;
}

/**
 * Creates a visual animation effect when progress is updated
 * @param {HTMLElement} progressBar - The progress bar element to animate
 * @param {number} newWidth - The new width percentage for the progress bar
 */
function animateProgressBar(progressBar, newWidth) {
    // Get current width
    const currentWidth = parseFloat(progressBar.style.width) || 0;
    
    // Set transition
    progressBar.style.transition = 'width 0.5s ease-in-out';
    
    // Set new width with a slight delay to ensure transition works
    setTimeout(() => {
        progressBar.style.width = `${newWidth}%`;
    }, 50);
}

/**
 * Highlights a specific category's progress section
 * @param {string} category - The category to highlight
 */
function highlightCategoryProgress(category) {
    const progressSection = document.querySelector(`.progress-section[data-category="${category}"]`);
    if (progressSection) {
        progressSection.classList.add('highlight');
        setTimeout(() => {
            progressSection.classList.remove('highlight');
        }, 1500);
    }
}

// Export functions to be used by other scripts
window.ProgressTracker = {
    updateProgressBars: updateProgressBars,
    highlightCategoryProgress: function(category) {
        const progressSection = document.querySelector(`.progress-section[data-category="${category}"]`);
        if (progressSection) {
            progressSection.classList.add('highlight');
            setTimeout(() => {
                progressSection.classList.remove('highlight');
            }, 1500);
        }
    }
};







