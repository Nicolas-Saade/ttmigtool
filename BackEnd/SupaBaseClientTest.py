from dotenv import load_dotenv
import os
from supabase import create_client, Client
from supabase.client import ClientOptions

# Load environment variables from the .env file
load_dotenv()

url: str = os.getenv("SUPABASE_URL")
key: str = os.getenv("SUPABASE_KEY")

if not url or not key:
    raise ValueError("SUPABASE_URL or SUPABASE_KEY is not set in the .env file")

# Initialize the Supabase client
supabase: Client = create_client(
    url,
    key,
    options=ClientOptions(
        postgrest_client_timeout=10,
        storage_client_timeout=10,
        schema="public",
    )
)

# Test Supabase connection
try:
    # Replace "socials_mapping" with the name of an actual table in your Supabase database
    response = supabase.table("socials_mapping").select("*").limit(10).execute()

    # Print the response
    if response.data:
        print("Connected to Supabase successfully!")
        print("Sample Data:", response.data)
    else:
        print("Connected to Supabase, but the table is empty or does not exist.")
except Exception as e:
    print("Failed to connect to Supabase:")
    print(e)