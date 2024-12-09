
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
