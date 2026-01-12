from django.contrib import admin
from .models import (
    Course, Program, Batch,
    UserCourse, CourseProgram, BatchCourse,
    UserBatch, UserProgram
)

# ----------------------------
# Course, Program, Batch Admin
# ----------------------------
@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('name', 'client', 'is_active', 'created_at')
    list_filter = ('client', 'is_active', 'created_at')
    search_fields = ('name', 'client__name', 'description')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(Program)
class ProgramAdmin(admin.ModelAdmin):
    list_display = ('name', 'client', 'is_active', 'created_at')
    list_filter = ('client', 'is_active', 'created_at')
    search_fields = ('name', 'client__name', 'description')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(Batch)
class BatchAdmin(admin.ModelAdmin):
    list_display = ('name', 'program', 'start_date', 'end_date', 'is_active')
    list_filter = ('program', 'is_active', 'start_date', 'end_date')
    search_fields = ('name', 'program__name')
    readonly_fields = ('created_at', 'updated_at')


# ----------------------------
# User Assignment Admin
# ----------------------------
@admin.register(UserCourse)
class UserCourseAdmin(admin.ModelAdmin):
    list_display = ('user', 'course', 'assigned_by', 'assigned_at', 'is_active')
    list_filter = ('course', 'is_active', 'assigned_at')
    search_fields = ('user__username', 'course__name')
    readonly_fields = ('assigned_at',)
    autocomplete_fields = ['user', 'assigned_by', 'course']

    def save_model(self, request, obj, form, change):
        if not change:
            obj.assigned_by = request.user
        super().save_model(request, obj, form, change)


@admin.register(UserBatch)
class UserBatchAdmin(admin.ModelAdmin):
    list_display = ('user', 'batch', 'assigned_by', 'assigned_at', 'is_active')
    list_filter = ('batch', 'is_active', 'assigned_at')
    search_fields = ('user__username', 'batch__name')
    readonly_fields = ('assigned_at',)
    autocomplete_fields = ['user', 'assigned_by', 'batch']

    def save_model(self, request, obj, form, change):
        if not change:
            obj.assigned_by = request.user
        super().save_model(request, obj, form, change)


@admin.register(UserProgram)
class UserProgramAdmin(admin.ModelAdmin):
    list_display = ('user', 'program', 'assigned_by', 'assigned_at', 'is_active')
    list_filter = ('program', 'is_active', 'assigned_at')
    search_fields = ('user__username', 'program__name')
    readonly_fields = ('assigned_at',)
    autocomplete_fields = ['user', 'assigned_by', 'program']

    def save_model(self, request, obj, form, change):
        if not change:
            obj.assigned_by = request.user
        super().save_model(request, obj, form, change)


# ----------------------------
# Junction Tables Admin
# ----------------------------
@admin.register(CourseProgram)
class CourseProgramAdmin(admin.ModelAdmin):
    list_display = ('course', 'program', 'is_active')
    list_filter = ('course', 'program', 'is_active')
    search_fields = ('course__name', 'program__name')


@admin.register(BatchCourse)
class BatchCourseAdmin(admin.ModelAdmin):
    list_display = ('batch', 'course', 'is_active')
    list_filter = ('batch', 'course', 'is_active')
    search_fields = ('batch__name', 'course__name')
