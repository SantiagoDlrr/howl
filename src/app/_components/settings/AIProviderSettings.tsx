import React, { useState, useEffect, useCallback } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Settings,
  Save,
  TestTube,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Info
} from 'lucide-react';

/* ---------- Tipos ---------- */
interface ProviderInfo {
  info: string;
  models: string[];
  supportsAudio: boolean;
  needsApiKey: boolean;
  needsBaseUrl: boolean;
  defaultBaseUrl?: string;
}

interface AppSettings {
  ai_provider: string;
  api_key: string;
  base_url: string;
  llm_model: string;
  transcription_engine: string;
  temperature: number;
  max_tokens: number;
}

interface TestProviderResponse {
  success: boolean;
  supports_audio?: boolean;
  error?: string;
}

/* ---------- Componente ---------- */
const AIProviderSettings: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>({
    ai_provider: 'google',
    api_key: '',
    base_url: '',
    llm_model: 'gemini-1.5-flash',
    transcription_engine: 'ai_provider',
    temperature: 0.1,
    max_tokens: 4000
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [status, setStatus] = useState<
    { message: string; type: 'success' | 'error' | 'info' } | null
  >(null);
  const [isTestLoading, setIsTestLoading] = useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);

  /* ---------- Información de proveedores ---------- */
  const providerInfo: Record<string, ProviderInfo> = {
    google: {
      info: 'Google Gemini models. Get API key from Google AI Studio.',
      models: ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-1.0-pro'],
      supportsAudio: true,
      needsApiKey: true,
      needsBaseUrl: false
    },
    openai: {
      info: 'OpenAI models including GPT-4 and GPT-3.5. Get API key from OpenAI platform.',
      models: ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo', 'gpt-4o'],
      supportsAudio: true,
      needsApiKey: true,
      needsBaseUrl: false
    },
    claude: {
      info: 'Anthropic Claude models. Get API key from Anthropic Console. Note: No audio transcription support.',
      models: [
        'claude-3-opus-20240229',
        'claude-3-sonnet-20240229',
        'claude-3-haiku-20240307'
      ],
      supportsAudio: false,
      needsApiKey: true,
      needsBaseUrl: false
    },
    ollama: {
      info: 'Local Ollama installation. Make sure Ollama is running on your machine. No API key needed.',
      models: ['llama2', 'llama3', 'codellama', 'mistral', 'neural-chat'],
      supportsAudio: false,
      needsApiKey: false,
      needsBaseUrl: true,
      defaultBaseUrl: 'http://localhost:11434'
    },
    lm_studio: {
      info: 'LM Studio local server. Make sure LM Studio server is running. API key optional.',
      models: ['Custom models from LM Studio'],
      supportsAudio: false,
      needsApiKey: false,
      needsBaseUrl: true,
      defaultBaseUrl: 'http://localhost:1234/v1'
    },
    custom: {
      info: 'Custom OpenAI-compatible API endpoint. Provide your own base URL and credentials.',
      models: ['Depends on your custom API'],
      supportsAudio: false,
      needsApiKey: true,
      needsBaseUrl: true,
      defaultBaseUrl: 'https://your-custom-api.com/v1'
    }
  };

  /* ---------- Funciones memoizadas ---------- */
  const loadCurrentSettings = useCallback(async () => {
    try {
      const response = await fetch(`https://howlx.adriangaona.dev/settings`);
      if (!response.ok) throw new Error('Failed to load settings');

      const loaded = (await response.json()) as Partial<AppSettings>;
      setSettings(prev => ({ ...prev, ...loaded }));
      showStatus('Settings loaded successfully', 'success');
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Unknown error loading settings';
      console.error('Error loading settings:', message);
      showStatus('Failed to load current settings', 'error');
    }
  }, []);

  const updateFormFields = useCallback(() => {
    const info = providerInfo[settings.ai_provider];
    if (!info) return;

    setSettings(prev => ({
      ...prev,
      api_key: !info.needsApiKey ? 'not-needed' : prev.api_key,
      base_url: info.needsBaseUrl && !prev.base_url ? info.defaultBaseUrl ?? '' : prev.base_url,
      llm_model:
        info.models?.[0] &&
        info.models[0] !== 'Custom models from LM Studio' &&
        info.models[0] !== 'Depends on your custom API' &&
        !prev.llm_model
          ? info.models[0]
          : prev.llm_model
    }));
  }, [settings.ai_provider, providerInfo]);

  /* ---------- Efectos ---------- */
  useEffect(() => {
    loadCurrentSettings();
  }, [loadCurrentSettings]);

  useEffect(() => {
    updateFormFields();
  }, [updateFormFields]);

  /* ---------- Funciones ---------- */
  const showStatus = (
    message: string,
    type: 'success' | 'error' | 'info'
  ) => {
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

      const result: TestProviderResponse = await response.json();

      if (result.success) {
        showStatus(
          `✅ Connection successful! Audio support: ${result.supports_audio ? 'Yes' : 'No'}`,
          'success'
        );
      } else {
        showStatus(`❌ Connection failed: ${result.error}`, 'error');
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('Test error:', message);
      showStatus(`❌ Test failed: ${message}`, 'error');
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
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('Save error:', message);
      showStatus(`❌ Failed to save settings: ${message}`, 'error');
    } finally {
      setIsSaveLoading(false);
    }
  };

  const handleInputChange = (field: keyof AppSettings, value: string | number) => {
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

  const currentProviderInfo: ProviderInfo | null = providerInfo[settings.ai_provider] || null;

  /* ---------- JSX ---------- */
  return (
    <div className="min-h-screen p-5" onKeyDown={handleKeyDown}>
      <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
        <h1 className="text-center text-4xl font-light mb-8 bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
          🤖 AI Provider Settings
        </h1>

        {/* Selección del Proveedor */}
        <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
          <div className="flex items-center mb-4">
            <Settings className="w-5 h-5 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">AI Provider</h2>
          </div>
          
          <select
            value={settings.ai_provider}
            onChange={(e) => handleInputChange('ai_provider', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="google">Google Gemini</option>
            <option value="openai">OpenAI</option>
            <option value="claude">Anthropic Claude</option>
            <option value="ollama">Ollama (Local)</option>
            <option value="lm_studio">LM Studio</option>
            <option value="custom">Custom API</option>
          </select>

          {currentProviderInfo && (
            <div className="mt-4 p-4 bg-blue-100 rounded-lg">
              <div className="flex items-start">
                <Info className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-blue-800 text-sm">{currentProviderInfo?.info}</p>
                  <div className="mt-2 text-xs text-blue-600">
                    <span className="font-medium">Audio Support:</span> {currentProviderInfo?.supportsAudio ? '✅' : '❌'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Configuración del Modelo */}
        <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Model Configuration</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* API Key */}
            {currentProviderInfo?.needsApiKey && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  API Key *
                </label>
                <input
                  type="password"
                  value={settings.api_key}
                  onChange={(e) => handleInputChange('api_key', e.target.value)}
                  placeholder="Enter your API key"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                />
              </div>
            )}

            {/* Base URL */}
            {currentProviderInfo?.needsBaseUrl && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Base URL *
                </label>
                <input
                  type="url"
                  value={settings.base_url}
                  onChange={(e) => handleInputChange('base_url', e.target.value)}
                  placeholder={currentProviderInfo?.defaultBaseUrl || "Enter base URL"}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                />
              </div>
            )}

            {/* Model */}
            <div className={currentProviderInfo?.needsBaseUrl && currentProviderInfo?.needsApiKey ? 'md:col-span-2' : ''}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Model *
              </label>
              {currentProviderInfo && 
               currentProviderInfo.models.length > 1 && 
               currentProviderInfo.models[0] &&
               !currentProviderInfo.models[0].startsWith('Custom') && 
               !currentProviderInfo.models[0].startsWith('Depends') ? (
                <select
                  value={settings.llm_model}
                  onChange={(e) => handleInputChange('llm_model', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                >
                  {currentProviderInfo?.models.map((model) => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={settings.llm_model}
                  onChange={(e) => handleInputChange('llm_model', e.target.value)}
                  placeholder="Enter model name"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                />
              )}
            </div>
          </div>
        </div>

        {/* Configuración Avanzada */}
        <div className="mb-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
          <div 
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            <h2 className="text-xl font-semibold text-gray-800">Advanced Settings</h2>
            {showAdvanced ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>

          {showAdvanced && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transcription Engine
                </label>
                <select
                  value={settings.transcription_engine}
                  onChange={(e) => handleInputChange('transcription_engine', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                >
                  <option value="ai_provider">AI Provider</option>
                  <option value="whisper">OpenAI Whisper</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Temperature ({settings.temperature})
                </label>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={settings.temperature}
                  onChange={(e) => handleInputChange('temperature', parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Tokens
                </label>
                <input
                  type="number"
                  value={settings.max_tokens}
                  onChange={(e) => handleInputChange('max_tokens', parseInt(e.target.value))}
                  min="100"
                  max="32000"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
          )}
        </div>

        {/* Mensaje de Estado */}
        {status && (
          <div className={`mb-6 p-4 rounded-lg flex items-center ${
            status.type === 'success' ? 'bg-green-100 text-green-800' :
            status.type === 'error' ? 'bg-red-100 text-red-800' :
            'bg-blue-100 text-blue-800'
          }`}>
            {status.type === 'success' && <CheckCircle className="w-5 h-5 mr-2" />}
            {status.type === 'error' && <AlertCircle className="w-5 h-5 mr-2" />}
            {status.type === 'info' && <Info className="w-5 h-5 mr-2" />}
            <span>{status.message}</span>
          </div>
        )}

        {/* Botones de Acción */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={testProvider}
            disabled={isTestLoading}
            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isTestLoading ? (
              <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <TestTube className="w-5 h-5 mr-2" />
            )}
            {isTestLoading ? 'Testing...' : 'Test Connection'}
          </button>

          <button
            onClick={saveSettings}
            disabled={isSaveLoading}
            className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaveLoading ? (
              <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <Save className="w-5 h-5 mr-2" />
            )}
            {isSaveLoading ? 'Saving...' : 'Save Settings'}
          </button>
        </div>

        {/* Shortcuts Info */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 text-center">
            💡 Keyboard shortcuts: <kbd className="px-2 py-1 bg-gray-200 rounded text-xs">Ctrl+S</kbd> to save, 
            <kbd className="px-2 py-1 bg-gray-200 rounded text-xs ml-2">Ctrl+T</kbd> to test
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIProviderSettings;