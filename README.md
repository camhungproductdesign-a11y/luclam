# Cẩm Nang Bỏ Túi Sài Gòn — gift.luclam.vn

Hướng dẫn du lịch Sài Gòn của Lục Lam: 60 trang tĩnh trên 10 chủ đề × 6 ngôn ngữ,
prerender sẵn cho crawler, cộng một blog proxy từ AEO tại `/blog`.

## Chạy local

Cần Node.js 22.

```bash
npm install
cp .env.example .env      # rồi sinh ADMIN_TOKEN, xem hướng dẫn trong file
npm run dev               # http://localhost:3000
```

`ADMIN_TOKEN` phải dài ít nhất 32 ký tự, không thì server từ chối khởi động:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Kiểm tra

```bash
npm run lint      # tsc --noEmit
npm run build     # vite build + prerender 60 trang + bundle server
npm run verify    # đọc dist/ trên đĩa: canonical, hreflang, h1, sitemap
npm run smoke -- https://gift.luclam.vn   # cần một deployment đang chạy
```

`verify` đọc file trên đĩa; `smoke` đọc qua HTTP nên thấy được những thứ `verify`
không thấy: status code, nén, 404 thật hay soft-404, và blog có tới nơi không.
CI chạy ba lệnh đầu trên mỗi push và mỗi pull request.

## Deploy

Không có deploy tự động. Push lên `main` chỉ chạy CI, không đụng gì tới server.

`gift.luclam.vn` chạy từ container trên VM, sau nginx (VM) và HAProxy (con NAT,
nơi kết thúc TLS). Ra bản mới:

```bash
ssh <vm>
cd /path/to/luclam
git pull
docker compose up -d --build

# Bake lại 60 trang tĩnh với public/config.json thật. File đó được bind-mount và
# Creator Studio ghi vào lúc chạy, trong khi image build dùng bản trong git —
# nên thiếu bước này thì nội dung biên tập không tới được trang crawler đọc.
docker compose exec app npm run build

npm run smoke -- https://gift.luclam.vn
```

Ba điều dễ quên:

- **nginx trên VM không được đặt luật nào theo `$scheme`.** HAProxy bóc TLS
  trước, nên nginx luôn thấy HTTP; redirect theo `$scheme` ở đó tạo vòng lặp vô
  hạn. Căn cứ đúng là header `X-Forwarded-Proto`.
- **`client_max_body_size` phải ≥ 25m**, không thì ảnh Creator Studio tải lên
  trả 413, và lỗi hiện ở nginx chứ không phải ở app nên rất khó lần.
- **Blog canonical do AEO sinh từ DB**, không phải từ Host header. Chưa khai
  custom domain trong Settings → Connections → Blog Domain thì mọi bài viết trỏ
  canonical về `app.aeo.how` và nhường toàn bộ giá trị SEO cho bên đó. `smoke`
  bắt được trường hợp này.
