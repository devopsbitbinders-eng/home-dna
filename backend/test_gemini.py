import os
import time
from google import genai
from google.genai.errors import APIError

# 1. Initialize the client
# Ensure your AQ API key is set in your environment variables
# export GEMINI_API_KEY="AQ..."
api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key="")

def test_model(model_name):
    print(f"Testing {model_name}...")
    try:
        response = client.models.generate_content(
            model=model_name,
            contents="Hello! Please confirm if you are working correctly."
        )
        print(f"✅ Success: {response.text.strip()}")
    except APIError as e:
        print(f"❌ Failed: {e}")
    except Exception as e:
        print(f"❌ Unexpected Error: {e}")

# List of models to test (Start with the most stable/fast ones)
models_to_test = [
    "gemini-3.5-flash",
    "gemini-2.0-flash",
    "gemini-2.5-flash",
    "gemini-2.5-pro"
]

for model in models_to_test:
    test_model(model)
    # Adding a delay to prevent hitting 429 errors during testing
    time.sleep(5)