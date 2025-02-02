import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Send, Sparkles, Target, AlertCircle } from 'lucide-react';

interface Platform {
  id: string;
  name: string;
  icon: JSX.Element;
}

function ContentGenerator() {
  const [prompt, setPrompt] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const platforms: Platform[] = [
    { id: 'facebook', name: 'Facebook', icon: <Target className="w-5 h-5" /> },
    { id: 'instagram', name: 'Instagram', icon: <Target className="w-5 h-5" /> },
    { id: 'linkedin', name: 'LinkedIn', icon: <Target className="w-5 h-5" /> },
    { id: 'twitter', name: 'Twitter', icon: <Target className="w-5 h-5" /> }
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || !selectedPlatform) {
      setError('Please fill in all fields');
      return;
    }

    setError('');
    setIsGenerating(true);
    setGeneratedContent('');

    try {
      const response = await fetch('http://localhost:3002/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          platform: selectedPlatform,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate content');
      }

      const data = await response.json();
      setGeneratedContent(data.content);
    } catch (err) {
      setError('Failed to generate content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <FileText className="w-6 h-6 text-purple-600" />
          Ad Content Generator
        </h2>

        <form onSubmit={handleGenerate} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Platform
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {platforms.map((platform) => (
                <button
                  key={platform.id}
                  type="button"
                  onClick={() => setSelectedPlatform(platform.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedPlatform === platform.id
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    {platform.icon}
                    <span className="text-sm font-medium">{platform.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What would you like to promote?
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full h-32 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Describe your product or service (e.g., 'A new fitness app that helps users track their workouts and nutrition')"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isGenerating || !prompt.trim() || !selectedPlatform}
            className="w-full bg-purple-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Sparkles className="w-5 h-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Generate Content
              </>
            )}
          </button>
        </form>

        {generatedContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 p-4 bg-purple-50 rounded-lg"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Generated Content:</h3>
            <div className="whitespace-pre-wrap text-gray-700 p-4 bg-white rounded-lg border border-purple-100">
              {generatedContent}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default ContentGenerator;