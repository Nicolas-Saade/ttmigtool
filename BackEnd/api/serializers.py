from rest_framework import serializers
from .models import UserProfile  # Import your model

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['email', 'password', 'first_name', 'last_name', 'json_file']
        extra_kwargs = {
            'password': {'write_only': True}  # Ensure passwords are write-only
        }
