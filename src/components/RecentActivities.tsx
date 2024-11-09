import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { Input } from './ui/input';
import { ActivityCard } from './ActivityCard';
import { Activity } from './types';
import { ACTIVITIES } from './activities-data';

export function RecentActivities() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<Activity['type'] | 'all'>('all');

  const filteredActivities = useMemo(() => {
    return ACTIVITIES
      .filter((activity) => {
        const matchesSearch = (
          activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          activity.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          activity.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        );
        const matchesType = selectedType === 'all' || activity.type === selectedType;
        return matchesSearch && matchesType;
      })
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [searchQuery, selectedType]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-serif">Recent Activities</h2>
      </div>

      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search activities..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <select
            value={selectedType}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
              setSelectedType(e.target.value as Activity['type'] | 'all')}
            className="p-2 border rounded-md"
          >
            <option value="all">All Types</option>
            <option value="blog">Blog Posts</option>
            <option value="research">Research Updates</option>
            <option value="achievement">Achievements</option>
          </select>
        </div>

        {filteredActivities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No activities found. Try adjusting your search or filter.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredActivities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
