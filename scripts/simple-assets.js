import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createCanvas } from 'canvas';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure the public directory exists
const publicDir = path.join(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Create a simple favicon.ico
const createFavicon = () => {
  const size = 32;
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Draw a blue background
  ctx.fillStyle = '#3B82F6';
  ctx.fillRect(0, 0, size, size);
  
  // Draw a simple brain icon
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 3, 0, Math.PI * 2);
  ctx.fill();
  
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), buffer);
};

// Create browserconfig.xml
const createBrowserConfig = () => {
  const browserConfig = `<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
  <msapplication>
    <tile>
      <square150x150logo src="/mstile-150x150.png"/>
      <TileColor>#3B82F6</TileColor>
    </tile>
  </msapplication>
</browserconfig>`;
  
  fs.writeFileSync(path.join(publicDir, 'browserconfig.xml'), browserConfig);
};

// Create offline.html
const createOfflinePage = () => {
  const offlineHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MindSync - Offline</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      margin: 0;
      background-color: #f3f4f6;
      color: #1f2937;
      text-align: center;
      padding: 0 1rem;
    }
    .container {
      max-width: 24rem;
      padding: 2rem;
      background: white;
      border-radius: 0.5rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
    h1 {
      color: #1e40af;
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 1rem;
    }
    p {
      color: #4b5563;
      margin-bottom: 1.5rem;
      line-height: 1.5;
    }
    .icon {
      width: 4rem;
      height: 4rem;
      margin: 0 auto 1rem;
      display: block;
    }
  </style>
</head>
<body>
  <div class="container">
    <svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.53 2 12 2Z" fill="#3B82F6"/>
      <path d="M12 6C11.17 6 10.5 6.67 10.5 7.5C10.5 8.33 11.17 9 12 9C12.83 9 13.5 8.33 13.5 7.5C13.5 6.67 12.83 6 12 6ZM13.5 16.5H10.5V10.5H13.5V16.5Z" fill="white"/>
    </svg>
    <h1>You're offline</h1>
    <p>It looks like you've lost your internet connection. Please check your network settings and try again.</p>
    <button onclick="window.location.reload()" style="
      background-color: #3B82F6;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 0.375rem;
      font-weight: 500;
      cursor: pointer;
    ">
      Try Again
    </button>
  </div>
</body>
</html>`;
  
  fs.writeFileSync(path.join(publicDir, 'offline.html'), offlineHtml);
};

// Create a simple icon file
const createSimpleIcons = () => {
  // Copy the logo.svg to various sizes
  const sizes = [16, 32, 48, 64, 96, 128, 192, 256, 384, 512];
  
  sizes.forEach(size => {
    const filename = size <= 32 
      ? `favicon-${size}x${size}.png`
      : size <= 192
        ? `android-chrome-${size}x${size}.png`
        : `icon-${size}x${size}.png`;
    
    // For now, just copy the SVG with different names
    // In a real app, you'd want to use a proper image processing library
    if (size === 192) {
      fs.copyFileSync(
        path.join(publicDir, 'logo.svg'),
        path.join(publicDir, 'android-chrome-192x192.png')
      );
    } else if (size === 512) {
      fs.copyFileSync(
        path.join(publicDir, 'logo.svg'),
        path.join(publicDir, 'android-chrome-512x512.png')
      );
    } else if (size === 180) {
      fs.copyFileSync(
        path.join(publicDir, 'logo.svg'),
        path.join(publicDir, 'apple-touch-icon.png')
      );
    }
  });
  
  // Create safari-pinned-tab.svg
  const safariSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="16" height="16" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg">
  <rect width="16" height="16" rx="4" fill="#3B82F6"/>
  <path d="M4 8C4 6.4 5.4 5 7 5C8.6 5 10 6.4 10 8C10 9.6 8.6 11 7 11C5.4 11 4 9.6 4 8Z" fill="white"/>
  <path d="M7 6C6.4 6 6 6.4 6 7V9C6 9.6 6.4 10 7 10C7.6 10 8 9.6 8 9V7C8 6.4 7.6 6 7 6Z" fill="white"/>
  <path d="M7 11C6.7 11 6.5 10.8 6.5 10.5V9.5C6.5 9.2 6.7 9 7 9C7.3 9 7.5 9.2 7.5 9.5V10.5C7.5 10.8 7.3 11 7 11Z" fill="white"/>
</svg>`;
  
  fs.writeFileSync(path.join(publicDir, 'safari-pinned-tab.svg'), safariSvg);
};

// Run all the functions
const main = () => {
  try {
    console.log('Creating favicon...');
    createFavicon();
    
    console.log('Creating simple icons...');
    createSimpleIcons();
    
    console.log('Creating browser config...');
    createBrowserConfig();
    
    console.log('Creating offline page...');
    createOfflinePage();
    
    console.log('All assets generated successfully!');
    console.log('Note: For production, you should generate proper PNG icons from the SVG file.');
  } catch (error) {
    console.error('Error generating assets:', error);
    process.exit(1);
  }
};

main();
