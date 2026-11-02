// LOGIN FORM
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;
    const message = document.getElementById("loginMessage");

    if (!email || !password) {
      message.textContent = "Please fill all fields.";
      return;
    }

    message.textContent =
      "Login form validated! Connect backend for real login.";
  });
}


// SIGNUP FORM
const signupForm = document.getElementById("signupForm");

if (signupForm) {
  signupForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("signupName").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const phone = document.getElementById("signupPhone").value.trim();
    const password = document.getElementById("signupPassword").value;
    const confirmPassword =
      document.getElementById("confirmPassword").value;

    const message = document.getElementById("signupMessage");

    if (!name || !email || !phone || !password || !confirmPassword) {
      message.textContent = "Please fill all fields.";
      return;
    }

    if (password !== confirmPassword) {
      message.textContent = "Passwords do not match!";
      return;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      message.textContent = "Enter a valid 10 digit mobile number.";
      return;
    }

    message.textContent =
      "Signup form validated! Connect backend for real registration.";
  });
}


// TRACK ORDER FORM
const trackForm = document.getElementById("trackForm");

if (trackForm) {
  trackForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const orderId = document.getElementById("orderId").value.trim();
    const message = document.getElementById("trackMessage");
    const result = document.getElementById("orderResult");

    result.hidden = true;
    message.textContent = "Checking order...";

    try {
      const response = await fetch(
        "/api/orders/" + encodeURIComponent(orderId)
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Order not found");
      }

      result.hidden = false;
      message.textContent = "Order found successfully!";

      const status = data.status || "Order Placed";
      document.getElementById("currentStatus").textContent =
        "Current Status: " + status;

      const steps = [
        "Order Placed",
        "Preparing",
        "Out for Delivery",
        "Delivered"
      ];

      const currentIndex = steps.indexOf(status);

      document.querySelectorAll(".tracking-step").forEach((step, index) => {
        step.classList.toggle("completed", index <= currentIndex);
      });

    } catch (error) {
      message.textContent =
        "Order not found or backend is not connected yet.";
    }
  });
}