import requests
import json
import os
from dotenv import load_dotenv

def configure_api():
    url = "http://localhost:8000/configure-api"
    # Load API keys from environment variables
    load_dotenv()
    data = {
        "openai_api_key": os.getenv("OPENAI_API_KEY"),
        "reddit_client_id": os.getenv("REDDIT_CLIENT_ID"),
        "reddit_client_secret": os.getenv("REDDIT_CLIENT_SECRET"),
        "reddit_user_agent": os.getenv("REDDIT_USER_AGENT", "IdeaSpark/1.0")
    }
    
    try:
        response = requests.post(url, json=data)
        print("Configuration Status Code:", response.status_code)
        print("Configuration Response:", json.dumps(response.json(), indent=2))
        return response.status_code == 200
    except Exception as e:
        print("Configuration Error:", str(e))
        return False

def test_process_pain_points():
    url = "http://localhost:8000/process-pain-points"
    data = {
        "painPoints": [
            "I'm struggling with time management as a freelancer. I can't seem to keep track of all my projects and deadlines.",
            "Finding clients is really hard. I don't know where to look or how to pitch my services effectively."
        ]
    }
    
    try:
        response = requests.post(url, json=data)
        print("\nPain Points Status Code:", response.status_code)
        print("Pain Points Response:", json.dumps(response.json(), indent=2))
    except Exception as e:
        print("Pain Points Error:", str(e))

if __name__ == "__main__":
    print("Testing API Configuration...")
    if configure_api():
        print("\nTesting Pain Points Processing...")
        test_process_pain_points()
    else:
        print("API configuration failed. Please check your environment variables.") 