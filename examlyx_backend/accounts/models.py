from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone

class Role(models.Model):
    """
    Role table to store different user roles
    """
    name = models.CharField(max_length=50, unique=True)
    display_name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    is_superadmin = models.BooleanField(default=False, help_text="Super admin role with all permissions")
    is_student_specific = models.BooleanField(default=False, help_text="Role specific to students")
    is_teacher_specific = models.BooleanField(default=False, help_text="Role specific to teachers")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'roles'
        ordering = ['name']
    
    def __str__(self):
        return self.display_name
    
    def has_permission(self, permission_code):
        """
        Check if this role has a specific permission
        """
        if self.is_superadmin:
            return True
        return self.role_permissions.filter(
            permission__code=permission_code,
            permission__is_active=True,
            is_active=True
        ).exists()


class RoleUser(models.Model):
    """
    Junction table linking users to roles (many-to-many relationship)
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='role_assignments')
    role = models.ForeignKey(Role, on_delete=models.CASCADE, related_name='user_assignments')
    assigned_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_roles')
    assigned_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'role_users'
        unique_together = ('user', 'role')
        ordering = ['-assigned_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.role.name}"


class Permission(models.Model):
    """
    Permission table to store all available permissions in the system
    """
    PERMISSION_CATEGORIES = [
        ('USER', 'User Management'),
        ('ROLE', 'Role Management'),
        ('CONTENT', 'Content Management'),
        ('STUDENT', 'Student Operations'),
        ('TEACHER', 'Teacher Operations'),
        ('SYSTEM', 'System Operations'),
        ('REPORT', 'Reports & Analytics'),
        ('OTHER', 'Other'),
    ]
    
    code = models.CharField(max_length=100, unique=True, help_text="Unique permission code (e.g., 'user.create')")
    name = models.CharField(max_length=100, help_text="Display name for the permission")
    description = models.TextField(blank=True, null=True)
    category = models.CharField(max_length=20, choices=PERMISSION_CATEGORIES, default='OTHER')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'permissions'
        ordering = ['category', 'code']
    
    def __str__(self):
        return f"{self.name} ({self.code})"


class RolePermission(models.Model):
    """
    Junction table linking roles to permissions (many-to-many relationship)
    """
    role = models.ForeignKey(Role, on_delete=models.CASCADE, related_name='role_permissions')
    permission = models.ForeignKey(Permission, on_delete=models.CASCADE, related_name='permission_roles')
    assigned_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_permissions')
    assigned_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'role_permissions'
        unique_together = ('role', 'permission')
        ordering = ['-assigned_at']
    
    def __str__(self):
        return f"{self.role.name} - {self.permission.code}"


# Utility functions for user permission checking
def user_has_permission(user, permission_code):
    """
    Check if a user has a specific permission through their roles
    """
    if not user.is_authenticated:
        return False
    
    # Django superusers have all permissions
    if user.is_superuser:
        return True
    
    # Check through active role assignments
    active_roles = RoleUser.objects.filter(
        user=user,
        is_active=True,
        role__is_active=True
    ).select_related('role')
    
    for role_user in active_roles:
        if role_user.role.has_permission(permission_code):
            return True
    
    return False


def get_user_permissions(user):
    """
    Get all permissions for a user through their roles
    """
    if not user.is_authenticated:
        return []
    
    if user.is_superuser:
        return Permission.objects.filter(is_active=True)
    
    # Get all active roles for the user
    active_roles = RoleUser.objects.filter(
        user=user,
        is_active=True,
        role__is_active=True
    ).values_list('role_id', flat=True)
    
    # Get all permissions for these roles
    permissions = Permission.objects.filter(
        permission_roles__role_id__in=active_roles,
        permission_roles__is_active=True,
        is_active=True
    ).distinct()
    
    return permissions

class Client(models.Model):
    """
    Client organization
    """
    name = models.CharField(max_length=255, unique=True)
    email = models.EmailField(blank=True, null=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'clients'
        ordering = ['name']

    def __str__(self):
        return self.name


class UserClient(models.Model):
    """
    Link user to client(s)
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_clients')
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='client_users')
    assigned_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_clients')
    assigned_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'user_clients'
        unique_together = ('user', 'client')

    def __str__(self):
        return f"{self.user.username} - {self.client.name}"


class UserDeleted(models.Model):
    """
    Soft deleted users for auditing
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='deleted_record')
    deleted_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='deleted_users')
    deleted_at = models.DateTimeField(auto_now_add=True)
    reason = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'user_deleted'

    def __str__(self):
        return f"Deleted User: {self.user.username}"


class ClientDeleted(models.Model):
    """
    Soft deleted clients
    """
    client = models.OneToOneField(Client, on_delete=models.CASCADE, related_name='deleted_record')
    deleted_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='deleted_clients')
    deleted_at = models.DateTimeField(auto_now_add=True)
    reason = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'client_deleted'

    def __str__(self):
        return f"Deleted Client: {self.client.name}"


class ClientSettings(models.Model):
    """
    Settings for clients
    """
    client = models.OneToOneField(Client, on_delete=models.CASCADE, related_name='settings')
    is_user_course = models.BooleanField(default=False)
    is_course_program_flow = models.BooleanField(default=False)
    is_course_batch_flow = models.BooleanField(default=False)
    is_s3_enabled = models.BooleanField(default=False)
    s3_bucket_link = models.URLField(blank=True, null=True)
    s3_bucket_name = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        db_table = 'client_settings'

    def __str__(self):
        return f"Settings for {self.client.name}"