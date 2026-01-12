from django.urls import path
from accounts.api import *

app_name = 'accounts'

urlpatterns = [
    path('csrf/', get_csrf_token, name='csrf'),
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
    path('profile/', user_profile, name='profile'),
    path('check-auth/', check_auth, name='check_auth'),

    # Teachers
    path('teachers/', list_teachers),
    path('teachers/create/', create_teacher),

    # Students
    path('students/', list_students),
    path('students/create/', create_student),

    path('users/<int:user_id>/delete/', delete_user, name='delete_user'),
]