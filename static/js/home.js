window.onload = function() {
    let token = localStorage.getItem('access_token');
    let userLoggedIN = !!token;

    let createblog = document.getElementById('create-blog');
    let profile = document.getElementById('profile');
    let signup = document.getElementById('signup');
    let login = document.getElementById('login');
    let logout = document.getElementById('logout');

    if(userLoggedIN) {
        createblog.style.display = 'inline-block';
        profile.style.display = 'inline-block';
        logout.style.display = 'inline-block';

        signup.style.display = 'none';
        login.style.display = 'none';
    }
    else{
        createblog.style.display = 'none';
        profile.style.display = 'none';
        logout.style.display = 'none';

        signup.style.display = 'inline-block';
        login.style.display = 'inline-block';
    }

    logout.addEventListener('click', function (e) {
        e.preventDefault();

        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');

        window.location.href = "/api/user/loginbutton/";
    });
}