from django.contrib import admin
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import (
    Role, RoleUser, Permission, RolePermission,
    Client, UserClient, UserDeleted, ClientDeleted, ClientSettings, UserProfile,
    get_user_permissions
)


# ----------------------------
# Role & Permission Admins
# ----------------------------
class RolePermissionInline(admin.TabularInline):
    model = RolePermission
    fk_name = 'role'
    extra = 1
    fields = ('permission', 'is_active', 'assigned_at')
    readonly_fields = ('assigned_at',)
    autocomplete_fields = ['permission']


@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ('name', 'display_name', 'is_admin', 'is_superadmin', 'is_student_specific',
                    'is_teacher_specific', 'is_active', 'created_at')
    list_filter = ('is_active', 'is_superadmin', 'is_student_specific', 'is_teacher_specific', 'created_at')
    search_fields = ('name', 'display_name', 'description')
    readonly_fields = ('created_at', 'updated_at')
    inlines = [RolePermissionInline]

    fieldsets = (
        ('Role Information', {'fields': ('name', 'display_name', 'description')}),
        ('Role Types', {'fields': ('is_admin', 'is_superadmin', 'is_student_specific', 'is_teacher_specific')}),
        ('Status', {'fields': ('is_active',)}),
        ('Timestamps', {'fields': ('created_at', 'updated_at'), 'classes': ('collapse',)}),
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
        ('Assignment Information', {'fields': ('user', 'role', 'assigned_by', 'is_active')}),
        ('Timestamp', {'fields': ('assigned_at',), 'classes': ('collapse',)}),
    )

    def save_model(self, request, obj, form, change):
        if not change:
            obj.assigned_by = request.user
        super().save_model(request, obj, form, change)


@admin.register(Permission)
class PermissionAdmin(admin.ModelAdmin):
    list_display = ('code', 'name', 'category', 'is_active', 'created_at')
    list_filter = ('category', 'is_active', 'created_at')
    search_fields = ('code', 'name', 'description')
    readonly_fields = ('created_at', 'updated_at')

    fieldsets = (
        ('Permission Information', {'fields': ('code', 'name', 'description', 'category')}),
        ('Status', {'fields': ('is_active',)}),
        ('Timestamps', {'fields': ('created_at', 'updated_at'), 'classes': ('collapse',)}),
    )


@admin.register(RolePermission)
class RolePermissionAdmin(admin.ModelAdmin):
    list_display = ('role', 'permission', 'assigned_by', 'assigned_at', 'is_active')
    list_filter = ('role', 'permission__category', 'is_active', 'assigned_at')
    search_fields = ('role__name', 'permission__code', 'permission__name')
    readonly_fields = ('assigned_at',)
    autocomplete_fields = ['assigned_by']

    fieldsets = (
        ('Assignment Information', {'fields': ('role', 'permission', 'assigned_by', 'is_active')}),
        ('Timestamp', {'fields': ('assigned_at',), 'classes': ('collapse',)}),
    )

    def save_model(self, request, obj, form, change):
        if not change:
            obj.assigned_by = request.user
        super().save_model(request, obj, form, change)


# ----------------------------
# Custom User Admin
# ----------------------------
class RoleUserInline(admin.TabularInline):
    model = RoleUser
    fk_name = 'user'
    extra = 1
    fields = ('role', 'is_active', 'assigned_at')
    readonly_fields = ('assigned_at',)


class CustomUserAdmin(BaseUserAdmin):
    inlines = [RoleUserInline]
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff',
                    'get_roles', 'get_permissions_count')
    search_fields = ['username', 'email', 'first_name', 'last_name']

    def get_roles(self, obj):
        roles = RoleUser.objects.filter(user=obj, is_active=True).select_related('role')
        return ', '.join([ru.role.display_name for ru in roles]) if roles else 'No roles'
    get_roles.short_description = 'Active Roles'

    def get_permissions_count(self, obj):
        permissions = get_user_permissions(obj)
        return permissions.count()
    get_permissions_count.short_description = 'Permissions'


# Unregister default User and register custom admin
admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)


# ----------------------------
# Client & User Client Admins
# ----------------------------
@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = (
        'name', 'email', 'phone_number', 'student_count', 'teacher_count',
        'subscription_start_date', 'subscription_end_date', 'is_active', 'created_at'
    )
    list_filter = ('is_active', 'created_at')
    search_fields = ('name', 'email', 'phone_number')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(UserClient)
class UserClientAdmin(admin.ModelAdmin):
    list_display = ('user', 'client', 'assigned_by', 'assigned_at', 'is_active')
    list_filter = ('client', 'is_active', 'assigned_at')
    search_fields = ('user__username', 'user__email', 'client__name')
    readonly_fields = ('assigned_at',)
    autocomplete_fields = ['user', 'assigned_by', 'client']

    def save_model(self, request, obj, form, change):
        if not change:
            obj.assigned_by = request.user
        super().save_model(request, obj, form, change)


@admin.register(UserDeleted)
class UserDeletedAdmin(admin.ModelAdmin):
    list_display = ('user', 'deleted_by', 'deleted_at', 'reason')
    list_filter = ('deleted_at',)
    search_fields = ('user__username', 'deleted_by__username', 'reason')
    readonly_fields = ('deleted_at',)


@admin.register(ClientDeleted)
class ClientDeletedAdmin(admin.ModelAdmin):
    list_display = ('client', 'deleted_by', 'deleted_at', 'reason')
    list_filter = ('deleted_at',)
    search_fields = ('client__name', 'deleted_by__username', 'reason')
    readonly_fields = ('deleted_at',)


@admin.register(ClientSettings)
class ClientSettingsAdmin(admin.ModelAdmin):
    list_display = (
        'client', 'is_user_course', 'is_course_program_flow',
        'is_course_batch_flow', 'is_s3_enabled', 'is_subscription_base_client', 's3_bucket_name'
    )
    list_filter = ('is_user_course', 'is_course_program_flow', 'is_course_batch_flow',
                   'is_s3_enabled', 'is_subscription_base_client')
    search_fields = ('client__name',)
    readonly_fields = ()

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = (
        'user', 'client', 'role', 'course', 'batch',
        'phone_number', 'date_of_birth', 'address',
        'country', 'state', 'city',
        'is_active', 'created_at'
    )

    list_filter = (
        'is_active', 'client', 'role', 'course', 'batch',
        'created_at', 'country', 'state', 'city'
    )

    search_fields = (
        'user__username', 'user__email',
        'user__first_name', 'user__last_name',
        'client__name', 'role__name',
        'course__name', 'batch__name',
        'phone_number', 'address',
        'country__name', 'state__name', 'city__name'
    )

    autocomplete_fields = ['user', 'client', 'role', 'course', 'batch']
    readonly_fields = ('created_at', 'updated_at')

    fieldsets = (
        ('User Information', {'fields': ('user', 'client', 'role')}),
        ('Course & Batch', {'fields': ('course', 'batch')}),
        ('Contact', {
            'fields': (
                'phone_number',
                'address',
                'date_of_birth',
                'country',
                'state',
                'city'
            )
        }),
        ('Status', {'fields': ('is_active', 'is_delete')}),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )