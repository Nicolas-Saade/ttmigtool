from django.urls import path
from .views import upload_json_file, get_profile_mappings, create_user_profile

urlpatterns = [
        path('upload-json/', upload_json_file, name='upload_json_file'),
        path('profile-mapping/', get_profile_mappings, name='get_profile_mappings'),
        path('create-user-profile/', create_user_profile, name='create_user_profile'),
]