#!/bin/bash
echo "========================================="
echo "  墨课 - 中国艺术学AI教育平台"
echo "========================================="
echo ""

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "[错误] 未检测到 Node.js，请先安装"
    echo "下载地址: https://nodejs.org/"
    exit 1
fi

# 检查 node_modules
if [ ! -d "node_modules" ]; then
    echo "[信息] 首次运行，正在安装依赖..."
    npm install --no-bin-links
    if [ $? -ne 0 ]; then
        echo "[错误] 依赖安装失败"
        exit 1
    fi
fi

echo "[信息] 正在启动开发服务器..."
echo "[信息] 浏览器访问: http://localhost:3000"
echo ""

# 尝试自动打开浏览器
if command -v open &> /dev/null; then
    sleep 2 && open http://localhost:3000 &
elif command -v xdg-open &> /dev/null; then
    sleep 2 && xdg-open http://localhost:3000 &
fi

npm run dev
