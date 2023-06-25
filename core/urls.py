from django.urls import path

from . import views

urlpatterns = [
    path('signup', views.UserCreateView.as_view(), name='User Sign up'),
    path('login', views.UserAuthenticateView.as_view(), name='User Login'),
    path('profile', views.UserView.as_view(), name='User Profile'),
    path('update_password', views.UserUpdatePasswordView.as_view(), name='User Update Password'),
]
