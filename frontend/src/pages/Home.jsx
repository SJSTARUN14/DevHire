import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import { ArrowRight, Search, Briefcase, Upload, Shield } from "lucide-react";

const Home = () => {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const handleGetStarted = () => {
        if (user) {
            navigate("/dashboard");
        } else {
            navigate("/register");
        }
    };

    const handleLearnMore = () => {
        document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' });
    };

    const handleFeatureClick = () => {
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {}
            <section className="relative overflow-hidden pt-16 pb-32 space-y-24">
                {}
                <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-200 rounded-full blur-3xl opacity-50"></div>
                <div className="absolute top-20 right-0 translate-x-1/3 w-[600px] h-[600px] bg-indigo-100 rounded-full blur-3xl opacity-60"></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-6 font-sans">
                        Land your Job as a <br />
                        <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            Fresher and entry level role
                        </span>
                    </h1>
                    <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
                        DevHire helps freshers and entry-level developers connect with top companies.
                        Optimize your search and land your first professional role today.
                    </p>
                    <div className="mt-10 flex justify-center gap-4">
                        <button
                            onClick={handleGetStarted}
                            className="px-8 py-4 bg-indigo-600 text-white rounded-full font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 flex items-center gap-2 transform hover:-translate-y-1"
                        >
                            Get Started <ArrowRight size={20} />
                        </button>
                        <button
                            onClick={handleLearnMore}
                            className="px-8 py-4 bg-white text-indigo-700 border border-indigo-100 rounded-full font-bold text-lg hover:bg-indigo-50 transition-all shadow-md"
                        >
                            Learn More
                        </button>
                    </div>
                </div>
            </section>

            {}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900">
                            Why Choose DevHire?
                        </h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div
                            onClick={handleFeatureClick}
                            className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all cursor-pointer"
                        >
                            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                                <Search className="text-blue-600" size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">
                                Smart Job Search
                            </h3>
                            <p className="text-gray-500">
                                Filter jobs by skills, salary, and company. Our AI ensures you
                                see the most relevant roles first.
                            </p>
                        </div>
                        <div
                            onClick={handleFeatureClick}
                            className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all cursor-pointer"
                        >
                            <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                                <Upload className="text-purple-600" size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">
                                Instant Resume Parsing
                            </h3>
                            <p className="text-gray-500">
                                Upload your resume and let our system automatically extract your
                                skills and experience details.
                            </p>
                        </div>
                        <div
                            onClick={handleFeatureClick}
                            className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all cursor-pointer"
                        >
                            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-6">
                                <Shield className="text-green-600" size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">
                                ATS Score Analysis
                            </h3>
                            <p className="text-gray-500">
                                Get real-time feedback on how well your resume matches the job
                                description before you apply.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {}
            <section id="how-it-works" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-4xl font-bold text-gray-900 mb-6">
                                Everything You Need to Land Your Next Role
                            </h2>
                            <p className="text-lg text-gray-600 mb-8">
                                DevHire is not just another job board. It's an intelligent career partner designed specifically for developers. We use state-of-the-art AI to level the playing field.
                            </p>

                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <div className="mt-1 bg-indigo-100 p-1 rounded-full">
                                        <ArrowRight size={16} className="text-indigo-600" />
                                    </div>
                                    <span className="text-gray-700"><strong>AI-Powered Matching:</strong> Our algorithms scan your resume's technical skills and match them with deep requirements.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="mt-1 bg-indigo-100 p-1 rounded-full">
                                        <ArrowRight size={16} className="text-indigo-600" />
                                    </div>
                                    <span className="text-gray-700"><strong>Real-time Feedback:</strong> Get an instant ATS score before you hit submit, so you know exactly where you stand.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="mt-1 bg-indigo-100 p-1 rounded-full">
                                        <ArrowRight size={16} className="text-indigo-600" />
                                    </div>
                                    <span className="text-gray-700"><strong>Automated Communication:</strong> Recruiters can shortlist or reject with a single click, ensuring you're never left in the dark.</span>
                                </li>
                            </ul>
                        </div>
                        <div className="bg-indigo-50 rounded-3xl p-12 relative overflow-hidden">
                            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-indigo-200 rounded-full blur-3xl opacity-50"></div>
                            <div className="relative z-10">
                                <h4 className="text-indigo-700 font-bold uppercase tracking-wider mb-4">The DevHire Mission</h4>
                                <p className="text-indigo-900 text-2xl font-medium leading-relaxed">
                                    "Our mission is to bridge the gap between talented developers and great companies by making the recruitment process transparent, data-driven, and incredibly fast."
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {}
            <section className="py-20 bg-indigo-600 text-white text-center">
                <div className="max-w-4xl mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold mb-8">Ready to Build Your Career?</h2>
                    <button
                        onClick={handleGetStarted}
                        className="px-10 py-4 bg-white text-indigo-600 rounded-full font-bold text-lg hover:bg-gray-100 transition-all shadow-xl"
                    >
                        Join DevHire Today
                    </button>
                    <p className="mt-6 text-indigo-100">Free for developers. Always.</p>
                </div>
            </section>
        </div>
    );
};

export default Home;
