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

        document.getElementById("first_name").value = data.first_name;
        document.getElementById("last_name").value = data.last_name;
        document.getElementById("email").value = data.email;
        document.getElementById("gender").value = data.gender;
    }

    document.getElementById("edit-profile-form").addEventListener("submit", async (e) => {
        e.preventDefault();

        const updatedata = {
            first_name: document.getElementById("first_name").value,
            last_name: document.getElementById("last_name").value,
            email: document.getElementById("email").value,
            gender: document.getElementById("gender").value
        }

        const updateRes = await fetchWithAuth("http://127.0.0.1:8000/api/user/update/profile/", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedata)
        });

        if (updateRes.ok) {
            alert("Profile updated successfully!");
            window.location.href = "/api/user/profilepage/";
        } else {
            alert("Error updating profile.");
        }
    });
})