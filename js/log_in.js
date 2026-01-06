document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault(); // prevent page reload

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
        // send login request
        const response = await fetch("http://localhost:8080/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        if (!response.ok) {
            throw new Error("Invalid email or password");
        }

        const user = await response.json();

        // store user in sessionStorage
        sessionStorage.setItem("user", JSON.stringify(user));

        // redirect to dashboard/home
        window.location.href = "index.html";
        alert("Welcome, " + user.firstName);

    } catch (error) {
        alert("Login failed: " + error.message);
    }
});
