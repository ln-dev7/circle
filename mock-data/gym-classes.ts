export type ClassDifficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
export type ClassCategory =
  | 'Cardio'
  | 'Strength'
  | 'Flexibility'
  | 'Mind-Body'
  | 'Dance'
  | 'Combat'
  | 'Group Fitness';

export interface GymClass {
  id: string;
  name: string;
  description: string;
  trainerId: string;
  category: ClassCategory;
  difficulty: ClassDifficulty;
  duration: number; // in minutes
  capacity: number;
  enrolled: number;
  schedule: {
    dayOfWeek: string;
    time: string;
  }[];
  startDate: string;
  endDate: string;
  price: number; // per session
  imageUrl?: string;
  isActive: boolean;
}

export const gymClasses: GymClass[] = [
  {
    id: 'cls-1',
    name: 'Morning Yoga Flow',
    description: 'Start your day with an energizing vinyasa flow that builds strength and flexibility.',
    trainerId: 'tr-2',
    category: 'Mind-Body',
    difficulty: 'All Levels',
    duration: 60,
    capacity: 20,
    enrolled: 18,
    schedule: [
      { dayOfWeek: 'Monday', time: '07:00' },
      { dayOfWeek: 'Wednesday', time: '07:00' },
      { dayOfWeek: 'Friday', time: '07:00' },
    ],
    startDate: '2024-01-01',
    endDate: '2025-12-31',
    price: 15,
    isActive: true,
  },
  {
    id: 'cls-2',
    name: 'CrossFit Intensive',
    description: 'High-intensity functional fitness workouts combining weightlifting, cardio, and gymnastics.',
    trainerId: 'tr-1',
    category: 'Strength',
    difficulty: 'Advanced',
    duration: 90,
    capacity: 15,
    enrolled: 14,
    schedule: [
      { dayOfWeek: 'Tuesday', time: '18:00' },
      { dayOfWeek: 'Thursday', time: '18:00' },
      { dayOfWeek: 'Saturday', time: '09:00' },
    ],
    startDate: '2024-01-01',
    endDate: '2025-12-31',
    price: 25,
    isActive: true,
  },
  {
    id: 'cls-3',
    name: 'Boxing Fundamentals',
    description: 'Learn proper boxing techniques while getting an incredible full-body workout.',
    trainerId: 'tr-3',
    category: 'Combat',
    difficulty: 'Beginner',
    duration: 60,
    capacity: 12,
    enrolled: 10,
    schedule: [
      { dayOfWeek: 'Tuesday', time: '17:00' },
      { dayOfWeek: 'Thursday', time: '17:00' },
    ],
    startDate: '2024-02-01',
    endDate: '2025-12-31',
    price: 20,
    isActive: true,
  },
  {
    id: 'cls-4',
    name: 'Zumba Party',
    description: 'Dance your way to fitness with high-energy Latin and international music.',
    trainerId: 'tr-4',
    category: 'Dance',
    difficulty: 'All Levels',
    duration: 45,
    capacity: 25,
    enrolled: 22,
    schedule: [
      { dayOfWeek: 'Monday', time: '18:30' },
      { dayOfWeek: 'Wednesday', time: '18:30' },
      { dayOfWeek: 'Saturday', time: '10:00' },
    ],
    startDate: '2024-01-01',
    endDate: '2025-12-31',
    price: 12,
    isActive: true,
  },
  {
    id: 'cls-5',
    name: 'Power Pilates',
    description: 'Core-focused workout building strength, flexibility, and body awareness.',
    trainerId: 'tr-2',
    category: 'Flexibility',
    difficulty: 'Intermediate',
    duration: 50,
    capacity: 15,
    enrolled: 12,
    schedule: [
      { dayOfWeek: 'Tuesday', time: '08:00' },
      { dayOfWeek: 'Thursday', time: '08:00' },
      { dayOfWeek: 'Saturday', time: '11:00' },
    ],
    startDate: '2024-01-01',
    endDate: '2025-12-31',
    price: 18,
    isActive: true,
  },
  {
    id: 'cls-6',
    name: 'Spin & Burn',
    description: 'Indoor cycling class with motivating music and interval training.',
    trainerId: 'tr-4',
    category: 'Cardio',
    difficulty: 'Intermediate',
    duration: 45,
    capacity: 20,
    enrolled: 16,
    schedule: [
      { dayOfWeek: 'Monday', time: '17:30' },
      { dayOfWeek: 'Wednesday', time: '17:30' },
      { dayOfWeek: 'Friday', time: '17:30' },
    ],
    startDate: '2024-01-01',
    endDate: '2025-12-31',
    price: 15,
    isActive: true,
  },
  {
    id: 'cls-7',
    name: 'Boot Camp Challenge',
    description: 'Military-style training combining cardio, strength, and endurance exercises.',
    trainerId: 'tr-5',
    category: 'Group Fitness',
    difficulty: 'Advanced',
    duration: 60,
    capacity: 18,
    enrolled: 15,
    schedule: [
      { dayOfWeek: 'Wednesday', time: '06:00' },
      { dayOfWeek: 'Friday', time: '06:00' },
      { dayOfWeek: 'Saturday', time: '08:00' },
    ],
    startDate: '2024-03-01',
    endDate: '2025-12-31',
    price: 20,
    isActive: true,
  },
  {
    id: 'cls-8',
    name: 'Restorative Yoga',
    description: 'Gentle, relaxing yoga practice focused on deep stretching and stress relief.',
    trainerId: 'tr-2',
    category: 'Mind-Body',
    difficulty: 'Beginner',
    duration: 75,
    capacity: 15,
    enrolled: 11,
    schedule: [
      { dayOfWeek: 'Sunday', time: '17:00' },
    ],
    startDate: '2024-01-01',
    endDate: '2025-12-31',
    price: 18,
    isActive: true,
  },
  {
    id: 'cls-9',
    name: 'Advanced Boxing',
    description: 'Competitive boxing training for experienced fighters.',
    trainerId: 'tr-3',
    category: 'Combat',
    difficulty: 'Advanced',
    duration: 90,
    capacity: 10,
    enrolled: 8,
    schedule: [
      { dayOfWeek: 'Tuesday', time: '19:00' },
      { dayOfWeek: 'Thursday', time: '19:00' },
      { dayOfWeek: 'Saturday', time: '15:00' },
    ],
    startDate: '2024-01-01',
    endDate: '2025-12-31',
    price: 30,
    isActive: true,
  },
  {
    id: 'cls-10',
    name: 'HIIT Circuit',
    description: 'High-Intensity Interval Training with rotating exercise stations.',
    trainerId: 'tr-7',
    category: 'Cardio',
    difficulty: 'Intermediate',
    duration: 45,
    capacity: 20,
    enrolled: 19,
    schedule: [
      { dayOfWeek: 'Monday', time: '12:00' },
      { dayOfWeek: 'Thursday', time: '12:00' },
      { dayOfWeek: 'Saturday', time: '10:00' },
    ],
    startDate: '2024-01-01',
    endDate: '2025-12-31',
    price: 16,
    isActive: true,
  },
  {
    id: 'cls-11',
    name: 'Strength & Conditioning',
    description: 'Build muscle and improve athletic performance with compound lifts and functional movements.',
    trainerId: 'tr-1',
    category: 'Strength',
    difficulty: 'Intermediate',
    duration: 75,
    capacity: 16,
    enrolled: 13,
    schedule: [
      { dayOfWeek: 'Monday', time: '19:00' },
      { dayOfWeek: 'Wednesday', time: '19:00' },
      { dayOfWeek: 'Friday', time: '19:00' },
    ],
    startDate: '2024-01-01',
    endDate: '2025-12-31',
    price: 22,
    isActive: true,
  },
  {
    id: 'cls-12',
    name: 'Sunset Stretch',
    description: 'Evening flexibility and mobility class to unwind after a long day.',
    trainerId: 'tr-7',
    category: 'Flexibility',
    difficulty: 'All Levels',
    duration: 45,
    capacity: 18,
    enrolled: 14,
    schedule: [
      { dayOfWeek: 'Tuesday', time: '20:00' },
      { dayOfWeek: 'Thursday', time: '20:00' },
    ],
    startDate: '2024-01-01',
    endDate: '2025-12-31',
    price: 12,
    isActive: true,
  },
];
