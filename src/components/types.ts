export interface Activity {
  id: string;
  title: string;
  content: string;
  timestamp: Date;
  type: 'blog' | 'research' | 'achievement';
  tags: string[];
}
