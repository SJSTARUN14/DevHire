import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Search, Upload, Shield, Zap, Target, Linkedin, FileText } from "lucide-react";

const Home = () => {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth || {});

    const handleGetStarted = () => {
        if (user) {
            navigate("/dashboard");
        } else {
            navigate("/register");
        }
    };

    const handleLearnMore = () => {
        const el = document.getElementById('features');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-white relative font-sans selection:bg-indigo-100 selection:text-indigo-700">
            <Navbar />

            {/* Hero Section - Matching your preferred design */}
            <section className="relative overflow-hidden pt-24 pb-32">
                <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[60%] bg-purple-50 rounded-full blur-[120px] opacity-60"></div>
                <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[60%] bg-indigo-50 rounded-full blur-[120px] opacity-60"></div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight leading-tight mb-8">
                        Land your Job as a <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-500">
                            Fresher and entry level role
                        </span>
                    </h1>

                    <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-500 font-medium leading-relaxed mb-12">
                        DevHire helps freshers and entry-level developers connect with top <br className="hidden md:block" />
                        companies. Optimize your search and land your first professional role today.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
                        <button
                            onClick={handleGetStarted}
                            className="px-10 py-4 bg-indigo-600 text-white rounded-full font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center gap-2 group"
                        >
                            Get Started
                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </button>
                        <button
                            onClick={handleLearnMore}
                            className="px-10 py-4 bg-white text-gray-700 border border-gray-100 rounded-full font-bold text-lg hover:bg-gray-50 transition-all shadow-sm"
                        >
                            Learn More
                        </button>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 bg-gray-50/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
                            Everything you need to get hired
                        </h2>
                        <p className="text-lg text-gray-500 font-medium">
                            Powerful tools built specifically for freshers looking for their first break in tech.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Search size={28} className="text-indigo-600" />,
                                title: "Smart Job Search",
                                desc: "Find roles that actually match your skill set. No sorting through senior roles.",
                            },
                            {
                                icon: <Linkedin size={28} className="text-indigo-600" />, // Changed to Linkedin icon
                                title: "Connect via LinkedIn",
                                desc: "Directly redirect to the company's recruiters to network and stand out from the crowd.",
                            },
                            {
                                icon: <FileText size={28} className="text-indigo-600" />, // Changed to FileText icon
                                title: "Referral Ready",
                                desc: "Get instant, professional referral request formats personalized with your name and job details.",
                            }
                        ].map((feature, i) => (
                            <div key={i} className="bg-white p-10 rounded-[2rem] border border-gray-100 hover:shadow-xl transition-all group cursor-pointer">
                                <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-8">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                                <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
                                Bridging the gap between <br />
                                <span className="text-indigo-600">talent & opportunity</span>
                            </h2>
                            <p className="text-lg text-gray-500 mb-10 leading-relaxed font-medium">
                                We've removed the noise. DevHire is designed to connect entry-level developers with recruiters who are actively looking for new talent.
                            </p>

                            <div className="space-y-6">
                                <div className="flex gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors">
                                    <div className="bg-indigo-600 text-white w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-bold">1</div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 mb-1">Upload & Parse</h4>
                                        <p className="text-gray-500">Quickly set up your profile with our AI resume parser.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors">
                                    <div className="bg-indigo-600 text-white w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-bold">2</div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 mb-1">Get Matched</h4>
                                        <p className="text-gray-500">Our system identifies high-relevance roles for you.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors">
                                    <div className="bg-indigo-600 text-white w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-bold">3</div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 mb-1">Direct Applications</h4>
                                        <p className="text-gray-500">Apply instantly and track your application status.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="bg-indigo-600 rounded-[2.5rem] p-12 text-white shadow-2xl relative z-10">
                                <h3 className="text-3xl font-bold mb-6">Recruiter Insights</h3>
                                <p className="text-indigo-100 text-lg mb-8 italic">
                                    "DevHire has cut our screening time in half for junior roles. The ATS matching is incredibly accurate."
                                </p>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center font-bold">JD</div>
                                    <div>
                                        <div className="font-bold">Tech Recruiter</div>
                                        <div className="text-indigo-200 text-sm italic">Verified Partner</div>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-100 rounded-full blur-2xl opacity-50"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-gray-900 text-white overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/50 to-purple-900/50 opacity-50"></div>
                <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold mb-8">Ready to start your journey?</h2>
                    <p className="text-xl text-indigo-100 mb-10 opacity-80">
                        Join thousands of freshers who have already found their dream roles.
                    </p>
                    <button
                        onClick={handleGetStarted}
                        className="px-12 py-4 bg-white text-indigo-950 rounded-full font-bold text-xl hover:bg-gray-100 transition-all shadow-lg"
                    >
                        Sign Up Now
                    </button>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Home;
