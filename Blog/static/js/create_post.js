document.addEventListener("DOMContentLoaded", async function () {
    console.log("connected");

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

    const blogform = document.getElementById("blog-form");

    blogform.addEventListener("submit", async function (e) {
        e.preventDefault();  // Prevent form submission

        const title = document.getElementById("title").value;
        const content = document.getElementById("content").value;

        let author = "janina";  // Default fallback author

        // Fetch the user profile to get the user ID (author)
        const useres = await fetchWithAuth("http://127.0.0.1:8000/api/user/profile/");
        if (useres.ok) {
            const data = await useres.json();
            author = data.id;  // Assuming the backend expects `author` and not `user_id`
        }

        // Corrected payload structure with `author`
        const payload = {
            author: author,  // Use author as expected by the backend
            title: title,
            content: content
        };

        // Send the blog post request
        const postBlogres = await fetchWithAuth("http://127.0.0.1:8000/api/blog/create/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (postBlogres.ok) {
            console.log("Post created successfully");
            window.location.href = "http://127.0.0.1:8000/";  // Redirect after success
        } else {
            const errorResponse = await postBlogres.json();
            console.log("Error response:", errorResponse);
            alert("Something went wrong. Please try again.");
        }
    });
});
