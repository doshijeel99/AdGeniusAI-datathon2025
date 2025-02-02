# llm_open_source.py
from langchain.llms.base import LLM
from transformers import (
    pipeline,
    AutoTokenizer,
    AutoModelForCausalLM,
    BitsAndBytesConfig
)
import torch
from typing import Optional, List

class HuggingFaceLLM(LLM):
    model_name: str = "tiiuae/falcon-7b-instruct"
    max_length: int = 256
    temperature: float = 0.7

    def __init__(self, model_name: str = "tiiuae/falcon-7b-instruct", max_length: int = 256, temperature: float = 0.7):
        super().__init__()

        # Quantization settings for BitsAndBytes
        bnb_config = BitsAndBytesConfig(
            load_in_4bit=True,
            bnb_4bit_compute_dtype=torch.float16,
            bnb_4bit_quant_type="nf4",
        )

        # Load tokenizer and model
        tokenizer = AutoTokenizer.from_pretrained(model_name)
        model = AutoModelForCausalLM.from_pretrained(
            model_name,
            quantization_config=bnb_config,
            device_map="cuda",
        )

        # Create text generation pipeline
        self.generator = pipeline(
            "text-generation",
            model=model,
            tokenizer=tokenizer,
            device=0,  # Ensure it runs on CUDA
        )

    @property
    def _llm_type(self) -> str:
        return "huggingface_pipeline"

    def _call(self, prompt: str, stop: Optional[List[str]] = None) -> str:
        """Handles the core text generation call."""
        results = self.generator(
            prompt,
            max_length=self.max_length,
            temperature=self.temperature,
            do_sample=True,
        )
        return results[0]["generated_text"][len(prompt):].strip()

    def predict(self, prompt: str, **kwargs) -> str:
        """Predict function for LLM inference."""
        return self._call(prompt, **kwargs)
