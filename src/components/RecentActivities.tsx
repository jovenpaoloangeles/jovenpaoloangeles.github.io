import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Input } from './ui/input';
import { ActivityCard } from './ActivityCard';
import { Activity } from './types';
import { ACTIVITIES } from './activities-data';

const ITEMS_PER_PAGE = 5;

export function RecentActivities() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<Activity['type'][number] | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredActivities = useMemo(() => {
    return ACTIVITIES
      .filter((activity) => {
        const matchesSearch = (
          activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          activity.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          activity.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        );
        const matchesType = selectedType === 'all' || activity.type.includes(selectedType);
        return matchesSearch && matchesType;
      })
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [searchQuery, selectedType]);

  const totalPages = Math.ceil(filteredActivities.length / ITEMS_PER_PAGE);
  const paginatedActivities = filteredActivities.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1); // Reset to first page on search
                }}
                className="pl-10"
              />
            </div>
          </div>
          <select
            value={selectedType}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              setSelectedType(e.target.value as Activity['type'][number] | 'all');
              setCurrentPage(1); // Reset to first page on filter change
            }}
            className="h-9 w-[200px] rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="all">All Types</option>
            <option value="blog">Blog Posts</option>
            <option value="research">Research Updates</option>
            <option value="achievement">Achievements</option>
            <option value="photography">Photography</option>
          </select>
        </div>

        {filteredActivities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No activities found. Try adjusting your search or filter.</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {paginatedActivities.map((activity, index) => (
                <ActivityCard
                  key={index}
                  activity={activity}
                />
              ))}
            </div>
            
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="inline-flex items-center justify-center rounded-md p-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`inline-flex h-8 min-w-[2rem] items-center justify-center rounded-md px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 ${
                        currentPage === page
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-accent hover:text-accent-foreground'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="inline-flex items-center justify-center rounded-md p-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}
