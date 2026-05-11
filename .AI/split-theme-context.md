# Context: Chia Website Thành 2 Chủ Đề

## Ngày: 2026-05-06
## Mục tiêu
Chia website Marshell thành 2 phần riêng biệt:
1. **Dầu máy CNC** — theme mới (xanh dương/đen), cùng cấu trúc, nội dung CNC
2. **Dầu cơ khí** — giữ nguyên website hiện tại (vàng/đen)

## Kiến trúc
- `/` → Landing Page chọn chủ đề (2 panel, fullscreen)
- `/dau-co-khi/*` → Nội dung dầu cơ khí hiện tại
- `/dau-cnc/*` → Nội dung dầu CNC mới

## Trạng thái hiện tại
- Đã có `lib/cnc.ts` và `lib/dau-may.ts` (fetch API)
- Chưa có data CNC trong `db.json`
- Cần thêm: theme system, route groups, landing page, ThemeProvider

## Quyết định cần user review
- Lưu lựa chọn chủ đề (cookie/localStorage)?
- Bảng màu CNC: xanh dương/đen?
- Header/Footer chung hay riêng?
- Redirect 301 cho routes cũ?


## Quyết định cần user review
- Có lựa chọn đi vào, header có nút bấm chọn chủ đề 
- Bảng màu CNC: xanh dương/đen
- Header/Footer nội dung gióng nhưng cần thay đổi màu?
- Redirect 301 cho routes cũ?

