# Gradient Background Integration Guide

## How to Add Your Gradient Image

1. **Place the Image**: Copy your `Gradient_bg.jpg` file to `/public/images/` directory
2. **The image will automatically be used as the background for all pages**

## Background Variants Available

### 1. Full Background
```tsx
<GradientBackground variant="full">
  {/* Your content */}
</GradientBackground>
```

### 2. Overlay Background (Default)
```tsx
<GradientBackground variant="overlay">
  {/* Your content with subtle gradient overlay */}
</GradientBackground>
```

### 3. Subtle Background
```tsx
<GradientBackground variant="subtle">
  {/* Your content with very light gradient background */}
</GradientBackground>
```

## CSS Classes Available

- `.bg-gradient-image` - Full gradient background
- `.bg-gradient-overlay` - Overlay variant
- Direct CSS: `background-image: url('/images/Gradient_bg.jpg')`

## Color Scheme Integration

### Step 1: Extract Colors from Your Gradient
Open your browser console and run:
```javascript
import { getGradientColorScheme } from '@/utils/gradient-colors';
getGradientColorScheme('/images/Gradient_bg.jpg').then(colors => console.log(colors));
```

### Step 2: Update Color Variables
Edit `/src/utils/gradient-colors.ts` and replace the example colors with your actual gradient colors.

### Step 3: Update CSS Variables
Add to your `globals.css`:
```css
:root {
  /* Your extracted gradient colors */
  --gradient-primary: [R G B values];
  --gradient-secondary: [R G B values];
  --gradient-accent: [R G B values];
}
```

### Step 4: Use in Components
```tsx
import { useGradientColors } from '@/utils/gradient-colors';

function MyComponent() {
  const { getColor, getCSSVar } = useGradientColors();
  
  return (
    <div style={{ backgroundColor: getColor('primary', 500) }}>
      {/* Component content */}
    </div>
  );
}
```

## Usage Examples

### Page with Gradient Background
```tsx
import { GradientBackground } from '@/components/ui/gradient-background';

export default function MyPage() {
  return (
    <GradientBackground variant="subtle">
      <div className="container mx-auto p-6">
        {/* Your page content */}
      </div>
    </GradientBackground>
  );
}
```

### Component with Gradient Colors
```tsx
import { useGradientColors } from '@/utils/gradient-colors';

export function MyCard() {
  const { getCSSVar } = useGradientColors();
  
  return (
    <div 
      className="p-4 rounded-lg"
      style={{ 
        backgroundColor: getCSSVar('primary', 50),
        borderColor: getCSSVar('primary', 200)
      }}
    >
      Card content
    </div>
  );
}
```

## Current Implementation

✅ **Already Applied**:
- Global background in `body` element
- Gradient background component created
- Root layout updated with subtle gradient
- Utility classes in CSS
- Color extraction utilities

## Next Steps

1. **Add your `Gradient_bg.jpg` to `/public/images/`**
2. **Extract actual colors from your image using the utility**
3. **Update the color palette in `/src/utils/gradient-colors.ts`**
4. **Apply gradient colors to your components**

## File Locations

- Background Component: `/src/components/ui/gradient-background.tsx`
- Color Utilities: `/src/utils/gradient-colors.ts`
- Global CSS: `/src/app/globals.css`
- Layout: `/src/app/layout.tsx`
