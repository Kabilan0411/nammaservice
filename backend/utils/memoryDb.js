// In-memory data storage fallback for offline sandboxed environments with file persistence
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/db.json');

// Ensure data folder exists
const dirPath = path.dirname(filePath);
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath, { recursive: true });
}

const services = [
  { _id: 's1', name: 'Plumber', description: 'Expert plumbing, pipe fixing, tap replacement, leak detection, and toilet repair.', category: 'Home Maintenance', icon: 'FaWrench' },
  { _id: 's2', name: 'Electrician', description: 'Professional electrical wiring, switchboard repairs, lighting, short circuits, and home appliance installation.', category: 'Home Maintenance', icon: 'FaBolt' },
  { _id: 's3', name: 'Carpenter', description: 'Furniture repair, custom carpentry, door/window fixing, assembly, and wooden polish.', category: 'Home Maintenance', icon: 'FaHammer' },
  { _id: 's4', name: 'AC Technician', description: 'AC servicing, installation, gas refilling, and repairs for split and window AC units.', category: 'Repair', icon: 'FaWind' },
  { _id: 's5', name: 'Painter', description: 'Interior and exterior painting, wall design, waterproofing, and texture walls.', category: 'Home Maintenance', icon: 'FaPaintRoller' },
  { _id: 's6', name: 'House Cleaner', description: 'Full home deep cleaning, kitchen cleaning, bathroom cleaning, and sofa/carpet shampooing.', category: 'Cleaning', icon: 'FaBroom' },
  { _id: 's7', name: 'RO Technician', description: 'Water purifier service, filter changes, installation, and general repairs.', category: 'Repair', icon: 'FaFilter' },
  { _id: 's8', name: 'Laptop/Mobile Repair', description: 'Hardware fixes, screen replacement, OS installation, virus removal, and speed tuning.', category: 'Repair', icon: 'FaLaptopMedical' },
  { _id: 's9', name: 'Home Tutor', description: 'Primary and secondary education, STEM subjects, language training, and exam preparation.', category: 'Tutors', icon: 'FaGraduationCap' }
];

const defaultUsers = [
  { _id: 'u_admin', name: 'Admin NammaService', email: 'admin@nammaservice.com', password: '$2a$10$abcdefghijklmnopqrstuv', role: 'admin', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop' },
  { _id: 'u_arun', name: 'Arun Kumar', email: 'arun@gmail.com', password: '$2a$10$abcdefghijklmnopqrstuv', role: 'user', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop' },
  { _id: 'u_kavitha', name: 'Kavitha Ram', email: 'kavitha@gmail.com', password: '$2a$10$abcdefghijklmnopqrstuv', role: 'user', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop' },
  { _id: 'u_deepak', name: 'Deepak Raj', email: 'deepak@gmail.com', password: '$2a$10$abcdefghijklmnopqrstuv', role: 'user', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop' },
  
  { _id: 'u_ravi', name: 'Ramesh Kumar', email: 'ravi@gmail.com', password: '$2a$10$abcdefghijklmnopqrstuv', role: 'user', avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&h=150&fit=crop' },
  { _id: 'u_mohamed', name: 'Mohamed Ali', email: 'mohamed@gmail.com', password: '$2a$10$abcdefghijklmnopqrstuv', role: 'user', avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&h=150&fit=crop' },
  { _id: 'u_suresh', name: 'Suresh Raina', email: 'suresh@gmail.com', password: '$2a$10$abcdefghijklmnopqrstuv', role: 'user', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop' },
  { _id: 'u_meera', name: 'Meera Sen', email: 'meera@gmail.com', password: '$2a$10$abcdefghijklmnopqrstuv', role: 'user', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop' },
  { _id: 'u_vikram', name: 'Vikram Singh', email: 'vikram@gmail.com', password: '$2a$10$abcdefghijklmnopqrstuv', role: 'user', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop' },
  { _id: 'u_priya', name: 'Priya Sharma', email: 'priya@gmail.com', password: '$2a$10$abcdefghijklmnopqrstuv', role: 'user', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop' }
];

const defaultProfessionals = [
  {
    _id: 'p_ravi',
    user: 'u_ravi',
    serviceType: 'Plumber',
    title: 'Expert Plumbing & Pipefitting Specialist',
    bio: 'Certified plumber with over 8 years of experience in residential and commercial plumbing. Specialized in leak detection, pipe repair, and bathroom installations. Quality work and customer satisfaction are my top priorities.',
    experience: 8,
    hourlyRate: 350,
    location: { address: '12 Main Rd, Adyar', city: 'Chennai', state: 'Tamil Nadu', zipcode: '600020', coordinates: [80.2504, 13.0063] },
    skills: ['Leak Detection', 'Pipe Repair', 'Water Heaters', 'Drain Cleaning', 'Tap Installation'],
    whatsappNumber: '919876543210',
    isAvailable: true,
    averageRating: 4.5,
    reviewCount: 2
  },
  {
    _id: 'p_mohamed',
    user: 'u_mohamed',
    serviceType: 'AC Technician',
    title: 'Senior AC Installation & Repair Engineer',
    bio: 'Providing expert air conditioning services for 10 years. Specializing in split and window AC installation, gas charging, filter cleanup, and compressor replacement. Quick service and transparent rates.',
    experience: 10,
    hourlyRate: 500,
    location: { address: '45 Cathedral Rd, Teynampet', city: 'Chennai', state: 'Tamil Nadu', zipcode: '600086', coordinates: [80.2511, 13.0452] },
    skills: ['AC Installation', 'Gas Charging', 'Filter Cleaning', 'Compressor Repair', 'Wiring Fixes'],
    whatsappNumber: '919876543211',
    isAvailable: true,
    averageRating: 5.0,
    reviewCount: 1
  },
  {
    _id: 'p_suresh',
    user: 'u_suresh',
    serviceType: 'Electrician',
    title: 'Certified Domestic & Industrial Electrician',
    bio: 'Expert electrician available for all kinds of household electrical works. Over 6 years of experience in panel wiring, lighting design, power sockets repair, and smart home setups. Insured and certified.',
    experience: 6,
    hourlyRate: 300,
    location: { address: '78 MG Road, Indiranagar', city: 'Bangalore', state: 'Karnataka', zipcode: '560038', coordinates: [77.6404, 12.9719] },
    skills: ['Switchboard Wiring', 'Lighting Installation', 'Short Circuit Fixes', 'Appliance Repair', 'Inverter Setup'],
    whatsappNumber: '919876543212',
    isAvailable: true,
    averageRating: 5.0,
    reviewCount: 1
  },
  {
    _id: 'p_meera',
    user: 'u_meera',
    serviceType: 'Home Tutor',
    title: 'Senior High School Mathematics & Physics Tutor',
    bio: 'I have a Masters in Physics and over 7 years of teaching experience. I offer home tutoring services for high school students, specializing in CBSE and ICSE syllabus. My students show average score improvements of 25%.',
    experience: 7,
    hourlyRate: 600,
    location: { address: '30 Link Rd, Jayanagar', city: 'Bangalore', state: 'Karnataka', zipcode: '560011', coordinates: [77.5824, 12.9307] },
    skills: ['CBSE Curriculum', 'ICSE Physics', 'Algebra & Geometry', 'Test Preparation', 'Doubt Solving'],
    whatsappNumber: '919876543213',
    isAvailable: true,
    averageRating: 5.0,
    reviewCount: 1
  },
  {
    _id: 'p_vikram',
    user: 'u_vikram',
    serviceType: 'Laptop/Mobile Repair',
    title: 'Certified Chip-Level Device Hardware Technician',
    bio: 'Micro-soldering and chip-level repairing expert for Apple and Windows products. 5 years of hardware servicing experience covering motherboard restoration, cracked screen replacements, liquid damage repairs, and software installs.',
    experience: 5,
    hourlyRate: 450,
    location: { address: '12 Nehru Place Market', city: 'Delhi', state: 'Delhi', zipcode: '110019', coordinates: [77.2514, 28.5492] },
    skills: ['Motherboard Repair', 'Screen Replacement', 'OS Reinstall', 'Water Damage Recovery', 'Keyboard Fixes'],
    whatsappNumber: '919876543214',
    isAvailable: true,
    averageRating: 4.0,
    reviewCount: 1
  },
  {
    _id: 'p_priya',
    user: 'u_priya',
    serviceType: 'House Cleaner',
    title: 'Professional Home Deep Cleaning & Sanitisation Specialist',
    bio: 'Over 4 years of experience delivering pristine clean homes. We use eco-friendly chemicals and professional vacuum machines to sanitise and deep-clean rooms, bathrooms, and kitchens. Punctual, trustable, and thorough.',
    experience: 4,
    hourlyRate: 400,
    location: { address: '89 Linking Rd, Bandra West', city: 'Mumbai', state: 'Maharashtra', zipcode: '400050', coordinates: [72.8339, 19.0607] },
    skills: ['Deep Cleaning', 'Kitchen Sanitation', 'Sofa Shampooing', 'Bathroom Cleaning', 'Floor Polishing'],
    whatsappNumber: '919876543215',
    isAvailable: true,
    averageRating: 5.0,
    reviewCount: 0
  }
];

const defaultReviews = [
  { _id: 'r1', title: 'Excellent Service', text: 'Ramesh arrived exactly on time and resolved our kitchen pipe blockage within 20 minutes. Highly recommended!', rating: 5, user: 'u_arun', professional: 'p_ravi', createdAt: new Date() },
  { _id: 'r2', title: 'Fair price, good job', text: 'Installed the new taps cleanly. Price is reasonable and work is high quality.', rating: 4, user: 'u_kavitha', professional: 'p_ravi', createdAt: new Date() },
  { _id: 'r3', title: 'Extremely professional AC technician', text: 'Mohamed resolved a complicated gas leakage issue that two other service technicians failed to repair.', rating: 5, user: 'u_arun', professional: 'p_mohamed', createdAt: new Date() },
  { _id: 'r4', title: 'Prompt electrical wiring repairs', text: 'Prompt response and quickly fixed our home inverter backup wiring issue.', rating: 5, user: 'u_deepak', professional: 'p_suresh', createdAt: new Date() },
  { _id: 'r5', title: 'Superb math teacher', text: 'Meera has been tutoring our son for 3 months now. His grades in math have improved from C to A.', rating: 5, user: 'u_kavitha', professional: 'p_meera', createdAt: new Date() },
  { _id: 'r6', title: 'Quick screen replacement', text: 'Replaced my cracked iPhone screen in less than an hour. The display feels as good as original.', rating: 4, user: 'u_deepak', professional: 'p_vikram', createdAt: new Date() }
];

const defaultBookings = [
  { _id: 'b1', user: 'u_arun', professional: 'p_ravi', serviceType: 'Plumber', date: new Date('2026-10-20'), time: '09:00 AM', status: 'confirmed', notes: 'Leakage under sink', totalAmount: 350, paymentStatus: 'pending', createdAt: new Date() },
  { _id: 'b2', user: 'u_kavitha', professional: 'p_mohamed', serviceType: 'AC Technician', date: new Date('2026-10-22'), time: '11:30 AM', status: 'pending', notes: 'General servicing', totalAmount: 500, paymentStatus: 'pending', createdAt: new Date() }
];

const defaultNotifications = [
  { _id: 'n1', user: 'u_arun', title: 'Booking Confirmed', message: 'Your booking request for Plumber has been accepted.', type: 'booking', read: false, createdAt: new Date() },
  { _id: 'n2', user: 'u_ravi', title: 'New Booking Request', message: 'You have received a booking request from Arun Kumar.', type: 'booking', read: false, createdAt: new Date() }
];

const defaultSavedProfessionals = [
  { _id: 'sp1', user: 'u_arun', professional: 'p_ravi' }
];

const defaultData = {
  users: defaultUsers,
  professionals: defaultProfessionals,
  reviews: defaultReviews,
  bookings: defaultBookings,
  notifications: defaultNotifications,
  savedProfessionals: defaultSavedProfessionals
};

let dbData = {};

const saveToDisk = () => {
  try {
    fs.writeFileSync(filePath, JSON.stringify({
      users: dbData.users,
      professionals: dbData.professionals,
      reviews: dbData.reviews,
      bookings: dbData.bookings,
      notifications: dbData.notifications,
      savedProfessionals: dbData.savedProfessionals
    }, null, 2));
  } catch (err) {
    console.error('Failed to save memory database to disk:', err.message);
  }
};

const createArrayProxy = (arrayData) => {
  return new Proxy(arrayData, {
    set(target, property, value, receiver) {
      const result = Reflect.set(target, property, value, receiver);
      saveToDisk();
      return result;
    },
    deleteProperty(target, property) {
      const result = Reflect.deleteProperty(target, property);
      saveToDisk();
      return result;
    }
  });
};

const exportObj = {
  services,
  comparePassword: async (raw, hashed) => {
    if (hashed === '$2a$10$abcdefghijklmnopqrstuv' && raw === 'password123') return true;
    return await bcrypt.compare(raw, hashed);
  },
  hashPassword: async (raw) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(raw, salt);
  }
};

const collections = ['users', 'professionals', 'reviews', 'bookings', 'notifications', 'savedProfessionals'];

collections.forEach(col => {
  let initialData = defaultData[col];
  let arrayData = [];
  
  if (fs.existsSync(filePath)) {
    try {
      const fileContent = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      arrayData = fileContent[col] || initialData;
    } catch (err) {
      arrayData = initialData;
    }
  } else {
    arrayData = initialData;
  }

  // Wrap the loaded array in a Proxy
  dbData[col] = createArrayProxy(arrayData);

  // Expose it as getter and setter on the export object
  Object.defineProperty(exportObj, col, {
    get() {
      return dbData[col];
    },
    set(newValue) {
      dbData[col] = createArrayProxy(newValue);
      saveToDisk();
      return true;
    },
    configurable: true,
    enumerable: true
  });
});

// Write first load seed to disk if not exists
if (!fs.existsSync(filePath)) {
  saveToDisk();
}

module.exports = exportObj;
