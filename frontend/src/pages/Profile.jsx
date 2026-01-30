import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateProfile, reset } from '../redux/slices/authSlice';
import { Loader2, User, Mail, Plus, Trash2, Save } from 'lucide-react';

const Profile = () => {
    const dispatch = useDispatch();
    const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        password: '',
        skills: user?.studentProfile?.skills?.join(', ') || '',
        education: user?.studentProfile?.education || [],
        experience: user?.studentProfile?.experience || [],
    });

    useEffect(() => {
        if (isSuccess && message === 'Profile updated successfully') {
            // Optional: Show toast
            setTimeout(() => dispatch(reset()), 3000);
        }
    }, [isSuccess, message, dispatch]);

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleEducationChange = (index, e) => {
        const updatedEducation = [...formData.education];
        updatedEducation[index] = { ...updatedEducation[index], [e.target.name]: e.target.value };
        setFormData({ ...formData, education: updatedEducation });
    };

    const addEducation = () => {
        setFormData({
            ...formData,
            education: [...formData.education, { degree: '', college: '', batch: '' }]
        });
    };

    const removeEducation = (index) => {
        const updatedEducation = formData.education.filter((_, i) => i !== index);
        setFormData({ ...formData, education: updatedEducation });
    };

    const onSubmit = (e) => {
        e.preventDefault();

        const updatedData = {
            name: formData.name,
            email: formData.email,
        };

        if (formData.password) {
            updatedData.password = formData.password;
        }

        if (user.role === 'student') {
            updatedData.studentProfile = {
                skills: formData.skills.split(',').map(skill => skill.trim()),
                education: formData.education,
                experience: formData.experience
            };
        }

        dispatch(updateProfile(updatedData));
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>

            {isSuccess && message && (
                <div className="bg-green-50 text-green-600 p-4 rounded-xl border border-green-200">
                    {message}
                </div>
            )}

            {isError && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200">
                    {message}
                </div>
            )}

            <form onSubmit={onSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-8">
                {/* Basic Info */}
                <section className="space-y-4">
                    <h2 className="text-lg font-bold text-gray-900 border-b pb-2">Basic Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={onChange}
                                    className="pl-10 w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={onChange}
                                    className="pl-10 w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">New Password (Optional)</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={onChange}
                                placeholder="Leave blank to keep current"
                                className="w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border"
                            />
                        </div>
                    </div>
                </section>

                {/* Fresher Specific Fields */}
                {user.role === 'student' && (
                    <>
                        <section className="space-y-4">
                            <h2 className="text-lg font-bold text-gray-900 border-b pb-2">Skills</h2>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Skills (Comma separated)</label>
                                <textarea
                                    name="skills"
                                    value={formData.skills}
                                    onChange={onChange}
                                    rows="3"
                                    className="w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border"
                                    placeholder="React, Node.js, Python, Java"
                                ></textarea>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <div className="flex justify-between items-center border-b pb-2">
                                <h2 className="text-lg font-bold text-gray-900">Education</h2>
                                <button type="button" onClick={addEducation} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center gap-1">
                                    <Plus size={16} /> Add Education
                                </button>
                            </div>

                            {formData.education.map((edu, index) => (
                                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-xl relative group">
                                    <button
                                        type="button"
                                        onClick={() => removeEducation(index)}
                                        className="absolute top-2 right-2 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">Degree</label>
                                        <input
                                            type="text"
                                            name="degree"
                                            value={edu.degree}
                                            onChange={(e) => handleEducationChange(index, e)}
                                            className="w-full rounded-lg border-gray-300 shadow-sm p-2 border text-sm"
                                            placeholder="B.Tech CSE"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">College/University</label>
                                        <input
                                            type="text"
                                            name="college"
                                            value={edu.college}
                                            onChange={(e) => handleEducationChange(index, e)}
                                            className="w-full rounded-lg border-gray-300 shadow-sm p-2 border text-sm"
                                            placeholder="University Name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">Batch Year</label>
                                        <input
                                            type="text"
                                            name="batch"
                                            value={edu.batch}
                                            onChange={(e) => handleEducationChange(index, e)}
                                            className="w-full rounded-lg border-gray-300 shadow-sm p-2 border text-sm"
                                            placeholder="2024"
                                        />
                                    </div>
                                </div>
                            ))}
                        </section>
                    </>
                )}

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center gap-2"
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={20} /> : <><Save size={20} /> Save Changes</>}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Profile;
