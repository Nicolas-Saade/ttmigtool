from django.db import models

# Create your models here.

class UserProfile(models.Model):
    email = models.EmailField(unique=True)  # Email as a unique key
    password = models.CharField(max_length=255)  # Store hashed passwords
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    json_file = models.JSONField()  # Field for storing JSON data

    created_at = models.DateTimeField(auto_now_add=True)  # Timestamp for record creation

    def __str__(self):
        return self.email
