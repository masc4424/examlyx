from django.contrib import admin
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import Role, RoleUser, Permission, RolePermission


@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ('name', 'display_name', 'is_superadmin', 'is_student_specific', 
                    'is_teacher_specific', 'is_active', 'created_at')
    list_filter = ('is_active', 'is_superadmin', 'is_student_specific', 'is_teacher_specific', 'created_at')
    search_fields = ('name', 'display_name', 'description')
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        ('Role Information', {
            'fields': ('name', 'display_name', 'description')
        }),
        ('Role Types', {
            'fields': ('is_superadmin', 'is_student_specific', 'is_teacher_specific')
        }),
        ('Status', {
            'fields': ('is_active',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.prefetch_related('role_permissions__permission')


@admin.register(RoleUser)
class RoleUserAdmin(admin.ModelAdmin):
    list_display = ('user', 'role', 'assigned_by', 'assigned_at', 'is_active')
    list_filter = ('role', 'is_active', 'assigned_at')
    search_fields = ('user__username', 'user__email', 'role__name')
    readonly_fields = ('assigned_at',)
    autocomplete_fields = ['user', 'assigned_by']
    
    fieldsets = (
        ('Assignment Information', {
            'fields': ('user', 'role', 'assigned_by', 'is_active')
        }),
        ('Timestamp', {
            'fields': ('assigned_at',),
            'classes': ('collapse',)
        }),
    )
    
    def save_model(self, request, obj, form, change):
        if not change:  # New assignment
            obj.assigned_by = request.user
        super().save_model(request, obj, form, change)


@admin.register(Permission)
class PermissionAdmin(admin.ModelAdmin):
    list_display = ('code', 'name', 'category', 'is_active', 'created_at')
    list_filter = ('category', 'is_active', 'created_at')
    search_fields = ('code', 'name', 'description')
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        ('Permission Information', {
            'fields': ('code', 'name', 'description', 'category')
        }),
        ('Status', {
            'fields': ('is_active',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(RolePermission)
class RolePermissionAdmin(admin.ModelAdmin):
    list_display = ('role', 'permission', 'assigned_by', 'assigned_at', 'is_active')
    list_filter = ('role', 'permission__category', 'is_active', 'assigned_at')
    search_fields = ('role__name', 'permission__code', 'permission__name')
    readonly_fields = ('assigned_at',)
    autocomplete_fields = ['assigned_by']
    
    fieldsets = (
        ('Assignment Information', {
            'fields': ('role', 'permission', 'assigned_by', 'is_active')
        }),
        ('Timestamp', {
            'fields': ('assigned_at',),
            'classes': ('collapse',)
        }),
    )
    
    def save_model(self, request, obj, form, change):
        if not change:  # New assignment
            obj.assigned_by = request.user
        super().save_model(request, obj, form, change)


# Inline for Role Permissions in Role Admin
class RolePermissionInline(admin.TabularInline):
    model = RolePermission
    fk_name = 'role'
    extra = 1
    fields = ('permission', 'is_active', 'assigned_at')
    readonly_fields = ('assigned_at',)
    autocomplete_fields = ['permission']


# Update RoleAdmin to include permissions inline
RoleAdmin.inlines = [RolePermissionInline]


# Extend the default User admin to show roles and permissions
class RoleUserInline(admin.TabularInline):
    model = RoleUser
    fk_name = 'user'
    extra = 1
    fields = ('role', 'is_active', 'assigned_at')
    readonly_fields = ('assigned_at',)


class CustomUserAdmin(BaseUserAdmin):
    inlines = [RoleUserInline]
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'get_roles', 'get_permissions_count')
    search_fields = ['username', 'email', 'first_name', 'last_name']
    
    def get_roles(self, obj):
        roles = RoleUser.objects.filter(user=obj, is_active=True).select_related('role')
        return ', '.join([ru.role.display_name for ru in roles]) if roles else 'No roles'
    get_roles.short_description = 'Active Roles'
    
    def get_permissions_count(self, obj):
        from .models import get_user_permissions
        permissions = get_user_permissions(obj)
        return permissions.count()
    get_permissions_count.short_description = 'Permissions'


# Unregister the default User admin and register the custom one
admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)