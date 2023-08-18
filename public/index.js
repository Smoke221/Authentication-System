// Helper function to remove a message after a delay
function removeMessageAfterDelay(messageElement, delay) {
  setTimeout(() => {
    messageElement.remove();
  }, delay);
}

const githubLoginButton = document.getElementById("github-login-button");

githubLoginButton.addEventListener("click", async () => {
  window.location.href = "http://localhost:8000/auth/github";
});

const googleLoginButton = document.getElementById("google-login-button");

googleLoginButton.addEventListener("click", async () => {
  window.location.href = "http://localhost:8000/auth/google";
});

const signupForm = document.getElementById("signup-form");
const signupButton = signupForm.querySelector('button[type="submit"]');
const loginForm = document.getElementById("login-form");
const loginButton = loginForm.querySelector('button[type="submit"]');

signupForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  signupButton.disabled = true;

  const signupName = signupForm.querySelector('[name="signup-name"]').value;
  const signupEmail = signupForm.querySelector('[name="signup-email"]').value;
  const signupPassword = signupForm.querySelector(
    '[name="signup-password"]'
  ).value;

  const response = await fetch("http://localhost:8000/user/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: signupName,
      email: signupEmail,
      password: signupPassword,
    }),
  });

  const data = await response.json();

  if (response.ok) {
    // Check if the message indicates successful registration
    if (data.message.includes("New user registered")) {
      // Create a more creative success message container
      const successContainer = document.createElement("div");
      successContainer.classList.add("success-message-container");

      // Add a success icon
      const successIcon = document.createElement("i");
      successIcon.classList.add("fas", "fa-check-circle", "success-icon");
      successContainer.appendChild(successIcon);

      // Add the success message
      const successMessage = document.createElement("p");
      successMessage.textContent =
        "Registration successful. You can now log in.";
      successMessage.classList.add("success-message");
      successContainer.appendChild(successMessage);

      signupForm.appendChild(successContainer);

      // Remove the success message after 2 seconds (2000 milliseconds)
      removeMessageAfterDelay(successContainer, 3000);
    }
  } else {
    // Check if the error message indicates existing email
    if (data.message.includes("User already exists")) {
      // Create a more creative error message container
      const errorContainer = document.createElement("div");
      errorContainer.classList.add("error-message-container");

      // Add an error icon
      const errorIcon = document.createElement("i");
      errorIcon.classList.add("fas", "fa-exclamation-triangle", "error-icon");
      errorContainer.appendChild(errorIcon);

      // Add the error message
      const errorMessage = document.createElement("p");
      errorMessage.textContent = "Email already exists. Please login instead.";
      errorMessage.classList.add("error-message");
      errorContainer.appendChild(errorMessage);

      signupForm.appendChild(errorContainer);

      removeMessageAfterDelay(errorContainer, 2000);
    } else {
      console.error(data.message);
    }
    signupButton.disabled = false;
  }
});

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  loginButton.disabled = true;

  // Get form input values
  const loginEmail = loginForm.querySelector('[name="login-email"]').value;
  const loginPassword = loginForm.querySelector('[name="login-password"]').value;

  // Make a POST request to your login backend route
  const response = await fetch("http://localhost:8000/user/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: loginEmail,
      password: loginPassword,
    }),
  });

  const data = await response.json();

  if (response.ok) {
    localStorage.setItem("authToken", data.token);
    window.location.href = "dashboard.html";
  } else {
    if (
      data.message === "Wrong password" ||
      data.message === "Wrong credentials"
    ) {
      // Handle wrong password or wrong credentials error
      const errorContainer = document.createElement("div");
      errorContainer.classList.add("error-message-container");
      const errorMessage = document.createElement("p");
      errorMessage.textContent =
        "Invalid credentials. Please check your email and password.";
      errorMessage.classList.add("error-message");
      errorContainer.appendChild(errorMessage);
      loginForm.appendChild(errorContainer);
      removeMessageAfterDelay(errorContainer, 2000);
    } else {
      // Handle other errors
      console.error(data.message);
    }
    loginButton.disabled = false;
  }
});
