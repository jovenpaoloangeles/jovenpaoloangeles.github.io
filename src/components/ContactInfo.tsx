import React, { useState } from 'react';
import { Mail, Github, Instagram } from 'lucide-react';
import { Badge } from './ui/Badge';

export function ContactInfo() {
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  const emailSections = [
    {
      id: 'instagram',
      text: 'jovenpaolo',
      icon: Instagram,
      href: 'https://www.instagram.com/jovenpaolo/'
    },
    {
      id: 'github',
      text: 'angeles',
      icon: Github,
      href: 'https://github.com/jovenpaoloangeles'
    },
    {
      id: 'email',
      text: '@gmail.com',
      icon: Mail,
      href: 'mailto:jovenpaoloangeles@gmail.com'
    }
  ];

  const getTextOpacity = (sectionId: string) => {
    if (!hoveredSection) return 'opacity-100';
    
    switch (hoveredSection) {
      case 'instagram':
        return sectionId === 'instagram' ? 'opacity-100' : 'opacity-30';
      case 'github':
        return sectionId === 'email' ? 'opacity-30' : 'opacity-100';
      case 'email':
        return 'opacity-100';
      default:
        return 'opacity-100';
    }
  };

  const getHoverIcon = () => {
    if (!hoveredSection) return null;
    
    const IconComponent = emailSections.find(section => section.id === hoveredSection)?.icon;
    if (!IconComponent) return null;

    return (
      <div 
        className={`
          absolute -left-6 top-1/2 -translate-y-1/2
          transition-all duration-200 ease-in-out
          opacity-0 scale-90
          group-hover:opacity-100 group-hover:scale-100
        `}
      >
        <IconComponent className="w-4 h-4 text-primary" />
      </div>
    );
  };

  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-primary">Contact</h3>
      
      {/* Complete email display */}
      <div className="flex justify-center">
        <div className="text-medium relative inline-flex items-center group">
          {getHoverIcon()}
          {emailSections.map((section, index) => (
            <a
              key={section.id}
              href={section.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`relative cursor-pointer transition-opacity duration-200 hover:text-primary ${getTextOpacity(section.id)}`}
              onMouseEnter={() => setHoveredSection(section.id)}
              onMouseLeave={() => setHoveredSection(null)}
            >
              {section.text}
            </a>
          ))}
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap justify-center gap-2">
        {emailSections.map((section) => (
          <a
            key={section.id}
            href={section.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`transition-all duration-200 ${
              hoveredSection === null || hoveredSection === section.id
                ? 'opacity-100'
                : 'opacity-30'
            }`}
          >
            <Badge>
              {section.id.charAt(0).toUpperCase() + section.id.slice(1)}
            </Badge>
          </a>
        ))}
      </div>
    </div>
  );
}
