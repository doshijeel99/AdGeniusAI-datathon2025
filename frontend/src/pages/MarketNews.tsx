import React from 'react';
import { motion } from 'framer-motion';
import { Newspaper, TrendingUp, BarChart2, PieChart as PieChartIcon } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';

interface NewsArticle {
  title: string;
  description: string;
  source: string;
  date: string;
  category: string;
}

interface MarketTrend {
  title: string;
  description: string;
  impact: 'positive' | 'negative' | 'neutral';
  category: string;
}

function MarketNews() {
  // Static news data
  const staticNews: NewsArticle[] = [
    {
      title: "AI Revolution in Digital Marketing",
      description: "How artificial intelligence is transforming digital marketing strategies and customer engagement in 2024.",
      source: "Marketing Weekly",
      date: "2024-03-15",
      category: "Technology"
    },
    {
      title: "Social Commerce Trends 2024",
      description: "The rise of social shopping and its impact on e-commerce platforms and consumer behavior.",
      source: "Digital Trends",
      date: "2024-03-14",
      category: "E-commerce"
    },
    {
      title: "Video Marketing Statistics",
      description: "Latest statistics show 85% increase in video content consumption across marketing channels.",
      source: "Marketing Insights",
      date: "2024-03-13",
      category: "Content"
    },
    {
      title: "Sustainable Marketing Practices",
      description: "Companies adopting eco-friendly marketing strategies see 40% increase in brand loyalty.",
      source: "Green Business Today",
      date: "2024-03-12",
      category: "Sustainability"
    },
    {
      title: "Mobile Marketing Optimization",
      description: "Best practices for optimizing marketing campaigns for mobile-first consumers in 2024.",
      source: "Mobile Marketing Daily",
      date: "2024-03-11",
      category: "Mobile"
    },
    {
      title: "Influencer Marketing ROI",
      description: "New study reveals key metrics for measuring influencer marketing success and ROI.",
      source: "Marketing Analytics",
      date: "2024-03-10",
      category: "Social Media"
    }
  ];

  // Marketing channel performance data
  const channelData = [
    { name: 'Social Media', value: 35 },
    { name: 'Email', value: 25 },
    { name: 'SEO', value: 20 },
    { name: 'PPC', value: 15 },
    { name: 'Content', value: 5 }
  ];

  // Monthly engagement data
  const engagementData = [
    { month: 'Jan', social: 4000, email: 2400, seo: 2400 },
    { month: 'Feb', social: 3000, email: 1398, seo: 2210 },
    { month: 'Mar', social: 2000, email: 9800, seo: 2290 },
    { month: 'Apr', social: 2780, email: 3908, seo: 2000 },
    { month: 'May', social: 1890, email: 4800, seo: 2181 },
    { month: 'Jun', social: 2390, email: 3800, seo: 2500 }
  ];

  // Campaign performance data
  const campaignData = [
    { name: 'Email', current: 4000, previous: 2400 },
    { name: 'Social', current: 3000, previous: 1398 },
    { name: 'Display', current: 2000, previous: 9800 },
    { name: 'Search', current: 2780, previous: 3908 },
    { name: 'Video', current: 1890, previous: 4800 }
  ];

  const COLORS = ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#f59e0b'];

  // Static market trends data
  const marketTrends: MarketTrend[] = [
    {
      title: 'Rise of Social Commerce',
      description: 'Social media platforms are increasingly becoming direct shopping channels, with integrated checkout features and shoppable posts.',
      impact: 'positive',
      category: 'E-commerce'
    },
    {
      title: 'Privacy-First Marketing',
      description: 'With the phase-out of third-party cookies, brands are shifting towards first-party data and privacy-compliant targeting methods.',
      impact: 'neutral',
      category: 'Digital Marketing'
    },
    {
      title: 'AI-Driven Personalization',
      description: 'Advanced AI algorithms are enabling hyper-personalized customer experiences across marketing channels.',
      impact: 'positive',
      category: 'Technology'
    },
    {
      title: 'Sustainability Focus',
      description: 'Consumers are increasingly favoring brands with strong environmental and social responsibility initiatives.',
      impact: 'positive',
      category: 'Consumer Behavior'
    }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Market News Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <Newspaper className="w-8 h-8 text-purple-600" />
            <h1 className="text-2xl font-bold text-gray-800">Market News</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {staticNews.map((article, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-purple-600">{article.source}</span>
                    <span className="text-xs px-2 py-1 bg-purple-50 text-purple-600 rounded-full">
                      {article.category}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">{article.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{article.description}</p>
                  <div className="text-sm text-gray-500">
                    {new Date(article.date).toLocaleDateString()}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Marketing Analytics Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Channel Distribution */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <PieChartIcon className="w-6 h-6 text-purple-600" />
              <h2 className="text-xl font-bold text-gray-800">Channel Distribution</h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={channelData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {channelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Monthly Engagement */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-6 h-6 text-purple-600" />
              <h2 className="text-xl font-bold text-gray-800">Monthly Engagement</h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="social" stroke="#8b5cf6" />
                <Line type="monotone" dataKey="email" stroke="#ec4899" />
                <Line type="monotone" dataKey="seo" stroke="#3b82f6" />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Campaign Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6 md:col-span-2"
          >
            <div className="flex items-center gap-3 mb-6">
              <BarChart2 className="w-6 h-6 text-purple-600" />
              <h2 className="text-xl font-bold text-gray-800">Campaign Performance</h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={campaignData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="current" name="Current Period" fill="#8b5cf6" />
                <Bar dataKey="previous" name="Previous Period" fill="#e9d5ff" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Market Trends Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-8 h-8 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-800">Market Trends & Insights</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {marketTrends.map((trend, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 rounded-lg p-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="inline-block px-3 py-1 rounded-full text-sm font-medium mb-2"
                      style={{
                        backgroundColor: trend.impact === 'positive' ? '#dcfce7' : 
                                       trend.impact === 'negative' ? '#fee2e2' : '#f3f4f6',
                        color: trend.impact === 'positive' ? '#166534' : 
                               trend.impact === 'negative' ? '#991b1b' : '#374151'
                      }}
                    >
                      {trend.category}
                    </span>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{trend.title}</h3>
                    <p className="text-gray-600">{trend.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default MarketNews; 