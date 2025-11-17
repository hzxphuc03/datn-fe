# Hướng dẫn tạo Repository GitHub và Push Code

## Tổng quan dự án
- **Tên dự án**: DATN Frontend (Angular 14)
- **Loại**: Angular Application
- **Hiện tại**: Đang kết nối với GitLab (`git@gitlab.com:itrequest/datn_fe.git`)

---

## Bước 1: Tạo Repository mới trên GitHub

### 1.1. Đăng nhập GitHub
- Truy cập: https://github.com
- Đăng nhập vào tài khoản của bạn

### 1.2. Tạo Repository mới
1. Click vào biểu tượng **"+"** ở góc trên bên phải
2. Chọn **"New repository"**
3. Điền thông tin:
   - **Repository name**: `datn-fe` (hoặc tên bạn muốn)
   - **Description**: "Đồ án tốt nghiệp - Frontend Angular"
   - **Visibility**: 
     - Chọn **Public** (nếu muốn công khai)
     - Chọn **Private** (nếu muốn riêng tư)
   - **KHÔNG** tích vào "Initialize this repository with a README"
   - **KHÔNG** chọn .gitignore hoặc license (vì đã có sẵn)
4. Click **"Create repository"**

### 1.3. Lưu URL Repository
Sau khi tạo xong, GitHub sẽ hiển thị URL repository. Có 2 loại:
- **HTTPS**: `https://github.com/username/datn-fe.git`
- **SSH**: `git@github.com:username/datn-fe.git`

**Lưu lại URL này để dùng ở bước sau!**

---

## Bước 2: Cấu hình Git Local

### 2.1. Mở Terminal/Command Prompt
Di chuyển đến thư mục dự án:
```bash
cd /Users/phamhaiphuc/Downloads/DATN/FE-ThongKe/datn_fe
```

### 2.2. Kiểm tra trạng thái hiện tại
```bash
git status
```

### 2.3. Xóa remote GitLab cũ (nếu muốn chuyển hoàn toàn sang GitHub)
```bash
git remote remove origin
```

**HOẶC** giữ lại GitLab và thêm GitHub làm remote thứ 2:
```bash
git remote rename origin gitlab
git remote add origin <URL_GITHUB_CỦA_BẠN>
```

**HOẶC** thêm GitHub làm remote thứ 2 (giữ cả GitLab và GitHub):
```bash
git remote add github <URL_GITHUB_CỦA_BẠN>
```

---

## Bước 3: Commit các thay đổi hiện tại

### 3.1. Thêm tất cả các file vào staging
```bash
git add .
```

### 3.2. Commit với message
```bash
git commit -m "Initial commit: Angular 14 project setup"
```

**Lưu ý**: Nếu có nhiều thay đổi, bạn có thể commit từng phần:
```bash
# Commit các file đã sửa đổi
git add -u
git commit -m "Update: Fix và cải thiện các component"

# Commit các file mới (nếu cần)
git add FIXES_APPLIED.md LOGIN_SYSTEM_GUIDE.md QUICK_START.md
git commit -m "Docs: Thêm tài liệu hướng dẫn"
```

---

## Bước 4: Push code lên GitHub

### 4.1. Nếu đã đổi remote origin sang GitHub:
```bash
git push -u origin master
```

**Nếu branch của bạn là `main` thay vì `master`**:
```bash
git push -u origin main
```

### 4.2. Nếu giữ cả GitLab và GitHub (có remote `github`):
```bash
git push -u github master
# hoặc
git push -u github main
```

### 4.3. Nếu gặp lỗi về branch name
GitHub mặc định dùng `main`, còn GitLab thường dùng `master`. Nếu cần đổi:
```bash
# Đổi tên branch local
git branch -M main

# Push lên GitHub
git push -u origin main
```

---

## Bước 5: Xác nhận

1. Truy cập lại repository trên GitHub
2. Kiểm tra xem code đã được push lên chưa
3. Xem các file và commit history

---

## Các lệnh Git hữu ích

### Xem danh sách remote
```bash
git remote -v
```

### Thay đổi URL remote
```bash
git remote set-url origin <URL_MỚI>
```

### Xem các branch
```bash
git branch -a
```

### Tạo branch mới và push
```bash
git checkout -b develop
git push -u origin develop
```

### Pull code từ remote
```bash
git pull origin master
```

---

## Xử lý lỗi thường gặp

### Lỗi: "Permission denied (publickey)"
**Nguyên nhân**: Chưa cấu hình SSH key cho GitHub

**Giải pháp**:
1. Tạo SSH key (nếu chưa có):
```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

2. Copy public key:
```bash
cat ~/.ssh/id_ed25519.pub
```

3. Thêm vào GitHub:
   - Vào Settings → SSH and GPG keys → New SSH key
   - Paste key và lưu

4. Hoặc dùng HTTPS thay vì SSH:
```bash
git remote set-url origin https://github.com/username/datn-fe.git
```

### Lỗi: "Updates were rejected"
**Nguyên nhân**: Remote có commit mới hơn local

**Giải pháp**:
```bash
git pull origin master --rebase
git push origin master
```

### Lỗi: "Large files"
**Nguyên nhân**: File quá lớn (>100MB)

**Giải pháp**: Xóa file lớn khỏi git history hoặc dùng Git LFS

---

## Lưu ý quan trọng

1. **File backup**: Đã cập nhật `.gitignore` để loại bỏ các file `.backup` và `.bak`
2. **Environment files**: Đảm bảo không commit file chứa thông tin nhạy cảm (API keys, passwords)
3. **node_modules**: Đã được ignore, không cần lo lắng
4. **Commit message**: Nên viết rõ ràng, mô tả thay đổi

---

## Checklist trước khi push

- [ ] Đã tạo repository trên GitHub
- [ ] Đã cấu hình remote (origin hoặc github)
- [ ] Đã commit tất cả thay đổi
- [ ] Đã kiểm tra `.gitignore` (loại bỏ file không cần thiết)
- [ ] Đã kiểm tra không có thông tin nhạy cảm trong code
- [ ] Đã push code lên GitHub thành công

---

## Hỗ trợ

Nếu gặp vấn đề, tham khảo:
- [GitHub Docs](https://docs.github.com)
- [Git Documentation](https://git-scm.com/doc)
- [Angular Deployment Guide](https://angular.io/guide/deployment)

