#!/bin/bash
echo "========================================="
echo "  MoKe - Chinese Art AI Education"
echo "========================================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js not found. Please install from https://nodejs.org/"
    exit 1
fi

# Check node_modules
if [ ! -d "node_modules" ]; then
    echo "[INFO] First run, installing dependencies..."
    npm install --no-bin-links
    if [ $? -ne 0 ]; then
        echo "[ERROR] Install failed"
        exit 1
    fi
fi

echo "[INFO] Starting Vite dev server..."
echo "[INFO] Browser will open: http://localhost:5173"
echo ""
echo "To preview production build:"
echo "  npm run build && npm run preview"
echo ""

# Open browser
if command -v open &> /dev/null; then
    (sleep 2 && open http://localhost:5173) &
elif command -v xdg-open &> /dev/null; then
    (sleep 2 && xdg-open http://localhost:5173) &
fi

npm run dev
