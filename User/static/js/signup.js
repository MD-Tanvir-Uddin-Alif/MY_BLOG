document.addEventListener("DOMContentLoaded", function() {
    // console.log("Sign up-- page is working");

    const signupForm = document.getElementById("signup-form");
    // console.log(signupForm);

    signupForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const first_name = document.getElementById("first_name").value.trim();
        const last_name = document.getElementById("last_name").value.trim();
        const username = document.getElementById("username").value.trim();
        const email = document.getElementById("email").value.trim();
        const gender = document.getElementById("gender").value;
        const password = document.getElementById("password").value;
        const password2 = document.getElementById("password2").value;

        // console.log(first_name, last_name, username, email, password, password2);

        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if (!passwordRegex.test(password)){
            alert("Password must be at least 8 characters long and contain both letters and numbers.");
            return;
        }

        if (password != password2){
            alert("Passwords do not match.");
            return;
        }


        const payload = {
            first_name,
            last_name,
            username,
            email,
            gender,
            password,
            password2
        };

        try {
            const response = await fetch("http://127.0.0.1:8000/api/user/register/",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json"

                },
                body: JSON.stringify(payload)
        });

        const data = await response.json();

        if ( response.ok){
            alert("Signup successful! Redirecting to login...");
            // window.location.href = "/api/user/loginbutton/";
        }else{
            console.error("Signup failed:", data);
            alert("Signup failed: " + (data.detail || JSON.stringify(data)));
        }
        } catch (error) {
            console.error("Error during signup:", error);
            alert("An error occurred. Please try again.");
        }
    });
});