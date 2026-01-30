import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getMyJobs, reset } from '../redux/slices/jobSlice';
import { Loader2, Edit, Trash2, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../utils/helpers';

const ManageJobs = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { jobs, isLoading, isError, message } = useSelector((state) => state.jobs);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(getMyJobs());
        return () => {
            dispatch(reset());
        };
    }, [dispatch]);

    const myJobs = jobs; // Now jobs are already filtered by backend

    if (isLoading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Manage Jobs</h1>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Posted</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicants</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {myJobs.map((job) => (
                            <tr key={job._id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{job.title}</div>
                                    <div className="text-sm text-gray-500">{job.location}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatDate(job.createdAt)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${job.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {job.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <button
                                        onClick={() => navigate(`/jobs/${job._id}/applicants`)}
                                        className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1"
                                    >
                                        <Users size={16} /> View Applicants
                                    </button>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button className="text-indigo-600 hover:text-indigo-900 mr-4"><Edit size={16} /></button>
                                    <button className="text-red-600 hover:text-red-900"><Trash2 size={16} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {myJobs.length === 0 && (
                    <div className="p-10 text-center text-gray-500">
                        No jobs posted yet.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageJobs;
