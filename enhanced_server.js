import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;
const FAKE_AI_BACKEND = 'http://localhost:5000';

// Middleware
app.use(cors());
app.use(express.json());

const feedbackPath = path.join(__dirname, 'feedback', 'feedback.json');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Console logging with colors
const log = {
  info: (msg) => console.log(`${colors.cyan}ℹ️  ${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  ai: (msg) => console.log(`${colors.magenta}🤖 ${msg}${colors.reset}`),
  data: (msg) => console.log(`${colors.blue}📊 ${msg}${colors.reset}`)
};

// Print startup banner
console.log(`${colors.bright}${colors.blue}
╔══════════════════════════════════════════════════════════╗
║                 🏢 BH ASSURANCE SERVER                    ║
║              Enhanced with AI Integration                 ║
╚══════════════════════════════════════════════════════════╝
${colors.reset}`);

// Ensure feedback directory and file exist
const ensureFeedbackFile = () => {
  const dir = path.dirname(feedbackPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(feedbackPath)) {
    fs.writeFileSync(feedbackPath, '[]', 'utf8');
  }
};

// Simulate calling the fake AI backend
const callFakeAIBackend = async (clientData) => {
  try {
    log.ai('🔄 Forwarding client data to AI Backend...');
    log.data(`├─ Client ID: ${clientData.customerId}`);
    log.data(`├─ Name: ${clientData.clientName}`);
    log.data(`├─ Profession: ${clientData.profession}`);
    log.data(`└─ Recommendations: ${clientData.recommendations?.length || 0} products`);

    // In a real scenario, this would be an HTTP request to the Python backend
    // For demo purposes, we'll simulate the response
    const fakeResponse = {
      success: true,
      commercialPitch: {
        personalizedMessage: `Cher(e) ${clientData.clientName},

En tant que ${clientData.profession}, nous avons identifié des opportunités d'amélioration de votre couverture d'assurance qui correspondent parfaitement à votre profil professionnel. Nous avons sélectionné ${clientData.recommendations?.length || 2} produits qui répondent spécifiquement à vos besoins.

${clientData.recommendations?.slice(0, 2).map((rec, i) => `
${i + 1}. **${rec.product?.LIB_PRODUIT?.toUpperCase() || 'ASSURANCE SPECIALISEE'}** (${rec.estimatedPremium || 1500} DT/an)
   ✓ ${rec.reasoning || 'Protection recommandée pour votre profil'}
   ✓ ${rec.expectedBenefit || 'Couverture complète et adaptée'}`).join('') || `
1. **ASSURANCE GROUPE MALADIE** (1800 DT/an)
   ✓ Couverture santé manquante - Protection médicale essentielle
   ✓ Remboursement frais médicaux jusqu'à 200% CNAM

2. **MULTIRISQUE HABITATION** (900 DT/an)
   ✓ Protection du patrimoine immobilier recommandée
   ✓ Protection logement et biens contre tous risques`}

Je serais ravi de vous présenter ces solutions en détail lors d'un rendez-vous à votre convenance. Puis-je vous contacter cette semaine pour programmer notre entretien ?

Cordialement,
Votre conseiller BH Assurance`,
        traceId: `trace_${Date.now()}`,
        model: "llama3.2:1b",
        timestamp: new Date().toISOString()
      }
    };

    log.success('🎯 AI Backend response received');
    log.ai(`├─ Model used: ${fakeResponse.commercialPitch.model}`);
    log.ai(`├─ Trace ID: ${fakeResponse.commercialPitch.traceId}`);
    log.ai(`└─ Message length: ${fakeResponse.commercialPitch.personalizedMessage.length} chars`);

    return fakeResponse;

  } catch (error) {
    log.error(`AI Backend call failed: ${error.message}`);
    return { success: false, error: error.message };
  }
};

// Enhanced API endpoint to generate commercial pitch using AI
app.post('/api/generate-commercial-pitch', async (req, res) => {
  try {
    log.info('📨 Commercial pitch generation request received');
    
    const clientData = {
      customerId: req.body.customerId,
      clientName: req.body.clientName || `Client_${req.body.customerId}`,
      profession: req.body.profession || 'Professionnel',
      recommendations: req.body.recommendations || []
    };

    // Call the fake AI backend
    const aiResponse = await callFakeAIBackend(clientData);

    if (aiResponse.success) {
      log.success('✨ Commercial pitch generated successfully');
      res.json(aiResponse);
    } else {
      log.error('Failed to generate commercial pitch');
      res.status(500).json(aiResponse);
    }

  } catch (error) {
    log.error(`Error in pitch generation: ${error.message}`);
    res.status(500).json({ success: false, error: error.message });
  }
});

// API endpoint to save feedback
app.post('/api/save-feedback', (req, res) => {
  try {
    log.info('💾 Feedback save request received');
    ensureFeedbackFile();
    
    // Read existing feedback
    const existingData = fs.readFileSync(feedbackPath, 'utf8');
    const feedbackArray = JSON.parse(existingData);
    
    // Add new feedback
    feedbackArray.push(req.body);
    
    // Write back to file
    fs.writeFileSync(feedbackPath, JSON.stringify(feedbackArray, null, 2), 'utf8');
    
    log.success(`Feedback saved successfully (Total: ${feedbackArray.length})`);
    res.json({ 
      success: true, 
      message: 'Feedback saved successfully',
      count: feedbackArray.length
    });
  } catch (error) {
    log.error(`Error saving feedback: ${error.message}`);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to save feedback' 
    });
  }
});

// API endpoint to get all feedback
app.get('/api/feedback', (req, res) => {
  try {
    ensureFeedbackFile();
    const data = fs.readFileSync(feedbackPath, 'utf8');
    const feedbackArray = JSON.parse(data);
    res.json(feedbackArray);
  } catch (error) {
    log.error(`Error reading feedback: ${error.message}`);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to read feedback' 
    });
  }
});

app.listen(PORT, () => {
  console.log(`${colors.bright}${colors.green}
🚀 BH Assurance Server running on http://localhost:${PORT}
📡 Endpoints:
   • POST /api/save-feedback - Save client feedback
   • GET  /api/feedback - Get all feedback  
   • POST /api/generate-commercial-pitch - Generate AI pitch
   
💡 Ready to process requests...
${colors.reset}`);
});