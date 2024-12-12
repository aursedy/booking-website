
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
  // Handle Payment Form Submission
  const paymentForm = document.getElementById("payment-form");
  if (paymentForm) {
    paymentForm.addEventListener("submit", (event) => {
      event.preventDefault();

      // Simulate payment processing
      alert("Processing your payment...");

      // Retrieve user details from localStorage
      const userDetails = JSON.parse(localStorage.getItem("userDetails"));

      // Retrieve selected room details from localStorage
      const selectedRoom = JSON.parse(localStorage.getItem("selectedRoom"));

      // Create reservation object
      const reservation = {
        user: userDetails,
        room: selectedRoom,
        dateOfPurchase: new Date().toISOString(),
        id: "AAA"
      };

      setTimeout(() => {
        localStorage.setItem("reservations", JSON.stringify(reservation));
        alert("Payment successful! Redirecting to homepage...");
        window.location.href = "index.html";
      }, 2000); // Simulate 2-second delay
    });
  }

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
                  <p><strong>City:</strong> ${room.city}</p>
                  <p><strong>Bed(s):</strong> ${room.beds}</p>
                  <p><strong>Guest(s):</strong> ${room.maxGuests}</p>
                </div>
                <h3>$${room.price}<span>/night</span></h3>
              </div>
              <button class="btn" id="details-button-${room.id}">Details</button>
            `;
          
            // Append the room card to the container
            //document.querySelector(".rooms__container").appendChild(roomCard);

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
      const image = document.getElementById("room-img");
      image.src =  `assets/room-${room.id}.jpg `;
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

  //filtering the rooms

// Filter function
// Fetch rooms from the JSON file and apply filters
document.querySelector(".booking form").addEventListener("submit", async (event) => {
  event.preventDefault(); // Prevent the form from reloading the page

  // Collect filter criteria from the form
  const filters = {
    checkInDate: document.querySelector("#arrival").value,
    checkOutDate: document.querySelector("#departure").value,
    guests: parseInt(document.querySelector("#guests").value, 10),
    beds: parseInt(document.querySelector("#beds").value, 10),
    city: document.querySelector("#city").value
  };

  console.log("Filters submitted:", filters); // Debugging filter values

  // Fetch rooms from JSON and filter them
  try {
    const response = await fetch("rooms.json");
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const rooms = await response.json();

    // Apply the filter logic
    const filteredRooms = rooms.filter((room) => {
      const checkIn = new Date(filters.checkInDate);
      const checkOut = new Date(filters.checkOutDate);
      const availableFrom = new Date(room.availableFrom);
      const availableTo = new Date(room.availableTo);

      const isDateAvailable = checkIn >= availableFrom && checkOut <= availableTo;
      const isGuestSuitable = room.maxGuests >= filters.guests;
      const isBedSuitable = room.beds >= filters.beds;
      const isCityMatch = filters.city ? room.city.toLowerCase() === filters.city.toLowerCase() : true;

      return isDateAvailable && isGuestSuitable && isBedSuitable && isCityMatch;
    });

    // Display the filtered rooms
    displayRooms(filteredRooms);
  } catch (error) {
    console.error("Error fetching or filtering rooms:", error);
  }
});

// Function to display filtered rooms
function displayRooms(rooms) {
  const container = document.querySelector(".room__container");
  container.innerHTML = ""; // Clear previous results

  if (rooms.length === 0) {
    container.innerHTML = "<center><h2>No rooms match your criteria.</h2></center>";
    return;
  }

  rooms.forEach((room) => {
    const roomCard = document.createElement("div");
    roomCard.className = "room__card";
    roomCard.innerHTML = `
      <img src="assets/room-${room.id}.jpg" alt="room">
      <div class="room__card__details">
        <div>
          <h4>${room.name}</h4>
          <p>${room.description}</p>
          <p><strong>City:</strong> ${room.city}</p>
          <p><strong>Beds:</strong> ${room.beds}</p>
        </div>
        <h3>$${room.price}<span>/night</span></h3>
      </div>
      <button class="btn" id="details-button-${room.id}">Details</button>
    `;

    // Attach click listener for room navigation
    roomCard.addEventListener("click", () => {
      localStorage.setItem("selectedRoom", JSON.stringify(room));
      window.location.href = "room-details.html";
    });

    container.appendChild(roomCard);
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

