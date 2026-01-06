from django.contrib.auth.backends import ModelBackend
from django.contrib.auth.models import User
from django.db.models import Q


class EmailOrUsernameBackend(ModelBackend):
    """
    Custom authentication backend that allows users to log in with either
    their username or email address.
    """
    
    def authenticate(self, request, username=None, password=None, **kwargs):
        try:
            # Try to fetch the user by searching for username or email
            user = User.objects.get(
                Q(username=username) | Q(email=username)
            )
            
            # Check if the password is correct
            if user.check_password(password):
                return user
            
        except User.DoesNotExist:
            # No user was found, return None
            return None
        except User.MultipleObjectsReturned:
            # Multiple users found, return the first one
            user = User.objects.filter(
                Q(username=username) | Q(email=username)
            ).first()
            
            if user and user.check_password(password):
                return user
        
        return None
    
    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None