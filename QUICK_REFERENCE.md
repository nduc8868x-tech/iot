# Quick Reference Guide - Bài 4

## ⚡ Fast Start (30 seconds)

```bash
npm install
npm run dev
# Open http://localhost:5173
```

---

## 📁 Các File Quan Trọng

### Frontend Code (Bây giờ)
| File | Purpose |
|------|---------|
| `src/App.tsx` | Main app + DeviceProvider |
| `src/components/DeviceControl.tsx` | Device toggles **with loading** ← KEY |
| `src/context/DeviceContext.tsx` | Global state **with localStorage** ← KEY |
| `src/services/deviceService.ts` | API client |
| `src/services/connectionStatusService.ts` | Connection monitor |
| `src/hooks/useConnection.ts` | Custom hooks |
| `src/components/ConnectionStatus.tsx` | Status UI |

### Documentation (For Demo)
| File | Content |
|------|---------|
| `API_DOCUMENTATION.md` | All endpoints & MQTT topics |
| `SYSTEM_ARCHITECTURE.md` | Diagrams & data flow |
| `DATABASE_SCHEMA.md` | 4 tables SQL |
| `BACKEND_SETUP.md` | Backend templates |
| `README.md` | User guide |
| `BAI4_SUMMARY.md` | This summary |

---

## 🔑 Key Features Implemented

### 1. ✅ Loading State
```
Click → Spinner shows → Wait for response → UI updates
                                    ↑
                            Only if successful
```
**Location:** `src/components/DeviceControl.tsx` line ~60

### 2. ✅ State Persistence
```
localStorage write → Page reload → localStorage read
                    ↓
            Display immediately
```
**Location:** `src/context/DeviceContext.tsx` line ~70

### 3. ✅ Connection Monitor
```
Every 30s: Check API health
    ↓
If fail: Show red banner, auto-retry
```
**Location:** `src/services/connectionStatusService.ts` line ~90

### 4. ✅ Offline Support
```
Device data cached → Internet down → Still shows cached data
                                    ↓
                        Auto-reconnect when back
```
**Location:** `src/context/DeviceContext.tsx`, `src/services/deviceService.ts`

---

## 📝 Demo Talking Points

### ✨ When showing Dashboard:

1. **Metric Cards** "3 sensors monitored in real-time"
2. **Chart** "Updates every 2 seconds from hardware (or mock data)"
3. **Device Controls** 
   - "Click to control device"
   - "Notice spinner appears IMMEDIATELY"
   - "Button becomes disabled during control"
   - "UI updates ONLY after hardware responds"

4. **Connection Status** (header)
   - "Green = Connected, Red = Offline"
   - "Updates every 30 seconds"

### When reloading page:

1. "Press F5 to reload"
2. "Notice: Device states persist"
3. "No blank screen - data from cache"
4. "Fresh data fetches in background"

### When going offline (optional):

1. "Stop backend or disconnect network"
2. "Notice: Red banner appears"
3. "Message shows: 'Disconnected, attempting reconnect'"
4. "Try to control device - error message"
5. "Restart and auto-reconnects after 3 seconds"

---

## 🧪 Quick Testing

### Test 1: Loading State (1 min)
```
1. Go to Dashboard
2. Toggle light switch
3. See spinner immediately ✓
4. Button disabled ✓
5. Text changes to "Đang cập nhật..." ✓
6. UI updates after response ✓
```

### Test 2: Persistence (1 min)
```
1. Toggle device to ON
2. F5 (reload page)
3. Device still ON ✓
4. No blank screen ✓
```

### Test 3: Search (1 min)
```
1. Go to /history
2. Type date range in search
3. Results filter instantly ✓
4. Pagination works ✓
```

---

## 🎯 Demo Sequence (5 min total)

```
[00:00] "Đây là hệ thống IoT hoàn chỉnh"
[00:30] Navigate to Dashboard
        "Hiển thị 3 cảm biến, 3 thiết bị, biểu đồ thời gian thực"

[01:00] Click device toggle
        "Xem spinner xuất hiện ngay lập tức"
        "Button bị vô hiệu hóa"
        "Chờ phản hồi từ hardware (hoặc mock)"
        "UI cập nhật trạng thái mới"

[02:00] Press F5 (reload)
        "Trạng thái thiết bị được lưu"
        "Reload không mất dữ liệu"
        "Dữ liệu tiếp tục cập nhật từ backend"

[03:00] Go to /history
        "Lịch sử dữ liệu cảm biến"
        "Tìm kiếm theo thời gian"
        "Phân trang hoạt động"

[04:00] Show connection indicator
        "Xanh = kết nối, đỏ = mất kết nối"
        "Tự động kiểm tra mỗi 30 giây"
        "Tái kết nối tự động"

[05:00] Q&A
```

---

## 🚨 Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| Cannot load page | `npm run dev` |
| API not connecting | Check `.env.local` & backend running |
| Loading spinner not showing | Check `src/components/DeviceControl.tsx` |
| State not persisting on reload | Check localStorage in DevTools |
| Offline banner not appearing | Network must actually be disconnected |

---

## 📚 Doc References During Demo

```
"Tất cả chi tiết đã được ghi lại"
↓
API_DOCUMENTATION.md      ← Endpoints & MQTT topics
SYSTEM_ARCHITECTURE.md    ← Data flow & diagrams
DATABASE_SCHEMA.md        ← Table designs
BACKEND_SETUP.md          ← Backend implementation
README.md                 ← User guide
```

---

## 🎬 What to Show on Screen

**Before starting:**
- ✅ npm run dev (frontend running)
- ✅ (Optional) Backend running
- ✅ (Optional) Mosquitto running
- ✅ Browser on http://localhost:5173
- ✅ Browser DevTools ready (to show network/storage)

**During demo:**
- Show Dashboard
- Click device toggle (see spinner)
- Reload page (see state persist)
- Show History/pagination
- Show connection indicator
- **(Optional)** Show DevTools → Storage → localStorage

---

## 📊 What Each Doc Says

### API_DOCUMENTATION.md
```
GET /devices            → List all devices
POST /devices/{id}/control → Turn ON/OFF
MQTT topics             → Hardware communication
Error codes             → What can go wrong
cURL examples           → Test commands
```

### SYSTEM_ARCHITECTURE.md
```
System diagram          → How parts connect
Data flow sequences     → What happens step by step
Component architecture  → React structure
State management        → Where data lives
Database design         → 4 tables structure
```

### DATABASE_SCHEMA.md
```
Devices table           → Device configs
SensorData table        → Sensor readings
DeviceActions table     → Control history
SystemLogs table        → Event logs
SQL scripts             → Create all tables
Sample queries          → Common operations
```

### BACKEND_SETUP.md
```
Project structure       → Where files go
Installation steps      → How to set up
Config (.env)           → Environment variables
Route templates         → API endpoints
MQTT service            → Message handling
Testing with cURL       → Verify endpoints
```

---

## 💡 Key Concepts to Understand

### Loading State (Trạng Thái Chờ)
```javascript
// 3 phases:
Phase 1: Click → setLoading(true) → Show spinner
Phase 2: Await API response → Button disabled
Phase 3: Success → setLoading(false) → Update UI
```

### State Persistence (Lưu Lại Trạng Thái)
```javascript
// When device changes:
updateDeviceStatus(id, newStatus)
  ↓
Update React state
  ↓
Write to localStorage: setItem('devices', JSON.stringify(...))

// When page reloads:
Read from localStorage
  ↓
Display immediately
  ↓
Fetch fresh from API in background
```

### Connection Monitoring (Theo Dõi Kết Nối)
```javascript
// Every 30 seconds:
Check GET /api/health
  ↓
If success: setConnected()
If fail: setDisconnected(error)
  ↓
Notify all listeners → Update UI
```

---

## ✅ Demo Checklist

Before demo:
- [ ] `npm run dev` running ✓
- [ ] http://localhost:5173 loads ✓
- [ ] Dashboard displays correctly ✓
- [ ] Can toggle devices ✓
- [ ] Search/pagination works ✓
- [ ] localStorage has 'devices' key ✓
- [ ] All doc files in root folder ✓

During demo:
- [ ] Show loading spinner on device control
- [ ] Reload page and confirm state persists
- [ ] Navigate between pages ✓
- [ ] Show connection indicator
- [ ] Point out key architecture decisions

After demo:
- [ ] Be ready to explain MQTT topics
- [ ] Be ready to explain database schema
- [ ] Be ready to explain loading state implementation
- [ ] Know where offline cache works

---

## 🎓 To Remember

> **Key Requirement #1: Loading State**
> "Phải có trạng thái chờ khi gửi lệnh điều khiển"
> → User sees spinner immediately
> → Button disabled during request
> → UI updates ONLY after success

> **Key Requirement #2: State Persistence**
> "Khi tải lại trang, giao diện phải hiển thị đúng trạng thái hiện tại"
> → localStorage caches device list
> → On reload, display cached state first
> → Fetch fresh data in background

> **Key Requirement #3: Offline Handling**
> "Xử lý trường hợp mất kết nối"
> → Health check every 30 seconds
> → Show disconnect banner when offline
> → Auto-reconnect when back online

---

**Prepared for:** Bài 4 Thuyết Trình  
**Status:** 🟢 Ready  
**Version:** 1.0
