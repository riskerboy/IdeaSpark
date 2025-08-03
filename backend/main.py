from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
import openai
import praw
from pytrends.request import TrendReq
import os
from dotenv import load_dotenv
import json
import random
from pydantic import validator
from datetime import datetime, timedelta
import asyncio

# Load environment variables
load_dotenv()

# Subreddit metadata storage
SUBREDDIT_METADATA_FILE = "subreddit_metadata.json"

class SubredditMetadata:
    def __init__(self):
        self.metadata = self.load_metadata()
    
    def load_metadata(self) -> Dict:
        """Load subreddit metadata from local file"""
        try:
            if os.path.exists(SUBREDDIT_METADATA_FILE):
                with open(SUBREDDIT_METADATA_FILE, 'r') as f:
                    return json.load(f)
            else:
                # Initialize with default business/tech subreddits
                default_metadata = self.get_default_metadata()
                self.save_metadata(default_metadata)
                return default_metadata
        except Exception as e:
            print(f"Error loading metadata: {e}")
            return self.get_default_metadata()
    
    def save_metadata(self, metadata: Dict):
        """Save subreddit metadata to local file"""
        try:
            with open(SUBREDDIT_METADATA_FILE, 'w') as f:
                json.dump(metadata, f, indent=2)
        except Exception as e:
            print(f"Error saving metadata: {e}")
    
    def get_default_metadata(self) -> Dict:
        """Get default subreddit metadata for business/tech communities"""
        return {
            "subreddits": {
                "entrepreneur": {
                    "name": "entrepreneur",
                    "display_name": "Entrepreneur",
                    "subscribers": 3000000,
                    "category": "business",
                    "topics": ["startup", "business", "entrepreneurship", "marketing"],
                    "activity_score": 9,
                    "last_updated": datetime.now().isoformat()
                },
                "smallbusiness": {
                    "name": "smallbusiness",
                    "display_name": "Small Business",
                    "subscribers": 500000,
                    "category": "business",
                    "topics": ["small business", "entrepreneurship", "marketing", "finance"],
                    "activity_score": 8,
                    "last_updated": datetime.now().isoformat()
                },
                "startups": {
                    "name": "startups",
                    "display_name": "Startups",
                    "subscribers": 1000000,
                    "category": "business",
                    "topics": ["startup", "entrepreneurship", "tech", "funding"],
                    "activity_score": 9,
                    "last_updated": datetime.now().isoformat()
                },
                "freelance": {
                    "name": "freelance",
                    "display_name": "Freelance",
                    "subscribers": 200000,
                    "category": "business",
                    "topics": ["freelancing", "remote work", "clients", "income"],
                    "activity_score": 8,
                    "last_updated": datetime.now().isoformat()
                },
                "programming": {
                    "name": "programming",
                    "display_name": "Programming",
                    "subscribers": 4000000,
                    "category": "tech",
                    "topics": ["programming", "coding", "development", "software"],
                    "activity_score": 9,
                    "last_updated": datetime.now().isoformat()
                },
                "webdev": {
                    "name": "webdev",
                    "display_name": "Web Development",
                    "subscribers": 800000,
                    "category": "tech",
                    "topics": ["web development", "frontend", "backend", "coding"],
                    "activity_score": 8,
                    "last_updated": datetime.now().isoformat()
                },
                "productivity": {
                    "name": "productivity",
                    "display_name": "Productivity",
                    "subscribers": 300000,
                    "category": "lifestyle",
                    "topics": ["productivity", "time management", "organization", "efficiency"],
                    "activity_score": 7,
                    "last_updated": datetime.now().isoformat()
                },
                "marketing": {
                    "name": "marketing",
                    "display_name": "Marketing",
                    "subscribers": 400000,
                    "category": "business",
                    "topics": ["marketing", "advertising", "branding", "growth"],
                    "activity_score": 8,
                    "last_updated": datetime.now().isoformat()
                },
                "health": {
                    "name": "health",
                    "display_name": "Health",
                    "subscribers": 2000000,
                    "category": "health",
                    "topics": ["health", "wellness", "fitness", "nutrition"],
                    "activity_score": 8,
                    "last_updated": datetime.now().isoformat()
                },
                "education": {
                    "name": "education",
                    "display_name": "Education",
                    "subscribers": 500000,
                    "category": "education",
                    "topics": ["education", "learning", "teaching", "skills"],
                    "activity_score": 7,
                    "last_updated": datetime.now().isoformat()
                }
            },
            "categories": {
                "business": ["entrepreneur", "smallbusiness", "startups", "freelance", "marketing"],
                "tech": ["programming", "webdev"],
                "lifestyle": ["productivity"],
                "health": ["health"],
                "education": ["education"]
            },
            "last_updated": datetime.now().isoformat()
        }
    
    def get_relevant_subreddits(self, user_profile: Dict) -> List[Dict]:
        """Get relevant subreddits based on user profile"""
        relevant_subreddits = []
        
        # Extract user interests
        interest = user_profile.get('interest', '').lower()
        skill = user_profile.get('skill', '').lower()
        problem = user_profile.get('problem', '').lower()
        
        # Scoring weights
        interest_weight = 10
        skill_weight = 8
        problem_weight = 6
        activity_weight = 5
        
        for subreddit_name, subreddit_data in self.metadata["subreddits"].items():
            score = 0
            
            # Score based on interest match
            if interest in subreddit_data["topics"] or any(interest in topic for topic in subreddit_data["topics"]):
                score += interest_weight
            
            # Score based on skill match
            if skill in subreddit_data["topics"] or any(skill in topic for topic in subreddit_data["topics"]):
                score += skill_weight
            
            # Score based on problem match
            if problem in subreddit_data["topics"] or any(problem in topic for topic in subreddit_data["topics"]):
                score += problem_weight
            
            # Score based on activity
            score += subreddit_data["activity_score"] * activity_weight
            
            # Add to relevant list if score > 0
            if score > 0:
                relevant_subreddits.append({
                    "name": subreddit_name,
                    "display_name": subreddit_data["display_name"],
                    "category": subreddit_data["category"],
                    "subscribers": subreddit_data["subscribers"],
                    "activity_score": subreddit_data["activity_score"],
                    "relevance_score": score
                })
        
        # Sort by relevance score (highest first) and return top 8-12
        relevant_subreddits.sort(key=lambda x: x["relevance_score"], reverse=True)
        return relevant_subreddits[:12]
    
    def update_metadata_from_reddit(self):
        """Update metadata with current Reddit data"""
        if not api_clients.reddit_client:
            print("Reddit client not configured, skipping metadata update")
            return
        
        try:
            for subreddit_name in self.metadata["subreddits"]:
                subreddit = api_clients.reddit_client.subreddit(subreddit_name)
                self.metadata["subreddits"][subreddit_name]["subscribers"] = subreddit.subscribers
                self.metadata["subreddits"][subreddit_name]["last_updated"] = datetime.now().isoformat()
            
            self.metadata["last_updated"] = datetime.now().isoformat()
            self.save_metadata(self.metadata)
            print("Subreddit metadata updated successfully")
        except Exception as e:
            print(f"Error updating metadata: {e}")

# Initialize subreddit metadata
subreddit_metadata = SubredditMetadata()

class APIClients:
    def __init__(self):
        self.openai_client = None
        self.reddit_client = None
        self._configure_from_env()

    def _configure_from_env(self):
        """Configure clients from environment variables if available"""
        openai_key = os.getenv("OPENAI_API_KEY")
        reddit_id = os.getenv("REDDIT_CLIENT_ID")
        reddit_secret = os.getenv("REDDIT_CLIENT_SECRET")
        reddit_agent = os.getenv("REDDIT_USER_AGENT", "IdeaSpark/1.0")

        if openai_key:
            self.openai_client = openai.OpenAI(
                api_key=openai_key,
                base_url="https://api.openai.com/v1",
                max_retries=3,
                timeout=30.0
            )

        if all([reddit_id, reddit_secret, reddit_agent]):
            self.reddit_client = praw.Reddit(
                client_id=reddit_id,
                client_secret=reddit_secret,
                user_agent=reddit_agent,
                check_for_async=False
            )

    def configure(self, config: Dict[str, str]) -> bool:
        """Configure clients with provided credentials"""
        try:
            # Configure OpenAI
            self.openai_client = openai.OpenAI(
                api_key=config["openai_api_key"],
                base_url="https://api.openai.com/v1",
                max_retries=3,
                timeout=30.0
            )

            # Configure Reddit
            self.reddit_client = praw.Reddit(
                client_id=config["reddit_client_id"],
                client_secret=config["reddit_client_secret"],
                user_agent=config["reddit_user_agent"],
                check_for_async=False
            )

            # Test Reddit connection
            self.reddit_client.user.me()
            return True
        except Exception as e:
            print(f"Configuration error: {str(e)}")
            return False

# Create a single instance of APIClients
api_clients = APIClients()

app = FastAPI()

# API Configuration
class APIConfig(BaseModel):
    openai_api_key: str
    reddit_client_id: str
    reddit_client_secret: str
    reddit_user_agent: str

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"]
)

@app.options("/configure-api")
async def configure_api_options():
    return {"message": "OK"}

@app.post("/configure-api")
async def configure_api(config: APIConfig):
    try:
        print("Starting API configuration...")
        if api_clients.configure(config.dict()):
            print("API configuration completed successfully")
            return {"status": "success", "message": "API configuration successful"}
        else:
            raise HTTPException(status_code=500, detail="Failed to configure APIs")
    except Exception as e:
        print(f"Unexpected error during API configuration: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to configure APIs: {str(e)}")

class ProfileInput(BaseModel):
    profile: dict

class NicheInput(BaseModel):
    niche: str

class ThreadsInput(BaseModel):
    threads: str

class PainPointsInput(BaseModel):
    painPoints: List[str] = Field(..., min_items=1, description="List of pain points from Reddit posts")

    class Config:
        json_schema_extra = {
            "example": {
                "painPoints": [
                    "Title 1\nContent 1",
                    "Title 2\nContent 2"
                ]
            }
        }

    @validator('painPoints', pre=True)
    def validate_pain_points(cls, v):
        if not v:
            raise ValueError("painPoints cannot be empty")
        if isinstance(v, str):
            v = [v]
        if not isinstance(v, list):
            raise ValueError("painPoints must be a list")
        return [str(point).strip() for point in v if str(point).strip()]

class IdeasInput(BaseModel):
    painPoints: list
    profile: dict

def check_api_configuration():
    """Check if API clients are properly configured."""
    if not api_clients.openai_client:
        raise HTTPException(status_code=400, detail="OpenAI API not configured. Please configure the API first.")
    if not api_clients.reddit_client:
        raise HTTPException(status_code=400, detail="Reddit API not configured. Please configure the API first.")

def call_openai(prompt):
    """Call OpenAI API with randomized seed for varied responses."""
    if not api_clients.openai_client:
        raise HTTPException(status_code=500, detail="OpenAI client not initialized")
    # Add random seed for variability
    seed = random.randint(1, 10000)
    prompt_with_seed = f"{prompt}\nUse seed {seed} for varied responses."
    try:
        response = api_clients.openai_client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a business strategist specializing in market research and idea generation."},
                {"role": "user", "content": prompt_with_seed},
            ],
            max_tokens=1000,
            temperature=0.7,
            top_p=0.9,
            frequency_penalty=0.0,
            presence_penalty=0.0
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"OpenAI API call error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"OpenAI API call failed: {str(e)}")

def scrape_reddit(query):
    """Scrape Reddit threads - simple search for the exact query with comments."""
    if not api_clients.reddit_client:
        raise HTTPException(status_code=500, detail="Reddit client not initialized")
    
    posts = []
    print(f"Searching Reddit for: '{query}'")  # Debug log
    
    try:
        # Simple search across all of Reddit for the exact query
        search_results = api_clients.reddit_client.subreddit("all").search(
            query, 
            sort="relevance", 
            limit=30, 
            time_filter="year"
        )
        
        collected_posts = []
        
        for submission in search_results:
            # Skip if already collected
            if any(post["url"] == f"https://www.reddit.com{submission.permalink}" for post in collected_posts):
                continue
                
            # Filter for posts that are likely from people with problems (not employers/companies)
            title_lower = submission.title.lower()
            content_lower = (submission.selftext or "").lower()
            
            # Skip posts that seem to be from businesses/employers
            business_indicators = [
                "hiring", "job opening", "position available", "we are looking for",
                "company", "business", "startup", "entrepreneur", "looking to hire",
                "recruiting", "employment", "career opportunity", "join our team",
                "apply now", "submit your resume", "send your cv"
            ]
            
            if any(indicator in title_lower or indicator in content_lower for indicator in business_indicators):
                continue
            
            # Look for indicators that this is a personal problem post
            problem_indicators = [
                "i have", "i'm having", "i am having", "i struggle", "i'm struggling",
                "i need help", "i can't", "i cannot", "i'm stuck", "i feel",
                "my problem", "my issue", "my pain", "my struggle", "help me",
                "advice needed", "anyone else", "does anyone", "how do you",
                "what should i", "what can i", "feeling", "experiencing"
            ]
            
            has_problem_indicator = any(indicator in title_lower or indicator in content_lower 
                                      for indicator in problem_indicators)
            
            # Only include posts that have problem indicators or are clearly personal
            if has_problem_indicator or len(submission.selftext or "") > 100:
                # Get comments for this post
                submission.comments.replace_more(limit=0)  # Remove "load more comments" links
                comments = []
                
                for comment in submission.comments.list()[:10]:  # Get top 10 comments
                    if hasattr(comment, 'body') and comment.body and len(comment.body.strip()) > 10:
                        comments.append({
                            "text": comment.body,
                            "score": comment.score,
                            "author": str(comment.author) if comment.author else "[deleted]"
                        })
                
                # Sort comments by score
                comments.sort(key=lambda x: x["score"], reverse=True)
                
                # Combine post content with top comments
                full_content = submission.selftext if submission.selftext else ""
                if comments:
                    full_content += "\n\n--- COMMENTS ---\n"
                    for comment in comments[:5]:  # Include top 5 comments
                        full_content += f"\nComment by {comment['author']} (score: {comment['score']}):\n{comment['text']}\n"
                
                collected_posts.append({
                    "title": submission.title,
                    "content": full_content,
                    "url": f"https://www.reddit.com{submission.permalink}",
                    "subreddit": submission.subreddit.display_name,
                    "score": submission.score,
                    "num_comments": submission.num_comments,
                    "created_utc": submission.created_utc
                })
                
            # Stop if we have enough posts
            if len(collected_posts) >= 30:
                break
        
        # Sort by relevance (score + comments) and take top 20
        collected_posts.sort(key=lambda x: (x["score"] + x["num_comments"]), reverse=True)
        
        # Take top 20 posts
        posts = collected_posts[:20]
        
        print(f"Found {len(posts)} relevant posts for '{query}'")  # Debug log
        
    except Exception as e:
        print(f"Reddit search error for '{query}': {str(e)}")
        # Return empty list if search fails
        return []
    
    return posts

@app.post("/generate-niches")
async def generate_niches(input: ProfileInput):
    check_api_configuration()
    profile = input.profile
    interest = profile.get('interestOther') if profile.get('interest') == 'Other' else profile.get('interest')
    skill = profile.get('skillOther') if profile.get('skill') == 'Other' else profile.get('skill')
    problem = profile.get('problemOther') if profile.get('problem') == 'Other' else profile.get('problem')
    details = profile.get('details', '')
    prompt = f"""
    # Niche Generator (Adapted from Market Idea Expander)
    Based on the user profile:
    - Interest: {interest}
    - Skill: {skill}
    - Problem: {problem}
    - Details: {details}
    Generate 5 relevant market niches with brief descriptions.
    Return a list in JSON format: [{{"name": "Niche", "description": "Description"}}, ...]
    """
    response = call_openai(prompt)
    try:
        niches = json.loads(response)
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Failed to parse OpenAI response")
    return {"niches": [niche["name"] for niche in niches]}

@app.post("/validate-demand")
async def validate_demand(input: NicheInput):
    check_api_configuration()
    niche = input.niche
    
    try:
        # Reinitialize PyTrends to avoid caching
        pytrends = TrendReq(hl='en-US', tz=360, timeout=(10,25), retries=2, backoff_factor=0.1)
        
        # Build payload with error handling
        try:
            pytrends.build_payload([niche], timeframe='today 12-m')
        except Exception as build_error:
            print(f"PyTrends build_payload error: {str(build_error)}")
            # Return mock data if Google Trends fails
            return {
                "labels": ["Jan 2024", "Feb 2024", "Mar 2024", "Apr 2024", "May 2024", "Jun 2024", 
                          "Jul 2024", "Aug 2024", "Sep 2024", "Oct 2024", "Nov 2024", "Dec 2024"],
                "searchVolume": [50, 55, 60, 65, 70, 75, 80, 85, 90, 85, 80, 85],
                "trend": "Growing",
                "note": "Mock data - Google Trends unavailable"
            }
        
        # Get interest over time data
        try:
            data = pytrends.interest_over_time()
        except Exception as data_error:
            print(f"PyTrends interest_over_time error: {str(data_error)}")
            # Return mock data if data fetch fails
            return {
                "labels": ["Jan 2024", "Feb 2024", "Mar 2024", "Apr 2024", "May 2024", "Jun 2024", 
                          "Jul 2024", "Aug 2024", "Sep 2024", "Oct 2024", "Nov 2024", "Dec 2024"],
                "searchVolume": [50, 55, 60, 65, 70, 75, 80, 85, 90, 85, 80, 85],
                "trend": "Growing",
                "note": "Mock data - Google Trends unavailable"
            }
        
        if not data.empty and niche in data.columns:
            search_volume = data[niche].tolist()
            labels = data.index.strftime('%b %Y').tolist()
            
            # Calculate trend
            if len(search_volume) >= 2:
                trend = "Growing" if search_volume[-1] > search_volume[0] else "Stable" if search_volume[-1] == search_volume[0] else "Declining"
            else:
                trend = "Stable"
                
            return {"labels": labels, "searchVolume": search_volume, "trend": trend}
        else:
            # Return mock data if no data available
            return {
                "labels": ["Jan 2024", "Feb 2024", "Mar 2024", "Apr 2024", "May 2024", "Jun 2024", 
                          "Jul 2024", "Aug 2024", "Sep 2024", "Oct 2024", "Nov 2024", "Dec 2024"],
                "searchVolume": [50, 55, 60, 65, 70, 75, 80, 85, 90, 85, 80, 85],
                "trend": "Growing",
                "note": f"Mock data for '{niche}' - No Google Trends data available"
            }
            
    except Exception as e:
        print(f"Validate demand error for niche '{niche}': {str(e)}")
        # Return mock data instead of throwing an error
        return {
            "labels": ["Jan 2024", "Feb 2024", "Mar 2024", "Apr 2024", "May 2024", "Jun 2024", 
                      "Jul 2024", "Aug 2024", "Sep 2024", "Oct 2024", "Nov 2024", "Dec 2024"],
            "searchVolume": [50, 55, 60, 65, 70, 75, 80, 85, 90, 85, 80, 85],
            "trend": "Growing",
            "note": f"Mock data for '{niche}' - Error: {str(e)}"
        }

@app.post("/search-reddit")
async def search_reddit(input: NicheInput):
    check_api_configuration()
    query = input.niche
    reddit_posts = scrape_reddit(query)
    return {"redditPosts": reddit_posts}

@app.post("/process-pain-points")
async def process_pain_points(input: PainPointsInput):
    check_api_configuration()
    try:
        print("Received request data:", input.dict())  # Debug log
        pain_points = input.painPoints
        
        if not pain_points:
            return {"analysis": {"clusters": [], "summary": {"totalClusters": 0}}}
            
        # Ensure pain points are strings and not empty
        pain_points = [str(point).strip() for point in pain_points if str(point).strip()]
        if not pain_points:
            return {"analysis": {"clusters": [], "summary": {"totalClusters": 0}}}
            
        selected_contents = pain_points
        combined_threads_content = "\n\n".join(selected_contents)
        
        # Check if content is too long (OpenAI has token limits)
        if len(combined_threads_content) > 8000:  # Rough estimate for token limit
            print("Content too long, splitting into parts...")
            # Split content into parts
            parts = []
            current_part = ""
            for content in selected_contents:
                if len(current_part + content) > 6000:
                    if current_part:
                        parts.append(current_part)
                    current_part = content
                else:
                    current_part += "\n\n" + content if current_part else content
            if current_part:
                parts.append(current_part)
            
            # Process each part separately
            all_clusters = []
            for i, part in enumerate(parts):
                print(f"Processing part {i+1}/{len(parts)}")
                part_analysis = await process_content_part(part, f"Part {i+1}")
                if part_analysis and "clusters" in part_analysis:
                    all_clusters.extend(part_analysis["clusters"])
            
            # Combine all clusters
            if all_clusters:
                analysis = {
                    "clusters": all_clusters,
                    "summary": {
                        "totalClusters": len(all_clusters),
                        "mostIntenseCluster": max(all_clusters, key=lambda x: x.get("emotionIntensity", 0))["name"] if all_clusters else "",
                        "biggestSolutionGap": max(all_clusters, key=lambda x: x.get("solutionGap", 0))["name"] if all_clusters else "",
                        "mostFrequentCluster": max(all_clusters, key=lambda x: x.get("frequency", 0))["name"] if all_clusters else ""
                    }
                }
                return {"analysis": analysis}
            else:
                return {"analysis": {"clusters": [], "summary": {"totalClusters": 0}}}
        else:
            # Process normally if content is not too long
            analysis = await process_content_part(combined_threads_content, "Full Content")
            return {"analysis": analysis}
            
    except Exception as e:
        print("Error processing pain points:", str(e))  # Debug log
        raise HTTPException(status_code=500, detail=str(e))

async def process_content_part(content, part_name):
    """Process a single part of the content."""
    prompt = f"""
You are a pain point analyzer. Analyze the following Reddit content and extract pain points:

{content}

Extract pain points from this content and group them into clusters. For each pain point, identify:
1. The core issue/problem
2. Representative quotes from the text
3. Emotion intensity (1-10 scale)
4. Current solutions being used
5. Solution gap (1-10 scale - how well current solutions work)

Return ONLY a valid JSON object with this exact structure (no other text):
{{
    "clusters": [
        {{
            "name": "Cluster Name",
            "themes": ["Theme 1", "Theme 2"],
            "quotes": ["Quote 1", "Quote 2"],
            "emotionIntensity": 8.5,
            "solutionGap": 7.5,
            "frequency": 5,
            "painPoints": [
                {{
                    "point": "Specific Pain Point",
                    "quote": "Representative Quote",
                    "emotionIntensity": 9,
                    "currentSolutions": ["Solution 1", "Solution 2"],
                    "solutionGap": 8
                }}
            ]
        }}
    ]
}}

Focus on real pain points mentioned in the text. If no clear pain points are found, return an empty clusters array.
"""
    
    print(f"Sending prompt to OpenAI for {part_name}")  # Debug log
    response = call_openai(prompt)
    print(f"Received OpenAI response for {part_name}:", response)  # Debug log
    
    try:
        # Try to extract JSON from the response
        response_clean = response.strip()
        
        # Remove any markdown formatting
        if response_clean.startswith("```json"):
            response_clean = response_clean[7:]
        if response_clean.endswith("```"):
            response_clean = response_clean[:-3]
        
        # Try to find JSON object in the response
        start_idx = response_clean.find('{')
        end_idx = response_clean.rfind('}') + 1
        
        if start_idx != -1 and end_idx != 0:
            json_str = response_clean[start_idx:end_idx]
            analysis = json.loads(json_str)
            
            # Validate the response structure
            if not isinstance(analysis, dict) or "clusters" not in analysis:
                raise ValueError("Invalid response structure from OpenAI")
            
            return analysis
        else:
            print(f"No valid JSON found in response for {part_name}")
            return {"clusters": []}
            
    except json.JSONDecodeError as e:
        print(f"JSON decode error for {part_name}: {str(e)}")
        print(f"Response was: {response}")
        return {"clusters": []}
    except ValueError as e:
        print(f"Validation error for {part_name}: {str(e)}")
        return {"clusters": []}
    except Exception as e:
        print(f"Unexpected error for {part_name}: {str(e)}")
        return {"clusters": []}

@app.post("/generate-ideas")
async def generate_ideas(input: IdeasInput):
    check_api_configuration()
    profile = input.profile
    interest = profile.get('interestOther') if profile.get('interest') == 'Other' else profile.get('interest')
    skill = profile.get('skillOther') if profile.get('skill') == 'Other' else profile.get('skill')
    problem = profile.get('problemOther') if profile.get('problem') == 'Other' else profile.get('problem')
    details = profile.get('details', '')
    
    # Extract top pain points from clusters
    pain_points = input.painPoints
    if isinstance(pain_points, list) and len(pain_points) > 0 and isinstance(pain_points[0], dict):
        top_pain_points = pain_points
    else:
        top_pain_points = [{"point": p, "quote": "", "emotionIntensity": 7, "solutionGap": 7} for p in pain_points[:3]]

    prompt = f"""
    # Business Idea Generator (Strategic Framework)

    You are a market strategist specializing in startup ideation for 2025. Your task is to generate innovative business ideas that solve real problems in underserved markets.

    Context:
    - The user is looking for a startup idea in 2025
    - Avoid generic productivity tools
    - Focus on underserved problems or rising trends
    - Consider emerging technologies and market shifts

    User Profile:
    - Interest: {interest}
    - Skill: {skill}
    - Problem Focus: {problem}
    - Additional Details: {details}

    Pain Point Analysis:
    {json.dumps(top_pain_points, indent=2)}

    For each pain point cluster, generate a business idea that:
    1. Has a unique hook or twist
    2. Solves the pain in a new or better way than existing solutions
    3. Is clearly monetizable
    4. Targets an underserved or emerging market
    5. Leverages the user's skills effectively

    Return a JSON array of ideas, each containing:
    {{
        "name": "Product Name",
        "description": "Clear, concise description of the solution",
        "targetAudience": "Specific target market segment",
        "valueProposition": "Unique value that solves the pain point",
        "uniqueMechanism": "How it differs from existing solutions",
        "monetization": "Clear revenue model",
        "resonanceScore": 0-100 (based on skill fit, market need, and uniqueness),
        "keyFeatures": ["Feature 1", "Feature 2", "Feature 3"],
        "marketTrends": ["Relevant trend 1", "Relevant trend 2"],
        "competition": {{
            "existingSolutions": ["Solution 1", "Solution 2"],
            "ourAdvantage": "How we're different"
        }}
    }}

    Focus on generating 3 high-quality ideas that are:
    - Specific and actionable
    - Based on real market needs
    - Leveraging emerging trends
    - Different from existing solutions
    """
    response = call_openai(prompt)
    try:
        ideas = json.loads(response)
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Failed to parse OpenAI response")
    return {"ideas": ideas}

# New endpoints for subreddit management
class SubredditSuggestionInput(BaseModel):
    profile: dict

class SubredditSearchInput(BaseModel):
    query: str
    selected_subreddits: List[str] = []

@app.post("/get-relevant-subreddits")
async def get_relevant_subreddits(input: SubredditSuggestionInput):
    """Get relevant subreddits based on user profile"""
    try:
        relevant_subreddits = subreddit_metadata.get_relevant_subreddits(input.profile)
        return {
            "suggested_subreddits": relevant_subreddits,
            "categories": subreddit_metadata.metadata["categories"]
        }
    except Exception as e:
        print(f"Error getting relevant subreddits: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/search-reddit-targeted")
async def search_reddit_targeted(input: SubredditSearchInput):
    """Search Reddit in specific subreddits only"""
    check_api_configuration()
    
    if not input.selected_subreddits:
        raise HTTPException(status_code=400, detail="No subreddits selected")
    
    try:
        posts = []
        query = input.query
        
        for subreddit_name in input.selected_subreddits:
            try:
                subreddit = api_clients.reddit_client.subreddit(subreddit_name)
                search_results = subreddit.search(
                    query, 
                    sort="relevance", 
                    limit=10, 
                    time_filter="year"
                )
                
                for submission in search_results:
                    # Skip if already collected
                    if any(post["url"] == f"https://www.reddit.com{submission.permalink}" for post in posts):
                        continue
                    
                    # Filter for relevant posts
                    title_lower = submission.title.lower()
                    if any(word in title_lower for word in ["help", "problem", "issue", "struggle", "question", "advice", "recommendation"]):
                        posts.append({
                            "title": submission.title,
                            "content": submission.selftext[:500] if submission.selftext else "",
                            "url": f"https://www.reddit.com{submission.permalink}",
                            "subreddit": subreddit_name,
                            "score": submission.score,
                            "num_comments": submission.num_comments
                        })
            except Exception as e:
                print(f"Error searching subreddit {subreddit_name}: {e}")
                continue
        
        return {"redditPosts": posts}
    except Exception as e:
        print(f"Error in targeted Reddit search: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/update-subreddit-metadata")
async def update_subreddit_metadata():
    """Update subreddit metadata from Reddit API"""
    try:
        subreddit_metadata.update_metadata_from_reddit()
        return {"status": "success", "message": "Subreddit metadata updated successfully"}
    except Exception as e:
        print(f"Error updating subreddit metadata: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/get-all-subreddits")
async def get_all_subreddits():
    """Get all available subreddits for manual selection"""
    try:
        all_subreddits = []
        for subreddit_name, subreddit_data in subreddit_metadata.metadata["subreddits"].items():
            all_subreddits.append({
                "name": subreddit_name,
                "display_name": subreddit_data["display_name"],
                "category": subreddit_data["category"],
                "subscribers": subreddit_data["subscribers"],
                "activity_score": subreddit_data["activity_score"]
            })
        
        # Sort by subscribers (most popular first)
        all_subreddits.sort(key=lambda x: x["subscribers"], reverse=True)
        return {"subreddits": all_subreddits}
    except Exception as e:
        print(f"Error getting all subreddits: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))