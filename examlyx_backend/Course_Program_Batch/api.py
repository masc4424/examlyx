from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import Batch, Program
from accounts.models import *
from Course_Program_Batch.models import *


# -------------------------------------------------
# PROGRAM APIs
# -------------------------------------------------

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_programs_by_client(request, client_id):
    """
    List programs for a client
    (Only if course-program flow is enabled)
    """
    try:
        settings = ClientSettings.objects.get(
            client_id=client_id,
            is_active=True,
            is_delete=False
        )
    except ClientSettings.DoesNotExist:
        return Response(
            {'error': 'Client settings not found'},
            status=status.HTTP_404_NOT_FOUND
        )

    if not settings.is_course_program_flow:
        return Response(
            {'error': 'Program flow is disabled for this client'},
            status=status.HTTP_400_BAD_REQUEST
        )

    programs = Program.objects.filter(
        client_id=client_id,
        is_active=True
    ).order_by('name')

    data = [{
        'id': p.id,
        'name': p.name,
        'description': p.description
    } for p in programs]

    return Response(data, status=status.HTTP_200_OK)


# -------------------------------------------------
# BATCH APIs
# -------------------------------------------------

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_batches_by_client(request, client_id):
    """
    List batches for a client
    (Only if course-batch flow is enabled)
    """
    try:
        settings = ClientSettings.objects.get(
            client_id=client_id,
            is_active=True,
            is_delete=False
        )
    except ClientSettings.DoesNotExist:
        return Response(
            {'error': 'Client settings not found'},
            status=status.HTTP_404_NOT_FOUND
        )

    if not settings.is_course_batch_flow:
        return Response(
            {'error': 'Batch flow is disabled for this client'},
            status=status.HTTP_400_BAD_REQUEST
        )

    batches = Batch.objects.filter(
        client_id=client_id,
        is_active=True
    ).order_by('start_date')

    data = [{
        'id': b.id,
        'name': b.name,
        'start_date': b.start_date,
        'end_date': b.end_date
    } for b in batches]

    return Response(data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_courses_by_batch(request, batch_id):
    """
    List courses mapped to a batch
    """
    try:
        batch = Batch.objects.get(
            id=batch_id,
            is_active=True
        )
    except Batch.DoesNotExist:
        return Response(
            {'error': 'Batch not found'},
            status=status.HTTP_404_NOT_FOUND
        )

    courses = Course.objects.filter(
        course_batches__batch=batch,
        course_batches__is_active=True,
        is_active=True
    ).distinct().order_by('name')

    data = [
        {
            'id': c.id,
            'name': c.name,
            'description': c.description
        }
        for c in courses
    ]

    return Response(data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_courses_by_program(request, program_id):
    """
    List courses mapped to a program
    """
    try:
        program = Program.objects.get(
            id=program_id,
            is_active=True
        )
    except Program.DoesNotExist:
        return Response(
            {'error': 'Program not found'},
            status=status.HTTP_404_NOT_FOUND
        )

    courses = Course.objects.filter(
        course_programs__program=program,
        course_programs__is_active=True,
        is_active=True
    ).distinct().order_by('name')

    data = [
        {
            'id': c.id,
            'name': c.name,
            'description': c.description
        }
        for c in courses
    ]

    return Response(data, status=status.HTTP_200_OK)
