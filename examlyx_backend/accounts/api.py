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
from accounts.models import *


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


@api_view(['GET'])
@permission_classes([AllowAny])  # Changed to AllowAny
def check_auth(request):
    """Check if user is authenticated"""
    if request.user.is_authenticated:
        roles = get_user_roles(request.user)
        primary_role = get_user_primary_role(request.user)
        
        return Response({
            'isAuthenticated': True,
            'user': {
                'id': request.user.id,
                'username': request.user.username,
                'email': request.user.email,
                'role': primary_role,
                'roles': roles,
                'first_name': request.user.first_name,
                'last_name': request.user.last_name,
            }
        }, status=status.HTTP_200_OK)
    else:
        return Response({
            'isAuthenticated': False,
            'user': None
        }, status=status.HTTP_200_OK)
    
def get_role_by_name(role_name):
    try:
        return Role.objects.get(name=role_name, is_active=True)
    except Role.DoesNotExist:
        return None
    
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
    data = request.data

    first_name = data.get('first_name', '').strip()
    last_name = data.get('last_name', '').strip()
    email = data.get('email', '').strip().lower()
    password = data.get('password')
    phone_number = data.get('phone_number', None)
    course = data.get('course', None)

    # ---------- REQUIRED FIELD VALIDATION ----------
    if not all([first_name, last_name, email, password]):
        return Response(
            {'error': 'First name, last name, email, and password are required'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # ---------- EMAIL VALIDATION ----------
    if User.objects.filter(email=email).exists():
        return Response(
            {'email': 'Email already exists'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # ---------- PASSWORD VALIDATION (Industry Standard) ----------
    password_regex = re.compile(
        r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$'
    )

    if not password_regex.match(password):
        return Response(
            {
                'password': (
                    'Password must be at least 8 characters long and include '
                    'uppercase, lowercase, number, and special character'
                )
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # ---------- AUTO USERNAME GENERATION ----------
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

    # ---------- OPTIONAL FIELDS ----------
    if phone_number:
        user.phone_number = phone_number

    if course:
        user.course = course

    user.save()

    # ---------- ASSIGN TEACHER ROLE ----------
    role = get_role_by_name('teacher')
    if not role:
        return Response(
            {'error': 'Teacher role not found'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    RoleUser.objects.create(
        user=user,
        role=role,
        assigned_by=request.user
    )

    # ---------- SUCCESS RESPONSE ----------
    return Response(
        {
            'message': 'Teacher created successfully',
            'username': username
        },
        status=status.HTTP_201_CREATED
    )

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
def create_student(request):
    data = request.data
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    email = data.get('email')
    password = data.get('password')
    phone_number = data.get('phone_number', None)
    course = data.get('course', None)

    # Validate required fields
    if not all([first_name, last_name, email, password]):
        return Response(
            {'error': 'First name, last name, email, and password are required'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Auto-generate username
    base_username = slugify(f"{first_name}{last_name}")  # e.g., john-doe
    username = base_username
    counter = 1
    while User.objects.filter(username=username).exists():
        username = f"{base_username}{counter}"
        counter += 1

    # Create user
    user = User.objects.create_user(
        username=username,
        email=email,
        password=password,
        first_name=first_name,
        last_name=last_name
    )

    # Assign student role
    role = get_role_by_name('student')
    if not role:
        return Response(
            {'error': 'Student role not found'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    RoleUser.objects.create(
        user=user,
        role=role,
        assigned_by=request.user
    )

    return Response(
        {
            'message': 'Student created successfully',
            'username': username,
            'phone_number': phone_number,
            'course': course
        },
        status=status.HTTP_201_CREATED
    )

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