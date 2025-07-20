#!/bin/bash

# Start the donation app - both frontend and backend

echo "🚀 Starting Round-up Donations App..."

# Check if .env file exists
if [ ! -f "python/.env" ]; then
    echo "❌ Please create python/.env file with your Plaid credentials"
    echo "   Copy python/.env.example and fill in your PLAID_CLIENT_ID and PLAID_SECRET"
    exit 1
fi

# Start Python backend in background
echo "📡 Starting Python backend on port 8000..."
cd python
python server.py &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Start Next.js frontend
echo "🌐 Starting frontend on port 3000..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ App is starting up!"
echo "📡 Backend: http://localhost:8000"
echo "🌐 Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both services"

# Function to kill both processes when script is interrupted
cleanup() {
    echo ""
    echo "🛑 Stopping services..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Services stopped"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID