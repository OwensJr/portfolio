// ===== MOBILE NAVIGATION TOGGLE =====
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle menu on hamburger click
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            if (hamburger) hamburger.classList.remove('active');
        });
    });
});

// ===== CONTACT FORM HANDLING =====
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            // Basic validation
            if (!name || !email || !message) {
                showMessage('Please fill in all fields.', 'error');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showMessage('Please enter a valid email address.', 'error');
                return;
            }

            // IMPORTANT: Replace with your Formspree form ID or EmailJS configuration
            // Option 1: Using Formspree
            const formspreeEndpoint = 'https://formspree.io/f/YOUR_FORM_ID';
            
            // Option 2: Using EmailJS (uncomment to use)
            // Note: You'll need to set up EmailJS account and add credentials

            // Using Formspree (replace YOUR_FORM_ID with actual ID)
            fetch(formspreeEndpoint, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json'
                },
                body: new FormData(contactForm)
            })
            .then(response => {
                if (response.ok) {
                    showMessage('Message sent successfully! I\'ll get back to you soon.', 'success');
                    contactForm.reset();
                } else {
                    showMessage('There was an issue sending your message. Please try again.', 'error');
                }
            })
            .catch(error => {
                console.error('Form submission error:', error);
                showMessage('Error submitting form. Please try again or email directly.', 'error');
            });
        });
    }

    function showMessage(text, type) {
        if (formMessage) {
            formMessage.textContent = text;
            formMessage.className = `form-message ${type}`;
            
            if (type === 'success') {
                setTimeout(() => {
                    formMessage.style.display = 'none';
                }, 5000);
            }
        }
    }
});

// ===== SMOOTH SCROLL BEHAVIOR (Optional Enhancement) =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ===== ACTIVE NAV LINK INDICATOR =====
document.addEventListener('DOMContentLoaded', function() {
    const currentLocation = location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        let href = link.getAttribute('href');
        
        // Handle root index.html
        if (href === 'index.html' && currentLocation.endsWith('/')) {
            link.classList.add('active');
        } else if (href === 'index.html' && currentLocation.endsWith('index.html')) {
            link.classList.add('active');
        } else if (currentLocation.includes(href) && href !== 'index.html') {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});

// ===== SCROLL REVEAL ANIMATION (Optional) =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.project-card, .highlight-card').forEach(el => {
        observer.observe(el);
    });
});

// ===== UTILITY: Set current year in footer =====
document.addEventListener('DOMContentLoaded', function() {
    const year = new Date().getFullYear();
    const footerText = document.querySelector('.footer-content p');
    if (footerText) {
        footerText.textContent = `© ${year} Owens Ignatius Lavall Jr. All rights reserved.`;
    }
});

// ===== BLOG POST TOGGLE =====
document.addEventListener('DOMContentLoaded', function() {
    const toggleButtons = document.querySelectorAll('.blog-toggle-btn');

    toggleButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const blogContent = this.parentElement;
            const fullContent = blogContent.querySelector('.blog-full-content');
            const isExpanded = this.getAttribute('data-expanded') === 'true';

            if (!isExpanded) {
                // Expand
                fullContent.style.display = 'block';
                this.textContent = '← Read Less';
                this.setAttribute('data-expanded', 'true');
                this.classList.add('expanded');
            } else {
                // Collapse
                fullContent.style.display = 'none';
                this.textContent = 'Read More →';
                this.setAttribute('data-expanded', 'false');
                this.classList.remove('expanded');
            }
        });
    });
});

// ===== GALLERY FILTER =====
document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filterValue = this.getAttribute('data-filter');

            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Filter gallery items
            galleryItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');

                if (filterValue === 'all' || itemCategory === filterValue) {
                    item.style.display = 'block';
                    item.classList.remove('hidden');
                } else {
                    item.style.display = 'none';
                    item.classList.add('hidden');
                }
            });
        });
    });
});

// ===== GALLERY LIGHTBOX (delegated) =====
(function() {
	const modal = document.getElementById('lightboxModal');
	if (!modal) return;

	const backdrop = modal.querySelector('.lightbox-backdrop');
	const imgEl = modal.querySelector('.lightbox-image');
	const captionEl = modal.querySelector('.lightbox-caption');
	const btnClose = modal.querySelector('.lightbox-close');
	const btnPrev = modal.querySelector('.lightbox-prev');
	const btnNext = modal.querySelector('.lightbox-next');

	let currentIndex = -1;

	function getVisibleItems() {
		return Array.from(document.querySelectorAll('.gallery-item')).filter(i => i.style.display !== 'none');
	}

	function openLightboxFromItem(item) {
		const img = item.querySelector('img');
		if (!img) return;
		const src = img.getAttribute('src');
		const alt = img.getAttribute('alt') || '';
		const title = item.querySelector('.gallery-info h3')?.textContent || alt;

		const list = getVisibleItems();
		currentIndex = list.indexOf(item);

		imgEl.src = src;
		imgEl.alt = alt;
		captionEl.textContent = title;

		modal.classList.add('open');
		modal.setAttribute('aria-hidden', 'false');
		document.body.style.overflow = 'hidden';
	}

	function closeLightbox() {
		modal.classList.remove('open');
		modal.setAttribute('aria-hidden', 'true');
		imgEl.src = '';
		document.body.style.overflow = '';
		currentIndex = -1;
	}

	function showByDelta(delta) {
		const list = getVisibleItems();
		if (!list.length || currentIndex === -1) return;
		currentIndex = (currentIndex + delta + list.length) % list.length;
		const item = list[currentIndex];
		const img = item.querySelector('img');
		if (!img) return;
		imgEl.src = img.getAttribute('src');
		imgEl.alt = img.getAttribute('alt') || '';
		captionEl.textContent = item.querySelector('.gallery-info h3')?.textContent || '';
	}

	// Delegated click handler
	document.addEventListener('click', function(e) {
		const btn = e.target.closest('.gallery-btn');
		if (btn) {
			// If button is an anchor with href (e.g. facebook external link), let it open in new tab.
			if (btn.tagName.toLowerCase() === 'a' && btn.href) {
				return;
			}
			e.preventDefault();
			const item = btn.closest('.gallery-item');
			if (item) openLightboxFromItem(item);
			return;
		}

		// close
		if (e.target.closest('.lightbox-close') || e.target.matches('[data-close]')) {
			closeLightbox();
			return;
		}

		if (e.target.closest('.lightbox-prev')) {
			showByDelta(-1);
			return;
		}

		if (e.target.closest('.lightbox-next')) {
			showByDelta(1);
			return;
		}
	});

	// Keyboard support
	document.addEventListener('keydown', function(e) {
		if (!modal.classList.contains('open')) return;
		if (e.key === 'Escape') closeLightbox();
		if (e.key === 'ArrowRight') showByDelta(1);
		if (e.key === 'ArrowLeft') showByDelta(-1);
	});
})();
