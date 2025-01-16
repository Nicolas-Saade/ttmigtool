from rest_framework.decorators import api_view, parser_classes
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, JSONParser
from .serializers import UserProfileSerializer
from SupaBaseClient import supabase
import json
from django.shortcuts import render

def index_view(request):
    return render(request, "index.html")

@api_view(['POST'])
def check_email(request):
    """API to check if an email exists in the database and return user details."""
    email = request.data.get('email')
    if not email:
        return Response({"error": "Email is required."}, status=400)

    try:
        # Query the database for the email
        response = supabase.table("user_profile").select("*").eq("email", email).execute()
        if response.data:
            user = response.data[0]
            return Response({
                "message": "Email exists.",
                "first_name": user.get("first_name"),
                "last_name": user.get("last_name"),
                "password": user.get("password"),  # Include the stored password
                "json_file": user.get("json_file"),  # Include the JSON file
            }, status=200)
        else:
            return Response({"error": "Email not found."}, status=404)
    except Exception as e:
        return Response({"error": f"An error occurred: {str(e)}"}, status=500)  

@api_view(['POST'])
@parser_classes([MultiPartParser])  # Enable file upload and parsing
def upload_json_file(request):
    """API to handle JSON file upload and optionally associate it with a user's email."""
    # Get the user's email from the request (optional)
    user_email = request.data.get('email')

    uploaded_file = request.FILES.get('file', None)
    if not uploaded_file:
        return Response({"error": " file provided."}, status=400)

    try:
        # Read and parse the uploaded JSON file
        file_data = uploaded_file.read().decode('utf-8')
        json_data = json.loads(file_data)

        # Extract "following" list from the JSON (if present)
        profile = json_data.get("Profile", {})
        following_list = profile.get("Following List", {}).get("Following", [])

        if not following_list:
            return Response({"error": "No 'Following' found in the JSON file."}, status=400)

        # If user_email is provided, associate the JSON file with the user's database entry
        if user_email:
            response = supabase.table("user_profile").select("*").eq("email", user_email).execute()
            if not response.data:
                return Response({"error": "User not found."}, status=404)

            # Update the user's database entry with the JSON file
            update_response = supabase.table("user_profile").update({"json_file": json_data}).eq("email", user_email).execute()

            if not update_response.data:
                return Response({"error": "Failed to update the database entry for the user."}, status=500)

            return Response({
                "message": "JSON file successfully uploaded and associated with the user.",
                "following": following_list
            }, status=200)

        # If no email is provided, process the file but don't save it to the database
        return Response({
            "message": "JSON file successfully uploaded but not associated with any user (not logged in).",
            "following": following_list
        }, status=200)

    except json.JSONDecodeError:
        return Response({"error": "Invalid JSON file."}, status=400)
    except Exception as e:
        return Response({"error": f"An unexpected error occurred: {str(e)}"}, status=500)


#API to create a new user profile in the database.
@api_view(['POST'])
def create_user_profile(request):
    """
    API to create a new user profile in the Supabase database.
    """
    # Extract data from the request
    email = request.data.get("email")
    password = request.data.get("password")
    first_name = request.data.get("first_name")
    last_name = request.data.get("last_name")
    json_file = request.data.get("json_file", {})  # Optional field

    if not email or not password or not first_name or not last_name:
        return Response({"error": "Missing required fields."}, status=400)

    try:
        response = supabase.table("user_profile").insert({
            "email": email,
            "password": password,
            "first_name": first_name,
            "last_name": last_name,
            "json_file": json_file,
        }).execute()

        return Response({"message": "User profile created successfully!"}, status=201)
    except Exception as e:
        return Response({"error": f"Failed to create user profile: {str(e)}"}, status=500)



@api_view(['POST'])
def get_profile_mappings(request):
    """
    API to fetch profiles with social media URLs based on usernames.
    """
    usernames = request.data.get("prof", []) # Check the HomeScreen.jsx file @/api/profile-mapping/ axios call to check the prof array

    if not usernames or not isinstance(usernames, list):
        return Response({"error": "Invalid or missing 'usernames' list."}, status=400)

    try:
        response = (
            supabase.table("socials_mapping")
            .select("*")
            .in_("tiktok_username", usernames)  # Filters rows where tiktok_username matches any value in the list
            .execute()
        )
    except Exception as e:
        return Response({"error": e}, status=500)

    if not response or not response.data:
        return Response({"error": "No profiles found for the given usernames."}, status=404)

    mapping_arr = response.data
    if not mapping_arr or not isinstance(mapping_arr, list):
        return Response({"error": "Invalid or missing 'mapping_arr' list."}, status=400)

    result = []
    for profile in mapping_arr:
        result.append({
            "UserName": profile["tiktok_username"],
            "profile_picture": profile["profile_picture_url"],
            "instagram_url": profile["instagram_username"],
            "facebook_url": profile["facebook_username"],
            "twitter_url": profile["x_username"],
            "reddit_url": profile["reddit_username"],
        })

    if (len(usernames) == len(result) and len(usernames) == len(mapping_arr)):
        return Response({"profiles": result}, status=200)
    

@api_view(['POST'])
def creator_data(request):
    """
    API to store temporary creator data before manual check.
    """
    # Extract data from the request

    profile_picture = request.data.get("profilePicture")
    tiktok_username = request.data.get("tiktokUsername")
    instagram_username = request.data.get("instagramURL")
    x_username = request.data.get("xURL")
    faceboook_username = request.data.get("facebookURL")
    token = request.data.get("token")

    if not tiktok_username:
        return Response({"error": "Missing TikTok Username!"}, status=400)

    try:
        supabase.table("temporary_creators").insert({
             "profile_picture": profile_picture,
             "tiktok_username": tiktok_username,
             "instagram_username": instagram_username,
             "x_username": x_username,
             "facebook_username": faceboook_username,
             "token": token,
         }).execute()

        return Response({"message": "Social media data stored!"}, status=201)
    except Exception as e:
        return Response({"error": f"Failed to store social media data: {str(e)}"}, status=500)
