import { useState } from 'react';
import { Mail, Github, Instagram } from 'lucide-react';
import { Badge } from './ui/Badge';

export function ContactInfo() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const contactParts = [
    {
      id: 'instagram',
      text: 'jovenpaolo',
      icon: Instagram,
      href: 'https://www.instagram.com/jovenpaolo/',
    },
    {
      id: 'github',
      text: 'angeles',
      icon: Github,
      href: 'https://github.com/jovenpaoloangeles',
    },
    {
      id: 'email',
      text: '@gmail.com',
      icon: Mail,
      href: 'mailto:jovenpaoloangeles@gmail.com',
    },
  ];

  const getOpacity = (id: string) => {
    if (!hoveredId) return 'opacity-100';

    if (hoveredId === 'email') {
      return 'opacity-100';
    }

    if (hoveredId === 'github') {
      return id === 'email' ? 'opacity-30' : 'opacity-100';
    }

    if (hoveredId === 'instagram') {
      return id === 'instagram' ? 'opacity-100' : 'opacity-30';
    }

    return 'opacity-100';
  };

  const HoverIcon = () => {
    if (!hoveredId) return null;
    const Icon = contactParts.find((p) => p.id === hoveredId)?.icon;
    if (!Icon) return null;
    return (
      <div className="absolute -left-6 top-1/2 -translate-y-1/2 transition-all duration-200 opacity-100 scale-100">
        <Icon className="w-4 h-4 text-primary" />
      </div>
    );
  };

  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-primary">Contact</h3>

      {/* Email Address */}
      <div className="flex justify-center">
        <div
          className="text-medium relative inline-flex items-center group"
          onMouseLeave={() => setHoveredId(null)}
        >
          <HoverIcon />
          {contactParts.map((part) => (
            <a
              key={part.id}
              href={part.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`relative cursor-pointer transition-opacity duration-200 hover:text-primary ${getOpacity(
                part.id
              )}`}
              onMouseEnter={() => setHoveredId(part.id)}
            >
              {part.text}
            </a>
          ))}
        </div>
      </div>

      {/* Badges */}
      <div
        className="flex flex-wrap justify-center gap-2"
        onMouseLeave={() => setHoveredId(null)}
      >
        {contactParts.map((part) => (
          <a
            key={part.id}
            href={part.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`transition-all duration-200 ${getOpacity(part.id)}`}
            onMouseEnter={() => setHoveredId(part.id)}
          >
            <Badge>
              {part.id.charAt(0).toUpperCase() + part.id.slice(1)}
            </Badge>
          </a>
        ))}
      </div>
    </div>
  );
}
