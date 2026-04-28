#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
墨课 - 静态预览启动脚本
无需安装任何依赖，直接运行即可预览
"""

import os
import sys
import webbrowser
import http.server
import socketserver

PORT = 3000
DIST_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "dist")

def find_available_port(start_port=3000, max_try=10):
    """查找可用端口"""
    import socket
    for port in range(start_port, start_port + max_try):
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.bind(("", port))
                return port
        except OSError:
            continue
    return start_port

def main():
    if not os.path.exists(DIST_DIR):
        print("[错误] 未找到 dist 目录")
        print("提示: 请先运行 'npm run build' 构建项目")
        input("按回车键退出...")
        sys.exit(1)

    port = find_available_port(PORT)
    os.chdir(DIST_DIR)

    print("=" * 45)
    print("  墨课 - 中国艺术学AI教育平台")
    print("=" * 45)
    print()
    print(f"[信息] 服务目录: {DIST_DIR}")
    print(f"[信息] 访问地址: http://localhost:{port}")
    print()
    print("按 Ctrl+C 停止服务器")
    print()

    # 延迟打开浏览器
    def open_browser():
        import threading
        def delayed_open():
            import time
            time.sleep(1.5)
            webbrowser.open(f"http://localhost:{port}")
        threading.Thread(target=delayed_open, daemon=True).start()

    open_browser()

    try:
        with socketserver.TCPServer(("", port), http.server.SimpleHTTPRequestHandler) as httpd:
            print(f"[运行中] 服务器已启动...")
            httpd.serve_forever()
    except KeyboardInterrupt:
        print()
        print("[信息] 服务器已停止")
    except OSError as e:
        print(f"[错误] 端口 {port} 被占用，请关闭占用该端口的程序后重试")
        print(f"详细错误: {e}")
        input("按回车键退出...")

if __name__ == "__main__":
    main()
