import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { debounce } from 'lodash';
import "../styles/Translate.css";

const Translate = () => {
  const [text, setText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('fr');
  const [languages, setLanguages] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/glossaries');
        if (response.data && response.data.glossaries) {
          const uniqueLanguages = Array.from(new Set(response.data.glossaries.map(lang => lang.source_lang)))
            .map(languageCode => ({
              code: languageCode,
              label: response.data.glossaries.find(lang => lang.source_lang === languageCode).language,
            }));
          setLanguages(uniqueLanguages);
          if (uniqueLanguages.length > 0) {
            setSourceLanguage(uniqueLanguages[0].code);
          }
        } else {
          console.error('Invalid response format:', response);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

    const handleTranslate = debounce(async () => {
        try {
            const translationResponse = await axios.post('http://localhost:5000/translate', {
                text: text,
                sourceLanguage: sourceLanguage,
                targetLanguage: targetLanguage,
            });
            setTranslatedText(translationResponse.data.translatedText);
        } catch (error) {
            console.error('Error translating:', error);
        }
    }, 500);

    const handleTextChange = (e) => {
        const newText = e.target.value;
        setText(newText);
        handleTranslate();
    };

    return (
        <div className='container'>
            <div className='catTrad'>
                <label>
                    <Select
                        classNamePrefix='selecteur'
                        value={{ value: sourceLanguage, label: sourceLanguage }}
                        onChange={(selectedOption) => setSourceLanguage(selectedOption.value)}
                        options={(languages || []).map((language) => ({
                            value: language.code,
                            label: language.label,
                        }))}
                    />
                </label>
                <textarea
                    className='tradArea1'
                    value={text}
                    placeholder='Enter text'
                    onChange={handleTextChange}
                />
            </div>
            <div className='catTrad'>
                <label>
                    <Select
                        classNamePrefix='selecteur'
                        value={{ value: targetLanguage, label: targetLanguage }}
                        onChange={(selectedOption) => setTargetLanguage(selectedOption.value)}
                        options={(languages || []).map((language) => ({
                            value: language.code,
                            label: language.label,
                        }))}
                    />
                </label>
                <textarea 
                    className='tradArea2' 
                    type='text' 
                    value={translatedText}
                    placeholder='Translation' 
                    disabled 
                />
            </div>
        </div>
    );
};

export default Translate;
