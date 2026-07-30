// This ensures the script runs after the entire HTML document has been parsed.
document.addEventListener('DOMContentLoaded', () => {

  // Typing effect
  const roles = ["Aspiring Software Developer", "Solved 150+ Coding Problems", "Completed BCA with 8.7CGPA"];
  let currentRole = 0;
  let charIndex = 0;
  let typing = true;
  const typedText = document.querySelector(".typed-text");

  function typeEffect() {
    // A guard to ensure the element exists before trying to manipulate it.
    if (!typedText) {
      return;
    }

    if (typing) {
      if (charIndex < roles[currentRole].length) {
        typedText.textContent += roles[currentRole].charAt(charIndex);
        charIndex++;
        setTimeout(typeEffect, 100);
      } else {
        typing = false;
        setTimeout(typeEffect, 2000);
      }
    } else {
      if (charIndex > 0) {
        typedText.textContent = roles[currentRole].substring(0, charIndex - 1);
        charIndex--;
        setTimeout(typeEffect, 50);
      } else {
        typing = true;
        currentRole = (currentRole + 1) % roles.length;
        setTimeout(typeEffect, 500);
      }
    }
  }
  
  // Start the typing effect on the home page
  if (typedText) {
    typeEffect();
  }

  // Mobile menu toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.getElementById("nav-links");
  
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle("show");
    });
  }

  // Smooth scrolling for same-page anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            // Also close mobile menu if it's a nav link and is open
            if (navLinks && navLinks.classList.contains('show') && this.closest('#nav-links')) {
                navLinks.classList.remove('show');
            }
        }
    });
  });

  // Handle smooth scroll on page load for cross-page anchor links
  if (window.location.hash) {
    const targetElement = document.querySelector(window.location.hash);
    if (targetElement) {
      // Use a timeout to ensure the page has time to lay out, especially with images
      setTimeout(() => {
        const navbarHeight = document.querySelector('.navbar').offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }, 100); // A small delay can help
    }
  }


  // Scroll-in animations using IntersectionObserver
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        
        // Dynamic staggering for child cards
        const cards = entry.target.querySelectorAll('.skill-card, .service-card, .project-card, .achievement-item');
        cards.forEach((card, index) => {
          card.style.transitionDelay = `${index * 80}ms`;
          card.classList.add('visible');
        });
      }
    });
  }, {
    threshold: 0.1
  });

  const fadeElements = document.querySelectorAll('.fade-in');
  fadeElements.forEach(el => observer.observe(el));

  // Mobile Projects Carousel Logic & Setup
  const projectGrid = document.querySelector('.project-grid');
  const projectDotsContainer = document.getElementById('projects-dots');
  const viewAllBtn = document.getElementById('view-all-projects-btn');
  const viewAllContainer = document.getElementById('view-all-projects-container');
  const projectsSection = document.getElementById('projects') || document.getElementById('all-projects');
  
  let currentProjectsFilter = 'all';
  let isProjectsExpanded = false;

  function updateProjectsDisplay() {
    if (!projectGrid) return;
    
    const projectCards = projectGrid.querySelectorAll('.project-card');
    
    // 1. Determine cards that match the filter
    const matchingCards = [];
    
    projectCards.forEach(card => {
      const categories = card.dataset.category.split(' ');
      if (currentProjectsFilter === 'all' || categories.includes(currentProjectsFilter)) {
        matchingCards.push(card);
      } else {
        card.style.display = 'none';
        card.classList.remove('fade-in-card');
      }
    });
    
    // 2. Decide how many to show based on expansion state
    const limit = 6;
    const needsToggle = matchingCards.length > limit;
    
    matchingCards.forEach((card, index) => {
      if (isProjectsExpanded || index < limit) {
        card.style.display = 'flex';
        card.classList.add('visible');
        card.style.transitionDelay = '0ms'; // Snap transition instant on filter click
        // Add smooth slide fade animation if expanded and beyond initial limit
        if (isProjectsExpanded && index >= limit) {
          card.classList.add('fade-in-card');
        } else {
          card.classList.remove('fade-in-card');
        }
      } else {
        card.style.display = 'none';
        card.classList.remove('fade-in-card');
      }
    });
    
    // 3. Handle "View All" Button visibility and text
    if (viewAllContainer && viewAllBtn) {
      if (needsToggle) {
        viewAllContainer.style.display = 'block';
        if (isProjectsExpanded) {
          viewAllBtn.textContent = 'Show Less';
        } else {
          viewAllBtn.textContent = 'View All Projects';
        }
      } else {
        viewAllContainer.style.display = 'none';
      }
    }
    
    // 4. Update the carousel dots
    setupProjectsCarousel();
  }

  function setupProjectsCarousel() {
    if (!projectGrid || !projectDotsContainer) return;
    
    // Clear existing dots
    projectDotsContainer.innerHTML = '';

    // Get currently active/visible cards (those whose style display is flex)
    const visibleCards = Array.from(projectGrid.querySelectorAll('.project-card')).filter(card => {
      return card.style.display === 'flex';
    });

    if (visibleCards.length <= 1) {
      return; // No dots needed if 1 or 0 projects are visible
    }

    // Generate dots
    visibleCards.forEach((_, index) => {
      const dot = document.createElement('div');
      dot.classList.add('carousel-dot');
      if (index === 0) dot.classList.add('active');
      
      // Click dot to scroll to card
      dot.addEventListener('click', () => {
        const cardWidth = visibleCards[0].getBoundingClientRect().width;
        const gridGap = parseFloat(window.getComputedStyle(projectGrid).gap) || 20;
        projectGrid.scrollTo({
          left: index * (cardWidth + gridGap),
          behavior: 'smooth'
        });
      });
      
      projectDotsContainer.appendChild(dot);
    });
  }

  // Project filtering logic
  if (projectsSection) {
      const filterButtons = projectsSection.querySelectorAll('.filter-btn');

      filterButtons.forEach(button => {
        button.addEventListener('click', () => {
          // Set active class on button
          filterButtons.forEach(btn => btn.classList.remove('active'));
          button.classList.add('active');

          currentProjectsFilter = button.dataset.filter;
          
          // Reset scroll and expansion state on filter change
          if (projectGrid) {
            projectGrid.scrollLeft = 0;
          }
          isProjectsExpanded = false; 
          
          updateProjectsDisplay();
        });
      });
  }

  // View All / Show Less button click action
  if (viewAllBtn) {
    viewAllBtn.addEventListener('click', () => {
      isProjectsExpanded = !isProjectsExpanded;
      
      // If collapsing back, scroll back to top of projects section smoothly
      if (!isProjectsExpanded && projectsSection) {
        const navbarHeight = document.querySelector('.navbar').offsetHeight;
        const targetPosition = projectsSection.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
      
      updateProjectsDisplay();
    });
  }

  if (projectGrid && projectDotsContainer) {
    // Scroll listener to update active dot
    projectGrid.addEventListener('scroll', () => {
      const visibleCards = Array.from(projectGrid.querySelectorAll('.project-card')).filter(card => {
        return card.style.display === 'flex';
      });
      if (visibleCards.length <= 1) return;

      const scrollPosition = projectGrid.scrollLeft;
      const cardWidth = visibleCards[0].getBoundingClientRect().width;
      const gridGap = parseFloat(window.getComputedStyle(projectGrid).gap) || 20;
      const activeIndex = Math.round(scrollPosition / (cardWidth + gridGap));

      const dots = projectDotsContainer.querySelectorAll('.carousel-dot');
      dots.forEach((dot, idx) => {
        if (idx === activeIndex) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    });

    // Initialize projects display on load
    updateProjectsDisplay();
  }

  // Mobile Carousel Dots Logic
  const servicesGrid = document.querySelector('.services-grid');
  const dotsContainer = document.getElementById('services-dots');

  if (servicesGrid && dotsContainer) {
    const cards = servicesGrid.querySelectorAll('.service-card');
    
    // Generate dots
    cards.forEach((_, index) => {
      const dot = document.createElement('div');
      dot.classList.add('carousel-dot');
      if (index === 0) dot.classList.add('active');
      
      // Click dot to scroll to card
      dot.addEventListener('click', () => {
        const cardWidth = cards[0].getBoundingClientRect().width;
        const gridGap = parseFloat(window.getComputedStyle(servicesGrid).gap) || 20;
        servicesGrid.scrollTo({
          left: index * (cardWidth + gridGap),
          behavior: 'smooth'
        });
      });
      
      dotsContainer.appendChild(dot);
    });

    // Update dots on scroll
    servicesGrid.addEventListener('scroll', () => {
      const scrollPosition = servicesGrid.scrollLeft;
      const cardWidth = cards[0].getBoundingClientRect().width;
      const gridGap = parseFloat(window.getComputedStyle(servicesGrid).gap) || 20;
      
      // Add half card width to make the active dot switch precisely in the middle of transition
      const activeIndex = Math.round(scrollPosition / (cardWidth + gridGap));
      
      const dots = dotsContainer.querySelectorAll('.carousel-dot');
      dots.forEach((dot, idx) => {
        if (idx === activeIndex) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    });
  }
});