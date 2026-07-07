const { User, Professional, Service, Review } = require('../models');

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
  { name: 'Admin NammaService', email: 'admin@nammaservice.com', password: 'password123', role: 'admin', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop' },
  { name: 'Arun Kumar', email: 'arun@gmail.com', password: 'password123', role: 'user', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop' },
  { name: 'Kavitha Ram', email: 'kavitha@gmail.com', password: 'password123', role: 'user', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop' },
  { name: 'Deepak Raj', email: 'deepak@gmail.com', password: 'password123', role: 'user', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop' },
  
  { name: 'Ramesh Kumar', email: 'ravi@gmail.com', password: 'password123', role: 'user', avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&h=150&fit=crop' },
  { name: 'Mohamed Ali', email: 'mohamed@gmail.com', password: 'password123', role: 'user', avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&h=150&fit=crop' },
  { name: 'Suresh Raina', email: 'suresh@gmail.com', password: 'password123', role: 'user', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop' },
  { name: 'Meera Sen', email: 'meera@gmail.com', password: 'password123', role: 'user', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop' },
  { name: 'Vikram Singh', email: 'vikram@gmail.com', password: 'password123', role: 'user', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop' },
  { name: 'Priya Sharma', email: 'priya@gmail.com', password: 'password123', role: 'user', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop' }
];

const professionalsData = [
  {
    email: 'ravi@gmail.com',
    serviceType: 'Plumber',
    title: 'Expert Plumbing & Pipefitting Specialist',
    bio: 'Certified plumber with over 8 years of experience in residential and commercial plumbing. Specialized in leak detection, pipe repair, and bathroom installations. Quality work and customer satisfaction are my top priorities.',
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
  { title: 'Excellent Service', text: 'Ramesh arrived exactly on time and resolved our kitchen pipe blockage within 20 minutes. He was polite and explained the issue. Highly recommended!', rating: 5, userEmail: 'arun@gmail.com', professionalEmail: 'ravi@gmail.com' },
  { title: 'Fair price, good job', text: 'Installed the new taps cleanly. Price is reasonable and work is high quality.', rating: 4, userEmail: 'kavitha@gmail.com', professionalEmail: 'ravi@gmail.com' },
  { title: 'Extremely professional AC technician', text: 'Mohamed resolved a complicated gas leakage issue that two other service technicians failed to repair. Very knowledgeable and clean work.', rating: 5, userEmail: 'arun@gmail.com', professionalEmail: 'mohamed@gmail.com' },
  { title: 'Prompt electrical wiring repairs', text: 'Prompt response and quickly fixed our home inverter backup wiring issue. Suresh was professional and well-equipped.', rating: 5, userEmail: 'deepak@gmail.com', professionalEmail: 'suresh@gmail.com' },
  { title: 'Superb math teacher', text: 'Meera has been tutoring our son for 3 months now. His grades in math have improved from C to A. She is extremely patient.', rating: 5, userEmail: 'kavitha@gmail.com', professionalEmail: 'meera@gmail.com' },
  { title: 'Quick screen replacement', text: 'Replaced my cracked iPhone screen in less than an hour. The display feels as good as original. Reasonable cost.', rating: 4, userEmail: 'deepak@gmail.com', professionalEmail: 'vikram@gmail.com' }
];

const autoSeed = async () => {
  try {
    console.log('Running robust auto-seeding checks...');

    // 1. Seed Services
    const servicesCount = await Service.count();
    if (servicesCount === 0) {
      await Service.bulkCreate(servicesData);
      console.log(`Auto-seeded ${servicesData.length} services.`);
    }

    // 2. Seed Users (Idempotent: checks each user email individually)
    let seededUsersCount = 0;
    const usersMap = {};
    for (const u of usersData) {
      let user = await User.findOne({ where: { email: u.email } });
      if (!user) {
        user = await User.create({
          ...u,
          isVerified: true
        });
        seededUsersCount++;
      } else {
        if (!user.isVerified) {
          user.isVerified = true;
          await user.save();
        }
      }
      usersMap[user.email] = user.id;
    }
    if (seededUsersCount > 0) {
      console.log(`Auto-seeded ${seededUsersCount} new users.`);
    }

    // 3. Seed Professionals (Idempotent: checks each professional individually)
    let seededProsCount = 0;
    const professionalsMap = {};
    for (const p of professionalsData) {
      const userId = usersMap[p.email];
      if (userId) {
        let professional = await Professional.findOne({ where: { userId } });
        if (!professional) {
          professional = await Professional.create({
            userId: userId,
            serviceType: p.serviceType,
            title: p.title,
            bio: p.bio,
            experience: p.experience,
            hourlyRate: p.hourlyRate,
            address: p.location.address,
            city: p.location.city,
            state: p.location.state,
            zipcode: p.location.zipcode,
            longitude: p.location.coordinates[0],
            latitude: p.location.coordinates[1],
            skills: p.skills,
            whatsappNumber: p.whatsappNumber,
            isAvailable: p.isAvailable
          });
          seededProsCount++;
        }
        professionalsMap[p.email] = professional.id;
      }
    }
    if (seededProsCount > 0) {
      console.log(`Auto-seeded ${seededProsCount} new professionals.`);
    }

    // 4. Seed Reviews (Idempotent: checks each review individually)
    let seededReviewsCount = 0;
    for (const r of reviewsData) {
      const userId = usersMap[r.userEmail];
      const proId = professionalsMap[r.professionalEmail];
      if (userId && proId) {
        const existingReview = await Review.findOne({ where: { userId, professionalId: proId } });
        if (!existingReview) {
          await Review.create({
            title: r.title,
            text: r.text,
            rating: r.rating,
            userId: userId,
            professionalId: proId
          });
          seededReviewsCount++;
        }
      }
    }
    if (seededReviewsCount > 0) {
      console.log(`Auto-seeded ${seededReviewsCount} new reviews.`);

      // Recalculate average ratings
      const allProfessionals = await Professional.findAll();
      for (const pro of allProfessionals) {
        const reviews = await Review.findAll({ where: { professionalId: pro.id } });
        if (reviews.length > 0) {
          const reviewCount = reviews.length;
          const sumRating = reviews.reduce((acc, curr) => acc + curr.rating, 0);
          const averageRating = sumRating / reviewCount;
          
          pro.averageRating = parseFloat(averageRating.toFixed(1));
          pro.reviewCount = reviewCount;
          await pro.save();
        }
      }
    }
    console.log('Robust auto-seed checks completed successfully!');
  } catch (error) {
    console.error('Error during robust auto-seed:', error);
  }
};

module.exports = autoSeed;
