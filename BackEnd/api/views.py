from rest_framework.decorators import api_view, parser_classes
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, JSONParser
from SupaBaseClient import supabase
import json

@api_view(['POST'])
@parser_classes([MultiPartParser])  # Enable file upload and parsing
def upload_json_file(request):
    """API to handle JSON file upload and extract 'following' list."""
    uploaded_file = request.FILES.get('file', None)
    if not uploaded_file:
        return Response({"error": "No file provided."}, status=400)

    try:
        file_data = uploaded_file.read().decode('utf-8')
        json_data = json.loads(file_data)

        # Extract "following" list from the JSON (if present)
        profile = json_data.get("Profile", {})

        following_list = profile.get("Following List", {})
        if not following_list:
            return Response({"error": "No 'Following List' found in the JSON file."}, status=400)

        following_list = following_list.get("Following", [])
        if not following_list:
            return Response({"error": "No 'Following' found in the JSON file."}, status=400)

        return Response({"following": following_list}, status=200)

    except json.JSONDecodeError:
        return Response({"error": "Invalid JSON file."}, status=400)

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
        print("ALL CHECKS PASS!!!!!!!")
        return Response({"profiles": result}, status=200)