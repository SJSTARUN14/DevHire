import { parseResume } from '../utils/resumeParser.js';
import { calculateATSScore } from '../utils/atsScoring.js';
import fs from 'fs';




const analyzeResume = async (req, res) => {
    try {
        const { jobDescription } = req.body;
        const resumePath = req.file ? req.file.path : null;

        if (!resumePath || !jobDescription) {
            return res.status(400).json({ message: 'Resume and Job Description are required' });
        }

        const resumeText = await parseResume(resumePath);
        const atsResult = await calculateATSScore(resumeText, jobDescription);

        
        

        res.json({
            score: atsResult.score,
            matchedKeywords: atsResult.matchedKeywords,
            missingKeywords: atsResult.missingKeywords,
            resumeKeywords: atsResult.resumeKeywords 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

export { analyzeResume };
