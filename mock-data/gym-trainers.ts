export type TrainerSpecialty =
  | 'Personal Training'
  | 'Yoga'
  | 'Pilates'
  | 'CrossFit'
  | 'Boxing'
  | 'Zumba'
  | 'Spinning'
  | 'Nutrition'
  | 'Sports Therapy';

export type TrainerStatus = 'Active' | 'On Leave' | 'Part-time';

export interface Trainer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl: string;
  specialties: TrainerSpecialty[];
  certifications: string[];
  status: TrainerStatus;
  hireDate: string;
  rating: number; // 1-5
  totalClients: number;
  bio: string;
  availability: string[];
}

export const trainers: Trainer[] = [
  {
    id: 'tr-1',
    name: 'Alex Rivera',
    email: 'alex.rivera@gym.com',
    phone: '+1-555-1001',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AlexRivera',
    specialties: ['Personal Training', 'CrossFit', 'Nutrition'],
    certifications: ['ACE Personal Trainer', 'CrossFit Level 2', 'Precision Nutrition Level 1'],
    status: 'Active',
    hireDate: '2022-03-15',
    rating: 4.8,
    totalClients: 25,
    bio: 'Passionate about helping clients achieve their fitness goals through personalized training programs.',
    availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  },
  {
    id: 'tr-2',
    name: 'Maya Patel',
    email: 'maya.patel@gym.com',
    phone: '+1-555-1002',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MayaPatel',
    specialties: ['Yoga', 'Pilates', 'Nutrition'],
    certifications: ['RYT 500', 'STOTT Pilates Certified', 'Holistic Nutritionist'],
    status: 'Active',
    hireDate: '2021-06-01',
    rating: 4.9,
    totalClients: 30,
    bio: 'Specializing in mind-body connection with over 8 years of yoga and pilates instruction.',
    availability: ['Monday', 'Wednesday', 'Friday', 'Saturday', 'Sunday'],
  },
  {
    id: 'tr-3',
    name: 'Marcus Johnson',
    email: 'marcus.j@gym.com',
    phone: '+1-555-1003',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MarcusJohnson',
    specialties: ['Boxing', 'Personal Training', 'Sports Therapy'],
    certifications: ['USA Boxing Coach', 'NASM-CPT', 'Sports Massage Therapist'],
    status: 'Active',
    hireDate: '2020-01-10',
    rating: 4.7,
    totalClients: 22,
    bio: 'Former professional boxer with expertise in combat sports and injury prevention.',
    availability: ['Tuesday', 'Thursday', 'Friday', 'Saturday'],
  },
  {
    id: 'tr-4',
    name: 'Sofia Martinez',
    email: 'sofia.m@gym.com',
    phone: '+1-555-1004',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SofiaMartinez',
    specialties: ['Zumba', 'Spinning', 'Personal Training'],
    certifications: ['Zumba Instructor', 'Spinning Certified', 'ISSA Personal Trainer'],
    status: 'Active',
    hireDate: '2022-09-20',
    rating: 4.6,
    totalClients: 18,
    bio: 'Energetic instructor bringing fun and intensity to every class.',
    availability: ['Monday', 'Tuesday', 'Wednesday', 'Saturday', 'Sunday'],
  },
  {
    id: 'tr-5',
    name: 'Jake Thompson',
    email: 'jake.t@gym.com',
    phone: '+1-555-1005',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=JakeThompson',
    specialties: ['CrossFit', 'Personal Training'],
    certifications: ['CrossFit Level 3', 'NSCA-CSCS'],
    status: 'Part-time',
    hireDate: '2023-02-15',
    rating: 4.5,
    totalClients: 12,
    bio: 'High-intensity training specialist focused on building strength and endurance.',
    availability: ['Wednesday', 'Friday', 'Saturday'],
  },
  {
    id: 'tr-6',
    name: 'Lisa Chen',
    email: 'lisa.chen@gym.com',
    phone: '+1-555-1006',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=LisaChen',
    specialties: ['Yoga', 'Pilates'],
    certifications: ['E-RYT 200', 'Balanced Body Pilates'],
    status: 'On Leave',
    hireDate: '2021-11-01',
    rating: 4.8,
    totalClients: 0,
    bio: 'Gentle yoga and pilates instructor focusing on flexibility and core strength.',
    availability: [],
  },
  {
    id: 'tr-7',
    name: 'David Kumar',
    email: 'david.kumar@gym.com',
    phone: '+1-555-1007',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DavidKumar',
    specialties: ['Personal Training', 'Sports Therapy', 'Nutrition'],
    certifications: ['NASM-CPT', 'NASM-CES', 'Precision Nutrition Coach'],
    status: 'Active',
    hireDate: '2020-07-01',
    rating: 4.9,
    totalClients: 28,
    bio: 'Comprehensive approach to fitness combining strength, mobility, and nutrition.',
    availability: ['Monday', 'Tuesday', 'Thursday', 'Friday', 'Saturday'],
  },
];
