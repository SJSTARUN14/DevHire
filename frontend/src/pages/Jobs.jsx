import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getJobs, reset } from '../redux/slices/jobSlice';
import { Loader2, MapPin, DollarSign, Calendar, CheckCircle, Briefcase } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/helpers';
import axios from 'axios';

const Jobs = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Safely destructure state with defaults
    const jobState = useSelector((state) => state.jobs || {});
    const { jobs = [], isLoading = false, isError = false, message = '' } = jobState;

    const authState = useSelector((state) => state.auth || {});
    const { user = null } = authState;

    const [appliedJobIds, setAppliedJobIds] = useState([]);

    useEffect(() => {
        dispatch(getJobs());
        return () => {
            dispatch(reset());
        };
    }, [dispatch]);

    useEffect(() => {
        const fetchAppliedJobs = async () => {
            if (user && user.role === 'student') {
                try {
                    const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/applications/my`, { withCredentials: true });
                    if (data && Array.isArray(data)) {
                        setAppliedJobIds(data.filter(app => app && app.job).map(app => app.job._id));
                    }
                } catch (error) {
                    console.error("Error fetching applied jobs:", error);
                }
            }
        };
        fetchAppliedJobs();
    }, [user]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin text-indigo-600 h-10 w-10" />
            </div>
        );
    }

    if (isError) {
        return <div className="text-red-500 text-center p-10 bg-white rounded-xl border border-red-100">{message || "Failed to load jobs."}</div>;
    }

    const getSafeCompanyName = (job) => {
        if (!job) return 'Company';
        if (job.companyName && job.companyName !== 'Company') return job.companyName;
        if (job.company?.name) return job.company.name;

        const titleParts = job.title?.split(/ at | - | @ /i) || [];
        if (titleParts.length > 1) return titleParts[titleParts.length - 1].trim();

        return 'Recruiter';
    };

    const getSafeJobTitle = (job) => {
        return job?.title || 'Untitled Position';
    };

    const jobList = Array.isArray(jobs) ? jobs : [];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Latest Job Openings</h1>
                <div className="flex gap-2">
                    <select className="border-gray-200 rounded-lg text-sm bg-white p-2 border shadow-sm">
                        <option>All Types</option>
                        <option>Full-time</option>
                        <option>Part-time</option>
                    </select>
                </div>
            </div>

            <div className="grid gap-6">
                {jobList.length > 0 ? (
                    jobList.map((job) => {
                        if (!job || !job._id) return null;
                        const isApplied = Array.isArray(appliedJobIds) && appliedJobIds.includes(job._id);
                        return (
                            <div key={job._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-xl font-bold text-gray-900">{getSafeJobTitle(job)}</h3>
                                            {isApplied && (
                                                <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                                                    <CheckCircle size={12} /> Applied
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-gray-500 font-bold">
                                            {getSafeCompanyName(job)}
                                        </p>
                                    </div>
                                    <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                        {job.type || 'Full-time'}
                                    </span>
                                </div>

                                <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
                                    <div className="flex items-center gap-1">
                                        <MapPin size={16} />
                                        <span>{job.location || 'Remote'}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <DollarSign size={16} />
                                        <span>
                                            {job.salaryRange && (job.salaryRange.min || job.salaryRange.max)
                                                ? `${job.salaryRange.min ? formatCurrency(job.salaryRange.min) : ''} - ${job.salaryRange.max ? formatCurrency(job.salaryRange.max) : ''}`
                                                : 'Not disclosed'}
                                        </span>
                                    </div>
                                    {job.batch && Array.isArray(job.batch) && job.batch.length > 0 && (
                                        <div className="flex items-center gap-1 text-indigo-600 font-medium">
                                            <Briefcase size={16} />
                                            <span>Batch: {job.batch.join(', ')}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-1">
                                        <Calendar size={16} />
                                        <span>{formatDate(job.createdAt)}</span>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <p className="text-gray-600 line-clamp-2">{job.description || 'No description available.'}</p>
                                </div>

                                <div className="mt-4 flex justify-end">
                                    <button
                                        onClick={() => navigate(`/jobs/${job._id}`)}
                                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 border-dashed">
                        <p className="text-gray-500">No jobs found matching your criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Jobs;
