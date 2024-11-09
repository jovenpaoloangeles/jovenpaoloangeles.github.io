import React from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { Card } from './ui/card';
import type { Activity } from '@/components/types';
import { formatDistanceToNow, format } from 'date-fns';

interface ActivityCardProps {
  activity: Activity;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({ activity }) => {
  const getTypeColor = (type: Activity['type']) => {
    switch (type) {
      case 'blog':
        return 'bg-blue-100 text-blue-800';
      case 'research':
        return 'bg-green-100 text-green-800';
      case 'achievement':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formattedDate = format(new Date(activity.timestamp), 'MMMM d, yyyy');
  const relativeTime = formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card className="p-4 hover:shadow-lg transition-all duration-200">
        <div className="flex items-start justify-between">
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${getTypeColor(activity.type)}`}>
                {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="w-4 h-4 mr-1" />
                <span title={formattedDate}>{relativeTime}</span>
              </div>
            </div>
            <h3 className="text-lg font-semibold">{activity.title}</h3>
            <p className="text-muted-foreground">{activity.content}</p>
            {activity.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {activity.tags.map((tag: string) => (
                  <div
                    key={tag}
                    className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    {tag}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
