import Application from '../models/Application.js';
import Job from '../models/Job.js';
import User from '../models/User.js';
import { parseResume } from '../utils/resumeParser.js';
import { calculateATSScore } from '../utils/atsScoring.js';
import sendEmail from '../utils/sendEmail.js';




const applyJob = async (req, res) => {
    try {
        if (req.user.role !== 'student') {
            return res.status(403).json({ message: 'Only students can apply' });
        }

        const { jobId } = req.body;
        const resumePath = req.file ? req.file.path : null;

        if (!resumePath) {
            return res.status(400).json({ message: 'Resume is required' });
        }

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        
        const alreadyApplied = await Application.findOne({
            job: jobId,
            applicant: req.user._id
        });

        if (alreadyApplied) {
            return res.status(400).json({ message: 'You have already applied for this job' });
        }

        
        const resumeText = await parseResume(resumePath);
        const jobKeywords = `${job.description} ${job.requirements.join(' ')}`;

        const atsResult = await calculateATSScore(resumeText, jobKeywords);

        const application = await Application.create({
            job: jobId,
            applicant: req.user._id,
            resume: resumePath,
            atsScore: atsResult.score,
            matchDetails: {
                matchedSkills: atsResult.matchedKeywords,
                missingSkills: atsResult.missingKeywords,
                similarity: atsResult.score
            }
        });

        res.status(201).json(application);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};




const getMyApplications = async (req, res) => {
    try {
        const applications = await Application.find({ applicant: req.user._id })
            .populate('job', 'title company location status')
            .sort({ createdAt: -1 });
        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};




const getJobApplications = async (req, res) => {
    try {
        const { jobId } = req.params;

        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        
        if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to view applicants for this job. You can only view applicants for jobs you posted.' });
        }

        const applications = await Application.find({ job: jobId })
            .populate('applicant', 'name email studentProfile')
            .sort({ atsScore: -1 }); 

        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};




const checkApplicationStatus = async (req, res) => {
    try {
        const application = await Application.findOne({
            job: req.params.jobId,
            applicant: req.user._id
        });

        res.json({ applied: !!application });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};




const updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const { id } = req.params;

        const application = await Application.findById(id).populate('applicant', 'name email').populate('job', 'title postedBy');

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        
        if (application.job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update status for this application' });
        }

        application.status = status;
        await application.save();

        
        let subject = '';
        let message = '';

        if (status === 'shortlisted') {
            subject = 'Congratulations! Your profile has been shortlisted';
            message = `Hi ${application.applicant.name},\n\nYour profile has been shortlisted for the position of "${application.job.title}". We will get in touch with you shortly for the next steps.\n\nBest regards,\nDevHire Team`;
        } else if (status === 'rejected') {
            subject = 'Application Status Update';
            message = `Hi ${application.applicant.name},\n\nUnfortunately, your profile does not match our current requirements for the position of "${application.job.title}". We appreciate your interest in DevHire and wish you luck in your future endeavors.\n\nBest regards,\nDevHire Team`;
        }

        if (subject && message) {
            try {
                await sendEmail({
                    email: application.applicant.email,
                    subject,
                    message,
                });
            } catch (error) {
                console.error('Email sending failed, but status was updated');
            }
        }

        res.json(application);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};




const applyExternalJob = async (req, res) => {
    try {
        const { jobId } = req.body;

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        
        const alreadyApplied = await Application.findOne({
            job: jobId,
            applicant: req.user._id
        });

        if (alreadyApplied) {
            return res.status(400).json({ message: 'You have already recorded an application for this job' });
        }

        const application = await Application.create({
            job: jobId,
            applicant: req.user._id,
            resume: 'External Application', 
            status: 'applied',
            atsScore: 0 
        });

        res.status(201).json(application);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { applyJob, getMyApplications, getJobApplications, checkApplicationStatus, updateApplicationStatus, applyExternalJob };
