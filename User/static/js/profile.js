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

    const blogContainer = document.getElementById("user-blogs");

    try {
        const res = await fetchWithAuth("http://127.0.0.1:8000/api/blog/user/blog/");
        if (res.ok) {
            const blogs = await res.json();
            console.log(blogs);

            if (blogs.length === 0) {
                blogContainer.innerHTML = `<p class="text-gray-500">No blogs found.</p>`;
                return;
            }

            blogs.forEach(blog => {
                const blogDiv = document.createElement("div");
                blogDiv.className = "p-4 bg-gray-50 rounded-lg border hover:shadow transition";

                blogDiv.innerHTML = `
                    <h4 class="text-lg font-semibold text-gray-800">${blog.title}</h4>
                    <p class="text-sm text-gray-500">Published on: ${new Date(blog.created_at).toLocaleString()}</p>
                    <p class="mt-2 text-gray-700">${blog.content.substring(0, 200)}...</p>
                    <div class="mt-4 flex justify-between">
                        <button class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600" onclick="editBlog(${blog.id})">Edit</button>
                        <button class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600" onclick="deleteBlog(${blog.id})">Delete</button>
                    </div>
                `;

                blogContainer.appendChild(blogDiv);
            });
        } else {
            blogContainer.innerHTML = `<p class="text-red-500">Failed to load blogs. Please try again.</p>`;
        }
    } catch (error) {
        console.error("Error fetching user blogs:", error);
        blogContainer.innerHTML = `<p class="text-red-500">An error occurred.</p>`;
    }
});

async function editBlog(blogId) {
    // Get the current blog content
    const blogTitle = prompt("Enter new blog title");
    const blogContent = prompt("Enter new blog content");

    if (!blogTitle || !blogContent) return;

    const access = localStorage.getItem("access_token");

    const res = await fetch(`http://127.0.0.1:8000/api/blog/update/${blogId}/`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + access,
        },
        body: JSON.stringify({
            title: blogTitle,
            content: blogContent,
        }),
    });

    if (res.ok) {
        alert("Blog updated successfully!");
        location.reload(); // Reload to update the UI
    } else {
        alert("Failed to update the blog.");
    }
}

// async function deleteBlog(blogId) {
//     const confirmDelete = confirm("Are you sure you want to delete this blog?");
//     if (!confirmDelete) return;

//     const access = localStorage.getItem("access_token");

//     const res = await fetch(`http://127.0.0.1:8000/api/blog/delete/${blogId}/`, {
//         method: "DELETE",
//         headers: {
//             "Authorization": "Bearer " + access,
//         },
//     });

//     if (res.ok) {
//         alert("Blog deleted successfully!");
//         location.reload(); // Reload to remove the blog from the UI
//     } else {
//         alert("Failed to delete the blog.");
//     }
// }
