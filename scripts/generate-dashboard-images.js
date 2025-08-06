/**
 * Script to generate placeholder dashboard images
 * Run with: node scripts/generate-dashboard-images.js
 * 
 * Note: This requires canvas and image manipulation libraries
 * Install with: npm install canvas
 */

const fs = require('fs');
const path = require('path');

// Simple SVG-based placeholder generator
function generateDesktopDashboardSVG() {
  return `
<svg width="1200" height="750" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#f0f9ff;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#e0e7ff;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="1200" height="750" fill="url(#bg)"/>
  
  <!-- Header -->
  <rect x="40" y="40" width="1120" height="80" fill="white" rx="12" opacity="0.9"/>
  <rect x="60" y="60" width="40" height="40" fill="#309CEC" rx="8"/>
  <rect x="120" y="70" width="200" height="20" fill="#e5e7eb" rx="4"/>
  <circle cx="1080" cy="80" r="20" fill="#e5e7eb"/>
  <circle cx="1120" cy="80" r="20" fill="#e5e7eb"/>
  
  <!-- Sidebar -->
  <rect x="40" y="140" width="280" height="570" fill="white" rx="12" opacity="0.9"/>
  <rect x="60" y="160" width="240" height="20" fill="#309CEC" rx="4"/>
  <rect x="60" y="200" width="180" height="16" fill="#e5e7eb" rx="4"/>
  <rect x="60" y="230" width="120" height="16" fill="#e5e7eb" rx="4"/>
  <rect x="60" y="260" width="160" height="16" fill="#e5e7eb" rx="4"/>
  
  <!-- Main Content -->
  <rect x="340" y="140" width="820" height="570" fill="white" rx="12" opacity="0.9"/>
  
  <!-- Stats Cards -->
  <rect x="360" y="160" width="180" height="100" fill="#3b82f6" rx="8"/>
  <rect x="370" y="180" width="80" height="12" fill="white" opacity="0.7" rx="2"/>
  <rect x="370" y="200" width="120" height="20" fill="white" opacity="0.9" rx="4"/>
  
  <rect x="560" y="160" width="180" height="100" fill="#10b981" rx="8"/>
  <rect x="570" y="180" width="80" height="12" fill="white" opacity="0.7" rx="2"/>
  <rect x="570" y="200" width="120" height="20" fill="white" opacity="0.9" rx="4"/>
  
  <rect x="760" y="160" width="180" height="100" fill="#f59e0b" rx="8"/>
  <rect x="770" y="180" width="80" height="12" fill="white" opacity="0.7" rx="2"/>
  <rect x="770" y="200" width="120" height="20" fill="white" opacity="0.9" rx="4"/>
  
  <rect x="960" y="160" width="180" height="100" fill="#ef4444" rx="8"/>
  <rect x="970" y="180" width="80" height="12" fill="white" opacity="0.7" rx="2"/>
  <rect x="970" y="200" width="120" height="20" fill="white" opacity="0.9" rx="4"/>
  
  <!-- Chart Area -->
  <rect x="360" y="280" width="780" height="300" fill="#f9fafb" rx="8"/>
  <text x="370" y="300" font-family="Arial" font-size="16" fill="#374151">Analytics Dashboard</text>
  
  <!-- Chart Bars -->
  <rect x="400" y="350" width="20" height="120" fill="#309CEC" rx="2"/>
  <rect x="440" y="320" width="20" height="150" fill="#309CEC" rx="2"/>
  <rect x="480" y="380" width="20" height="90" fill="#309CEC" rx="2"/>
  <rect x="520" y="300" width="20" height="170" fill="#309CEC" rx="2"/>
  <rect x="560" y="340" width="20" height="130" fill="#309CEC" rx="2"/>
  <rect x="600" y="360" width="20" height="110" fill="#309CEC" rx="2"/>
  <rect x="640" y="330" width="20" height="140" fill="#309CEC" rx="2"/>
  <rect x="680" y="370" width="20" height="100" fill="#309CEC" rx="2"/>
  
  <!-- Bottom Section -->
  <rect x="360" y="600" width="380" height="90" fill="#f3f4f6" rx="8"/>
  <rect x="760" y="600" width="380" height="90" fill="#f3f4f6" rx="8"/>
  
  <text x="600" y="650" font-family="Arial" font-size="24" font-weight="bold" fill="#309CEC" text-anchor="middle">StudyBuddy Dashboard</text>
</svg>`;
}

function generateMobileDashboardSVG() {
  return `
<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <defs>
    <linearGradient id="mobileBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#f0f9ff;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#e0e7ff;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="400" height="300" fill="url(#mobileBg)"/>
  
  <!-- Header -->
  <rect x="20" y="20" width="360" height="40" fill="white" rx="8" opacity="0.9"/>
  <rect x="30" y="30" width="20" height="20" fill="#309CEC" rx="4"/>
  <rect x="60" y="35" width="80" height="10" fill="#e5e7eb" rx="2"/>
  <circle cx="360" cy="40" r="10" fill="#e5e7eb"/>
  
  <!-- Stats Cards -->
  <rect x="20" y="80" width="170" height="60" fill="#3b82f6" rx="6"/>
  <rect x="30" y="95" width="40" height="8" fill="white" opacity="0.7" rx="2"/>
  <rect x="30" y="110" width="60" height="12" fill="white" opacity="0.9" rx="2"/>
  
  <rect x="210" y="80" width="170" height="60" fill="#10b981" rx="6"/>
  <rect x="220" y="95" width="40" height="8" fill="white" opacity="0.7" rx="2"/>
  <rect x="220" y="110" width="60" height="12" fill="white" opacity="0.9" rx="2"/>
  
  <!-- Main Content -->
  <rect x="20" y="160" width="360" height="120" fill="white" rx="8" opacity="0.9"/>
  <rect x="30" y="175" width="340" height="12" fill="#309CEC" rx="2"/>
  <rect x="30" y="195" width="250" height="10" fill="#e5e7eb" rx="2"/>
  <rect x="30" y="215" width="180" height="10" fill="#e5e7eb" rx="2"/>
  
  <!-- Mini Chart -->
  <rect x="30" y="235" width="340" height="35" fill="#f9fafb" rx="4"/>
  <rect x="50" y="250" width="8" height="15" fill="#309CEC" rx="1"/>
  <rect x="70" y="245" width="8" height="20" fill="#309CEC" rx="1"/>
  <rect x="90" y="255" width="8" height="10" fill="#309CEC" rx="1"/>
  <rect x="110" y="240" width="8" height="25" fill="#309CEC" rx="1"/>
  <rect x="130" y="248" width="8" height="17" fill="#309CEC" rx="1"/>
  
  <text x="200" y="20" font-family="Arial" font-size="12" font-weight="bold" fill="#309CEC" text-anchor="middle">StudyBuddy Mobile</text>
</svg>`;
}

// Generate the SVG files
function generateImages() {
  const publicDir = path.join(__dirname, '..', 'public');
  
  // Create desktop dashboard SVG
  const desktopSVG = generateDesktopDashboardSVG();
  fs.writeFileSync(path.join(publicDir, 'dashboard-desktop.svg'), desktopSVG);
  
  // Create mobile dashboard SVG
  const mobileSVG = generateMobileDashboardSVG();
  fs.writeFileSync(path.join(publicDir, 'dashboard-mobile.svg'), mobileSVG);
  
  // //console.log('✅ Dashboard placeholder images generated!');
  // //console.log('📁 Files created:');
  // //console.log('   - public/dashboard-desktop.svg');
  // //console.log('   - public/dashboard-mobile.svg');
  // //console.log('');
  // //console.log('💡 To use these images, update the src paths in dashboard-preview.tsx:');
  // //console.log('   - Change "/dashboard-desktop.png" to "/dashboard-desktop.svg"');
  // //console.log('   - Change "/dashboard-mobile.png" to "/dashboard-mobile.svg"');
}

if (require.main === module) {
  generateImages();
}

module.exports = { generateImages };
