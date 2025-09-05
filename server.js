import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

const feedbackPath = path.join(__dirname, 'feedback', 'feedback.json');

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

// API endpoint to save feedback
app.post('/api/save-feedback', (req, res) => {
  try {
    ensureFeedbackFile();
    
    // Read existing feedback
    const existingData = fs.readFileSync(feedbackPath, 'utf8');
    const feedbackArray = JSON.parse(existingData);
    
    // Add new feedback
    feedbackArray.push(req.body);
    
    // Write back to file
    fs.writeFileSync(feedbackPath, JSON.stringify(feedbackArray, null, 2), 'utf8');
    
    res.json({ 
      success: true, 
      message: 'Feedback saved successfully',
      count: feedbackArray.length
    });
  } catch (error) {
    console.error('Error saving feedback:', error);
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
    console.error('Error reading feedback:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to read feedback' 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Feedback server running on http://localhost:${PORT}`);
});