const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const PORT = 5000;
require('dotenv').config({ path: '../.env' });
const apiKey = process.env.DEEPL_API_KEY;

app.use(cors());
app.use(express.json());

app.get('/glossaries', async (req, res) => {
  try {
      const response = await axios.get(
          'https://api-free.deepl.com/v2/glossary-language-pairs',
          {
              headers: {
                  'Authorization': `DeepL-Auth-Key ${apiKey}`,
              },
          }
      );
      res.json({ glossaries: response.data.supported_languages });
  } catch (error) {
      console.error('Error fetching languages:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/translate', async (req, res) => {
    const { text, targetLanguage, sourceLanguage } = req.body;
  
    try {
      if (!text || !targetLanguage) {
        return res.status(400).json({ error: 'Missing required parameters' });
      }
      const response = await axios.post(
        'https://api-free.deepl.com/v2/translate',
        {
          text: [text],
          target_lang: targetLanguage,
          source_lang: sourceLanguage,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `DeepL-Auth-Key ${apiKey}`,
          },
        }
      );
      console.log(`Translation request: ${text} (${targetLanguage})`);
      res.json({ 
        translatedText: response.data.translations[0].text ,
        detectedSourceLanguage: response.data.translations[0].detectedSourceLanguage,
      });
    } catch (error) {
      console.error('Error fetching languages:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});