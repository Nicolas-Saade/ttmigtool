import re
import sys
import os

# Add the parent directory to the system path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from SupaBaseClient import supabase

def clean_database():
    response = supabase.table("socials_mapping").select("*").range(3600,3771).execute()

    '''
    if response.status_code != 200:
        print("Can't load the db")
        return
    '''

    records = response.data

    # Regex for URLs
    insta_pattern = r"^https://www\.instagram\.com/[^/]+/$"
    insta_pattern_with_lang = r"^https://www\.instagram\.com/[^/]+/\?hl=en$"

    fb_pattern = r"^https://www\.facebook\.com/[^/]+/$"
    fb_pattern_with_p =  r"^https://www\.facebook\.com/p/[^/]+/$"

    twitter_pattern = r"^https://twitter\.com/[^/]+$"
    twitter_pattern_with_lang = r"^https://twitter\.com/[^/]+\?lang=en$"
    x_pattern = r"^https://x\.com/[^/]+$"
    x_pattern_with_lang = r"^https://x\.com/[^/]+\?lang=en$"

    for record in records:

        if record.get('tiktok_username')[-2:] == '  ':
            record['tiktok_username'] = record.get('tiktok_username')[:-2]

        instagram_username = record.get('instagram_username')
        if instagram_username:
            if re.match(insta_pattern, instagram_username) or re.match(insta_pattern_with_lang, instagram_username):
                pass
            else:
                record['instagram_username'] = None

        facebook_username = record.get('facebook_username')
        if facebook_username:
            if re.match(fb_pattern, facebook_username) or re.match(fb_pattern_with_p, facebook_username):
                pass
            else:
                record['facebook_username'] = None

        x_username = record.get('x_username')
        if x_username:
            if re.match(twitter_pattern, x_username) or re.match(twitter_pattern_with_lang, x_username) or re.match(x_pattern, x_username) or re.match(x_pattern_with_lang, x_username):
                pass
            else:
                record['x_username'] = None

        # Insert cleaned data into table
        supabase.table("socials_mapping").upsert([record]).execute()


clean_database()
