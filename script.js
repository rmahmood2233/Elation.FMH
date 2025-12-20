// ========================================
// ELATION BY FMH - MAIN JAVASCRIPT
// ========================================

// Booking Modal Functions
function openBookingModal() {
  const modal = document.getElementById("bookingModal");
  if (modal) {
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }
}

function closeBookingModal() {
  const modal = document.getElementById("bookingModal");
  if (modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "auto";
  }
}

// FAQ Toggle Function
function toggleFAQ(element) {
  element.classList.toggle("active");
}

// Document Ready - Initialize All Functions
document.addEventListener("DOMContentLoaded", function () {
  // Close modal when clicking outside
  const modal = document.getElementById("bookingModal");
  if (modal) {
    modal.addEventListener("click", function (e) {
      if (e.target === this) {
        closeBookingModal();
      }
    });
  }

  // Form Submission Handlers
  const forms = document.querySelectorAll("form");
  forms.forEach((form) => {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Show success message
      if (form.id === "signupForm") {
        alert(
          "Sign Up successful! Welcome! (Demo only - no backend connected)"
        );
        setTimeout(() => {
          window.location.href = "home.html";
        }, 500); // Redirect to home after signup
      } else if (form.id === "loginForm") {
        alert("Login successful! (Demo only - no backend connected)");
        setTimeout(() => {
          window.location.href = "home.html";
        }, 500); // Redirect to home after login
      } else {
        alert(
          "Thank you! Your message has been sent successfully. We'll get back to you within 24 hours."
        );
      }

      // Close modal if form is in modal
      if (form.closest(".modal-overlay") || form.closest(".booking-overlay")) {
        closeBookingModal();
      }

      // Reset form
      form.reset();
    });
  });

  // Password Toggle Functionality (works for both login & signup forms)
  const passwordToggles = document.querySelectorAll(".password-toggle");
  passwordToggles.forEach((toggle) => {
    toggle.addEventListener("click", function () {
      const input = this.previousElementSibling;
      if (input.type === "password") {
        input.type = "text";
        this.textContent = "🙈";
      } else {
        input.type = "password";
        this.textContent = "👁";
      }
    });
  });

  // Close modal on Escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeBookingModal();
    }
  });

  // Smooth scroll for anchor links (if any)
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href.length > 1) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }
    });
  });
});

// Add active class to current page nav link
window.addEventListener("load", function () {
  const currentPage = window.location.pathname.split("/").pop();
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (href === currentPage || (currentPage === "" && href === "index.html")) {
      link.classList.add("active");
    }
  });
});
