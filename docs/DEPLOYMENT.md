# 🚀 Deployment Checklist

## Pre-deployment Setup

### 1. Environment Configuration
- [ ] Copy `.env.example` to `.env.local`
- [ ] Set up Supabase project
- [ ] Configure all environment variables
- [ ] Generate NextAuth secret: `openssl rand -base64 32`

### 2. Database Setup
- [ ] Run `npm run db:generate`
- [ ] Run `npm run db:push`
- [ ] Run `npm run db:seed`
- [ ] Verify demo users are created

### 3. Local Testing
- [ ] Run `npm run dev` locally
- [ ] Test authentication with demo credentials
- [ ] Verify video player functionality
- [ ] Test timeline interactions
- [ ] Check dark/light mode switching
- [ ] Test responsive design on mobile

## Deployment Steps

### Vercel Deployment (Recommended)

1. **GitHub Repository**
   - [ ] Push code to GitHub (public repository)
   - [ ] Ensure all sensitive data is in environment variables
   - [ ] Update README with your repository URL

2. **Vercel Setup**
   - [ ] Create Vercel account
   - [ ] Import GitHub repository
   - [ ] Set framework preset to Next.js
   - [ ] Configure environment variables
   - [ ] Deploy and test

3. **Post-deployment**
   - [ ] Update NEXTAUTH_URL to production URL
   - [ ] Test all functionality on live URL
   - [ ] Update README with live URL

### Alternative Platforms

#### Netlify
- [ ] Build project: `npm run build`
- [ ] Deploy `out` folder
- [ ] Configure environment variables

#### Render
- [ ] Connect GitHub repository
- [ ] Set build command: `npm run build`
- [ ] Set start command: `npm start`
- [ ] Configure environment variables

## Verification Checklist

### Functionality Tests
- [ ] Authentication works with demo credentials
- [ ] Camera switching functions properly
- [ ] Video player controls work
- [ ] Timeline sync with video
- [ ] Incident list updates
- [ ] Dark/light mode toggle
- [ ] Mobile responsiveness
- [ ] Real-time updates (if Supabase configured)

### Performance Tests
- [ ] Page load time < 3 seconds
- [ ] Video loads without errors
- [ ] No console errors
- [ ] Lighthouse score > 90

### Security Tests
- [ ] Protected routes redirect to login
- [ ] Environment variables not exposed
- [ ] HTTPS enabled in production
- [ ] Authentication sessions work correctly

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Verify DATABASE_URL format
   - Check Supabase project status
   - Ensure IP whitelist includes your deployment platform

2. **Authentication Issues**
   - Verify NEXTAUTH_SECRET is set
   - Check NEXTAUTH_URL matches your domain
   - Ensure bcrypt works in your deployment environment

3. **Build Errors**
   - Run `npm run build` locally first
   - Check for TypeScript errors
   - Verify all dependencies are in package.json

4. **Video Player Issues**
   - Ensure video files are in public/videos/
   - Check video format compatibility (MP4 recommended)
   - Verify CORS settings for video files

## Final Steps

- [ ] Update README with live URL
- [ ] Test all demo credentials
- [ ] Share repository URL
- [ ] Document any deployment-specific configurations
