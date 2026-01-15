from django.urls import path
from Course_Program_Batch.api import *

urlpatterns = [
    path('clients/<int:client_id>/programs/', list_programs_by_client, name='list_programs_by_client'),
    path('clients/<int:client_id>/batches/',  list_batches_by_client, name='list_batches_by_client'),

    path('programs/<int:program_id>/courses/', list_courses_by_program, name='list_courses_by_program'),
    path('batches/<int:batch_id>/courses/', list_courses_by_batch, name='list_courses_by_batch'),
]