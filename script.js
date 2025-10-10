// This ensures the script runs after the entire HTML document has been parsed.
document.addEventListener('DOMContentLoaded', () => {

  // Typing effect
  const roles = ["Developer", "Programmer", "Aspiring Data Engineer"];
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


  // Scroll-in animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1
  });

  const fadeElements = document.querySelectorAll('.fade-in');
  fadeElements.forEach(el => observer.observe(el));

  // Project filtering logic
  const projectsSection = document.getElementById('projects') || document.getElementById('all-projects');
  if (projectsSection) {
      const filterButtons = projectsSection.querySelectorAll('.filter-btn');
      const projectCards = projectsSection.querySelectorAll('.project-card');

      filterButtons.forEach(button => {
        button.addEventListener('click', () => {
          // Set active class on button
          filterButtons.forEach(btn => btn.classList.remove('active'));
          button.classList.add('active');

          const filter = button.dataset.filter;

          // Show/hide project cards based on filter
          projectCards.forEach(card => {
            const categories = card.dataset.category.split(' ');
            if (filter === 'all' || categories.includes(filter)) {
              card.style.display = 'flex'; // Use display flex to maintain consistency
            } else {
              card.style.display = 'none';
            }
          });
        });
      });
  }
});