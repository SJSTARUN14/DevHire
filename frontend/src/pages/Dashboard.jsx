import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import api from '../utils/api';
import { Briefcase, FileText, MessageSquare, TrendingUp } from 'lucide-react';
import CompanyDashboard from './CompanyDashboard';
import toast from 'react-hot-toast';

const Dashboard = () => {
    const { user } = useSelector((state) => state.auth);
    const [stats, setStats] = useState({
        totalApplications: 0,
        activeJobs: 0,
        profileViews: 0,
        messages: 0
    });

    useEffect(() => {
        if (user?.role === 'student') {
            const fetchStats = async () => {
                try {
                    const { data } = await api.get('users/stats');
                    setStats(data);
                } catch (error) {
                    const message = error.response?.data?.message || error.message || "Could not fetch stats";
                    toast.error(message);
                    console.error("Error fetching stats:", error);
                }
            };
            fetchStats();
        }
    }, [user]);

    if (user?.role === 'recruiter' || user?.role === 'admin' || user?.role === 'company') {
        return <CompanyDashboard user={user} />;
    }

    return (
        <div className="space-y-6">
            <header className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                    <div className="flex items-center gap-2">
                        <p className="text-gray-500 text-sm">Welcome back, {user?.name}!</p>
                        {user?.role === 'admin' && (
                            <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] font-bold rounded-full uppercase">
                                Admin Panel
                            </span>
                        )}
                    </div>
                </div>
            </header>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {user?.role === 'student' ? (
                    <>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                                    <FileText size={24} />
                                </div>
                                <h3 className="text-gray-500 text-sm font-medium">Total Applications</h3>
                            </div>
                            <p className="text-3xl font-bold text-gray-900">{stats.totalApplications}</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                                    <TrendingUp size={24} />
                                </div>
                                <h3 className="text-gray-500 text-sm font-medium">Profile Views</h3>
                            </div>
                            <p className="text-3xl font-bold text-gray-900">{stats.profileViews || 0}</p>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                                    <Briefcase size={24} />
                                </div>
                                <h3 className="text-gray-500 text-sm font-medium">Active Jobs</h3>
                            </div>
                            <p className="text-3xl font-bold text-gray-900">{stats.activeJobs}</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                                    <FileText size={24} />
                                </div>
                                <h3 className="text-gray-500 text-sm font-medium">Total Applicants</h3>
                            </div>
                            <p className="text-3xl font-bold text-gray-900">{stats.totalApplications}</p>
                        </div>
                    </>
                )}

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-orange-50 text-orange-600 rounded-lg">
                            <MessageSquare size={24} />
                        </div>
                        <h3 className="text-gray-500 text-sm font-medium">Messages</h3>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{stats.messages || 0}</p>
                </div>
            </div>

            {/* Recent Activity Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h2>
                <div className="space-y-4">
                    <p className="text-gray-500 text-sm">No recent activity to show.</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
