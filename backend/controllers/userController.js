import Application from '../models/Application.js';
import Job from '../models/Job.js';

// @desc    Get user dashboard stats
// @route   GET /api/users/stats
// @access  Private
const getDashboardStats = async (req, res) => {
    try {
        let stats = {
            totalApplications: 0,
            activeJobs: 0,
            profileViews: 0, // Placeholder as we don't track this yet
            messages: 0 // Placeholder
        };

        if (req.user.role === 'student') {
            // Count applications by this student
            stats.totalApplications = await Application.countDocuments({ applicant: req.user._id });
            // You could also add 'interviews' or 'shortlisted' counts here
        } else if (req.user.role === 'recruiter' || req.user.role === 'company') {
            // Count jobs posted by this user
            stats.activeJobs = await Job.countDocuments({ postedBy: req.user._id, status: 'active' });

            // Count total applications received for these jobs
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
