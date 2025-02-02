# market_trends_agent.py
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from llm_open_source import HuggingFaceLLM
from pytrends.request import TrendReq
import pandas as pd

class MarketTrendsAgent:
    def __init__(self):
        self.llm = HuggingFaceLLM(model_name="tiiuae/falcon-7b-instruct", max_length=256, temperature=0.3)
        self.pytrends = TrendReq(hl="en-US", tz=360)  # Initialize Pytrends
        
        self.prompt_template = PromptTemplate(
            input_variables=["trend_data"],
            template=(
                "You are a market analyst specializing in digital marketing trends. Based on the following Google Trends data:\n\n"
                "{trend_data}\n\n"
                "Analyze current market shifts, emerging platforms, and consumer behavior trends. "
                "Provide insights on how these trends impact digital marketing strategies and suggest actionable recommendations."
            )
        )
        self.chain = LLMChain(llm=self.llm, prompt=self.prompt_template)
    
    def get_trends(self, keywords=["digital marketing", "AI marketing", "SEO", "influencer marketing"]) -> str:
        """Fetches Google Trends data for given keywords and analyzes trends."""
        self.pytrends.build_payload(keywords, cat=0, timeframe="today 12-m", geo="", gprop="")  
        trend_data = self.pytrends.interest_over_time()

        if trend_data.empty:
            return "No trend data available. Try different keywords."

        trend_summary = trend_data.drop(columns=["isPartial"]).describe().to_string()
        response = self.chain.run(trend_data=trend_summary)
        return response

if __name__ == "__main__":
    agent = MarketTrendsAgent()
    trends = agent.get_trends()
    print("=== Market Trends Analysis ===")
    print(trends)
