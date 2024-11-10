import React from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { Card } from './ui/card';
import type { Activity } from './types';
import { formatDistanceToNow, format } from 'date-fns';

interface ActivityCardProps {
  activity: Activity;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({ activity }) => {
  // Type-specific styling with consistent color scheme
  const getTypeColor = (type: Activity['type'][number]) => {
    switch (type) {
      case 'blog':
        return 'bg-blue-100 text-blue-800';
      case 'research':
        return 'bg-green-100 text-green-800';
      case 'achievement':
        return 'bg-purple-100 text-purple-800';
      case 'photography':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format dates for both tooltip and display
  const formattedDate = format(new Date(activity.timestamp), 'MMMM d, yyyy');
  const relativeTime = formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-4 hover:shadow-lg transition-all duration-200">
        <div className="flex items-start justify-between">
          <div className="space-y-3 flex-1">
            {/* Header with type badges and timestamp */}
            <div className="flex items-center gap-2 flex-wrap">
              {activity.type.map((type) => (
                <span 
                  key={type}
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getTypeColor(type)}`}
                  role="status"
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </span>
              ))}
              <time 
                className="flex items-center text-sm text-muted-foreground"
                dateTime={activity.timestamp.toISOString()}
                title={formattedDate}
              >
                <Clock className="w-4 h-4 mr-1" />
                {relativeTime}
              </time>
            </div>

            {/* Content */}
            <h3 className="text-lg font-semibold">{activity.title}</h3>
            <p className="text-muted-foreground">{activity.content}</p>

            {/* Tags */}
            {activity.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {activity.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold text-muted-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
