document.addEventListener('DOMContentLoaded', function() {
    const projectsGrid = document.querySelector('.projects-grid');
    const showReleasedOnly = document.getElementById('showReleasedOnly');
    const sortSelect = document.getElementById('sortProjects');
    
    function filterAndSortProjects() {
        const projects = Array.from(document.querySelectorAll('.project-card'));
        
        // Filtreleme
        projects.forEach(project => {
            if (showReleasedOnly.checked) {
                project.style.display = project.dataset.status === 'released' || project.dataset.status === 'beta' 
                    ? 'block' : 'none';
            } else {
                project.style.display = 'block';
            }
        });
        
        // Sıralama
        const visibleProjects = projects.filter(p => p.style.display !== 'none');
        
        visibleProjects.sort((a, b) => {
            switch(sortSelect.value) {
                case 'newest':
                    return new Date(b.dataset.date) - new Date(a.dataset.date);
                case 'oldest':
                    return new Date(a.dataset.date) - new Date(b.dataset.date);
                case 'name':
                    return a.querySelector('h2').textContent.localeCompare(
                        b.querySelector('h2').textContent
                    );
                case 'status':
                    const statusOrder = {
                        'released': 1,
                        'beta': 2,
                        'development': 3,
                        'prototype': 4,
                        'concept': 5
                    };
                    return statusOrder[a.dataset.status] - statusOrder[b.dataset.status];
            }
        });
        
        // DOM'u güncelle
        visibleProjects.forEach(project => {
            projectsGrid.appendChild(project);
        });
    }
    
    // Event listeners
    showReleasedOnly.addEventListener('change', filterAndSortProjects);
    sortSelect.addEventListener('change', filterAndSortProjects);
    
    // İlk yükleme
    filterAndSortProjects();
}); 