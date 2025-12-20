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

  // Booking form handler (if exists on page)
  const bookingForm = document.getElementById("bookingForm");
  if (bookingForm) {
    bookingForm.addEventListener("submit", handleBookingSubmit);
  }

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

// Booking form submission handler
async function handleBookingSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData);
  
  try {
    const response = await fetch('/booking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    const result = await response.json();
    if (result.success) {
      alert(result.message);
      event.target.reset();
      closeBookingModal();
    } else {
      alert(result.message || 'Error submitting booking');
    }
  } catch (error) {
    alert('Error submitting booking. Please try again.');
  }
}

// User menu dropdown
function toggleUserMenu() {
  const dropdown = document.getElementById('userMenuDropdown');
  if (dropdown) {
    dropdown.classList.toggle('show');
  }
}

// Close user menu when clicking outside
document.addEventListener('click', function(event) {
  const userMenu = document.getElementById('userMenuDropdown');
  const userAvatar = document.querySelector('.user-avatar');
  if (userMenu && userAvatar && !userMenu.contains(event.target) && !userAvatar.contains(event.target)) {
    userMenu.classList.remove('show');
  }
});

// Profile modals
function openProfileModal() {
  const dropdown = document.getElementById('userMenuDropdown');
  if (dropdown) dropdown.classList.remove('show');
  
  // Fetch current user data and show modal
  fetch('/auth/profile')
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        const user = data.user;
        document.getElementById('profileFirstName').value = user.firstName || '';
        document.getElementById('profileLastName').value = user.lastName || '';
        document.getElementById('profilePhone').value = user.phoneNumber || '';
        document.getElementById('profileLocation').value = user.location || '';
        document.getElementById('profileProfession').value = user.profession || '';
        document.getElementById('profileModal').style.display = 'flex';
        document.body.style.overflow = 'hidden';
      }
    })
    .catch(() => {
      // If route doesn't return JSON, just show empty form
      const profileModal = document.getElementById('profileModal');
      if (profileModal) {
        profileModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
      }
    });
}

function closeProfileModal() {
  const profileModal = document.getElementById('profileModal');
  if (profileModal) {
    profileModal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
}

function openProfilePicModal() {
  const dropdown = document.getElementById('userMenuDropdown');
  if (dropdown) dropdown.classList.remove('show');
  const profilePicModal = document.getElementById('profilePicModal');
  if (profilePicModal) {
    profilePicModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
}

function closeProfilePicModal() {
  const profilePicModal = document.getElementById('profilePicModal');
  if (profilePicModal) {
    profilePicModal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
}

async function handleProfileSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  
  const data = {
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    phoneNumber: formData.get('phoneNumber'),
    location: formData.get('location'),
    profession: formData.get('profession')
  };
  
  try {
    const response = await fetch('/auth/profile/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    const result = await response.json();
    
    if (!response.ok || !result.success) {
      alert(result.message || 'Error updating profile');
      return;
    }
    
    alert('Profile updated successfully!');
    closeProfileModal();
    location.reload(); // Reload to update navbar
  } catch (error) {
    console.error('Error updating profile:', error);
    alert('Error updating profile. Please check the console for details.');
  }
}

async function handleProfilePicSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  
  try {
    const response = await fetch('/auth/profile/picture', {
      method: 'POST',
      body: formData
    });
    
    const result = await response.json();
    
    if (!response.ok || !result.success) {
      alert(result.message || 'Error updating profile picture');
      return;
    }
    
    alert('Profile picture updated successfully!');
    closeProfilePicModal();
    location.reload(); // Reload to update navbar
  } catch (error) {
    console.error('Error updating profile picture:', error);
    alert('Error updating profile picture. Please check the console for details.');
  }
}

function previewProfilePic(input) {
  const preview = document.getElementById('profilePicPreviewImg');
  if (preview && input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      preview.src = e.target.result;
      preview.style.display = 'block';
    };
    reader.readAsDataURL(input.files[0]);
  }
}

// Logout handler
async function handleLogout() {
  try {
    const response = await fetch('/auth/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    
    const result = await response.json();
    if (result.success) {
      window.location.href = result.redirect || '/';
    }
  } catch (error) {
    console.error('Logout error:', error);
  }
}
