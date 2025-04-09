document.addEventListener("DOMContentLoaded", function (){
    console.log("Login page is connected");

    const loginform = document.getElementById("login-form");

    loginform.addEventListener("submit", async function (e) {
        e.preventDefault();

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value;

        const payload = {
            username,
            password
        };

        try {
            const response = await fetch("http://127.0.0.1:8000/api/user/login/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok){
                console.log("Loggin sucessful:", data);
                localStorage.setItem("access_token", data.access);
                localStorage.setItem("refresh_token", data.refresh);

                alert("Login successful!");
                window.location.href = "";
            } else {
                console.log("Login failed: ",data);
                alert("Login failed: " + (data.detail || JSON.stringify(data)));
            }
        } catch (error) {
            console.log("login error: ", error);
            alert("An error Occurred. Please try again.");
        }
    })
});