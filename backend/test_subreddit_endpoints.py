import requests
import json

# Test the new subreddit endpoints
BASE_URL = "http://localhost:8000"

def test_get_relevant_subreddits():
    """Test getting relevant subreddits based on user profile"""
    print("Testing get-relevant-subreddits endpoint...")
    
    # Sample user profile
    profile = {
        "interest": "technology",
        "skill": "programming",
        "problem": "time management"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/get-relevant-subreddits", json={"profile": profile})
        if response.status_code == 200:
            data = response.json()
            print("✅ Success!")
            print(f"Found {len(data['suggested_subreddits'])} suggested subreddits")
            for subreddit in data['suggested_subreddits'][:3]:  # Show first 3
                print(f"  - {subreddit['display_name']} (relevance: {subreddit['relevance_score']})")
            return True
        else:
            print(f"❌ Error: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"❌ Exception: {e}")
        return False

def test_get_all_subreddits():
    """Test getting all available subreddits"""
    print("\nTesting get-all-subreddits endpoint...")
    
    try:
        response = requests.get(f"{BASE_URL}/get-all-subreddits")
        if response.status_code == 200:
            data = response.json()
            print("✅ Success!")
            print(f"Found {len(data['subreddits'])} total subreddits")
            for subreddit in data['subreddits'][:3]:  # Show first 3
                print(f"  - {subreddit['display_name']} ({subreddit['subscribers']} members)")
            return True
        else:
            print(f"❌ Error: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"❌ Exception: {e}")
        return False

def test_search_reddit_targeted():
    """Test targeted Reddit search"""
    print("\nTesting search-reddit-targeted endpoint...")
    
    # Sample search
    search_data = {
        "query": "time management problems",
        "selected_subreddits": ["productivity", "programming"]
    }
    
    try:
        response = requests.post(f"{BASE_URL}/search-reddit-targeted", json=search_data)
        if response.status_code == 200:
            data = response.json()
            print("✅ Success!")
            print(f"Found {len(data['redditPosts'])} posts")
            for post in data['redditPosts'][:2]:  # Show first 2
                print(f"  - {post['title'][:50]}... (r/{post['subreddit']})")
            return True
        else:
            print(f"❌ Error: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"❌ Exception: {e}")
        return False

if __name__ == "__main__":
    print("🧪 Testing Subreddit Endpoints\n")
    
    # Run tests
    test1 = test_get_relevant_subreddits()
    test2 = test_get_all_subreddits()
    test3 = test_search_reddit_targeted()
    
    print(f"\n📊 Test Results:")
    print(f"  - Relevant subreddits: {'✅' if test1 else '❌'}")
    print(f"  - All subreddits: {'✅' if test2 else '❌'}")
    print(f"  - Targeted search: {'✅' if test3 else '❌'}")
    
    if all([test1, test2, test3]):
        print("\n🎉 All tests passed! The subreddit system is working correctly.")
    else:
        print("\n⚠️  Some tests failed. Please check the backend configuration.") 