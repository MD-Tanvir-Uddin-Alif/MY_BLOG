from django.urls import path
from .import views
from rest_framework_simplejwt.views import(
    TokenObtainPairView,
    TokenRefreshView,
)


urlpatterns = [
    path('register/', views.CustomUserModelView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('login/refresh/', TokenRefreshView.as_view(), name='login_refresh'),
    path('profile/', views.CustomUserProfileView.as_view(), name='profile'),
    path('update/profile/', views.CustomUserUpdateView().as_view(), name='update_profile'),
    
    
    # buttons
    path('signupbuttons/', views.signUp_view, name='signup_buttons'),
    path('loginbutton/', views.loginUp_view, name='login_button'),
    path('profilepage/', views.proifile_view, name='profile_page'),
    path('edit/profile/', views.editprofile_view, name='edit_profile'),
]
