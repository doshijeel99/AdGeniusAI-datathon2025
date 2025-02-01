import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
import random

# Load dataset
def load_data(file_path):
    return pd.read_csv(file_path)

# Preprocess categorical data
def preprocess_data(dataset):
    categorical_columns = ['Campaign_Type', 'Target_Audience', 'Channel_Used']
    
    encoders = {}
    for col in categorical_columns:
        encoder = LabelEncoder()
        dataset[col] = encoder.fit_transform(dataset[col].fillna('Unknown'))  # Handle missing data and unseen labels
        encoders[col] = encoder  # Save encoders for future use
    
    return dataset, encoders

# Train the conversion rate prediction model
def train_model(dataset):
    X = dataset[['Campaign_Type', 'Target_Audience', 'Channel_Used', 'Clicks']]
    y = dataset['Conversion_Rate']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    return model

# Generate realistic variations based on campaign data
def generate_realistic_variations(top_campaign):
    variations = [
        {"Campaign_Type": "Social Media", "Channel_Used": "Instagram"},
        {"Campaign_Type": "Display", "Channel_Used": "YouTube"},
        {"Campaign_Type": "Email", "Channel_Used": "Website"},
        {"Campaign_Type": "Search", "Channel_Used": "Google Ads"},
        {"Campaign_Type": "YouTube", "Channel_Used": "Facebook"},
        {"Campaign_Type": "Social Media", "Channel_Used": "Website"},
        {"Campaign_Type": "Display", "Channel_Used": "Instagram"}
    ]
    
    # Adding more realistic options based on business type (for example, "fashion")
    if top_campaign['Company'] == "fashion":
        variations.append({"Campaign_Type": "Influencer", "Channel_Used": "Instagram"})
    
    random.shuffle(variations)
    return variations[:3]

# Predict conversion rate for a given variation using the trained model
def predict_ab_conversion(model, encoders, top_campaign):
    print("\nTop-performing campaign:", top_campaign['Campaign_ID'])
    
    ab_variations = generate_realistic_variations(top_campaign)
    predictions = []

    # Define the feature columns that were used for training
    feature_columns = ['Campaign_Type', 'Target_Audience', 'Channel_Used', 'Clicks']

    for i, variation in enumerate(ab_variations):
        # Encode categorical variables with handling for unseen labels
        campaign_type_encoded = encoders['Campaign_Type'].transform([variation['Campaign_Type']])[0]
        channel_used_encoded = encoders['Channel_Used'].transform([variation['Channel_Used']])[0]

        # Create a DataFrame with the same columns as used for training
        test_data = pd.DataFrame([[campaign_type_encoded, top_campaign['Target_Audience'], channel_used_encoded, top_campaign['Clicks']]], columns=feature_columns)
        
        # Predict the conversion rate
        predicted_rate = model.predict(test_data)[0]
        
        predictions.append((variation, predicted_rate))
        print(f"🔹 Variation {i+1}: Campaign Type: {variation['Campaign_Type']}, Channel Used: {variation['Channel_Used']} -> Predicted Conversion Rate: {predicted_rate:.2f}%")
    
    # Select the best variation based on highest predicted conversion rate
    best_variation = max(predictions, key=lambda x: x[1])
    
    print(f"\nRecommended A/B Test Variation: Campaign Type: {best_variation[0]['Campaign_Type']}, Channel Used: {best_variation[0]['Channel_Used']} with Predicted Conversion Rate: {best_variation[1]:.2f}%")
    return best_variation

# Get user input for the new campaign
def get_user_input():
    business_type = input("Enter your business type: ")
    campaign_type = input("Enter Campaign Type (e.g., Email, influencer, display etc.): ")
    target_audience = input("Enter Target Audience (e.g., Men, Women etc.): ")
    channel_used = input("Enter Channel Used (e.g., Youtube, website, email, etc.): ")
    clicks = int(input("Enter the number of Clicks: "))
    
    new_campaign = {
        'Campaign_ID': f'C{random.randint(100, 999)}',  # Generate random Campaign ID
        'Company': business_type,
        'Campaign_Type': campaign_type,
        'Target_Audience': target_audience,
        'Duration': random.randint(5, 30),  # Duration is random for demo purposes
        'Channel_Used': channel_used,
        'Acquisition_Cost': random.randint(50, 200),  # Randomized for demo
        'ROI': random.uniform(1.0, 5.0),  # Randomized for demo
        'Engagement_Score': random.randint(50, 100),  # Randomized for demo
        'Location': "USA",  # Hardcoded location for demo
        'Language': "English",  # Hardcoded language for demo
        'Clicks': clicks,
        'Impressions': random.randint(5000, 100000),  # Randomized for demo
        'Customer_Segment': "Gen Z",  # Hardcoded customer segment for demo
        'Date': "2025-05-01"  # Hardcoded date for demo
    }
    
    return new_campaign

# Main execution
csv_file_path = "D:\\DJSCE\\Hackathon\\AdGeniusAI-datathon2025\\Data\\campaign.csv"  # Replace with your actual CSV file

dataset = load_data(csv_file_path)
dataset, encoders = preprocess_data(dataset)
model = train_model(dataset)

# Get user input for the new campaign
new_campaign = get_user_input()
new_campaign_df = pd.DataFrame([new_campaign])  # Convert new_campaign to a DataFrame
dataset = pd.concat([dataset, new_campaign_df], ignore_index=True)

# Find the top-performing campaign
top_campaign = dataset.sort_values(by="Conversion_Rate", ascending=False).iloc[0]

# Perform A/B testing
best_variation = predict_ab_conversion(model, encoders, top_campaign)
