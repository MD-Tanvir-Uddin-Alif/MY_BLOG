document.addEventListener("DOMContentLoaded", async function () {
    let access = localStorage.getItem("access_token");
    let refresh = localStorage.getItem("refresh_token");
    let userId = localStorage.getItem("id");

    if (!userId && access) {
        try {
            const userRes = await fetch("http://127.0.0.1:8000/api/user/profile/", {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + access
                }
            });

            if (userRes.ok) {
                const userData = await userRes.json();
                console.log("Fetched user profile:", userData);

                userId = userData.id;
                if (userId) {
                    localStorage.setItem("id", userId);
                } else {
                    alert("User ID not found. Please log in again.");
                    window.location.href = "/api/user/loginbutton/";
                    return;
                }
            } else {
                alert("User info could not be loaded. Please log in again.");
                window.location.href = "/api/user/loginbutton/";
                return;
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
            alert("Network error. Please try again.");
            window.location.href = "/api/user/loginbutton/";
            return;
        }
    }

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
                access = data.access;
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

    const blogContainer = document.getElementById("blog-container");
    blogContainer.innerHTML = "";

    const postRes = await fetch("http://127.0.0.1:8000/api/blog/list/");
    const posts = await postRes.json();

    for (let post of posts) {
        const postDiv = document.createElement("div");
        postDiv.className = "bg-white shadow p-6 rounded space-y-4";

        postDiv.innerHTML = `
            <h2 class="text-2xl font-semibold">${post.title}</h2>
            <p>${post.content}</p>
            <p class="text-sm text-gray-500">Posted at: ${new Date(post.created_at).toLocaleString()}</p>

            <div id="comments-${post.id}" class="mt-4 space-y-2">
                <h4 class="font-semibold mb-1">Comments:</h4>
                <div class="comments-list"></div>
            </div>

            ${access ? `
            <form class="comment-form space-y-2" data-blog-id="${post.id}">
                <textarea placeholder="Write a comment..." class="w-full border p-2 rounded comment-text"></textarea>
                <button type="submit" class="bg-blue-600 text-white px-4 py-1 rounded">Comment</button>
            </form>
            ` : `<p class="text-sm text-gray-400 italic">Login to comment</p>`}
        `;

        blogContainer.appendChild(postDiv);
        loadComments(post.id);
    }

    async function loadComments(blogId) {
        const commentRes = await fetch(`http://127.0.0.1:8000/api/blog/comment/?blog=${blogId}`);
        const comments = await commentRes.json();

        const commentListDiv = document.querySelector(`#comments-${blogId} .comments-list`);
        commentListDiv.innerHTML = "";

        if (comments.length === 0) {
            commentListDiv.innerHTML = `<p class="text-gray-400">No comments yet.</p>`;
            return;
        }

        for (let comment of comments) {
            const commentItem = document.createElement("div");
            commentItem.className = "bg-gray-100 p-2 rounded";

            commentItem.innerHTML = `
                <p>${comment.text}</p>
                <p class="text-xs text-gray-500">At ${new Date(comment.created_at).toLocaleString()}</p>
            `;

            commentListDiv.appendChild(commentItem);
        }
    }

    document.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (e.target.classList.contains("comment-form")) {
            const blogId = e.target.getAttribute("data-blog-id");
            const textArea = e.target.querySelector(".comment-text");
            const text = textArea.value.trim();

            if (!text) {
                alert("Please write a comment.");
                return;
            }

            userId = localStorage.getItem("id");

            if (!userId) {
                alert("User ID missing. Please log in again.");
                window.location.href = "/api/user/loginbutton/";
                return;
            }

            const body = {
                blog: blogId,
                text: text,
                commentor: userId
            };

            console.log("Submitting comment:", body); 

            const response = await fetchWithAuth("http://127.0.0.1:8000/api/blog/comment/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            });

            if (response.ok) {
                textArea.value = "";
                loadComments(blogId);
            } else {
                const errorData = await response.json();
                console.error("Error:", errorData);
                alert(`Failed to post comment. Error: ${errorData.detail || 'Unknown error'}`);
            }
        }
    });
});
