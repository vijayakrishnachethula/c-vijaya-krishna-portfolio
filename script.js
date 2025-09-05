// Smooth scroll to About section
function scrollToAbout() {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
        aboutSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Neural Network Background Animation
class NeuralNetwork {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.nodes = [];
        this.connections = [];
        this.nodeCount = 50;
        this.maxDistance = 150;
        
        this.resizeCanvas();
        this.createNodes();
        this.animate();
        
        window.addEventListener('resize', () => this.resizeCanvas());
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createNodes() {
        this.nodes = [];
        for (let i = 0; i < this.nodeCount; i++) {
            this.nodes.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 3 + 1
            });
        }
    }
    
    updateNodes() {
        this.nodes.forEach(node => {
            node.x += node.vx;
            node.y += node.vy;
            
            if (node.x < 0 || node.x > this.canvas.width) node.vx *= -1;
            if (node.y < 0 || node.y > this.canvas.height) node.vy *= -1;
            
            node.x = Math.max(0, Math.min(this.canvas.width, node.x));
            node.y = Math.max(0, Math.min(this.canvas.height, node.y));
        });
    }
    
    drawNodes() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw connections
        this.ctx.strokeStyle = getComputedStyle(document.documentElement)
            .getPropertyValue('--accent-primary') + '20';
        this.ctx.lineWidth = 0.5;
        
        for (let i = 0; i < this.nodes.length; i++) {
            for (let j = i + 1; j < this.nodes.length; j++) {
                const dx = this.nodes[i].x - this.nodes[j].x;
                const dy = this.nodes[i].y - this.nodes[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.maxDistance) {
                    const opacity = (this.maxDistance - distance) / this.maxDistance;
                    this.ctx.globalAlpha = opacity * 0.3;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.nodes[i].x, this.nodes[i].y);
                    this.ctx.lineTo(this.nodes[j].x, this.nodes[j].y);
                    this.ctx.stroke();
                }
            }
        }
        
        // Draw nodes
        this.ctx.globalAlpha = 0.8;
        this.nodes.forEach(node => {
            const gradient = this.ctx.createRadialGradient(
                node.x, node.y, 0,
                node.x, node.y, node.radius * 2
            );
            gradient.addColorStop(0, getComputedStyle(document.documentElement)
                .getPropertyValue('--accent-primary'));
            gradient.addColorStop(1, 'transparent');
            
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            this.ctx.fill();
        });
        
        this.ctx.globalAlpha = 1;
    }
    
    animate() {
        this.updateNodes();
        this.drawNodes();
        requestAnimationFrame(() => this.animate());
    }
}

// Typing Animation
class TypingAnimation {
    constructor(element, text, speed = 100) {
        this.element = element;
        this.text = text;
        this.speed = speed;
        this.currentIndex = 0;
        this.isDeleting = false;
        this.start();
    }
    
    start() {
        this.type();
    }
    
    type() {
        const currentText = this.isDeleting 
            ? this.text.substring(0, this.currentIndex - 1)
            : this.text.substring(0, this.currentIndex + 1);
        
        this.element.textContent = currentText;
        
        if (!this.isDeleting && this.currentIndex < this.text.length) {
            this.currentIndex++;
            setTimeout(() => this.type(), this.speed);
        } else if (this.isDeleting && this.currentIndex > 0) {
            this.currentIndex--;
            setTimeout(() => this.type(), this.speed / 2);
        } else if (!this.isDeleting && this.currentIndex === this.text.length) {
            setTimeout(() => {
                this.isDeleting = true;
                this.type();
            }, 2000);
        } else if (this.isDeleting && this.currentIndex === 0) {
            this.isDeleting = false;
            setTimeout(() => this.type(), 500);
        }
    }
}

// Scroll Animations
class ScrollAnimations {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.observer = new IntersectionObserver(
            this.handleIntersection.bind(this),
            this.observerOptions
        );
        
        this.initializeElements();
    }
    
    initializeElements() {
        const animatedElements = document.querySelectorAll(
            '.fade-in-up, .slide-in-left, .slide-in-right, .certificate-item, .achievement-item, .edu-item'
        );
        
        animatedElements.forEach(el => {
            this.observer.observe(el);
        });
    }
    
    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Add staggered animation for multiple items
                if (entry.target.parentElement.children.length > 1) {
                    const siblings = Array.from(entry.target.parentElement.children);
                    const index = siblings.indexOf(entry.target);
                    entry.target.style.transitionDelay = `${index * 0.1}s`;
                }
            }
        });
    }
}

// Skill Connections
class SkillConnections {
    constructor() {
        this.svg = document.querySelector('.skill-connections');
        this.skills = document.querySelectorAll('.skill-item');
        this.connections = [];
        
        this.initializeSkills();
    }
    
    initializeSkills() {
        this.skills.forEach(skill => {
            skill.addEventListener('mouseenter', () => this.highlightConnections(skill));
            skill.addEventListener('mouseleave', () => this.clearConnections());
        });
    }
    
    highlightConnections(activeSkill) {
        this.clearConnections();
        
        const skillName = activeSkill.dataset.skill;
        const relatedSkills = this.getRelatedSkills(skillName);
        
        relatedSkills.forEach(relatedSkill => {
            this.drawConnection(activeSkill, relatedSkill);
        });
    }
    
    getRelatedSkills(skillName) {
        const relationships = {
            'python': ['tensorflow', 'keras', 'pandas', 'numpy', 'opencv'],
            'tensorflow': ['keras', 'python', 'numpy'],
            'keras': ['tensorflow', 'python'],
            'opencv': ['python', 'numpy'],
            'pandas': ['python', 'numpy', 'matplotlib'],
            'numpy': ['python', 'pandas', 'tensorflow', 'matplotlib'],
            'aws': ['docker', 'gcp', 'azure'],
            'git': ['python']
        };
        
        const related = relationships[skillName] || [];
        return related.map(skill => 
            document.querySelector(`[data-skill="${skill}"]`)
        ).filter(Boolean);
    }
    
    drawConnection(skill1, skill2) {
        const rect1 = skill1.getBoundingClientRect();
        const rect2 = skill2.getBoundingClientRect();
        const svgRect = this.svg.getBoundingClientRect();
        
        const x1 = rect1.left + rect1.width / 2 - svgRect.left;
        const y1 = rect1.top + rect1.height / 2 - svgRect.top;
        const x2 = rect2.left + rect2.width / 2 - svgRect.left;
        const y2 = rect2.top + rect2.height / 2 - svgRect.top;
        
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        line.setAttribute('stroke', getComputedStyle(document.documentElement)
            .getPropertyValue('--accent-primary'));
        line.setAttribute('stroke-width', '2');
        line.setAttribute('opacity', '0.8');
        line.classList.add('skill-connection');
        
        this.svg.appendChild(line);
        
        // Animate line drawing
        const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
        line.style.strokeDasharray = length;
        line.style.strokeDashoffset = length;
        line.animate([
            { strokeDashoffset: length },
            { strokeDashoffset: 0 }
        ], {
            duration: 500,
            easing: 'ease-out'
        });
        
        // Highlight related skill
        skill2.classList.add('highlighted');
    }
    
    clearConnections() {
        const connections = this.svg.querySelectorAll('.skill-connection');
        connections.forEach(connection => connection.remove());
        
        this.skills.forEach(skill => skill.classList.remove('highlighted'));
    }
}

// Theme Toggle
class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('theme-toggle');
        this.currentTheme = localStorage.getItem('theme') || 'dark';
        
        this.applyTheme(this.currentTheme);
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }
    
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);
    }
    
    applyTheme(theme) {
        if (theme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
    }
}

// Navigation
class Navigation {
    constructor() {
        this.nav = document.querySelector('.nav');
        this.navToggle = document.querySelector('.nav-toggle');
        this.navLinks = document.querySelector('.nav-links');
        this.navItems = document.querySelectorAll('.nav-links a');
        
        this.initializeNavigation();
        this.handleScroll();
        window.addEventListener('scroll', () => this.handleScroll());
    }
    
    initializeNavigation() {
        this.navToggle.addEventListener('click', () => {
            this.navLinks.classList.toggle('active');
        });
        
        this.navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = item.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
                
                this.navLinks.classList.remove('active');
                this.setActiveNavItem(item);
            });
        });
    }
    
    handleScroll() {
        const scrolled = window.pageYOffset;
        const sections = document.querySelectorAll('section[id]');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrolled >= sectionTop && scrolled < sectionTop + sectionHeight) {
                const activeNavItem = document.querySelector(
                    `.nav-links a[data-section="${sectionId}"]`
                );
                if (activeNavItem) {
                    this.setActiveNavItem(activeNavItem);
                }
            }
        });
        
        // Add nav background on scroll
        if (scrolled > 50) {
            this.nav.style.background = 'rgba(10, 10, 10, 0.95)';
        } else {
            this.nav.style.background = 'rgba(10, 10, 10, 0.9)';
        }
    }
    
    setActiveNavItem(activeItem) {
        this.navItems.forEach(item => item.classList.remove('active'));
        activeItem.classList.add('active');
    }
}

// Contact Form
class ContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.submitBtn = this.form.querySelector('.submit-btn');
        
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        const originalText = this.submitBtn.innerHTML;
        this.submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        this.submitBtn.disabled = true;
        
        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        this.submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
        this.submitBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
        
        setTimeout(() => {
            this.submitBtn.innerHTML = originalText;
            this.submitBtn.disabled = false;
            this.submitBtn.style.background = '';
            this.form.reset();
        }, 3000);
    }
}

// Project Cards Animation
class ProjectCards {
    constructor() {
        this.cards = document.querySelectorAll('.project-card');
        this.initializeCards();
    }
    
    initializeCards() {
        this.cards.forEach((card, index) => {
            // Add delay for staggered animation
            card.style.animationDelay = `${index * 0.2}s`;
            
            // Initialize AI scan animation
            const scanLine = card.querySelector('.scan-line');
            if (scanLine) {
                this.startScanAnimation(scanLine);
            }
        });
    }
    
    startScanAnimation(scanLine) {
        setInterval(() => {
            scanLine.style.animation = 'none';
            setTimeout(() => {
                scanLine.style.animation = 'scan 3s ease-in-out';
            }, 100);
        }, 5000);
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize neural network background
    const neuralCanvas = document.getElementById('neural-bg');
    new NeuralNetwork(neuralCanvas);
    
    // Initialize typing animation
    const typingElement = document.querySelector('.typing-text');
    const textToType = typingElement.dataset.text;
    new TypingAnimation(typingElement, textToType, 150);
    
    // Initialize scroll animations
    new ScrollAnimations();
    
    // Initialize skill connections
    new SkillConnections();
    
    // Initialize theme manager
    new ThemeManager();
    
    // Initialize navigation
    new Navigation();
    
    // Initialize contact form
    new ContactForm();
    
    // Initialize project cards
    new ProjectCards();
    
    // Add loading class to body
    document.body.classList.add('loading');
    
    // Smooth scroll for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add intersection observer for section animations
    const sectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Special animations for specific sections
                    if (entry.target.classList.contains('skills')) {
                        setTimeout(() => {
                            entry.target.querySelectorAll('.skill-item').forEach((item, index) => {
                                setTimeout(() => {
                                    item.style.animation = 'pulse 0.6s ease';
                                }, index * 100);
                            });
                        }, 500);
                    }
                }
            });
        },
        {
            threshold: 0.2,
            rootMargin: '0px 0px -100px 0px'
        }
    );
    
    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        section.classList.add('fade-in-up');
        sectionObserver.observe(section);
    });
    
    // Add hover effect for skill items
    document.querySelectorAll('.skill-item').forEach(skill => {
        skill.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) rotate(5deg)';
            this.style.background = 'var(--accent-gradient)';
            this.style.color = 'white';
        });
        
        skill.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.background = '';
            this.style.color = '';
        });
    });
    
    // Achievement items animation on scroll
    const achievementItems = document.querySelectorAll('.achievement-item');
    achievementItems.forEach((item, index) => {
        item.classList.add('slide-in-left');
        item.style.animationDelay = `${index * 0.3}s`;
    });
    
    // Certificate items animation on scroll
    const certificateItems = document.querySelectorAll('.certificate-item');
    certificateItems.forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.2}s`;
    });
    
    // Add parallax effect to floating code
    const floatingCode = document.querySelector('.floating-code');
    if (floatingCode) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            floatingCode.style.transform = `translateY(${rate}px)`;
        });
    }
    
    // Add glow effect on hover for project cards
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.filter = 'drop-shadow(0 0 20px rgba(0, 210, 255, 0.3))';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.filter = '';
        });
    });
    
    // Initialize form animations
    const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        input.addEventListener('blur', function() {
            this.style.transform = '';
        });
    });
    
    // Add particle effect on button clicks
    document.querySelectorAll('button, .hero-btn, .project-link').forEach(button => {
        button.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(255, 255, 255, 0.6)';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'ripple 0.6s linear';
            ripple.style.left = x - 5 + 'px';
            ripple.style.top = y - 5 + 'px';
            ripple.style.width = '10px';
            ripple.style.height = '10px';
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add CSS for ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .skill-item.highlighted {
            background: var(--accent-gradient) !important;
            color: white !important;
            transform: scale(1.05) !important;
            box-shadow: var(--shadow) !important;
        }
    `;
    document.head.appendChild(style);
    
    console.log('🚀 Portfolio initialized successfully!');
    console.log('🧠 Neural network background active');
    console.log('✨ All animations loaded');
});

// Performance optimization
window.addEventListener('load', () => {
    // Preload critical resources
    const criticalImages = [
        // Add any critical images here
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
    
    // Remove loading states
    document.body.classList.remove('loading');
});

// Handle visibility changes for performance
document.addEventListener('visibilitychange', () => {
    const neuralCanvas = document.getElementById('neural-bg');
    if (document.hidden) {
        neuralCanvas.style.opacity = '0';
    } else {
        neuralCanvas.style.opacity = '0.3';
    }
});