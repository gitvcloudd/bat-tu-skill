/**
 * ĐỘNG CƠ TÍNH TOÁN BÁT TỰ TỨ TRỤ CHUYÊN SÂU (TU TRU ENGINE)
 * Phiên bản: 1.0 Chuyên sâu — Thiết kế cho Skill Luận Bát Tự
 * Nền tảng: Node.js (Zero-dependency, tính toán cơ học thiên văn chính xác)
 * 
 * Các tính năng cốt lõi:
 * 1. Chuyển đổi Dương lịch -> Julian Day Number (JDN) chuẩn Fliegel & Van Flandern.
 * 2. Tính toán chính xác vị trí biểu kiến của Mặt Trời (Jean Meeus Astronomical Algorithms)
 *    để xác định thời điểm chính xác của 24 Tiết Khí đến từng phút/giây.
 * 3. Phân định Lập Xuân đổi năm, 12 Tiết khí đổi tháng.
 * 4. Xử lý triệt để bài toán Dạ Tý (23:00 - 24:00) vs Sớm Tý (00:00 - 01:00).
 * 5. Hiệu chỉnh Giờ Mặt Trời Thực (True Solar Time / Equation of Time) theo kinh độ các tỉnh thành VN.
 * 6. Tính Can Chi 4 Trụ (Ngũ Hổ Độn, Ngũ Thử Độn, Tàng can 12 Chi theo tỷ lệ).
 * 7. Xác định Thập Thần, Vòng Trường Sinh 12 Cung, Nạp Âm 60 Hoa Giáp.
 * 8. Tính chính xác tuổi khởi Đại Vận (3 ngày = 1 năm, 1 ngày = 4 tháng, 1 giờ = 5 ngày)
 *    và xuất lộ trình 8 - 10 bước Đại Vận 10 năm.
 */

const CAN = ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"];
const CHI = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];
const CAN_HAN = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const CHI_HAN = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];

const NGU_HANH_CAN = {
  "Giáp": { hanh: "Mộc", amDuong: "Dương" },
  "Ất": { hanh: "Mộc", amDuong: "Âm" },
  "Bính": { hanh: "Hỏa", amDuong: "Dương" },
  "Đinh": { hanh: "Hỏa", amDuong: "Âm" },
  "Mậu": { hanh: "Thổ", amDuong: "Dương" },
  "Kỷ": { hanh: "Thổ", amDuong: "Âm" },
  "Canh": { hanh: "Kim", amDuong: "Dương" },
  "Tân": { hanh: "Kim", amDuong: "Âm" },
  "Nhâm": { hanh: "Thủy", amDuong: "Dương" },
  "Quý": { hanh: "Thủy", amDuong: "Âm" }
};

const NGU_HANH_CHI = {
  "Tý": "Thủy", "Sửu": "Thổ", "Dần": "Mộc", "Mão": "Mộc",
  "Thìn": "Thổ", "Tỵ": "Hỏa", "Ngọ": "Hỏa", "Mùi": "Thổ",
  "Thân": "Kim", "Dậu": "Kim", "Tuất": "Thổ", "Hợi": "Thủy"
};

// Tàng can chi tiết theo Nhân Nguyên Tư Sự (Bản khí, Trung khí, Dư khí)
const TANG_CAN = {
  "Tý": [{ can: "Quý", phanTram: 100, loai: "Bản khí" }],
  "Sửu": [
    { can: "Kỷ", phanTram: 60, loai: "Bản khí" },
    { can: "Quý", phanTram: 30, loai: "Trung khí" },
    { can: "Tân", phanTram: 10, loai: "Dư khí" }
  ],
  "Dần": [
    { can: "Giáp", phanTram: 60, loai: "Bản khí" },
    { can: "Bính", phanTram: 30, loai: "Trung khí" },
    { can: "Mậu", phanTram: 10, loai: "Dư khí" }
  ],
  "Mão": [{ can: "Ất", phanTram: 100, loai: "Bản khí" }],
  "Thìn": [
    { can: "Mậu", phanTram: 60, loai: "Bản khí" },
    { can: "Ất", phanTram: 30, loai: "Trung khí" },
    { can: "Quý", phanTram: 10, loai: "Dư khí" }
  ],
  "Tỵ": [
    { can: "Bính", phanTram: 60, loai: "Bản khí" },
    { can: "Mậu", phanTram: 30, loai: "Trung khí" },
    { can: "Canh", phanTram: 10, loai: "Dư khí" }
  ],
  "Ngọ": [
    { can: "Đinh", phanTram: 70, loai: "Bản khí" },
    { can: "Kỷ", phanTram: 30, loai: "Trung khí" }
  ],
  "Mùi": [
    { can: "Kỷ", phanTram: 60, loai: "Bản khí" },
    { can: "Đinh", phanTram: 30, loai: "Trung khí" },
    { can: "Ất", phanTram: 10, loai: "Dư khí" }
  ],
  "Thân": [
    { can: "Canh", phanTram: 60, loai: "Bản khí" },
    { can: "Nhâm", phanTram: 30, loai: "Trung khí" },
    { can: "Mậu", phanTram: 10, loai: "Dư khí" }
  ],
  "Dậu": [{ can: "Tân", phanTram: 100, loai: "Bản khí" }],
  "Tuất": [
    { can: "Mậu", phanTram: 60, loai: "Bản khí" },
    { can: "Tân", phanTram: 30, loai: "Trung khí" },
    { can: "Đinh", phanTram: 10, loai: "Dư khí" }
  ],
  "Hợi": [
    { can: "Nhâm", phanTram: 70, loai: "Bản khí" },
    { can: "Giáp", phanTram: 30, loai: "Trung khí" }
  ]
};

// Bảng 24 Tiết Khí và tọa độ kinh độ Mặt Trời (độ)
const SOLAR_TERMS = [
  { name: "Xuân Phân", deg: 0, isTiet: false, monthIdx: 1 },
  { name: "Thanh Minh", deg: 15, isTiet: true, monthIdx: 2 },
  { name: "Cốc Vũ", deg: 30, isTiet: false, monthIdx: 2 },
  { name: "Lập Hạ", deg: 45, isTiet: true, monthIdx: 3 },
  { name: "Tiểu Mãn", deg: 60, isTiet: false, monthIdx: 3 },
  { name: "Mang Chủng", deg: 75, isTiet: true, monthIdx: 4 },
  { name: "Hạ Chí", deg: 90, isTiet: false, monthIdx: 4 },
  { name: "Tiểu Thử", deg: 105, isTiet: true, monthIdx: 5 },
  { name: "Đại Thử", deg: 120, isTiet: false, monthIdx: 5 },
  { name: "Lập Thu", deg: 135, isTiet: true, monthIdx: 6 },
  { name: "Xử Thử", deg: 150, isTiet: false, monthIdx: 6 },
  { name: "Bạch Lộ", deg: 165, isTiet: true, monthIdx: 7 },
  { name: "Thu Phân", deg: 180, isTiet: false, monthIdx: 7 },
  { name: "Hàn Lộ", deg: 195, isTiet: true, monthIdx: 8 },
  { name: "Sương Giáng", deg: 210, isTiet: false, monthIdx: 8 },
  { name: "Lập Đông", deg: 225, isTiet: true, monthIdx: 9 },
  { name: "Tiểu Tuyết", deg: 240, isTiet: false, monthIdx: 9 },
  { name: "Đại Tuyết", deg: 255, isTiet: true, monthIdx: 10 },
  { name: "Đông Chí", deg: 270, isTiet: false, monthIdx: 10 },
  { name: "Tiểu Hàn", deg: 285, isTiet: true, monthIdx: 11 },
  { name: "Đại Hàn", deg: 300, isTiet: false, monthIdx: 11 },
  { name: "Lập Xuân", deg: 315, isTiet: true, monthIdx: 0 },
  { name: "Vũ Thủy", deg: 330, isTiet: false, monthIdx: 0 },
  { name: "Kinh Trập", deg: 345, isTiet: true, monthIdx: 1 }
];

// Kinh độ các tỉnh thành phổ biến tại Việt Nam (độ Đông)
const VIETNAM_PROVINCES = {
  "Hanoi": 105.85,
  "HaNoi": 105.85,
  "Hà Nội": 105.85,
  "HCM": 106.66,
  "HoChiMinh": 106.66,
  "TP.HCM": 106.66,
  "DaNang": 108.22,
  "Đà Nẵng": 108.22,
  "HaiPhong": 106.68,
  "Hải Phòng": 106.68,
  "CanTho": 105.78,
  "Cần Thơ": 105.78,
  "Hue": 107.59,
  "Huế": 107.59,
  "NhaTrang": 109.19,
  "Vinh": 105.68,
  "Standard": 105.0 // Kinh tuyến chuẩn UTC+7
};

// Bảng Nạp Âm 60 Hoa Giáp
const NAYIN_TABLE = {
  "Giáp Tý": "Hải Trung Kim", "Ất Sửu": "Hải Trung Kim",
  "Bính Dần": "Lư Trung Hỏa", "Đinh Mão": "Lư Trung Hỏa",
  "Mậu Thìn": "Đại Lâm Mộc", "Kỷ Tỵ": "Đại Lâm Mộc",
  "Canh Ngọ": "Lộ Bàng Thổ", "Tân Mùi": "Lộ Bàng Thổ",
  "Nhâm Thân": "Kiếm Phong Kim", "Quý Dậu": "Kiếm Phong Kim",
  "Giáp Tuất": "Sơn Đầu Hỏa", "Ất Hợi": "Sơn Đầu Hỏa",
  "Bính Tý": "Giản Hạ Thủy", "Đinh Sửu": "Giản Hạ Thủy",
  "Mậu Dần": "Thành Đầu Thổ", "Kỷ Mão": "Thành Đầu Thổ",
  "Canh Thìn": "Bạch Lạp Kim", "Tân Tỵ": "Bạch Lạp Kim",
  "Nhâm Ngọ": "Dương Liễu Mộc", "Quý Mùi": "Dương Liễu Mộc",
  "Giáp Thân": "Tuyền Trung Thủy", "Ất Dậu": "Tuyền Trung Thủy",
  "Bính Tuất": "Ốc Thượng Thổ", "Đinh Hợi": "Ốc Thượng Thổ",
  "Mậu Tý": "Tích Lịch Hỏa", "Kỷ Sửu": "Tích Lịch Hỏa",
  "Canh Dần": "Tùng Bách Mộc", "Tân Mão": "Tùng Bách Mộc",
  "Nhâm Thìn": "Trường Lưu Thủy", "Quý Tỵ": "Trường Lưu Thủy",
  "Giáp Ngọ": "Sa Trung Kim", "Ất Mùi": "Sa Trung Kim",
  "Bính Thân": "Sơn Hạ Hỏa", "Đinh Dậu": "Sơn Hạ Hỏa",
  "Mậu Tuất": "Bình Địa Mộc", "Kỷ Hợi": "Bình Địa Mộc",
  "Canh Tý": "Bích Thượng Thổ", "Tân Sửu": "Bích Thượng Thổ",
  "Nhâm Dần": "Kim Bạch Kim", "Quý Mão": "Kim Bạch Kim",
  "Giáp Thìn": "Phú Đăng Hỏa", "Ất Tỵ": "Phú Đăng Hỏa",
  "Bính Ngọ": "Thiên Hà Thủy", "Đinh Mùi": "Thiên Hà Thủy",
  "Mậu Thân": "Đại Trạch Thổ", "Kỷ Dậu": "Đại Trạch Thổ",
  "Canh Tuất": "Thoa Xuyến Kim", "Tân Hợi": "Thoa Xuyến Kim",
  "Nhâm Tý": "Tang Đố Mộc", "Quý Sửu": "Tang Đố Mộc",
  "Giáp Dần": "Đại Khê Thủy", "Ất Mão": "Đại Khê Thủy",
  "Bính Thìn": "Sa Trung Thổ", "Đinh Tỵ": "Sa Trung Thổ",
  "Mậu Ngọ": "Thiên Thượng Hỏa", "Kỷ Mùi": "Thiên Thượng Hỏa",
  "Canh Thân": "Thạch Lựu Mộc", "Tân Dậu": "Thạch Lựu Mộc",
  "Nhâm Tuất": "Đại Hải Thủy", "Quý Hợi": "Đại Hải Thủy"
};

// Bảng 12 Cung Trường Sinh của 10 Can tại 12 Chi
const TRUONG_SINH_TABLE = {
  "Giáp": { "Hợi": "Trường Sinh", "Tý": "Mộc Dục", "Sửu": "Quan Đới", "Dần": "Lâm Quan", "Mão": "Đế Vượng", "Thìn": "Suy", "Tỵ": "Bệnh", "Ngọ": "Tử", "Mùi": "Mộ", "Thân": "Tuyệt", "Dậu": "Thai", "Tuất": "Dưỡng" },
  "Ất":   { "Ngọ": "Trường Sinh", "Tỵ": "Mộc Dục", "Thìn": "Quan Đới", "Mão": "Lâm Quan", "Dần": "Đế Vượng", "Sửu": "Suy", "Tý": "Bệnh", "Hợi": "Tử", "Tuất": "Mộ", "Dậu": "Tuyệt", "Thân": "Thai", "Mùi": "Dưỡng" },
  "Bính": { "Dần": "Trường Sinh", "Mão": "Mộc Dục", "Thìn": "Quan Đới", "Tỵ": "Lâm Quan", "Ngọ": "Đế Vượng", "Mùi": "Suy", "Thân": "Bệnh", "Dậu": "Tử", "Tuất": "Mộ", "Hợi": "Tuyệt", "Tý": "Thai", "Sửu": "Dưỡng" },
  "Đinh": { "Dậu": "Trường Sinh", "Thân": "Mộc Dục", "Mùi": "Quan Đới", "Ngọ": "Lâm Quan", "Tỵ": "Đế Vượng", "Thìn": "Suy", "Mão": "Bệnh", "Dần": "Tử", "Sửu": "Mộ", "Tý": "Tuyệt", "Hợi": "Thai", "Tuất": "Dưỡng" },
  "Mậu":  { "Dần": "Trường Sinh", "Mão": "Mộc Dục", "Thìn": "Quan Đới", "Tỵ": "Lâm Quan", "Ngọ": "Đế Vượng", "Mùi": "Suy", "Thân": "Bệnh", "Dậu": "Tử", "Tuất": "Mộ", "Hợi": "Tuyệt", "Tý": "Thai", "Sửu": "Dưỡng" },
  "Kỷ":   { "Dậu": "Trường Sinh", "Thân": "Mộc Dục", "Mùi": "Quan Đới", "Ngọ": "Lâm Quan", "Tỵ": "Đế Vượng", "Thìn": "Suy", "Mão": "Bệnh", "Dần": "Tử", "Sửu": "Mộ", "Tý": "Tuyệt", "Hợi": "Thai", "Tuất": "Dưỡng" },
  "Canh": { "Tỵ": "Trường Sinh", "Ngọ": "Mộc Dục", "Mùi": "Quan Đới", "Thân": "Lâm Quan", "Dậu": "Đế Vượng", "Tuất": "Suy", "Hợi": "Bệnh", "Tý": "Tử", "Sửu": "Mộ", "Dần": "Tuyệt", "Mão": "Thai", "Thìn": "Dưỡng" },
  "Tân":  { "Tý": "Trường Sinh", "Hợi": "Mộc Dục", "Tuất": "Quan Đới", "Dậu": "Lâm Quan", "Thân": "Đế Vượng", "Mùi": "Suy", "Ngọ": "Bệnh", "Tỵ": "Tử", "Thìn": "Mộ", "Mão": "Tuyệt", "Dần": "Thai", "Sửu": "Dưỡng" },
  "Nhâm": { "Thân": "Trường Sinh", "Dậu": "Mộc Dục", "Tuất": "Quan Đới", "Hợi": "Lâm Quan", "Tý": "Đế Vượng", "Sửu": "Suy", "Dần": "Bệnh", "Mão": "Tử", "Thìn": "Mộ", "Tỵ": "Tuyệt", "Ngọ": "Thai", "Mùi": "Dưỡng" },
  "Quý":  { "Mão": "Trường Sinh", "Dần": "Mộc Dục", "Sửu": "Quan Đới", "Tý": "Lâm Quan", "Hợi": "Đế Vượng", "Tuất": "Suy", "Dậu": "Bệnh", "Thân": "Tử", "Mùi": "Mộ", "Ngọ": "Tuyệt", "Tỵ": "Thai", "Thìn": "Dưỡng" }
};

/* ================== CÁC HÀM TOÁN THIÊN VĂN ================== */

function gregorianToJDN(year, month, day, hour = 12, minute = 0, second = 0) {
  let y = year;
  let m = month;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  let a = Math.floor(y / 100);
  let b = 2 - a + Math.floor(a / 4);
  let dayFraction = (hour + minute / 60.0 + second / 3600.0) / 24.0;
  let jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + dayFraction + b - 1524.5;
  return jd;
}

function jdToDate(jd, timezoneOffsetHours = 7) {
  let jdLocal = jd + timezoneOffsetHours / 24.0;
  let z = Math.floor(jdLocal + 0.5);
  let f = (jdLocal + 0.5) - z;
  let a = z;
  if (z >= 2299161) {
    let alpha = Math.floor((z - 1867216.25) / 36524.25);
    a = z + 1 + alpha - Math.floor(alpha / 4);
  }
  let b = a + 1524;
  let c = Math.floor((b - 122.1) / 365.25);
  let d = Math.floor(365.25 * c);
  let e = Math.floor((b - d) / 30.6001);
  let day = b - d - Math.floor(30.6001 * e) + f;
  let month = (e < 14) ? e - 1 : e - 13;
  let year = (month > 2) ? c - 4716 : c - 4715;
  let dayInt = Math.floor(day);
  let hoursFrac = (day - dayInt) * 24.0;
  let hours = Math.floor(hoursFrac);
  let minutesFrac = (hoursFrac - hours) * 60.0;
  let minutes = Math.floor(minutesFrac);
  let seconds = Math.floor((minutesFrac - minutes) * 60.0);
  return { year, month, day: dayInt, hours, minutes, seconds };
}

// Tính Kinh độ biểu kiến Mặt Trời (Jean Meeus)
function sunApparentLongitude(jd) {
  let T = (jd - 2451545.0) / 36525.0;
  let L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
  let M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
  let Mrad = M * Math.PI / 180.0;
  let C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(Mrad)
        + (0.019993 - 0.000101 * T) * Math.sin(2 * Mrad)
        + 0.000289 * Math.sin(3 * Mrad);
  let trueLong = L0 + C;
  let omega = 125.04 - 1934.136 * T;
  let lambda = trueLong - 0.00569 - 0.00478 * Math.sin(omega * Math.PI / 180.0);
  lambda = lambda % 360.0;
  if (lambda < 0) lambda += 360.0;
  return lambda;
}

// Tìm thời điểm chính xác (JD) mà Mặt Trời đạt kinh độ mục tiêu
function findSolarTermJD(targetYear, targetDeg) {
  // Ước lượng ngày trong năm: 315 độ vào khoảng Feb 4, 0 độ vào Mar 21...
  let baseJD = gregorianToJDN(targetYear, 1, 1, 0, 0, 0);
  // Góc lệch tính từ Lập Xuân (315 độ)
  let angleFromSpring = (targetDeg - 315 + 360) % 360;
  let approxDays = 34.5 + angleFromSpring * (365.2422 / 360.0);
  let jd = baseJD + approxDays;

  // Lặp Newton-Raphson 10 bước để đạt độ chính xác dưới 1 giây
  for (let i = 0; i < 15; i++) {
    let l = sunApparentLongitude(jd);
    let diff = targetDeg - l;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    if (Math.abs(diff) < 0.00001) break;
    jd += diff / 0.9856; // Tốc độ biểu kiến của Mặt Trời ~0.9856 độ / ngày
  }
  return jd;
}

// Phương trình thời gian (Equation of Time)
function getEquationOfTime(jd) {
  let T = (jd - 2451545.0) / 36525.0;
  let L0 = 280.46646 + 36000.76983 * T;
  let M = 357.52911 + 35999.05029 * T;
  let Mrad = M * Math.PI / 180.0;
  let L0rad = L0 * Math.PI / 180.0;
  let e = 0.016708634 - 0.000042037 * T;
  let eps = 23.439291 - 0.0130042 * T;
  let epsRad = eps * Math.PI / 180.0;
  let y = Math.tan(epsRad / 2.0);
  y = y * y;
  let Etime = y * Math.sin(2 * L0rad) - 2 * e * Math.sin(Mrad) + 4 * e * y * Math.sin(Mrad) * Math.cos(2 * L0rad)
            - 0.5 * y * y * Math.sin(4 * L0rad) - 1.25 * e * e * Math.sin(2 * Mrad);
  return Etime * (180.0 / Math.PI) * 4.0; // Đổi ra phút
}

// Hiệu chỉnh Giờ Mặt Trời Thực (True Solar Time)
function calculateTrueSolarTime(year, month, day, hour, minute, provinceName = "Hanoi") {
  let lon = VIETNAM_PROVINCES[provinceName] || 105.85;
  let standardMeridian = 105.0; // UTC+7 tương ứng kinh tuyến 105 độ Đông
  let jd = gregorianToJDN(year, month, day, hour, minute, 0);
  let eotMinutes = getEquationOfTime(jd);
  let longitudeCorrectionMinutes = (lon - standardMeridian) * 4.0; // Mỗi độ kinh tuyến chênh lệch 4 phút
  let totalDeltaMinutes = longitudeCorrectionMinutes + eotMinutes;

  let totalMinutes = hour * 60 + minute + totalDeltaMinutes;
  let adjustedHour = Math.floor(totalMinutes / 60);
  let adjustedMinute = Math.round(totalMinutes % 60);
  if (adjustedMinute === 60) {
    adjustedMinute = 0;
    adjustedHour += 1;
  }
  let dayOffset = 0;
  if (adjustedHour >= 24) {
    adjustedHour -= 24;
    dayOffset = 1;
  } else if (adjustedHour < 0) {
    adjustedHour += 24;
    dayOffset = -1;
  }
  return {
    original: { hour, minute },
    adjusted: { hour: adjustedHour, minute: adjustedMinute, dayOffset },
    eotMinutes: Math.round(eotMinutes * 10) / 10,
    longitudeCorrectionMinutes: Math.round(longitudeCorrectionMinutes * 10) / 10,
    totalDeltaMinutes: Math.round(totalDeltaMinutes * 10) / 10
  };
}

/* ================== THUẬT TOÁN TỨ TRỤ CHUYÊN SÂU ================== */

function getDayCanChi(jdn) {
  let canIdx = Math.floor(jdn + 9) % 10;
  let chiIdx = Math.floor(jdn + 1) % 12;
  return {
    can: CAN[canIdx],
    chi: CHI[chiIdx],
    canIdx,
    chiIdx,
    name: `${CAN[canIdx]} ${CHI[chiIdx]}`
  };
}

function getTenGod(dayMasterCan, targetCan) {
  let master = NGU_HANH_CAN[dayMasterCan];
  let target = NGU_HANH_CAN[targetCan];
  let sinhRelation = {
    "Mộc": "Hỏa", "Hỏa": "Thổ", "Thổ": "Kim", "Kim": "Thủy", "Thủy": "Mộc"
  };
  let khacRelation = {
    "Mộc": "Thổ", "Thổ": "Thủy", "Thủy": "Hỏa", "Hỏa": "Kim", "Kim": "Mộc"
  };

  let samePolarity = (master.amDuong === target.amDuong);

  if (master.hanh === target.hanh) {
    return samePolarity ? "Tỷ Kiên" : "Kiếp Tài";
  } else if (sinhRelation[master.hanh] === target.hanh) {
    return samePolarity ? "Thực Thần" : "Thương Quan";
  } else if (khacRelation[master.hanh] === target.hanh) {
    return samePolarity ? "Thiên Tài" : "Chính Tài";
  } else if (khacRelation[target.hanh] === master.hanh) {
    return samePolarity ? "Thất Sát" : "Chính Quan";
  } else if (sinhRelation[target.hanh] === master.hanh) {
    return samePolarity ? "Kiêu Thần" : "Chính Ấn";
  }
  return "Không xác định";
}

/**
 * HÀM CHÍNH: TÍNH TOÁN BÁT TỰ TỨ TRỤ
 */
function calculateTuTru({
  year,
  month,
  day,
  hour,
  minute = 0,
  gender = "Nam",
  province = "Hanoi",
  useTrueSolarTime = false
}) {
  // 1. Tính toán Giờ Mặt Trời Thực (nếu yêu cầu)
  let timeCalc = calculateTrueSolarTime(year, month, day, hour, minute, province);
  let effectiveHour = useTrueSolarTime ? timeCalc.adjusted.hour : hour;
  let effectiveMinute = useTrueSolarTime ? timeCalc.adjusted.minute : minute;
  let birthJD = gregorianToJDN(year, month, day, effectiveHour, effectiveMinute, 0);

  // 2. Xác định thời khắc Lập Xuân của năm và năm trước/sau
  let lapXuanCurJD = findSolarTermJD(year, 315);
  let lapXuanNextJD = findSolarTermJD(year + 1, 315);
  let lapXuanPrevJD = findSolarTermJD(year - 1, 315);

  let nienYear = year;
  if (birthJD < lapXuanCurJD) {
    nienYear = year - 1;
  }

  // Niên Can Chi
  let nienCanIdx = (nienYear - 4) % 10;
  if (nienCanIdx < 0) nienCanIdx += 10;
  let nienChiIdx = (nienYear - 4) % 12;
  if (nienChiIdx < 0) nienChiIdx += 12;
  let truNam = {
    can: CAN[nienCanIdx],
    chi: CHI[nienChiIdx],
    name: `${CAN[nienCanIdx]} ${CHI[nienChiIdx]}`,
    naYin: NAYIN_TABLE[`${CAN[nienCanIdx]} ${CHI[nienChiIdx]}`]
  };

  // 3. Xác định 24 Tiết Khí bao quanh ngày sinh để định Nguyệt Lệnh
  // 12 Tiết khí chính để đổi tháng (bội số của 30 độ tính từ 315 độ)
  // [315(Dần), 345(Mão), 15(Thìn), 45(Tỵ), 75(Ngọ), 105(Mùi), 135(Thân), 165(Dậu), 195(Tuất), 225(Hợi), 255(Tý), 285(Sửu)]
  let monthSolarTerms = [
    { name: "Lập Xuân", deg: 315, chi: "Dần", chiIdx: 2, monthNumber: 1 },
    { name: "Kinh Trập", deg: 345, chi: "Mão", chiIdx: 3, monthNumber: 2 },
    { name: "Thanh Minh", deg: 15, chi: "Thìn", chiIdx: 4, monthNumber: 3 },
    { name: "Lập Hạ", deg: 45, chi: "Tỵ", chiIdx: 5, monthNumber: 4 },
    { name: "Mang Chủng", deg: 75, chi: "Ngọ", chiIdx: 6, monthNumber: 5 },
    { name: "Tiểu Thử", deg: 105, chi: "Mùi", chiIdx: 7, monthNumber: 6 },
    { name: "Lập Thu", deg: 135, chi: "Thân", chiIdx: 8, monthNumber: 7 },
    { name: "Bạch Lộ", deg: 165, chi: "Dậu", chiIdx: 9, monthNumber: 8 },
    { name: "Hàn Lộ", deg: 195, chi: "Tuất", chiIdx: 10, monthNumber: 9 },
    { name: "Lập Đông", deg: 225, chi: "Hợi", chiIdx: 11, monthNumber: 10 },
    { name: "Đại Tuyết", deg: 255, chi: "Tý", chiIdx: 0, monthNumber: 11 },
    { name: "Tiểu Hàn", deg: 285, chi: "Sửu", chiIdx: 1, monthNumber: 12 }
  ];

  // Tính JD của 12 Tiết khí trong chu kỳ năm
  let activeSolarTerm = null;
  let prevTermJD = null;
  let nextTermJD = null;
  let prevTermName = "";
  let nextTermName = "";

  // Tạo danh sách các tiết khí liên tục từ năm trước đến năm sau
  let allTerms = [];
  for (let y = year - 1; y <= year + 1; y++) {
    for (let t of monthSolarTerms) {
      let tJD = findSolarTermJD(y, t.deg);
      allTerms.push({
        ...t,
        year: y,
        jd: tJD,
        dateVN: jdToDate(tJD, 7)
      });
    }
  }
  allTerms.sort((a, b) => a.jd - b.jd);

  // Tìm tiết khí đang ngự trị tại thời điểm sinh
  for (let i = 0; i < allTerms.length - 1; i++) {
    if (birthJD >= allTerms[i].jd && birthJD < allTerms[i + 1].jd) {
      activeSolarTerm = allTerms[i];
      prevTermJD = allTerms[i].jd;
      prevTermName = allTerms[i].name;
      nextTermJD = allTerms[i + 1].jd;
      nextTermName = allTerms[i + 1].name;
      break;
    }
  }

  let nguyetChi = activeSolarTerm.chi;
  let nguyetChiIdx = activeSolarTerm.chiIdx;

  // Can Tháng theo Ngũ Hổ Độn
  // Giáp Kỷ -> Bính Dần (2), Ất Canh -> Mậu Dần (4), Bính Tân -> Canh Dần (6), Đinh Nhâm -> Nhâm Dần (8), Mậu Quý -> Giáp Dần (0)
  let startMonthCanIdx = ((nienCanIdx % 5) * 2 + 2) % 10;
  // Chi Dần là tháng số 0 trong Ngũ Hổ Độn
  let monthOffsetFromDan = (nguyetChiIdx - 2 + 12) % 12;
  let nguyetCanIdx = (startMonthCanIdx + monthOffsetFromDan) % 10;
  let truThang = {
    can: CAN[nguyetCanIdx],
    chi: nguyetChi,
    name: `${CAN[nguyetCanIdx]} ${nguyetChi}`,
    naYin: NAYIN_TABLE[`${CAN[nguyetCanIdx]} ${nguyetChi}`],
    tietKhiNhapMenh: prevTermName,
    tietKhiTiepTheo: nextTermName
  };

  // 4. Tính Can Chi Ngày (JDN) & Xử lý Dạ Tý vs Sớm Tý
  // Mốc nửa đêm 23:00 - 01:00
  let isDaTy = false;
  let isSomTy = false;
  let dayCalcJD = birthJD;

  if (effectiveHour >= 23) {
    // Dạ Tý: 23:00 - 24:00 -> Giữ nguyên ngày hôm nay!
    isDaTy = true;
  } else if (effectiveHour === 0) {
    // Sớm Tý: 00:00 - 01:00 -> Ngày mới
    isSomTy = true;
  }

  let baseDayInfo = getDayCanChi(Math.floor(dayCalcJD + 0.5));
  let nhatCan = baseDayInfo.can;
  let nhatChi = baseDayInfo.chi;
  let nhatCanIdx = baseDayInfo.canIdx;
  let nhatChiIdx = baseDayInfo.chiIdx;

  let truNgay = {
    can: nhatCan,
    chi: nhatChi,
    name: `${nhatCan} ${nhatChi}`,
    naYin: NAYIN_TABLE[`${nhatCan} ${nhatChi}`],
    isDaTy,
    isSomTy
  };

  // 5. Tính Can Chi Giờ (Ngũ Thử Độn)
  // Xác định Chi Giờ
  let hourChiIdx = Math.floor((effectiveHour + 1) / 2) % 12;
  let hourChi = CHI[hourChiIdx];

  // Can Giờ tính theo Can Ngày (nếu Dạ Tý thì vẫn theo Can Ngày hôm đó)
  // Giáp Kỷ khởi Giáp Tý (0), Ất Canh khởi Bính Tý (2), Bính Tân khởi Mậu Tý (4), Đinh Nhâm khởi Canh Tý (6), Mậu Quý khởi Nhâm Tý (8)
  let startHourCanIdx = ((nhatCanIdx % 5) * 2) % 10;
  let hourCanIdx = (startHourCanIdx + hourChiIdx) % 10;
  let truGio = {
    can: CAN[hourCanIdx],
    chi: hourChi,
    name: `${CAN[hourCanIdx]} ${hourChi}`,
    naYin: NAYIN_TABLE[`${CAN[hourCanIdx]} ${hourChi}`]
  };

  // 6. Điền Thập Thần và Tàng Can
  function enrichPillar(pillar, isMaster = false) {
    let tangCanList = TANG_CAN[pillar.chi].map(tc => ({
      ...tc,
      thapThan: getTenGod(nhatCan, tc.can)
    }));
    return {
      ...pillar,
      canHán: CAN_HAN[CAN.indexOf(pillar.can)],
      chiHán: CHI_HAN[CHI.indexOf(pillar.chi)],
      thapThanCan: isMaster ? "NHẬT CHỦ" : getTenGod(nhatCan, pillar.can),
      truongSinh: TRUONG_SINH_TABLE[nhatCan][pillar.chi],
      tangCan: tangCanList
    };
  }

  let fullTruNam = enrichPillar(truNam);
  let fullTruThang = enrichPillar(truThang);
  let fullTruNgay = enrichPillar(truNgay, true);
  let fullTruGio = enrichPillar(truGio);

  // 7. Tính Khởi Đại Vận (Thuận / Nghịch)
  // Dương Nam Âm Nữ tính Thuận (đến Tiết kế tiếp)
  // Âm Nam Dương Nữ tính Nghịch (lùi về Tiết trước đó)
  let isDuongCanYear = (nienCanIdx % 2 === 0);
  let isMale = (gender.toLowerCase() === "nam" || gender.toLowerCase() === "male");
  let isThuan = (isMale && isDuongCanYear) || (!isMale && !isDuongCanYear);

  let diffDays = isThuan ? (nextTermJD - birthJD) : (birthJD - prevTermJD);
  if (diffDays < 0) diffDays = 0;

  // 3 ngày = 1 năm, 1 ngày = 4 tháng, 1 giờ = 5 ngày
  let totalDaysInt = Math.floor(diffDays);
  let remainingHours = (diffDays - totalDaysInt) * 24.0;

  let startYears = Math.floor(totalDaysInt / 3);
  let remDays = totalDaysInt % 3;
  let startMonths = remDays * 4 + Math.floor(remainingHours / 6);
  if (startMonths >= 12) {
    startYears += Math.floor(startMonths / 12);
    startMonths = startMonths % 12;
  }
  let startDays = Math.round((remainingHours % 6) * 5);

  // Xếp 8 bước Đại Vận 10 năm
  let daiVanSteps = [];
  let curVanCanIdx = nguyetCanIdx;
  let curVanChiIdx = nguyetChiIdx;

  for (let step = 1; step <= 8; step++) {
    if (isThuan) {
      curVanCanIdx = (curVanCanIdx + 1) % 10;
      curVanChiIdx = (curVanChiIdx + 1) % 12;
    } else {
      curVanCanIdx = (curVanCanIdx - 1 + 10) % 10;
      curVanChiIdx = (curVanChiIdx - 1 + 12) % 12;
    }
    let vanCan = CAN[curVanCanIdx];
    let vanChi = CHI[curVanChiIdx];
    let startAge = startYears + (step - 1) * 10;
    let endAge = startAge + 9;
    let startGregYear = year + startAge;
    let endGregYear = startGregYear + 9;

    daiVanSteps.push({
      step,
      can: vanCan,
      chi: vanChi,
      name: `${vanCan} ${vanChi}`,
      naYin: NAYIN_TABLE[`${vanCan} ${vanChi}`],
      thapThanCan: getTenGod(nhatCan, vanCan),
      truongSinh: TRUONG_SINH_TABLE[nhatCan][vanChi],
      startAge,
      endAge,
      startGregYear,
      endGregYear
    });
  }

  // 8. Tổng Hợp Thần Sát Cốt Lõi
  function getThanSat(pillarChi, chiYear, chiDay) {
    let sats = [];
    // Thiên Ất Quý Nhân (Giáp Mậu Canh: Sửu Mùi; Ất Kỷ: Tý Thân; Bính Đinh: Hợi Dậu; Nhâm Quý: Tỵ Mão; Tân: Ngọ Dần)
    let thienAtMap = {
      "Giáp": ["Sửu", "Mùi"], "Mậu": ["Sửu", "Mùi"], "Canh": ["Sửu", "Mùi"],
      "Ất": ["Tý", "Thân"], "Kỷ": ["Tý", "Thân"],
      "Bính": ["Hợi", "Dậu"], "Đinh": ["Hợi", "Dậu"],
      "Nhâm": ["Tỵ", "Mão"], "Quý": ["Tỵ", "Mão"],
      "Tân": ["Ngọ", "Dần"]
    };
    if (thienAtMap[nhatCan]?.includes(pillarChi)) sats.push("Thiên Ất Quý Nhân");

    // Văn Xương Quý Nhân (Giáp Tỵ, Ất Ngọ, Bính Thân, Đinh Dậu, Mậu Thân, Kỷ Dậu, Canh Hợi, Tân Tý, Nhâm Dần, Quý Mão)
    let vanXuongMap = {
      "Giáp": "Tỵ", "Ất": "Ngọ", "Bính": "Thân", "Đinh": "Dậu", "Mậu": "Thân",
      "Kỷ": "Dậu", "Canh": "Hợi", "Tân": "Tý", "Nhâm": "Dần", "Quý": "Mão"
    };
    if (vanXuongMap[nhatCan] === pillarChi) sats.push("Văn Xương Quý Nhân");

    // Lộc Thần (Giáp Dần, Ất Mão, Bính Tỵ, Đinh Ngọ, Mậu Tỵ, Kỷ Ngọ, Canh Thân, Tân Dậu, Nhâm Hợi, Quý Tý)
    let locMap = {
      "Giáp": "Dần", "Ất": "Mão", "Bính": "Tỵ", "Đinh": "Ngọ", "Mậu": "Tỵ",
      "Kỷ": "Ngọ", "Canh": "Thân", "Tân": "Dậu", "Nhâm": "Hợi", "Quý": "Tý"
    };
    if (locMap[nhatCan] === pillarChi) sats.push("Lộc Thần (Kiến Lộc)");

    // Kình Dương (Dương Nhận: Giáp Mão, Ất Thìn, Bính Ngọ, Đinh Mùi, Mậu Ngọ, Kỷ Mùi, Canh Dậu, Tân Tuất, Nhâm Tý, Quý Sửu)
    let kinhDuongMap = {
      "Giáp": "Mão", "Ất": "Thìn", "Bính": "Ngọ", "Đinh": "Mùi", "Mậu": "Ngọ",
      "Kỷ": "Mùi", "Canh": "Dậu", "Tân": "Tuất", "Nhâm": "Tý", "Quý": "Sửu"
    };
    if (kinhDuongMap[nhatCan] === pillarChi) sats.push("Kình Dương (Dương Nhận)");

    // Đào Hoa (Hàm Trì: Thân Tý Thìn tại Dậu, Dần Ngọ Tuất tại Mão, Tỵ Dậu Sửu tại Ngọ, Hợi Mão Mùi tại Tý)
    let daoHoaLookup = {
      "Thân": "Dậu", "Tý": "Dậu", "Thìn": "Dậu",
      "Dần": "Mão", "Ngọ": "Mão", "Tuất": "Mão",
      "Tỵ": "Ngọ", "Dậu": "Ngọ", "Sửu": "Ngọ",
      "Hợi": "Tý", "Mão": "Tý", "Mùi": "Tý"
    };
    if (daoHoaLookup[chiDay] === pillarChi || daoHoaLookup[chiYear] === pillarChi) sats.push("Đào Hoa (Hàm Trì)");

    // Dịch Mã (Thân Tý Thìn tại Dần, Dần Ngọ Tuất tại Thân, Tỵ Dậu Sửu tại Hợi, Hợi Mão Mùi tại Tỵ)
    let dichMaLookup = {
      "Thân": "Dần", "Tý": "Dần", "Thìn": "Dần",
      "Dần": "Thân", "Ngọ": "Thân", "Tuất": "Thân",
      "Tỵ": "Hợi", "Dậu": "Hợi", "Sửu": "Hợi",
      "Hợi": "Tỵ", "Mão": "Tỵ", "Mùi": "Tỵ"
    };
    if (dichMaLookup[chiDay] === pillarChi || dichMaLookup[chiYear] === pillarChi) sats.push("Dịch Mã");

    // Hoa Cái (Thân Tý Thìn tại Thìn, Dần Ngọ Tuất tại Tuất, Tỵ Dậu Sửu tại Sửu, Hợi Mão Mùi tại Mùi)
    let hoaCaiLookup = {
      "Thân": "Thìn", "Tý": "Thìn", "Thìn": "Thìn",
      "Dần": "Tuất", "Ngọ": "Tuất", "Tuất": "Tuất",
      "Tỵ": "Sửu", "Dậu": "Sửu", "Sửu": "Sửu",
      "Hợi": "Mùi", "Mão": "Mùi", "Mùi": "Mùi"
    };
    if (hoaCaiLookup[chiDay] === pillarChi || hoaCaiLookup[chiYear] === pillarChi) sats.push("Hoa Cái");

    return sats;
  }

  fullTruNam.thanSat = getThanSat(fullTruNam.chi, fullTruNam.chi, fullTruNgay.chi);
  fullTruThang.thanSat = getThanSat(fullTruThang.chi, fullTruNam.chi, fullTruNgay.chi);
  fullTruNgay.thanSat = getThanSat(fullTruNgay.chi, fullTruNam.chi, fullTruNgay.chi);
  fullTruGio.thanSat = getThanSat(fullTruGio.chi, fullTruNam.chi, fullTruNgay.chi);

  return {
    input: { year, month, day, hour, minute, gender, province, useTrueSolarTime },
    timeCalc,
    solarTerms: {
      active: activeSolarTerm.name,
      prev: { name: prevTermName, date: jdToDate(prevTermJD, 7) },
      next: { name: nextTermName, date: jdToDate(nextTermJD, 7) },
      diffDaysToNext: Math.round(diffDays * 100) / 100
    },
    batTu: {
      truNam: fullTruNam,
      truThang: fullTruThang,
      truNgay: fullTruNgay,
      truGio: fullTruGio
    },
    khoiDaiVan: {
      chieuVan: isThuan ? "Thuận hành" : "Nghịch hành",
      tuoiKhoiVan: `${startYears} tuổi ${startMonths} tháng ${startDays} ngày`,
      namBatDau: year + startYears,
      steps: daiVanSteps
    }
  };
}

// XUẤT ĐỊNH DẠNG VĂN BẢN TRANG TRỌNG CHO BÁO CÁO
function formatTuTruReport(result) {
  let { batTu, khoiDaiVan, solarTerms, input, timeCalc } = result;
  let out = [];

  out.push("================================================================================");
  out.push("             KẾT QUẢ TÍNH TOÁN BÁT TỰ TỨ TRỤ CHUYÊN SÂU (ENGINE THIÊN VĂN)       ");
  out.push("================================================================================");
  out.push(`Đương số: ${input.gender} | Sinh ngày: ${input.day}/${input.month}/${input.year} lúc ${String(input.hour).padStart(2,'0')}:${String(input.minute).padStart(2,'0')}`);
  out.push(`Địa phương: ${input.province} | Hiệu chỉnh Giờ Mặt Trời Thực: ${input.useTrueSolarTime ? `${timeCalc.adjusted.hour}:${timeCalc.adjusted.minute} (Độ lệch: ${timeCalc.totalDeltaMinutes} phút)` : "Không áp dụng"}`);
  out.push(`Tiết Khí ngự trị: ${solarTerms.active} (Sau ${solarTerms.prev.name} lúc ${solarTerms.prev.date.day}/${solarTerms.prev.date.month} ${solarTerms.prev.date.hours}:${solarTerms.prev.date.minutes})`);
  out.push(`Khởi Đại Vận: ${khoiDaiVan.tuoiKhoiVan} (${khoiDaiVan.chieuVan}) — Bắt đầu từ năm ${khoiDaiVan.namBatDau}`);
  out.push("--------------------------------------------------------------------------------");
  out.push("BẢNG TỨ TRỤ NGUYÊN CỤC:");
  out.push("Trụ           | Trụ Năm           | Trụ Tháng         | Trụ Ngày          | Trụ Giờ");
  out.push("--------------+-------------------+-------------------+-------------------+-------------------");
  out.push(`Thiên Can     | ${batTu.truNam.can.padEnd(8)} (${batTu.truNam.canHán}) | ${batTu.truThang.can.padEnd(8)} (${batTu.truThang.canHán}) | ${batTu.truNgay.can.padEnd(8)} (${batTu.truNgay.canHán}) | ${batTu.truGio.can.padEnd(8)} (${batTu.truGio.canHán})`);
  out.push(`Thập Thần Can | ${batTu.truNam.thapThanCan.padEnd(17)} | ${batTu.truThang.thapThanCan.padEnd(17)} | NHẬT CHỦ          | ${batTu.truGio.thapThanCan.padEnd(17)}`);
  out.push(`Địa Chi       | ${batTu.truNam.chi.padEnd(8)} (${batTu.truNam.chiHán}) | ${batTu.truThang.chi.padEnd(8)} (${batTu.truThang.chiHán}) | ${batTu.truNgay.chi.padEnd(8)} (${batTu.truNgay.chiHán}) | ${batTu.truGio.chi.padEnd(8)} (${batTu.truGio.chiHán})`);
  out.push(`Nạp Âm        | ${batTu.truNam.naYin.padEnd(17)} | ${batTu.truThang.naYin.padEnd(17)} | ${batTu.truNgay.naYin.padEnd(17)} | ${batTu.truGio.naYin.padEnd(17)}`);
  out.push(`Trường Sinh   | ${batTu.truNam.truongSinh.padEnd(17)} | ${batTu.truThang.truongSinh.padEnd(17)} | ${batTu.truNgay.truongSinh.padEnd(17)} | ${batTu.truGio.truongSinh.padEnd(17)}`);
  
  function formatTangCan(tcList) {
    return tcList.map(t => `${t.can}(${t.thapThan.slice(0,2)} ${t.phanTram}%)`).join(", ");
  }
  out.push(`Tàng Can      | ${formatTangCan(batTu.truNam.tangCan).padEnd(17)} | ${formatTangCan(batTu.truThang.tangCan).padEnd(17)} | ${formatTangCan(batTu.truNgay.tangCan).padEnd(17)} | ${formatTangCan(batTu.truGio.tangCan).padEnd(17)}`);
  out.push(`Thần Sát      | ${batTu.truNam.thanSat.join(', ') || '—'}`);
  out.push(`              | ${batTu.truThang.thanSat.join(', ') || '—'}`);
  out.push(`              | ${batTu.truNgay.thanSat.join(', ') || '—'}`);
  out.push(`              | ${batTu.truGio.thanSat.join(', ') || '—'}`);
  out.push("--------------------------------------------------------------------------------");
  out.push("BẢN ĐỒ 8 BƯỚC ĐẠI VẬN 10 NĂM:");
  for (let s of khoiDaiVan.steps) {
    out.push(`  Vận ${s.step}: [${s.startAge}-${s.endAge} tuổi / ${s.startGregYear}-${s.endGregYear}] -> ${s.name} (${s.thapThanCan}) | Nạp âm: ${s.naYin} | Vòng TS: ${s.truongSinh}`);
  }
  out.push("================================================================================");
  return out.join("\n");
}

// Hỗ trợ thực thi trực tiếp từ CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  let params = {
    year: 1988, month: 5, day: 16, hour: 9, minute: 30,
    gender: "Nam", province: "Hanoi", useTrueSolarTime: false, json: false
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--date" && args[i+1]) {
      let parts = args[i+1].split("-").map(Number);
      params.year = parts[0]; params.month = parts[1]; params.day = parts[2];
      i++;
    } else if (args[i] === "--time" && args[i+1]) {
      let parts = args[i+1].split(":").map(Number);
      params.hour = parts[0]; params.minute = parts[1] || 0;
      i++;
    } else if (args[i] === "--gender" && args[i+1]) {
      params.gender = args[i+1];
      i++;
    } else if (args[i] === "--province" && args[i+1]) {
      params.province = args[i+1];
      i++;
    } else if (args[i] === "--true-solar") {
      params.useTrueSolarTime = true;
    } else if (args[i] === "--json") {
      params.json = true;
    }
  }

  let result = calculateTuTru(params);
  if (params.json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(formatTuTruReport(result));
  }
}

module.exports = {
  calculateTuTru,
  formatTuTruReport,
  calculateTrueSolarTime,
  gregorianToJDN,
  sunApparentLongitude,
  findSolarTermJD
};
