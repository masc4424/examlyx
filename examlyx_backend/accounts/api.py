from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.views.decorators.csrf import ensure_csrf_cookie
from django.middleware.csrf import get_token
from .models import RoleUser


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
@permission_classes([IsAuthenticated])
def check_auth(request):
    """Check if user is authenticated"""
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