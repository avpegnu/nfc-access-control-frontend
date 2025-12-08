# Hướng dẫn Setup

## 1. Cài đặt Dependencies

```bash
npm install
```

## 2. Tạo Firebase Project

1. Truy cập [Firebase Console](https://console.firebase.google.com/)
2. Click **Create a project**
3. Đặt tên project (vd: `nfc-access-control`)
4. Disable Google Analytics (không cần thiết)
5. Click **Create project**

## 3. Tạo Realtime Database

1. Trong Firebase Console, chọn **Build > Realtime Database**
2. Click **Create Database**
3. Chọn location: **Singapore (asia-southeast1)**
4. Chọn **Start in test mode**
5. Click **Enable**

## 4. Lấy Firebase Config

1. Vào **Project Settings** (icon bánh răng)
2. Scroll xuống **Your apps**
3. Click icon **Web (</>)**
4. Đặt tên app: `nfc-web-app`
5. Copy config

## 5. Cấu hình Environment

```bash
cp .env.example .env
```

Sửa file `.env`:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your_project-default-rtdb.asia-southeast1.firebasedatabase.app
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123:web:abc
```

## 6. Setup Database Rules

Vào **Realtime Database > Rules**, paste:

```json
{
  "rules": {
    "doors": {
      ".read": true,
      ".write": true
    },
    "users": {
      ".read": true,
      ".write": true
    },
    "cardIndex": {
      ".read": true,
      ".write": true
    },
    "accessLogs": {
      ".read": true,
      ".write": true
    },
    "systemConfig": {
      ".read": true,
      ".write": true
    }
  }
}
```

## 7. Import dữ liệu mẫu

Vào **Realtime Database**, click **Import JSON**:

```json
{
  "doors": {
    "door_main": {
      "name": "Cửa chính",
      "status": {
        "isOpen": false,
        "isOnline": true,
        "lastUpdated": 0
      },
      "command": {
        "action": "none",
        "processed": true
      }
    }
  },
  "users": {},
  "cardIndex": {},
  "accessLogs": {},
  "systemConfig": {
    "autoLockDelay": 5000,
    "defaultDoorId": "door_main"
  }
}
```

## 8. Chạy Development Server

```bash
npm run dev
```

Truy cập http://localhost:5173

## 9. Build Production

```bash
npm run build
```

Output sẽ ở folder `dist/`
