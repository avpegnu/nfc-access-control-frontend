# NFC Access Control - Frontend

Web dashboard cho hệ thống kiểm soát vào ra sử dụng thẻ NFC.

## Kiến trúc hệ thống

```
[Frontend React] ←→ [Backend API] ←→ [Firebase Realtime Database]
                          ↕
                      [ESP32]
```

Frontend giao tiếp với Backend API (không trực tiếp với Firebase), đảm bảo bảo mật tốt hơn.

## Tính năng

- Hiển thị trạng thái cửa realtime (qua SSE)
- Điều khiển mở/khóa cửa từ xa
- Quản lý người dùng và thẻ NFC
- Xem lịch sử truy cập
- Thống kê truy cập realtime
- Giao diện responsive (Desktop & Mobile)
- Dark theme hiện đại

## Tech Stack

- React 18 + Vite
- Material UI (MUI)
- React Router DOM
- Day.js
- Server-Sent Events (SSE) cho realtime updates

## Cài đặt

### 1. Prerequisites

Đảm bảo Backend đang chạy trước. Xem [Backend README](../nfc-access-control-backend/README.md)

### 2. Install dependencies

```bash
cd nfc-access-control-frontend
npm install
```

### 3. Cấu hình environment

```bash
cp .env.example .env
```

Sửa file `.env`:

```bash
VITE_API_URL=http://localhost:3001/api
```

### 4. Chạy development server

```bash
npm run dev
```

Frontend sẽ chạy tại: http://localhost:5173

## Cấu trúc thư mục

```
src/
├── components/
│   ├── auth/           # ProtectedRoute
│   ├── door/           # DoorStatus, DoorControl
│   ├── history/        # AccessHistoryTable
│   ├── layout/         # Navbar, Sidebar, Layout
│   └── users/          # UserList, AddUserForm
├── contexts/           # AuthContext
├── hooks/              # useDoorStatus, useAccessLogs, useUsers
├── pages/              # Dashboard, History, Users, Login
├── services/
│   └── api.js          # API client service
└── App.jsx
```

## API Communication

Frontend sử dụng `api.js` service để giao tiếp với Backend:

```javascript
import api from '../services/api';

// Login
await api.login(email, password);

// Get users
const { data } = await api.getUsers();

// Send door command
await api.sendDoorCommand('door_main', 'unlock');

// Subscribe to realtime events
api.connectSSE((event) => {
  if (event.type === 'door_status') {
    // Update UI
  }
});
```

## Realtime Updates

Frontend nhận realtime updates qua Server-Sent Events (SSE):

- `door_status` - Trạng thái cửa thay đổi
- `access_log` - Log truy cập mới
- `user_update` - User được thêm/sửa/xóa

## Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview production build
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:3001/api` |

## Tác giả

**Nguyễn Việt Anh**

## License

MIT
