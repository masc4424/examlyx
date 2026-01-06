from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from accounts.models import Role, RoleUser


class Command(BaseCommand):
    help = 'Initialize roles and create test users'

    def handle(self, *args, **kwargs):
        self.stdout.write('Creating roles...')
        
        # Create roles
        roles_data = [
            {'name': 'superadmin', 'display_name': 'SuperAdmin', 'description': 'Super Administrator with full access'},
            {'name': 'admin', 'display_name': 'Admin', 'description': 'Administrator with management access'},
            {'name': 'teacher', 'display_name': 'Teacher', 'description': 'Teacher with exam management access'},
            {'name': 'student', 'display_name': 'Student', 'description': 'Student with exam taking access'},
        ]
        
        created_roles = {}
        for role_data in roles_data:
            role, created = Role.objects.get_or_create(
                name=role_data['name'],
                defaults={
                    'display_name': role_data['display_name'],
                    'description': role_data['description']
                }
            )
            created_roles[role_data['name']] = role
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created role: {role.display_name}'))
            else:
                self.stdout.write(self.style.WARNING(f'Role already exists: {role.display_name}'))
        
        self.stdout.write('\nCreating test users...')
        
        # Create test users
        users_data = [
            {
                'username': 'superadmin',
                'email': 'superadmin@example.com',
                'password': 'admin123',
                'first_name': 'Super',
                'last_name': 'Admin',
                'role': 'superadmin'
            },
            {
                'username': 'admin',
                'email': 'admin@example.com',
                'password': 'admin123',
                'first_name': 'Admin',
                'last_name': 'User',
                'role': 'admin'
            },
            {
                'username': 'teacher',
                'email': 'teacher@example.com',
                'password': 'teacher123',
                'first_name': 'John',
                'last_name': 'Teacher',
                'role': 'teacher'
            },
            {
                'username': 'student',
                'email': 'student@example.com',
                'password': 'student123',
                'first_name': 'Jane',
                'last_name': 'Student',
                'role': 'student'
            },
        ]
        
        for user_data in users_data:
            role_name = user_data.pop('role')
            password = user_data.pop('password')
            
            user, created = User.objects.get_or_create(
                username=user_data['username'],
                defaults={
                    'email': user_data['email'],
                    'first_name': user_data['first_name'],
                    'last_name': user_data['last_name']
                }
            )
            
            if created:
                user.set_password(password)
                user.save()
                self.stdout.write(self.style.SUCCESS(f'Created user: {user.username}'))
            else:
                self.stdout.write(self.style.WARNING(f'User already exists: {user.username}'))
            
            # Assign role to user
            role = created_roles[role_name]
            role_user, ru_created = RoleUser.objects.get_or_create(
                user=user,
                role=role,
                defaults={'is_active': True}
            )
            
            if ru_created:
                self.stdout.write(self.style.SUCCESS(f'Assigned role {role.display_name} to {user.username}'))
            else:
                self.stdout.write(self.style.WARNING(f'Role assignment already exists for {user.username}'))
        
        self.stdout.write(self.style.SUCCESS('\nInitialization complete!'))