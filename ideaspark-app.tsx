import React, { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, DollarSign, Users, Rocket, Star, Brain, Target, ChevronRight } from 'lucide-react';

const IdeaSpark = () => {
  const [currentView, setCurrentView] = useState('landing');
  const [typingText, setTypingText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedIdea, setGeneratedIdea] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [userInputs, setUserInputs] = useState({
    industry: '',
    interests: '',
    goal: ''
  });

  const fullText = "Discover Your Next Million-Dollar Business Idea...";
  
  useEffect(() => {
    if (currentView === 'landing') {
      let i = 0;
      const timer = setInterval(() => {
        setTypingText(fullText.slice(0, i));
        i++;
        if (i > fullText.length) {
          clearInterval(timer);
        }
      }, 100);
      return () => clearInterval(timer);
    }
  }, [currentView]);

  const generateIdea = async () => {
    setIsGenerating(true);
    setCurrentView('generating');
    
    // Simulate AI processing steps
    const steps = [
      "🔍 Mining Market Data...",
      "🧠 Analyzing Reddit Trends...",
      "📈 Scanning Google Trends...",
      "💡 Crafting Your Idea..."
    ];
    
    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
    
    // Generate a sample idea
    const sampleIdeas = [
      {
        name: "AI-Powered Plant Care Assistant",
        description: "Smart device that monitors plant health and sends personalized care tips via mobile app",
        trend: "Home gardening surged 300% post-pandemic",
        monetization: "Subscription model ($9.99/month) + hardware sales",
        redditSignal: "r/houseplants has 2.8M members with 85% engagement"
      },
      {
        name: "Micro-Learning Language Exchange",
        description: "5-minute daily video calls with native speakers for practical conversation practice",
        trend: "Language learning apps grew 132% in 2024",
        monetization: "Freemium model with premium matching ($19.99/month)",
        redditSignal: "r/languagelearning shows high demand for conversation practice"
      },
      {
        name: "Virtual Interior Design for Renters",
        description: "AR app that lets renters visualize furniture and decor without permanent changes",
        trend: "70% of millennials are renters seeking personalization",
        monetization: "Affiliate commissions + premium AR features",
        redditSignal: "r/malelivingspace and r/femalelivingspace combined 1.2M active users"
      }
    ];
    
    const randomIdea = sampleIdeas[Math.floor(Math.random() * sampleIdeas.length)];
    setGeneratedIdea(randomIdea);
    setIsGenerating(false);
    setCurrentView('result');
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const ConfettiAnimation = () => (
    <div className="fixed inset-0 pointer-events-none z-50">
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-bounce"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${2 + Math.random() * 3}s`
          }}
        >
          <div className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-purple-500 rounded-full" />
        </div>
      ))}
    </div>
  );

  const LandingPage = () => (
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

      {/* Header */}
      <nav className="relative z-10 flex items-center justify-between p-6 backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-8 h-8 text-yellow-400" />
          <span className="text-2xl font-bold">IdeaSpark</span>
        </div>
        <div className="hidden md:flex space-x-8">
          <a href="#" className="hover:text-yellow-400 transition-colors">How it Works</a>
          <a href="#" className="hover:text-yellow-400 transition-colors">About</a>
          <a href="#" className="hover:text-yellow-400 transition-colors">Sign In</a>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[70vh] text-center px-6">
        <div className="bg-gradient-to-r from-purple-600/20 to-yellow-600/20 backdrop-blur-lg rounded-3xl p-12 max-w-4xl mx-auto border border-white/10">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
            {typingText}
            <span className="animate-pulse">|</span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-gray-300">
            AI + Real-Time Market Signals = Goldmine Business Ideas
          </p>
          
          <button
            onClick={() => setCurrentView('form')}
            className="group relative bg-gradient-to-r from-purple-600 to-yellow-500 hover:from-purple-700 hover:to-yellow-600 text-white font-bold py-4 px-8 rounded-full text-xl transition-all duration-300 transform hover:scale-105 shadow-2xl"
          >
            <span className="flex items-center space-x-2">
              <Rocket className="w-6 h-6" />
              <span>Start Now</span>
              <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
          
          <div className="mt-6 flex items-center justify-center space-x-4 text-sm text-gray-400">
            <span>🔐 Powered by OpenAI</span>
            <span>•</span>
            <span>📊 Reddit API</span>
            <span>•</span>
            <span>📈 Google Trends</span>
          </div>
        </div>

        {/* Floating idea cards animation */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-gradient-to-r from-purple-500/10 to-yellow-500/10 backdrop-blur-sm rounded-lg p-4 border border-white/10 animate-float"
              style={{
                left: `${10 + Math.random() * 80}%`,
                top: `${20 + Math.random() * 60}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: '6s'
              }}
            >
              <div className="flex items-center space-x-2">
                <Brain className="w-4 h-4 text-yellow-400" />
                <span className="text-sm">Idea #{i + 1}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Success Stories Strip */}
      <div className="relative z-10 py-8 border-t border-white/10 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-center space-x-8 text-center">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-green-400" />
              <span className="text-sm">50,000+ Ideas Generated</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-400" />
              <span className="text-sm">4.9/5 Average Rating</span>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              <span className="text-sm">85% Success Rate</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const FormPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-blue-900 text-white flex items-center justify-center px-6">
      <div className="bg-gradient-to-r from-purple-600/20 to-yellow-600/20 backdrop-blur-lg rounded-3xl p-8 max-w-2xl w-full border border-white/10">
        <h2 className="text-3xl font-bold mb-8 text-center">Let's Spark Your Idea</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Choose Your Industry</label>
            <select 
              value={userInputs.industry}
              onChange={(e) => setUserInputs({...userInputs, industry: e.target.value})}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:border-yellow-400 transition-colors"
            >
              <option value="">Select Industry</option>
              <option value="tech">Technology</option>
              <option value="health">Health & Wellness</option>
              <option value="education">Education</option>
              <option value="finance">Finance</option>
              <option value="lifestyle">Lifestyle</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Your Interests & Skills</label>
            <input
              type="text"
              value={userInputs.interests}
              onChange={(e) => setUserInputs({...userInputs, interests: e.target.value})}
              placeholder="e.g., AI, cooking, fitness, design..."
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:border-yellow-400 transition-colors placeholder-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Business Goal</label>
            <select 
              value={userInputs.goal}
              onChange={(e) => setUserInputs({...userInputs, goal: e.target.value})}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:border-yellow-400 transition-colors"
            >
              <option value="">Select Goal</option>
              <option value="side-hustle">Side Hustle ($1K-5K/month)</option>
              <option value="startup">Startup (Scale potential)</option>
              <option value="passive">Passive Income</option>
              <option value="service">Service Business</option>
            </select>
          </div>

          <button
            onClick={generateIdea}
            disabled={!userInputs.industry || !userInputs.interests || !userInputs.goal}
            className="w-full bg-gradient-to-r from-purple-600 to-yellow-500 hover:from-purple-700 hover:to-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl"
          >
            <span className="flex items-center justify-center space-x-2">
              <Sparkles className="w-6 h-6" />
              <span>Generate My Idea</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );

  const GeneratingPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-blue-900 text-white flex items-center justify-center px-6">
      <div className="text-center">
        <div className="relative mb-8">
          <div className="w-32 h-32 mx-auto border-4 border-purple-500 border-t-yellow-400 rounded-full animate-spin"></div>
          <Brain className="w-16 h-16 text-yellow-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
        
        <h2 className="text-3xl font-bold mb-4">Crafting Your Perfect Idea...</h2>
        
        <div className="space-y-2 text-lg">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
            <span>🔍 Mining Market Data...</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
            <span>🧠 Analyzing Reddit Trends...</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
            <span>📈 Scanning Google Trends...</span>
          </div>
        </div>
      </div>
    </div>
  );

  const ResultPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-blue-900 text-white px-6 py-12">
      {showConfetti && <ConfettiAnimation />}
      
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-purple-400 bg-clip-text text-transparent">
            🎉 Your Golden Idea is Ready!
          </h2>
          <p className="text-xl text-gray-300">Here's your personalized business opportunity</p>
        </div>

        <div className="bg-gradient-to-r from-purple-600/20 to-yellow-600/20 backdrop-blur-lg rounded-3xl p-8 border border-white/10 transform hover:scale-105 transition-transform duration-300">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-purple-500 rounded-full flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-yellow-400">{generatedIdea?.name}</h3>
          </div>

          <p className="text-xl mb-6 text-gray-200 leading-relaxed">{generatedIdea?.description}</p>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white/5 rounded-lg p-6 border border-white/10">
              <div className="flex items-center space-x-2 mb-3">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <h4 className="font-bold text-green-400">Market Trend</h4>
              </div>
              <p className="text-gray-300">{generatedIdea?.trend}</p>
            </div>

            <div className="bg-white/5 rounded-lg p-6 border border-white/10">
              <div className="flex items-center space-x-2 mb-3">
                <DollarSign className="w-5 h-5 text-yellow-400" />
                <h4 className="font-bold text-yellow-400">Monetization</h4>
              </div>
              <p className="text-gray-300">{generatedIdea?.monetization}</p>
            </div>
          </div>

          <div className="bg-white/5 rounded-lg p-6 border border-white/10 mb-8">
            <div className="flex items-center space-x-2 mb-3">
              <Target className="w-5 h-5 text-purple-400" />
              <h4 className="font-bold text-purple-400">Reddit Signal</h4>
            </div>
            <p className="text-gray-300">{generatedIdea?.redditSignal}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={generateIdea}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-5 h-5" />
              <span>Generate Another Idea</span>
            </button>
            
            <button className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2">
              <Rocket className="w-5 h-5" />
              <span>Get Launch Kit</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="font-sans">
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
      
      {currentView === 'landing' && <LandingPage />}
      {currentView === 'form' && <FormPage />}
      {currentView === 'generating' && <GeneratingPage />}
      {currentView === 'result' && <ResultPage />}
    </div>
  );
};

export default IdeaSpark;