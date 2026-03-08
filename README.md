# CoffeeLab ☕

咖啡冲煮记录 Web App，用于记录每日制作咖啡的详细参数，优化萃取方案。

## 技术栈

- **前端**: React 18 + Vite + JavaScript
- **样式**: Tailwind CSS，莫兰迪色系（奶油 / 咖啡 / 淡绿 / 淡橙）
- **图标**: Lucide React
- **存储**: LocalStorage（MVP 本地持久化）
- **适配**: Mobile-first，兼容桌面端

## 快速开始

```bash
# 安装依赖
npm install

# 开发
npm run dev

# 构建
npm run build

# 预览构建结果
npm run preview
```

## 功能概览

| 模块 | 说明 |
|------|------|
| **首页** | 今日统计、月历视图（有记录的日期显示咖啡豆图标）、点击日期查看当日记录列表 |
| **记录** | 豆子信息、设备参数、萃取数据（粉重/液重，自动计算粉液比）、制作方式、饮品调配、风味评分与备注；支持从模板一键填充 |
| **模板** | 豆子库、设备库、饮品配方库的增删改 |
| **统计** | 总记录数、本周数量、制作方式与烘焙度分布；勾选两条记录进入「对比」 |
| **对比** | 左右分栏展示两次冲煮参数，差异项高亮 |

## 项目结构

```
src/
├── components/       # 通用组件
│   ├── Calendar.jsx
│   ├── CompareView.jsx
│   ├── DayLogList.jsx
│   ├── Layout.jsx
│   ├── LoggerForm.jsx
│   ├── StarRating.jsx
│   └── templates/   # 模板相关
│       ├── BeanList.jsx
│       ├── EquipmentList.jsx
│       └── RecipeList.jsx
├── context/
│   └── AppContext.jsx
├── lib/
│   ├── constants.js
│   ├── storage.js
│   └── utils.js
├── pages/
│   ├── HomePage.jsx
│   ├── LogPage.jsx
│   ├── TemplatesPage.jsx
│   ├── StatsPage.jsx
│   └── ComparePage.jsx
├── App.jsx
├── main.jsx
└── index.css
```

## 设计说明

- 配色：奶油色 `cream`、咖啡色 `coffee`、淡绿 `sage`、淡橙 `peach`、石色 `stone`
- 圆角卡片、大按钮、清晰字体，适当使用 Emoji 与图标
- 底部导航：首页、记录、模板、统计

## iOS / App Store 上架

本项目已用 **Capacitor** 包装为 iOS 应用，可在 Mac 上构建并提交至 App Store。

### 环境要求

- **Mac**（iOS 构建需 Xcode，仅支持 macOS）
- **Xcode** 14.1+（从 App Store 安装）
- **CocoaPods**：`sudo gem install cocoapods`
- **Node.js** 16+

### 构建与运行

```bash
# 1. 构建 Web 并同步到 iOS 工程
npm run build:ios

# 2. 在 Xcode 中打开并运行
npm run ios
```

在 Xcode 中：选择真机或模拟器，点击 Run。首次打开需在 `ios/App` 目录执行 `pod install`（若 CLI 未自动执行）。

### 上架前注意

- 在 Xcode 中为项目配置 **Signing & Capabilities**（Team、Bundle ID：`com.coffeelab.app`）。
- 在 [App Store Connect](https://appstoreconnect.apple.com) 创建应用、填写元数据与隐私说明。
- 归档并上传：Product → Archive → Distribute App → App Store Connect。
- 若修改了 `appId` 或 `appName`，需在 Xcode 中同步修改 Bundle Identifier 与 Display Name。

### 配置说明

- **Capacitor 配置**：`capacitor.config.json`（`appId`、`webDir: "dist"` 等）。
- **安全区**：页面已适配刘海与底部横条（`viewport-fit=cover`、`env(safe-area-inset-*)`）。

---

Enjoy your coffee. ☕
