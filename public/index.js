const githubLoginButton = document.getElementById("github-login-button");

githubLoginButton.addEventListener("click", async () => {
    // window.location.href = "http://localhost:8000/auth/github"; 
  try {
    const response = await fetch("http://localhost:8000/auth/github/", {
      method: "GET",
    });

    if (response.ok) {
      // Redirect the user to the GitHub OAuth login page
      window.location.href = response.url;
    } else {
      // Handle error response
      console.error("Error initiating GitHub login:", response.statusText);
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
});
