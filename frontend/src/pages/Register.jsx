import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register, verifyOTP, reset } from '../redux/slices/authSlice';
import { User, Mail, Lock, Loader2, ArrowRight, ShieldCheck, Sparkles, Building, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';

const Register = () => {
    const [registrationRole, setRegistrationRole] = useState('student');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [otp, setOtp] = useState('');

    const { name, email, password, confirmPassword } = formData;

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, isLoading, isError, isSuccess, message, needsVerification, emailForVerification } = useSelector(
        (state) => state.auth
    );

    useEffect(() => {
        if (isError) {
            toast.error(message, { id: 'register-error' });
            dispatch(reset());
        }

        if (isSuccess && user) {
            toast.success('Account created and verified!', { id: 'register-success' });
            navigate('/dashboard');
        }
    }, [user, isError, isSuccess, message, navigate, dispatch]);

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
        } else {
            dispatch(register({ name, email, password, role: registrationRole }));
        }
    };

    const onVerifyOtp = (e) => {
        e.preventDefault();
        dispatch(verifyOTP({ email: emailForVerification, otp }));
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100 relative overflow-hidden">
                    {/* Role Selector */}
                    {!needsVerification && (
                        <div className="flex p-1 bg-gray-100 rounded-xl mb-6">
                            <button
                                type="button"
                                onClick={() => setRegistrationRole('student')}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${registrationRole === 'student' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <Mail size={14} /> Fresher
                            </button>
                            <button
                                type="button"
                                onClick={() => setRegistrationRole('recruiter')}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${registrationRole === 'recruiter' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <Building size={14} /> Recruiter
                            </button>
                        </div>
                    )}

                    <div className="text-center">
                        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                            {needsVerification ? 'Confirm Email' : 'Create Account'}
                        </h2>
                        <p className="mt-3 text-sm text-gray-500">
                            {needsVerification
                                ? `Enter the code sent to ${emailForVerification}`
                                : `Apply for jobs or post jobs easily`}
                        </p>
                    </div>

                    {!needsVerification ? (
                        <form className="mt-8 space-y-4" onSubmit={onSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Full Name</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors group-focus-within:text-indigo-600">
                                            <User className="h-5 w-5 text-gray-300" />
                                        </div>
                                        <input
                                            id="name"
                                            name="name"
                                            type="text"
                                            required
                                            className="appearance-none rounded-xl relative block w-full pl-10 px-4 py-3 border border-gray-200 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all sm:text-sm"
                                            placeholder="John Doe"
                                            value={name}
                                            onChange={onChange}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Email Address</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors group-focus-within:text-indigo-600">
                                            <Mail className="h-5 w-5 text-gray-300" />
                                        </div>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            className="appearance-none rounded-xl relative block w-full pl-10 px-4 py-3 border border-gray-200 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all sm:text-sm"
                                            placeholder="you@example.com"
                                            value={email}
                                            onChange={onChange}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Password</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors group-focus-within:text-indigo-600">
                                                <Lock className="h-5 w-5 text-gray-300" />
                                            </div>
                                            <input
                                                id="password"
                                                name="password"
                                                type="password"
                                                required
                                                className="appearance-none rounded-xl relative block w-full pl-10 px-4 py-3 border border-gray-200 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all sm:text-sm"
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={onChange}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Confirm</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors group-focus-within:text-indigo-600">
                                                <Lock className="h-5 w-5 text-gray-300" />
                                            </div>
                                            <input
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                type="password"
                                                required
                                                className="appearance-none rounded-xl relative block w-full pl-10 px-4 py-3 border border-gray-200 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all sm:text-sm"
                                                placeholder="••••••••"
                                                value={confirmPassword}
                                                onChange={onChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <Loader2 className="animate-spin h-5 w-5" />
                                    ) : (
                                        'Create Account'
                                    )}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <form className="mt-8 space-y-6" onSubmit={onVerifyOtp}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 text-center">Verification Code</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            required
                                            maxLength="6"
                                            className="appearance-none rounded-xl relative block w-full px-4 py-4 border-2 border-indigo-100 text-center text-3xl font-bold tracking-[0.5em] text-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                                            placeholder="000000"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                        />
                                    </div>
                                </div>
                                {message && message.includes('trouble') && (
                                    <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                                        <p className="text-xs text-amber-800 font-medium">
                                            <span className="font-bold">Demo Mode Notification:</span><br />
                                            Email delivery is limited. Since the email couldn't be sent, please use the code below to continue:
                                        </p>
                                        <div className="mt-2 text-center text-lg font-mono font-bold text-amber-900 tracking-widest">
                                            {message.match(/\d{6}/)?.[0] || 'Check logs'}
                                        </div>
                                    </div>
                                )}
                                <p className="text-xs text-center text-gray-500">
                                    Didn't receive the code? <button type="button" onClick={onSubmit} className="text-indigo-600 font-bold hover:underline">Resend</button>
                                </p>
                            </div>

                            <div className="space-y-3">
                                <button
                                    type="submit"
                                    disabled={isLoading || otp.length !== 6}
                                    className="group relative w-full flex items-center justify-center gap-2 py-4 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : (
                                        <>
                                            <ShieldCheck size={20} />
                                            Activate Account
                                        </>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => dispatch(reset())}
                                    className="w-full flex items-center justify-center gap-2 py-2 text-sm font-bold text-gray-400 hover:text-gray-600 transition-all"
                                >
                                    <ArrowLeft size={16} /> Back to Signup
                                </button>
                            </div>
                        </form>
                    )}

                    <div className="text-center pt-4">
                        <p className="text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="font-bold text-indigo-600 hover:text-indigo-500 underline-offset-4 hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
