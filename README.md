# Bài thực hành: Form đăng ký thành viên

Project Next.js triển khai form đăng ký thành viên theo yêu cầu:

- Dùng `react-hook-form` với `register` để input hoạt động theo hướng uncontrolled.
- Dùng Zod để validate email, mật khẩu và xác nhận mật khẩu.
- Hiển thị lỗi realtime bằng `mode: "onChange"`.
- Validate lại ở server bằng `schema.safeParse()` trong Next.js Server Action.
- Server Action trả về object kết quả `{ success, message, ... }`, không dùng API Route.

## Chạy project

```bash
npm install
npm run dev
```

Mở `http://localhost:3000`.

Email `demo@example.com` và `admin@example.com` được giả lập là đã tồn tại để kiểm tra lỗi server.
