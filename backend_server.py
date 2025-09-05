#!/usr/bin/env python3
"""
Fake Backend Server - AI-Powered Insurance Commercial Pitch Generator
Simulates Ollama + LLM + LangSmith integration for demo purposes
"""

import json
import time
import random
import sys
import os
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
import threading
import uuid

app = Flask(__name__)
CORS(app)

class Colors:
    """Terminal colors for better visualization"""
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

class FakeAIBackend:
    def __init__(self):
        self.model_name = "llama3.2:1b"
        self.session_id = str(uuid.uuid4())[:8]
        self.trace_count = 0
        
    def print_banner(self):
        """Print startup banner"""
        print(f"{Colors.HEADER}{Colors.BOLD}")
        print("=" * 70)
        print("🤖 BH ASSURANCE - AI COMMERCIAL PITCH GENERATOR")
        print("=" * 70)
        print(f"{Colors.ENDC}")
        print(f"{Colors.OKGREEN}🔥 Ollama Server Status: {Colors.BOLD}RUNNING{Colors.ENDC}")
        print(f"{Colors.OKGREEN}🧠 Model Loaded: {Colors.BOLD}{self.model_name}{Colors.ENDC}")
        print(f"{Colors.OKGREEN}📡 LangSmith Tracing: {Colors.BOLD}ENABLED{Colors.ENDC}")
        print(f"{Colors.OKGREEN}🔗 Session ID: {Colors.BOLD}{self.session_id}{Colors.ENDC}")
        print(f"{Colors.OKCYAN}📊 Waiting for client analysis requests...{Colors.ENDC}\n")

    def simulate_langsmith_trace(self, operation, client_data=None):
        """Simulate LangSmith tracing output"""
        self.trace_count += 1
        trace_id = str(uuid.uuid4())[:12]
        timestamp = datetime.now().strftime("%H:%M:%S")
        
        print(f"{Colors.OKCYAN}[{timestamp}] 📊 LangSmith Trace #{self.trace_count} - {trace_id}{Colors.ENDC}")
        print(f"{Colors.OKBLUE}├─ 🔍 Operation: {operation}{Colors.ENDC}")
        
        if client_data:
            print(f"{Colors.OKBLUE}├─ 👤 Client ID: {client_data.get('customerId', 'Unknown')}{Colors.ENDC}")
            print(f"{Colors.OKBLUE}├─ 💼 Profession: {client_data.get('profession', 'Unknown')}{Colors.ENDC}")
            print(f"{Colors.OKBLUE}├─ 🎯 Target Products: {len(client_data.get('recommendations', []))} items{Colors.ENDC}")
        
        print(f"{Colors.OKBLUE}└─ ⚡ Status: Processing...{Colors.ENDC}\n")
        return trace_id

    def simulate_client_analysis_workflow(self, client_data, trace_id):
        """Simulate complete client analysis workflow"""
        workflow_steps = [
            {
                "phase": "CUSTOMER_ANALYSIS",
                "steps": [
                    f"👤 Loading client profile: {client_data.get('clientName', 'Unknown')}",
                    f"💼 Analyzing profession: {client_data.get('profession', 'Unknown')}",
                    f"📊 Processing demographic data (age, location, family status)",
                    f"💰 Evaluating existing contracts and coverage",
                    f"📈 Building comprehensive risk profile"
                ]
            },
            {
                "phase": "GAP_DETECTION", 
                "steps": [
                    "🔍 Scanning for coverage gaps...",
                    "⚠️  Identifying missing insurance products",
                    "🎯 Calculating risk exposure levels",
                    "📋 Cross-referencing industry best practices",
                    "✅ Gap analysis complete"
                ]
            },
            {
                "phase": "PRODUCT_RECOMMENDATION",
                "steps": [
                    "🧮 Running recommendation algorithms...",
                    "📚 Accessing product database (247 products)",
                    "🎯 Matching client profile to optimal products",
                    "💡 Ranking recommendations by priority",
                    "✨ Finalizing product selection"
                ]
            },
            {
                "phase": "PITCH_GENERATION",
                "steps": [
                    "🤖 Initializing language model...",
                    "📝 Crafting personalized opening",
                    "🎨 Structuring persuasive arguments", 
                    "💰 Calculating pricing strategies",
                    "🔧 Optimizing for conversion",
                    "✅ Commercial pitch generated!"
                ]
            }
        ]
        
        for phase_info in workflow_steps:
            phase = phase_info["phase"]
            steps = phase_info["steps"]
            
            print(f"{Colors.HEADER}🚀 PHASE: {phase}{Colors.ENDC}")
            print(f"{Colors.OKBLUE}├─ 🔗 Trace: {trace_id}{Colors.ENDC}")
            print(f"{Colors.OKBLUE}├─ 🧠 Model: {self.model_name}{Colors.ENDC}")
            print(f"{Colors.OKBLUE}└─ 📊 LangSmith monitoring active{Colors.ENDC}")
            
            for i, step in enumerate(steps):
                time.sleep(random.uniform(0.8, 2.0))  # Realistic processing time
                status = "├─" if i < len(steps) - 1 else "└─"
                print(f"{Colors.WARNING}{status} {step}{Colors.ENDC}")
                
                # Add realistic sub-processing for some steps
                if "Loading client profile" in step:
                    time.sleep(0.5)
                    print(f"{Colors.OKCYAN}   ├─ ✅ Client ID: {client_data.get('customerId')}{Colors.ENDC}")
                    print(f"{Colors.OKCYAN}   └─ ✅ Profile loaded successfully{Colors.ENDC}")
                    
                elif "recommendation algorithms" in step:
                    time.sleep(1.0)
                    print(f"{Colors.OKCYAN}   ├─ 🔄 Vector similarity search...{Colors.ENDC}")
                    print(f"{Colors.OKCYAN}   ├─ 🧠 Neural network inference...{Colors.ENDC}")
                    print(f"{Colors.OKCYAN}   └─ ✅ {len(client_data.get('recommendations', []))} products selected{Colors.ENDC}")
                    
                elif "language model" in step:
                    time.sleep(0.7)
                    print(f"{Colors.OKCYAN}   ├─ 🔥 GPU acceleration enabled{Colors.ENDC}")
                    print(f"{Colors.OKCYAN}   ├─ 📊 Context window: 4096 tokens{Colors.ENDC}")
                    print(f"{Colors.OKCYAN}   └─ ⚡ Model ready for generation{Colors.ENDC}")
                    
                elif "Crafting personalized opening" in step:
                    time.sleep(0.5)
                    print(f"{Colors.OKCYAN}   ├─ 📝 Analyzing communication style preferences{Colors.ENDC}")
                    print(f"{Colors.OKCYAN}   └─ ✨ Personalization algorithms applied{Colors.ENDC}")
                    
                elif "Gap analysis complete" in step:
                    time.sleep(0.3)
                    gaps_found = random.randint(2, 5)
                    print(f"{Colors.OKCYAN}   ├─ 🎯 {gaps_found} coverage gaps identified{Colors.ENDC}")
                    print(f"{Colors.OKCYAN}   └─ 📊 Risk score calculated: {random.randint(65, 95)}/100{Colors.ENDC}")
                    
                elif "products selected" in step:
                    time.sleep(0.4)
                    confidence = random.randint(88, 97)
                    print(f"{Colors.OKCYAN}   ├─ 🎯 Match confidence: {confidence}%{Colors.ENDC}")
                    print(f"{Colors.OKCYAN}   └─ 💰 Total estimated premium: {random.randint(2800, 5200)} DT/year{Colors.ENDC}")
            
            print()  # Space between phases

    def simulate_ollama_generation(self, client_data, trace_id):
        """Simulate Ollama LLM generation process - now part of full workflow"""
        # This is now integrated into the workflow above
        pass

    def generate_commercial_pitch(self, client_data):
        """Generate a fake commercial pitch"""
        
        # Simulate LangSmith tracing
        trace_id = self.simulate_langsmith_trace("generate_commercial_pitch", client_data)
        
        # Simulate complete client analysis workflow
        self.simulate_client_analysis_workflow(client_data, trace_id)
        
        # Generate fake pitch content
        client_name = client_data.get('clientName', 'Client')
        profession = client_data.get('profession', 'Professionnel')
        recommendations = client_data.get('recommendations', [])
        
        print(f"{Colors.OKGREEN}📧 Generated Commercial Message:{Colors.ENDC}")
        print(f"{Colors.HEADER}{'='*50}{Colors.ENDC}")
        
        pitch = f"""Cher(e) {client_name},

En tant que {profession}, nous avons identifié des opportunités d'amélioration de votre couverture d'assurance qui correspondent parfaitement à votre profil professionnel. Nous avons sélectionné {len(recommendations)} produit{'s' if len(recommendations) > 1 else ''} qui répond{'ent' if len(recommendations) > 1 else ''} spécifiquement à vos besoins."""

        # Add product recommendations
        for i, rec in enumerate(recommendations[:3], 1):  # Max 3 products
            product_name = rec.get('product', {}).get('LIB_PRODUIT', 'Produit Assurance')
            price = rec.get('estimatedPremium', random.randint(800, 2500))
            benefit = rec.get('expectedBenefit', 'Protection complète')
            reasoning = rec.get('reasoning', 'Recommandé pour votre profil')
            
            pitch += f"""

{i}. **{product_name.upper()}** ({price} DT/an)
   ✓ {reasoning}
   ✓ {benefit}"""

        pitch += """

Je serais ravi de vous présenter ces solutions en détail lors d'un rendez-vous à votre convenance. Puis-je vous contacter cette semaine pour programmer notre entretien ?

Cordialement,
Votre conseiller BH Assurance"""

        print(f"{Colors.BOLD}{pitch}{Colors.ENDC}")
        print(f"{Colors.HEADER}{'='*50}{Colors.ENDC}")
        
        # Complete LangSmith trace
        print(f"{Colors.OKCYAN}✅ LangSmith Trace {trace_id} completed{Colors.ENDC}")
        print(f"{Colors.OKCYAN}├─ 📊 Tokens used: {random.randint(150, 300)}{Colors.ENDC}")
        print(f"{Colors.OKCYAN}├─ ⏱️ Generation time: {random.uniform(2.1, 4.8):.2f}s{Colors.ENDC}")
        print(f"{Colors.OKCYAN}└─ 💰 Cost: ${random.uniform(0.001, 0.003):.4f}{Colors.ENDC}\n")
        
        return {
            "personalizedMessage": pitch,
            "traceId": trace_id,
            "model": self.model_name,
            "timestamp": datetime.now().isoformat()
        }

    def simulate_chat_trace(self, question, answer, session_id, user_id):
        """Simulate LangSmith tracing for chat interactions"""
        self.trace_count += 1
        trace_id = str(uuid.uuid4())[:12]
        timestamp = datetime.now().strftime("%H:%M:%S")
        
        print(f"{Colors.OKCYAN}[{timestamp}] 💬 Chat Interaction Trace #{self.trace_count}{Colors.ENDC}")
        print(f"{Colors.OKBLUE}├─ 🔗 Trace ID: {trace_id}{Colors.ENDC}")
        print(f"{Colors.OKBLUE}├─ 👤 User: {user_id}{Colors.ENDC}")
        print(f"{Colors.OKBLUE}├─ 🔄 Session: {session_id}{Colors.ENDC}")
        print(f"{Colors.OKBLUE}├─ ❓ Question: {question[:60]}{'...' if len(question) > 60 else ''}{Colors.ENDC}")
        print(f"{Colors.OKBLUE}├─ 🤖 Model: {self.model_name}{Colors.ENDC}")
        print(f"{Colors.OKBLUE}├─ ✅ Answer: {answer[:60]}{'...' if len(answer) > 60 else ''}{Colors.ENDC}")
        
        # Simulate processing metrics
        tokens_used = len(question.split()) + len(answer.split())
        response_time = random.uniform(0.2, 0.8)
        cost = tokens_used * 0.000002
        
        print(f"{Colors.OKBLUE}├─ 📊 Tokens: {tokens_used}{Colors.ENDC}")
        print(f"{Colors.OKBLUE}├─ ⏱️  Response Time: {response_time:.3f}s{Colors.ENDC}")
        print(f"{Colors.OKBLUE}├─ 💰 Cost: ${cost:.6f}{Colors.ENDC}")
        print(f"{Colors.OKBLUE}└─ 📈 LangSmith: Trace logged successfully{Colors.ENDC}")
        print()  # Empty line for readability

# Initialize the fake backend
fake_ai = FakeAIBackend()

@app.route('/api/chat-interaction', methods=['POST'])
def chat_interaction():
    """Log chat interactions for LangSmith tracing"""
    try:
        data = request.get_json()
        
        question = data.get('question', '')
        answer = data.get('answer', '')
        session_id = data.get('sessionId', 'unknown')
        user_id = data.get('userId', 'unknown')
        
        # Simulate LangSmith chat tracing
        fake_ai.simulate_chat_trace(question, answer, session_id, user_id)
        
        return jsonify({'success': True, 'message': 'Chat interaction logged'})
        
    except Exception as e:
        print(f"{Colors.FAIL}❌ Error logging chat interaction: {str(e)}{Colors.ENDC}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/generate-pitch', methods=['POST'])
def generate_pitch():
    """API endpoint to generate commercial pitch"""
    try:
        data = request.get_json()
        
        # Extract client data
        client_data = {
            'customerId': data.get('customerId'),
            'clientName': data.get('clientName', f"Client_{data.get('customerId', '000')}"),
            'profession': data.get('profession', 'Professionnel'),
            'recommendations': data.get('recommendations', [])
        }
        
        print(f"{Colors.BOLD}🚀 New Client Analysis Request{Colors.ENDC}")
        print(f"{Colors.OKBLUE}├─ 👤 Client: {client_data['clientName']} (ID: {client_data['customerId']}){Colors.ENDC}")
        print(f"{Colors.OKBLUE}├─ 💼 Profession: {client_data['profession']}{Colors.ENDC}")
        print(f"{Colors.OKBLUE}└─ 🎯 Products to analyze: {len(client_data['recommendations'])}{Colors.ENDC}\n")
        
        # Generate the commercial pitch
        result = fake_ai.generate_commercial_pitch(client_data)
        
        return jsonify({
            'success': True,
            'commercialPitch': result
        })
        
    except Exception as e:
        print(f"{Colors.FAIL}❌ Error generating pitch: {str(e)}{Colors.ENDC}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    print(f"{Colors.OKCYAN}💓 Health check requested{Colors.ENDC}")
    return jsonify({
        'status': 'healthy',
        'model': fake_ai.model_name,
        'session_id': fake_ai.session_id,
        'traces_processed': fake_ai.trace_count,
        'ollama_status': 'running',
        'langsmith_status': 'enabled'
    })

def simulate_background_activity():
    """Simulate background AI activity"""
    time.sleep(5)  # Wait for server to start
    
    activities = [
        "🔄 Model warmup completed",
        "📚 Loading insurance knowledge base...", 
        "🎯 Optimizing recommendation engine...",
        "📊 Synchronizing with LangSmith...",
        "⚡ Ready for client analysis"
    ]
    
    for activity in activities:
        time.sleep(random.uniform(2, 4))
        timestamp = datetime.now().strftime("%H:%M:%S")
        print(f"{Colors.OKCYAN}[{timestamp}] {activity}{Colors.ENDC}")

if __name__ == '__main__':
    # Print startup banner
    fake_ai.print_banner()
    
    # Start background activity simulation
    bg_thread = threading.Thread(target=simulate_background_activity, daemon=True)
    bg_thread.start()
    
    # Start the Flask server
    print(f"{Colors.BOLD}🚀 Starting BH Assurance AI Backend Server...{Colors.ENDC}")
    print(f"{Colors.OKGREEN}📡 Server running on: http://localhost:5000{Colors.ENDC}")
    print(f"{Colors.OKGREEN}🔗 Endpoints available:{Colors.ENDC}")
    print(f"{Colors.OKGREEN}   POST /api/generate-pitch - Generate commercial pitch{Colors.ENDC}")
    print(f"{Colors.OKGREEN}   POST /api/chat-interaction - Log chatbot conversations{Colors.ENDC}")
    print(f"{Colors.OKGREEN}   GET  /api/health - Health check{Colors.ENDC}\n")
    
    try:
        app.run(host='0.0.0.0', port=5000, debug=False)
    except KeyboardInterrupt:
        print(f"\n{Colors.WARNING}🛑 Shutting down AI Backend Server...{Colors.ENDC}")
        print(f"{Colors.OKCYAN}📊 Final Stats:{Colors.ENDC}")
        print(f"{Colors.OKCYAN}├─ Traces processed: {fake_ai.trace_count}{Colors.ENDC}")
        print(f"{Colors.OKCYAN}├─ Session ID: {fake_ai.session_id}{Colors.ENDC}")
        print(f"{Colors.OKCYAN}└─ Model: {fake_ai.model_name}{Colors.ENDC}")
        print(f"{Colors.OKGREEN}✅ Shutdown complete!{Colors.ENDC}")