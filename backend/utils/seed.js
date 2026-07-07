require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Professional = require('../models/Professional');
const Service = require('../models/Service');
const Review = require('../models/Review');
const Booking = require('../models/Booking');
const Notification = require('../models/Notification');
const SavedProfessional = require('../models/SavedProfessional');

// Data arrays
const servicesData = [
  { name: 'Plumber', description: 'Expert plumbing, pipe fixing, tap replacement, leak detection, and toilet repair.', category: 'Home Maintenance', icon: 'FaWrench' },
  { name: 'Electrician', description: 'Professional electrical wiring, switchboard repairs, lighting, short circuits, and home appliance installation.', category: 'Home Maintenance', icon: 'FaBolt' },
  { name: 'Carpenter', description: 'Furniture repair, custom carpentry, door/window fixing, assembly, and wooden polish.', category: 'Home Maintenance', icon: 'FaHammer' },
  { name: 'AC Technician', description: 'AC servicing, installation, gas refilling, and repairs for split and window AC units.', category: 'Repair', icon: 'FaWind' },
  { name: 'Painter', description: 'Interior and exterior painting, wall design, waterproofing, and texture walls.', category: 'Home Maintenance', icon: 'FaPaintRoller' },
  { name: 'House Cleaner', description: 'Full home deep cleaning, kitchen cleaning, bathroom cleaning, and sofa/carpet shampooing.', category: 'Cleaning', icon: 'FaBroom' },
  { name: 'RO Technician', description: 'Water purifier service, filter changes, installation, and general repairs.', category: 'Repair', icon: 'FaFilter' },
  { name: 'Laptop/Mobile Repair', description: 'Hardware fixes, screen replacement, OS installation, virus removal, and speed tuning.', category: 'Repair', icon: 'FaLaptopMedical' },
  { name: 'Home Tutor', description: 'Primary and secondary education, STEM subjects, language training, and exam preparation.', category: 'Tutors', icon: 'FaGraduationCap' }
];

const usersData = [
  // Admin
  { name: 'Admin NammaService', email: 'admin@nammaservice.com', password: 'password123', role: 'admin', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop' },
  // Regular Users
  { name: 'Arun Kumar', email: 'arun@gmail.com', password: 'password123', role: 'user', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop' },
  { name: 'Kavitha Ram', email: 'kavitha@gmail.com', password: 'password123', role: 'user', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop' },
  { name: 'Deepak Raj', email: 'deepak@gmail.com', password: 'password123', role: 'user', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop' },
  
  // Professionals
  { name: 'Ravi Kumar', email: 'ravi@gmail.com', password: 'password123', role: 'user', avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&h=150&fit=crop' },
  { name: 'Mohamed Ali', email: 'mohamed@gmail.com', password: 'password123', role: 'user', avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&h=150&fit=crop' },
  { name: 'Suresh Raina', email: 'suresh@gmail.com', password: 'password123', role: 'user', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop' },
  { name: 'Meera Sen', email: 'meera@gmail.com', password: 'password123', role: 'user', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop' },
  { name: 'Vikram Singh', email: 'vikram@gmail.com', password: 'password123', role: 'user', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop' },
  { name: 'Priya Sharma', email: 'priya@gmail.com', password: 'password123', role: 'user', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop' }
];

const professionalsData = [
  {
    email: 'ravi@gmail.com', // To link to User ID
    serviceType: 'Plumber',
    title: 'Expert Plumbing & Pipefitting Specialist',
    bio: 'I am a certified plumber with over 8 years of experience in residential and commercial plumbing. I specialize in leak detection, pipe repair, and bathroom installations. Quality work and customer satisfaction are my top priorities.',
    experience: 8,
    hourlyRate: 350,
    location: { address: '12 Main Rd, Adyar', city: 'Chennai', state: 'Tamil Nadu', zipcode: '600020', coordinates: [80.2504, 13.0063] },
    skills: ['Leak Detection', 'Pipe Repair', 'Water Heaters', 'Drain Cleaning', 'Tap Installation'],
    whatsappNumber: '919876543210',
    isAvailable: true
  },
  {
    email: 'mohamed@gmail.com',
    serviceType: 'AC Technician',
    title: 'Senior AC Installation & Repair Engineer',
    bio: 'Providing expert air conditioning services for 10 years. Specializing in split and window AC installation, gas charging, filter cleanup, and compressor replacement. Quick service and transparent rates.',
    experience: 10,
    hourlyRate: 500,
    location: { address: '45 Cathedral Rd, Teynampet', city: 'Chennai', state: 'Tamil Nadu', zipcode: '600086', coordinates: [80.2511, 13.0452] },
    skills: ['AC Installation', 'Gas Charging', 'Filter Cleaning', 'Compressor Repair', 'Wiring Fixes'],
    whatsappNumber: '919876543211',
    isAvailable: true
  },
  {
    email: 'suresh@gmail.com',
    serviceType: 'Electrician',
    title: 'Certified Domestic & Industrial Electrician',
    bio: 'Expert electrician available for all kinds of household electrical works. Over 6 years of experience in panel wiring, lighting design, power sockets repair, and smart home setups. Insured and certified.',
    experience: 6,
    hourlyRate: 300,
    location: { address: '78 MG Road, Indiranagar', city: 'Bangalore', state: 'Karnataka', zipcode: '560038', coordinates: [77.6404, 12.9719] },
    skills: ['Switchboard Wiring', 'Lighting Installation', 'Short Circuit Fixes', 'Appliance Repair', 'Inverter Setup'],
    whatsappNumber: '919876543212',
    isAvailable: true
  },
  {
    email: 'meera@gmail.com',
    serviceType: 'Home Tutor',
    title: 'Senior High School Mathematics & Physics Tutor',
    bio: 'I have a Masters in Physics and over 7 years of teaching experience. I offer home tutoring services for high school students, specializing in CBSE and ICSE syllabus. My students show average score improvements of 25%.',
    experience: 7,
    hourlyRate: 600,
    location: { address: '30 Link Rd, Jayanagar', city: 'Bangalore', state: 'Karnataka', zipcode: '560011', coordinates: [77.5824, 12.9307] },
    skills: ['CBSE Curriculum', 'ICSE Physics', 'Algebra & Geometry', 'Test Preparation', 'Doubt Solving'],
    whatsappNumber: '919876543213',
    isAvailable: true
  },
  {
    email: 'vikram@gmail.com',
    serviceType: 'Laptop/Mobile Repair',
    title: 'Certified Chip-Level Device Hardware Technician',
    bio: 'Micro-soldering and chip-level repairing expert for Apple and Windows products. 5 years of hardware servicing experience covering motherboard restoration, cracked screen replacements, liquid damage repairs, and software installs.',
    experience: 5,
    hourlyRate: 450,
    location: { address: '12 Nehru Place Market', city: 'Delhi', state: 'Delhi', zipcode: '110019', coordinates: [77.2514, 28.5492] },
    skills: ['Motherboard Repair', 'Screen Replacement', 'OS Reinstall', 'Water Damage Recovery', 'Keyboard Fixes'],
    whatsappNumber: '919876543214',
    isAvailable: true
  },
  {
    email: 'priya@gmail.com',
    serviceType: 'House Cleaner',
    title: 'Professional Home Deep Cleaning & Sanitisation Specialist',
    bio: 'Over 4 years of experience delivering pristine clean homes. We use eco-friendly chemicals and professional vacuum machines to sanitise and deep-clean rooms, bathrooms, and kitchens. Punctual, trustable, and thorough.',
    experience: 4,
    hourlyRate: 400,
    location: { address: '89 Linking Rd, Bandra West', city: 'Mumbai', state: 'Maharashtra', zipcode: '400050', coordinates: [72.8339, 19.0607] },
    skills: ['Deep Cleaning', 'Kitchen Sanitation', 'Sofa Shampooing', 'Bathroom Cleaning', 'Floor Polishing'],
    whatsappNumber: '919876543215',
    isAvailable: true
  }
];

const reviewsData = [
  { title: 'Excellent Service', text: 'Ravi arrived exactly on time and resolved our kitchen pipe blockage within 20 minutes. He was polite and explained the issue. Highly recommended!', rating: 5, userEmail: 'arun@gmail.com', professionalEmail: 'ravi@gmail.com' },
  { title: 'Fair price, good job', text: 'Installed the new taps cleanly. Price is reasonable and work is high quality.', rating: 4, userEmail: 'kavitha@gmail.com', professionalEmail: 'ravi@gmail.com' },
  { title: 'Extremely professional AC technician', text: 'Mohamed resolved a complicated gas leakage issue that two other service technicians failed to repair. Very knowledgeable and clean work.', rating: 5, userEmail: 'arun@gmail.com', professionalEmail: 'mohamed@gmail.com' },
  { title: 'Prompt electrical wiring repairs', text: 'Prompt response and quickly fixed our home inverter backup wiring issue. Suresh was professional and well-equipped.', rating: 5, userEmail: 'deepak@gmail.com', professionalEmail: 'suresh@gmail.com' },
  { title: 'Superb math teacher', text: 'Meera has been tutoring our son for 3 months now. His grades in math have improved from C to A. She is extremely patient.', rating: 5, userEmail: 'kavitha@gmail.com', professionalEmail: 'meera@gmail.com' },
  { title: 'Quick screen replacement', text: 'Replaced my cracked iPhone screen in less than an hour. The display feels as good as original. Reasonable cost.', rating: 4, userEmail: 'deepak@gmail.com', professionalEmail: 'vikram@gmail.com' }
];

const seedDatabase = async () => {
  try {
    // Determine connection URI
    const uri = process.env.MONGODB_URI;
    const isRealAtlasUri = uri && 
                           uri.startsWith('mongodb') && 
                           !uri.includes('<db_password>') && 
                           !uri.includes('your_');
    
    let dbUri = uri;
    let mongoServer;

    if (!isRealAtlasUri) {
      console.log('MongoDB Atlas URI not set, creating MongoMemoryServer for seed...');
      mongoServer = await MongoMemoryServer.create();
      dbUri = mongoServer.getUri();
      
      // We need to write this Uri to the .env file so the server knows where to find it
      // but db.js will automatically fall back to memory server too if it fails.
      // So we don't strictly have to change .env, but let's connect locally.
    }

    console.log('Connecting to database for seeding...');
    await mongoose.connect(dbUri);
    console.log('Connected!');

    // Clear all existing data
    console.log('Clearing existing collections...');
    await User.deleteMany({});
    await Professional.deleteMany({});
    await Service.deleteMany({});
    await Review.deleteMany({});
    await Booking.deleteMany({});
    await Notification.deleteMany({});
    await SavedProfessional.deleteMany({});
    console.log('Collections cleared.');

    // Seed Services
    console.log('Seeding services...');
    await Service.create(servicesData);
    console.log(`Seeded ${servicesData.length} services.`);

    // Seed Users (passwords will be encrypted via model hooks)
    console.log('Seeding users...');
    const usersMap = {};
    for (const u of usersData) {
      const user = await User.create(u);
      usersMap[user.email] = user;
    }
    console.log(`Seeded ${usersData.length} users.`);

    // Seed Professionals
    console.log('Seeding professional profiles...');
    const professionalsMap = {};
    for (const p of professionalsData) {
      const userObj = usersMap[p.email];
      if (userObj) {
        // Assign the appropriate User ObjectId
        p.user = userObj._id;
        const professional = await Professional.create(p);
        professionalsMap[p.email] = professional;
      }
    }
    console.log(`Seeded ${professionalsData.length} professionals.`);

    // Seed Reviews and calculate average ratings
    console.log('Seeding reviews...');
    for (const r of reviewsData) {
      const userObj = usersMap[r.userEmail];
      const proObj = professionalsMap[r.professionalEmail];
      if (userObj && proObj) {
        r.user = userObj._id;
        r.professional = proObj._id;
        await Review.create(r);
      }
    }
    console.log(`Seeded ${reviewsData.length} reviews.`);

    // Final Average Rating update check
    console.log('Recalculating average ratings...');
    const allProfessionals = await Professional.find({});
    for (const pro of allProfessionals) {
      await Review.getAverageRating(pro._id);
    }
    console.log('Seeding process completed successfully!');

    if (mongoServer) {
      // Keep it alive or write Uri. Actually, we'll exit, but since it's in-memory,
      // if this node process exits, the memory db is cleared.
      // So if they are using Atlas, it's persistent. If they use memory-server, the server.js will spin its own fresh one.
      // That's totally fine! If the server.js spins its own in-memory database, it's initialized on server start.
      // Wait, let's write a seeding hook directly in server.js! If it detects that the database is empty (e.g. Services.countDocuments() === 0),
      // it should automatically call seedDatabase() on start! This is an absolutely GENIUS developer experience!
      // No matter where it runs, if it starts and has no data, it seeds itself with premium mock data automatically.
      // Let's implement this auto-seeding in server.js.
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the script
seedDatabase();
