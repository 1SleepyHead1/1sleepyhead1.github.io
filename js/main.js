// Mobile Menu Toggle
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");

hamburger.addEventListener("click", () => {
	hamburger.classList.toggle("active");
	navLinks.classList.toggle("active");
});

// Close mobile menu when clicking on a nav link
document.querySelectorAll(".nav-links a").forEach((link) => {
	link.addEventListener("click", () => {
		hamburger.classList.remove("active");
		navLinks.classList.remove("active");
	});
});

// Project Filtering with Animation
const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

// Initialize card animations
function initCardAnimations() {
	projectCards.forEach((card, index) => {
		// Add animation delay based on index
		card.style.animationDelay = `${index * 0.1}s`;

		// Add hover animation when mouse enters card
		card.addEventListener("mouseenter", () => {
			addCardGlow(card);
		});

		// Remove hover animation when mouse leaves card
		card.addEventListener("mouseleave", () => {
			removeCardGlow(card);
		});
	});
}

// Add glowing effect to card
function addCardGlow(card) {
	// Create glow effect
	const glow = document.createElement("div");
	glow.classList.add("card-glow");
	glow.style.cssText = `
		position: absolute;
		top: -20px;
		left: -20px;
		right: -20px;
		bottom: -20px;
		background: radial-gradient(circle at var(--x) var(--y), rgba(94, 114, 228, 0.3), transparent 70%);
		pointer-events: none;
		opacity: 0;
		transition: opacity 0.5s;
		z-index: -1;
	`;

	card.appendChild(glow);

	// Fade in the glow
	setTimeout(() => {
		glow.style.opacity = "1";
	}, 10);

	// Track mouse movement for interactive glow effect
	card.addEventListener("mousemove", updateGlowPosition);
}

// Update glow position based on mouse coordinates
function updateGlowPosition(e) {
	const glow = this.querySelector(".card-glow");
	if (glow) {
		const rect = this.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		glow.style.setProperty("--x", `${x}px`);
		glow.style.setProperty("--y", `${y}px`);
	}
}

// Remove card glow effect
function removeCardGlow(card) {
	const glow = card.querySelector(".card-glow");
	if (glow) {
		glow.style.opacity = "0";
		// Remove the glow element after transition
		setTimeout(() => {
			glow.remove();
		}, 500);

		// Remove the mousemove event listener
		card.removeEventListener("mousemove", updateGlowPosition);
	}
}

// Filter projects with animation
function filterProjects(category) {
	projectCards.forEach((card) => {
		// Get the card's category
		const cardCategory = card.getAttribute("data-category");

		// Reset animation to make filtering look smooth
		card.style.animation = "none";
		card.offsetHeight; // Trigger reflow

		if (category === "all" || cardCategory === category) {
			// Show card with animation
			card.style.display = "block";
			card.style.animation = "fadeIn 0.5s forwards";
			card.style.animationDelay = "0s"; // Reset delay for filtering
		} else {
			// Hide card with fade out animation
			card.style.animation = "fadeOut 0.5s forwards";
			setTimeout(() => {
				if (card.style.animation.includes("fadeOut")) {
					card.style.display = "none";
				}
			}, 500);
		}
	});
}

// Add fadeOut animation to CSS
document.head.insertAdjacentHTML(
	"beforeend",
	`
	<style>
		@keyframes fadeOut {
			from { 
				opacity: 1;
				transform: translateY(0);
			}
			to { 
				opacity: 0;
				transform: translateY(20px);
			}
		}
		
		.project-card.animate-in {
			animation: fadeIn 0.5s forwards;
		}
		
		.project-card.animate-out {
			animation: fadeOut 0.5s forwards;
		}
	</style>
`
);

// Project filter button click handler
filterButtons.forEach((button) => {
	button.addEventListener("click", () => {
		// Remove active class from all buttons
		filterButtons.forEach((btn) => btn.classList.remove("active"));

		// Add active class to clicked button
		button.classList.add("active");

		// Get filter value
		const filterValue = button.getAttribute("data-filter");

		// Filter projects
		filterProjects(filterValue);
	});
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
	anchor.addEventListener("click", function (e) {
		e.preventDefault();

		const targetId = this.getAttribute("href");
		const targetElement = document.querySelector(targetId);

		if (targetElement) {
			window.scrollTo({
				top: targetElement.offsetTop - 70, // Adjust for header height
				behavior: "smooth"
			});
		}
	});
});

// Animate skill bars on scroll
const skillItems = document.querySelectorAll(".skill-item");
const skillBars = document.querySelectorAll(".skill-level");
const skillsSection = document.querySelector("#skills");

// Initialize skill bars
function initSkillBars() {
	// Set initial state for all skill bars
	skillBars.forEach((bar) => {
		// Get the target width from the data attribute
		const targetWidth = bar.getAttribute("data-width");
		// Store it for later use
		bar.setAttribute("data-target-width", targetWidth);
		// Reset the width to 0
		bar.style.width = "0";
	});
}

// Animate skill bars when they are in view
function animateSkillBars() {
	const sectionPosition = skillsSection.getBoundingClientRect().top;
	const screenPosition = window.innerHeight * 0.8;

	if (sectionPosition < screenPosition) {
		// Animate each skill item with staggered delay
		skillItems.forEach((item, index) => {
			setTimeout(() => {
				// Add the animation class to the item
				item.classList.add("animate");

				// Get the skill bar inside this item
				const bar = item.querySelector(".skill-level");
				const targetWidth = bar.getAttribute("data-target-width");

				// Set the width to trigger animation
				bar.style.width = targetWidth;
			}, index * 150); // Stagger the animations
		});

		// Remove the scroll event listener once animation is triggered
		window.removeEventListener("scroll", animateSkillBars);
	}
}

// Initialize skill animations
initSkillBars();

// Add scroll event listener
window.addEventListener("scroll", animateSkillBars);

// Also trigger on page load in case skills section is already in view
document.addEventListener("DOMContentLoaded", () => {
	animateSkillBars();

	// Add the floating effect to skill items when hovered
	skillItems.forEach((item) => {
		item.addEventListener("mouseenter", () => {
			item.style.transform = "translateY(-5px)";
			item.style.boxShadow = "0 10px 20px rgba(0, 0, 0, 0.1)";
			item.style.transition = "transform 0.3s ease, box-shadow 0.3s ease";
		});

		item.addEventListener("mouseleave", () => {
			item.style.transform = "translateY(0)";
			item.style.boxShadow = "var(--shadow)";
		});
	});
});

// Add tilt effect to project cards for 3D appearance
function addTiltEffect() {
	projectCards.forEach((card) => {
		card.addEventListener("mousemove", (e) => {
			const rect = card.getBoundingClientRect();
			const x = e.clientX - rect.left; // Mouse X position within card
			const y = e.clientY - rect.top; // Mouse Y position within card

			// Calculate rotation values based on mouse position
			const xRotation = (y - rect.height / 2) / 10;
			const yRotation = (rect.width / 2 - x) / 10;

			// Apply the 3D rotation effect
			card.style.transform = `
				perspective(1000px) 
				rotateX(${xRotation}deg) 
				rotateY(${yRotation}deg) 
				scale3d(1.05, 1.05, 1.05)
				translateY(-15px)
			`;

			// Add subtle shadow based on mouse position
			card.style.boxShadow = `
				${-yRotation / 3}px ${-xRotation / 3}px 15px rgba(0,0,0,0.1),
				0 10px 30px rgba(0,0,0,0.15)
			`;
		});

		// Reset card when mouse leaves
		card.addEventListener("mouseleave", () => {
			card.style.transform = "translateY(-10px)";
			card.style.boxShadow = "0 10px 20px rgba(0,0,0,0.1)";
		});
	});
}

// Form validation
const contactForm = document.querySelector(".contact-form form");

if (contactForm) {
	contactForm.addEventListener("submit", function (e) {
		e.preventDefault();

		// Basic form validation
		let isValid = true;
		const name = document.getElementById("name");
		const email = document.getElementById("email");
		const subject = document.getElementById("subject");
		const message = document.getElementById("message");

		// Simple email validation regex
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		if (name.value.trim() === "") {
			isValid = false;
			highlightError(name);
		}

		if (!emailRegex.test(email.value)) {
			isValid = false;
			highlightError(email);
		}

		if (subject.value.trim() === "") {
			isValid = false;
			highlightError(subject);
		}

		if (message.value.trim() === "") {
			isValid = false;
			highlightError(message);
		}

		if (isValid) {
			// In a real application, you would send the form data to a server
			alert("Thank you for your message! I will get back to you soon.");
			contactForm.reset();
		}
	});

	// Helper function to highlight errors
	function highlightError(element) {
		element.style.borderColor = "red";
		element.addEventListener("input", function () {
			element.style.borderColor = "";
		});
	}
}

// Initialize animations when page loads
document.addEventListener("DOMContentLoaded", () => {
	initCardAnimations();

	// Add tilt effect to cards only on desktop devices
	if (window.innerWidth > 768) {
		addTiltEffect();
	}
});

// Add animations to projects when they come into view
const observeProjects = () => {
	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add("visible");
					observer.unobserve(entry.target);
				}
			});
		},
		{ threshold: 0.2 }
	);

	projectCards.forEach((card) => {
		observer.observe(card);
	});
};

// Initialize project animations with Intersection Observer if supported
if ("IntersectionObserver" in window) {
	observeProjects();
}

// Theme Toggle Functionality
const themeToggle = document.getElementById("theme-toggle-checkbox");
const htmlElement = document.documentElement;

// Check if a theme preference is stored
function getStoredTheme() {
	return localStorage.getItem("theme");
}

// Set the theme based on user preference or system preference
function setTheme(theme) {
	if (theme === "dark") {
		htmlElement.setAttribute("data-theme", "dark");
		themeToggle.checked = true;
	} else {
		htmlElement.removeAttribute("data-theme");
		themeToggle.checked = false;
	}
}

// Handle theme toggle changes
themeToggle.addEventListener("change", function () {
	if (this.checked) {
		setTheme("dark");
		localStorage.setItem("theme", "dark");
	} else {
		setTheme("light");
		localStorage.setItem("theme", "light");
	}
});

// Detect user's preferred color scheme
function detectPreferredColorScheme() {
	// Check if user has previously chosen a theme
	const storedTheme = getStoredTheme();
	if (storedTheme) {
		return storedTheme;
	}

	// Check system preference
	if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
		return "dark";
	}

	return "light";
}

// Initialize theme
document.addEventListener("DOMContentLoaded", function () {
	const preferredTheme = detectPreferredColorScheme();
	setTheme(preferredTheme);
});

// Highlight active navigation link based on section in view
const sections = document.querySelectorAll("section");
const navLinksForActiveState = document.querySelectorAll(".nav-links a");

// Set up Intersection Observer options
const observerOptions = {
	root: null, // Use viewport as root
	rootMargin: "-100px 0px -100px 0px", // Add negative top margin to account for header height
	threshold: 0.1 // Decrease threshold to 0.1 to make detection more sensitive
};

// Create the Intersection Observer
const sectionObserver = new IntersectionObserver((entries) => {
	entries.forEach((entry) => {
		// When a section enters the viewport
		if (entry.isIntersecting) {
			// Get the id of the section in view
			const id = entry.target.getAttribute("id");
			console.log("Section in view:", id); // Debug which section is detected

			// Remove active class from all nav links
			navLinksForActiveState.forEach((link) => {
				link.classList.remove("active");
			});

			// Add active class to the corresponding nav link
			const correspondingLink = document.querySelector(`.nav-links a[href="#${id}"]`);
			if (correspondingLink) {
				correspondingLink.classList.add("active");
			}
		}
	});
}, observerOptions);

// Explicitly debug projects section
const projectsSection = document.getElementById("projects");
// if (projectsSection) {
// 	console.log("Projects section found:", projectsSection.id);
// }

// Start observing all sections
sections.forEach((section) => {
	console.log("Observing section:", section.id); // Debug which sections are being observed
	sectionObserver.observe(section);
});
