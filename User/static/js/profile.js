document.addEventListener("DOMContentLoaded", async function () {
    const access = localStorage.getItem("access_token");
    const refresh = localStorage.getItem("refresh_token");

    async function fetchWithAuth(url, options = {}) {
        options.headers = options.headers || {};
        options.headers["Authorization"] = "Bearer " + access;

        let response = await fetch(url, options);

        if (response.status === 401 && refresh) {
            const refreshResponse = await fetch("http://127.0.0.1:8000/api/user/login/refresh/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ refresh: refresh })
            });

            if (refreshResponse.ok) {
                const data = await refreshResponse.json();
                localStorage.setItem("access_token", data.access);
                options.headers["Authorization"] = "Bearer " + data.access;
                response = await fetch(url, options);
            } else {
                alert("Session expired. Please log in again.");
                window.location.href = "/api/user/loginbutton/";
                return;
            }
        }

        return response;
    }

    const res = await fetchWithAuth("http://127.0.0.1:8000/api/user/profile/");
    if (res.ok) {
        const data = await res.json();
        document.getElementById("username").textContent = data.username;
        document.getElementById("fullname").textContent = `${data.first_name} ${data.last_name}`;
        document.getElementById("email").textContent = data.email;
        document.getElementById("gender").textContent = data.gender;
        document.getElementById("joined").textContent = new Date(data.account_created_at).toDateString();

        const profileImg = document.getElementById("profile-image");
        profileImg.src = data.gender === "M" ? "/static/images/Male.jpg" : "/static/images/female.png";
    } else {
        alert("Unable to fetch profile.");
    }
});
