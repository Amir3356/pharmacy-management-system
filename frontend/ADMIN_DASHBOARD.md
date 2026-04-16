# Admin Dashboard - React + Vite

## Overview

A comprehensive admin dashboard has been created for the Pharmacy Management System using React and Vite. The admin panel provides system statistics, medicine inventory management, and user administration features.

## Features

### 1. **Admin Dashboard** (`/admin/dashboard`)
- **System Statistics**: 
  - Total medicines count
  - Total users count
  - Low stock medicines alert
  - Expired medicines alert
- **Recent Medicines Table**: Displays the 10 most recent medicines with:
  - Name, dosage, quantity, price
  - Expiry date tracking
  - Status badges (Available, Low Stock, Expired)

### 2. **Admin Panel** (`/admin/panel`)
- **User Management Tab**:
  - List all users with creation dates
  - Add new users (with name, email, password)
  - Delete users with confirmation
  - Real-time updates from API
  
- **System Settings Tab**:
  - View application information
  - Access admin functions
  - Generate reports, backup database, view logs (placeholders for expansion)

## File Structure

```
frontend/
├── src/
│   ├── pages/
│   │   ├── AdminDashboard.jsx      # Main admin statistics dashboard
│   │   ├── AdminPanel.jsx          # User management and settings
│   │   └── ...existing pages
│   ├── styles/
│   │   ├── admin.css               # Admin dashboard styles
│   │   └── ...existing styles
│   ├── components/
│   │   ├── Sidebar.jsx             # Updated with admin links
│   │   └── ...existing components
│   └── routes/
│       └── AppRoutes.jsx           # Updated with admin routes
```

## Routes

- `/admin/dashboard` - Admin Dashboard with statistics
- `/admin/panel` - Admin Panel for user management

Both routes are protected and require authentication.

## API Integration

The admin dashboard makes API calls to:

- `GET /api/medicines` - Fetch all medicines for statistics and table
- `GET /api/users` - Fetch all users for user management
- `POST /api/users` - Create new user
- `DELETE /api/users/{id}` - Delete user

### API Requirements

Ensure your Laravel backend provides these endpoints with proper authentication headers:

```php
Route::middleware(['auth:sanctum'])->group(function () {
    Route::apiResource('medicines', MedicineController::class);
    Route::apiResource('users', UserController::class);
});
```

## Styling

The admin dashboard uses a modern gradient design with:
- **Color Scheme**: Purple gradient (#667eea to #764ba2)
- **Components**:
  - Stat cards with icons
  - Responsive tables
  - Status badges
  - Tab navigation
  - Form inputs
  - Interactive buttons

## Responsive Design

The dashboard is fully responsive with:
- Mobile-first approach
- Grid layouts that adapt to screen size
- Touch-friendly buttons and controls
- Optimized table display for small screens

## Usage

### Accessing the Admin Dashboard

1. Log in to the application
2. Navigate to "Admin Dashboard" or "Admin Panel" from the sidebar
3. View statistics, manage medicines, and manage users

### Adding a New User

1. Go to Admin Panel → User Management
2. Click "Add New User"
3. Fill in name, email, and password
4. Click "Create User"

### Viewing Medicine Statistics

1. Go to Admin Dashboard
2. View the statistics cards at the top
3. Scroll down to see the recent medicines table

## Customization

### Modify Stats Cards

Edit `AdminDashboard.jsx` to customize which statistics are displayed:

```javascript
const [stats, setStats] = useState({
  totalMedicines: 0,
  totalUsers: 0,
  lowStockMedicines: 0,
  expiredMedicines: 0
})
```

### Add More Tabs

In `AdminPanel.jsx`, add new tab buttons and content:

```javascript
<button 
  className={`tab-btn ${activeTab === 'newTab' ? 'active' : ''}`}
  onClick={() => setActiveTab('newTab')}
>
  New Tab
</button>
```

### Change Color Scheme

Edit `admin.css` to modify colors:

```css
/* Change primary color */
background: linear-gradient(135deg, #YOUR_COLOR1 0%, #YOUR_COLOR2 100%);
```

## Error Handling

The dashboard includes error handling for:
- API failures
- Network errors
- Missing data
- User deletion confirmation

## Future Enhancements

- 📊 Advanced reporting features
- 📈 Medicine sales analytics
- 🔐 Role-based access control
- 📧 User permissions management
- 💾 Database backup functionality
- 📝 Activity logs viewer
- 🔔 System notifications
- 📱 Mobile app integration

## Troubleshooting

### Admin Dashboard Shows "No Data"

1. Ensure the backend API is running
2. Check API endpoints are correctly configured
3. Verify authentication token is valid
4. Check browser console for API errors

### Styling Not Applied

1. Ensure `admin.css` is properly imported
2. Clear browser cache
3. Rebuild the frontend: `npm run build`

### API Errors

1. Check Laravel backend is running on `http://localhost:8000`
2. Verify CORS is configured in Laravel
3. Check API token in localStorage
4. Review Laravel logs for errors

## Support

For issues or questions about the admin dashboard, check:
- React Router documentation
- Vite documentation
- Laravel API documentation
