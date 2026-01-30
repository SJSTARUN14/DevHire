import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getMyApplications, reset } from '../redux/slices/applicationSlice';
import { Loader2, Calendar, MapPin, CheckCircle, Clock, XCircle, FileText, TrendingUp } from 'lucide-react';
import { formatDate } from '../utils/helpers';
import { UPLOAD_URL } from '../utils/api';

const MyApplications = () => {
    const dispatch = useDispatch();
    const { applications, isLoading, isError, message } = useSelector((state) => state.applications);

    useEffect(() => {
        dispatch(getMyApplications());
        return () => {
            dispatch(reset());
        };
    }, [dispatch]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'applied': return 'bg-blue-100 text-blue-700';
            case 'shortlisted': return 'bg-green-100 text-green-700';
            case 'rejected': return 'bg-red-100 text-red-700';
            case 'hired': return 'bg-indigo-100 text-indigo-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'shortlisted': return <CheckCircle size={16} />;
            case 'rejected': return <XCircle size={16} />;
            default: return <Clock size={16} />;
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin text-indigo-600 h-10 w-10" />
            </div>
        );
    }

    if (isError) {
        return <div className="text-red-500 text-center">{message}</div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>

            <div className="grid gap-6">
                {applications.map((app) => (
                    <div key={app._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between gap-6 hover:shadow-md transition-all">
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">{app.job.title}</h3>
                                    <p className="text-gray-500 font-medium">{app.job.company?.name || 'Company Name'}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-2 ${getStatusColor(app.status)}`}>
                                    {getStatusIcon(app.status)}
                                    {app.status}
                                </span>
                            </div>

                            <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                    <MapPin size={16} />
                                    <span>{app.job.location}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Calendar size={16} />
                                    <span>Applied on {formatDate(app.createdAt)}</span>
                                </div>
                            </div>

                            {/* Advanced AI Insight */}
                            <div className="mt-6 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                                        <TrendingUp size={12} /> AI Performance Insight
                                    </span>
                                    <span className={`text-xs font-black ${app.atsScore > 70 ? 'text-emerald-600' : 'text-amber-600'}`}>
                                        {app.atsScore}% MATCH
                                    </span>
                                </div>
                                <div className="w-full bg-indigo-100/50 rounded-full h-1.5 mb-2 overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-1000 ${app.atsScore > 70 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                                        style={{ width: `${app.atsScore}%` }}
                                    ></div>
                                </div>
                                {app.matchDetails?.analysis && (
                                    <p className="text-xs text-indigo-900/80 font-semibold leading-relaxed">
                                        "{app.matchDetails.analysis}"
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col justify-center border-l pl-0 md:pl-6 border-gray-100 gap-2">
                            <a
                                href={`${UPLOAD_URL}/${app.resume}`}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                            >
                                <FileText size={16} /> View Resume
                            </a>
                        </div>
                    </div>
                ))}

                {applications.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 border-dashed">
                        <p className="text-gray-500">You haven't applied to any jobs yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyApplications;
