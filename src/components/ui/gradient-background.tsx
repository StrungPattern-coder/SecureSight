/**
 * @fileoverview Gradient Background Component
 * @description Reusable background component using the gradient image
 */

import { cn } from '@/lib/utils';

interface GradientBackgroundProps {
  children: React.ReactNode;
  variant?: 'full' | 'overlay' | 'subtle';
  className?: string;
}

export function GradientBackground({ 
  children, 
  variant = 'overlay',
  className 
}: GradientBackgroundProps) {
  return (
    <div 
      className={cn(
        'relative min-h-screen',
        {
          'bg-gradient-image': variant === 'full',
          'bg-gradient-overlay': variant === 'overlay',
        },
        className
      )}
    >
      {variant === 'subtle' && (
        <div 
          className="absolute inset-0 opacity-5 bg-cover bg-center bg-fixed bg-no-repeat"
          style={{ backgroundImage: "url('/images/Gradient_bg.jpg')" }}
        />
      )}
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

export default GradientBackground;
