/*
 * Jack's Seattle Websites - Professional Web Design
 * Author: Jack
 * Version: 1.0
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

    // Contact Form Validation and Submission
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simple form validation
            let valid = true;
            const name = document.getElementById('name');
            const businessName = document.getElementById('businessName');
            const email = document.getElementById('email');
            const phone = document.getElementById('phone');
            const websitePlan = document.getElementById('websitePlan');
            const rushDelivery = document.getElementById('rushDelivery');
            const budget = document.getElementById('budget');
            const message = document.getElementById('message');
            
            if (name.value.trim() === '') {
                valid = false;
                name.classList.add('is-invalid');
            } else {
                name.classList.remove('is-invalid');
            }
            
            if (businessName.value.trim() === '') {
                valid = false;
                businessName.classList.add('is-invalid');
            } else {
                businessName.classList.remove('is-invalid');
            }
            
            if (email.value.trim() === '' || !isValidEmail(email.value)) {
                valid = false;
                email.classList.add('is-invalid');
            } else {
                email.classList.remove('is-invalid');
            }
            
            if (websitePlan.value === '') {
                valid = false;
                websitePlan.classList.add('is-invalid');
            } else {
                websitePlan.classList.remove('is-invalid');
            }
            
            if (valid) {
                // Prepare the form data
                const formData = {
                    name: name.value.trim(),
                    businessName: businessName.value.trim(),
                    email: email.value.trim(),
                    phone: phone.value.trim(),
                    websitePlan: websitePlan.value,
                    rushDelivery: rushDelivery.value,
                    budget: budget.value.trim(),
                    message: message.value.trim()
                };
                
                // Disable submit button and show loading state
                const submitButton = contactForm.querySelector('button[type="submit"]');
                const originalButtonText = submitButton.textContent;
                submitButton.disabled = true;
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                
                // Send form data to backend API
                fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        // Reset form
                        contactForm.reset();
                        
                        // Show success message
                        const successMessage = document.createElement('div');
                        successMessage.className = 'success-message';
                        successMessage.innerHTML = '<i class="fas fa-check-circle"></i> ' + (data.message || 'Thanks! I\'ll get back to you shortly.');
                        
                        contactForm.appendChild(successMessage);
                        
                        // Remove success message after 5 seconds
                        setTimeout(() => {
                            successMessage.remove();
                        }, 5000);
                    } else {
                        // Show error message
                        const errorMessage = document.createElement('div');
                        errorMessage.className = 'error-message';
                        errorMessage.innerHTML = '<i class="fas fa-exclamation-circle"></i> ' + (data.error || 'Something went wrong. Please try again later.');
                        
                        contactForm.appendChild(errorMessage);
                        
                        // Remove error message after 5 seconds
                        setTimeout(() => {
                            errorMessage.remove();
                        }, 5000);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    
                    // Show error message
                    const errorMessage = document.createElement('div');
                    errorMessage.className = 'error-message';
                    errorMessage.innerHTML = '<i class="fas fa-exclamation-circle"></i> Network error. Please try again later.';
                    
                    contactForm.appendChild(errorMessage);
                    
                    // Remove error message after 5 seconds
                    setTimeout(() => {
                        errorMessage.remove();
                    }, 5000);
                })
                .finally(() => {
                    // Reset button
                    submitButton.disabled = false;
                    submitButton.innerHTML = originalButtonText;
                });
            }
        });
    }
    
    // Email validation helper
    function isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

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
            
            // Send message to backend for email notification
            fetch('/api/chat-message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    name: 'Website Visitor' // Could be replaced with a name input if needed
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success && data.response) {
                    // Add bot response from server
                    setTimeout(() => {
                        addMessage('received', data.response);
                        // Scroll to the bottom
                        chatMessages.scrollTop = chatMessages.scrollHeight;
                    }, 1000);
                } else {
                    // Fallback response if server doesn't provide one
                    setTimeout(() => {
                        addMessage('received', "Thanks for your message! I'll get back to you shortly.");
                        // Scroll to the bottom
                        chatMessages.scrollTop = chatMessages.scrollHeight;
                    }, 1000);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                // Fallback response in case of network error
                setTimeout(() => {
                    addMessage('received', "Thanks for your message! I'll get back to you shortly.");
                    // Scroll to the bottom
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }, 1000);
            });
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
    const cookiePolicy = document.getElementById('cookiePolicy');
    
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
    
    // Newsletter Form
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            
            if (emailInput.value.trim() !== '' && isValidEmail(emailInput.value)) {
                // Send the email to backend for notification
                const submitButton = this.querySelector('button');
                submitButton.disabled = true;
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                
                fetch('/api/newsletter', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: emailInput.value.trim()
                    })
                })
                .then(response => response.json())
                .then(data => {
                    // Reset form
                    this.reset();
                    
                    // Show success message
                    const successMessage = document.createElement('div');
                    successMessage.className = 'success-message';
                    successMessage.innerHTML = '<i class="fas fa-check-circle"></i> Thank you for subscribing!';
                    
                    this.appendChild(successMessage);
                    
                    // Reset button
                    submitButton.disabled = false;
                    submitButton.innerHTML = 'Subscribe';
                    
                    // Remove success message after 5 seconds
                    setTimeout(() => {
                        successMessage.remove();
                    }, 5000);
                })
                .catch(error => {
                    console.error('Error:', error);
                    
                    // Show error message
                    const errorMessage = document.createElement('div');
                    errorMessage.className = 'error-message';
                    errorMessage.innerHTML = '<i class="fas fa-exclamation-circle"></i> Error subscribing. Please try again.';
                    
                    this.appendChild(errorMessage);
                    
                    // Reset button
                    submitButton.disabled = false;
                    submitButton.innerHTML = 'Subscribe';
                    
                    // Remove error message after 5 seconds
                    setTimeout(() => {
                        errorMessage.remove();
                    }, 5000);
                });
            } else {
                emailInput.classList.add('is-invalid');
                
                // Shake animation for invalid input
                emailInput.classList.add('shake');
                
                setTimeout(() => {
                    emailInput.classList.remove('shake');
                }, 500);
                
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

    // Add particle effects for hero section
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

    // Initialize all tooltips
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

    // Portfolio Items modal functionality
    const portfolioLinks = document.querySelectorAll('.portfolio-link');
    
    if (portfolioLinks.length > 0) {
        portfolioLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // You could implement a modal here or redirect to a project page
                alert('Portfolio project details would show here in a modal. This is a placeholder.');
            });
        });
    }

    // Function to add animations on scroll
    function animateOnScroll() {
        const animateElements = document.querySelectorAll('[data-animate]');
        
        animateElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            // If element is in viewport
            if (rect.top <= windowHeight * 0.8 && rect.bottom >= 0) {
                const animation = element.getAttribute('data-animate');
                element.classList.add(`animate-${animation}`);
            }
        });
    }
    
    // Run animate on scroll function
    window.addEventListener('scroll', animateOnScroll);
    
    // Run once on page load
    setTimeout(animateOnScroll, 500);
    
    // Add shake animation style (for form validation)
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .shake {
            animation: shake 0.5s ease;
        }
    `;
    document.head.appendChild(style);
    
    console.log("Jack's Seattle Websites - Website loaded successfully!");
});
