import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight, Tag } from 'lucide-react';

export function RecentActivities() {
  const blogs = [
    {
      title: "Advancing Materials Design with Machine Learning",
      date: "2024-03-15",
      readTime: "8 min read",
      excerpt: "Exploring how machine learning algorithms are revolutionizing the way we discover and optimize new materials.",
      tags: ["Machine Learning", "Materials Science", "Research"],
      imageUrl: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "The Art and Science of Nanoparticle Synthesis",
      date: "2024-03-01",
      readTime: "6 min read",
      excerpt: "A deep dive into the experimental techniques and theoretical principles behind nanoparticle synthesis.",
      tags: ["Nanotechnology", "Synthesis", "Laboratory"],
      imageUrl: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Creative Coding: Where Art Meets Science",
      date: "2024-02-15",
      readTime: "5 min read",
      excerpt: "How computational art is bridging the gap between scientific visualization and artistic expression.",
      tags: ["Creative Coding", "Art", "Programming"],
      imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-serif mb-6">Recent Activities</h2>
      <div className="grid gap-6">
        {blogs.map((blog, index) => (
          <motion.article
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-card rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="md:flex">
              <div className="md:w-1/3">
                <img
                  src={blog.imageUrl}
                  alt={blog.title}
                  className="h-48 w-full object-cover md:h-full"
                />
              </div>
              <div className="p-6 md:w-2/3">
                <div className="flex flex-wrap gap-2 mb-3">
                  {blog.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded"
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">
                  {blog.title}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {blog.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {blog.date}
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {blog.readTime}
                    </span>
                  </div>
                  <button className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                    Read More
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </motion.div>
  );
}
