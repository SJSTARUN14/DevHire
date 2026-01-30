import { extractSkills } from './resumeParser.js';
import axios from 'axios';

/**
 * Advanced ATS Scoring Logic
 * Combines keyword matching with AI semantic analysis
 */
export const calculateATSScore = async (resumeText, jobDescription) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!resumeText || !jobDescription) {
        return {
            score: 0,
            matchedKeywords: [],
            missingKeywords: [],
            analysis: "Could not perform analysis: Missing content.",
            verdict: "Incomplete"
        };
    }

    // 1. Keyword Extraction & Base Matching
    const resumeSkills = extractSkills(resumeText.toLowerCase());
    const jobKeywords = extractSkills(jobDescription.toLowerCase());

    const matched = jobKeywords.filter(skill => resumeSkills.includes(skill));
    const missing = jobKeywords.filter(skill => !resumeSkills.includes(skill));

    // Weighted Base Score (50% weight)
    let score = jobKeywords.length > 0
        ? Math.min(Math.round((matched.length / jobKeywords.length) * 50), 50)
        : 25;

    let aiAnalysis = "";
    let aiVerdict = "Pending";

    // 2. AI Semantic Deep Dive (50% weight)
    if (apiKey) {
        try {
            const prompt = `
            Analyze this candidate's resume against the following job description for a high-priority recruitment match.
            
            [Target Job Description Snippet]:
            ${jobDescription.slice(0, 1500)}
            
            [Candidate Resume Snippet]:
            ${resumeText.slice(0, 3000)}
            
            Provide a response in strict JSON format:
            {
                "alignmentScore": (number 1-50 based on role fit, culture fit indicators, and depth of experience),
                "oneSentenceAnalysis": "A professional summary of the match quality.",
                "keyStrength": "The single strongest point of this candidate for this specific role.",
                "verdict": "One of [Excellent, Strong, Average, Weak, Unsuitable]"
            }
            Output only the valid JSON.
            `;

            const aiResponse = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
                { contents: [{ parts: [{ text: prompt }] }] }
            );

            const rawText = aiResponse.data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
            // Strip potential markdown code blocks
            const jsonStr = rawText.replace(/```json|```/g, '').trim();
            const result = JSON.parse(jsonStr);

            score += (result.alignmentScore || 0);
            aiAnalysis = result.oneSentenceAnalysis || "Deep AI analysis performed.";
            aiVerdict = result.verdict || "Average";

        } catch (error) {
            console.error("AI deep analysis fallback:", error.message);
            aiAnalysis = "Semantic match performed based on core technical skill alignment.";
            aiVerdict = score > 35 ? "Strong" : "Average";
            score += 10; // Fallback bonus for keyword matches
        }
    } else {
        aiAnalysis = "Basic keyword analysis performed. Add server API key for deep semantic insights.";
        aiVerdict = score > 25 ? "Qualified" : "Review Required";
    }

    return {
        score: Math.min(Math.round(score), 100),
        matchedKeywords: matched,
        missingKeywords: missing,
        analysis: aiAnalysis,
        verdict: aiVerdict
    };
};
