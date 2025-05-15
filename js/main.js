/* 
 * Enhanced Chat JavaScript Code
 * Complete main.js file with form submission fix
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

   // Counter Animation - Start immediately on page load
const counters = document.querySelectorAll('.stat-number');
let started = false;

function startCounter() {
    if (!started) {
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

// Run counter animation on page load instead of scroll
window.addEventListener('load', startCounter);
// Also keep the scroll event as a backup
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

    // Check for URL parameters to display thank you message
    function checkURLParameters() {
        const urlParams = new URLSearchParams(window.location.search);
        
        if (urlParams.has('thankyou') && urlParams.get('thankyou') === 'true') {
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.innerHTML = '<i class="fas fa-check-circle"></i> Thanks! Your message has been sent. I\'ll get back to you shortly.';
                
                const formWrapper = contactSection.querySelector('.contact-form-wrapper');
                if (formWrapper) {
                    formWrapper.prepend(successMessage);
                    
                    setTimeout(() => {
                        successMessage.remove();
                    }, 8000);
                }
                
                // Remove the parameter from URL without refreshing
                const newURL = window.location.protocol + "//" + window.location.host + window.location.pathname;
                window.history.replaceState({path: newURL}, '', newURL);
            }
        }
        
        if (urlParams.has('newsletter') && urlParams.get('newsletter') === 'subscribed') {
            const footer = document.querySelector('.footer');
            if (footer) {
                const newsletterForm = footer.querySelector('.newsletter-form');
                if (newsletterForm) {
                    const successMessage = document.createElement('div');
                    successMessage.className = 'success-message';
                    successMessage.innerHTML = '<i class="fas fa-check-circle"></i> Thank you for subscribing!';
                    
                    newsletterForm.after(successMessage);
                    
                    setTimeout(() => {
                        successMessage.remove();
                    }, 8000);
                }
                
                // Remove the parameter from URL without refreshing
                const newURL = window.location.protocol + "//" + window.location.host + window.location.pathname;
                window.history.replaceState({path: newURL}, '', newURL);
            }
        }
    }
    
    // Run check for URL parameters on page load
    checkURLParameters();

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
        
        // Load previous messages from localStorage
        loadChatMessages();
    });
    
    chatClose.addEventListener('click', () => {
        chatBox.classList.remove('active');
        chatButton.style.display = 'flex';
    });
    
    // Advanced chat response function
    function getChatResponse(message) {
        // Convert to lowercase for easier matching
        const text = message.toLowerCase();
        
        // Pricing related questions
        if (text.includes('price') || text.includes('cost') || text.includes('fee') || 
            text.includes('pricing') || text.includes('package') || text.includes('how much') || 
            text.includes('rates') || text.includes('charges')) {
            return `
                Here are my website package prices:
                
                🚀 Starter (1 Page): $75 one-time fee
                🏪 Standard (2-3 Pages): $125 one-time fee
                💼 Advanced (4-6 Pages): $200 one-time fee
                
                I also offer:
                ⚡ 24-Hour Rush Delivery: +25% surcharge
                🔧 Monthly Maintenance: $5/month
                
                All prices are one-time payments. You'll only need to pay separately for domain registration (~$12-15/year) and hosting (~$5-10/month).
                
                Would you like more details about any specific package?
            `;
        }
        
        // Timeline/Delivery questions
        else if (text.includes('time') || text.includes('how long') || text.includes('deadline') || 
                 text.includes('turnaround') || text.includes('deliver') || text.includes('finish') || 
                 text.includes('complete') || text.includes('fast') || text.includes('quick') ||
                 text.includes('rush') || text.includes('urgent')) {
            return `
                My standard delivery timeline is 1-3 days for most websites.
                
                Need it faster? I offer a 24-hour rush delivery option for an additional 25% of the base package price.
                
                The timeline depends slightly on the complexity of your website and how quickly you can provide content (text, images, etc.).
                
                Let me know if you have a specific deadline in mind!
            `;
        }
        
        // Domain and hosting questions
        else if (text.includes('domain') || text.includes('hosting') || text.includes('host') || 
                 text.includes('url') || text.includes('website address') || text.includes('godaddy') || 
                 text.includes('namecheap') || text.includes('server')) {
            return `
                For domain names and hosting:
                
                1. Domain names cost about $12-15/year (like yourname.com)
                2. Hosting typically costs $5-10/month
                
                You'll own these accounts and pay for them directly. I'll help you set everything up and can recommend affordable options like Namecheap for domains and services like Netlify for hosting.
                
                I don't mark up these costs - you'll pay the provider directly so you maintain full ownership.
            `;
        }
        
        // Services/what's included questions
        else if (text.includes('service') || text.includes('include') || text.includes('offer') || 
                 text.includes('provide') || text.includes('feature') || text.includes('what do you do') || 
                 text.includes('what you do') || text.includes('come with')) {
            return `
                My website services include:
                
                ✅ Custom, mobile-responsive design
                ✅ Fast, modern websites
                ✅ SEO best practices
                ✅ Contact forms
                ✅ Google Maps integration
                ✅ Social media links
                ✅ Basic training on how to update your content
                ✅ Domain & hosting setup assistance
                
                The specific features depend on which package you choose. Would you like details on a particular package?
            `;
        }
        
        // Payment questions
        else if (text.includes('payment') || text.includes('pay') || text.includes('accept') || 
                 text.includes('deposit') || text.includes('venmo') || text.includes('paypal') || 
                 text.includes('credit card') || text.includes('invoice')) {
            return `
                I accept payments via:
                
                💳 PayPal
                💸 Venmo
                🏦 Direct bank transfer
                
                For all projects, I require a 50% deposit before starting, with the remaining 50% due upon completion before the website goes live.
                
                I'll send you a detailed invoice with payment instructions after we discuss your project requirements.
            `;
        }
        
        // Process questions
        else if (text.includes('process') || text.includes('step') || text.includes('how does it work') || 
                 text.includes('how do we start') || text.includes('get started') || text.includes('begin') || 
                 text.includes('what next') || text.includes('procedure')) {
            return `
                My website design process is simple:
                
                1️⃣ Consultation: We'll discuss your business goals, target audience, and website requirements.
                
                2️⃣ Design: I'll create a custom design mockup for your approval before building begins.
                
                3️⃣ Development: Once approved, I'll build your website with attention to detail and performance.
                
                4️⃣ Launch: After your final approval, we'll launch your new website!
                
                Ready to get started? Fill out the contact form below and I'll reach out within 24 hours.
            `;
        }
        
        // Contact/get in touch questions
        else if (text.includes('contact') || text.includes('email') || text.includes('phone') || 
                 text.includes('call') || text.includes('text') || text.includes('reach') || 
                 text.includes('talk to') || text.includes('speak with') || text.includes('get in touch')) {
            return `
                You can reach me at:
                
                📧 Email: jacksseattlewebsites@gmail.com
                📱 Phone: (206) 555-1234
                
                Or simply fill out the contact form at the bottom of this page.
                
                I typically respond to all inquiries within 24 hours, often much faster!
            `;
        }
        
        // Maintenance questions
        else if (text.includes('maintenance') || text.includes('update') || text.includes('change') || 
                 text.includes('edit') || text.includes('modify') || text.includes('after') || 
                 text.includes('support') || text.includes('help') || text.includes('manage')) {
            return `
                After your website is live:
                
                1. You can make basic updates yourself (I'll show you how)
                
                2. For ongoing support, I offer a monthly maintenance plan for just $5/month that includes:
                   - Small text/image updates anytime
                   - Site uptime monitoring
                   - Quick bug fixes
                   - Priority response
                   
                3. For more significant changes later, I charge a small hourly rate or project fee based on the scope.
                
                Many clients find the $5/month maintenance plan gives them peace of mind!
            `;
        }
        
        // Portfolio/examples questions
        else if (text.includes('portfolio') || text.includes('example') || text.includes('sample') || 
                 text.includes('work') || text.includes('project') || text.includes('previous') || 
                 text.includes('other site') || text.includes('show me')) {
            return `
                You can see my featured project (InsectScan app website) in the portfolio section of this page. As a newer service, I'm actively building my portfolio.
                
                Each project is custom-designed to match the client's unique needs and brand.
                
                What kind of website are you looking for? I'd be happy to explain how I would approach your specific project.
            `;
        }
        
        // Location questions
        else if (text.includes('location') || text.includes('based') || text.includes('where') || 
                 text.includes('seattle') || text.includes('local')) {
            return `
                I'm based in Seattle, Washington and primarily serve local small businesses. Being local means:
                
                👋 We can meet in person if needed
                🌲 I understand the local market and culture
                🕒 I'm in your time zone for quick communication
                💼 I support our local business community
                
                However, I can work with clients anywhere since everything can be done remotely!
            `;
        }
        
        // Technology/platform questions
        else if (text.includes('platform') || text.includes('wordpress') || text.includes('wix') || 
                 text.includes('squarespace') || text.includes('technology') || text.includes('cms') || 
                 text.includes('shopify') || text.includes('ecommerce') || text.includes('tech stack')) {
            return `
                I build custom websites using modern web technologies:
                
                - HTML5, CSS3, and JavaScript for fast, responsive sites
                - Clean, hand-coded websites (no bloated platforms)
                - SEO-friendly structure and best practices
                
                Unlike template-based platforms, my custom websites are:
                ✅ Faster loading
                ✅ More secure
                ✅ Fully customized to your specific needs
                ✅ No monthly platform fees
                
                For e-commerce needs, I can recommend the best solution based on your requirements.
            `;
        }
        
        // Greeting or hello
        else if (text.includes('hello') || text.includes('hi') || text.includes('hey') || 
                 text.includes('howdy') || text.includes('greetings') || text.match(/^[^a-zA-Z]*$/)) {
            return `
                👋 Hi there! Thanks for reaching out. I'm Jack, a Seattle-based web designer specializing in affordable, professional websites for small businesses.
                
                How can I help you today? Feel free to ask about my services, pricing, process, or anything else!
            `;
        }
        
        // Thank you messages
        else if (text.includes('thank') || text.includes('thanks') || text.includes('appreciate') || 
                 text.includes('helpful') || text.includes('great')) {
            return `
                You're very welcome! I'm happy to help. 
                
                Is there anything else you'd like to know about my web design services?
                
                When you're ready to move forward, you can fill out the contact form at the bottom of the page, and I'll get back to you quickly!
            `;
        }
        
        // Default response for anything not matched
        else {
            return `
                Thanks for your message! I'm not sure I fully understand your question, but I'd be happy to help with your website needs.
                
                Some common questions include:
                - Pricing and packages
                - Timeline for completion
                - Process for getting started
                - What's included in my services
                
                Or you can fill out the contact form below for a more detailed conversation!
            `;
        }
    }
    
    // Save chat messages to localStorage
    function saveChatMessages() {
        const messages = chatMessages.innerHTML;
        localStorage.setItem('chatMessages', messages);
    }
    
    // Load chat messages from localStorage
    function loadChatMessages() {
        const savedMessages = localStorage.getItem('chatMessages');
        if (savedMessages) {
            chatMessages.innerHTML = savedMessages;
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }
    
    // Send message function
    function sendUserMessage() {
        const message = messageInput.value.trim();
        
        if (message !== '') {
            // Add user message
            addMessage('sent', message);
            
            // Clear input
            messageInput.value = '';
            
            // Display typing indicator
            const typingIndicator = document.createElement('div');
            typingIndicator.className = 'message received typing-indicator';
            typingIndicator.innerHTML = '<div class="message-content"><p>Typing<span>.</span><span>.</span><span>.</span></p></div>';
            chatMessages.appendChild(typingIndicator);
            
            // Scroll to the bottom
            chatMessages.scrollTop = chatMessages.scrollHeight;
            
            // Get appropriate response
            const botResponse = getChatResponse(message);
            
            // Remove typing indicator and show real response after a short delay
            setTimeout(() => {
                chatMessages.removeChild(typingIndicator);
                addMessage('received', botResponse);
                // Scroll to the bottom again
                chatMessages.scrollTop = chatMessages.scrollHeight;
                // Save messages to localStorage
                saveChatMessages();
            }, 1500);
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

    // Check if portfolio-featured image exists and if not, add console message
    const portfolioFeaturedImg = document.querySelector('.project-image img');
    if (portfolioFeaturedImg) {
        portfolioFeaturedImg.addEventListener('error', function() {
            console.warn('Portfolio featured image failed to load. Check that the file exists at the path: ' + this.src);
            // Add a placeholder or fallback
            this.src = 'https://via.placeholder.com/600x400?text=Portfolio+Project';
        });
    }
    
    // Form submission handling to prevent redirection to 404 pages
    const contactForm = document.getElementById('contactForm');
    const newsletterForm = document.querySelector('.newsletter-form');
    
    // Handle contact form submission
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent form from submitting normally
            
            const formData = new FormData(contactForm);
            const contactFormWrapper = document.querySelector('.contact-form-wrapper');
            
            // Show immediate confirmation message
            const confirmationMessage = document.createElement('div');
            confirmationMessage.className = 'success-message';
            confirmationMessage.innerHTML = '<i class="fas fa-check-circle"></i> Thanks for your message! You will receive a response from me shortly.';
            contactFormWrapper.prepend(confirmationMessage);
            
            // Submit the form data to FormSubmit.co using fetch API
            fetch('https://formsubmit.co/jacksseattlewebsites@gmail.com', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                // Remove confirmation message
                confirmationMessage.remove();
                
                // Show success message
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.innerHTML = '<i class="fas fa-check-circle"></i> Thanks! Your message has been sent. I\'ll get back to you shortly.';
                contactFormWrapper.prepend(successMessage);
                
                // Reset the form
                contactForm.reset();
                
                // Remove success message after 8 seconds
                setTimeout(() => {
                    successMessage.remove();
                }, 8000);
            })
            .catch(error => {
                // Remove confirmation message
                confirmationMessage.remove();
                
                // Show error message
                const errorMessage = document.createElement('div');
                errorMessage.className = 'error-message';
                errorMessage.innerHTML = '<i class="fas fa-exclamation-circle"></i> There was a problem sending your message. Please try again or email me directly.';
                contactFormWrapper.prepend(errorMessage);
                
                // Remove error message after 8 seconds
                setTimeout(() => {
                    errorMessage.remove();
                }, 8000);
                
                console.error('Form submission error:', error);
            });
        });
    }
    
    // Handle newsletter form submission
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent form from submitting normally
            
            const formData = new FormData(newsletterForm);
            const newsletterFormParent = newsletterForm.parentElement;
            
            // Submit the form data to FormSubmit.co using fetch API
            fetch('https://formsubmit.co/jacksseattlewebsites@gmail.com', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                // Show success message
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.innerHTML = '<i class="fas fa-check-circle"></i> Thank you for subscribing!';
                
                newsletterForm.after(successMessage);
                
                // Reset the form
                newsletterForm.reset();
                
                // Remove success message after 8 seconds
                setTimeout(() => {
                    successMessage.remove();
                }, 8000);
            })
            .catch(error => {
                // Show error message
                const errorMessage = document.createElement('div');
                errorMessage.className = 'error-message';
                errorMessage.innerHTML = '<i class="fas fa-exclamation-circle"></i> There was a problem subscribing. Please try again.';
                
                newsletterForm.after(errorMessage);
                
                // Remove error message after 8 seconds
                setTimeout(() => {
                    errorMessage.remove();
                }, 8000);
                
                console.error('Newsletter submission error:', error);
            });
        });
    }
    
    console.log("Jack's Seattle Websites - Website loaded successfully!");
});
// Performance optimizations
window.addEventListener('load', function() {
    // Lazy load images that are not in the initial viewport
    if ('IntersectionObserver' in window) {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // Reduce animation complexity on mobile
    if (window.innerWidth < 768) {
        document.querySelectorAll('[data-aos]').forEach(el => {
            el.removeAttribute('data-aos');
            el.removeAttribute('data-aos-delay');
        });
    }
});
