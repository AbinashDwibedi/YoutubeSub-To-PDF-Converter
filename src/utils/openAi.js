
import OpenAI from 'openai';  

import fs from 'fs';
import PDFDocument from 'pdfkit';

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI,  
  engine: 'text-davinci-003'      
});

export const openAi = async function processText(inputText) {
  try {
    const response = await openai.completions.create({
      prompt: `Please correct the grammar, punctuation, and enhance the following text:\n\n${inputText}`,
      max_tokens: 1500,
      temperature: 0.7,
    });
    return response.choices[0].text.trim(); 
  } catch (error) {
    console.error('Error with OpenAI API:', error);
    throw error;
  }
}
