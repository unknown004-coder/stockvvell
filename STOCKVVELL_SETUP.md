# Stockvvell - Inventory Management System

## Project Overview

**Stockvvell** is a beginner-friendly inventory management website designed as a college-level project. It features a simple, minimal UI with a blue and yellow color palette inspired by Flipkart, focusing on clarity and usability rather than complex visuals.

## Key Features

### 📱 Pages Included

1. **Login Page**
   - Email and password input fields (empty by default)
   - Simple login button
   - No prefilled data or authentication required
   - College project branding

2. **Dashboard**
   - Summary cards showing zero values:
     - Total Products: 0
     - Total Sales: ₹0
     - Demand Score: 0%
     - Low Stock Items: 0
   - Placeholder message: "No data available. Start by adding products."

3. **Inventory Page**
   - Empty product list
   - Stock status sections:
     - In Stock: 0
     - Low Stock: 0
     - Out of Stock: 0
   - "Add Product" button for future functionality

4. **Sales & Demand Page**
   - Empty charts with axis labels only (no data bars or lines)
   - Sales Overview chart placeholder
   - Demand Trends chart placeholder
   - Recent Transactions table (empty)
   - Message: "Sales data will appear once transactions are added."

5. **Alerts Page**
   - No alerts displayed
   - Alert statistics (all zero):
     - Critical: 0
     - Warnings: 0
     - Info: 0
   - Message: "No alerts available. Inventory levels are not set."

### 🎨 Design System

- **Color Palette**: Blue (#1E40AF) and Yellow (#FFD700) - Flipkart-inspired
- **Design Approach**: Minimal, clear, and beginner-friendly
- **Typography**: Segoe UI, clean and readable
- **Components**: Simple cards, tables, and sections
- **Animations**: Minimal and subtle

### 🛠️ Technology Stack

- **Frontend Framework**: React with TypeScript
- **Styling**: Tailwind CSS
- **UI Component Library**: shadcn/ui
- **Routing**: React Router v6
- **Build Tool**: Vite
- **Package Manager**: npm or bun

## Project Structure

```
src/
├── pages/
│   ├── Login.tsx          # Login page
│   ├── Dashboard.tsx      # Dashboard with summary cards
│   ├── Inventory.tsx      # Inventory management
│   ├── Sales.tsx          # Sales & demand charts
│   ├── Alerts.tsx         # Alerts page
│   └── NotFound.tsx       # 404 page
├── components/
│   ├── StatCard.tsx       # Reusable stat card component
│   ├── EmptyState.tsx     # Empty state component
│   └── layout/
│       ├── AppLayout.tsx  # Main app layout
│       └── Sidebar.tsx    # Navigation sidebar
├── App.tsx                # Main app with routing
├── main.tsx               # Entry point
└── index.css              # Global styles
```

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or bun package manager

### Installation Steps

1. **Navigate to project directory:**
   ```bash
   cd simple-stock-tracker-main
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   # or
   bun dev
   ```

4. **Open in browser:**
   - Navigate to `http://localhost:5173`
   - The app will automatically reload on file changes

### Build for Production

```bash
npm run build
# or
bun run build
```

## Color Palette Reference

| Color | Hex | HSL | Usage |
|-------|-----|-----|-------|
| Primary Blue | #3B82F6 | hsl(217, 89%, 51%) | Buttons, headers, accents |
| Yellow | #FFD700 | hsl(44, 100%, 50%) | Highlights, secondary accents |
| Background | #F8F7F4 | hsl(44, 100%, 97%) | Main background |
| Foreground | #1F2937 | hsl(220, 20%, 15%) | Text |
| Success Green | #10B981 | hsl(142, 70%, 45%) | Positive indicators |
| Destructive Red | #EF4444 | hsl(0, 70%, 55%) | Alerts, errors |
| Warning Orange | #F59E0B | hsl(38, 92%, 50%) | Warnings |

## File Modifications Made

### 1. **src/index.css**
- Enhanced styling for components
- Improved visual hierarchy
- Better hover states

### 2. **src/pages/Login.tsx**
- Updated with improved design
- Added demo login info
- Better responsive layout

### 3. **src/pages/Dashboard.tsx**
- Enhanced empty state message
- Better card styling
- Improved visual hierarchy

### 4. **src/pages/Inventory.tsx**
- Improved stock status cards
- Better table header styling
- Enhanced empty state

### 5. **src/pages/Sales.tsx**
- Better chart placeholder design
- Improved message styling
- Enhanced visual feedback

### 6. **src/pages/Alerts.tsx**
- Better alert status cards
- Improved empty state
- Enhanced typography

### 7. **src/components/layout/Sidebar.tsx**
- Improved logo styling
- Better navigation item styling
- Enhanced visual hierarchy

## Usage

### Login Flow
1. Open the application
2. Enter any email and password
3. Click "Login" to access the dashboard

### Navigation
- Use the left sidebar to navigate between pages
- Click "Logout" to return to the login page

## Design Philosophy

This project is intentionally designed to look like an **early-stage college project**, with:
- Basic, clean UI without premium features
- Clear and straightforward layouts
- Minimal animations and effects
- Focus on functionality over aesthetics
- Beginner-friendly code structure
- Simple data structures (all starting at zero)

## Future Enhancement Ideas

For a more complete project, you could add:
1. Product management functionality
2. Sales transaction recording
3. Inventory alerts system
4. User authentication
5. Data persistence (database)
6. Charts library integration
7. Export reports functionality
8. Multi-user support

## Tips for College Project Presentation

1. **Explain the design choices**: Discuss why you chose a minimal design
2. **Show the code structure**: Demonstrate the organized folder structure
3. **Highlight routing**: Show how React Router manages navigation
4. **Point out styling**: Explain the Tailwind CSS color system
5. **Discuss scalability**: Explain how the project could be extended

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Notes

- This is a frontend-only demonstration
- No backend or database connectivity
- All data is reset on page refresh
- Ready for adding backend integration

## Author

Created as a college project for inventory management system learning.

---

**Last Updated**: February 2026
