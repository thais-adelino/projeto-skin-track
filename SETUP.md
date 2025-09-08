# Qual é minha pele? - Setup Guide

This guide will help you set up your updated skin analysis app with Node.js backend, beautiful gradient UI, and Expo SDK 53.

## What's New

✅ **Expo SDK 53** - Latest Expo SDK with React Native 0.79.5 and React 19  
✅ **Pastel Gradient UI** - Beautiful soft purple-to-peach gradient  
✅ **Transparent Elements** - All buttons and inputs with transparent backgrounds  
✅ **Portuguese Language** - Complete translation to Portuguese Brasil  
✅ **No Emojis** - Clean, emoji-free interface  
✅ **Shadcn-inspired Components** - Glass morphism cards and modern styling  
✅ **Removed Supabase dependency** - Now using Node.js with SQLite  
✅ **Name input form** - Users enter their name before starting  
✅ **Personalized greetings** - Chat starts with "Olá, [name]!"  
✅ **Statistics page** - Shows skin type distribution across all users  
✅ **Data persistence** - User data saved to local database  
✅ **Rebranded** - Changed to "Qual é minha pele?"  

## Quick Start

### 1. Setup Backend Server

```bash
# Install backend dependencies
npm run setup-backend

# Get your computer's IP address (needed for Expo Go)
npm run get-ip

# Start the backend server (in a separate terminal)
npm run backend
```

The backend server will run on `http://localhost:3001` and be accessible from your network.

**Important for Expo Go**: The app is configured to use your computer's IP address (`192.168.0.169:3001`) instead of localhost, so it works with Expo Go on your phone.

### 2. Start the Mobile App

```bash
# Start the Expo development server
npm start

# Then press 'i' for iOS simulator or 'a' for Android emulator
```

## App Flow

1. **Loading Screen** - Pastel gradient with "Qual é minha pele?" branding (2 seconds)
2. **Name Form** - Transparent glass card for name input with pastel gradient background
3. **Skin Analysis Chat** - Personalized questionnaire with transparent elements
4. **Results Page** - Clean cards showing analysis + transparent navigation buttons
5. **Statistics Page** - Beautiful pastel gradient charts showing community skin type distribution
6. **Start Over** - Return to name form for new analysis

## UI Features

- **Pastel Gradient Background** - Soft purple to peach gradient throughout the app
- **Transparent Elements** - All interactive elements with transparent backgrounds
- **Glass Morphism** - Subtle translucent cards with minimal shadows
- **Clean Design** - No emojis, focus on typography and spacing
- **Portuguese Interface** - Complete Brazilian Portuguese translation
- **Modern Typography** - Bold, clean fonts with proper spacing
- **Smooth Animations** - Loading animations and transitions
- **Responsive Design** - Works on all screen sizes

## Backend Features

- **SQLite Database**: Lightweight, file-based storage
- **REST API**: Simple endpoints for saving/retrieving data
- **Real-time Statistics**: Updated as users complete analyses
- **Error Handling**: Graceful fallbacks if backend is unavailable

## SDK 53 Upgrade Details

- **Expo SDK**: Upgraded from 52.0.15 to 53.0.22
- **React Native**: Upgraded from 0.76.3 to 0.79.5
- **React**: Upgraded from 18.3.1 to 19.0.0
- **New Architecture**: Enabled by default for better performance
- **TypeScript**: Updated to 5.8.3 for better type safety
- **All Dependencies**: Updated to SDK 53 compatible versions

## Troubleshooting

### Backend Connection Issues

If you're getting "Network request failed" errors:

1. **Check your IP address**:
   ```bash
   npm run get-ip
   ```

2. **Update the IP in Config.ts**:
   - Open `constants/Config.ts`
   - Replace the IP address with your computer's current IP
   - Save the file

3. **Make sure backend is running**:
   ```bash
   npm run backend
   ```

4. **Check firewall settings**:
   - Make sure your computer's firewall allows connections on port 3001
   - On Mac: System Preferences > Security & Privacy > Firewall
   - On Windows: Windows Defender Firewall

5. **Test the connection**:
   ```bash
   curl http://YOUR_IP:3001/api/statistics
   ```

### Expo Go Issues

- Make sure your phone and computer are on the same WiFi network
- Try restarting the Expo development server
- Clear the Expo Go app cache if needed

## Development

### Frontend
- React Native with Expo SDK 53
- TypeScript for type safety
- Custom gradient UI components
- Portuguese language support

### Backend
- Node.js with Express
- SQLite database
- RESTful API endpoints
- CORS enabled for development
- Automatic table creation

## File Structure

```
whatsmyskintype/
├── app/
│   └── _layout.tsx                 # Updated main app navigation
├── components/
│   ├── NameForm.tsx               # New: Name input form
│   ├── StatisticsPage.tsx         # New: Statistics display
│   ├── ChatBot.tsx                # Updated: Props for navigation
│   └── ProductRecommendations.tsx # Updated: Save data + navigation
├── hooks/
│   └── useChatLogic.ts            # Updated: Personalized greeting + API
├── backend/
│   ├── server.js                  # New: Express server
│   ├── package.json               # New: Backend dependencies
│   └── README.md                  # New: Backend documentation
└── package.json                   # Updated: Backend scripts
```

## Troubleshooting

### Backend Connection Issues
- Make sure backend server is running on port 3001
- Check that CORS is enabled (it is by default)
- Verify the API endpoints are accessible

### Database Issues
- Database file is created automatically at `backend/database.sqlite`
- Delete the database file to reset all data
- Check server logs for database errors

### Mobile App Issues
- Clear Expo cache: `expo start --clear`
- Restart Metro bundler if needed
- Check that all imports are correct

## Next Steps

You can now:
1. Start the backend server
2. Run the mobile app
3. Test the complete flow from name input to statistics
4. See real-time data updates as users complete analyses

The app is now fully functional with Node.js backend instead of Supabase!
