export interface Activity {
  title: string;
  content: string;
  timestamp: Date;
  type: ('blog' | 'research' | 'achievement' | 'photography')[];
  tags: string[];
}
