from django.contrib.auth.models import User
from django.db import models
from accounts.models import Client


class Course(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True, null=True)
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='courses')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'courses'

    def __str__(self):
        return self.name


class Program(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='programs')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'programs'
        unique_together = ('name', 'client')

    def __str__(self):
        return self.name


class Batch(models.Model):
    name = models.CharField(max_length=255)
    start_date = models.DateField()
    end_date = models.DateField()
    client = models.ForeignKey(
        Client,
        on_delete=models.CASCADE,
        related_name='batches',
        null=True,
        blank=True
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'batches'
        unique_together = ('name', 'client')

    def __str__(self):
        return self.name


class UserCourse(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_courses')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='course_users')
    assigned_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_courses')
    assigned_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'user_courses'
        unique_together = ('user', 'course')

    def __str__(self):
        return f"{self.user.username} - {self.course.name}"


class CourseProgram(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='course_programs')
    program = models.ForeignKey(Program, on_delete=models.CASCADE, related_name='program_courses')
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'course_programs'
        unique_together = ('course', 'program')

    def __str__(self):
        return f"{self.course.name} - {self.program.name}"


class BatchCourse(models.Model):
    batch = models.ForeignKey(Batch, on_delete=models.CASCADE, related_name='batch_courses')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='course_batches')
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'batch_courses'
        unique_together = ('batch', 'course')

    def __str__(self):
        return f"{self.batch.name} - {self.course.name}"


class UserBatch(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_batches')
    batch = models.ForeignKey(Batch, on_delete=models.CASCADE, related_name='batch_users')
    assigned_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_batches')
    assigned_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'user_batches'
        unique_together = ('user', 'batch')

    def __str__(self):
        return f"{self.user.username} - {self.batch.name}"


class UserProgram(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_programs')
    program = models.ForeignKey(Program, on_delete=models.CASCADE, related_name='program_users')
    assigned_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_programs')
    assigned_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'user_programs'
        unique_together = ('user', 'program')

    def __str__(self):
        return f"{self.user.username} - {self.program.name}"
