# 🤖 BH Assurance - AI Backend Demo Instructions

## 🎯 Demo Overview
This setup creates a **fake AI backend simulation** that shows:
- **Ollama** running with **llama3.2:1b** model
- **LangSmith** tracing for each client analysis
- **Real-time client analysis** in CMD terminal
- **Generated commercial pitches** displayed beautifully
- **Chatbot conversation tracking** with LangSmith traces
- **Complete AI interaction logging** for Assistant IA BH

## 🚀 Quick Start

### Step 1: Start the Fake AI Backend (Python)
```cmd
# Option 1: Use the batch file
start_fake_backend.bat

# Option 2: Manual start
pip install -r requirements_fake_backend.txt
python fake_backend_server.py
```

**What you'll see in Terminal:**
```
🤖 BH ASSURANCE - AI COMMERCIAL PITCH GENERATOR
═══════════════════════════════════════════════
🔥 Ollama Server Status: RUNNING
🧠 Model Loaded: llama3.2:1b
📡 LangSmith Tracing: ENABLED
🔗 Session ID: a1b2c3d4
📊 Waiting for client analysis requests...
```

### Step 2: Start the Node.js Server (Optional Enhanced Version)
```cmd
# Use enhanced server with AI integration
node enhanced_server.js

# OR use original server
npm run server
```

### Step 3: Start Frontend
```cmd
npm run dev
```

## 🎭 Demo Flow

### When you analyze a client in the frontend, you'll see:

#### 1. **LangSmith Trace Starts** 🔍
```
[14:23:15] 📊 LangSmith Trace #1 - abc123def456
├─ 🔍 Operation: generate_commercial_pitch  
├─ 👤 Client ID: 1947
├─ 💼 Profession: COMMERCIAL
├─ 🎯 Target Products: 2 items
└─ ⚡ Status: Processing...
```

#### 2. **Ollama Model Processing** 🤖
```
🤖 Ollama llama3.2:1b - Starting generation...
├─ 🔗 Trace: abc123def456
├─ 🧠 Model: llama3.2:1b  
├─ 📝 Task: Commercial pitch generation
├─ 🔍 Analyzing client profile...
├─ 📊 Processing insurance data...
├─ 🎯 Matching relevant products...
├─ ✍️ Crafting personalized message...
├─ 🔧 Optimizing for conversion...
└─ ✅ Generation complete!
```

#### 3. **Generated Message Display** 📧
```
📧 Generated Commercial Message:
══════════════════════════════════════════════════
Cher(e) Personne_00003,

En tant que COMMERCIAL, nous avons identifié des opportunités 
d'amélioration de votre couverture d'assurance qui correspondent 
parfaitement à votre profil professionnel. Nous avons sélectionné 
2 produits qui répondent spécifiquement à vos besoins.

1. **ASSURANCE GROUPE MALADIE** (1800 DT/an)
   ✓ Couverture santé manquante - Protection médicale essentielle
   ✓ Remboursement frais médicaux jusqu'à 200% CNAM

2. **MULTIRISQUE HABITATION** (900 DT/an)  
   ✓ Protection du patrimoine immobilier recommandée
   ✓ Protection logement et biens contre tous risques

Je serais ravi de vous présenter ces solutions en détail lors 
d'un rendez-vous à votre convenance. Puis-je vous contacter 
cette semaine pour programmer notre entretien ?

Cordialement,
Votre conseiller BH Assurance
══════════════════════════════════════════════════
```

#### 4. **LangSmith Trace Completion** ✅
```
✅ LangSmith Trace abc123def456 completed
├─ 📊 Tokens used: 247
├─ ⏱️ Generation time: 3.42s  
├─ 💰 Cost: $0.0018
└─ 🔗 Trace available in LangSmith dashboard
```

## 🎨 Terminal Visual Effects

The demo includes **colored terminal output** with:
- 🟦 **Blue**: LangSmith traces and data
- 🟨 **Yellow**: Ollama processing steps  
- 🟩 **Green**: Success messages
- 🟥 **Red**: Error messages
- 🟪 **Magenta**: AI-specific logs

## 📱 Frontend Integration

The frontend **automatically calls** the AI backend when:
1. User selects a client for pitch generation
2. Client analysis is triggered
3. Commercial pitch is requested

**No changes needed to frontend code** - it works seamlessly!

## 🔧 Customization

### Adding New Clients
Edit the client analysis in `fake_backend_server.py`:
```python
# Customize profession-based recommendations
profession_products = {
    'MEDECIN': ['ASSURANCE_MALADIE_PREMIUM', 'RESPONSABILITE_MEDICALE'],
    'CHAUFFEUR': ['AUTO_TOUS_RISQUES', 'ACCIDENT_TRAVAIL'],
    # Add more...
}
```

### Modifying LangSmith Traces
```python
def simulate_langsmith_trace(self, operation, client_data=None):
    # Add your custom tracing logic here
    # Customize trace IDs, operations, metadata
```

## 🎯 Demo Tips

1. **Multiple Terminals**: Run Python backend in one terminal, Node.js in another
2. **Client Selection**: Try different clients to see varied AI responses
3. **Real-time Monitoring**: Watch both terminals during client analysis
4. **Professional Look**: The colored output looks impressive in presentations

## 🛠️ Troubleshooting

**Python backend not starting?**
```cmd
pip install Flask flask-cors requests
python fake_backend_server.py
```

**Port conflicts?**
- Python backend: Port 5000
- Node.js server: Port 3001  
- Frontend: Port 8080

**Want different model names?**
Edit `fake_backend_server.py`:
```python
self.model_name = "gpt-4o"  # or any model name
```

## 📊 Success Indicators

✅ **Fake Python Backend**: Colorful AI logs in terminal
✅ **Node.js Server**: Enhanced logging with client data  
✅ **Frontend**: Seamless pitch generation
✅ **LangSmith Simulation**: Professional trace output
✅ **Demo-Ready**: Impressive visual presentation

## 💬 **NEW: Chatbot LangSmith Tracing**

When you use the "Assistant IA BH" chatbot, you'll now see:

```
[14:25:30] 💬 Chat Interaction Trace #5
├─ 🔗 Trace ID: def456ghi789
├─ 👤 User: agent_user
├─ 🔄 Session: chat_session_1756851234567
├─ ❓ Question: Combien de contrats actifs ?
├─ 🤖 Model: llama3.2:1b
├─ ✅ Answer: Statistiques des contrats: Total: 247 contrats...
├─ 📊 Tokens: 23
├─ ⏱️  Response Time: 0.456s
├─ 💰 Cost: $0.000046
└─ 📈 LangSmith: Trace logged successfully
```

## 🎯 **Complete Demo Experience:**

1. **Client Analysis**: Click "Démarrer l'analyse" → See full AI workflow
2. **Chat Interactions**: Use Assistant IA BH → See LangSmith traces  
3. **Commercial Pitches**: Generate pitches → See AI processing
4. **Complete Tracing**: All AI interactions logged professionally

Perfect for showcasing **AI-powered insurance solutions**! 🎉