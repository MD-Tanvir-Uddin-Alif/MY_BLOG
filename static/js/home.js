window.onload = function() {
    let token = localStorage.getItem('access_token');
    let userLoggedIN = false;

    let createblog = document.getElementById('create-blog');
    let profile = document.getElementById('profile');
    let signup = document.getElementById('signup');
    let login = document.getElementById('login');

    if(userLoggedIN) {
        createblog.style.display = 'inline-block';
        profile.style.display = 'inline-block';

        signup.style.display = 'none';
        login.style.display = 'none';
    }
    else{
        createblog.style.display = 'none';
        profile.style.display = 'none';

        signup.style.display = 'inline-block';
        login.style.display = 'inline-block';
    }
}