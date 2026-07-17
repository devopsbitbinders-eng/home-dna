import os
import json
from typing import Dict, Any, Tuple
import google.generativeai as genai

def calculate_score(responses: Dict[str, Any]) -> Tuple[int, bool]:
    score = 0
    
    budget = responses.get("budget", "")
    if budget in ["20-35L", "35-50L", "50L+"]:
        score += 25
        
    timeline = responses.get("timeline", "")
    if timeline in ["Immediately", "Within 3 months"]:
        score += 30
        
    property_status = responses.get("property_status", "")
    if property_status == "Already Owned":
        score += 20
        
    renovation = responses.get("renovation_type", "")
    if "Renovation" in renovation:
        score += 20
        
    prop_type = responses.get("property_type", "")
    if prop_type in ["Office", "Commercial", "Retail", "Restaurant", "Clinic", "Factory Office", "Warehouse Office"]:
        score += 15
        
    is_hot_lead = score > 70
    return score, is_hot_lead

def _generate_fallback_report(responses: Dict[str, Any]) -> Dict[str, Any]:
    aesthetic = responses.get("aesthetic", [])
    if isinstance(aesthetic, list) and aesthetic:
        style_name = aesthetic[0]
    else:
        style_name = responses.get("custom_aesthetic", "Contemporary")
        
    vision = responses.get("vision", "Elegant")
    personality = f"{vision} {style_name}"
    
    color = responses.get("color", responses.get("custom_color", "Neutral Tone"))
    materials = responses.get("materials", [])
    if not isinstance(materials, list) or not materials:
        if responses.get("custom_materials"):
            materials = [responses.get("custom_materials")]
        else:
            materials = ["Premium Wood"]
            
    lighting = responses.get("lighting", "Warm Ambient")
    budget = responses.get("budget", "TBD")
    smart_home = "90%" if responses.get("smart_home") == "Yes" else "50%"
    
    storage_reqs = responses.get("storage", [])
    if isinstance(storage_reqs, list) and storage_reqs:
        storage_str = storage_reqs[0]
    else:
        storage_str = "Integrated Smart Storage"

    prompt = f"A photorealistic architectural digest style interior of a {vision} {style_name} room featuring {color} tones, {', '.join(materials)} materials, and {lighting} lighting."
    
    import random
    import urllib.parse
    seed = random.randint(10000, 99999)
    encoded_prompt = urllib.parse.quote(prompt)
    img_url = f"https://image.pollinations.ai/prompt/{encoded_prompt}?width=1280&height=720&nologo=true&seed={seed}"

    return {
        "Interior Personality": personality,
        "Colour Palette": [color, "White", "Grey", "Accent Tone"],
        "Recommended Materials": materials + ["Glass", "Metal Accents"] if materials else ["Wood", "Marble", "Glass"],
        "Lighting": [lighting, "Cove Lighting", "Task Lights"],
        "Furniture Style": f"Premium {vision} Furniture",
        "Space Planning Score": "85%",
        "Storage Recommendation": storage_str,
        "Smart Home Compatibility": smart_home,
        "Estimated Interior Budget": budget,
        "Image Prompt": prompt,
        "Image URL": img_url
    }

def generate_ai_report_mock(responses: Dict[str, Any]) -> Dict[str, Any]:
    api_key = os.getenv("GEMINI_API_KEY")
    
    if not api_key:
        return _generate_fallback_report(responses)

    genai.configure(api_key=api_key)
    
    prompt = f"""
    You are an award-winning UX Designer, Luxury Interior Brand Designer, and Product Designer.
    Create a highly premium, personalized "Home DNA Report" worth $5,000 for this client based on their exact answers:
    {json.dumps(responses, indent=2)}
    
    CRITICAL INSTRUCTION: You MUST generate this report strictly based on the user's preferences provided above. 
    - The 'Colour Palette' MUST heavily feature their selected 'color' or 'custom_color'.
    - The 'Recommended Materials' MUST include their chosen 'materials'.
    - The 'Lighting' MUST align perfectly with their chosen 'lighting' preference.
    - The 'Furniture Style' MUST reflect their chosen 'personality', 'hotel', and 'vision'.
    - The 'Storage Recommendation' MUST address their specific 'storage' needs.
    - The 'Smart Home Compatibility' MUST reflect their 'smart_home' preference.
    - The 'Image Prompt' MUST generate a room that physically includes their exact chosen color, material, and lighting.

    You MUST return ONLY valid JSON matching this exact structure, with no markdown formatting.
    Make the tone Editorial, Quiet Luxury, Minimal, and Sophisticated (like Studio McGee or Kelly Wearstler).
    Always use realistic Indian Rupee (₹) estimates for the 'Estimated Interior Budget' based on their selected investment range and property size.

    {{
        "Interior Personality": "e.g. Modern Minimalist Executive",
        "Colour Palette": ["e.g. Grey", "e.g. Oak", "e.g. White", "e.g. Olive"],
        "Recommended Materials": ["e.g. PU Finish", "e.g. Fluted Panels", "e.g. Stone Veneer", "e.g. Micro Concrete"],
        "Lighting": ["e.g. 3000K Warm Lights", "e.g. Hidden Cove Lights", "e.g. Pendant Lights"],
        "Furniture Style": "e.g. Italian Luxury",
        "Space Planning Score": "e.g. 89%",
        "Storage Recommendation": "e.g. High Hidden Storage",
        "Smart Home Compatibility": "e.g. 95%",
        "Estimated Interior Budget": "e.g. ₹18–24 Lakhs",
        "Image Prompt": "A highly detailed image generation prompt (max 50 words) to create a photorealistic 3D render of a living room matching these exact tastes. Start with: A photorealistic architectural digest style interior of..."
    }}
    """
    
    # Try multiple models to find the one available for this specific Google account
    models_to_try = [
        "gemini-2.5-flash-lite"
    ]
    
    last_error = None
    
    for model_name in models_to_try:
        try:
            model = genai.GenerativeModel(model_name)
            response = model.generate_content(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    response_mime_type="application/json",
                ),
            )
            
            # Clean the response text (Gemini sometimes wraps JSON in markdown blocks)
            clean_text = response.text.strip()
            if clean_text.startswith("```json"):
                clean_text = clean_text[7:]
            if clean_text.startswith("```"):
                clean_text = clean_text[3:]
            if clean_text.endswith("```"):
                clean_text = clean_text[:-3]
                
            result_json = json.loads(clean_text.strip())
            
            # Permanently attach the image URL with a random seed so it saves to the database
            import random
            import urllib.parse
            if "Image Prompt" in result_json:
                seed = random.randint(10000, 99999)
                encoded_prompt = urllib.parse.quote(result_json["Image Prompt"])
                result_json["Image URL"] = f"https://image.pollinations.ai/prompt/{encoded_prompt}?width=1280&height=720&nologo=true&seed={seed}"
                
            return result_json
        except Exception as e:
            last_error = str(e)
            print(f"Failed with {model_name}: {last_error}")
            continue
            
    # If all models fail, return the smart fallback instead of an error string
    return _generate_fallback_report(responses)
