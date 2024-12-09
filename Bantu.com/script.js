
const scrollRevealOption = {
  distance: "50px",
  origin: "bottom",
  duration: 1000,
};

// header container
ScrollReveal().reveal(".header__container .section__subheader", {
  ...scrollRevealOption,
});

ScrollReveal().reveal(".header__container h1", {
  ...scrollRevealOption,
  delay: 500,
});

ScrollReveal().reveal(".header__container .btn", {
  ...scrollRevealOption,
  delay: 1000,
});

// room container
ScrollReveal().reveal(".room__card", {
  ...scrollRevealOption,
  interval: 500,
});

// feature container
ScrollReveal().reveal(".feature__card", {
  ...scrollRevealOption,
  interval: 500,
});

// news container
ScrollReveal().reveal(".news__card", {
  ...scrollRevealOption,
  interval: 500,
});

document.addEventListener("DOMContentLoaded", () => {
  // Handle Booking Form Submission
  const bookingForm = document.getElementById("booking-form");
  if (bookingForm) {
    bookingForm.addEventListener("submit", (event) => {
      event.preventDefault();
      // Save user details in localStorage
      const userDetails = {
        firstName: document.getElementById("first-name").value,
        lastName: document.getElementById("last-name").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
      };
      localStorage.setItem("userDetails", JSON.stringify(userDetails));
      window.location.href = "payment.html";
    });
  }

  // Handle Payment Form Submission
  const paymentForm = document.getElementById("payment-form");
  if (paymentForm) {
    paymentForm.addEventListener("submit", (event) => {
      event.preventDefault();

      // Simulate payment processing
      alert("Processing your payment...");
      setTimeout(() => {
        alert("Payment successful! Redirecting to homepage...");
        window.location.href = "index.html";
      }, 2000); // Simulate 2-second delay
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  // Homepage: Fetch and Display Rooms
  if (window.location.pathname.endsWith("index.html")) {
    fetch("./rooms.json")
      .then((response) => response.json())
      .then((rooms) => {
        const roomGrid = document.querySelector(".room__grid");
        roomGrid.innerHTML = ""; // Clear any existing content

        rooms.forEach((room) => {
          const roomCard = document.createElement("div");
          roomCard.className = "room__card";
          roomCard.innerHTML = `
            <img src="assets/room-${room.id}.jpg" alt="room">
            <div class="room__card__details">
              <div>
                <h4>${room.name}</h4>
                <p>${room.description}</p>
              </div>
              <h3>$${room.price}<span>/night</span></h3>
            </div>
            <button class="btn" id="details-button-${room.id}">Details</button>
          `;

          // Attach Click Listener for Room Navigation
          roomCard.addEventListener("click", () => {
            localStorage.setItem("selectedRoom", JSON.stringify(room));
            window.location.href = "room-details.html";
          });

          // Attach Details Button Listener
          const detailsButton = roomCard.querySelector(`#details-button-${room.id}`);
          detailsButton.addEventListener("click", (event) => {
            // Prevent click propagation to the room card's click event
            event.stopPropagation();

            // Store selected room in localStorage and navigate to the room details page
            localStorage.setItem("selectedRoom", JSON.stringify(room));
            window.location.href = "room-details.html";
          });

          roomGrid.appendChild(roomCard); // Append card to grid
        });
      })
      .catch((error) => {
        console.error("Error fetching rooms:", error);
      });
  }

  // Room Details Page: Display Room Information
  if (window.location.pathname.endsWith("room-details.html")) {
    const room = JSON.parse(localStorage.getItem("selectedRoom"));
    if (room) {
      document.getElementById("room-name").textContent = room.name;
      document.getElementById("room-description").textContent = room.description;
      document.getElementById("room-price").textContent = `$${room.price}/night`;

      const reviewList = document.getElementById("review-list");
      room.reviews.forEach((review) => {
        const li = document.createElement("li");
        li.textContent = `${review.user} (${review.rating}/5): ${review.comment}`;
        reviewList.appendChild(li);
      });
    } else {
      alert("No room selected. Redirecting to homepage.");
      window.location.href = "index.html";
    }

    // "Book" Button Logic
    document.getElementById("book-button").addEventListener("click", () => {
      window.location.href = "booking.html";
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("register-form");

  if (registerForm) {
    registerForm.addEventListener("submit", (event) => {
      event.preventDefault();

      // Step 1: Retrieve form data
      const firstName = document.getElementById("first-name").value.trim();
      const lastName = document.getElementById("last-name").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirm-password").value;

      // Step 2: Validation
      if (!firstName || !lastName || !email || !password || !confirmPassword) {
        alert("Please fill in all fields.");
        return;
      }

      if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
      }

      // Step 3: Retrieve or initialize users array
      let users = [];
      const usersData = localStorage.getItem("users");
      if (usersData) {
        try {
          users = JSON.parse(usersData);
        } catch (e) {
          console.error("Error parsing users data from localStorage:", e);
        }
      }

      // Step 4: Check for existing email
      if (users.some((user) => user.email === email)) {
        alert("Email is already registered.");
        return;
      }

      // Step 5: Save new user
      const newUser = { firstName, lastName, email, password };
      users.push(newUser);

      try {
        localStorage.setItem("users", JSON.stringify(users));
        console.log("Users saved to localStorage:", users);
        alert("Registration successful! Redirecting to login...");
        window.location.href = "login.html";
      } catch (e) {
        console.error("Error saving users to localStorage:", e);
        alert("Failed to save user. Please try again.");
      }
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");

  if (loginForm) {
    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();

      // Get user inputs
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;

      // Retrieve users from localStorage
      const users = JSON.parse(localStorage.getItem("users")) || [];

      // Check if user exists
      const user = users.find((user) => user.email === email && user.password === password);

      if (user) {
        alert(`Welcome, ${user.firstName}! Login successful.`);
        localStorage.setItem("isAuthenticated", true); // Save login state
        localStorage.setItem("currentUser", JSON.stringify(user)); // Save current user
        window.location.href = "index.html"; // Redirect to homepage
      } else {
        alert("Invalid email or password. Please try again.");
      }
    });
  }
});

