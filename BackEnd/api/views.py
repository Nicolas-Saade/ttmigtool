from rest_framework.decorators import api_view, parser_classes
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, JSONParser
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