# Video Placeholder Files

To add placeholder videos for the SecureSight dashboard:

## 1. Download Sample Security Camera Videos

You can use these free sources for placeholder security camera footage:

### Free Video Sources:
- **Pixabay**: https://pixabay.com/videos/search/security%20camera/
- **Pexels**: https://www.pexels.com/search/videos/security%20camera/
- **Videvo**: https://www.videvo.net/free-stock-video/

### Recommended Video Specifications:
- Format: MP4 (H.264)
- Resolution: 1280x720 or 1920x1080
- Duration: 30-60 seconds
- File size: < 10MB each

### Suggested Filenames:
```
/public/videos/
├── camera-1-entrance.mp4
├── camera-2-lobby.mp4
├── camera-3-parking.mp4
├── camera-4-warehouse.mp4
└── camera-5-perimeter.mp4
```

## 2. Alternative: Create Placeholder Videos

If you don't want to download videos, you can create simple placeholder videos using FFmpeg:

```bash
# Create a 30-second black video with timestamp
ffmpeg -f lavfi -i color=black:size=1280x720:duration=30 -vf "drawtext=text='Camera 1 - Live Feed':fontcolor=white:fontsize=24:x=(w-text_w)/2:y=(h-text_h)/2" camera-1-entrance.mp4

# Create different variants for each camera
ffmpeg -f lavfi -i color=black:size=1280x720:duration=30 -vf "drawtext=text='Camera 2 - Lobby':fontcolor=white:fontsize=24:x=(w-text_w)/2:y=(h-text_h)/2" camera-2-lobby.mp4
```

## 3. Using the Videos

Once you have the videos in the `/public/videos/` folder, they will be automatically accessible in the VideoPlayer component at:
- `/videos/camera-1-entrance.mp4`
- `/videos/camera-2-lobby.mp4`
- etc.

The VideoPlayer component will cycle through these videos when switching cameras.
