import React from 'react';
import { Mail, Github, Instagram } from 'lucide-react';

export function ContactInfo() {
  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-primary">Contact</h3>
      <div className="flex items-center gap-2">
        <Mail className="w-4 h-4 text-primary" />
        <a 
          href="mailto:jovenpaoloangeles@gmail.com" 
          className="text-sm text-muted-foreground hover:text-primary"
        >
          jovenpaoloangeles@gmail.com
        </a>
      </div>
      <div className="flex items-center gap-2">
        <Github className="w-4 h-4 text-primary" />
        <a 
          href="https://github.com/jovenpaoloangeles"
          className="text-sm text-muted-foreground hover:text-primary"
          target="_blank"
          rel="noopener noreferrer"
        >
          @jovenpaoloangeles
        </a>
      </div>
      <div className="flex items-center gap-2">
        <Instagram className="w-4 h-4 text-primary" />
        <a 
          href="https://www.instagram.com/jovenpaolo/"
          className="text-sm text-muted-foreground hover:text-primary"
          target="_blank"
          rel="noopener noreferrer"
        >
          jovenpaolo
        </a>
      </div>
    </div>
  );
}