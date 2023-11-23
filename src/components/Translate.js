import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { debounce } from 'lodash';
import "../styles/Translate.css";

const Translate = () => {
  const [text, setText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('en');
  const [targetLanguage, setTargetLanguage] = useState('fr');
  const [languages, setLanguages] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const glossariesResponse = await axios.get('http://localhost:5000/glossaries');
            if (glossariesResponse.data && glossariesResponse.data.languages) {
                setLanguages(glossariesResponse.data.languages);
                // Sélectionnez automatiquement la première langue comme langue source par défaut
                if (glossariesResponse.data.languages.length > 0) {
                    setSourceLanguage(glossariesResponse.data.languages[0].detected_source_language);
                }
            } else {
                console.error('Invalid response format:', glossariesResponse);
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
                        onChange={(selectedOption) => setSourceLanguage(selectedOption)}
                        options={(languages || []).map((language) => ({
                            value: language.detected_source_language,
                            label: language.detected_source_language,
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
