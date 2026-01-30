import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createJob, reset } from '../redux/slices/jobSlice';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const PostJob = () => {
    const [formData, setFormData] = useState({
        title: '',
        companyName: '', // New
        companyLinkedinUrl: '', // New
        description: '',
        requirements: '',
        location: '',
        type: 'Full-time',
        minSalary: '',
        maxSalary: '',
        applicationLink: '',
        batch: '',
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLoading, isCreateSuccess, isError, message } = useSelector((state) => state.jobs);

    useEffect(() => {
        if (isCreateSuccess) {
            toast.success('Job posted successfully!');
            navigate('/manage-jobs');
            dispatch(reset());
        }
    }, [isCreateSuccess, navigate, dispatch]);

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = (e) => {
        e.preventDefault();
        const jobData = {
            ...formData,
            salaryRange: {
                min: formData.minSalary ? Number(formData.minSalary) : undefined,
                max: formData.maxSalary ? Number(formData.maxSalary) : undefined
            },
            requirements: formData.requirements ? formData.requirements.split(',').map(skill => skill.trim()) : [],
            batch: formData.batch ? formData.batch.split(',').map(b => b.trim()) : []
        };
        dispatch(createJob(jobData));
    };

    return (
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Post a New Job</h1>
                <span className="text-xs text-gray-500">* Title and Description are recommended</span>
            </div>

            {isError && <div className="text-red-500 mb-4 bg-red-50 p-3 rounded-lg border border-red-100">{message}</div>}

            <form onSubmit={onSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
                        <input
                            type="text"
                            name="title"
                            required
                            className="w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border"
                            value={formData.title}
                            onChange={onChange}
                            placeholder="e.g. Software Engineer I"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
                        <input
                            type="text"
                            name="companyName"
                            required
                            className="w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border"
                            value={formData.companyName}
                            onChange={onChange}
                            placeholder="e.g. Intuit"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Target Batch (Optional)</label>
                        <input
                            type="text"
                            name="batch"
                            placeholder="e.g. 2024, 2025"
                            className="w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border"
                            value={formData.batch}
                            onChange={onChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location (Optional)</label>
                        <input
                            type="text"
                            name="location"
                            className="w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border"
                            value={formData.location}
                            onChange={onChange}
                            placeholder="e.g. Bengaluru, India"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Company LinkedIn URL (Optional)</label>
                        <input
                            type="url"
                            name="companyLinkedinUrl"
                            placeholder="https://linkedin.com/company/..."
                            className="w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border"
                            value={formData.companyLinkedinUrl}
                            onChange={onChange}
                        />
                        <p className="text-[10px] text-gray-400 mt-1">Used for "Ask for Referral" feature</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Application Link (Optional)</label>
                        <input
                            type="url"
                            name="applicationLink"
                            className="w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border"
                            value={formData.applicationLink}
                            onChange={onChange}
                            placeholder="Official Career Page Link"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Job Type (Optional)</label>
                        <select
                            name="type"
                            className="w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border"
                            value={formData.type}
                            onChange={onChange}
                        >
                            <option value="">Select Type</option>
                            <option>Full-time</option>
                            <option>Part-time</option>
                            <option>Contract</option>
                            <option>Internship</option>
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 text-xs text-gray-400 font-bold uppercase tracking-wider">Min Salary (Optional)</label>
                            <input
                                type="number"
                                name="minSalary"
                                className="w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border"
                                value={formData.minSalary}
                                onChange={onChange}
                                placeholder="INR"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 text-xs text-gray-400 font-bold uppercase tracking-wider">Max Salary (Optional)</label>
                            <input
                                type="number"
                                name="maxSalary"
                                className="w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border"
                                value={formData.maxSalary}
                                onChange={onChange}
                                placeholder="INR"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 text-gray-400 font-bold uppercase tracking-wider text-xs">Required Skills (Optional)</label>
                    <input
                        type="text"
                        name="requirements"
                        className="w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border"
                        value={formData.requirements}
                        onChange={onChange}
                        placeholder="e.g. React, Java, SQL..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Description *</label>
                    <p className="text-xs text-gray-500 mb-2 font-medium">You can paste the full JD here including company details, responsibilities, etc.</p>
                    <textarea
                        name="description"
                        required
                        rows="12"
                        className="w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-4 border resize-y"
                        value={formData.description}
                        onChange={onChange}
                        placeholder="Paste full job description..."
                    ></textarea>
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-100">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-indigo-600 text-white px-10 py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 disabled:opacity-70 flex items-center gap-2"
                    >
                        {isLoading ? <Loader2 className="animate-spin" /> : 'Post Job Now'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PostJob;
