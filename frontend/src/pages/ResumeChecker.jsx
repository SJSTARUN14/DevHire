import { useState } from 'react';
import { Upload, CheckCircle, FileText, AlertCircle, Loader2, ArrowRight, Sparkles, TrendingUp } from 'lucide-react';
import api from '../utils/api';

const ResumeChecker = () => {
    const [resume, setResume] = useState(null);
    const [jobDescription, setJobDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const handleCheck = async (e) => {
        e.preventDefault();
        if (!resume || !jobDescription) {
            setError('Please upload a resume and paste a job description.');
            return;
        }
        setError('');
        setLoading(true);

        const formData = new FormData();
        formData.append('resume', resume);
        formData.append('jobDescription', jobDescription);

        try {
            const { data } = await api.post('ats/analyze', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setResult(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">ATS Resume Checker</h1>
            <p className="text-gray-500">
                Optimize your resume before you apply. Upload your resume and paste the job description to get an instant match score and keyword analysis.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                {/* Input Section */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <label className="block text-sm font-bold text-gray-700 mb-4">1. Upload Resume</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-indigo-500 hover:bg-indigo-50 transition-all cursor-pointer relative">
                            <input
                                type="file"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={(e) => setResume(e.target.files[0])}
                                accept=".pdf,.doc,.docx"
                            />
                            <div className="flex flex-col items-center gap-2 text-gray-500">
                                <Upload size={32} />
                                <span className="font-medium">{resume ? resume.name : 'Click to Upload Resume'}</span>
                                <span className="text-xs">PDF or DOCX</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <label className="block text-sm font-bold text-gray-700 mb-4">2. Job Description</label>
                        <textarea
                            className="w-full h-48 rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-4 border resize-none"
                            placeholder="Paste the job description here..."
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                        ></textarea>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-2">
                            <AlertCircle size={20} /> {error}
                        </div>
                    )}

                    <button
                        onClick={handleCheck}
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-shadow shadow-lg shadow-indigo-200 flex justify-center items-center gap-2"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : 'Analyze Match'}
                    </button>
                </div>

                {/* Results Section */}
                <div className="space-y-6">
                    {result ? (
                        <div className="bg-white p-8 rounded-3xl shadow-2xl shadow-indigo-100 border border-indigo-50 animate-in fade-in zoom-in duration-500">
                            <div className="text-center mb-8 relative">
                                <div className="inline-block relative">
                                    <svg className="h-32 w-32 transform -rotate-90">
                                        <circle
                                            cx="64"
                                            cy="64"
                                            r="58"
                                            stroke="currentColor"
                                            strokeWidth="8"
                                            fill="transparent"
                                            className="text-gray-100"
                                        />
                                        <circle
                                            cx="64"
                                            cy="64"
                                            r="58"
                                            stroke="currentColor"
                                            strokeWidth="8"
                                            fill="transparent"
                                            strokeDasharray={364.4}
                                            strokeDashoffset={364.4 - (364.4 * result.score) / 100}
                                            strokeLinecap="round"
                                            className={`transition-all duration-1000 ${result.score > 80 ? 'text-emerald-500' : result.score > 50 ? 'text-amber-500' : 'text-rose-500'}`}
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className={`text-3xl font-black ${result.score > 80 ? 'text-emerald-600' : result.score > 50 ? 'text-amber-600' : 'text-rose-600'}`}>
                                            {result.score}%
                                        </span>
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{result.verdict || "Match"}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-8">
                                {/* Direct Analysis Section */}
                                <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-6 rounded-2xl shadow-lg shadow-indigo-100 text-white">
                                    <div className="flex items-center gap-2 font-black text-xs uppercase tracking-widest opacity-80 mb-2">
                                        <Sparkles size={16} /> AI Recruitment Insights
                                    </div>
                                    <h3 className="text-lg font-black leading-tight mb-4">
                                        {result.analysis}
                                    </h3>
                                    {result.keyStrength && (
                                        <div className="bg-white/10 p-3 rounded-xl border border-white/20 italic text-sm">
                                            <strong>Key Strength:</strong> {result.keyStrength}
                                        </div>
                                    )}
                                </div>

                                {/* Personalized Feedback Section */}
                                {result.feedback && result.feedback.length > 0 && (
                                    <div>
                                        <h3 className="text-gray-900 font-bold mb-4">Improvement Advice</h3>
                                        <ul className="space-y-3">
                                            {result.feedback.map((item, i) => (
                                                <li key={i} className="flex items-start gap-3 text-gray-600 text-sm">
                                                    <div className="mt-1 bg-yellow-100 p-0.5 rounded-full">
                                                        <ArrowRight size={14} className="text-yellow-700" />
                                                    </div>
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <div>
                                    <h3 className="flex items-center gap-2 text-green-700 font-bold mb-3">
                                        <CheckCircle size={20} /> Matched Skills
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {result.matchedKeywords.length > 0 ? (
                                            result.matchedKeywords.map((keyword, i) => (
                                                <span key={i} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                                    {keyword}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-gray-400 italic text-sm">No exact keywords matched.</span>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="flex items-center gap-2 text-red-700 font-bold mb-3">
                                        <AlertCircle size={20} /> Missing Skills
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {result.missingKeywords.length > 0 ? (
                                            result.missingKeywords.map((keyword, i) => (
                                                <span key={i} className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                                                    {keyword}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-green-600 italic text-sm">Great job! You have all the main skills.</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 p-8 text-center min-h-[500px]">
                            <FileText size={48} className="mb-4 opacity-50" />
                            <p>Upload a resume and JD to see <br /> direct AI comparison and advice.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResumeChecker;
