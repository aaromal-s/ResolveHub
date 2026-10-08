const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Department = require('./models/Department');
const Complaint = require('./models/Complaint');
const StatusHistory = require('./models/StatusHistory');
const Feedback = require('./models/Feedback');
const Notification = require('./models/Notification');

dotenv.config();

const departmentsData = [
  { name: 'Water Supply & Sewage', description: 'Grievances related to drinking water shortage, pipe leaks, sewage overflow, and quality issues.', headOfDept: 'John Carter' },
  { name: 'Electricity & Street Lights', description: 'Faulty streetlights, power fluctuations, broken wiring, and billing discrepancies.', headOfDept: 'Sarah Jenkins' },
  { name: 'Sanitation & Waste Management', description: 'Garbage accumulation, missing dustbins, blocked drainage, and public toilets cleanliness.', headOfDept: 'Robert De Niro' },
  { name: 'Roads & Infrastructure', description: 'Potholes, broken footpaths, damaged signboards, and ongoing construction blockages.', headOfDept: 'Diana Prince' },
  { name: 'Public Health & Safety', description: 'Stray dog menace, mosquito breeding control, vector-borne outbreaks, and food adulteration.', headOfDept: 'Dr. Bruce Banner' },
];

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/complaint_management';
    console.log(`Connecting to database for seeding: ${mongoUri}`);
    await mongoose.connect(mongoUri);

    console.log('Clearing existing database collections...');
    await User.deleteMany({});
    await Department.deleteMany({});
    await Complaint.deleteMany({});
    await StatusHistory.deleteMany({});
    await Feedback.deleteMany({});
    await Notification.deleteMany({});

    console.log('Seeding departments...');
    const createdDepts = await Department.insertMany(departmentsData);
    console.log(`Seeded ${createdDepts.length} departments.`);

    console.log('Seeding users...');
    // Create Admins
    const adminUser = await User.create({
      name: 'Portal Administrator',
      email: 'admin@portal.gov.in',
      password: 'AdminPassword123', // encrypted via pre-save hook
      phone: '+919999988888',
      role: 'admin',
      status: 'active',
    });

    const adminResolveHub = await User.create({
      name: 'System Admin',
      email: 'admin@resolvehub.com',
      password: 'officer123',
      phone: '+919999911111',
      role: 'admin',
      status: 'active',
    });

    // Create Officers (portal.gov.in)
    const officer1 = await User.create({
      name: 'Officer John (Water Dept)',
      email: 'officer.water@portal.gov.in',
      password: 'OfficerPassword123',
      phone: '+918888877777',
      role: 'admin', // Give admin role for administrative capabilities
      status: 'active',
      department: createdDepts[0]._id,
    });

    const officer2 = await User.create({
      name: 'Officer Sarah (Electricity Dept)',
      email: 'officer.power@portal.gov.in',
      password: 'OfficerPassword123',
      phone: '+917777766666',
      role: 'admin',
      status: 'active',
      department: createdDepts[1]._id,
    });

    // Create ResolveHub Department Officers (officer1@resolvehub.com to officer5@resolvehub.com)
    for (let i = 0; i < createdDepts.length; i++) {
      const dept = createdDepts[i];
      await User.create({
        name: `Officer ${i + 1} (${dept.name})`,
        email: `officer${i + 1}@resolvehub.com`,
        password: 'officer123',
        phone: `+91800000000${i + 1}`,
        role: 'officer',
        status: 'active',
        department: dept._id,
      });
    }

    // Create Normal Users
    const user1 = await User.create({
      name: 'Aromal Kumar',
      email: 'aromal@gmail.com',
      password: 'UserPassword123',
      phone: '+919876543210',
      role: 'user',
      status: 'active',
    });

    const user2 = await User.create({
      name: 'Rohan Sharma',
      email: 'rohan@gmail.com',
      password: 'UserPassword123',
      phone: '+919012345678',
      role: 'user',
      status: 'active',
    });

    console.log('Seeded Users successfully.');

    console.log('Seeding complaints...');

    // Complaint 1: Submitted (Water)
    const c1 = await Complaint.create({
      complaintId: 'CMP-20260707-1001',
      userId: user1._id,
      title: 'Water pipeline leak in sector 4',
      description: 'The main drinking water pipe is leaking heavily near the public park entrance. Thousands of liters of drinking water are being wasted since last night. Please fix this on high priority.',
      category: createdDepts[0]._id, // Water Supply
      priority: 'high',
      status: 'Submitted',
      assignedDepartment: createdDepts[0]._id,
      location: 'Park Street Crossroad, Sector 4, City',
      slaDeadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
    });

    await StatusHistory.create({
      complaintId: c1._id,
      status: 'Submitted',
      remarks: 'Complaint registered by citizen.',
      updatedBy: user1._id,
    });

    // Complaint 2: Assigned (Electricity)
    const c2 = await Complaint.create({
      complaintId: 'CMP-20260707-1002',
      userId: user1._id,
      title: 'Street light broken on Main Avenue',
      description: 'Three consecutive street lights have been down for a week. The road becomes pitch black after 7 PM, making it extremely unsafe for women and children. Multiple near-miss accidents have occurred.',
      category: createdDepts[1]._id, // Electricity
      priority: 'medium',
      status: 'Assigned',
      assignedDepartment: createdDepts[1]._id,
      assignedTo: officer2._id,
      location: 'Main Avenue Road, Landmark: opposite SBI Bank',
      slaDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    await StatusHistory.create({
      complaintId: c2._id,
      status: 'Submitted',
      remarks: 'Complaint registered.',
      updatedBy: user1._id,
    });
    await StatusHistory.create({
      complaintId: c2._id,
      status: 'Assigned',
      remarks: 'Assigned to Electricity Department and allocated to Officer Sarah.',
      updatedBy: adminUser._id,
    });

    // Complaint 3: In Progress (Sanitation)
    const c3 = await Complaint.create({
      complaintId: 'CMP-20260707-1003',
      userId: user2._id,
      title: 'Garbage dump pile overflowing in colony park',
      description: 'The main community dump point is overflowing. The garbage truck has not arrived in 5 days. Foul smell is spreading and stray dogs are pulling garbage into the residential area.',
      category: createdDepts[2]._id, // Sanitation
      priority: 'medium',
      status: 'In Progress',
      assignedDepartment: createdDepts[2]._id,
      location: 'Colony Park Back gate, Sector 12',
      slaDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    await StatusHistory.create({
      complaintId: c3._id,
      status: 'Submitted',
      remarks: 'Registered.',
      updatedBy: user2._id,
    });
    await StatusHistory.create({
      complaintId: c3._id,
      status: 'In Progress',
      remarks: 'Sanitation inspection crew dispatched to evaluate scope.',
      updatedBy: adminUser._id,
    });

    // Complaint 4: Resolved (Public Health)
    const c4 = await Complaint.create({
      complaintId: 'CMP-20260707-1004',
      userId: user2._id,
      title: 'Severe mosquito breeding in stagnant water body',
      description: 'A vacant construction plot has stagnant water accumulated which is acting as a massive breeding ground for dengue mosquitoes. Request chemical spraying immediately.',
      category: createdDepts[4]._id, // Public Health
      priority: 'critical',
      status: 'Resolved',
      assignedDepartment: createdDepts[4]._id,
      location: 'Plot 404, Block-C, Green Woods Layout',
      slaDeadline: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // SLA was 1 day ago
      resolutionNotes: 'Stagnant water has been pumped out and larvicide chemical spraying was carried out across the entire street block on 6th July.',
      resolvedAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // Resolved 12 hours ago
    });

    await StatusHistory.create({
      complaintId: c4._id,
      status: 'Submitted',
      remarks: 'Registered.',
      updatedBy: user2._id,
    });
    await StatusHistory.create({
      complaintId: c4._id,
      status: 'Resolved',
      remarks: 'Larvicide chemical treatment successfully performed by health workers. Stagnant pools dried.',
      updatedBy: adminUser._id,
    });

    // Create Feedback for the resolved complaint
    await Feedback.create({
      complaintId: c4._id,
      rating: 5,
      comment: 'Thank you for the quick action! The health workers were professional and sprayed the chemicals thoroughly.',
    });

    // Create Notifications
    await Notification.create({
      userId: user1._id,
      message: 'Your complaint CMP-20260707-1001 regarding water leak has been Submitted.',
      type: 'status_change',
    });
    await Notification.create({
      userId: user1._id,
      message: 'Your complaint CMP-20260707-1002 has been assigned to Electricity department.',
      type: 'assignment',
    });
    await Notification.create({
      userId: user2._id,
      message: 'Your complaint CMP-20260707-1004 regarding mosquitoes has been RESOLVED.',
      type: 'status_change',
    });

    console.log('Seeded sample complaints and status timeline.');
    console.log('Database Seeding Completed Successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`Database seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seedDB();
