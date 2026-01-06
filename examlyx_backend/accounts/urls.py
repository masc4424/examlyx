from django.urls import path
from accounts.api import *

app_name = 'accounts'

urlpatterns = [
    path('csrf/', get_csrf_token, name='csrf'),
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
    path('profile/', user_profile, name='profile'),
    path('check-auth/', check_auth, name='check_auth'),
]