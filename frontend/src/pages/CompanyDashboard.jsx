import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getCompanyStats } from '../redux/slices/companySlice';
import { Users, Briefcase, FileText, CheckCircle, BarChart as BarChartIcon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CompanyDashboard = ({ user }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { stats, isLoading } = useSelector((state) => state.company);

    useEffect(() => {
        dispatch(getCompanyStats());
    }, [dispatch]);

    const data = [
        { name: 'Total Jobs', value: stats.totalJobs },
        { name: 'Active Jobs', value: stats.activeJobs },
        { name: 'Total Applicants', value: stats.totalApplicants },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Recruiter Overview</h1>
                    <p className="text-gray-500">Welcome back, {user.name}!</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => navigate('/post-job')}
                        className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                    >
                        <Briefcase size={18} /> Post Job
                    </button>
                    <button
                        onClick={() => navigate('/manage-jobs')}
                        className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-xl font-bold hover:bg-gray-50 transition-all"
                    >
                        <FileText size={18} /> Manage Jobs
                    </button>
                </div>
            </header>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">


                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transform hover:scale-105 transition-transform">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                            <Briefcase size={24} />
                        </div>
                        <h3 className="text-gray-500 text-sm font-medium">Active Jobs</h3>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{stats.activeJobs}</p>
                    <span className="text-xs text-gray-400">out of {stats.totalJobs} posted</span>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transform hover:scale-105 transition-transform">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                            <FileText size={24} />
                        </div>
                        <h3 className="text-gray-500 text-sm font-medium">Total Applicants</h3>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 uppercase">
                        {stats.totalApplicants}
                    </p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transform hover:scale-105 transition-transform">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                            <CheckCircle size={24} />
                        </div>
                        <h3 className="text-gray-500 text-sm font-medium">Avg ATS Score</h3>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{stats.avgATS}%</p>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                        <div className="bg-purple-600 h-1.5 rounded-full" style={{ width: `${stats.avgATS}%` }}></div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Chart Section */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <BarChartIcon size={20} /> Recruitment Activity
                    </h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Bar dataKey="value" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Activity Feed */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Recent Activity</h3>
                    <div className="space-y-6">
                        <p className="text-gray-500 text-sm">No recent activity to show.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyDashboard;
