import React, { useState, useEffect } from 'react';
import { Sparkles, Settings, Key, Shield, User, Save, Loader2, Trash2, Plus } from 'lucide-react';

const APIConfig = ({ onConfigSuccess }) => {
  const [config, setConfig] = useState({
    openai_api_key: '',
    reddit_client_id: '',
    reddit_client_secret: '',
    reddit_user_agent: ''
  });
  const [profileName, setProfileName] = useState('');
  const [savedProfiles, setSavedProfiles] = useState([]);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  // Load saved profiles on component mount
  useEffect(() => {
    const profiles = localStorage.getItem('ideaSparkProfiles');
    if (profiles) {
      setSavedProfiles(JSON.parse(profiles));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:8000/configure-api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      // If profile name is provided, save the profile
      if (profileName.trim()) {
        const newProfile = {
          name: profileName.trim(),
          config: { ...config },
          createdAt: new Date().toISOString()
        };

        const updatedProfiles = [...savedProfiles, newProfile];
        localStorage.setItem('ideaSparkProfiles', JSON.stringify(updatedProfiles));
        setSavedProfiles(updatedProfiles);
        setSuccess(`Profile "${profileName}" saved successfully!`);
        setProfileName('');
        setShowProfileForm(false);
      }

      onConfigSuccess();
    } catch (err) {
      console.error('Configuration error:', err);
      setError(err.message || 'Failed to configure API. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setConfig({
      ...config,
      [e.target.name]: e.target.value
    });
  };

  const loadProfile = (profile) => {
    setConfig(profile.config);
    setSuccess(`Profile "${profile.name}" loaded successfully!`);
    setTimeout(() => setSuccess(''), 3000);
  };

  const deleteProfile = (profileName) => {
    const updatedProfiles = savedProfiles.filter(p => p.name !== profileName);
    localStorage.setItem('ideaSparkProfiles', JSON.stringify(updatedProfiles));
    setSavedProfiles(updatedProfiles);
    setSuccess(`Profile "${profileName}" deleted successfully!`);
    setTimeout(() => setSuccess(''), 3000);
  };

  const clearForm = () => {
    setConfig({
      openai_api_key: '',
      reddit_client_id: '',
      reddit_client_secret: '',
      reddit_user_agent: ''
    });
    setProfileName('');
    setError('');
    setSuccess('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-blue-900 text-white flex items-center justify-center px-6 py-12">
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

      <div className="relative z-10 bg-gradient-to-r from-purple-600/20 to-yellow-600/20 backdrop-blur-lg rounded-3xl p-8 max-w-4xl w-full border border-white/10 shadow-2xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Sparkles className="w-8 h-8 text-yellow-400" />
            <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              IdeaSpark Setup
            </h2>
          </div>
          <p className="text-gray-300">Configure your API keys and save your profile for quick access</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Saved Profiles Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-yellow-400 flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Saved Profiles</span>
              </h3>
              <button
                onClick={() => setShowProfileForm(true)}
                className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-bold py-2 px-4 rounded-lg text-sm transition-all duration-300 transform hover:scale-105"
              >
                <Plus className="w-4 h-4" />
                <span>New Profile</span>
              </button>
            </div>

            {savedProfiles.length === 0 ? (
              <div className="bg-white/5 rounded-lg p-6 border border-white/10 text-center">
                <User className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-400">No saved profiles yet</p>
                <p className="text-sm text-gray-500 mt-2">Create your first profile to get started</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {savedProfiles.map((profile, index) => (
                  <div key={index} className="bg-white/10 rounded-lg p-4 border border-white/10 hover:bg-white/20 transition-all duration-300">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-white">{profile.name}</h4>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => loadProfile(profile)}
                          className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                        >
                          Load
                        </button>
                        <button
                          onClick={() => deleteProfile(profile.name)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400">
                      Created: {new Date(profile.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Configuration Form */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-purple-400 flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>API Configuration</span>
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center space-x-2">
                  <Key className="w-4 h-4" />
                  <span>OpenAI API Key</span>
                </label>
                <input
                  type="password"
                  name="openai_api_key"
                  value={config.openai_api_key}
                  onChange={handleChange}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:border-yellow-400 transition-colors text-white placeholder-gray-400"
                  placeholder="sk-..."
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span>Reddit Client ID</span>
                </label>
                <input
                  type="text"
                  name="reddit_client_id"
                  value={config.reddit_client_id}
                  onChange={handleChange}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:border-yellow-400 transition-colors text-white placeholder-gray-400"
                  placeholder="Your Reddit App Client ID"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span>Reddit Client Secret</span>
                </label>
                <input
                  type="password"
                  name="reddit_client_secret"
                  value={config.reddit_client_secret}
                  onChange={handleChange}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:border-yellow-400 transition-colors text-white placeholder-gray-400"
                  placeholder="Your Reddit App Secret"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center space-x-2">
                  <Settings className="w-4 h-4" />
                  <span>Reddit User Agent</span>
                </label>
                <input
                  type="text"
                  name="reddit_user_agent"
                  value={config.reddit_user_agent}
                  onChange={handleChange}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:border-yellow-400 transition-colors text-white placeholder-gray-400"
                  placeholder="IdeaSpark/1.0"
                />
              </div>

              {/* Profile Name Input */}
              {showProfileForm && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center space-x-2">
                    <Save className="w-4 h-4" />
                    <span>Profile Name (Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:border-yellow-400 transition-colors text-white placeholder-gray-400"
                    placeholder="e.g., Work Profile, Personal Account"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Leave empty to configure without saving
                  </p>
                </div>
              )}
              
              {error && (
                <div className="bg-red-500/20 border border-red-400/30 text-red-300 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-500/20 border border-green-400/30 text-green-300 px-4 py-3 rounded-lg text-sm">
                  {success}
                </div>
              )}
              
              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 group relative bg-gradient-to-r from-purple-600 to-yellow-500 hover:from-purple-700 hover:to-yellow-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="flex items-center justify-center space-x-2">
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Sparkles className="w-5 h-5" />
                    )}
                    <span>{loading ? 'Configuring...' : 'Configure & Continue'}</span>
                  </span>
                </button>
                
                <button
                  type="button"
                  onClick={clearForm}
                  className="bg-white/10 border border-white/20 text-white font-bold py-3 px-6 rounded-lg text-lg transition-all duration-300 hover:bg-white/20 hover:scale-105"
                >
                  Clear
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default APIConfig; 