from django.urls import path
from .views import upload_json_file

urlpatterns = [
        path('upload-json/', upload_json_file, name='upload_json_file'),
]