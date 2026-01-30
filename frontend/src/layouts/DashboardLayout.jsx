import { useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import { LayoutDashboard, Briefcase, FileText, Settings, LogOut, Users, Building, PlusCircle } from 'lucide-react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const DashboardLayout = () => {
    const authState = useSelector((state) => state.auth || {});
    const { user } = authState;
    const location = useLocation();

    if (!user) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    const isActive = (path) => {
        return location.pathname === path ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900';
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <div className="flex flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 gap-8">
                {/* Sidebar */}
                <aside className="w-64 flex-shrink-0">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
                        <div className="p-6 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                                    {user.name ? user.name.charAt(0) : '?'}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 truncate w-32">{user.name || 'User'}</h3>
                                    {user.role === 'admin' ? (
                                        <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Admin Panel</p>
                                    ) : user.role === 'company' || user.role === 'recruiter' ? (
                                        <p className="text-[10px] text-indigo-400 font-medium uppercase tracking-wider italic">Recruiter</p>
                                    ) : (
                                        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider italic">Fresher</p>
                                    )}
                                </div>
                            </div>
                        </div>
                        <nav className="p-4 space-y-1">
                            <Link to="/dashboard" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${isActive('/dashboard')}`}>
                                <LayoutDashboard size={20} />
                                <span>Overview</span>
                            </Link>

                            {user.role === 'student' && (
                                <>
                                    <Link to="/jobs" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${isActive('/jobs')}`}>
                                        <Briefcase size={20} />
                                        <span>Find Jobs</span>
                                    </Link>
                                    <Link to="/my-applications" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${isActive('/my-applications')}`}>
                                        <FileText size={20} />
                                        <span>My Applications</span>
                                    </Link>
                                    <Link to="/resume-checker" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${isActive('/resume-checker')}`}>
                                        <FileText size={20} />
                                        <span>Resume Checker</span>
                                    </Link>
                                </>
                            )}

                            {(user.role === 'company' || user.role === 'recruiter' || user.role === 'admin') && (
                                <>
                                    <Link to="/post-job" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${isActive('/post-job')}`}>
                                        <PlusCircle size={20} />
                                        <span>Post New Job</span>
                                    </Link>
                                    <Link to="/manage-jobs" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${isActive('/manage-jobs')}`}>
                                        <Briefcase size={20} />
                                        <span>Manage Jobs</span>
                                    </Link>
                                    {(user.role === 'company' || user.role === 'recruiter' || user.role === 'admin') && (
                                        <Link to="/analytics" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${isActive('/analytics')}`}>
                                            <Building size={20} />
                                            <span>Analytics</span>
                                        </Link>
                                    )}
                                </>
                            )}

                            <Link to="/profile" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${isActive('/profile')}`}>
                                <Settings size={20} />
                                <span>Settings</span>
                            </Link>
                        </nav>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
