export const questions = [
  {
    id: "basic_info",
    title: "Let's Start with the Basics",
    fields: [
      { name: "name", label: "Full Name", type: "text", required: true },
      { name: "phone", label: "Phone Number", type: "tel", required: true },
      { name: "email", label: "Email Address", type: "email", required: true },
      { name: "city", label: "City", type: "text", required: true },
      { name: "occupation", label: "Occupation", type: "text", required: true },
    ]
  },
  {
    id: "family_info",
    title: "Who will be living in the home?",
    fields: [
      { name: "age", label: "Your Age", type: "number", required: true },
      { name: "marital_status", label: "Marital Status", type: "select", options: ["Single", "Married"], required: true },
      { name: "family_members", label: "Number of Family Members", type: "number", required: true },
      { name: "kids", label: "Kids?", type: "select", options: ["Yes", "No"], required: true },
      { name: "parents", label: "Parents living together?", type: "select", options: ["Yes", "No"], required: true },
      { name: "pets", label: "Pets?", type: "select", options: ["Yes", "No"], required: true },
    ]
  },
  {
    id: "property",
    title: "About Your Property",
    fields: [
      { name: "property_type", label: "Property Type", type: "select", options: ["Apartment", "Villa", "Bungalow", "Penthouse", "Office", "Commercial", "Retail", "Restaurant", "Clinic", "Factory Office", "Warehouse Office"], required: true },
      { name: "property_status", label: "Property Status", type: "select", options: ["Already Owned", "Buying Soon", "Under Construction", "Planning"], required: true },
      { name: "renovation_type", label: "Requirement Type", type: "select", options: ["Renovation", "New Interior", "Partial Renovation", "Only Modular Kitchen", "Office Renovation", "Commercial Fit-out"], required: true },
    ]
  },
  {
    id: "budget_timeline",
    title: "Project Scope",
    fields: [
      { name: "budget", label: "Budget Range", type: "select", options: ["5-10L", "10-20L", "20-35L", "35-50L", "50L+"], required: true },
      { name: "timeline", label: "Timeline", type: "select", options: ["Immediately", "Within 3 months", "6 months", "1 year", "Just Exploring"], required: true },
    ]
  },
  {
    id: "lifestyle",
    title: "Your Lifestyle",
    fields: [
      { name: "guests", label: "How often do guests visit?", type: "select", options: ["Rarely", "Sometimes", "Often"], required: true },
      { name: "wfh", label: "Do you work from home?", type: "select", options: ["Yes", "No", "Occasionally"], required: true },
      { name: "cook", label: "Do you cook daily?", type: "select", options: ["Yes", "No"], required: true },
      { name: "parties", label: "Do you host parties?", type: "select", options: ["Yes", "No"], required: true },
    ]
  },
  {
    id: "personality",
    title: "Your Personality & Style",
    fields: [
      { name: "personality", label: "Which best describes you?", type: "select", options: ["Creative", "Analytical", "Luxury Lover", "Nature Lover", "Minimalist", "Traditional", "Modern", "Family First", "Tech Enthusiast", "Collector", "Business Owner", "Artist"], required: true },
      { name: "color", label: "Colour Preference", type: "select", options: ["Earthy", "Monochrome", "Warm", "Dark", "Bright", "Luxury", "Wood", "Marble", "Metal"], required: true },
      { name: "hotel", label: "Favourite Hotel Vibe", type: "select", options: ["Taj", "Oberoi", "Leela", "Airbnb Style", "Minimal Scandinavian", "Royal Palace", "Mountain Cabin", "Beach Resort"], required: true },
    ]
  },
  {
    id: "final",
    title: "The Final Touch",
    fields: [
      { name: "one_word", label: "If your dream home was one word...", type: "select", options: ["Elegant", "Cozy", "Luxurious", "Royal", "Minimal", "Premium", "Timeless", "Bold"], required: true },
    ]
  }
];
