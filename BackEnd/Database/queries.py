import requests
import csv
from dotenv import load_dotenv
import os

load_dotenv('../.env')

# Google Custom Search API key + Search Engine Id
api_key = os.getenv('GOOGLE_SEARCH_KEY')
cse_id = os.getenv('SEARCH_ENGINE_KEY')

def get_subscribers_list_from_csv(csv_file_path):
    with open(csv_file_path, mode='r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        
        # Extract and return the Subscribers Count as a list
        return [row["Username"] for row in reader]


def google_search(query):
    url = f"https://www.googleapis.com/customsearch/v1"
    params = {
        'q': query,
        'key': api_key,
        'cx': cse_id,
        'num': 1,  # First result of search
    }
    
    response = requests.get(url, params=params)
    if response.status_code == 200:
        results = response.json().get('items', [])
        if results:
            first_result = results[0]
            return first_result.get('link')
        else:
            return "No results found."
    else:
        return f"Error: {response.status_code} - {response.text}"
    

csv_file_path = './top_tiktokers.csv'
subscribers_list = get_subscribers_list_from_csv(csv_file_path)

current_list = subscribers_list[:1] # PROGRESSIVELY CHANGE
print(current_list)

for tiktok_username in current_list:
    insta_query = f"{tiktok_username} Instagram account"
    insta_link = google_search(insta_query)
    print(f"Instgram of {tiktok_username}\nLink: {insta_link}")

    twitter_query = f"{tiktok_username} Twitter account"
    twitter_link = google_search(twitter_query)
    print(f"Twitter of {tiktok_username}\nLink: {twitter_link}")

    facebook_query = f"{tiktok_username} Facebook account"
    facebook_link = google_search(facebook_query)
    print(f"Facebook of {tiktok_username}\nLink: {facebook_link}")


