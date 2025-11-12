# Dashboard Frontend

Real-time cryptocurrency price dashboard built with React and Socket.IO

## 🎯 Features

- ✅ Real-time cryptocurrency price tracking
- ✅ WebSocket connection for instant updates (5-second interval)
- ✅ Beautiful responsive UI with TailwindCSS
- ✅ Live connection status indicator
- ✅ Real-time client count display
- ✅ Automatic reconnection on disconnect
- ✅ Loading states and error handling
- ✅ Mobile-friendly design

## 🛠 Tech Stack

- **Framework**: React 18
- **Styling**: TailwindCSS v3
- **Real-time**: Socket.IO Client v4
- **Build Tool**: Create React App
- **Development**: Node.js v16+

## 📋 Prerequisites

- Node.js v16.0.0 or higher
- npm v8.0.0 or higher
- Backend running on http://localhost:5000

## 🚀 Quick Start

### 1. Installation

```bash
npm install
```

### 2. Environment Setup

Create a `.env` file based on `.env.example`:

```env
REACT_APP_API_URL=http://localhost:5000
```

### 3. Start Backend First

In another terminal:
```bash
cd ../dashboard-backend
npm run dev
```

### 4. Start Frontend

```bash
npm start
```

Frontend will open on `http://localhost:3000`

### 5. Production Build

```bash
npm run build
```

## 🧩 Components

### Dashboard.jsx
Main component handling:
- Socket.IO WebSocket connection
- Real-time data reception
- Connection state management
- Loading and error states
- Grid layout of price cards

### PriceCard.jsx
Individual crypto price display:
- Cryptocurrency name and current price
- 24-hour change percentage with color coding
- Market capitalization
- 24-hour trading volume

## 📱 Responsive Design

- **Mobile** (< 640px): 1 column
- **Tablet** (640px - 1024px): 2 columns
- **Desktop** (> 1024px): 3 columns

## 🔄 Data Flow

1. Component mounts → Establish WebSocket connection
2. Server sends crypto data every 5 seconds
3. Component receives data via Socket.IO events
4. React re-renders with latest prices
5. User sees real-time updates

## 🎨 UI Features

- Gradient background (blue to indigo)
- Card-based layout with shadows
- Color-coded price changes (green ↑ for gains, red ↓ for losses)
- Status indicator (green/yellow/red)
- Real-time update timestamp
- Loading spinner animation
- Error message display

## ⚙️ Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| REACT_APP_API_URL | Backend WebSocket URL | http://localhost:5000 |

## 🚨 Error Handling

The app gracefully handles:
- Connection failures
- API errors
- Network interruptions
- Automatic reconnection (up to 5 attempts)

## 🔗 Connection Status

- **CONNECTING**: Attempting to connect (yellow)
- **CONNECTED**: Successfully connected (green)
- **DISCONNECTED**: Connection lost (red)
- **ERROR**: Connection error occurred (red)

## 📊 Supported Cryptocurrencies

Displays real-time data for:
1. Bitcoin (BTC)
2. Ethereum (ETH)
3. Cardano (ADA)
4. Solana (SOL)
5. Ripple (XRP)

## 🐛 Troubleshooting

### Backend not connecting
1. Verify backend is running: `npm run dev` in dashboard-backend
2. Check REACT_APP_API_URL in .env
3. Ensure frontend URL is in backend CORS_ORIGIN

### Styles not displaying
1. Restart development server
2. Clear browser cache (Ctrl+Shift+Delete)
3. Verify tailwind.config.js content paths

### Data not updating
1. Check backend is fetching from CoinGecko
2. Open Network tab (F12) to inspect WebSocket
3. Check backend console for errors

### Port conflicts
```bash
# Find process using port 3000 {#find-process-using-port-3000  data-source-line="752"}
# Mac/Linux {#maclinux  data-source-line="753"}
lsof -i :3000

# Windows {#windows  data-source-line="756"}
netstat -ano | findstr :3000
``` {data-source-line="758"}

## 📦 Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from CRA

## 🚀 Deployment

Ready for deployment on:
- Vercel ✅ (Recommended)
- Netlify ✅
- GitHub Pages ✅
- Firebase Hosting ✅

## 📄 License

ISC

## 👤 Author

CloudForge Dev Team

---

**Status**: Production Ready
**Last Updated**: 2025-10-28
**Requires**: Backend running on :5000