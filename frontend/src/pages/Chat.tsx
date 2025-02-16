import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Send,
  Brain,
  MessageSquare,
  Target,
  Clock,
  Loader2,
  AlertCircle,
  HelpCircle,
  User,
  Bot,
  XCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  status?: 'typing' | 'complete' | 'error';
  timestamp?: Date;
}

function Chat() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const stopGenerationRef = useRef(false);

  const suggestions = [
    "Help me create content for my campaign",
    "I need to analyze my campaign reports",
    "Can you help with A/B testing?",
    "What are the latest trends in digital marketing?",
    "How can I optimize my ad budget allocation?",
    "What is the role of AI in digital marketing?"
  ];

  const predefinedResponses: { [key: string]: string } = {
    "What are the latest trends in digital marketing?":
      "Emerging trends include AI-driven personalization, voice search optimization, influencer marketing growth, interactive content, and short-form video dominance.",
    "How can I optimize my ad budget allocation?":
      "Analyzing past campaign performance, audience behavior, and conversion rates can help optimize ad spend. Consider reallocating budget to high-performing channels while testing new platforms.",
    "What is the role of AI in digital marketing?":
      "AI helps with automation, personalized recommendations, predictive analytics, and chatbots to enhance customer engagement and decision-making."
  };

  useEffect(() => {
    scrollToBottom();
    if (messages.length === 0) {
      setMessages([{
        id: 'welcome',
        text: "👋 Hi! I'm your AdGenius AI. I can help you with content generation, reports analysis, and A/B testing. How can I assist you today?",
        sender: 'agent',
        status: 'complete',
        timestamp: new Date()
      }]);
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleNavigation = async (text: string) => {
    const lowerText = text.toLowerCase();
    let response = '';
    let redirectPath = '';

    if (lowerText.includes('content') || lowerText.includes('create') || lowerText.includes('generate')) {
      response = "I'll redirect you to our Content Generator tool where you can create engaging content for your campaigns.";
      redirectPath = '/content';
    } else if (lowerText.includes('report') || lowerText.includes('analysis') || lowerText.includes('analyze')) {
      response = "I'll take you to our Reports Analysis dashboard where you can view detailed campaign metrics.";
      redirectPath = '/reports';
    } else if (lowerText.includes('test') || lowerText.includes('a/b') || lowerText.includes('ab testing')) {
      response = "I'll redirect you to our A/B Testing tool where you can compare different campaign variations.";
      redirectPath = '/ab-testing';
    }

    if (redirectPath) {
      const agentMessage: Message = {
        id: Date.now().toString(),
        text: response,
        sender: 'agent',
        status: 'complete',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, agentMessage]);
      await new Promise(resolve => setTimeout(resolve, 1500));
      navigate(redirectPath);
    }

    return redirectPath;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    
    const hasRedirect = await handleNavigation(input);
    if (!hasRedirect) {
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: '',
        sender: 'agent',
        status: 'typing',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, agentMessage]);
      setInput('');
      setIsTyping(true);
      setIsGenerating(true);
      stopGenerationRef.current = false;

      try {
        // Simulate API response with predefined responses or default message
        const responseText = predefinedResponses[input] || "I understand you need help with that. Could you please specify if you'd like to create content, analyze reports, or perform A/B testing?";
        const bodyData = { product: input };
        const res = await fetch('http://127.0.0.1:8000/multi_agent_analysis', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bodyData)
        });      

        if (!res.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await res.json();

        const budgetAllocation = data.budget_allocation;
        const insightsReport = data.insights_report;

        const budgetText = Object.entries(budgetAllocation)
          .map(([channel, percentage]) => `- **${channel}:** ${percentage}%`)
          .join("\n");

        const formattedResponse = `\n\n${insightsReport}`;
        let currentText = '';
        for (let i = 0; i < formattedResponse.length; i++) {
          if (stopGenerationRef.current) break;
          await new Promise(resolve => setTimeout(resolve, 50));
          currentText += formattedResponse[i];

          setMessages(prev =>
            prev.map(msg =>
              msg.id === agentMessage.id ? { ...msg, text: currentText } : msg
            )
          );
        }

        setMessages(prev =>
          prev.map(msg =>
            msg.id === agentMessage.id ? { ...msg, status: 'complete' } : msg
          )
        );
      } catch (error) {
        setMessages(prev =>
          prev.map(msg =>
            msg.id === agentMessage.id
              ? { ...msg, status: 'error', text: "Sorry, there was an error processing your request." }
              : msg
          )
        );
      } finally {
        setIsTyping(false);
        setIsGenerating(false);
      }
    }
    
    setInput('');
  };

  const handleSuggestionClick = async (suggestion: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text: suggestion,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setShowSuggestions(false);
    
    const hasRedirect = await handleNavigation(suggestion);
    if (!hasRedirect) {
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: '',
        sender: 'agent',
        status: 'typing',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, agentMessage]);
      setIsTyping(true);
      setIsGenerating(true);
      stopGenerationRef.current = false;

      const response = predefinedResponses[suggestion] || "I understand you need help with that. Could you please specify if you'd like to create content, analyze reports, or perform A/B testing?";
      let currentText = '';
      for (let i = 0; i < response.length; i++) {
        if (stopGenerationRef.current) break;
        await new Promise(resolve => setTimeout(resolve, 50));
        currentText += response[i];
        setMessages(prev =>
          prev.map(msg =>
            msg.id === agentMessage.id ? { ...msg, text: currentText } : msg
          )
        );
      }

      setMessages(prev =>
        prev.map(msg =>
          msg.id === agentMessage.id ? { ...msg, status: 'complete' } : msg
        )
      );
      setIsTyping(false);
      setIsGenerating(false);
    }
  };

  const handleStopGeneration = () => {
    stopGenerationRef.current = true;
    setIsGenerating(false);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-gradient-to-br from-purple-50 to-indigo-50 p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Strategic Planning</h2>
        <button
          onClick={() => setShowSuggestions(!showSuggestions)}
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all"
        >
          <HelpCircle className="w-5 h-5 text-purple-600" />
          <span>Suggestions</span>
        </button>
      </div>

      {showSuggestions && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg p-4 mb-4"
        >
          <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Try asking about:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="text-left text-sm text-gray-600 p-2 rounded-lg hover:bg-purple-50 transition-colors flex items-center gap-2"
              >
                <Target className="w-4 h-4 text-purple-600" />
                {suggestion}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.map(message => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-start gap-3 ${
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.sender === 'agent' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                <Bot className="w-5 h-5 text-purple-600" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl p-4 ${
                message.sender === 'user'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white shadow-md'
              }`}
            >
              <p className="leading-relaxed">{message.text}</p>
              {message.status === 'typing' && (
                <div className="flex items-center gap-2 mt-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm text-gray-500">Typing...</span>
                </div>
              )}
              {message.status === 'error' && (
                <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>Error processing request. Please try again.</span>
                </div>
              )}
              {message.timestamp && (
                <div className="mt-2 text-xs text-gray-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {message.timestamp.toLocaleTimeString()}
                </div>
              )}
            </div>
            {message.sender === 'user' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
            )}
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your marketing campaign..."
          className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 pr-24 
                   shadow-sm transition-all duration-200
                   placeholder:text-gray-400
                   focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          disabled={isTyping}
        />
        <button
          type="submit"
          disabled={isTyping || !input.trim()}
          className="absolute right-12 top-1/2 -translate-y-1/2 p-2
                   rounded-xl bg-purple-600 text-white transition-all duration-200
                   hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
                   disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-5 h-5" />
        </button>
        {isGenerating && (
          <button
            type="button"
            onClick={handleStopGeneration}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2
                     rounded-xl bg-red-600 text-white transition-all duration-200
                     hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            <XCircle className="w-5 h-5" />
          </button>
        )}
      </form>
    </div>
  );
}

export default Chat;