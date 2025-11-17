import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface BlogPost {
  id: number;
  title: string;
  content: string;
  description: string;
  date: string;
  dateTime: string;
  category: string;
  readTime: string;
  author: string;
  image: string;
}

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  posts: BlogPost[] = [
    {
      id: 1,
      title: 'Bộ Sưu Tập Sneaker Hiện Đại 2025',
      content: 'Khám phá những mẫu sneaker hot nhất năm 2025 với thiết kế đột phá, công nghệ tiên tiến và phong cách thời thượng. Từ những đôi giày chạy bộ cao cấp đến sneaker lifestyle, chúng tôi mang đến cho bạn cái nhìn toàn diện về xu hướng giày dép hiện đại nhất.',
      description: 'Khám phá những mẫu sneaker hot nhất năm 2025 với thiết kế đột phá và công nghệ tiên tiến...',
      date: '15/10/2025',
      dateTime: '2025-10-15',
      category: 'Xu Hướng',
      readTime: '5 phút đọc',
      author: 'Admin',
      image: './assets/images/blog-1.jpg'
    },
    {
      id: 2,
      title: 'Hướng Dẫn Chọn Giày Chạy Bộ Phù Hợp',
      content: 'Việc chọn đúng giày chạy bộ có thể cải thiện đáng kể hiệu suất và giảm nguy cơ chấn thương. Tìm hiểu về các loại giày chạy khác nhau, cách xác định kiểu bàn chân của bạn, và những yếu tố quan trọng cần xem xét khi mua giày chạy bộ chuyên nghiệp.',
      description: 'Việc chọn đúng giày chạy bộ có thể cải thiện đáng kể hiệu suất và giảm nguy cơ chấn thương...',
      date: '12/10/2025',
      dateTime: '2025-10-12',
      category: 'Hướng Dẫn',
      readTime: '7 phút đọc',
      author: 'Robin',
      image: './assets/images/blog-2.jpg'
    },
    {
      id: 3,
      title: 'Bí Quyết Bảo Quản Giày Da Bền Đẹp',
      content: 'Giày da cao cấp đòi hỏi sự chăm sóc đặc biệt để duy trì vẻ đẹp sang trọng. Học cách làm sạch, dưỡng ẩm và bảo quản giày da đúng cách để kéo dài tuổi thọ và giữ cho đôi giày luôn như mới. Những mẹo đơn giản nhưng hiệu quả từ chuyên gia.',
      description: 'Giày da cao cấp đòi hỏi sự chăm sóc đặc biệt để duy trì vẻ đẹp sang trọng...',
      date: '08/10/2025',
      dateTime: '2025-10-08',
      category: 'Chăm Sóc',
      readTime: '4 phút đọc',
      author: 'Selsa',
      image: './assets/images/blog-3.jpg'
    },
    {
      id: 4,
      title: 'Top Giày Tập Gym Tốt Nhất Năm 2025',
      content: 'Tìm kiếm đôi giày hoàn hảo cho phòng gym? Chúng tôi đã thử nghiệm và đánh giá các mẫu giày tập luyện hàng đầu, từ giày tập đa năng đến giày nâng tạ chuyên dụng. Khám phá những lựa chọn tốt nhất cho mọi loại hình tập luyện và ngân sách.',
      description: 'Tìm kiếm đôi giày hoàn hảo cho phòng gym? Chúng tôi đã thử nghiệm và đánh giá các mẫu giày tập luyện hàng đầu...',
      date: '05/10/2025',
      dateTime: '2025-10-05',
      category: 'Đánh Giá',
      readTime: '6 phút đọc',
      author: 'Pawar',
      image: './assets/images/blog-4.jpg'
    },
    {
      id: 5,
      title: 'Phối Giày Trắng Với Trang Phục Công Sở',
      content: 'Giày sneaker trắng không chỉ dành cho trang phục casual. Khám phá cách phối giày trắng một cách tinh tế và chuyên nghiệp với đồ công sở, tạo nên phong cách hiện đại, thoải mái nhưng vẫn lịch sự và sang trọng cho môi trường làm việc.',
      description: 'Giày sneaker trắng không chỉ dành cho trang phục casual. Khám phá cách phối giày trắng một cách tinh tế...',
      date: '01/10/2025',
      dateTime: '2025-10-01',
      category: 'Phong Cách',
      readTime: '5 phút đọc',
      author: 'Admin',
      image: './assets/images/blog-1.jpg'
    }
  ];

  readMore(postId: number): void {
    console.log('Đọc thêm bài viết:', postId);
    // Có thể navigate đến trang chi tiết bài viết
  }

  loadMore(): void {
    console.log('Tải thêm bài viết');
    // Logic để tải thêm bài viết
  }
}
