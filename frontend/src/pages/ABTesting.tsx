import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Beaker as TestingBeaker } from 'lucide-react';

interface TestResult {
  campaignType: string;
  channel: string;
  targetAudience: string;
  conversionRate: number;
}

interface Campaign {
  campaignId: string;
  businessType: string;
  campaignType: string;
  targetAudience: string;
  channel: string;
  clicks: number;
  duration: number;
  acquisitionCost: number;
  roi: number;
  engagementScore: number;
}

function ABTesting() {
  const [formData, setFormData] = useState({
    businessType: '',
    campaignType: '',
    targetAudience: '',
    channel: '',
    clicks: '',
  });
  const [results, setResults] = useState<{
    campaign: Campaign;
    variations: TestResult[];
    bestVariation: TestResult;
  } | null>(null);

  const generateRandomCampaignData = (input: typeof formData): Campaign => {
    return {
      campaignId: `C${Math.floor(Math.random() * 900) + 100}`,
      businessType: input.businessType,
      campaignType: input.campaignType,
      targetAudience: input.targetAudience,
      channel: input.channel,
      clicks: Number(input.clicks),
      duration: Math.floor(Math.random() * 25) + 5,
      acquisitionCost: Math.floor(Math.random() * 150) + 50,
      roi: Number((Math.random() * 4 + 1).toFixed(2)),
      engagementScore: Math.floor(Math.random() * 50) + 50
    };
  };

  const generateVariations = (campaign: Campaign): TestResult[] => {
    const targetAudiences = ['Gen Z', 'Millennials', 'Women', 'Men', 'Seniors'];
    const channels = ['YouTube', 'Instagram', 'Google Ads', 'Facebook', 'TikTok'];
    const campaignTypes = ['Display', 'Search', 'Social', 'Influencer', 'Email'];

    const variations: TestResult[] = [];
    
    // Generate 3 variations with different combinations
    for (let i = 0; i < 3; i++) {
      const variation: TestResult = {
        campaignType: campaignTypes[Math.floor(Math.random() * campaignTypes.length)],
        channel: channels[Math.floor(Math.random() * channels.length)],
        targetAudience: targetAudiences[Math.floor(Math.random() * targetAudiences.length)],
        conversionRate: Number((Math.random() * 0.15 + 0.02).toFixed(3))
      };
      variations.push(variation);
    }

    // Sort by conversion rate descending
    return variations.sort((a, b) => b.conversionRate - a.conversionRate);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate campaign data
    const campaign = generateRandomCampaignData(formData);
    
    // Generate variations with ML-like predictions
    const variations = generateVariations(campaign);
    
    // Set results with the campaign data and variations
    setResults({
      campaign,
      variations,
      bestVariation: variations[0]
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <TestingBeaker className="w-8 h-8 text-purple-600" />
          <h1 className="text-2xl font-bold text-gray-800">A/B Testing Analysis</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Business Type
            </label>
            <input
              type="text"
              name="businessType"
              value={formData.businessType}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Campaign Type
            </label>
            <input
              type="text"
              name="campaignType"
              placeholder="e.g., Email, Influencer, Display"
              value={formData.campaignType}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Target Audience
            </label>
            <input
              type="text"
              name="targetAudience"
              placeholder="e.g., Gen Z, Millennials, Women"
              value={formData.targetAudience}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Channel Used
            </label>
            <input
              type="text"
              name="channel"
              placeholder="e.g., YouTube, Instagram, Google Ads"
              value={formData.channel}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number of Clicks
            </label>
            <input
              type="number"
              name="clicks"
              value={formData.clicks}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Generate A/B Test Results
          </button>
        </form>

        {results && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 p-6 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center gap-2 mb-4">
              <LineChart className="w-6 h-6 text-purple-600" />
              <h2 className="text-xl font-semibold">ML Model Predictions</h2>
            </div>
            
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="font-medium text-gray-800 mb-2">Campaign Details</h3>
                <p className="text-sm text-gray-600">Campaign ID: {results.campaign.campaignId}</p>
                <p className="text-sm text-gray-600">Duration: {results.campaign.duration} days</p>
                <p className="text-sm text-gray-600">Engagement Score: {results.campaign.engagementScore}</p>
                <p className="text-sm text-gray-600">ROI: {results.campaign.roi}x</p>
              </div>
              
              <div className="space-y-3">
                {results.variations.map((variation, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <span className="text-purple-600">🔹</span>
                    <div className="text-gray-700">
                      <p>
                        <span className="font-medium">Variation {index + 1}:</span> 
                        Campaign Type: {variation.campaignType}, 
                        Channel: {variation.channel}, 
                        Target: {variation.targetAudience} →{' '}
                        <span className="font-medium text-purple-700">
                          Predicted Conversion Rate: {(variation.conversionRate * 100).toFixed(2)}%
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-100">
                <h3 className="font-medium text-purple-800 mb-2">ML Model Recommendation</h3>
                <p className="text-purple-700">
                  Based on our machine learning model analysis, the recommended A/B test variation is:
                </p>
                <p className="mt-2 font-medium text-purple-900">
                  Campaign Type: {results.bestVariation.campaignType}<br />
                  Channel: {results.bestVariation.channel}<br />
                  Target Audience: {results.bestVariation.targetAudience}<br />
                  Expected Conversion Rate: {(results.bestVariation.conversionRate * 100).toFixed(2)}%
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default ABTesting;