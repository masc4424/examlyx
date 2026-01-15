from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.views.decorators.csrf import ensure_csrf_cookie
from django.middleware.csrf import get_token
from django.utils.text import slugify
from django.db import transaction
import uuid
import re
from django.contrib.auth.hashers import make_password
import random
import string
from accounts.models import *
from Course_Program_Batch.models import *


@api_view(['GET'])
@permission_classes([AllowAny])
@ensure_csrf_cookie
def get_csrf_token(request):
    """Get CSRF token for the session"""
    return Response({'csrfToken': get_token(request)})


def get_user_roles(user):
    """Helper function to get all active roles for a user"""
    role_assignments = RoleUser.objects.filter(
        user=user, 
        is_active=True
    ).select_related('role').filter(role__is_active=True)
    
    return [ra.role.name for ra in role_assignments]


def get_user_primary_role(user):
    """Helper function to get primary (first assigned) active role for a user"""
    role_assignment = RoleUser.objects.filter(
        user=user, 
        is_active=True
    ).select_related('role').filter(role__is_active=True).first()
    
    return role_assignment.role.name if role_assignment else None


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """Login endpoint that accepts email or username"""
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response(
            {'error': 'Please provide both username/email and password'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Try to find user by email if username looks like an email
    user_obj = None
    if '@' in username:
        try:
            user_obj = User.objects.get(email=username)
            username = user_obj.username  # Use actual username for authentication
        except User.DoesNotExist:
            pass
    
    # Authenticate using custom backend
    user = authenticate(request, username=username, password=password)
    
    if user is not None:
        login(request, user)
        
        # Get user roles
        roles = get_user_roles(user)
        primary_role = get_user_primary_role(user)
        
        return Response({
            'message': 'Login successful',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'role': primary_role,  # Primary role for backward compatibility
                'roles': roles,  # All roles
                'first_name': user.first_name,
                'last_name': user.last_name,
            }
        }, status=status.HTTP_200_OK)
    else:
        # Log failed attempt for debugging
        import logging
        logger = logging.getLogger(__name__)
        logger.warning(f"Failed login attempt for username/email: {request.data.get('username')}")
        
        return Response(
            {'error': 'Invalid credentials'},
            status=status.HTTP_401_UNAUTHORIZED
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """Logout endpoint"""
    logout(request)
    return Response(
        {'message': 'Logout successful'},
        status=status.HTTP_200_OK
    )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    """Get current user profile"""
    user = request.user
    roles = get_user_roles(user)
    primary_role = get_user_primary_role(user)
    
    return Response({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'role': primary_role,
        'roles': roles,
        'first_name': user.first_name,
        'last_name': user.last_name,
    }, status=status.HTTP_200_OK)

def get_role_flags(user):
    roles = RoleUser.objects.filter(
        user=user,
        is_active=True,
        role__is_active=True
    ).select_related('role')

    return {
        'is_superadmin': roles.filter(role__is_superadmin=True).exists(),
        'is_admin': roles.filter(role__is_admin=True).exists(),
        'is_teacher': roles.filter(role__is_teacher_specific=True).exists(),
        'is_student': roles.filter(role__is_student_specific=True).exists(),
    }

@api_view(['GET'])
@permission_classes([AllowAny])
def check_auth(request):
    """Check if user is authenticated"""
    if request.user.is_authenticated:
        roles = get_user_roles(request.user)
        primary_role = get_user_primary_role(request.user)
        role_flags = get_role_flags(request.user)

        return Response({
            'isAuthenticated': True,
            'user': {
                'id': request.user.id,
                'username': request.user.username,
                'email': request.user.email,

                # Role info
                'role': primary_role,
                'roles': roles,

                # ✅ ROLE FLAGS (THIS IS WHAT YOU NEED)
                'is_superadmin': role_flags['is_superadmin'],
                'is_admin': role_flags['is_admin'],
                'is_teacher': role_flags['is_teacher'],
                'is_student': role_flags['is_student'],

                'first_name': request.user.first_name,
                'last_name': request.user.last_name,
            }
        }, status=status.HTTP_200_OK)

    return Response({
        'isAuthenticated': False,
        'user': None
    }, status=status.HTTP_200_OK)

    
def get_role_by_name(role_name):
    try:
        return Role.objects.get(name=role_name, is_active=True)
    except Role.DoesNotExist:
        return None
    
def get_client_for_user(request, client_id=None):
    """
    Return the client to assign the new user.
    If client_id is provided, use it. Otherwise, get from logged-in user.
    """
    if client_id:
        return client_id
    user_clients = UserClient.objects.filter(user=request.user, is_active=True)
    if not user_clients.exists():
        return None
    return user_clients.first().client_id

def create_user_and_profile(request, user_type='student'):
    """
    Generic function to create user (teacher/student) with UserProfile
    and map to course/program/batch based on ClientSettings.
    """
    data = request.data
    first_name = data.get('first_name', '').strip()
    last_name = data.get('last_name', '').strip()
    email = data.get('email', '').strip().lower()
    password = data.get('password')
    phone_number = data.get('phone_number')
    address = data.get('address')
    date_of_birth = data.get('dob')  # Expecting 'YYYY-MM-DD'
    country_id = data.get('country')
    state_id = data.get('state')
    city_id = data.get('city')
    course_id = data.get('course')
    program_id = data.get('program')
    batch_id = data.get('batch')
    client_id = get_client_for_user(request, data.get('client_id'))

    # ---------- REQUIRED FIELDS ----------
    if not all([first_name, last_name, email, password]):
        return Response({'error': 'First name, last name, email and password are required'},
                        status=status.HTTP_400_BAD_REQUEST)

    if not client_id:
        return Response({'error': 'No client found for the user'}, status=status.HTTP_400_BAD_REQUEST)

    # ---------- EMAIL VALIDATION ----------
    if User.objects.filter(email=email).exists():
        return Response({'email': 'Email already exists'}, status=400)

    # ---------- PASSWORD VALIDATION ----------
    password_regex = re.compile(r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$')
    if not password_regex.match(password):
        return Response({'password': 'Weak password'}, status=status.HTTP_400_BAD_REQUEST)

    # ---------- FETCH FOREIGN KEY INSTANCES ----------
    country_instance = None
    state_instance = None
    city_instance = None
    
    if country_id:
        try:
            country_instance = Country.objects.get(id=country_id)
        except Country.DoesNotExist:
            return Response({'error': 'Invalid country ID'}, status=status.HTTP_400_BAD_REQUEST)
    
    if state_id:
        try:
            state_instance = State.objects.get(id=state_id)
        except State.DoesNotExist:
            return Response({'error': 'Invalid state ID'}, status=status.HTTP_400_BAD_REQUEST)
    
    if city_id:
        try:
            city_instance = City.objects.get(id=city_id)
        except City.DoesNotExist:
            return Response({'error': 'Invalid city ID'}, status=status.HTTP_400_BAD_REQUEST)

    # ---------- USERNAME ----------
    base_username = slugify(f"{first_name}.{last_name}")
    username = base_username
    counter = 1
    while User.objects.filter(username=username).exists():
        username = f"{base_username}{counter}"
        counter += 1

    # ---------- CREATE USER ----------
    user = User.objects.create_user(
        username=username,
        email=email,
        password=password,
        first_name=first_name,
        last_name=last_name,
        is_active=True
    )

    # ---------- ASSIGN CLIENT ----------
    UserClient.objects.create(user=user, client_id=client_id, assigned_by=request.user)

    # ---------- ASSIGN ROLE ----------
    role = get_role_by_name(user_type)
    if not role:
        return Response({'error': f'{user_type.capitalize()} role not found'}, status=500)

    RoleUser.objects.create(user=user, role=role, assigned_by=request.user)

    # ---------- CREATE USER PROFILE ----------
    profile = UserProfile.objects.create(
        user=user,
        client_id=client_id,
        role=role,
        phone_number=phone_number,
        address=address,
        date_of_birth=date_of_birth,
        country=country_instance,
        state=state_instance,
        city=city_instance,
        is_active=True
    )

    # ---------- CLIENT SETTINGS FLOW ----------
    try:
        settings = ClientSettings.objects.get(client_id=client_id, is_active=True)
    except ClientSettings.DoesNotExist:
        settings = None

    mapped_flows = []

    if settings:
        # UserCourse mapping
        if settings.is_user_course and course_id:
            try:
                course = Course.objects.get(id=course_id)
                profile.course = course
                profile.save()
                UserCourse.objects.create(user=user, course=course)
                mapped_flows.append('course')
            except Course.DoesNotExist:
                return Response({'error': 'Invalid course ID'}, status=status.HTTP_400_BAD_REQUEST)

        # UserProgram mapping
        if settings.is_course_program_flow and program_id:
            try:
                program = Program.objects.get(id=program_id)
                UserProgram.objects.create(user=user, program=program)
                mapped_flows.append('program')
            except Program.DoesNotExist:
                return Response({'error': 'Invalid program ID'}, status=status.HTTP_400_BAD_REQUEST)

        # UserBatch mapping
        if settings.is_course_batch_flow and batch_id:
            try:
                batch = Batch.objects.get(id=batch_id)
                profile.batch = batch
                profile.save()
                UserBatch.objects.create(user=user, batch=batch)
                mapped_flows.append('batch')
            except Batch.DoesNotExist:
                return Response({'error': 'Invalid batch ID'}, status=status.HTTP_400_BAD_REQUEST)

    return Response({
        'message': f'{user_type.capitalize()} created successfully',
        'username': username,
        'mapped_flows': mapped_flows
    }, status=201)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_teachers(request):
    teachers = User.objects.filter(
        role_assignments__role__name='teacher',
        role_assignments__is_active=True,
        is_active=True
    ).distinct()

    data = [{
        'id': u.id,
        'username': u.username,
        'email': u.email,
        'first_name':u.first_name,
        'last_name':u.last_name,
        'is_active': u.is_active
    } for u in teachers]

    return Response(data, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@transaction.atomic
def create_teacher(request):
    return create_user_and_profile(request, user_type='teacher')

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_students(request):
    students = User.objects.filter(
        role_assignments__role__name='student',
        role_assignments__is_active=True,
        is_active=True
    ).distinct()

    data = [{
        'id': u.id,
        'username': u.username,
        'email': u.email,
        'first_name':u.first_name,
        'last_name':u.last_name,
        'is_active': u.is_active
    } for u in students]

    return Response(data, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@transaction.atomic
def create_student(request):
    return create_user_and_profile(request, user_type='student')

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_admins(request):
    """
    List all active users with role 'admin'.
    """
    admins = User.objects.filter(
        role_assignments__role__name='admin',
        role_assignments__is_active=True,
        is_active=True
    ).distinct()

    data = [{
        'id': u.id,
        'username': u.username,
        'email': u.email,
        'first_name': u.first_name,
        'last_name': u.last_name,
        'is_active': u.is_active
    } for u in admins]

    return Response(data, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@transaction.atomic
def create_admin(request):
    """
    Create an admin user with role 'admin' and assign client if provided.
    """
    return create_user_and_profile(request, user_type='admin')

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
@transaction.atomic
def delete_user(request, user_id):
    """
    Delete a user (teacher, student, or admin) by user ID.
    This is a soft delete: sets is_active=False and deactivates roles.
    Only authenticated users can perform this.
    """

    try:
        # Prevent deleting self accidentally
        if request.user.id == user_id:
            return Response(
                {'error': 'You cannot delete your own account.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response(
            {'error': 'User not found.'},
            status=status.HTTP_404_NOT_FOUND
        )

    # Soft delete user
    user.is_active = False
    user.save()

    # Deactivate all role assignments
    RoleUser.objects.filter(user=user, is_active=True).update(is_active=False)

    return Response(
        {'message': f'User "{user.username}" has been deleted successfully.'},
        status=status.HTTP_200_OK
    )

# -----------------------------
# CLIENT API
# -----------------------------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_clients(request):
    """
    List all clients with additional info like student_count and teacher_count.
    """
    clients = Client.objects.filter(is_active = True, is_delete = False)
    data = []
    for c in clients:
        data.append({
            'id': c.id,
            'name': c.name,
            'email': c.email,
            'phone_number': c.phone_number,
            'is_active': c.is_active,
            'created_at': c.created_at,
            'updated_at': c.updated_at,
            'student_count': c.students.count() if hasattr(c, 'students') else 0,
            'teacher_count': c.teachers.count() if hasattr(c, 'teachers') else 0,
            'subscription_start_date': getattr(c, 'subscription_start_date', None),
            'subscription_end_date': getattr(c, 'subscription_end_date', None),
        })
    return Response(data, status=200)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_client(request):
    """
    Create a new client along with its settings and an admin user in a single API call
    """
    data = request.data
    name = data.get('name')
    email = data.get('email')
    phone_number = data.get('phone_number')
    subscription_start_date = data.get('subscription_start_date')
    subscription_end_date = data.get('subscription_end_date')

    # ClientSettings fields
    is_user_course = data.get('is_user_course', False)
    is_course_program_flow = data.get('is_course_program_flow', False)
    is_course_batch_flow = data.get('is_course_batch_flow', False)
    is_s3_enabled = data.get('is_s3_enabled', False)
    s3_bucket_link = data.get('s3_bucket_link', '')
    s3_bucket_name = data.get('s3_bucket_name', '')
    is_subscription_base_client = data.get('is_subscription_base_client', False)

    if not name:
        return Response({'error': 'Client name is required'}, status=400)

    if Client.objects.filter(name=name).exists():
        return Response({'error': 'Client with this name already exists'}, status=400)

    # Split name into first_name and last_name
    name_parts = name.strip().split(maxsplit=1)
    first_name = name_parts[0]
    last_name = name_parts[1] if len(name_parts) > 1 else ''

    # Generate unique username
    base_username = slugify(name.lower().replace(' ', '_'))
    username = base_username
    counter = 1
    while User.objects.filter(username=username).exists():
        username = f"{base_username}_{counter}"
        counter += 1

    # ---------- Create Client ----------
    client = Client.objects.create(
        name=name,
        email=email,
        phone_number=phone_number,
        subscription_start_date=subscription_start_date,
        subscription_end_date=subscription_end_date,
        is_active=True
    )

    # ---------- Create ClientSettings ----------
    ClientSettings.objects.create(
        client=client,
        is_user_course=is_user_course,
        is_course_program_flow=is_course_program_flow,
        is_course_batch_flow=is_course_batch_flow,
        is_s3_enabled=is_s3_enabled,
        s3_bucket_link=s3_bucket_link,
        s3_bucket_name=s3_bucket_name,
        is_subscription_base_client=is_subscription_base_client
    )

    # ---------- Get or Create Admin Role ----------
    try:
        admin_role = Role.objects.get(name='Admin', is_admin=True)
    except Role.DoesNotExist:
        admin_role = Role.objects.create(
            name='Admin',
            display_name='Administrator',
            description='Administrator with full access',
            is_admin=True
        )

    # ---------- Create Admin User ----------
    default_password = 'Test@123'
    admin_user = User.objects.create(
        username=username,
        email=email or f"{username}@{slugify(name)}.com",
        first_name=first_name,
        last_name=last_name,
        password=make_password(default_password),
        is_active=True,
        is_staff=False,
        is_superuser=False
    )

    # ---------- Assign Role to User ----------
    RoleUser.objects.create(
        user=admin_user,
        role=admin_role,
        assigned_by=request.user
    )

    # ---------- Assign Client to User ----------
    UserClient.objects.create(
        user=admin_user,
        client=client,
        assigned_by=request.user
    )

    return Response({
        'message': 'Client created successfully with settings and admin user',
        'id': client.id,
        'name': client.name,
        'admin_user': {
            'username': admin_user.username,
            'email': admin_user.email,
            'first_name': admin_user.first_name,
            'last_name': admin_user.last_name,
            'default_password': default_password,
            'role': admin_role.name
        }
    }, status=201)



@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_client(request, client_id):
    """
    Soft delete a client by ID along with its ClientSettings.
    Sets is_active=False and is_delete=True for both client and settings.
    """
    try:
        client = Client.objects.get(id=client_id)
    except Client.DoesNotExist:
        return Response({'error': 'Client not found'}, status=404)

    # ---------- Soft delete client ----------
    client.is_active = False
    client.is_delete = True
    client.save()

    # ---------- Soft delete associated ClientSettings ----------
    if hasattr(client, 'settings'):
        client.settings.is_active = False
        client.settings.is_delete = True
        client.settings.save()

    return Response(
        {'message': f'Client "{client.name}" and its settings have been soft deleted successfully'},
        status=200
    )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_client_settings(request, client_id):
    """
    Get active client settings by client ID
    """
    try:
        settings = ClientSettings.objects.get(
            client_id=client_id,
            is_active=True,
            is_delete=False
        )
    except ClientSettings.DoesNotExist:
        return Response(
            {'error': 'Client settings not found'},
            status=status.HTTP_404_NOT_FOUND
        )

    return Response({
        'client_id': client_id,
        'is_user_course': settings.is_user_course,
        'is_course_program_flow': settings.is_course_program_flow,
        'is_course_batch_flow': settings.is_course_batch_flow,
        'is_s3_enabled': settings.is_s3_enabled,
        'is_subscription_base_client': settings.is_subscription_base_client
    }, status=status.HTTP_200_OK)

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth.models import User
from accounts.models import Role, RoleUser

# -----------------------------
# Users
# -----------------------------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_users(request):
    """Get all active users"""
    users = User.objects.filter(is_active=True)
    data = [{
        'id': u.id,
        'username': u.username,
        'email': u.email,
        'first_name': u.first_name,
        'last_name': u.last_name,
    } for u in users]
    return Response(data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user(request, user_id):
    """Get single user details"""
    try:
        u = User.objects.get(id=user_id, is_active=True)
        roles = [ra.role.name for ra in u.role_assignments.filter(is_active=True)]
        return Response({
            'id': u.id,
            'username': u.username,
            'email': u.email,
            'first_name': u.first_name,
            'last_name': u.last_name,
            'roles': roles
        })
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_roles(request):
    """Get all active roles"""
    roles = Role.objects.filter(is_active=True)
    data = [{'id': r.id, 'name': r.name, 'display_name': r.display_name} for r in roles]
    return Response(data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_countries(request):
    countries = Country.objects.all().order_by('name')
    return Response([
        {
            'id': c.id,
            'name': c.name,
            'sortname': c.sortname,
            'phonecode': c.phonecode
        } for c in countries
    ])

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_states(request, country_id):
    states = State.objects.filter(country_id=country_id).order_by('name')
    return Response([
        {
            'id': s.id,
            'name': s.name
        } for s in states
    ])

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_cities(request, state_id):
    cities = City.objects.filter(state_id=state_id).order_by('name')
    return Response([
        {
            'id': c.id,
            'name': c.name
        } for c in cities
    ])
