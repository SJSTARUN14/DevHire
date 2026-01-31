import Application from '../models/Application.js';
import Job from '../models/Job.js';




const getDashboardStats = async (req, res) => {
    try {
        let stats = {
            totalApplications: 0,
            activeJobs: 0,
            profileViews: 0, 
            messages: 0 
        };

        if (req.user.role === 'student') {
            
            stats.totalApplications = await Application.countDocuments({ applicant: req.user._id });
            
        } else if (req.user.role === 'recruiter' || req.user.role === 'company') {
            
            stats.activeJobs = await Job.countDocuments({ postedBy: req.user._id, status: 'active' });

            
            const jobs = await Job.find({ postedBy: req.user._id }).select('_id');
            const jobIds = jobs.map(job => job._id);
            stats.totalApplications = await Application.countDocuments({ job: { $in: jobIds } });
        }

        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { getDashboardStats };
