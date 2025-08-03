import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import APIConfig from './components/APIConfig';
import { Sparkles, TrendingUp, DollarSign, Users, Rocket, Star, Brain, Target, ChevronRight, Loader2 } from 'lucide-react';
import './index.css';

// Draggable Pain Point Component
const PainPoint = ({ point, index, movePainPoint }) => {
  // If point is an object, extract the painPoint text
  const painPointText = typeof point === 'object' ? point.painPoint : point;
  const ref = useRef(null);
  const [, drop] = useDrop({
    accept: 'painPoint',
    hover(item, monitor) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;
      movePainPoint(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });
  const [{ isDragging }, drag] = useDrag({
    type: 'painPoint',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  drag(drop(ref));
  return (
    <li
      ref={ref}
      className={`flex items-center mb-2 p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 ${isDragging ? 'opacity-50' : ''} hover:bg-white/20 transition-all duration-300`}
    >
      <span className="text-white">{painPointText}</span>
    </li>
  );
};

const PainPointCluster = ({ cluster, onSelectPainPoint }) => {
  return (
    <div className="mb-6 p-6 bg-gradient-to-r from-purple-600/20 to-yellow-600/20 backdrop-blur-lg rounded-2xl border border-white/10 shadow-2xl hover:scale-105 transition-transform duration-300">
      <h3 className="text-xl font-bold text-yellow-400 mb-4">{cluster.name}</h3>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-sm text-gray-300 mb-2">Emotion Intensity</p>
          <div className="w-full bg-white/10 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-red-400 to-red-600 h-3 rounded-full transition-all duration-300" 
              style={{ width: `${cluster.emotionIntensity * 10}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-300 mt-1">{cluster.emotionIntensity}/10</p>
        </div>
        <div>
          <p className="text-sm text-gray-300 mb-2">Solution Gap</p>
          <div className="w-full bg-white/10 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full transition-all duration-300" 
              style={{ width: `${cluster.solutionGap * 10}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-300 mt-1">{cluster.solutionGap}/10</p>
        </div>
      </div>
      <div className="mb-6">
        <p className="text-sm font-medium text-gray-300 mb-3">Themes:</p>
        <div className="flex flex-wrap gap-2">
          {cluster.themes.map((theme, index) => (
            <span key={index} className="px-3 py-1 bg-white/10 border border-white/20 rounded-lg text-sm text-gray-300 backdrop-blur-sm">
              {theme}
            </span>
          ))}
        </div>
      </div>
      <div className="mb-6">
        <p className="text-sm font-medium text-gray-300 mb-3">Representative Quotes:</p>
        <ul className="space-y-3">
          {cluster.quotes.map((quote, index) => (
            <li key={index} className="text-sm text-gray-300 italic bg-white/5 p-3 rounded-lg border border-white/10">
              "{quote}"
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-300 mb-3">Pain Points:</p>
        <ul className="space-y-3">
          {cluster.painPoints.map((painPoint, index) => (
            <li 
              key={index}
              className="p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 cursor-pointer hover:bg-white/20 transition-all duration-300 hover:scale-105"
              onClick={() => onSelectPainPoint(painPoint)}
            >
              <p className="text-sm font-medium text-white">{painPoint.point}</p>
              <p className="text-xs text-gray-400 mt-2">Current Solutions: {painPoint.currentSolutions.join(", ")}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const BusinessIdea = ({ idea, onRate }) => {
  return (
    <div className="mb-8 p-6 bg-gradient-to-r from-purple-600/20 to-yellow-600/20 backdrop-blur-lg rounded-2xl border border-white/10 shadow-2xl hover:scale-105 transition-transform duration-300">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-2xl font-bold text-yellow-400 mb-2">{idea.name}</h3>
          <p className="text-gray-300">{idea.targetAudience}</p>
        </div>
        <div className="flex items-center">
          <span className="text-xl font-bold text-blue-400 mr-3">{idea.resonanceScore}</span>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => onRate(idea.name, star)}
                className="text-yellow-400 hover:text-yellow-300 focus:outline-none transition-colors duration-200"
              >
                ★
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <p className="text-gray-200 leading-relaxed">{idea.description}</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <h4 className="text-sm font-bold text-green-400 mb-3">Value Proposition</h4>
          <p className="text-sm text-gray-300">{idea.valueProposition}</p>
        </div>
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <h4 className="text-sm font-bold text-purple-400 mb-3">Unique Mechanism</h4>
          <p className="text-sm text-gray-300">{idea.uniqueMechanism}</p>
        </div>
      </div>
      
      <div className="mb-6">
        <h4 className="text-sm font-bold text-blue-400 mb-3">Key Features</h4>
        <div className="flex flex-wrap gap-2">
          {idea.keyFeatures.map((feature, index) => (
            <span key={index} className="px-3 py-1 bg-blue-500/20 border border-blue-400/30 text-blue-300 rounded-lg text-sm">
              {feature}
            </span>
          ))}
        </div>
      </div>
      
      <div className="mb-6">
        <h4 className="text-sm font-bold text-green-400 mb-3">Market Trends</h4>
        <div className="flex flex-wrap gap-2">
          {idea.marketTrends.map((trend, index) => (
            <span key={index} className="px-3 py-1 bg-green-500/20 border border-green-400/30 text-green-300 rounded-lg text-sm">
              {trend}
            </span>
          ))}
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <h4 className="text-sm font-bold text-yellow-400 mb-3">Monetization</h4>
          <p className="text-sm text-gray-300">{idea.monetization}</p>
        </div>
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <h4 className="text-sm font-bold text-purple-400 mb-3">Competition</h4>
          <div className="text-sm">
            <p className="text-gray-300 mb-2">
              <span className="font-medium">Existing:</span> {idea.competition.existingSolutions.join(", ")}
            </p>
            <p className="text-gray-300">
              <span className="font-medium">Our Edge:</span> {idea.competition.ourAdvantage}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [isConfigured, setIsConfigured] = useState(false);
  const [step, setStep] = useState(0);
  const [userProfile, setUserProfile] = useState({
    interest: '',
    interestOther: '',
    skill: '',
    skillOther: '',
    problem: '',
    problemOther: '',
    details: '',
  });
  const [niches, setNiches] = useState([]);
  const [selectedNiche, setSelectedNiche] = useState('');
  const [demandData, setDemandData] = useState(null);
  const [redditSearchQuery, setRedditSearchQuery] = useState('');
  const [redditSearchResults, setRedditSearchResults] = useState([]);
  const [selectedRedditPosts, setSelectedRedditPosts] = useState([]);
  const [painPoints, setPainPoints] = useState([]);
  const [prioritizedPainPoints, setPrioritizedPainPoints] = useState([]);
  const [businessIdeas, setBusinessIdeas] = useState([]);
  const [ideaRatings, setIdeaRatings] = useState({});
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false); // Added loading state
  const chartRef = useRef(null);
  const [painPointAnalysis, setPainPointAnalysis] = useState(null);
  const [suggestedSubreddits, setSuggestedSubreddits] = useState([]);
  const [selectedSubreddits, setSelectedSubreddits] = useState([]);
  const [allSubreddits, setAllSubreddits] = useState([]);

  useEffect(() => {
    // Load saved progress
    const saved = localStorage.getItem('ideaSparkProgress');
    if (saved) {
      const data = JSON.parse(saved);
      setUserProfile(data.userProfile || userProfile);
      setNiches(data.niches || []);
      setSelectedNiche(data.selectedNiche || '');
      setDemandData(data.demandData || null);
      setRedditSearchQuery(data.redditSearchQuery || '');
      setRedditSearchResults(data.redditSearchResults || []);
      setSelectedRedditPosts(data.selectedRedditPosts || []);
      setPainPoints(data.painPoints || []);
      setPrioritizedPainPoints(data.prioritizedPainPoints || []);
      setBusinessIdeas(data.businessIdeas || []);
      setIdeaRatings(data.ideaRatings || {});
      setStep(data.step || 0);
      setPainPointAnalysis(data.painPointAnalysis || null);
    }
  }, []);

  useEffect(() => {
    // Save progress
    localStorage.setItem(
      'ideaSparkProgress',
      JSON.stringify({
        userProfile,
        niches,
        selectedNiche,
        demandData,
        redditSearchQuery,
        redditSearchResults,
        selectedRedditPosts,
        painPoints,
        prioritizedPainPoints,
        businessIdeas,
        ideaRatings,
        step,
        painPointAnalysis,
      })
    );
    setProgress((step / 8) * 100);
  }, [userProfile, niches, selectedNiche, demandData, redditSearchQuery, redditSearchResults, selectedRedditPosts, painPoints, prioritizedPainPoints, businessIdeas, ideaRatings, step, painPointAnalysis]);

  // Debug useEffect for painPointAnalysis
  useEffect(() => {
    console.log("painPointAnalysis state changed:", painPointAnalysis);
  }, [painPointAnalysis]);

  useEffect(() => {
    // Render demand chart
    if (demandData && step === 2 && chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      const chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: demandData.labels || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [
            {
              label: 'Search Volume',
              data: demandData.searchVolume || [1000, 1200, 1500, 1800, 2000, 2200],
              borderColor: '#10B981',
              backgroundColor: 'rgba(16, 185, 129, 0.2)',
            },
          ],
        },
        options: {
          responsive: true,
          scales: { y: { beginAtZero: true } },
        },
      });
      return () => chart.destroy();
    }
  }, [demandData, step]);

  const handleSearchReddit = async () => {
    try {
      if (!redditSearchQuery) {
        alert('Please enter a search query for Reddit.');
        return;
      }
      setIsLoading(true);
      const response = await axios.post('http://localhost:8000/search-reddit', { niche: redditSearchQuery });
      setRedditSearchResults(response.data.redditPosts);
      setSelectedRedditPosts([]);
    } catch (error) {
      console.error('Error searching Reddit:', error);
      alert('An error occurred while searching Reddit. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchRedditTargeted = async () => {
    try {
      if (!redditSearchQuery) {
        alert('Please enter a search query for Reddit.');
        return;
      }
      if (selectedSubreddits.length === 0) {
        alert('Please select at least one subreddit to search.');
        return;
      }
      setIsLoading(true);
      const response = await axios.post('http://localhost:8000/search-reddit-targeted', { 
        query: redditSearchQuery,
        selected_subreddits: selectedSubreddits
      });
      setRedditSearchResults(response.data.redditPosts);
      setSelectedRedditPosts([]);
    } catch (error) {
      console.error('Error searching Reddit:', error);
      alert('An error occurred while searching Reddit. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectRedditPost = (post, isChecked) => {
    if (isChecked) {
      setSelectedRedditPosts([...selectedRedditPosts, post]);
    } else {
      setSelectedRedditPosts(selectedRedditPosts.filter((p) => p.url !== post.url));
    }
  };

  const handleNext = async () => {
    try {
      setIsLoading(true);
      if (step === 0) {
        if ((userProfile.interest || userProfile.interestOther) && (userProfile.skill || userProfile.skillOther)) {
          const response = await axios.post('http://localhost:8000/generate-niches', { profile: userProfile });
          setNiches(response.data.niches);
          setStep(1);
        } else {
          alert('Please select or enter an interest and skill.');
        }
      } else if (step === 1 && selectedNiche) {
        const response = await axios.post('http://localhost:8000/validate-demand', { niche: selectedNiche });
        setDemandData(response.data);
        setStep(2);
      } else if (step === 2) {
        // Get suggested subreddits based on user profile
        try {
          const subredditResponse = await axios.post('http://localhost:8000/get-relevant-subreddits', { profile: userProfile });
          setSuggestedSubreddits(subredditResponse.data.suggested_subreddits);
          setSelectedSubreddits(subredditResponse.data.suggested_subreddits.map(s => s.name));
          
          // Get all available subreddits for manual selection
          const allSubredditsResponse = await axios.get('http://localhost:8000/get-all-subreddits');
          setAllSubreddits(allSubredditsResponse.data.subreddits);
          
          setStep(3);
        } catch (error) {
          console.error('Error getting subreddits:', error);
          alert('Error getting subreddit suggestions. Please try again.');
        }
      } else if (step === 3) {
        // Step 3 is subreddit selection - just continue to step 4 (search)
        if (selectedSubreddits.length === 0) {
          alert('Please select at least one subreddit to search in.');
          return;
        }
        setStep(4);
      } else if (step === 4) {
        if (selectedRedditPosts.length === 0) {
          alert('Please select at least one Reddit post to analyze pain points.');
          return;
        }
        
        console.log("Processing pain points for posts:", selectedRedditPosts.length); // Debug log
        
        const response = await axios.post('http://localhost:8000/process-pain-points', { 
          painPoints: selectedRedditPosts.map(p => p.content) 
        });
        
        console.log("Pain points processing response:", response.data); // Debug log
        console.log("Setting painPointAnalysis to:", response.data.analysis); // Debug log
        setPainPointAnalysis(response.data.analysis);
        setStep(5);
      } else if (step === 5) {
        console.log("Pain point analysis:", painPointAnalysis); // Debug log
        
        // Extract top pain points from clusters based on emotion intensity and solution gap
        let topPainPoints = [];
        
        if (painPointAnalysis.clusters && painPointAnalysis.clusters.length > 0) {
          topPainPoints = painPointAnalysis.clusters
            .flatMap(cluster => cluster.painPoints || [])
            .sort((a, b) => (b.emotionIntensity + b.solutionGap) - (a.emotionIntensity + a.solutionGap))
            .slice(0, 3);
        } else {
          // Fallback: use selected Reddit posts if no clusters available
          topPainPoints = selectedRedditPosts.slice(0, 3).map(post => ({
            point: post.title,
            quote: post.content.substring(0, 200),
            emotionIntensity: 7,
            currentSolutions: [],
            solutionGap: 7
          }));
        }
        
        console.log("Top pain points:", topPainPoints); // Debug log
        
        const response = await axios.post('http://localhost:8000/generate-ideas', {
          painPoints: topPainPoints,
          profile: userProfile
        });
        
        console.log("Generated ideas response:", response.data); // Debug log
        setBusinessIdeas(response.data.ideas);
        setStep(6);
      } else if (step === 6) {
        setStep(7);
      } else {
        alert('Please complete the required fields.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const movePainPoint = (dragIndex, hoverIndex) => {
    const newPainPoints = [...prioritizedPainPoints];
    const [dragged] = newPainPoints.splice(dragIndex, 1);
    newPainPoints.splice(hoverIndex, 0, dragged);
    setPrioritizedPainPoints(newPainPoints);
  };

  const handleRateIdea = (idea, rating) => {
    setIdeaRatings({ ...ideaRatings, [idea.name]: rating });
  };

  const handleDownload = () => {
    const summary = `
IdeaSpark Business Idea Summary
Profile:
- Interest: ${userProfile.interest || userProfile.interestOther}
- Skill: ${userProfile.skill || userProfile.skillOther}
- Problem: ${userProfile.problem || userProfile.problemOther}
- Details: ${userProfile.details}
Niche: ${selectedNiche}
Demand: ${JSON.stringify(demandData)}
Selected Reddit Posts: ${selectedRedditPosts.map(p => p.title + ' (' + p.url + ')').join('\n')}
Pain Points: ${prioritizedPainPoints.join('\n')}
Ideas: ${businessIdeas.map((idea) => `${idea.name}: ${idea.description}\nRating: ${ideaRatings[idea.name] || 'Not rated'}`).join('\n')}
`;
    const blob = new Blob([summary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'IdeaSpark_Summary.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleConfigSuccess = () => {
    setIsConfigured(true);
  };

  if (!isConfigured) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-blue-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <APIConfig onConfigSuccess={handleConfigSuccess} />
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-blue-900 text-white relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-gradient-to-r from-purple-400 to-yellow-400 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 4 + 2}px`,
                height: `${Math.random() * 4 + 2}px`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>

        <div className="relative z-10 container mx-auto p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <Sparkles className="w-8 h-8 text-yellow-400" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                IdeaSpark
              </h1>
            </div>
            <div className="text-sm text-gray-400">
              Step {step + 1} of 8
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-white/10 rounded-full h-3 mb-8 backdrop-blur-sm">
            <div className="bg-gradient-to-r from-purple-600 to-yellow-500 h-3 rounded-full transition-all duration-500 shadow-lg" style={{ width: `${progress}%` }}></div>
          </div>

          {/* Main Content */}
          <div className="bg-gradient-to-r from-purple-600/20 to-yellow-600/20 backdrop-blur-lg rounded-3xl p-8 border border-white/10 shadow-2xl">
                      {step === 0 && (
              <div>
                <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-purple-400 bg-clip-text text-transparent">Step 1: Tell Us About Yourself</h2>
                <p className="text-xl text-gray-300 mb-8">Share your interests, skills, and a problem you care about to get personalized ideas.</p>
                <div className="mb-6">
                  <label className="block mb-2 text-sm font-medium text-gray-300">Interests</label>
                  <select
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:border-yellow-400 transition-colors text-white placeholder-gray-400"
                    value={userProfile.interest}
                    onChange={(e) => setUserProfile({ ...userProfile, interest: e.target.value })}
                  >
                    <option value="">Select an interest</option>
                    <option value="Technology">Technology</option>
                    <option value="Health">Health</option>
                    <option value="Education">Education</option>
                    <option value="Lifestyle">Lifestyle</option>
                    <option value="Other">Other</option>
                  </select>
                  {userProfile.interest === 'Other' && (
                    <input
                      type="text"
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 mt-2 focus:outline-none focus:border-yellow-400 transition-colors text-white placeholder-gray-400"
                      placeholder="Specify your interest"
                      value={userProfile.interestOther}
                      onChange={(e) => setUserProfile({ ...userProfile, interestOther: e.target.value })}
                    />
                  )}
                </div>
                <div className="mb-6">
                  <label className="block mb-2 text-sm font-medium text-gray-300">Skills</label>
                  <select
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:border-yellow-400 transition-colors text-white placeholder-gray-400"
                    value={userProfile.skill}
                    onChange={(e) => setUserProfile({ ...userProfile, skill: e.target.value })}
                  >
                    <option value="">Select a skill</option>
                    <option value="Coding">Coding</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Design">Design</option>
                    <option value="Management">Management</option>
                    <option value="Other">Other</option>
                  </select>
                  {userProfile.skill === 'Other' && (
                    <input
                      type="text"
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 mt-2 focus:outline-none focus:border-yellow-400 transition-colors text-white placeholder-gray-400"
                      placeholder="Specify your skill"
                      value={userProfile.skillOther}
                      onChange={(e) => setUserProfile({ ...userProfile, skillOther: e.target.value })}
                    />
                  )}
                </div>
                <div className="mb-6">
                  <label className="block mb-2 text-sm font-medium text-gray-300">Problem to Solve</label>
                  <select
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:border-yellow-400 transition-colors text-white placeholder-gray-400"
                    value={userProfile.problem}
                    onChange={(e) => setUserProfile({ ...userProfile, problem: e.target.value })}
                  >
                    <option value="">Select a problem</option>
                    <option value="Productivity">Productivity</option>
                    <option value="Collaboration">Collaboration</option>
                    <option value="Accessibility">Accessibility</option>
                    <option value="Sustainability">Sustainability</option>
                    <option value="Other">Other</option>
                  </select>
                  {userProfile.problem === 'Other' && (
                    <input
                      type="text"
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 mt-2 focus:outline-none focus:border-yellow-400 transition-colors text-white placeholder-gray-400"
                      placeholder="Specify the problem"
                      value={userProfile.problemOther}
                      onChange={(e) => setUserProfile({ ...userProfile, problemOther: e.target.value })}
                    />
                  )}
                </div>
                <div className="mb-8">
                  <label className="block mb-2 text-sm font-medium text-gray-300">Additional Details</label>
                  <textarea
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 h-24 focus:outline-none focus:border-yellow-400 transition-colors text-white placeholder-gray-400 resize-none"
                    placeholder="e.g., I love AI and want to help freelancers"
                    value={userProfile.details}
                    onChange={(e) => setUserProfile({ ...userProfile, details: e.target.value })}
                  />
                </div>
                <button
                  className="group relative bg-gradient-to-r from-purple-600 to-yellow-500 hover:from-purple-700 hover:to-yellow-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleNext}
                  disabled={isLoading}
                >
                  <span className="flex items-center justify-center space-x-2">
                    <Sparkles className="w-6 h-6" />
                    <span>{isLoading ? 'Processing...' : 'Find My Niches'}</span>
                    <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              </div>
            )}
                      {step === 1 && (
              <div>
                <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-purple-400 bg-clip-text text-transparent">Step 2: Select a Niche</h2>
                <p className="text-xl text-gray-300 mb-8">Choose a niche that excites you.</p>
                <select
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:border-yellow-400 transition-colors text-white placeholder-gray-400 mb-8"
                  value={selectedNiche}
                  onChange={(e) => setSelectedNiche(e.target.value)}
                >
                  <option value="">Select a niche</option>
                  {niches.map((niche, index) => (
                    <option key={index} value={niche}>{niche}</option>
                  ))}
                </select>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    className="group relative bg-gradient-to-r from-purple-600 to-yellow-500 hover:from-purple-700 hover:to-yellow-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleNext}
                    disabled={isLoading}
                  >
                    <span className="flex items-center justify-center space-x-2">
                      <Sparkles className="w-6 h-6" />
                      <span>{isLoading ? 'Processing...' : 'Validate Demand'}</span>
                      <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </button>
                  <button
                    className="bg-white/10 border border-white/20 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 hover:bg-white/20 hover:scale-105"
                    onClick={() => setStep(0)}
                  >
                    Back
                  </button>
                </div>
              </div>
            )}
                      {step === 2 && (
              <div>
                <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-purple-400 bg-clip-text text-transparent">Step 3: Review Market Demand</h2>
                <p className="text-xl text-gray-300 mb-8">See how popular your niche is.</p>
                
                <div className="bg-white/5 rounded-lg p-6 border border-white/10 mb-8">
                  <canvas ref={chartRef} className="mb-4 max-w-md"></canvas>
                  <p className="text-gray-300">Trend: {demandData?.trend || 'Loading...'}</p>
                  <p className="text-gray-300">Average Search Volume: {demandData?.searchVolume?.reduce((a, b) => a + b, 0) / (demandData?.searchVolume?.length || 1) || 'Loading...'}</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    className="group relative bg-gradient-to-r from-purple-600 to-yellow-500 hover:from-purple-700 hover:to-yellow-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl"
                    onClick={handleNext}
                  >
                    <span className="flex items-center justify-center space-x-2">
                      <Sparkles className="w-6 h-6" />
                      <span>Continue to Subreddit Selection</span>
                      <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </button>
                  <button
                    className="bg-white/10 border border-white/20 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 hover:bg-white/20 hover:scale-105"
                    onClick={() => setStep(1)}
                  >
                    Back
                  </button>
                </div>
              </div>
            )}
            {step === 3 && (
              <div>
                <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-purple-400 bg-clip-text text-transparent">Step 4: Select Subreddits for Research</h2>
                <p className="text-xl text-gray-300 mb-8">Choose which communities to search for pain points.</p>
                
                {/* Suggested Subreddits */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-4 text-yellow-400">Suggested Subreddits</h3>
                  <p className="text-gray-300 mb-4">Based on your profile, we suggest these communities:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {suggestedSubreddits.map((subreddit, index) => (
                      <div key={index} className="bg-gradient-to-r from-purple-600/20 to-yellow-600/20 backdrop-blur-lg rounded-lg p-4 border border-white/10 hover:scale-105 transition-transform duration-300">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-white">{subreddit.display_name}</h4>
                          <span className="text-sm text-gray-400">{subreddit.subscribers.toLocaleString()} members</span>
                        </div>
                        <p className="text-sm text-gray-300 mb-2">{subreddit.category}</p>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-yellow-400">Activity: {subreddit.activity_score}/10</span>
                          <span className="text-xs text-blue-400">Relevance: {Math.round(subreddit.relevance_score)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Manual Subreddit Selection */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-4 text-purple-400">All Available Subreddits</h3>
                  <p className="text-gray-300 mb-4">Add or remove subreddits from your search:</p>
                  <div className="max-h-60 overflow-y-auto bg-white/5 rounded-lg p-4 border border-white/10">
                    {allSubreddits.map((subreddit, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white/10 rounded-lg mb-2 hover:bg-white/20 transition-all duration-300">
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            id={`subreddit-${index}`}
                            checked={selectedSubreddits.includes(subreddit.name)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedSubreddits([...selectedSubreddits, subreddit.name]);
                              } else {
                                setSelectedSubreddits(selectedSubreddits.filter(s => s !== subreddit.name));
                              }
                            }}
                            className="mr-3"
                          />
                          <label htmlFor={`subreddit-${index}`} className="text-white cursor-pointer">
                            <div className="font-medium">{subreddit.display_name}</div>
                            <div className="text-sm text-gray-400">{subreddit.category} • {subreddit.subscribers.toLocaleString()} members</div>
                          </label>
                        </div>
                        <span className="text-sm text-gray-400">Activity: {subreddit.activity_score}/10</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    className="group relative bg-gradient-to-r from-purple-600 to-yellow-500 hover:from-purple-700 hover:to-yellow-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl"
                    onClick={handleNext}
                    disabled={selectedSubreddits.length === 0}
                  >
                    <span className="flex items-center justify-center space-x-2">
                      <Sparkles className="w-6 h-6" />
                      <span>Continue to Search ({selectedSubreddits.length} subreddits)</span>
                      <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </button>
                  <button
                    className="bg-white/10 border border-white/20 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 hover:bg-white/20 hover:scale-105"
                    onClick={() => setStep(2)}
                  >
                    Back
                  </button>
                </div>
              </div>
            )}
            {step === 4 && (
              <div>
                <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-purple-400 bg-clip-text text-transparent">Step 5: Search for Pain Points</h2>
                <p className="text-xl text-gray-300 mb-8">Search selected subreddits for pain points and problems.</p>
                
                <div className="mb-8">
                  <label className="block mb-3 text-sm font-medium text-gray-300">Search Query</label>
                  <div className="flex">
                    <input
                      type="text"
                      className="flex-1 bg-white/10 border border-white/20 rounded-l-lg px-4 py-3 focus:outline-none focus:border-yellow-400 transition-colors text-white placeholder-gray-400"
                      placeholder="e.g., struggles, problems, issues, help needed"
                      value={redditSearchQuery}
                      onChange={(e) => setRedditSearchQuery(e.target.value)}
                    />
                    <button
                      className="bg-gradient-to-r from-purple-600 to-yellow-500 hover:from-purple-700 hover:to-yellow-600 text-white font-bold px-6 py-3 rounded-r-lg transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleSearchRedditTargeted}
                      disabled={isLoading || selectedSubreddits.length === 0}
                    >
                      {isLoading ? 'Searching...' : 'Search'}
                    </button>
                  </div>
                  <p className="text-sm text-gray-400 mt-2">Searching in: {selectedSubreddits.join(', ')}</p>
                </div>

                {redditSearchResults.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xl font-bold mb-4 text-yellow-400">Select Relevant Posts:</h3>
                    <ul className="space-y-3 max-h-60 overflow-y-auto bg-white/5 rounded-lg p-4 border border-white/10">
                      {redditSearchResults.map((post, index) => (
                        <li key={post.url} className="flex items-start p-3 bg-white/10 rounded-lg border border-white/10 hover:bg-white/20 transition-all duration-300">
                          <input
                            type="checkbox"
                            id={`reddit-post-${index}`}
                            checked={selectedRedditPosts.some(p => p.url === post.url)}
                            onChange={(e) => handleSelectRedditPost(post, e.target.checked)}
                            className="mr-3 mt-1"
                          />
                          <label htmlFor={`reddit-post-${index}`} className="block text-white cursor-pointer">
                            <strong className="block text-yellow-400">{post.title}</strong>
                            <p className="text-sm text-gray-300 line-clamp-2 mt-1">{post.content}</p>
                            <div className="flex items-center space-x-2 mt-2">
                              <span className="text-xs text-blue-400">r/{post.subreddit}</span>
                              <span className="text-xs text-gray-400">↑ {post.score}</span>
                              <span className="text-xs text-gray-400">💬 {post.num_comments}</span>
                            </div>
                            <a href={post.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 text-xs hover:text-blue-300 transition-colors">Read more</a>
                          </label>
                        </li>
                      ))}
                    </ul>
                    <p className="text-gray-400 text-sm mt-3">Selected: {selectedRedditPosts.length} posts</p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    className={`group relative bg-gradient-to-r from-purple-600 to-yellow-500 hover:from-purple-700 hover:to-yellow-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={handleNext}
                    disabled={isLoading || selectedRedditPosts.length === 0}
                  >
                    <span className="flex items-center justify-center space-x-2">
                      <Sparkles className="w-6 h-6" />
                      <span>{isLoading ? 'Processing...' : 'Analyze Pain Points'}</span>
                      <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </button>
                  <button
                    className="bg-white/10 border border-white/20 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 hover:bg-white/20 hover:scale-105"
                    onClick={() => setStep(3)}
                  >
                    Back
                  </button>
                </div>
              </div>
            )}

                      {step === 5 && (
              <div>
                <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-purple-400 bg-clip-text text-transparent">Step 6: Pain Point Analysis</h2>
                <p className="text-xl text-gray-300 mb-8">Review and analyze the identified pain points and their clusters.</p>
                
                {/* Debug logging */}
                {console.log("Step 5 - painPointAnalysis:", painPointAnalysis)}
                {console.log("Step 5 - clusters:", painPointAnalysis?.clusters)}
                
                {/* Use only painPointAnalysis.clusters */}
                {(() => {
                  const clusters = painPointAnalysis?.clusters || [];
                  console.log("Step 5 - clusters length:", clusters.length);
                  if (clusters.length > 0) {
                    return (
                      <div className="space-y-6">
                        {clusters.map((cluster, index) => (
                          <PainPointCluster 
                            key={index} 
                            cluster={cluster}
                            onSelectPainPoint={(painPoint) => {
                              // Handle pain point selection
                              console.log("Selected pain point:", painPoint);
                            }}
                          />
                        ))}
                      </div>
                    );
                  } else {
                    return (
                      <div className="text-gray-400 text-center py-8">
                        No pain points found. Try selecting more/different Reddit posts.
                        <br />
                        <small className="text-xs">Debug: painPointAnalysis = {JSON.stringify(painPointAnalysis)}</small>
                      </div>
                    );
                  }
                })()}
                
                {/* Disable button if no clusters */}
                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                  <button
                    className={`group relative bg-gradient-to-r from-purple-600 to-yellow-500 hover:from-purple-700 hover:to-yellow-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={handleNext}
                    disabled={!(painPointAnalysis?.clusters?.length > 0) || isLoading}
                  >
                    <span className="flex items-center justify-center space-x-2">
                      {isLoading ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                      ) : (
                        <Sparkles className="w-6 h-6" />
                      )}
                      <span>{isLoading ? 'Generating Ideas...' : 'Generate Business Ideas'}</span>
                      {!isLoading && <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />}
                    </span>
                  </button>
                  <button
                    className="bg-white/10 border border-white/20 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 hover:bg-white/20 hover:scale-105"
                    onClick={() => setStep(2)}
                  >
                    Back
                  </button>
                </div>
              </div>
            )}
                      {step === 6 && (
              <div>
                <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-purple-400 bg-clip-text text-transparent">Step 7: Business Ideas</h2>
                <p className="text-xl text-gray-300 mb-8">Review and rate the generated business ideas.</p>
                <div className="space-y-6">
                  {businessIdeas.map((idea, index) => (
                    <BusinessIdea
                      key={index}
                      idea={idea}
                      onRate={handleRateIdea}
                    />
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                  <button
                    className="group relative bg-gradient-to-r from-purple-600 to-yellow-500 hover:from-purple-700 hover:to-yellow-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl"
                    onClick={handleNext}
                  >
                    <span className="flex items-center justify-center space-x-2">
                      <Sparkles className="w-6 h-6" />
                      <span>Continue</span>
                      <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </button>
                  <button
                    className="bg-white/10 border border-white/20 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 hover:bg-white/20 hover:scale-105"
                    onClick={() => setStep(3)}
                  >
                    Back
                  </button>
                </div>
              </div>
            )}
                      {step === 7 && (
              <div>
                <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-purple-400 bg-clip-text text-transparent">Step 8: Your Business Idea</h2>
                <p className="text-xl text-gray-300 mb-8">Congratulations! Review your ideas and save your progress.</p>
                <ul className="space-y-6 mb-8">
                  {businessIdeas.map((idea, index) => (
                    <li key={index} className="p-6 bg-gradient-to-r from-purple-600/20 to-yellow-600/20 backdrop-blur-lg rounded-2xl border border-white/10 shadow-2xl hover:scale-105 transition-transform duration-300">
                      <h3 className="text-xl font-bold text-yellow-400 mb-2">{idea.name}</h3>
                      <p className="text-gray-200 mb-3">{idea.description}</p>
                      <p className="text-gray-400">Rating: {ideaRatings[idea.name] || 'Not rated'}</p>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    className="group relative bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleDownload}
                    disabled={isLoading}
                  >
                    <span className="flex items-center justify-center space-x-2">
                      <Sparkles className="w-6 h-6" />
                      <span>{isLoading ? 'Processing...' : 'Download Summary'}</span>
                    </span>
                  </button>
                  <button
                    className="bg-white/10 border border-white/20 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 hover:bg-white/20 hover:scale-105"
                    onClick={() => {
                      localStorage.removeItem('ideaSparkProgress');
                      window.location.reload();
                    }}
                  >
                    Start Over
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default App;