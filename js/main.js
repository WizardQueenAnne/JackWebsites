/*
 * JackWeb - Portfolio Website
 * Author: Jack
 * Version: 2.0
 */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // Preloader
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', function() {
        preloader.style.opacity = '0';
        setTimeout(function() {
            preloader.style.display = 'none';
        }, 500);
    });

    // Sticky Header
    const header = document.querySelector('.header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
    });

    // Mobile Navigation
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking a nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Active Navigation Link
    const sections = document.querySelectorAll('section[id]');
    
    function scrollActive() {
        const scrollY = window.pageYOffset;
        
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 100;
            const sectionId = current.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelector('.nav-link[href*=' + sectionId + ']').classList.add('active');
            } else {
                document.querySelector('.nav-link[href*=' + sectionId + ']').classList.remove('active');
            }
        });
    }
    
    window.addEventListener('scroll', scrollActive);

    // Counter Animation
    const counters = document.querySelectorAll('.stat-number');
    let started = false;
    
    function startCounter() {
        if (window.scrollY > 200 && !started) {
            counters.forEach(counter => {
                const target = +counter.dataset.count;
                let count = 0;
                const increment = target / 50;
                
                function updateCount() {
                    if (count < target) {
                        count += increment;
                        counter.innerHTML = Math.ceil(count);
                        setTimeout(updateCount, 30);
                    } else {
                        counter.innerHTML = target;
                    }
                }
                
                updateCount();
            });
            
            started = true;
        }
    }
    
    window.addEventListener('scroll', startCounter);

    // AOS Animation Library Initialization
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });

    // Portfolio Filter
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            portfolioItems.forEach(item => {
                if (filterValue === 'all' || item.classList.contains(filterValue)) {
                    item.style.display = 'block';
                    
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 200);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 200);
                }
            });
        });
    });

    // Portfolio Modal
    const modalLinks = document.querySelectorAll('.portfolio-link');
    const modals = document.querySelectorAll('.portfolio-modal');
    const closeButtons = document.querySelectorAll('.modal-close');
    
    modalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const modalId = this.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            
            modal.style.display = 'block';
            document.body.classList.add('modal-open');
            
            setTimeout(() => {
                modal.querySelector('.modal-content').style.opacity = '1';
            }, 100);
        });
    });
    
    function closeModal() {
        modals.forEach(modal => {
            modal.querySelector('.modal-content').style.opacity = '0';
            
            setTimeout(() => {
                modal.style.display = 'none';
                document.body.classList.remove('modal-open');
            }, 300);
        });
    }
    
    closeButtons.forEach(button => {
        button.addEventListener('click', closeModal);
    });
    
    // Close modal when clicking outside of content
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }
        });
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });

    // Testimonials Slider
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    const prevButton = document.querySelector('.testimonial-prev');
    const nextButton = document.querySelector('.testimonial-next');
    const dotsContainer = document.querySelector('.testimonial-dots');
    let currentSlide = 0;
    
    // Create dots
    testimonialSlides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        
        dot.addEventListener('click', () => {
            goToSlide(index);
        });
        
        dotsContainer.appendChild(dot);
    });
    
    const dots = document.querySelectorAll('.dot');
    
    // Initialize slider
    function initSlider() {
        testimonialSlides.forEach((slide, index) => {
            if (index === 0) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });
    }
    
    // Go to specific slide
    function goToSlide(slideIndex) {
        testimonialSlides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        testimonialSlides[slideIndex].classList.add('active');
        dots[slideIndex].classList.add('active');
        currentSlide = slideIndex;
    }
    
    // Previous slide
    function prevSlide() {
        if (currentSlide === 0) {
            goToSlide(testimonialSlides.length - 1);
        } else {
            goToSlide(currentSlide - 1);
        }
    }
    
    // Next slide
    function nextSlide() {
        if (currentSlide === testimonialSlides.length - 1) {
            goToSlide(0);
        } else {
            goToSlide(currentSlide + 1);
        }
    }
    
    // Event listeners for controls
    prevButton.addEventListener('click', prevSlide);
    nextButton.addEventListener('click', nextSlide);
    
    // Auto slide
    let slideInterval = setInterval(nextSlide, 5000);
    
    // Pause auto slide on hover
    const testimonialSlider = document.querySelector('.testimonial-slider');
    
    testimonialSlider.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });
    
    testimonialSlider.addEventListener('mouseleave', () => {
        slideInterval = setInterval(nextSlide, 5000);
    });
    
    // Initialize slider
    initSlider();

    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle active class
            item.classList.toggle('active');
        });
    });

    // Pricing Toggle
    const pricingSwitch = document.getElementById('pricing-switch');
    const payOnceLabel = document.querySelector('.toggle-label:first-child');
    const monthlyLabel = document.querySelector('.toggle-label:last-child');
    const starterOneTime = document.getElementById('starter-onetime');
    const starterMonthly = document.getElementById('starter-monthly');
    const standardOneTime = document.getElementById('standard-onetime');
    const standardMonthly = document.getElementById('standard-monthly');
    
    pricingSwitch.addEventListener('change', function() {
        if (this.checked) {
            payOnceLabel.classList.remove('active');
            monthlyLabel.classList.add('active');
            
            starterOneTime.classList.remove('active');
            starterMonthly.classList.add('active');
            
            standardOneTime.classList.remove('active');
            standardMonthly.classList.add('active');
        } else {
            payOnceLabel.classList.add('active');
            monthlyLabel.classList.remove('active');
            
            starterOneTime.classList.add('active');
            starterMonthly.classList.remove('active');
            
            standardOneTime.classList.add('active');
            standardMonthly.classList.remove('active');
        }
    });

    // Contact Form Validation and Submission
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simple form validation
            let valid = true;
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const message = document.getElementById('message');
            
            if (name.value.trim() === '') {
                valid = false;
                name.classList.add('is-invalid');
            } else {
                name.classList.remove('is-invalid');
            }
            
            if (email.value.trim() === '' || !isValidEmail(email.value)) {
                valid = false;
                email.classList.add('is-invalid');
            } else {
                email.classList.remove('is-invalid');
            }
            
            if (message.value.trim() === '') {
                valid = false;
                message.classList.add('is-invalid');
            } else {
                message.classList.remove('is-invalid');
            }
            
            if (valid) {
                // Simulate form submission - replace with actual submission code
                const submitButton = contactForm.querySelector('button[type="submit"]');
                submitButton.disabled = true;
                submitButton.textContent = 'Sending...';
                
                setTimeout(() => {
                    // Reset form
                    contactForm.reset();
                    
                    // Show success message
                    const successMessage = document.createElement('div');
                    successMessage.className = 'success-message';
                    successMessage.innerHTML = '<i class="fas fa-check-circle"></i> Your message has been sent successfully!';
                    
                    contactForm.appendChild(successMessage);
                    
                    // Reset button
                    submitButton.disabled = false;
                    submitButton.textContent = 'Send Message';
                    
                    // Remove success message after 5 seconds
                    setTimeout(() => {
                        successMessage.remove();
                    }, 5000);
                }, 2000);
            }
        });
    }
    
    // Email validation helper
    function isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    // Newsletter Form
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const submitButton = this.querySelector('button');
            
            if (emailInput.value.trim() !== '' && isValidEmail(emailInput.value)) {
                submitButton.disabled = true;
                submitButton.textContent = 'Subscribing...';
                
                setTimeout(() => {
                    // Reset form
                    this.reset();
                    
                    // Show success message
                    const successMessage = document.createElement('div');
                    successMessage.className = 'success-message';
                    successMessage.innerHTML = '<i class="fas fa-check-circle"></i> Thank you for subscribing!';
                    
                    this.appendChild(successMessage);
                    
                    // Reset button
                    submitButton.disabled = false;
                    submitButton.textContent = 'Subscribe';
                    
                    // Remove success message after 5 seconds
                    setTimeout(() => {
                        successMessage.remove();
                    }, 5000);
                }, 1500);
            } else {
                emailInput.classList.add('is-invalid');
                
                setTimeout(() => {
                    emailInput.classList.remove('is-invalid');
                }, 3000);
            }
        });
    }

    // Back to Top Button
    const backToTop = document.querySelector('.back-to-top');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('active');
        } else {
            backToTop.classList.remove('active');
        }
    });
    
    backToTop.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Add simple particle effects for hero section
    const heroParticles = document.querySelector('.hero-particles');
    
    if (heroParticles) {
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('span');
            particle.className = 'particle';
            
            // Random position, size, and animation delay
            const size = Math.random() * 10 + 1;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 5 + 's';
            particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
            
            heroParticles.appendChild(particle);
        }
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Live Chat Widget
    const chatButton = document.getElementById('chatButton');
    const chatBox = document.getElementById('chatBox');
    const chatClose = document.getElementById('chatClose');
    const chatMessages = document.getElementById('chatMessages');
    const messageInput = document.getElementById('messageInput');
    const sendMessage = document.getElementById('sendMessage');
    
    // Toggle chat box
    chatButton.addEventListener('click', () => {
        chatBox.classList.toggle('active');
        chatButton.style.display = 'none';
    });
    
    chatClose.addEventListener('click', () => {
        chatBox.classList.remove('active');
        chatButton.style.display = 'flex';
    });
    
    // Send message
    function sendUserMessage() {
        const message = messageInput.value.trim();
        
        if (message !== '') {
            // Add user message
            addMessage('sent', message);
            
            // Clear input
            messageInput.value = '';
            
            // Simulate bot response after delay
            setTimeout(() => {
                let botResponse;
                
                // Simple bot responses based on keywords
                if (message.toLowerCase().includes('pricing') || message.toLowerCase().includes('cost') || message.toLowerCase().includes('price')) {
                    botResponse = "My packages start at $150 for a basic website. Check out the pricing section for more details, or let me know your specific needs for a custom quote!";
                } else if (message.toLowerCase().includes('time') || message.toLowerCase().includes('how long') || message.toLowerCase().includes('deadline')) {
                    botResponse = "Most projects are completed within 1-2 weeks, depending on complexity. I always aim to deliver on time without compromising quality!";
                } else if (message.toLowerCase().includes('contact') || message.toLowerCase().includes('email') || message.toLowerCase().includes('phone')) {
                    botResponse = "You can reach me at jack@jackwebsites.com or call/text me at (206) 555-1234. I'm usually available on weekdays after 3:30 PM and weekends all day.";
                } else {
                    botResponse = "Thanks for your message! I'll get back to you shortly. In the meantime, feel free to check out my portfolio or pricing packages.";
                }
                
                addMessage('received', botResponse);
                
                // Scroll to the bottom
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 1000);
        }
    }
    
    // Add a message to the chat
    function addMessage(type, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.innerHTML = `<p>${content}</p>`;
        
        const messageTime = document.createElement('span');
        messageTime.className = 'message-time';
        
        // Get current time
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        messageTime.textContent = `${hours}:${minutes}`;
        
        messageDiv.appendChild(messageContent);
        messageDiv.appendChild(messageTime);
        
        chatMessages.appendChild(messageDiv);
        
        // Scroll to the bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Send message when clicking send button
    sendMessage.addEventListener('click', sendUserMessage);
    
    // Send message when pressing Enter
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendUserMessage();
        }
    });

    // Cookie Consent
    const cookieConsent = document.getElementById('cookieConsent');
    const cookieAccept = document.getElementById('cookieAccept');
    const cookieDecline = document.getElementById('cookieDecline');
    
    // Check if user has already made a choice
    if (!localStorage.getItem('cookieConsent')) {
        // Show cookie consent after 2 seconds
        setTimeout(() => {
            cookieConsent.classList.add('active');
        }, 2000);
    }
    
    cookieAccept.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'accepted');
        cookieConsent.classList.remove('active');
    });
    
    cookieDecline.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'declined');
        cookieConsent.classList.remove('active');
    });

    // Typing animation effect for hero title (using JS, not a library)
    function typeWriterEffect() {
        const heroTitle = document.querySelector('.hero-title');
        if (!heroTitle) return;
        
        const originalText = heroTitle.innerHTML;
        const highlightElements = heroTitle.querySelectorAll('.highlight');
        
        // Save highlight elements text
        const highlightTexts = [];
        highlightElements.forEach(el => {
            highlightTexts.push(el.textContent);
            el.textContent = ''; // Clear highlight elements temporarily
        });
        
        // Replace highlight elements with a placeholder
        let plainText = heroTitle.textContent;
        heroTitle.innerHTML = '';
        
        const speed = 50; // Speed of typing
        let i = 0;
        let highlightIndex = 0;
        
        // Reset first to avoid any issues
        heroTitle.innerHTML = '';
        
        // Typing effect
        function type() {
            if (i < plainText.length) {
                heroTitle.innerHTML += plainText.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                // After typing plain text, restore highlight elements
                heroTitle.innerHTML = originalText;
                
                // Apply a typing effect to highlight elements
                highlightElements.forEach((el, index) => {
                    typeHighlight(el, highlightTexts[index], 0);
                });
            }
        }
        
        // Type highlight text with a different speed
        function typeHighlight(element, text, index) {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                setTimeout(() => typeHighlight(element, text, index + 1), speed);
            }
        }
        
        setTimeout(type, 500); // Delay start for a better effect
    }
    
    // Only run the typing effect once when the page loads
    setTimeout(typeWriterEffect, 1000);

    // Dark Mode Toggle (if supported by browser)
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const body = document.body;
    
    if (prefersDarkScheme.matches) {
        body.classList.add('dark-mode-support');
    }
    
    // Theme preference detection
    const colorTheme = localStorage.getItem('theme');
    
    if (colorTheme === 'dark') {
        body.classList.add('dark-mode-support');
    } else if (colorTheme === 'light') {
        body.classList.remove('dark-mode-support');
    }

    // Add animated effect to action buttons
    document.querySelectorAll('.cta .btn').forEach(btn => {
        btn.classList.add('btn-pulse');
    });

    // Add interactive touch effects for mobile users
    document.querySelectorAll('.btn, .portfolio-item, .service-card, .about-card, .pricing-card, .faq-question, .social-link').forEach(element => {
        element.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.95)';
        });
        
        element.addEventListener('touchend', function() {
            this.style.transform = '';
        });
    });

    // Function to add or remove animation classes
    function animateOnScroll() {
        const elements = document.querySelectorAll('.animate-on-scroll');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                // Add animation class based on data attribute
                const animation = element.getAttribute('data-animation') || 'fadeInUp';
                element.classList.add(`animate-${animation}`);
            }
        });
    }
    
    // Run on scroll
    window.addEventListener('scroll', animateOnScroll);
    
    // Run once on page load
    animateOnScroll();

    // Add CSS rule for particles (added via JS for clean HTML)
    const style = document.createElement('style');
    style.textContent = `
        .particle {
            position: absolute;
            border-radius: 50%;
            background-color: rgba(67, 97, 238, 0.2);
            pointer-events: none;
            animation: float-particle linear infinite;
        }
        
        @keyframes float-particle {
            0% {
                transform: translateY(0) translateX(0);
                opacity: 0;
            }
            50% {
                opacity: 0.5;
            }
            100% {
                transform: translateY(-100px) translateX(100px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Initialize all tooltips (if any)
    document.querySelectorAll('[data-tooltip]').forEach(element => {
        element.addEventListener('mouseenter', function() {
            const tooltipText = this.getAttribute('data-tooltip');
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = tooltipText;
            document.body.appendChild(tooltip);
            
            // Position the tooltip above the element
            const rect = this.getBoundingClientRect();
            tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
            
            // Add active class to show with animation
            setTimeout(() => {
                tooltip.classList.add('active');
            }, 10);
            
            // Remove tooltip on mouseleave
            this.addEventListener('mouseleave', function handler() {
                tooltip.classList.remove('active');
                
                setTimeout(() => {
                    document.body.removeChild(tooltip);
                }, 300);
                
                this.removeEventListener('mouseleave', handler);
            });
        });
    });

    console.log('JackWeb - Website loaded successfully!');
});
