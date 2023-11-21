import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import "../styles/Translate.css";

const Translate = () => {
  const [text, setText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('fr');
  const [languages, setLanguages] = useState([]);

    useEffect(() => {
        const fetchLanguages = async () => {
        try {
            const response = await axios.get(
            'http://localhost:5000/languages'
            );
            setLanguages(response.data.languages);
        } catch (error) {
            console.error('Error fetching languages:', error);
        }
        };

        fetchLanguages();
    }, []);

    const handleTranslate = async () => {
        // Ajoutez ici la logique pour traduire le texte
        // Utilisez targetLanguage.value pour obtenir la valeur sélectionnée
      };

    return (
        <div className='container'>
            <div className='catTrad'>
                <label>
                    <Select
                        classNamePrefix='selecteur'
                        value={targetLanguage}
                        onChange={(selectedOption) => setTargetLanguage(selectedOption)}
                        options={languages.map((lang) => ({
                            value: lang.language,
                            label: lang.name,
                        }))}
                    />
                </label>
                <textarea
                    className='tradArea1'
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder='Enter text'
                />
            </div>
            <div className='catTrad'>
                <label>
                    <Select
                        value={translatedText}
                        onChange={(selectedOption) => setTranslatedText(selectedOption)}
                        options={languages.map((lang) => ({
                        value: lang.language,
                        label: lang.name,
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
