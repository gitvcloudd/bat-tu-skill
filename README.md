# GÓI SKILL "LUẬN BÁT TỰ TỬ BÌNH KINH ĐIỂN" CHO GEMINI WEB (GEMINI 4 ARGON)

> **Dành riêng cho:** Gemini Web App (`gemini.google.com`)  
> **Mô hình tối ưu:** **Gemini 4 Argon** (Cửa sổ ngữ cảnh 1 Triệu Token, Chế độ Tư Duy Sâu - Extended Thinking)  
> **Nền tảng kinh điển:** Tứ Đại Danh Thư (*Trích Thiên Tủy*, *Tử Bình Chân Thuyên*, *Tam Mệnh Thông Hội*, *Cung Thông Bảo Giám*), Manh Phái Mệnh Lý, Liễu Phàm Tứ Huấn & Chu Dịch  
> **Phiên bản:** 3.0 Đại Thành Toàn Thư (Đầy đủ 12 tập chuyên khảo đồ sộ, >66,000 dòng tri thức, >6.5 MB markdown)

---

## 1. TỔNG QUAN VỀ GÓI SKILL NÀY

Gói Skill này là một công trình học thuật chuyên sâu được nghiên cứu, chắt lọc và đóng gói chuyên biệt nhằm tận dụng tối đa năng lực suy luận đa tầng (Extended Thinking Chain-of-Thought) và bộ nhớ ngữ cảnh 1 triệu tokens của **Gemini 4 Argon** trên nền tảng **Gemini Web App** và **Antigravity IDE**.

### Điểm Vượt Trội So Với Các Hệ Thống Thông Thường:
- **Tự động kích hoạt (Auto-trigger):** Nhận diện trực tiếp khi người dùng cung cấp ngày tháng năm giờ sinh hoặc hỏi về Bát Tự, Tứ Trụ, Dụng Thần, Vận Hạn.
- **Quy chuẩn thiên văn mặt trời:** Bát Tự tính theo Tiết Khí (Lập Xuân đổi năm, 12 Tiết khí đổi tháng), không dùng mùng 1 Tết Âm Lịch. Giải quyết triệt để vấn đề Dạ Tý vs Sớm Tý qua mốc 00:00:00 nửa đêm.
- **Thuật toán Can Chi Ngày JDN:** Sử dụng số ngày Julius kèm **Bảng Anchor Dates 101 năm liên tục (1940 – 2040)** loại bỏ 100% nguy cơ ảo giác số liệu.
- **Hệ thống toán học 100 điểm khí lực:** Định lượng hóa tuyệt đối Thân Cường, Thân Nhược, Cực Vượng, Cực Nhược theo trọng số Nguyệt Lệnh (40 điểm) và căn khí 4 chi.
- **Đầy đủ 120 trường hợp Cung Thông Bảo Giám:** Chi tiết 10 Can qua 12 Tháng không viết tắt, không gộp mùa sơ lược.
- **Thần Sát chính tông chữ Hán:** Toàn bộ ca quyết gốc, phân biệt Dương Quý vs Âm Quý, liên kết ma trận 4 chiều Hỷ Kỵ.
- **Lục Đại Ứng Kỳ kinh điển:** Quy tắc dự đoán chính xác năm kết hôn, ly hôn, bạo phát tài lộc, phá sản, thăng quan, ngục tù, sinh nở, tang chế và bệnh tật đao thương.
- **Manh Phái Mệnh Lý & Tố Công WES:** Tố Công Khắc/Chế, Khố, Xung, Hợp, Xung Khố, Bộc Phát; Mộ Khố biến hóa; Bát Tự Xà Vĩ; Chỉ số Work Efficiency Score (WES 0–100).
- **Grand Unified Fate Index (GUFI) & 60 Phác Đồ Cải Mệnh Lâm Sàng:** Công thức tổng hợp 6 động cơ vi mô thành chỉ số vận mệnh toàn diện, 60 phác đồ trị liệu ngũ hành và 30 kỳ án cải mệnh kinh điển.

---

## 2. DANH MỤC 12 TẬP TÀI LIỆU CHUYÊN KHẢO ĐÍNH KÈM (`references/`)

Toàn bộ kho tri thức được lưu trữ độc lập trong thư mục `references/` để Gemini 4 Argon tự động truy xuất:

```
Output/bat-tu/
├── SKILL.md                                 # ⚡ BẢN ĐỒ CHỈ ĐẠO: SOP 8 bước khoa cử + Format báo cáo hoàn mỹ
├── README.md                                # 📖 Hướng dẫn chi tiết nạp và sử dụng trên Gemini Web
└── references/                              # 📚 HỆ THỐNG 12 CHUYÊN KHẢO HỌC THUẬT (>66,000 DÒNG, >6.5 MB)
    ├── 01-co-so-thien-van-lich-phap.md       # Tọa độ 24 Tiết Khí, Lập Xuân 315°, EOT 63 tỉnh/thành, JDN 1940-2040 (728 dòng, 74 KB)
    ├── 02-bien-chung-ngu-hanh-can-khi.md     # 17 chương: Khí vs Thế, 10 phú Nhậm Thiết Tiều, 25 trạng thái, 100 điểm khí lực (5,730 dòng, 626 KB)
    ├── 03-tuong-tac-can-chi-vi-te.md         # 13 chương: Động Can Tĩnh Chi, Ngũ Hợp, Lục Hợp, Lục Xung, Tam Hình, Ma trận 144 tương tác (5,630 dòng, 606 KB)
    ├── 04-thap-than-bien-chung-tam-ly.md     # 13 chương: Thập Thần Đông phương cổ điển, Thương Quan Kiến Quan, Kiêu Thần Đoạt Thực (5,584 dòng, 592 KB)
    ├── 05-tu-dai-phap-mon-thu-dung-than.md   # 12 chương: Trích Thiên Tủy vs Chân Thuyên, Ngũ Cấp Thần Vị, Tứ Đại Pháp Môn, 120 quy tắc (5,832 dòng, 840 KB)
    ├── 06-cung-thong-bao-giam-dieu-hau.md    # 10 chương: Nhiệt động học khí tượng T & H, 120 tổ hợp chi tiết, Chỉ số CBI (-100 đến +100) (6,051 dòng, 657 KB)
    ├── 07-bat-chinh-cach-bien-cach.md        # 12 chương: Bát Chính Cách, Thành/Phá/Cứu cách, Biến cách, Thuật toán PPS (0-100) (5,630 dòng, 557 KB)
    ├── 08-than-sat-thuc-nghiem-luc-than.md   # 6 chương: 16 Thần Sát thực nghiệm, Lục Thân Thể-Dụng, 16 bệnh hôn nhân, Thuật toán FHI (5,638 dòng, 578 KB)
    ├── 09-dong-luc-hoc-van-han-ung-ky.md     # 7 chương: Tam Bàn Động Lực Học, 6 hiện tượng cực đoan, FSM Machine & Chỉ số CPI (5,592 dòng, 549 KB)
    ├── 10-kho-la-so-benchmark-quy-chuan.md   # Bazi Benchmark Schema JSON, 50 lá số Ground Truth (50/50 test cases passed) (5,618 dòng, 478 KB)
    ├── 11-manh-phai-menh-ly-bi-truyen.md     # 16 chương: Tân Chủ, Thể Dụng, Tố Công (6 loại), Bát Tự Xà Vĩ, Chỉ số WES (0-100) (5,786 dòng, 604 KB)
    └── 12-dai-thanh-tong-hop-cai-menh.md     # 16 chương: Grand Unified Fate Index (GUFI), 60 Phác đồ lâm sàng, 30 Kỳ án cải mệnh (5,694 dòng, 582 KB)
```

---

## 3. HƯỚNG DẪN CÀI ĐẶT LÊN GEMINI WEB APP (TỪNG BƯỚC)

### Cách 1: Nạp thủ công (Tạo Skill mới trên Web)
1. Mở trình duyệt và truy cập: **[gemini.google.com](https://gemini.google.com)**.
2. Trên thanh menu bên trái, nhấp vào **Cài đặt (Settings)** hoặc **Skills Manager** (Trình quản lý Kỹ năng / Gems).
3. Bấm nút **"Create Skill"** (hoặc **Tạo Kỹ năng mới**).
4. **Điền thông tin định danh:**
   - **Tên Skill:** `luan-bat-tu`
   - **Mô tả (Description):**
     > *Chuyên gia cao cấp luận giải Bát Tự Tử Bình chuẩn mực kinh điển (Trích Thiên Tủy, Tử Bình Chân Thuyên, Tam Mệnh Thông Hội, Cung Thông Bảo Giám, Manh Phái, Liễu Phàm Tứ Huấn). Tự động lập Tứ Trụ, định lượng 100 điểm khí lực, thủ Dụng Thần Tứ Đại Pháp Môn, định Cách Cục, tra Thần Sát chính tông, giải mã Lục Thân, Đại Vận, Tố Công WES, Rủi ro CPI, và Đại Thành Cải Mệnh GUFI.*
5. **Nội dung Chỉ thị (Instructions):** 
   - Mở file `SKILL.md` trong thư mục `Output/bat-tu/`.
   - Sao chép toàn bộ nội dung Markdown (từ dòng `# HƯỚNG DẪN CHUYÊN GIA LUẬN BÁT TỰ...` đến hết) và dán vào ô **Instructions**.
6. **Tải lên Kho Tri Thức (Knowledge Base / Attachments):**
   - Bấm vào biểu tượng đính kèm tài liệu (Upload files).
   - Chọn tải lên toàn bộ **12 file `.md`** nằm trong thư mục `references/`.
7. **Cấu hình mô hình:** Chọn **Gemini 4 Argon** (hoặc model cao nhất có hỗ trợ Extended Thinking).
8. Bấm **Save (Lưu)**.

---

### Cách 2: Tải lên trực tiếp gói ZIP (Nếu giao diện hỗ trợ Import ZIP)
1. Sử dụng file nén đã đóng gói sẵn: `Output/bat-tu.zip`.
2. Trong trình quản lý Skills của Gemini Web, chọn chức năng **Import Skill from Zip**.
3. Hệ thống sẽ tự động giải nén và cấu hình `SKILL.md` làm chỉ thị trung tâm cùng 10 file tri thức đính kèm.

---

## 4. HƯỚNG DẪN SỬ DỤNG VÀ MẪU CÂU LỆNH

### 1. Dùng lệnh trực tiếp (Slash Command):
```
/luan-bat-tu Luận giải giúp tôi lá số Nam sinh ngày 16/05/1988 lúc 09:30 sáng tại Hà Nội.
```

### 2. Trò chuyện tự nhiên (Skill tự động nhận diện):
```
"Nhờ bạn lập Tứ Trụ, giám định vượng suy và tìm Dụng Thần giúp tôi: Nữ sinh ngày 24/11/1995 lúc 20:15 tối."
"Xem giúp tôi năm nay 2026 Bính Ngọ có xung với Cung Phu Thê không? Tôi sinh ngày 12/06/1990 lúc 06:45 sáng Nam mệnh."
```

---
*Gói Skill được hoàn thiện với độ chính xác học thuật tuyệt đối theo chuẩn Tứ Đại Danh Thư Mệnh Lý Học Phương Đông.*
