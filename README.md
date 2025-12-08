# NFC Access Control - Frontend

Web dashboard cho hệ thống kiểm soát vào ra sử dụng thẻ NFC.

## Tính năng

- Hiển thị trạng thái cửa realtime
- Điều khiển mở/khóa cửa từ xa
- Quản lý người dùng và thẻ NFC
- Xem lịch sử truy cập
- Giao diện responsive (Desktop & Mobile)
- Dark theme hiện đại

## Tech Stack

- React 18 + Vite
- Material UI (MUI) v5
- Firebase Realtime Database
- React Router DOM
- Day.js

## Cài đặt

```bash
# Clone repo
git clone https://github.com/YOUR_USERNAME/nfc-access-control-frontend.git
cd nfc-access-control-frontend

# Install dependencies
npm install

# Copy và cấu hình environment
cp .env.example .env
# Sửa file .env với Firebase config của bạn

# Run development server
npm run dev
```

## Cấu hình Firebase

1. Tạo project tại [Firebase Console](https://console.firebase.google.com/)
2. Tạo Realtime Database (chọn region Singapore)
3. Lấy config từ Project Settings > Your apps > Web app
4. Copy vào file `.env`

Xem chi tiết tại [SETUP.md](SETUP.md)

## Cấu trúc thư mục

```
src/
├── components/
│   ├── door/           # DoorStatus, DoorControl
│   ├── history/        # AccessHistoryTable
│   ├── layout/         # Navbar, Sidebar, Layout
│   └── users/          # UserList, AddUserForm
├── hooks/              # useDoorStatus, useAccessLogs, useUsers
├── pages/              # Dashboard, History, Users
├── services/           # Firebase config
└── App.jsx
```

## Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview production build
```

## Tác giả

**Nguyễn Việt Anh**

## License

MIT
