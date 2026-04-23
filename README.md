# Smart Freelance Work & Profit Tracker

A lightweight, modern SaaS-style web application for freelancers to track time, earnings, expenses, and profit in real-time.

## ✨ Features

### Core Features (MVP)
- **⏱️ Time Tracking System**
  - Start/Stop timer with real-time tracking
  - Manual time entry for past sessions
  - Track by project and task
  - Session history with earnings calculation

- **💰 Earnings Calculator**
  - Set hourly rates per project or global rate
  - Auto-calculate earnings per session
  - Track daily, weekly, and monthly earnings
  - View earnings by project

- **💸 Expense Tracker**
  - Add expenses with categories
  - Categories: Tools, Subscriptions, Internet, Other
  - View all expenses with dates
  - Deduct expenses from earnings

- **📊 Profit Dashboard**
  - Summary cards showing:
    - Total earnings
    - Total expenses
    - Net profit
    - Profit margin percentage
    - Total hours tracked
    - Average hourly rate
  - Visual charts:
    - Earnings by project
    - Weekly earnings breakdown
  - Recent activity feed

- **📁 Project/Client Management**
  - Create projects with default hourly rates
  - Track earnings per project
  - View project statistics
  - Easy project selection for time entries

- **🎨 Modern UI**
  - Responsive sidebar navigation
  - Clean SaaS dashboard design
  - Dark mode toggle
  - Mobile-responsive layout
  - Smooth animations and transitions

### Advanced Features
- **🌙 Dark Mode Toggle** - Switch between light and dark themes
- **📥 Data Export** - Export all data as JSON for backup
- **⚙️ Settings Panel** - Configure default rates and preferences
- **📱 Mobile Optimized** - Fully responsive design for phones and tablets
- **💾 Local Data Persistence** - All data stored in browser localStorage

## 🚀 Getting Started

### Requirements
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No backend server needed
- No build tools required

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "Smart Freelance Work & Profit Tracker"
   ```

2. **Open in browser**
   - Simply open `index.html` in your web browser
   - Or use a local server:
     ```bash
     # Using Python 3
     python -m http.server 8000
     
     # Using Python 2
     python -m SimpleHTTPServer 8000
     
     # Using Node.js (if installed)
     npx serve
     ```
   - Visit `http://localhost:8000`

## 📖 How to Use

### Start Tracking Time

1. **Using the Timer**
   - Go to "Time Tracker"
   - Select or create a project
   - Add task description (optional)
   - Set hourly rate (or use default)
   - Click "Start" to begin
   - Click "Stop" when done
   - Session is automatically saved

2. **Manual Entry**
   - Use the "Manual Entry" section
   - Select project and date
   - Enter start and end times
   - Set hourly rate
   - Click "Add Entry"

### Manage Projects

1. Go to "Projects" section
2. Enter project name and default hourly rate
3. Click "Create Project"
4. View all projects with total earnings and hours tracked
5. Delete projects as needed

### Track Expenses

1. Go to "Expenses" section
2. Enter expense description and amount
3. Select category
4. Choose date
5. Click "Add Expense"
6. All expenses automatically deducted from profit

### View Dashboard

- **Summary Cards** show key metrics at a glance
- **Charts** visualize earnings by project and weekly trends
- **Recent Activity** shows recent sessions and expenses
- All calculations update in real-time

### Settings

- Set default hourly rate (used when no project-specific rate set)
- Toggle dark mode
- Export data as JSON backup
- Clear all data (with confirmation)

## 📊 Data Storage

All data is stored locally in your browser's localStorage:
- **Sessions**: Time entries with earnings data
- **Expenses**: Expense records with dates and categories
- **Projects**: Project/client information with rates
- **Settings**: User preferences and rates

Data persists across browser sessions but is not synced across devices.

## 💡 Calculations

### Earnings Formula
```
Earnings = Hours Worked × Hourly Rate
```

### Net Profit Formula
```
Net Profit = Total Earnings - Total Expenses
```

### Profit Margin
```
Profit Margin % = (Net Profit / Total Earnings) × 100
```

## 🎨 Design

- **Modern SaaS Dashboard** - Clean, professional appearance
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Dark Mode** - Easy on the eyes in low-light environments
- **Soft Shadows & Rounded Corners** - Contemporary UI styling
- **Color-coded Cards** - Easy visual identification
  - 🟢 Green: Earnings
  - 🔴 Red: Expenses
  - 🔵 Blue: Profit
  - 🟡 Orange: Hours

## 📱 Browser Compatibility

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🌐 Deployment

### Deploy to GitHub Pages

1. Create a GitHub repository
2. Push code to the `gh-pages` branch
3. Enable GitHub Pages in repository settings
4. Access at `https://github.com/Nasreen1717/Smart-Freelance-Work-Profit-Tracker`

### Deploy to other hosting

Works with any static hosting:
- Vercel
- Netlify
- AWS S3
- Firebase Hosting
- Any web server

## 🔒 Privacy & Security

- All data stored locally in your browser
- No data sent to any server
- No tracking or analytics
- No account required
- Complete privacy and control

## 💾 Backup & Export

1. Go to Settings
2. Click "Export Data (JSON)"
3. Save the JSON file to your computer
4. Import later by copying the file contents (future feature)

## 🐛 Known Limitations

- Data is browser-specific (not synced across devices)
- Clearing browser cache will delete all data
- Limited to localStorage capacity (~5-10MB)
- No cloud sync or backup (use export feature)

## 🚀 Future Enhancements

- Cloud synchronization
- Invoice generation
- Tax report generation
- Budget forecasting
- Team/multi-user support
- Mobile app
- Advanced analytics
- API integration

## 📄 License

MIT License - Feel free to use, modify, and distribute.

## 🙌 Credits

**Powered by** [arbeitrechner.de](https://arbeitrechner.de/)

**GitHub Repository** [View on GitHub](https://github.com/Nasreen1717/Smart-Freelance-Work-Profit-Tracker)

Created as a lightweight, fast, and modern solution for freelance work tracking and profit calculation.

## 📧 Support

For issues, suggestions, or feedback:
- Create an issue in the repository
- Check existing issues for solutions
- Review the code comments for implementation details

## 📝 Version

**Version**: 1.0.1  
**Last Updated**: 2026  
**Status**: Production Ready

---

**Start tracking your freelance work today and maximize your profit!** 💼💰
