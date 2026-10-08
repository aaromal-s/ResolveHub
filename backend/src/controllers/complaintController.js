const Complaint = require('../models/Complaint');
const StatusHistory = require('../models/StatusHistory');
const Notification = require('../models/Notification');
const Feedback = require('../models/Feedback');
const User = require('../models/User');
const Department = require('../models/Department');

// Calculate SLA deadline date
const calculateSlaDeadline = (priority) => {
  const date = new Date();
  switch (priority) {
    case 'critical':
      date.setDate(date.getDate() + 1); // 24 hours
      break;
    case 'high':
      date.setDate(date.getDate() + 3); // 3 days
      break;
    case 'medium':
      date.setDate(date.getDate() + 7); // 7 days
      break;
    case 'low':
      date.setDate(date.getDate() + 14); // 14 days
      break;
    default:
      date.setDate(date.getDate() + 7);
  }
  return date;
};

// @desc    Register a new complaint
// @route   POST /api/complaints
// @access  Private
const createComplaint = async (req, res, next) => {
  try {
    const { title, description, category, priority, location } = req.body;

    if (!title || !description || !category) {
      res.statusCode = 400;
      throw new Error('Please fill in title, description and category');
    }

    // Verify category exists
    const deptExists = await Department.findById(category);
    if (!deptExists) {
      res.statusCode = 400;
      throw new Error('Invalid Category Selected');
    }

    // Generate unique complaint ID: CMP-YYYYMMDD-XXXX
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const complaintId = `CMP-${dateStr}-${randomNum}`;

    // Get attachment paths
    let attachments = [];
    if (req.files && req.files.length > 0) {
      attachments = req.files.map((file) => `/uploads/${file.filename}`);
    }

    const slaDeadline = calculateSlaDeadline(priority || 'medium');

    const complaint = await Complaint.create({
      complaintId,
      userId: req.user._id,
      title,
      description,
      category,
      priority: priority || 'medium',
      location,
      attachments,
      slaDeadline,
      assignedDepartment: category, // Auto route initially to the chosen category
    });

    // Write initial status history log
    await StatusHistory.create({
      complaintId: complaint._id,
      status: 'Submitted',
      remarks: 'Complaint registered successfully',
      updatedBy: req.user._id,
    });

    // Notify citizen (confirmation)
    await Notification.create({
      userId: req.user._id,
      message: `Your complaint "${title}" has been registered successfully. Tracking ID: ${complaintId}`,
      type: 'status_change',
    });

    // Notify all officers in the same department about the new complaint
    const User = require('../models/User');
    const deptOfficers = await User.find({ role: 'officer', department: category });
    if (deptOfficers.length > 0) {
      const officerNotifs = deptOfficers.map((officer) => ({
        userId: officer._id,
        message: `New complaint filed in your department: "${title}" (ID: ${complaintId}). Priority: ${priority || 'medium'}.`,
        type: 'new_complaint',
      }));
      await Notification.insertMany(officerNotifs);
    }

    res.status(201).json({
      success: true,
      complaint,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get complaints for current user
// @route   GET /api/complaints
// @access  Private
const getUserComplaints = async (req, res, next) => {
  try {
    const { status, priority, search } = req.query;
    const query = { userId: req.user._id };

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { complaintId: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const complaints = await Complaint.find(query)
      .populate('category', 'name')
      .populate('assignedDepartment', 'name')
      .populate('assignedTo', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all complaints (Admin/Authority only)
// @route   GET /api/complaints/all
// @access  Private (Admin)
const getAllComplaints = async (req, res, next) => {
  try {
    const { status, priority, category, department, search, assignedTo } = req.query;
    const query = {};

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (category || department) query.category = category || department;
    if (assignedTo === 'null') { query.assignedTo = null; } else if (assignedTo) { query.assignedTo = assignedTo; }

    if (search) {
      query.$or = [
        { complaintId: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    const complaints = await Complaint.find(query)
      .populate('userId', 'name email phone')
      .populate('category', 'name')
      .populate('assignedDepartment', 'name')
      .populate('assignedTo', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get complaint by ID
// @route   GET /api/complaints/:id
// @access  Private
const getComplaintById = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('userId', 'name email phone')
      .populate('category', 'name')
      .populate('assignedDepartment', 'name')
      .populate('assignedTo', 'name');

    if (!complaint) {
      res.statusCode = 404;
      throw new Error('Complaint not found');
    }

          // Role check: 
      // - Admins can see everything
      // - Users can only see their own complaints
      // - Officers can see complaints assigned to their department
      if (req.user.role === 'user' && complaint.userId._id.toString() !== req.user._id.toString()) {
        res.statusCode = 403;
        throw new Error('Not authorized to access this complaint details');
      } else if (req.user.role === 'officer') {
        const isAssignedToOfficer = complaint.assignedTo && complaint.assignedTo._id && complaint.assignedTo._id.toString() === req.user._id.toString();
        const officerDeptId = req.user.department ? req.user.department.toString() : null;
        const isInOfficerDept = (complaint.category && (complaint.category._id ? complaint.category._id.toString() : complaint.category.toString()) === officerDeptId) ||
                                (complaint.assignedDepartment && (complaint.assignedDepartment._id ? complaint.assignedDepartment._id.toString() : complaint.assignedDepartment.toString()) === officerDeptId);
        
        if (!isAssignedToOfficer && !isInOfficerDept) {
          res.statusCode = 403;
          throw new Error('Not authorized to access complaints outside your department');
        }
      }

    // Fetch status logs
    const timeline = await StatusHistory.find({ complaintId: complaint._id })
      .populate('updatedBy', 'name role')
      .sort({ timestamp: 1 });

    // Fetch feedback if any
    const feedback = await Feedback.findOne({ complaintId: complaint._id });

    res.json({
      success: true,
      complaint,
      timeline,
      feedback,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Assign complaint to department and officer
// @route   PUT /api/complaints/:id/assign
// @access  Private (Admin)
const assignComplaint = async (req, res, next) => {
  try {
    const { departmentId, officerId } = req.body;

    if (!departmentId) {
      res.statusCode = 400;
      throw new Error('Please select a department to assign');
    }

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      res.statusCode = 404;
      throw new Error('Complaint not found');
    }

    const department = await Department.findById(departmentId);
    if (!department) {
      res.statusCode = 404;
      throw new Error('Department not found');
    }

    let officerName = 'Unassigned';
    if (officerId) {
      const officer = await User.findById(officerId);
      if (!officer) {
        res.statusCode = 404;
        throw new Error('Officer not found');
      }
      complaint.assignedTo = officerId;
      officerName = officer.name;
    }

    complaint.assignedDepartment = departmentId;
    
    // Auto advance status to 'Assigned' if current status is 'Submitted'
    if (complaint.status === 'Submitted') {
      complaint.status = 'Assigned';
    }

    await complaint.save();

    // Create history
    await StatusHistory.create({
      complaintId: complaint._id,
      status: complaint.status,
      remarks: `Assigned to department: ${department.name}. Officer: ${officerName}`,
      updatedBy: req.user._id,
    });

    // Notify user
    await Notification.create({
      userId: complaint.userId,
      message: `Your complaint ${complaint.complaintId} has been assigned to department "${department.name}"`,
      type: 'assignment',
    });

    // Notify officer if assigned
    if (officerId) {
      await Notification.create({
        userId: officerId,
        message: `New complaint ${complaint.complaintId} assigned to you: "${complaint.title}"`,
        type: 'assignment',
      });
    }

    res.json({
      success: true,
      message: 'Complaint assigned successfully',
      complaint,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update complaint status
// @route   PUT /api/complaints/:id/status
// @access  Private
const updateComplaintStatus = async (req, res, next) => {
  try {
    const { status, remarks, resolutionNotes } = req.body;

    if (!status) {
      res.statusCode = 400;
      throw new Error('Please specify a status');
    }

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      res.statusCode = 404;
      throw new Error('Complaint not found');
    }

    // Auth validation: must be admin, or the assigned officer / department officer, or the citizen closing their own ticket
    const isCitizenClosing = req.user.role === 'user' && complaint.userId.toString() === req.user._id.toString() && status === 'Closed';
    const officerDeptId = req.user.department ? req.user.department.toString() : null;
    const isOfficerInDept = req.user.role === 'officer' && (
      (complaint.assignedTo && complaint.assignedTo.toString() === req.user._id.toString()) ||
      (complaint.category && complaint.category.toString() === officerDeptId) ||
      (complaint.assignedDepartment && complaint.assignedDepartment.toString() === officerDeptId)
    );
    
    if (req.user.role !== 'admin' && !isOfficerInDept && !isCitizenClosing) {
      res.statusCode = 403;
      throw new Error('Not authorized to update status of this complaint');
    }

    // Auto-assign to officer if currently unassigned
    if (req.user.role === 'officer' && !complaint.assignedTo) {
      complaint.assignedTo = req.user._id;
    }

    complaint.status = status;

    if (status === 'Resolved') {
      complaint.resolutionNotes = resolutionNotes || 'No specific resolution notes provided.';
      complaint.resolvedAt = Date.now();
    }

    await complaint.save();

    // Add status history entry
    await StatusHistory.create({
      complaintId: complaint._id,
      status,
      remarks: remarks || `Status updated to ${status}`,
      updatedBy: req.user._id,
    });

    // Notify citizen with updater name and remarks
    const updaterUser = await User.findById(req.user._id).select('name');
    const updaterName = updaterUser ? updaterUser.name : 'System';
    let citizenMsg = `${updaterName} updated your complaint ${complaint.complaintId} to "${status}".`;
    if (remarks && remarks.trim()) {
      citizenMsg += ` Officer message: "${remarks}"`;
    }
    await Notification.create({
      userId: complaint.userId,
      message: citizenMsg,
      type: 'status_change',
    });

    res.json({
      success: true,
      message: 'Complaint status updated successfully',
      complaint,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Claim a complaint (Officer)
// @route   PUT /api/complaints/:id/claim
// @access  Private (Officer)
const claimComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    
    if (!complaint) {
      res.statusCode = 404;
      throw new Error('Complaint not found');
    }

    if (complaint.assignedTo) {
      res.statusCode = 400;
      throw new Error('Complaint is already assigned');
    }

    complaint.assignedTo = req.user._id;
    if (req.user.department && !complaint.assignedDepartment) {
      complaint.assignedDepartment = req.user.department;
    }

    // Advance status to 'In Progress' if currently 'Submitted' or 'Assigned'
    if (complaint.status === 'Submitted' || complaint.status === 'Assigned') {
      complaint.status = 'In Progress';
    }
    
    await complaint.save();

    // Create status history log
    await StatusHistory.create({
      complaintId: complaint._id,
      status: complaint.status,
      remarks: `Claimed by officer ${req.user.name || 'Department Officer'}`,
      updatedBy: req.user._id,
    });

    // Notify citizen
    await Notification.create({
      userId: complaint.userId,
      message: `Officer ${req.user.name || 'Department Officer'} has claimed and started working on your complaint ${complaint.complaintId}.`,
      type: 'status_change',
    });

    res.json({
      success: true,
      message: 'Complaint claimed successfully',
      complaint
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all complaints for officer's department
// @route   GET /api/complaints/department
// @access  Private (Officer)
const getDepartmentComplaints = async (req, res, next) => {
  try {
    const departmentId = req.user.department;
    if (!departmentId) {
      res.statusCode = 400;
      throw new Error('Officer is not assigned to a department');
    }

    const { status, priority, search } = req.query;
    let query = {
      $or: [
        { category: departmentId },
        { assignedDepartment: departmentId }
      ]
    };

    if (status) query.status = status;
    if (priority) query.priority = priority;
    
    if (search) {
      query.$and = [
        {
          $or: [
            { category: departmentId },
            { assignedDepartment: departmentId }
          ]
        },
        {
          $or: [
            { complaintId: { $regex: search, $options: 'i' } },
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
          ]
        }
      ];
      delete query.$or;
    }

    const complaints = await Complaint.find(query)
      .populate('userId', 'name email phone')
      .populate('category', 'name')
      .populate('assignedDepartment', 'name')
      .populate('assignedTo', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: complaints.length, complaints });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  getDepartmentComplaints,
  claimComplaint,
  createComplaint,
  getUserComplaints,
  getAllComplaints,
  getComplaintById,
  assignComplaint,
  updateComplaintStatus,
};
