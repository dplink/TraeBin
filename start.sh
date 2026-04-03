#!/bin/bash

# 启动脚本 - Unix版本 (Linux/macOS)
# 功能：安装依赖并启动开发服务器

echo "==================================="
echo "🌸 洛芙的项目启动脚本 🌸"
echo "==================================="
echo

# 检查是否安装了npm
if ! command -v npm &> /dev/null; then
    echo "❌ 错误：未找到npm，请先安装Node.js"
    echo "下载地址：https://nodejs.org/en/download/"
    read -p "按回车键退出..."
    exit 1
fi

echo "📦 正在安装依赖..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ 依赖安装失败"
    read -p "按回车键退出..."
    exit 1
fi

echo "🚀 启动开发服务器..."
npm run dev