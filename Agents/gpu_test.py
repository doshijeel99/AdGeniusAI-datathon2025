# import torch

# print("Torch version:", torch.__version__)
# print("CUDA available:", torch.cuda.is_available())

# if torch.cuda.is_available():
#     print("CUDA device count:", torch.cuda.device_count())
#     print("CUDA device name:", torch.cuda.get_device_name(0))
#     print("CUDA device capability:", torch.cuda.get_device_capability(0))
# else:
#     print("CUDA is not available. Ensure that you have installed the correct PyTorch version with CUDA support.")
import pandas as pd

# Load the dataset
df = pd.read_csv("D:/Projects/Datazen/AdGeniusAI-datathon2025/Data/ad_performance.csv")

# Compute the actual average CTR
actual_avg_ctr = df["CTR"].mean() * 100  # Convert to percentage
print(f"Actual Average CTR: {actual_avg_ctr:.2f}%")
