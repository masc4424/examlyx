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

    # Admins
    path('admins/create/', create_admin, name='create_admin'),
    path('admins/list/', list_admins, name='list_admins'),

    path('users/<int:user_id>/delete/', delete_user, name='delete_user'),

    # Clients
    path('clients/', list_clients),
    path('clients/<int:client_id>/settings/', get_client_settings),
    path('clients/create/', create_client),

    path('clients/<int:client_id>/delete/', delete_client),

    path('users/', get_users, name='get_users'),
    path('users/<int:user_id>/', get_user, name='get_user'),
    path('roles/', get_roles, name='get_roles'),

    path('countries/', list_countries, name='list_countries'),
    path('states/<int:country_id>/', list_states, name='list_states'),
    path('cities/<int:state_id>/', list_cities, name='list_cities'),
]