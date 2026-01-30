import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useDispatch, useSelector } from 'react-redux';
import { applyForJob, applyExternalJob } from '../redux/slices/applicationSlice';
import { Loader2, MapPin, DollarSign, Calendar, Building, Briefcase, ArrowLeft, CheckCircle, Upload, Users, Share2, Linkedin, Sparkles, FileText, GraduationCap } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/helpers';
import { toast } from 'react-hot-toast';

const JobDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [resume, setResume] = useState(null);
    const [showApplyModal, setShowApplyModal] = useState(false);
    const [showExternalConfirm, setShowExternalConfirm] = useState(false);
    const [hasApplied, setHasApplied] = useState(false);

    const { isLoading: isApplying, isSuccess, isError, message } = useSelector(state => state.applications);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const { data } = await api.get(`/jobs/${id}`);
                setJob(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchJob();
    }, [id]);

    useEffect(() => {
        const checkStatus = async () => {
            if (user && user.role === 'student') {
                try {
                    const { data } = await api.get(`/applications/check/${id}`);
                    setHasApplied(data.applied);
                } catch (error) {
                    console.error("Error checking application status:", error);
                }
            }
        };
        checkStatus();
    }, [id, user]);

    useEffect(() => {
        if (isSuccess && showApplyModal) {
            setShowApplyModal(false);
            setHasApplied(true);
        }
    }, [isSuccess]);

    const handleApply = (e) => {
        e.preventDefault();
        if (!resume) return;
        dispatch(applyForJob({ jobId: id, resume }));
    };

    const handleExternalApply = () => {
        window.open(job.applicationLink, '_blank', 'noopener,noreferrer');
        setShowExternalConfirm(true);
    };

    const confirmExternalApply = () => {
        dispatch(applyExternalJob({ jobId: id }));
        setShowExternalConfirm(false);
        setHasApplied(true);
    };

    const handleLinkedinReferral = () => {
        const company = displayCompanyName;
        // Construct a highly filtered LinkedIn search for recruiters at the company
        const url = `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(company)}+recruiter&origin=GLOBAL_SEARCH_HEADER`;
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    // Move helpers up to avoid temporal dead zone issues
    const getSafeCompanyName = () => {
        if (!job) return 'Company';
        if (job.companyName && job.companyName !== 'Company') return job.companyName;
        if (job.company?.name) return job.company.name;

        const titleParts = job.title?.split(/ at | - | @ /i) || [];
        if (titleParts.length > 1) return titleParts[titleParts.length - 1].trim();

        return 'Company';
    };

    const displayCompanyName = getSafeCompanyName();



    if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;
    if (!job) return <div className="p-10 text-center">Job not found</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-indigo-600 transition-colors">
                <ArrowLeft size={20} className="mr-1" /> Back to Jobs
            </button>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-100">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
                            <div className="flex items-center gap-2 mt-2 text-gray-600 font-bold text-xl">
                                <Building size={20} className="text-indigo-600" />
                                <span>{displayCompanyName}</span>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                            <button
                                onClick={handleLinkedinReferral}
                                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all border-2 border-indigo-100 text-indigo-700 hover:bg-indigo-50"
                            >
                                <Linkedin size={18} /> Contact Recruiter
                            </button>
                            {user?.role === 'student' && (
                                <button
                                    disabled={hasApplied}
                                    onClick={() => {
                                        if (job.applicationLink) {
                                            handleExternalApply();
                                        } else {
                                            setShowApplyModal(true);
                                        }
                                    }}
                                    className={`px-8 py-3 rounded-xl font-bold transition-all shadow-lg ${hasApplied
                                        ? 'bg-green-50 text-green-600 border-2 border-green-100 shadow-none'
                                        : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200'
                                        }`}
                                >
                                    {hasApplied ? (
                                        <span className="flex items-center gap-2">
                                            <CheckCircle size={18} /> Applied
                                        </span>
                                    ) : (
                                        'Apply Now'
                                    )}
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-6 mt-6 text-gray-600">
                        <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
                            <Briefcase size={18} />
                            <span>{job.type || 'Full-time'}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
                            <MapPin size={18} />
                            <span>{job.location || 'Remote'}</span>
                        </div>
                        {job.salaryRange?.min || job.salaryRange?.max ? (
                            <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
                                <DollarSign size={18} />
                                <span>{job.salaryRange.min ? formatCurrency(job.salaryRange.min) : ''} - {job.salaryRange.max ? formatCurrency(job.salaryRange.max) : ''}</span>
                            </div>
                        ) : null}
                        {job.batch && job.batch.length > 0 && (
                            <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
                                <Users size={18} className="text-indigo-600" />
                                <span>Batch: {job.batch.join(', ')}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
                            <Calendar size={18} />
                            <span>Posted {formatDate(job.createdAt)}</span>
                        </div>
                    </div>
                </div>

                {(user?.role === 'student' || user?.role === 'admin' || user?.role === 'recruiter') && (
                    <div className="p-8 bg-indigo-50/50 border-b border-indigo-100">
                        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
                            <div>
                                <h3 className="text-xl font-black text-gray-900 flex items-center gap-2 uppercase tracking-tight">
                                    <Sparkles size={24} className="text-indigo-600" />
                                    Ask for Referral Format
                                </h3>
                                <p className="text-sm text-gray-500 font-medium">Use this professional template to reach out to recruiters on LinkedIn.</p>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-3xl border border-indigo-100 shadow-xl shadow-indigo-100/20 relative group overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-600"></div>
                            <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed text-base">
                                {`Hi [Recipient Name],

I came across the ${job.title} role at ${displayCompanyName} in ${job.location || 'Remote'} (JOB ID: ${job._id}) and I’m very interested in this opportunity.

It would really help me if you could consider referring me for this role.

Thank you,
${user?.name || '[My Name]'}`}
                            </pre>
                            <button
                                onClick={() => {
                                    const text = `Hi [Recipient Name],\n\nI came across the ${job.title} role at ${displayCompanyName} in ${job.location || 'Remote'} (JOB ID: ${job._id}) and I’m very interested in this opportunity.\n\nIt would really help me if you could consider referring me for this role.\n\nThank you,\n${user?.name || '[My Name]'}`;
                                    navigator.clipboard.writeText(text);
                                    toast.success("Referral format copied!");
                                }}
                                className="absolute top-6 right-6 p-4 text-white bg-indigo-600 hover:bg-indigo-700 rounded-2xl transition-all shadow-lg hover:scale-105 active:scale-95 flex items-center gap-2 font-bold text-sm"
                                title="Copy to clipboard"
                            >
                                <FileText size={20} /> COPY MESSAGE
                            </button>
                        </div>

                        <div className="mt-4 flex items-center gap-2 text-[10px] font-black text-indigo-400 uppercase tracking-widest bg-white/50 w-fit px-3 py-1 rounded-full border border-indigo-50">
                            <CheckCircle size={10} /> Ready to send on LinkedIn
                        </div>
                    </div>
                )}

                <div className="p-8 space-y-8">
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Job Description</h2>
                        <div className="prose text-gray-600 whitespace-pre-wrap">
                            {job.description}
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Requirements & Skills</h2>
                        <div className="flex flex-wrap gap-2">
                            {job.requirements && job.requirements.length > 0 ? (
                                job.requirements.map((req, index) => (
                                    <span key={index} className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg text-sm font-medium">
                                        {req}
                                    </span>
                                ))
                            ) : (
                                <span className="text-gray-500 italic text-sm">No specific requirements listed.</span>
                            )}
                        </div>
                    </section>
                </div>
            </div>

            {/* Application Modal */}
            {
                showApplyModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                            <h2 className="text-2xl font-bold mb-4">Apply for {job.title}</h2>
                            <p className="text-gray-500 mb-6">Upload your resume to continue as a Fresher. Our ATS will analyze your skills match instantly.</p>

                            {isError && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{message}</div>}
                            {isSuccess && <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-4 text-sm flex items-center gap-2"><CheckCircle size={16} /> Application Sent!</div>}

                            <form onSubmit={handleApply} className="space-y-4">
                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-indigo-500 hover:bg-indigo-50 transition-all cursor-pointer relative">
                                    <input
                                        type="file"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={(e) => setResume(e.target.files[0])}
                                        accept=".pdf,.doc,.docx"
                                        required
                                    />
                                    <div className="flex flex-col items-center gap-2 text-gray-500">
                                        <Upload size={32} />
                                        <span className="font-medium">{resume ? resume.name : 'Click to Upload Resume'}</span>
                                        <span className="text-xs">PDF or DOCX (Max 5MB)</span>
                                    </div>
                                </div>

                                <div className="flex gap-3 justify-end mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setShowApplyModal(false)}
                                        className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={!resume || isApplying}
                                        className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {isApplying ? <Loader2 className="animate-spin" size={18} /> : 'Submit Application'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }

            {/* External Application Confirmation Modal */}
            {
                showExternalConfirm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <div className="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                            <div className="text-center">
                                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6 animate-bounce">
                                    <CheckCircle className="h-8 w-8 text-green-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Did you apply?</h2>
                                <p className="text-gray-500 mb-8">
                                    We've opened the company page in a new tab. Once you finish the application there, please confirm so we can track it for you.
                                </p>
                            </div>

                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={confirmExternalApply}
                                    className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
                                >
                                    <CheckCircle size={20} /> Yes, I have applied
                                </button>
                                <button
                                    onClick={() => {
                                        setShowExternalConfirm(false);
                                        toast("Don't forget to mark it as applied later!", { icon: '📝' });
                                    }}
                                    className="w-full bg-white text-gray-600 py-3 rounded-xl font-medium border border-gray-200 hover:bg-gray-50 transition-all"
                                >
                                    I'll do it later / Not yet
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default JobDetails;
