function register() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Fill all fields");
    return;
  }

  if (localStorage.getItem(email)) {
    alert("User already exists");
    return;
  }

  const user = {
    email,
    password,
    files: [],
    trash: [],
    recent: []
  };

  localStorage.setItem(email, JSON.stringify(user));
  alert("Registration successful ✅");
  window.location.href = "index.html";
}

function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  const user = JSON.parse(localStorage.getItem(email));

  if (!user || user.password !== password) {
    alert("Invalid email or password ❌");
    return;
  }

  localStorage.setItem("currentUser", email);
  window.location.href = "dashboard.html";
}