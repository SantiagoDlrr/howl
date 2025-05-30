import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Settings, Save, TestTube, RefreshCw, AlertCircle, CheckCircle, Info } from 'lucide-react';

interface ProviderInfo {
  info: string;
  models: string[];
  supportsAudio: boolean;
  needsApiKey: boolean;
  needsBaseUrl: boolean;
  defaultBaseUrl?: string;
}

interface Settings {
  ai_provider: string;
  api_key: string;
  base_url: string;
  llm_model: string;
  transcription_engine: string;
  temperature: number;
  max_tokens: number;
}

const AIProviderSettings: React.FC = () => {
  const [settings, setSettings] = useState<Settings>({
    ai_provider: 'google',
    api_key: '',
    base_url: '',
    llm_model: 'gemini-1.5-flash',
    transcription_engine: 'ai_provider',
    temperature: 0.1,
    max_tokens: 4000
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [status, setStatus] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [isTestLoading, setIsTestLoading] = useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);

  const API_BASE = typeof window !== 'undefined' ? window.location.origin : '';

  const providerInfo: Record<string, ProviderInfo> = {
    google: {
      info: "Google Gemini models. Get API key from Google AI Studio.",
      models: ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-1.0-pro"],
      supportsAudio: true,
      needsApiKey: true,
      needsBaseUrl: false
    },
    openai: {
      info: "OpenAI models including GPT-4 and GPT-3.5. Get API key from OpenAI platform.",
      models: ["gpt-4", "gpt-4-turbo", "gpt-3.5-turbo", "gpt-4o"],
      supportsAudio: true,
      needsApiKey: true,
      needsBaseUrl: false
    },
    claude: {
      info: "Anthropic Claude models. Get API key from Anthropic Console. Note: No audio transcription support.",
      models: ["claude-3-opus-20240229", "claude-3-sonnet-20240229", "claude-3-haiku-20240307"],
      supportsAudio: false,
      needsApiKey: true,
      needsBaseUrl: false
    },
    ollama: {
      info: "Local Ollama installation. Make sure Ollama is running on your machine. No API key needed.",
      models: ["llama2", "llama3", "codellama", "mistral", "neural-chat"],
      supportsAudio: false,
      needsApiKey: false,
      needsBaseUrl: true,
      defaultBaseUrl: "http://localhost:11434"
    },
    lm_studio: {
      info: "LM Studio local server. Make sure LM Studio server is running. API key optional.",
      models: ["Custom models from LM Studio"],
      supportsAudio: false,
      needsApiKey: false,
      needsBaseUrl: true,
      defaultBaseUrl: "http://localhost:1234/v1"
    },
    custom: {
      info: "Custom OpenAI-compatible API endpoint. Provide your own base URL and credentials.",
      models: ["Depends on your custom API"],
      supportsAudio: false,
      needsApiKey: true,
      needsBaseUrl: true,
      defaultBaseUrl: "https://your-custom-api.com/v1"
    }
  };

  useEffect(() => {
    loadCurrentSettings();
  }, []);

  useEffect(() => {
    updateFormFields();
  }, [settings.ai_provider]);

  const loadCurrentSettings = async () => {
    try {
      const response = await fetch(`https://howlx.adriangaona.dev/settings`);
      if (!response.ok) throw new Error('Failed to load settings');
      
      const loadedSettings = await response.json();
      setSettings({
        ai_provider: loadedSettings.ai_provider || 'google',
        api_key: loadedSettings.api_key || '',
        base_url: loadedSettings.base_url || '',
        llm_model: loadedSettings.llm_model || 'gemini-1.5-flash',
        transcription_engine: loadedSettings.transcription_engine || 'ai_provider',
        temperature: loadedSettings.temperature || 0.1,
        max_tokens: loadedSettings.max_tokens || 4000
      });
      
      showStatus('Settings loaded successfully', 'success');
    } catch (error) {
      console.error('Error loading settings:', error);
      showStatus('Failed to load current settings', 'error');
    }
  };

  const updateFormFields = () => {
    const info = providerInfo[settings.ai_provider];
    
    if (info) {
      if (!info.needsApiKey) {
        setSettings(prev => ({ ...prev, api_key: 'not-needed' }));
      }
      
      if (info.needsBaseUrl && info.defaultBaseUrl && !settings.base_url) {
        setSettings(prev => ({ ...prev, base_url: info.defaultBaseUrl || '' }));
      }
      
      if (info.models && info.models.length > 0 && 
          info.models[0] !== "Custom models from LM Studio" && 
          info.models[0] !== "Depends on your custom API" &&
          !settings.llm_model) {
        setSettings(prev => ({ ...prev, llm_model: info.models[0] || 'gemini-1.5-flash' }));
      }
    }
  };

  const showStatus = (message: string, type: 'success' | 'error' | 'info') => {
    setStatus({ message, type });
    
    if (type === 'success') {
      setTimeout(() => setStatus(null), 5000);
    }
  };

  const testProvider = async () => {
    if (!settings.ai_provider || !settings.llm_model) {
      showStatus('Please fill in provider and model name', 'error');
      return;
    }
    
    if (providerInfo[settings.ai_provider]?.needsApiKey && !settings.api_key) {
      showStatus('API key is required for this provider', 'error');
      return;
    }
    
    try {
      setIsTestLoading(true);
      showStatus('Testing connection...', 'info');
      
      const response = await fetch(`https://howlx.adriangaona.dev/test_provider`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: settings.ai_provider,
          api_key: settings.api_key,
          model_name: settings.llm_model,
          base_url: settings.base_url || null
        })
      });
      
      if (!response.ok) throw new Error('Test request failed');
      
      const result = await response.json();
      
      if (result.success) {
        showStatus(`✅ Connection successful! Audio support: ${result.supports_audio ? 'Yes' : 'No'}`, 'success');
      } else {
        showStatus(`❌ Connection failed: ${result.error}`, 'error');
      }
    } catch (error: any) {
      console.error('Test error:', error);
      showStatus(`❌ Test failed: ${error.message}`, 'error');
    } finally {
      setIsTestLoading(false);
    }
  };

  const saveSettings = async () => {
    if (!settings.ai_provider || !settings.llm_model) {
      showStatus('Please fill in all required fields', 'error');
      return;
    }
    
    if (providerInfo[settings.ai_provider]?.needsApiKey && !settings.api_key) {
      showStatus('API key is required for this provider', 'error');
      return;
    }
    
    try {
      setIsSaveLoading(true);
      showStatus('Saving settings...', 'info');
      
      const response = await fetch(`https://howlx.adriangaona.dev/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      
      if (!response.ok) throw new Error('Failed to save settings');
      
      showStatus('✅ Settings saved successfully!', 'success');
      
      setTimeout(() => {
        showStatus('Settings saved. You can now test the connection.', 'info');
      }, 2000);
    } catch (error: any) {
      console.error('Save error:', error);
      showStatus(`❌ Failed to save settings: ${error.message}`, 'error');
    } finally {
      setIsSaveLoading(false);
    }
  };

  const handleInputChange = (field: keyof Settings, value: string | number) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      saveSettings();
    }
    if (e.ctrlKey && e.key === 't') {
      e.preventDefault();
      testProvider();
    }
  };

  const currentProviderInfo = providerInfo[settings.ai_provider];

  return (
    <div className="min-h-screen  p-5" onKeyDown={handleKeyDown}>
      <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
        <h1 className="text-center text-4xl font-light mb-8 bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
          🤖 AI Provider Settings
        </h1>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* AI Provider Settings */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <h3 className="text-xl font-semibold mb-5 pb-2 border-b-2 border-purple-600 text-gray-700">
              🔌 AI Provider
            </h3>

            <div className="space-y-5">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-600">
                  Provider
                </label>
                <select
                  value={settings.ai_provider}
                  onChange={(e) => handleInputChange('ai_provider', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:border-purple-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100 transition-all"
                  required
                >
                  <option value="google">Google Gemini</option>
                  <option value="openai">OpenAI</option>
                  <option value="claude">Anthropic Claude</option>
                  <option value="ollama">Ollama (Local)</option>
                  <option value="lm_studio">LM Studio (Local)</option>
                  <option value="custom">Custom API</option>
                </select>

                {currentProviderInfo && (
                  <div className="mt-3 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
                    <strong> {currentProviderInfo.info}</strong><br />
                     Audio Support: {currentProviderInfo.supportsAudio ? '✅ Yes' : '❌ No'}<br />
                     API Key Required: {currentProviderInfo.needsApiKey ? '✅ Yes' : '❌ No'}<br />
                     Custom URL: {currentProviderInfo.needsBaseUrl ? '✅ Yes' : '❌ No'}
                  </div>
                )}
              </div>

              {currentProviderInfo?.needsApiKey && (
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-600">
                    API Key
                  </label>
                  <input
                    type="password"
                    value={settings.api_key}
                    onChange={(e) => handleInputChange('api_key', e.target.value)}
                    placeholder="Enter your API key"
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:border-purple-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100 transition-all"
                  />
                </div>
              )}

              {currentProviderInfo?.needsBaseUrl && (
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-600">
                    Base URL
                  </label>
                  <input
                    type="url"
                    value={settings.base_url}
                    onChange={(e) => handleInputChange('base_url', e.target.value)}
                    placeholder={currentProviderInfo.defaultBaseUrl || 'http://localhost:11434'}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:border-purple-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100 transition-all"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Model Settings */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <h3 className="text-xl font-semibold mb-5 pb-2 border-b-2 border-purple-600 text-gray-700">
              🧠 Model Configuration
            </h3>

            <div className="space-y-5">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-600">
                  Model Name
                </label>
                <input
                  type="text"
                  value={settings.llm_model}
                  onChange={(e) => handleInputChange('llm_model', e.target.value)}
                  placeholder="gemini-1.5-flash"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:border-purple-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-600">
                  Transcription Engine
                </label>
                <select
                  value={settings.transcription_engine}
                  onChange={(e) => handleInputChange('transcription_engine', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:border-purple-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100 transition-all"
                >
                  <option value="ai_provider">Use AI Provider</option>
                  <option value="whisperx">WhisperX (Local)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Settings */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mb-6">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full flex items-center justify-between p-3 border-b border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <span className="flex items-center gap-2 text-purple-600 font-medium">
              <Settings className="w-5 h-5" />
              Advanced Settings
            </span>
            {showAdvanced ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>

          {showAdvanced && (
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-600">
                  Temperature (0.0 - 2.0)
                </label>
                <input
                  type="number"
                  value={settings.temperature}
                  onChange={(e) => handleInputChange('temperature', parseFloat(e.target.value))}
                  min="0"
                  max="2"
                  step="0.1"
                  title="Controls randomness: 0.0 = deterministic, 1.0 = creative"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:border-purple-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100 transition-all"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-600">
                  Max Tokens
                </label>
                <input
                  type="number"
                  value={settings.max_tokens}
                  onChange={(e) => handleInputChange('max_tokens', parseInt(e.target.value))}
                  min="100"
                  max="8000"
                  title="Maximum response length in tokens"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:border-purple-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100 transition-all"
                />
              </div>
            </div>
          )}
        </div>

        {/* Status Message */}
        {status && (
          <div className={`p-4 rounded-lg mb-6 flex items-center gap-3 ${
            status.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' :
            status.type === 'error' ? 'bg-red-100 text-red-800 border border-red-200' :
            'bg-blue-100 text-blue-800 border border-blue-200'
          }`}>
            {status.type === 'success' && <CheckCircle className="w-5 h-5" />}
            {status.type === 'error' && <AlertCircle className="w-5 h-5" />}
            {status.type === 'info' && <Info className="w-5 h-5" />}
            <span className="font-medium">{status.message}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            type="button"
            onClick={testProvider}
            disabled={isTestLoading}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-full font-semibold uppercase tracking-wide text-sm hover:shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <TestTube className="w-5 h-5" />
            Test Connection
            {isTestLoading && (
              <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin ml-2" />
            )}
          </button>

          <button
            type="button"
            onClick={saveSettings}
            disabled={isSaveLoading}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-full font-semibold uppercase tracking-wide text-sm hover:shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Save className="w-5 h-5" />
            Save Settings
            {isSaveLoading && (
              <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin ml-2" />
            )}
          </button>

          <button
            type="button"
            onClick={loadCurrentSettings}
            className="px-6 py-3 bg-white text-purple-600 border-2 border-purple-600 rounded-full font-semibold uppercase tracking-wide text-sm hover:bg-purple-600 hover:text-white hover:shadow-lg transform hover:-translate-y-0.5 transition-all flex items-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Reset to Current
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIProviderSettings;