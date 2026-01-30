import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getJobApplications, updateApplicationStatus, reset } from '../redux/slices/applicationSlice';
import { Loader2, ArrowLeft, Download, Mail, CheckCircle, XCircle, TrendingUp, User } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { UPLOAD_URL } from '../utils/api';

const JobApplicants = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { applications, isLoading, isError, message } = useSelector((state) => state.applications);

    useEffect(() => {
        dispatch(getJobApplications(id));
        return () => {
            dispatch(reset());
        };
    }, [dispatch, id]);

    const handleStatusUpdate = (appId, status) => {
        if (window.confirm(`Are you sure you want to change the status to ${status}?`)) {
            dispatch(updateApplicationStatus({ id: appId, status }));
            toast.success(`Application marked as ${status}`);
        }
    };

    if (isLoading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>;
    if (isError) return <div className="text-red-500 text-center p-10 font-bold bg-red-50 rounded-2xl m-6 border border-red-100">{message}</div>;

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <button
                    onClick={() => navigate('/manage-jobs')}
                    className="group inline-flex items-center text-gray-500 hover:text-indigo-600 font-semibold transition-all"
                >
                    <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-100 mr-3 group-hover:border-indigo-100 group-hover:bg-indigo-50 transition-all">
                        <ArrowLeft size={18} />
                    </div>
                    Back to Job Management
                </button>

                <div className="flex items-center gap-3">
                    <div className="bg-indigo-600 text-white px-4 py-2 rounded-2xl text-sm font-black shadow-lg shadow-indigo-100 flex items-center gap-2">
                        <User size={16} /> {applications.length} TOTAL APPLICANTS
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-xl shadow-gray-100/50 border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-50 bg-gray-50/30">
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">Application Review Board</h1>
                    <p className="text-gray-500 text-sm font-medium">Ranked by AI-Semantic Match Match Score</p>
                </div>

                <ul className="divide-y divide-gray-100">
                    {applications.map((app) => (
                        <li key={app._id} className="p-8 hover:bg-gray-50/50 transition-all group">
                            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8">
                                <div className="flex items-center gap-6">
                                    <div className="relative">
                                        <div className="h-16 w-16 bg-gradient-to-br from-indigo-500 to-violet-700 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-indigo-100 group-hover:scale-105 transition-transform">
                                            {app.applicant.name.charAt(0)}
                                        </div>
                                        <div className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-2 border-white ${app.status === 'shortlisted' ? 'bg-emerald-500' : app.status === 'rejected' ? 'bg-rose-500' : 'bg-blue-500'}`} />
                                    </div>

                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-xl font-black text-gray-900">{app.applicant.name}</h3>
                                            <span className={`px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest rounded-lg border-2 ${app.status === 'shortlisted' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' :
                                                app.status === 'rejected' ? 'bg-rose-50 border-rose-100 text-rose-700' :
                                                    'bg-blue-50 border-blue-100 text-blue-700'
                                                }`}>
                                                {app.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-gray-500 font-bold">
                                            <span className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors cursor-pointer">
                                                <Mail size={16} /> {app.applicant.email}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row sm:items-center gap-8">
                                    {/* Advanced Stats */}
                                    <div className="flex items-center gap-5 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                                        <div className="text-right">
                                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 leading-none">AI Fit Match</div>
                                            <div className={`text-3xl font-black leading-none ${app.atsScore > 80 ? 'text-emerald-600' : app.atsScore > 50 ? 'text-amber-500' : 'text-rose-500'
                                                }`}>
                                                {app.atsScore}%
                                            </div>
                                        </div>
                                        <div className="w-1.5 h-12 bg-gray-50 rounded-full overflow-hidden flex flex-col justify-end">
                                            <div
                                                className={`w-full transition-all duration-1000 origin-bottom ${app.atsScore > 80 ? 'bg-emerald-500' : app.atsScore > 50 ? 'bg-amber-500' : 'bg-rose-500'
                                                    }`}
                                                style={{ height: `${app.atsScore}%` }}
                                            />
                                        </div>
                                        {app.matchDetails?.matchedSkills?.length > 0 && (
                                            <div className="hidden md:block max-w-[150px]">
                                                <div className="text-[9px] font-black text-gray-400 uppercase tracking-tight mb-1">Key Strengths</div>
                                                <div className="flex flex-wrap gap-1">
                                                    {app.matchDetails.matchedSkills.slice(0, 3).map((s, idx) => (
                                                        <span key={idx} className="text-[8px] font-bold bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded-md uppercase border border-indigo-100">{s}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Control Panel */}
                                    <div className="flex items-center gap-1.5 p-1 bg-white border border-gray-100 rounded-2xl shadow-sm">
                                        <a
                                            href={`${UPLOAD_URL}/${app.resume}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="p-3 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                                            title="Download Resume"
                                        >
                                            <Download size={22} />
                                        </a>
                                        <div className="w-px h-8 bg-gray-50" />
                                        <button
                                            onClick={() => handleStatusUpdate(app._id, 'shortlisted')}
                                            className={`p-3 rounded-xl transition-all ${app.status === 'shortlisted' ? 'text-emerald-600 bg-emerald-50 shadow-inner' : 'text-gray-400 hover:text-emerald-600 hover:bg-emerald-50'
                                                }`}
                                            title="Shortlist Applicant"
                                        >
                                            <CheckCircle size={22} />
                                        </button>
                                        <button
                                            onClick={() => handleStatusUpdate(app._id, 'rejected')}
                                            className={`p-3 rounded-xl transition-all ${app.status === 'rejected' ? 'text-rose-600 bg-rose-50 shadow-inner' : 'text-gray-400 hover:text-rose-600 hover:bg-rose-50'
                                                }`}
                                            title="Decline Applicant"
                                        >
                                            <XCircle size={22} />
                                        </button>
                                        <div className="w-px h-8 bg-gray-50" />
                                        <button
                                            className="p-3 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                                            onClick={() => window.location.href = `mailto:${app.applicant.email}`}
                                        >
                                            <Mail size={22} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                    {applications.length === 0 && (
                        <div className="p-20 text-center space-y-4">
                            <div className="inline-flex p-6 bg-gray-50 rounded-full text-gray-200">
                                <User size={60} />
                            </div>
                            <h2 className="text-xl font-bold text-gray-400">No applicants yet.</h2>
                            <p className="text-gray-400 text-sm max-w-xs mx-auto">Once freshers apply for this role, they will appear here ranked by AI match score.</p>
                        </div>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default JobApplicants;
