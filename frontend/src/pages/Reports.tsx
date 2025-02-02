import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
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
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';
import {
  Upload,
  BarChart2,
  TrendingUp,
  PieChartIcon,
  AlertCircle,
  Plus,
  Target,
  DollarSign,
  Users,
  Activity,
  ArrowUp,
  ArrowDown,
  Lightbulb,
  Download,
  FileQuestion,
  CheckCircle,
  RefreshCw,
  Share2
} from 'lucide-react';

interface CampaignData {
  date: string;
  platform: string;
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  revenue: number;
}

interface MetricCard {
  title: string;
  value: string;
  change: number;
  icon: JSX.Element;
}

interface ValidationError {
  row: number;
  column: string;
  message: string;
}

interface OptimizationTip {
  title: string;
  description: string;
  icon: JSX.Element;
  impact: 'high' | 'medium' | 'low';
}

function Reports() {
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<CampaignData[]>([]);
  const [error, setError] = useState<string>('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<CampaignData>>({
    date: '',
    platform: '',
    impressions: 0,
    clicks: 0,
    conversions: 0,
    spend: 0,
    revenue: 0
  });
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const COLORS = ['#8b5cf6', '#c4b5fd', '#7c3aed', '#a78bfa', '#6d28d9'];
  const platforms = ['Facebook', 'Instagram', 'LinkedIn', 'Twitter'];

  const SAMPLE_DATA: CampaignData[] = [
    {
      date: '01-01-2024',
      platform: 'Facebook',
      impressions: 10000,
      clicks: 500,
      conversions: 50,
      spend: 1000,
      revenue: 2500
    },
    {
      date: '01-01-2024',
      platform: 'Instagram',
      impressions: 8000,
      clicks: 400,
      conversions: 40,
      spend: 800,
      revenue: 2000
    }
  ];

  // Helper function to format date to dd-mm-yyyy
  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-');
    return `${day}-${month}-${year}`;
  };

  // Helper function to parse dd-mm-yyyy to Date object
  const parseDate = (dateStr: string) => {
    const [day, month, year] = dateStr.split('-');
    return new Date(`${year}-${month}-${day}`);
  };

  const generateSampleCSV = () => {
    const headers = Object.keys(SAMPLE_DATA[0]).join(',');
    const rows = SAMPLE_DATA.map(row => 
      Object.values(row).join(',')
    ).join('\n');
    const csv = headers + '\n' + rows;

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'campaign_data_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const validateData = (data: any[]): ValidationError[] => {
    const errors: ValidationError[] = [];
    
    data.forEach((row, index) => {
      // Check date format
      if (!row.date || !/^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[012])-\d{4}$/.test(row.date)) {
        errors.push({
          row: index + 1,
          column: 'date',
          message: 'Invalid date format. Use DD-MM-YYYY'
        });
      } else {
        // Additional date validation
        const [day, month, year] = row.date.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        if (date.getDate() !== day || date.getMonth() !== month - 1 || date.getFullYear() !== year) {
          errors.push({
            row: index + 1,
            column: 'date',
            message: 'Invalid date. Please enter a valid date'
          });
        }
      }

      // Check platform
      if (!platforms.includes(row.platform)) {
        errors.push({
          row: index + 1,
          column: 'platform',
          message: `Invalid platform. Use one of: ${platforms.join(', ')}`
        });
      }

      // Check numeric values
      ['impressions', 'clicks', 'conversions', 'spend', 'revenue'].forEach(field => {
        if (typeof row[field] !== 'number' || row[field] < 0) {
          errors.push({
            row: index + 1,
            column: field,
            message: `Invalid ${field}. Must be a positive number`
          });
        }
      });

      // Check logical constraints
      if (row.clicks > row.impressions) {
        errors.push({
          row: index + 1,
          column: 'clicks',
          message: 'Clicks cannot exceed impressions'
        });
      }
      if (row.conversions > row.clicks) {
        errors.push({
          row: index + 1,
          column: 'conversions',
          message: 'Conversions cannot exceed clicks'
        });
      }
    });

    return errors;
  };

  const processCSV = useCallback((csv: string) => {
    const lines = csv.split('\n');
    const headers = lines[0].toLowerCase().split(',').map(header => header.trim());
    const requiredHeaders = ['date', 'platform', 'impressions', 'clicks', 'conversions', 'spend', 'revenue'];
    
    // Validate headers
    const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
    if (missingHeaders.length > 0) {
      throw new Error(`Missing required columns: ${missingHeaders.join(', ')}`);
    }

    return lines.slice(1)
      .filter(line => line.trim())
      .map(line => {
        const values = line.split(',');
        const entry: any = {};
        
        headers.forEach((header, index) => {
          const value = values[index]?.trim();
          if (header === 'date') {
            // Convert YYYY-MM-DD to DD-MM-YYYY if needed
            if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
              entry[header] = formatDate(value);
            } else {
              entry[header] = value;
            }
          } else if (header === 'platform') {
            entry[header] = value;
          } else {
            const numValue = Number(value);
            if (isNaN(numValue)) {
              throw new Error(`Invalid numeric value in column ${header}`);
            }
            entry[header] = numValue;
          }
        });
        
        return entry;
      });
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      setFile(files[0]);
      setError('');
      setValidationErrors([]);
      setUploadSuccess(false);

      try {
        const text = await files[0].text();
        const processedData = processCSV(text);
        const errors = validateData(processedData);

        if (errors.length > 0) {
          setValidationErrors(errors);
          setData([]);
          return;
        }

        setData(processedData);
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 3000);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error processing file');
        setData([]);
      }
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.date || !formData.platform) {
      setError('Please fill in all required fields');
      return;
    }

    setData(prev => [...prev, formData as CampaignData]);
    setFormData({
      date: '',
      platform: '',
      impressions: 0,
      clicks: 0,
      conversions: 0,
      spend: 0,
      revenue: 0
    });
    setShowForm(false);
    setError('');
  };

  const calculateMetrics = () => {
    if (data.length === 0) return [];

    const totalSpend = data.reduce((sum, item) => sum + item.spend, 0);
    const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
    const totalConversions = data.reduce((sum, item) => sum + item.conversions, 0);
    const totalClicks = data.reduce((sum, item) => sum + item.clicks, 0);

    const prevPeriodData = data.slice(0, Math.floor(data.length / 2));
    const currentPeriodData = data.slice(Math.floor(data.length / 2));

    const prevRevenue = prevPeriodData.reduce((sum, item) => sum + item.revenue, 0);
    const currentRevenue = currentPeriodData.reduce((sum, item) => sum + item.revenue, 0);
    const revenueChange = ((currentRevenue - prevRevenue) / prevRevenue) * 100;

    return [
      {
        title: 'Total Revenue',
        value: `$${totalRevenue.toLocaleString()}`,
        change: revenueChange,
        icon: <DollarSign className="w-6 h-6 text-green-500" />
      },
      {
        title: 'ROI',
        value: `${((totalRevenue - totalSpend) / totalSpend * 100).toFixed(2)}%`,
        change: 0,
        icon: <Target className="w-6 h-6 text-purple-500" />
      },
      {
        title: 'Conversions',
        value: totalConversions.toLocaleString(),
        change: 0,
        icon: <Users className="w-6 h-6 text-blue-500" />
      },
      {
        title: 'CTR',
        value: `${((totalClicks / data.reduce((sum, item) => sum + item.impressions, 0)) * 100).toFixed(2)}%`,
        change: 0,
        icon: <Activity className="w-6 h-6 text-orange-500" />
      }
    ];
  };

  const generateOptimizationTips = (): OptimizationTip[] => {
    if (!data.length) return [];

    const tips: OptimizationTip[] = [];
    
    // Calculate metrics for analysis
    const platformPerformance = data.reduce((acc, item) => {
      if (!acc[item.platform]) {
        acc[item.platform] = {
          spend: 0,
          revenue: 0,
          conversions: 0,
          clicks: 0,
          impressions: 0,
          dates: new Set<string>()
        };
      }
      acc[item.platform].spend += item.spend;
      acc[item.platform].revenue += item.revenue;
      acc[item.platform].conversions += item.conversions;
      acc[item.platform].clicks += item.clicks;
      acc[item.platform].impressions += item.impressions;
      acc[item.platform].dates.add(item.date);
      return acc;
    }, {} as Record<string, { 
      spend: number; 
      revenue: number; 
      conversions: number; 
      clicks: number; 
      impressions: number;
      dates: Set<string>;
    }>);

    // ROI Analysis
    const platformROIs = Object.entries(platformPerformance).map(([platform, metrics]) => ({
      platform,
      roi: (metrics.revenue - metrics.spend) / metrics.spend
    }));
    
    const bestROIPlatform = platformROIs.reduce((a, b) => a.roi > b.roi ? a : b);
    const worstROIPlatform = platformROIs.reduce((a, b) => a.roi < b.roi ? a : b);

    if (bestROIPlatform.roi > 0.5) {
      tips.push({
        title: 'Increase Budget Allocation',
        description: `${bestROIPlatform.platform} shows strong ROI of ${(bestROIPlatform.roi * 100).toFixed(1)}%. Consider increasing budget allocation to maximize returns.`,
        icon: <DollarSign className="w-6 h-6 text-green-500" />,
        impact: 'high'
      });
    }

    // Conversion Rate Optimization
    const platformCRs = Object.entries(platformPerformance).map(([platform, metrics]) => ({
      platform,
      cr: metrics.conversions / metrics.clicks
    }));

    const lowCRPlatform = platformCRs.find(p => p.cr < 0.02);
    if (lowCRPlatform) {
      tips.push({
        title: 'Improve Landing Pages',
        description: `${lowCRPlatform.platform} has a low conversion rate of ${(lowCRPlatform.cr * 100).toFixed(1)}%. Consider A/B testing landing pages and optimizing call-to-actions.`,
        icon: <Target className="w-6 h-6 text-blue-500" />,
        impact: 'high'
      });
    }

    // Click-Through Rate Analysis
    const platformCTRs = Object.entries(platformPerformance).map(([platform, metrics]) => ({
      platform,
      ctr: metrics.clicks / metrics.impressions
    }));

    const lowCTRPlatform = platformCTRs.find(p => p.ctr < 0.01);
    if (lowCTRPlatform) {
      tips.push({
        title: 'Creative Optimization',
        description: `${lowCTRPlatform.platform} shows low engagement with ${(lowCTRPlatform.ctr * 100).toFixed(2)}% CTR. Test new ad creatives and messaging to improve click-through rates.`,
        icon: <Activity className="w-6 h-6 text-purple-500" />,
        impact: 'medium'
      });
    }

    // Cost Analysis
    const platformCPAs = Object.entries(platformPerformance).map(([platform, metrics]) => ({
      platform,
      cpa: metrics.spend / metrics.conversions
    }));

    const highCPAPlatform = platformCPAs.find(p => p.cpa > 100);
    if (highCPAPlatform) {
      tips.push({
        title: 'Reduce Acquisition Costs',
        description: `${highCPAPlatform.platform} has a high CPA of $${highCPAPlatform.cpa.toFixed(2)}. Focus on targeting optimization and bid adjustments to reduce costs.`,
        icon: <TrendingUp className="w-6 h-6 text-orange-500" />,
        impact: 'medium'
      });
    }

    // Frequency Analysis
    const platformFrequency = Object.entries(platformPerformance).map(([platform, metrics]) => ({
      platform,
      frequency: metrics.impressions / metrics.dates.size // Average daily impressions
    }));

    const highFreqPlatform = platformFrequency.find(p => p.frequency > 5000);
    if (highFreqPlatform) {
      tips.push({
        title: 'Optimize Ad Frequency',
        description: `${highFreqPlatform.platform} shows high daily impression frequency (${Math.round(highFreqPlatform.frequency)}). Consider adjusting frequency caps to prevent ad fatigue.`,
        icon: <RefreshCw className="w-6 h-6 text-indigo-500" />,
        impact: 'medium'
      });
    }

    // Revenue per Click Analysis
    const platformRPCs = Object.entries(platformPerformance).map(([platform, metrics]) => ({
      platform,
      rpc: metrics.revenue / metrics.clicks
    }));

    const lowRPCPlatform = platformRPCs.find(p => p.rpc < 1.0);
    if (lowRPCPlatform) {
      tips.push({
        title: 'Improve Revenue per Click',
        description: `${lowRPCPlatform.platform} has low revenue per click ($${lowRPCPlatform.rpc.toFixed(2)}). Review pricing strategy and conversion funnel optimization.`,
        icon: <DollarSign className="w-6 h-6 text-emerald-500" />,
        impact: 'high'
      });
    }

    // Platform Diversification
    const totalSpend = Object.values(platformPerformance).reduce((sum, metrics) => sum + metrics.spend, 0);
    const platformShare = Object.entries(platformPerformance).map(([platform, metrics]) => ({
      platform,
      share: metrics.spend / totalSpend
    }));

    const dominantPlatform = platformShare.find(p => p.share > 0.7);
    if (dominantPlatform) {
      tips.push({
        title: 'Diversify Platform Mix',
        description: `${dominantPlatform.platform} accounts for ${(dominantPlatform.share * 100).toFixed(1)}% of spend. Consider testing other platforms to reduce dependency.`,
        icon: <Share2 className="w-6 h-6 text-pink-500" />,
        impact: 'medium'
      });
    }

    // Conversion Value Analysis
    const platformCVRs = Object.entries(platformPerformance).map(([platform, metrics]) => ({
      platform,
      avgValue: metrics.revenue / metrics.conversions
    }));

    const lowValuePlatform = platformCVRs.find(p => p.avgValue < 20);
    if (lowValuePlatform) {
      tips.push({
        title: 'Increase Conversion Value',
        description: `${lowValuePlatform.platform} has low average conversion value ($${lowValuePlatform.avgValue.toFixed(2)}). Focus on attracting higher-value customers.`,
        icon: <TrendingUp className="w-6 h-6 text-cyan-500" />,
        impact: 'high'
      });
    }

    return tips.slice(0, 4); // Return top 4 recommendations
  };

  const formatGuideText = `<!DOCTYPE html>
<html>
<head>
  <title>Campaign Data Format Guide</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      max-width: 800px;
      margin: 2rem auto;
      padding: 0 1rem;
      color: #1a1a1a;
    }
    h1 { color: #6d28d9; margin-bottom: 1.5rem; }
    h2 { color: #4c1d95; margin-top: 2rem; }
    .field { 
      background: #f5f3ff;
      padding: 1rem;
      border-radius: 0.5rem;
      margin-bottom: 1rem;
    }
    .field-name { 
      font-weight: bold;
      color: #6d28d9;
    }
    .example {
      background: #e5e7eb;
      padding: 1rem;
      border-radius: 0.5rem;
      font-family: monospace;
      white-space: pre;
      overflow-x: auto;
    }
    .note {
      border-left: 4px solid #6d28d9;
      padding-left: 1rem;
      margin: 1rem 0;
      color: #4b5563;
    }
  </style>
</head>
<body>
  <h1>Campaign Data Format Guide</h1>
  
  <div class="note">
    All data must be provided in CSV format with the following columns in order.
  </div>

  <h2>Required Fields</h2>
  
  <div class="field">
    <div class="field-name">date</div>
    <div>Format: DD-MM-YYYY</div>
    <div>Example: 01-01-2024</div>
  </div>

  <div class="field">
    <div class="field-name">platform</div>
    <div>Allowed values: Facebook, Instagram, LinkedIn, Twitter</div>
    <div>Example: Facebook</div>
  </div>

  <div class="field">
    <div class="field-name">impressions</div>
    <div>Type: Positive number</div>
    <div>Example: 10000</div>
  </div>

  <div class="field">
    <div class="field-name">clicks</div>
    <div>Type: Positive number</div>
    <div>Note: Must be less than or equal to impressions</div>
    <div>Example: 500</div>
  </div>

  <div class="field">
    <div class="field-name">conversions</div>
    <div>Type: Positive number</div>
    <div>Note: Must be less than or equal to clicks</div>
    <div>Example: 50</div>
  </div>

  <div class="field">
    <div class="field-name">spend</div>
    <div>Type: Positive number (in dollars)</div>
    <div>Example: 1000</div>
  </div>

  <div class="field">
    <div class="field-name">revenue</div>
    <div>Type: Positive number (in dollars)</div>
    <div>Example: 2500</div>
  </div>

  <h2>Example CSV</h2>
  
  <div class="example">date,platform,impressions,clicks,conversions,spend,revenue
01-01-2024,Facebook,10000,500,50,1000,2500
01-01-2024,Instagram,8000,400,40,800,2000</div>

  <div class="note">
    <strong>Important:</strong>
    <ul>
      <li>All headers must be included and match exactly (case-sensitive)</li>
      <li>Numbers must not include currency symbols or commas</li>
      <li>Dates must follow the DD-MM-YYYY format</li>
      <li>Platform names must match exactly as specified</li>
    </ul>
  </div>
</body>
</html>`;

  // Function to show format guide in a new window
  const showFormatGuide = () => {
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(formatGuideText);
      newWindow.document.close();
    }
  };

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <BarChart2 className="w-6 h-6 text-purple-600" />
              Campaign Analytics
            </h2>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Data Manually
            </button>
          </div>

          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-purple-50 rounded-lg"
            >
              <h3 className="text-lg font-semibold mb-4">Enter Campaign Data</h3>
              <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date (DD-MM-YYYY)</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={e => {
                      const formattedDate = e.target.value ? formatDate(e.target.value) : '';
                      setFormData(prev => ({ ...prev, date: formattedDate }));
                    }}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
                  <select
                    value={formData.platform}
                    onChange={e => setFormData(prev => ({ ...prev, platform: e.target.value }))}
                    className="w-full p-2 border rounded-lg"
                    required
                  >
                    <option value="">Select Platform</option>
                    {platforms.map(platform => (
                      <option key={platform} value={platform}>{platform}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Impressions</label>
                  <input
                    type="number"
                    value={formData.impressions}
                    onChange={e => setFormData(prev => ({ ...prev, impressions: Number(e.target.value) }))}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Clicks</label>
                  <input
                    type="number"
                    value={formData.clicks}
                    onChange={e => setFormData(prev => ({ ...prev, clicks: Number(e.target.value) }))}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Conversions</label>
                  <input
                    type="number"
                    value={formData.conversions}
                    onChange={e => setFormData(prev => ({ ...prev, conversions: Number(e.target.value) }))}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Spend ($)</label>
                  <input
                    type="number"
                    value={formData.spend}
                    onChange={e => setFormData(prev => ({ ...prev, spend: Number(e.target.value) }))}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Revenue ($)</label>
                  <input
                    type="number"
                    value={formData.revenue}
                    onChange={e => setFormData(prev => ({ ...prev, revenue: Number(e.target.value) }))}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <button
                    type="submit"
                    className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Add Data
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Upload Campaign Data (CSV)
              </label>
              <div className="flex gap-2">
                <button
                  onClick={generateSampleCSV}
                  className="flex items-center gap-2 px-3 py-1 text-sm bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download Template
                </button>
                <button
                  onClick={showFormatGuide}
                  className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <FileQuestion className="w-4 h-4" />
                  View Format Guide
                </button>
              </div>
            </div>
            <div className="flex items-center justify-center w-full">
              <label className="w-full flex flex-col items-center px-4 py-6 bg-purple-50 text-purple rounded-lg border-2 border-purple-300 border-dashed cursor-pointer hover:bg-purple-100">
                <Upload className="w-8 h-8 text-purple-600" />
                <span className="mt-2 text-base text-purple-600">
                  {file ? file.name : 'Drop your file here or click to upload'}
                </span>
                <span className="mt-1 text-sm text-purple-400">
                  CSV file with headers: date, platform, impressions, clicks, conversions, spend, revenue
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept=".csv"
                  onChange={handleFileUpload}
                />
              </label>
            </div>
          </div>

          {uploadSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 flex items-center gap-2 text-green-600 bg-green-50 p-4 rounded-lg"
            >
              <CheckCircle className="w-5 h-5" />
              <span>File uploaded and processed successfully!</span>
            </motion.div>
          )}

          {error && (
            <div className="mb-6 flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-lg">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          {validationErrors.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 bg-red-50 p-4 rounded-lg"
            >
              <div className="flex items-center gap-2 text-red-600 mb-2">
                <AlertCircle className="w-5 h-5" />
                <span className="font-semibold">Validation Errors</span>
              </div>
              <ul className="list-disc list-inside space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index} className="text-red-600">
                    Row {error.row}, {error.column}: {error.message}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {data.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                {calculateMetrics().map((metric, index) => (
                  <motion.div
                    key={metric.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white p-4 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">{metric.title}</p>
                        <p className="text-2xl font-bold text-gray-800">{metric.value}</p>
                      </div>
                      {metric.icon}
                    </div>
                    {metric.change !== 0 && (
                      <div className={`flex items-center gap-1 mt-2 ${metric.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {metric.change > 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                        <span className="text-sm">{Math.abs(metric.change).toFixed(1)}% vs prev. period</span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white p-4 rounded-lg border border-gray-200"
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                    Performance Trends
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(value) => value} // No need to format as it's already in DD-MM-YYYY
                      />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="revenue" stroke={COLORS[0]} name="Revenue" />
                      <Line type="monotone" dataKey="spend" stroke={COLORS[1]} name="Spend" />
                      <Line type="monotone" dataKey="conversions" stroke={COLORS[2]} name="Conversions" />
                    </LineChart>
                  </ResponsiveContainer>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white p-4 rounded-lg border border-gray-200"
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-purple-600" />
                    Platform Performance
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={data}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="platform" />
                      <PolarRadiusAxis />
                      <Radar name="ROI" dataKey="revenue" stroke={COLORS[0]} fill={COLORS[0]} fillOpacity={0.6} />
                      <Radar name="Conversions" dataKey="conversions" stroke={COLORS[1]} fill={COLORS[1]} fillOpacity={0.6} />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </motion.div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  Optimization Recommendations
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {generateOptimizationTips().map((tip, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white p-4 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-start gap-3">
                        {tip.icon}
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-gray-800">{tip.title}</h4>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              tip.impact === 'high' ? 'bg-red-100 text-red-600' :
                              tip.impact === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                              'bg-green-100 text-green-600'
                            }`}>
                              {tip.impact.toUpperCase()} IMPACT
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{tip.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default Reports;