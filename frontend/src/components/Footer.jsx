import { Github, Twitter, Linkedin, Mail } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-2">
                        <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-4 block font-display">
                            DevHire
                        </span>
                        <p className="text-gray-400 max-w-sm">
                            Bridging the gap between talented freshers and the world's most innovative tech companies.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-4">Platform</h4>
                        <ul className="space-y-2">
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">Find Jobs</a></li>
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">For Recruiters</a></li>
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">Resume Checker</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-4">Connect</h4>
                        <div className="flex gap-4">
                            <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                                <Twitter size={20} />
                            </a>
                            <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                                <Linkedin size={20} />
                            </a>
                            <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                                <Github size={20} />
                            </a>
                            <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                                <Mail size={20} />
                            </a>
                        </div>
                    </div>
                </div>
                <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm">© 2024 DevHire. All rights reserved.</p>
                    <div className="flex gap-8 text-sm">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
