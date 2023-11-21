const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const PORT = 5000;

app.use(cors);
app.use(express.json()); 

app.post('/translate', async (req, res) => {
    const { text, targetLanguage } = req.body;
  
    try {
      const response = await axios.post(
        'https://api-free.deepl.com/v2/translate',
        {
          text: [text],
          target_lang: targetLanguage,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'DeepL-Auth-Key 3a74daaa-6d67-96d8-22e5-fe528148d570:fx',
            'User-Agent': 'Translate/react@18.2.0',
          },
        }
      );
  
      res.json({ translatedText: response.data.translations[0].text });
    } catch (error) {
      console.error('Error translating:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
