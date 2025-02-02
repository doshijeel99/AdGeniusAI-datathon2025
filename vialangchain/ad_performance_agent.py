# ad_performance_agent.py
import pandas as pd
from langchain.prompts import PromptTemplate
from langchain.schema.runnable import RunnableLambda
from llm_open_source import HuggingFaceLLM

class AdPerformanceAgent:
    def __init__(self, csv_path: str):
        self.csv_path = csv_path
        self.data = pd.read_csv(csv_path, delimiter="\t")  # Ensure correct delimiter
        
        # Initialize Falcon-7B with 4-bit quantization
        self.llm = HuggingFaceLLM(model_name="tiiuae/falcon-7b-instruct", max_length=256, temperature=0.3)
        
        # LangChain's new API with RunnableLambda
        self.prompt_template = PromptTemplate(
            input_variables=["data_summary"],
            template=(
                "Analyze the following ad performance data and provide recommendations:\n\n"
                "{data_summary}\n\n"
                "Focus on click-through rates, conversion opportunities, and audience targeting improvements."
            )
        )
        self.chain = self.prompt_template | RunnableLambda(self.llm._call)  # Use new Runnable format
    
    def analyze(self) -> str:
        """Analyze ad performance using Falcon-7B."""
        summary = self.data.describe(include='all').to_string()
        response = self.chain.invoke({"data_summary": summary})  # Use `.invoke()` instead of `.run()`
        return response

if __name__ == "__main__":
    agent = AdPerformanceAgent("D:/Projects/Datazen/AdGeniusAI-datathon2025/Data/ad_performance.csv")
    analysis = agent.analyze()
    print("=== Ad Performance Analysis ===")
    print(analysis)
