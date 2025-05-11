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
            
            // Simulate bot response after delay
            setTimeout(() => {
                let botResponse;
                
                // Simple bot responses based on keywords
                if (message.toLowerCase().includes('pricing') || message.toLowerCase().includes('cost') || message.toLowerCase().includes('price')) {
                    botResponse = "My packages start at $75 for a basic website. Check out the pricing section for more details, or let me know your specific needs for a custom quote!";
                } else if (message.toLowerCase().includes('time') || message.toLowerCase().includes('how long') || message.toLowerCase().includes('deadline')) {
                    botResponse = "Most projects are completed within 1-2 weeks, depending on complexity. I always aim to deliver on time without compromising quality!";
                } else if (message.toLowerCase().includes('contact') || message.toLowerCase().includes('email') || message.toLowerCase().includes('phone')) {
                    botResponse = "You can reach me at jacksseattlewebsites@gmail.com or call/text me at (206) 555-1234. I'm usually available quickly to answer questions!";
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
    
    cookie
