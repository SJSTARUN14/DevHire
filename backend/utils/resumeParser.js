import fs from 'fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');

export const parseResume = async (filePath) => {
    try {
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdf(dataBuffer);
        return data.text;
    } catch (error) {
        console.error('Error parsing PDF:', error);
        return "";
    }
};

const technicalSkills = [
    'react', 'node.js', 'nodejs', 'mongodb', 'express', 'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'sql', 'nosql',
    'aws', 'azure', 'docker', 'kubernetes', 'html', 'css', 'tailwind', 'redux', 'next.js', 'nextjs', 'git', 'github', 'devops',
    'machine learning', 'ai', 'data science', 'rust', 'go', 'php', 'laravel', 'flutter', 'react native', 'vue', 'angular'
];

export const extractSkills = (text) => {
    const lowerText = text.toLowerCase();
    return technicalSkills.filter(skill => lowerText.includes(skill));
};
