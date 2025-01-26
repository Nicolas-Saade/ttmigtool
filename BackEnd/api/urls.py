from django.urls import path
from .views import upload_json_file, get_profile_mappings, create_user_profile, check_email, creator_data, personalized_Algorithm_Data, personalized_creator_recommendation

urlpatterns = [
        path('upload-json/', upload_json_file, name='upload_json_file'),
        path('profile-mapping/', get_profile_mappings, name='get_profile_mappings'),
        path('create-user-profile/', create_user_profile, name='create_user_profile'),
        path('check-email/', check_email, name='check_email'),
        path('creator-data/', creator_data, name='creator_data'),
        path('personalized-algorithm-data/', personalized_Algorithm_Data, name='personalized_Algorithm_Data'),
        path('personalized-creator-recommendation/', personalized_creator_recommendation, name='personalized_creator_recommendation')
]