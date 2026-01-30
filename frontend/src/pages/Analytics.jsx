import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getCompanyStats } from '../redux/slices/companySlice';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Briefcase, FileText, Loader2, Calendar } from 'lucide-react';

const Analytics = () => {
    const dispatch = useDispatch();
    const { stats, isLoading } = useSelector((state) => state.company);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(getCompanyStats());
    }, [dispatch]);

    const COLORS = ['#4f46e5', '#8b5cf6', '#ec4899', '#f97316'];

    const jobData = [
        { name: 'Total Jobs', value: stats.totalJobs || 0 },
        { name: 'Active Jobs', value: stats.activeJobs || 0 },
        { name: 'Total Applicants', value: stats.totalApplicants || 0 },
    ];

    const pieData = [
        { name: 'Active', value: stats.activeJobs || 0 },
        { name: 'Closed', value: (stats.totalJobs - stats.activeJobs) || 0 }
    ];

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin text-indigo-600 h-10 w-10" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header>
                <h1 className="text-2xl font-bold text-gray-900">Recruitment Analytics</h1>
                <p className="text-gray-500">Detailed insights for {user.name}</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                            <Briefcase size={20} />
                        </div>
                        <span className="text-sm font-medium text-gray-500">Total Jobs</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalJobs}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                            <Users size={20} />
                        </div>
                        <span className="text-sm font-medium text-gray-500">Total Applicants</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalApplicants}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                            <TrendingUp size={20} />
                        </div>
                        <span className="text-sm font-medium text-gray-500">Avg ATS Score</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{stats.avgATS}%</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                            <Calendar size={20} />
                        </div>
                        <span className="text-sm font-medium text-gray-500">Recently Active</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">Today</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Recruitment Overview</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={jobData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Bar dataKey="value" fill="#4f46e5" radius={[6, 6, 0, 0]} barSize={50} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Job Status Distribution</h3>
                    <div className="h-80 flex flex-col items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="flex gap-6 mt-4">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
                                <span className="text-sm text-gray-600">Active</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                                <span className="text-sm text-gray-600">Closed</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Growth Analysis</h3>
                <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-100 rounded-xl">
                    <div className="text-center">
                        <TrendingUp size={48} className="mx-auto text-gray-300 mb-2" />
                        <p className="text-gray-500">More data required to show growth trends over time.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
