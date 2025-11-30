import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase = null;
if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
}

app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, message, subject } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ 
        error: 'Name, email, and message are required' 
      });
    }

    if (supabase) {
      const { data, error } = await supabase
        .from('contact_submissions')
        .insert([
          {
            name,
            email,
            phone: phone || null,
            subject: subject || 'General Inquiry',
            message,
            created_at: new Date().toISOString()
          }
        ])
        .select();

      if (error) {
        console.error('Supabase error:', error);
        return res.status(500).json({ error: 'Failed to save contact form' });
      }

      return res.json({ 
        success: true, 
        message: 'Contact form submitted successfully',
        data 
      });
    }

    console.log('Contact form submission:', { name, email, phone, subject, message });
    
    res.json({ 
      success: true, 
      message: 'Contact form submitted successfully (logged only)' 
    });
  } catch (error) {
    console.error('Error processing contact form:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  if (!supabase) {
    console.log('Warning: Supabase not configured. Some features may not work.');
  }
});

