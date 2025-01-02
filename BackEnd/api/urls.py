from django.urls import path
from .views import upload_json_file, get_profile_mappings

urlpatterns = [
        path('upload-json/', upload_json_file, name='upload_json_file'),
        path('profile-mapping/', get_profile_mappings, name='get_profile_mappings'),
]