# Dashboard Images

This folder should contain the actual dashboard screenshots for the landing page preview.

## Required Images:

### 1. Desktop Dashboard (`dashboard-desktop.png`)
- **Dimensions**: 1200x750px (16:10 aspect ratio)
- **Format**: PNG with transparency support
- **Content**: Screenshot of the desktop dashboard showing:
  - Navigation sidebar
  - Main dashboard with analytics cards
  - Charts and graphs
  - User interface elements

### 2. Mobile Dashboard (`dashboard-mobile.png`)
- **Dimensions**: 400x300px (4:3 aspect ratio)
- **Format**: PNG with transparency support
- **Content**: Screenshot of the mobile dashboard showing:
  - Mobile-optimized layout
  - Key metrics cards
  - Simplified navigation
  - Touch-friendly interface

## How to Add Images:

1. Take screenshots of your actual StudyBuddy dashboard
2. Resize them to the specified dimensions
3. Save them as PNG files with the exact names:
   - `dashboard-desktop.png`
   - `dashboard-mobile.png`
4. Place them in the `/public` folder

## Current Behavior:

- The component currently shows CSS-generated mockups
- When you hover over the mockups, it will try to load the actual images
- If the actual images are not found, the mockups remain visible
- Once you add the real images, they will overlay the mockups on hover
- You can modify the component to show real images by default

## Tips for Best Screenshots:

- Use a clean, populated dashboard with real data
- Ensure good contrast and readability
- Include key features like charts, metrics, and navigation
- Make sure the UI looks polished and professional
- Consider using sample data that showcases the platform's capabilities
