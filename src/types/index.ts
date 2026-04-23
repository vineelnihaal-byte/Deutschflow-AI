export type GermanLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface Lesson {
  id: string;
  title: string;
  description: string;
  level: GermanLevel;
  category: 'General' | 'Business' | 'Exam' | 'Interview';
}

export interface UserProgress {
  level: GermanLevel;
  completedLessons: string[];
  points: number;
}
