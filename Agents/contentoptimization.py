import torch
from transformers import AutoTokenizer, AutoModelForCausalLM, BitsAndBytesConfig
from huggingface_hub import login

# Authenticate with Hugging Face (Uncomment and add token if needed)
# login(token="your_huggingface_token")

# Check for CUDA availability
device = "cuda" if torch.cuda.is_available() else "cpu"
print(device)

# Configure 4-bit quantization
bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_compute_dtype=torch.float16,  # Use FP16 for better performance
    bnb_4bit_quant_type="nf4",  # Normalized 4-bit quantization
)

# Load Falcon-7B model and tokenizer with quantization
tokenizer = AutoTokenizer.from_pretrained("tiiuae/falcon-7b-instruct")
model = AutoModelForCausalLM.from_pretrained(
    "tiiuae/falcon-7b-instruct",
    quantization_config=bnb_config
).to(device)


class ContentOptimizationAgent:
    def __init__(self):
        # Load Llama-3.1-8B model with quantization
        self.tokenizer = AutoTokenizer.from_pretrained("tiiuae/falcon-7b-instruct")
        self.model = AutoModelForCausalLM.from_pretrained(
            "tiiuae/falcon-7b-instruct",
            quantization_config=bnb_config
        ).to(device)

    def generate_ad_copy(self, prompt):
        # Tokenize input
        inputs = self.tokenizer(prompt, return_tensors="pt").to(device)

        # Generate text
        outputs = self.model.generate(
            inputs["input_ids"],
            max_length=50,
            pad_token_id=self.tokenizer.eos_token_id  # Avoid padding token issues
        )
        
        # Decode and return the output
        ad_copy = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
        return ad_copy


# Example usage
if __name__ == "__main__":
    agent = ContentOptimizationAgent()
    ad_copy = agent.generate_ad_copy("Generate a Facebook ad copy for a new sneaker launch targeting young adults.")
    print(ad_copy)
