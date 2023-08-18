const githubLoginButton = document.getElementById("github-login-button");

githubLoginButton.addEventListener("click", async () => {
    window.location.href = "http://localhost:8000/auth/github"; 
});

const googleLoginButton = document.getElementById("google-login-button");

googleLoginButton.addEventListener("click", async () => {
    window.location.href = "http://localhost:8000/auth/google"; 
});

// const facebookLoginButton = document.getElementById("facebook-login-button");

// facebookLoginButton.addEventListener("click", async () => {
//     window.location.href = "http://localhost:8000/auth/facebook"; 
// });