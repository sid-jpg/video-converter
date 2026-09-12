# Video Converter App

A browser-based video converter application that allows users to convert and compress videos directly in their browser without uploading files to a server.

## Technologies Used

### Frontend Framework
- **React** - UI library for building the user interface
- **Vite** - Build tool and development server for fast development and optimized production builds

### Video Processing
- **mediabunny** - JavaScript library for video metadata extraction and conversion using WebAssembly
- **WebAssembly (WASM)** - Enables high-performance video processing in the browser

### Icons
- **Lucide React** - Beautiful, consistent icon library for React

### Styling
- **CSS3** - Custom styling with CSS variables, flexbox, and grid layouts
- **CSS Modules** - Scoped styling approach (though using global CSS in this implementation)

## How It Works

### Architecture Overview
The application follows a client-side processing model where all video operations happen in the user's browser:

1. **File Upload**: User selects a video file via drag-and-drop or file picker
2. **Metadata Extraction**: Using mediabunny, the app extracts video metadata (resolution, duration, codec, etc.)
3. **Resolution Selection**: User selects target resolution from available presets (disabled if source is lower)
4. **Format Selection**: User chooses output format (MP4 or WebM)
5. **Conversion**: Video is processed using WebAssembly-based FFmpeg
6. **Download**: Converted video is available for download

### Data Flow
```
User Upload → File Object → Metadata Extraction → Resolution/Format Selection 
→ Video Conversion → Blob URL → Download/Preview
```

### Key Features
- **Privacy-First**: No server uploads - all processing happens locally
- **Smart Resolution Selection**: Automatically selects the highest resolution that doesn't exceed source
- **Real-time Progress**: Shows conversion progress with time estimates
- **Format Support**: Converts to MP4 and WebM formats
- **Responsive Design**: Works on desktop and mobile devices

## Components

### 1. App.jsx
**Main application component** that manages:
- Application state (current step, file metadata, conversion progress)
- Navigation between steps (Upload → Quality → Convert → Result)
- Error handling and user feedback
- File lifecycle management (cleanup of blob URLs)

**Key Functions:**
- `handleFileSelect()` - Validates and processes uploaded video files
- `handleConvert()` - Initiates video conversion process
- `handleCancel()` - Cancels ongoing conversion
- `reset()` - Resets application to initial state

### 2. FileUploader.jsx
**Upload interface component** that provides:
- Drag-and-drop zone for video files
- File picker button
- Sample video generation for testing
- Loading states during metadata extraction
- Privacy notice

**Key Features:**
- Validates file type (video/*)
- Shows loading spinner during metadata extraction
- Generates sample video for quick testing

### 3. ResolutionPicker.jsx
**Quality selection component** that displays:
- Source video information (name, resolution, duration, size)
- Resolution preset cards (144p to 1080p)
- Format selection buttons (MP4/WebM)
- Estimated output file size
- Conversion summary

**Smart Features:**
- Disables resolution options higher than source resolution
- Shows warning for unavailable resolutions
- Auto-selects best matching preset on file upload
- Calculates estimated file size based on resolution change

### 4. ConversionProgress.jsx
**Progress tracking component** that shows:
- Conversion percentage
- Processed time and remaining time estimate
- Source file details
- Processing statistics (speed, frames processed)
- Cancel button

**Visual Feedback:**
- Animated progress bar
- Real-time time estimates
- Speed indicator

### 5. VideoPreview.jsx
**Result display component** that provides:
- Side-by-side video comparison (original vs converted)
- Conversion details (resolution, format, file size, size reduction)
- Download button for converted video
- "Convert another" button to restart

**Features:**
- Video playback controls
- File size comparison
- Size reduction percentage display

## Advantages

### Privacy & Security
- **No Server Uploads**: All processing happens locally in the browser
- **Data Privacy**: User's video files never leave their device
- **No Account Required**: No registration or authentication needed

### Performance
- **Fast Processing**: WebAssembly provides near-native performance
- **No Network Latency**: No upload/download wait times
- **Efficient Compression**: Optimized algorithms for file size reduction

### User Experience
- **Simple Interface**: Clean, intuitive 4-step process
- **Real-time Feedback**: Progress indicators and time estimates
- **Responsive Design**: Works on various screen sizes
- **Smart Defaults**: Auto-selects optimal resolution

### Cost & Accessibility
- **Free to Use**: No subscription or per-conversion fees
- **No Server Costs**: No infrastructure costs for the developer
- **Offline Capable**: Works without internet connection after initial load

## Disadvantages

### Browser Limitations
- **Browser Compatibility**: Requires modern browsers with WebAssembly support
- **Mobile Performance**: May be slower on mobile devices due to hardware limitations
- **Memory Constraints**: Large videos may cause memory issues on lower-end devices

### Processing Limitations
- **No Upscaling**: Cannot increase resolution beyond source quality
- **Limited Formats**: Only supports MP4 and WebM output formats
- **Processing Time**: Conversion time depends on device performance and video length
- **No Batch Processing**: Can only convert one video at a time

### Feature Limitations
- **No Advanced Editing**: No trimming, cropping, or video editing features
- **No Codec Selection**: Limited codec options
- **No Audio Extraction**: Cannot extract audio from video
- **No Subtitle Support**: Does not handle subtitle tracks

### Development Considerations
- **Large Bundle Size**: WebAssembly libraries increase initial load time (~5-10MB)
- **Browser Updates**: Dependent on browser WebAssembly implementation
- **Debugging Complexity**: WebAssembly debugging can be challenging

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation Steps

1. Clone the repository:
```bash
git clone <repository-url>
cd video-converter-app
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

5. Preview production build:
```bash
npm run preview
```

## Project Structure

```
video-converter-app/
├── src/
│   ├── components/
│   │   ├── FileUploader.jsx
│   │   ├── ResolutionPicker.jsx
│   │   ├── ConversionProgress.jsx
│   │   └── VideoPreview.jsx
│   ├── services/
│   │   └── converter.js
│   ├── utils/
│   │   └── formatters.js
│   ├── App.jsx
│   ├── main.jsx
│   └── styles.css
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari (with limitations)
- Requires WebAssembly support

## Future Improvements

- Add more output formats (AVI, MOV, MKV)
- Implement batch processing
- Add video editing features (trim, crop)
- Support for audio extraction
- Add subtitle handling
- Implement Web Workers for better performance
- Add PWA support for offline usage
- Cloud storage integration for saving converted videos

## License

This project is open source and available for educational and personal use.

## Credits

Built with React, Vite, and mediabunny for browser-based video processing.
