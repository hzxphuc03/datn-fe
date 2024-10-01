export interface ChiTietSanPham {
  id: number;
  ngayTao: string; // ISO date string
  ngaySua: string; // ISO date string
  hinhAnh: string;
  giaHienHanh: number;
  soLuong: number;
  trangThai: number;
  sanPham: number; // ID của sản phẩm
  mauSac: number; // ID của màu sắc
  kichCo: number; // ID của kích cỡ
  giamGia: number;
  thuongHieu: number; // ID của thương hiệu
  theLoai: number; // ID của thể loại
}

export interface SanPham {
  id: number;
  ma: string;
  ten: string;
  moTa: string;
  ngayTao: string; // ISO date string
  soLuongDaBan: number;
  nguoiTao: string;
  trangThai: number;
  ngaySua: string; // ISO date string
}

// Ví dụ về cách sử dụng
export interface SanPhamFull {
  chiTiet: ChiTietSanPham;
  sanPham: SanPham;
}
