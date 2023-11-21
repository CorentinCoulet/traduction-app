import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import "../styles/Translate.css";

const Translate = () => {
  const [text, setText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('en');
  const [targetLanguage, setTargetLanguage] = useState('fr');
  const [languages, setLanguages] = useState([]);

    useEffect(() => {
        const fetchLanguages = async () => {
        try {
            const response = await axios.get(
            'http://localhost:5000/languages'
            );
            console.log(response.data);
            setLanguages(response.data.languages);
        } catch (error) {
            console.error('Error fetching languages:', error);
        }
        };

        fetchLanguages();
    }, []);


    const handleTranslate = async () => {
        try {
            const response = await axios.post(
              'http://localhost:5000/languages',
              {
                text: text,
                sourceLanguage: sourceLanguage,
                targetLanguage: targetLanguage,
              }
            );
            setTranslatedText(response.data.translatedText);
        } catch (error) {
            console.error('Error translating:', error);
        }
    };
      
    const handleTextChange = (e) => {
        const newText = e.target.value;
        setText(newText);
        setTimeout(() => {
            handleTranslate();
        }, 500);
    }

    return (
        <div className='container'>
            <div className='catTrad'>
                <label>
                    <Select
                        classNamePrefix='selecteur'
                        value={{ value: sourceLanguage, label: sourceLanguage }}
                        onChange={(selectedOption) => setSourceLanguage(selectedOption)}
                        options={(languages.translations || []).map((translation) => ({
                            value: translation.detected_source_language,
                            label: translation.detected_source_language,
                        }))}
                    />
                </label>
                <textarea
                    className='tradArea1'
                    value={text}
                    onChange={handleTextChange}
                    placeholder='Enter text'
                />
            </div>
            <div className='catTrad'>
                <label>
                    <Select
                        classNamePrefix='selecteur'
                        value={{ value: targetLanguage, label: targetLanguage }}
                        onChange={(selectedOption) => setTargetLanguage(selectedOption.value)}
                        options={(languages.translations || []).map((translation) => ({
                            value: translation.detected_source_language,
                            label: translation.detected_source_language,
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
