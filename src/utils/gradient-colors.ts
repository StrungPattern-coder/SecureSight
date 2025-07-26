/**
 * @fileoverview Color utilities for gradient theme
 * @description Utilities to work with gradient-based color schemes
 */

/**
 * Gradient-based color palette
 * Extract these colors from your Gradient_bg.jpg image and update accordingly
 */
export const gradientColors = {
  // Primary colors from gradient
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe', 
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9', // Main gradient color
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },
  
  // Secondary colors from gradient
  secondary: {
    50: '#fdf4ff',
    100: '#fae8ff',
    200: '#f5d0fe',
    300: '#f0abfc',
    400: '#e879f9',
    500: '#d946ef', // Secondary gradient color
    600: '#c026d3',
    700: '#a21caf',
    800: '#86198f',
    900: '#701a75',
  },
  
  // Accent colors derived from gradient
  accent: {
    50: '#fefce8',
    100: '#fef9c3',
    200: '#fef08a',
    300: '#fde047',
    400: '#facc15',
    500: '#eab308', // Accent from gradient
    600: '#ca8a04',
    700: '#a16207',
    800: '#854d0e',
    900: '#713f12',
  }
};

/**
 * Dynamic color generator based on gradient image
 * You can use this to programmatically extract colors from your image
 */
export function getGradientColorScheme(imageUrl: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      // Extract colors from different positions
      const colors: string[] = [];
      const positions = [
        [0, 0], // Top-left
        [img.width - 1, 0], // Top-right
        [0, img.height - 1], // Bottom-left
        [img.width - 1, img.height - 1], // Bottom-right
        [img.width / 2, img.height / 2], // Center
      ];
      
      positions.forEach(([x, y]) => {
        const pixel = ctx.getImageData(x, y, 1, 1).data;
        const color = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
        colors.push(color);
      });
      
      resolve(colors);
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = imageUrl;
  });
}

/**
 * Convert RGB to HSL
 */
export function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h: number, s: number;
  const l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
      default: h = 0;
    }
    h /= 6;
  }

  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

/**
 * Generate CSS custom properties from gradient colors
 */
export function generateGradientCSSVariables(colors: typeof gradientColors): string {
  const cssVars: string[] = [];
  
  Object.entries(colors).forEach(([name, shades]) => {
    Object.entries(shades).forEach(([shade, color]) => {
      // Convert hex to RGB values for CSS custom properties
      const hex = color.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      
      cssVars.push(`--gradient-${name}-${shade}: ${r} ${g} ${b};`);
    });
  });
  
  return cssVars.join('\n');
}

/**
 * Utility hook to use gradient colors in components
 */
export function useGradientColors() {
  return {
    colors: gradientColors,
    getColor: (category: keyof typeof gradientColors, shade: keyof typeof gradientColors.primary) => {
      return gradientColors[category][shade];
    },
    getCSSVar: (category: keyof typeof gradientColors, shade: keyof typeof gradientColors.primary) => {
      return `hsl(var(--gradient-${category}-${shade}))`;
    }
  };
}
