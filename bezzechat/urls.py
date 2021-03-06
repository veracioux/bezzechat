"""bezzechat URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.contrib.staticfiles import urls
from django.urls import path

from . import views

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", views.index, name="index"),
    path("register/", views.register, name="register"),
    path("register/check/", views.register_check, name="register_check"),
    path("register/submit/", views.register_submit, name="register_submit"),
    path("login/", views.login, name="login"),
    path("login/check/", views.login_check, name="login_check"),
    path("login/submit/", views.login_submit, name="login_submit"),
    path("chat/", views.chat_global, name="chat_global"),
    path("chat/<str:user>/", views.chat_private, name="chat_private"),
] + urls.staticfiles_urlpatterns()
