import { useState } from 'react';
import { useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import { LayoutDashboard, Briefcase, FileText, Settings, LogOut, Users, Building, PlusCircle, Menu, X } from 'lucide-react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const DashboardLayout = () => {
    const authState = useSelector((state) => state.auth || {});
    const { user } = authState;
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    if (!user || !user.name) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                <p className="text-gray-500 font-medium tracking-tight">Checking your session...</p>
                <Link to="/login" className="text-xs text-indigo-600 hover:underline">Back to Login</Link>
            </div>
        );
    }

    const isActive = (path) => {
        return location.pathname === path ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900';
    };

    const NavContent = () => (
        <nav className="p-4 space-y-1">
            <Link
                to="/dashboard"
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${isActive('/dashboard')}`}
            >
                <LayoutDashboard size={20} />
                <span>Overview</span>
            </Link>

            {user.role === 'student' && (
                <>
                    <Link
                        to="/jobs"
                        onClick={() => setIsSidebarOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${isActive('/jobs')}`}
                    >
                        <Briefcase size={20} />
                        <span>Find Jobs</span>
                    </Link>
                    <Link
                        to="/my-applications"
                        onClick={() => setIsSidebarOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${isActive('/my-applications')}`}
                    >
                        <FileText size={20} />
                        <span>My Applications</span>
                    </Link>
                </>
            )}

            {(user.role === 'company' || user.role === 'recruiter' || user.role === 'admin') && (
                <>
                    <Link
                        to="/post-job"
                        onClick={() => setIsSidebarOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${isActive('/post-job')}`}
                    >
                        <PlusCircle size={20} />
                        <span>Post New Job</span>
                    </Link>
                    <Link
                        to="/manage-jobs"
                        onClick={() => setIsSidebarOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${isActive('/manage-jobs')}`}
                    >
                        <Briefcase size={20} />
                        <span>Manage Jobs</span>
                    </Link>
                    <Link
                        to="/analytics"
                        onClick={() => setIsSidebarOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${isActive('/analytics')}`}
                    >
                        <Building size={20} />
                        <span>Analytics</span>
                    </Link>
                </>
            )}

            <Link
                to="/profile"
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${isActive('/profile')}`}
            >
                <Settings size={20} />
                <span>Settings</span>
            </Link>
        </nav>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            {/* Mobile Sidebar Toggle */}
            <div className="lg:hidden bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between sticky top-16 z-30">
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"
                >
                    {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
                <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                    Dashboard Menu
                </span>
            </div>

            <div className="flex flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 gap-8 relative">
                {/* Desktop Sidebar */}
                <aside className="hidden lg:block w-64 flex-shrink-0">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
                        <div className="p-6 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                                    {user.name ? user.name.charAt(0) : '?'}
                                </div>
                                <div className="overflow-hidden">
                                    <h3 className="font-bold text-gray-900 truncate">{user.name || 'User'}</h3>
                                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider italic">
                                        {user.role === 'admin' ? 'Admin' : (user.role === 'recruiter' || user.role === 'company' ? 'Recruiter' : 'Fresher')}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <NavContent />
                    </div>
                </aside>

                {/* Mobile Sidebar Overlay */}
                {isSidebarOpen && (
                    <div
                        className="lg:hidden fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                {/* Mobile Sidebar Content */}
                <aside className={`lg:hidden fixed top-0 left-0 bottom-0 w-72 bg-white z-50 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="flex flex-col h-full">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-indigo-600 text-white">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">
                                    {user.name ? user.name.charAt(0) : '?'}
                                </div>
                                <div className="overflow-hidden">
                                    <h3 className="font-bold truncate">{user.name || 'User'}</h3>
                                    <p className="text-[10px] text-indigo-100 font-medium uppercase tracking-wider italic">
                                        {user.role === 'admin' ? 'Admin' : (user.role === 'recruiter' || user.role === 'company' ? 'Recruiter' : 'Fresher')}
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-white/10 rounded-lg">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            <NavContent />
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 w-full max-w-full overflow-hidden">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
