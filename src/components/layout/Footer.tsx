import React from 'react';
import { Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="py-8 border-t border-border">
      <div className="container max-w-4xl mx-auto px-6 text-center">
        <p className="text-muted-foreground text-sm flex items-center justify-center gap-1">
          Made with <Heart className="w-4 h-4 text-destructive fill-destructive" /> using AI
        </p>
      </div>
    </footer>
  );
}
