import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../redux/slices/authSlice';
import { LogOut, User, Menu, X, Briefcase } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const [isOpen, setIsOpen] = useState(false);

    const onLogout = () => {
        dispatch(logout());
        dispatch(reset());
        navigate('/');
    };

    return (
        <nav className="bg-white/70 backdrop-blur-xl sticky top-0 z-50 border-b border-gray-100/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    <div className="flex-shrink-0 flex items-center cursor-pointer gap-2" onClick={() => navigate('/')}>
                        <span className="text-2xl font-black text-indigo-700 font-sans tracking-tight">
                            DevHire
                        </span>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-10">
                        {user && user.name ? (
                            <>
                                <Link to="/dashboard" className="text-gray-600 hover:text-indigo-600 font-semibold transition-colors">
                                    Dashboard
                                </Link>
                                <div className="flex items-center gap-6 pl-6 border-l border-gray-100">
                                    <div className="flex items-center gap-3 text-sm font-bold text-gray-700 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
                                        <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                                            <User size={14} />
                                        </div>
                                        <span>{user.name}</span>
                                    </div>
                                    <button
                                        onClick={onLogout}
                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                                        title="Logout"
                                    >
                                        <LogOut size={22} />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-gray-600 hover:text-indigo-600 font-semibold transition-colors">
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-indigo-600 text-white px-8 py-2.5 rounded-full font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>

                    { }
                    <div className="md:hidden flex items-center">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 hover:text-indigo-600">
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white/95 backdrop-blur-lg border-b border-gray-100 animate-in slide-in-from-top duration-300">
                    <div className="px-4 pt-4 pb-6 space-y-2">
                        {user ? (
                            <>
                                <Link
                                    to="/dashboard"
                                    className="block px-4 py-3 rounded-2xl text-base font-bold text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Dashboard
                                </Link>
                                <button
                                    onClick={() => { onLogout(); setIsOpen(false); }}
                                    className="w-full text-left block px-4 py-3 rounded-2xl text-base font-bold text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="block px-4 py-3 rounded-2xl text-base font-bold text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="block px-4 py-3 rounded-2xl text-base font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
