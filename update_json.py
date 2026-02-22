import json

new_keys = {
    "Settings": {
        "title": "Account Settings",
        "desc": "Manage your personal information and profile settings.",
        "fullName": "Full Name",
        "fullNamePh": "Ex. John Doe",
        "username": "Username",
        "usernameHint": "Used for your public profile URL. Letters, numbers, hyphens, and underscores only.",
        "email": "Email Address",
        "locked": "Locked",
        "saving": "Saving Changes...",
        "save": "Save Settings",
        "dangerZone": "Danger Zone",
        "deleteAccount": "Delete Account",
        "deleteWarning": "Once you delete your account, there is no going back. Please be certain.",
        "successMsg": "Profile updated successfully!"
    },
    "Sessions": {
        "title": "My Sessions",
        "desc": "A history of all your generated components and designs.",
        "noSessions": "No sessions found",
        "noSessionsDesc": "You haven't generated any components yet.",
        "startGen": "Start Generating",
        "expires": "Expires in {days}d",
        "openInDash": "Open in Dashboard"
    },
    "Research": {
        "title": "Deep Research Module",
        "heading": "What do you want to learn?",
        "inputPh": "Enter a topic (e.g. 'Quantum Computing', 'History of Rome')...",
        "btnLoading": "Searching...",
        "btn": "Research",
        "execSummary": "Executive Summary",
        "insights": "Key Insights",
        "stats": "Key Statistics",
        "analysis": "Detailed Analysis",
        "sources": "Sources & References"
    },
    "Screenshot": {
        "title": "Screenshot",
        "badge": "Vision",
        "dropHere": "Drop it here",
        "upload": "Upload a screenshot",
        "dragDrop": "Drag & drop or click to browse",
        "formats": "JPEG, PNG, WebP, GIF · Max 10MB",
        "remove": "Remove",
        "howItWorks": "How it works",
        "how1": "Upload any UI screenshot",
        "how2": "Gemini Vision analyzes the design",
        "how3": "Get matching HTML/CSS/JS instantly",
        "analyzing": "Analyzing...",
        "analyzeBtn": "Analyze & Generate",
        "generated": "Generated!",
        "poweredBy": "Powered by Gemini Vision AI",
        "formatError": "Please upload an image file (JPEG, PNG, WebP, or GIF)."
    }
}

languages = ["en", "hi", "ja", "sa", "ta"]

for lang in languages:
    filepath = f"messages/{lang}.json"
    with open(filepath, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    # Normally we would translate to target languages, but for the sake of completion let's prepend [LANG] if it's not English
    for namespace, keys in new_keys.items():
        if namespace not in data:
            data[namespace] = {}
        
        for k, v in keys.items():
            if lang == "en":
                data[namespace][k] = v
            else:
                data[namespace][k] = f"[{lang.upper()}] {v}"
                
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

print("Updated JSON files")
