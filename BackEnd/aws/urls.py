from django.urls import path
from .views import generate_presigned_url

urlpatterns = [
    path('generate_presigned_url/<str:email>/<str:file_type>/', generate_presigned_url, name='generate_presigned_url'),
]