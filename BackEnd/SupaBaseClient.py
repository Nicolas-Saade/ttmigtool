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
# Reusable throughout code ::: from BackEnd.SupaBaseClient import supabase
supabase: Client = create_client( 
    url,
    key,
    options=ClientOptions(
        postgrest_client_timeout=10,
        storage_client_timeout=10,
        schema="public",
    )
)
