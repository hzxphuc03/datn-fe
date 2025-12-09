# 🚀 HƯỚNG DẪN DEPLOY ANGULAR APP LÊN RENDER (STATIC SITE)

## 📋 THÔNG TIN DỰ ÁN

- **Repo**: `<GIT_REPO_URL>` (thay bằng URL repo của bạn)
- **Branch**: `<BRANCH_NAME>` (thường là `master` hoặc `main`)
- **Root Directory**: `.` (root của repo)
- **Project Name**: `datn_fe`
- **Node Version**: `18.x` (khuyến nghị)
- **Build Script**: `npm run build:prod` (sẽ tạo script mới)

---

## 1️⃣ CẬP NHẬT PACKAGE.JSON

### Thêm script build production và engines:

```json
{
  "scripts": {
    "ng": "ng",
    "start": "concurrently \"ng serve\" \"node .\"",
    "build": "ng build",
    "build:prod": "ng build --configuration production",
    "watch": "ng build --watch --configuration development",
    "test": "ng test"
  },
  "engines": {
    "node": "18.x",
    "npm": "9.x"
  }
}
```

**Lệnh cập nhật nhanh:**
```bash
npm pkg set scripts.build:prod="ng build --configuration production"
npm pkg set engines.node="18.x"
npm pkg set engines.npm="9.x"
```

---

## 2️⃣ CẤU HÌNH RENDER STATIC SITE

### Bước 1: Tạo Static Site mới
1. Đăng nhập Render: https://dashboard.render.com
2. Click **"New +"** → **"Static Site"**
3. Kết nối GitHub/GitLab repo

### Bước 2: Điền thông tin

#### **Name**: 
```
datn-fe (hoặc tên bạn muốn)
```

#### **Root Directory**: 
```
. 
```
*(Để trống hoặc `.` nếu repo là root của project)*

#### **Branch**: 
```
<BRANCH_NAME>
```
*(Thường là `master` hoặc `main`)*

#### **Build Command**: 
```bash
npm install && npm run build:prod
```

#### **Publish Directory**: 
```
dist/datn_fe
```

---

## 3️⃣ CẤU HÌNH REWRITE RULES (SPA)

### Trong Render Dashboard:
1. Vào **Settings** của Static Site
2. Tìm mục **"Redirects / Rewrites"**
3. Thêm rule sau:

```
/*    /index.html   200
```

**Hoặc dùng cú pháp JSON:**
```json
[
  {
    "source": "/*",
    "destination": "/index.html",
    "type": 200
  }
]
```

**Lưu ý**: Render có thể tự động detect SPA, nhưng nên set thủ công để chắc chắn.

---

## 4️⃣ ENVIRONMENT VARIABLES (NẾU CẦN)

### Nếu build cần env vars tại build time:

1. Vào **Settings** → **Environment**
2. Thêm các biến:

```
NODE_ENV=production
API_URL=https://ba-datn-1.onrender.com/api
WS_URL=https://ba-datn-1.onrender.com/ws
```

**Lưu ý**: Angular dùng `fileReplacements` trong `angular.json` để thay `environment.ts` → `environment.prod.ts` khi build production, nên không cần env vars trừ khi bạn dùng custom script.

---

## 5️⃣ KIỂM TRA BUILD LOCAL

### Chạy build local trước khi deploy:

```bash
# Install dependencies
npm install

# Build production
npm run build:prod

# Kiểm tra output
ls -la dist/datn_fe/

# Kiểm tra có index.html
ls -la dist/datn_fe/index.html

# Test serve local (optional)
npx http-server dist/datn_fe -p 8080
```

### Kết quả mong đợi:
```
dist/datn_fe/
├── index.html
├── main.[hash].js
├── polyfills.[hash].js
├── runtime.[hash].js
├── styles.[hash].css
└── assets/
```

---

## 6️⃣ TROUBLESHOOTING CHECKLIST

### ❌ Lỗi: "ng: command not found"
**Nguyên nhân**: Angular CLI không được install global
**Giải pháp**: 
- Build command phải dùng: `npm install && npm run build:prod`
- Không dùng `ng build` trực tiếp (trừ khi có `npx ng build`)

### ❌ Lỗi: "Cannot find module '@angular/cli'"
**Nguyên nhân**: Dependencies chưa install
**Giải pháp**: 
- Đảm bảo `package.json` có `@angular/cli` trong `devDependencies`
- Build command phải có `npm install` trước

### ❌ Trang trắng (White Page)
**Nguyên nhân**: 
1. Base href sai
2. Assets path sai
3. Chưa có rewrite rule

**Giải pháp**:
1. Kiểm tra `angular.json` → `baseHref`: nên là `"/"` hoặc để trống
2. Kiểm tra `index.html` → `<base href="/">`
3. Thêm rewrite rule: `/* → /index.html (200)`

### ❌ 404 cho assets (images, fonts, etc.)
**Nguyên nhân**: Path assets không đúng
**Giải pháp**:
1. Kiểm tra `angular.json` → `assets` array
2. Đảm bảo assets được copy vào `dist/datn_fe/assets/`
3. Kiểm tra console browser để xem path bị lỗi

### ❌ Publish Directory sai
**Nguyên nhân**: Output path không khớp
**Giải pháp**:
- Kiểm tra `angular.json` → `outputPath: "dist/datn_fe"`
- Render Publish Directory phải là: `dist/datn_fe`
- Không phải `dist` hoặc `dist/datn_fe/browser`

### ❌ Build thành công nhưng không deploy
**Nguyên nhân**: Render không tìm thấy files
**Giải pháp**:
1. Kiểm tra logs trong Render Dashboard
2. Xem "Build Logs" để tìm lỗi
3. Kiểm tra "Publish Directory" có đúng không

---

## 7️⃣ MONOREPO (NẾU ÁP DỤNG)

### Nếu repo là monorepo (có nhiều projects):

#### Root Directory:
```
frontend/datn_fe
```
*(Path tới thư mục chứa Angular project)*

#### Build Command:
```bash
cd frontend/datn_fe && npm install && npm run build:prod
```

#### Publish Directory:
```
frontend/datn_fe/dist/datn_fe
```

---

## 8️⃣ CUSTOM DOMAIN (TÙY CHỌN)

### Thêm custom domain:

1. Vào **Settings** → **Custom Domains**
2. Click **"Add Custom Domain"**
3. Nhập domain: `yourdomain.com`
4. Render sẽ cung cấp DNS records để thêm vào DNS provider
5. Sau khi verify, domain sẽ tự động SSL (HTTPS)

---

## 9️⃣ TÓM TẮT CẤU HÌNH RENDER

### Copy-paste vào Render UI:

| Field | Value |
|-------|-------|
| **Name** | `datn-fe` |
| **Root Directory** | `.` |
| **Branch** | `<BRANCH_NAME>` |
| **Build Command** | `npm install && npm run build:prod` |
| **Publish Directory** | `dist/datn_fe` |
| **Redirect/Rewrite** | `/* → /index.html (200)` |

---

## 🔟 VERIFY SAU KHI DEPLOY

### Kiểm tra:

1. ✅ Site load được: `https://your-site.onrender.com`
2. ✅ Routing hoạt động (refresh page không 404)
3. ✅ Assets load đúng (images, CSS, JS)
4. ✅ API calls hoạt động (kiểm tra Network tab)
5. ✅ Console không có lỗi

### Test routing:
- Vào trang bất kỳ: `https://your-site.onrender.com/admin`
- Refresh page (F5)
- Nếu không 404 → rewrite rule hoạt động ✅

---

## 📝 NOTES

- Render tự động deploy khi push code lên branch đã set
- Build time thường 3-5 phút
- Free tier có thể sleep sau 15 phút không dùng
- Production build sẽ optimize và minify code
- Environment variables chỉ dùng được nếu bạn dùng custom build script

---

## 🎯 QUICK REFERENCE

```bash
# Local test
npm install
npm run build:prod
npx http-server dist/datn_fe -p 8080

# Render Settings
Build: npm install && npm run build:prod
Publish: dist/datn_fe
Rewrite: /* → /index.html (200)
```

---

**Chúc bạn deploy thành công! 🚀**

