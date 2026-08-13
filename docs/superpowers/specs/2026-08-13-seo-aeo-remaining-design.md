# Thiết kế: Xử lý tồn đọng SEO / AEO — gift.luclam.vn

**Ngày:** 2026-08-13
**Nhánh:** `fix/seo-aeo-remaining`
**Base:** `04d1136`
**Nguồn yêu cầu:** Bản đánh giá SEO/AEO 05/08/2026 (17 mục) + rà soát đối chiếu mã nguồn 13/08/2026

---

## 1. Bối cảnh

Trang là SPA React dựng bằng Vite, deploy tĩnh lên GitHub Pages qua
`.github/workflows/deploy-pages.yml`. Nội dung là cẩm nang du lịch Sài Gòn 10 chủ đề,
biên soạn ở 6 ngôn ngữ, cộng phần giới thiệu sản phẩm trà.

Rà soát ngày 13/08 xác nhận: 6/17 mục đã đóng hẳn, 6 mục còn dư ở mức thấp,
5 mục còn nguyên. Số đo trên bản build hiện tại:

| Chỉ số | Giá trị |
|---|---|
| Bundle chính | 541.49 KB (gzip 184.63 KB) |
| Chunk CreatorStudio (lazy) | 204.82 KB |
| HTML máy chủ trả về | 7.97 KB, 79 từ nội dung, chỉ tiếng Việt |
| Nội dung 6 ngôn ngữ | 277 KB trong `src/translations.ts`, không có mặt trong HTML |
| Thư mục ảnh | 7.1 MB, 0 file WebP/AVIF |
| Build | exit 0, 14.25s |

## 2. Mục tiêu

Đóng 10 trong 11 mục còn tồn đọng. Mục #7 nằm ngoài vì chờ số điện thoại chính thức từ Lục Lam.

Thành công đo bằng:

- HTML máy chủ trả về chứa nội dung thật cho cả 6 ngôn ngữ, không cần chạy JavaScript
- Mỗi chủ đề × mỗi ngôn ngữ có một URL riêng, truy cập trực tiếp được
- Ảnh LCP dưới 200 KB
- Hai endpoint ghi dữ liệu yêu cầu xác thực
- `npm run lint` và `npm run build` vẫn exit 0

## 3. Quyết định đã chốt

Bốn câu hỏi đã hỏi và được trả lời ngày 13/08:

| Câu hỏi | Trả lời | Hệ quả |
|---|---|---|
| Hướng SSG | **A** — sinh HTML từ `translations.ts` | Không đụng `App.tsx` để lấy HTML ra |
| `server.ts` chạy ở đâu | **Có, trên VPS riêng** | Thêm xác thực, không xoá endpoint |
| Sở hữu `cdn.hstatic.net` | **Có, store của Lục Lam** | Giữ nguyên 30 URL đó |
| Số điện thoại chính thức | **Chưa có** | #7 để treo, ghi lại là việc còn nợ |

## 4. Kiến trúc

### 4.1 Cấu trúc URL

`cover` là trang chủ. Chín chủ đề còn lại thành trang riêng. Tổng 60 URL.

Slug tiếng Việt ở gốc; slug ASCII tiếng Anh cho năm ngôn ngữ còn lại — slug chữ
Nhật/Hàn/Trung trong URL bị mã hoá percent-encoding, gây rối khi chia sẻ và không
mang lại lợi ích SEO tương xứng.

| Chủ đề | URL tiếng Việt | URL các ngôn ngữ khác |
|---|---|---|
| cover | `/` | `/en/`, `/ja/`, `/ko/`, `/zh/`, `/zht/` |
| welcome | `/gioi-thieu/` | `/en/welcome/` |
| atmosphere | `/khu-vuc/` | `/en/atmosphere/` |
| transport | `/di-chuyen/` | `/en/transport/` |
| stay | `/luu-tru/` | `/en/stay/` |
| food | `/am-thuc/` | `/en/food/` |
| culture | `/van-hoa/` | `/en/culture/` |
| shopping | `/mua-sam/` | `/en/shopping/` |
| luclam | `/luc-lam/` | `/en/luclam/` |
| info | `/thong-tin-huu-ich/` | `/en/info/` |

Mỗi URL là một thư mục chứa `index.html` — GitHub Pages phục vụ được trực tiếp,
không cần cấu hình rewrite.

`/` giữ nguyên là canonical tiếng Việt như hiện tại, nên URL đang được index không đổi.

### 4.2 Bộ sinh trang tĩnh

Thêm `scripts/prerender.ts`, chạy sau `vite build` trong npm script `build`.

Luồng:

1. Import `translations` và `defaultMedia` từ `src/`
2. Đọc `dist/index.html` do Vite sinh ra, lấy đường dẫn asset đã hash
3. Với mỗi cặp (ngôn ngữ, chủ đề): dựng HTML từ dữ liệu, ghi ra `dist/<path>/index.html`
4. Sinh `dist/sitemap.xml` với đủ 60 URL kèm hreflang
5. Sinh `dist/404.html` trỏ về trang chủ

Bộ sinh chạy bằng `tsx` (đã có trong devDependencies), import trực tiếp file `.ts` —
không cần bước biên dịch riêng.

### 4.3 Cấu trúc mỗi trang tĩnh

```html
<body>
  <div id="root"></div>
  <div id="static-content"> … nội dung thật … </div>
  <script type="module" src="/assets/index-<hash>.js"></script>
</body>
```

**Không hydrate đè.** SPA render vào `#root`; khi mount xong nó gỡ `#static-content`.
Lý do: HTML tĩnh sinh từ dữ liệu, còn React sinh từ component — markup hai bên khác nhau,
`hydrateRoot` sẽ báo mismatch và vứt bỏ toàn bộ HTML tĩnh.

Đánh đổi được chấp nhận: nội dung tồn tại hai bản markup. Cả hai cùng đọc từ
`translations.ts` nên không lệch về chữ nghĩa. Bot đọc bản tĩnh, người dùng thấy bản React.

Rủi ro cần canh: `#static-content` phải bị gỡ *sau* khi React mount, nếu không sẽ có
khoảnh khắc hiện hai lần nội dung. Xử lý bằng `useEffect` trong `App` chạy một lần lúc mount.

### 4.4 Điều hướng trong SPA

- `getInitialLanguage` mở rộng: đọc ngôn ngữ + chủ đề từ `location.pathname` trước, rồi
  mới tới `?lang=`, `localStorage`, ngôn ngữ trình duyệt
- `navigateToPage` đổi từ chỉ `setCurrentPage` sang kèm `history.pushState` với URL của chủ đề
- Thêm listener `popstate` để nút back/forward hoạt động
- `handleLangChange` đổi từ `replaceState` sang `pushState` với URL của ngôn ngữ mới,
  giữ nguyên chủ đề đang xem

Bảng ánh xạ slug ↔ chủ đề đặt ở `src/routes.ts`, dùng chung cho cả SPA và bộ sinh tĩnh —
một nguồn sự thật duy nhất, tránh lệch giữa hai bên.

### 4.5 Thẻ meta và structured data

Mỗi trang tĩnh tự khai:

- `<html lang>` đúng ngôn ngữ của trang
- `<title>` và `<meta name="description">` riêng theo chủ đề và ngôn ngữ
- `<link rel="canonical">` trỏ chính nó
- 7 thẻ `hreflang` (6 ngôn ngữ + `x-default`)
- `og:*` và `twitter:*` theo chủ đề
- JSON-LD: `LocalBusiness` (chỉ trang chủ), `BreadcrumbList` (trang chủ đề),
  `FAQPage` (trang `info` và trang chủ)

`BreadcrumbList` giờ mới có nghĩa vì đã tồn tại phân cấp thật: Trang chủ → Chủ đề.

`FAQPage` mở rộng từ 3 lên khoảng 20–30 câu, sinh tự động từ `translations[lang].info.categories[].items[]`
(mỗi mục có sẵn cặp `label` / `detail` đúng dạng hỏi–đáp) cộng vài câu soạn tay về giờ mở cửa,
địa chỉ, sản phẩm. Lưu ý cho phần trình bày với khách: Google đã tắt FAQ rich results cho site
thường từ 08/2023, nên đây là giá trị thuần AEO, không kỳ vọng hiển thị ở trang kết quả tìm kiếm.

### 4.6 Ảnh

- Thêm `sharp` vào devDependencies
- `scripts/optimize-images.ts` xuất mỗi ảnh nguồn ra AVIF + WebP ở 3 bề rộng (640, 1280, 1920)
- Ảnh JPEG gốc được nén lại tại chỗ (giữ nguyên tên file) và đóng vai trò fallback trong
  thuộc tính `src`; AVIF/WebP đưa vào `<source>` của `<picture>`
- Xoá `public/uploads/test_0.jpg`, `test_1.jpg`, `test_2.jpg`, `test_3.jpg`
- Mục tiêu: `cover_benthanh.jpg` (ảnh LCP) xuống dưới 200 KB ở bản AVIF
- Script chạy thủ công (`npm run images`), kết quả commit vào repo — không chạy trong CI
  để build không phụ thuộc `sharp` trên runner

### 4.7 Xác thực cho server.ts

`server.ts` chạy trên VPS thật, nên hai endpoint cần khoá chứ không xoá.

- Đọc `ADMIN_TOKEN` từ biến môi trường
- Middleware kiểm tra header `Authorization: Bearer <token>` cho `POST /api/upload` và `POST /api/config`
- So sánh bằng `crypto.timingSafeEqual` để không rò rỉ qua thời gian phản hồi
- Thiếu hoặc sai token trả 401
- Nếu `ADMIN_TOKEN` không được đặt, server từ chối khởi động thay vì chạy ở trạng thái mở
- Thêm `ADMIN_TOKEN=` vào `.env.example`

### 4.8 Ảnh hotlink

Giữ nguyên 30 URL `cdn.hstatic.net` (hạ tầng nhà, đã xác nhận).

Kéo về `public/uploads/external/`:

- 45 ảnh Unsplash trong `src/` — 35 ở `defaultMedia.ts`, 10 ở `translations.ts`
- 18 ảnh Wikimedia trong `public/config.json`

Mỗi ảnh kèm một bản ghi trong `public/uploads/external/CREDITS.json`: URL gốc, tác giả,
giấy phép. Ảnh Wikimedia hiển thị credit ngay trên giao diện — nghĩa vụ ghi nguồn của
CC BY-SA đi theo tấm ảnh chứ không theo nơi host, nên tự host mà thiếu credit thì vi phạm vẫn nguyên.

8 video Mixkit **giữ hotlink**: file video rất nặng, không đóng góp gì cho SEO, kéo về sẽ
phình repo lên hàng trăm MB.

### 4.9 Dọn nhóm C

| Mục | Việc |
|---|---|
| #1 | Thêm cờ chặn lặp cho `onError` ở `CreatorStudio.tsx:786-789`, dùng lại `useFallbackImage` |
| #10 | `getInitialLanguage` rơi về `'vi'` thay vì `'en'`, khớp với `lang` của khung tĩnh |
| #12 | Thêm `width`/`height`/`loading`/`decoding` cho `PlaceDetailModal.tsx:250` và 3 ảnh trong `CreatorStudio.tsx` |
| #14 | `App.tsx:475` đổi từ `<h1>` sang `<div>`, giữ nguyên class |
| Rác | Gỡ `@google/genai`; xoá `bun.lock`; xoá `find_renders.py`, `inspect_ja_sections.py` |

Về #14, cần nói rõ khi báo cáo lại với khách: HTML5 cho phép nhiều `h1` và Google đã xác nhận
đây không phải yếu tố xếp hạng. Sửa vì cấu trúc gọn, không phải vì SEO.

## 5. Thứ tự thực hiện

| PR | Nội dung | Mục |
|---|---|---|
| 1 | Xác thực server + dọn dẹp | server.ts, #1, #10, #12, #14, rác repo |
| 2 | Tối ưu ảnh | #6 |
| 3 | Sinh trang tĩnh + định tuyến | #2, #3, #5, #8 |
| 4 | Kéo ảnh hotlink về | #11 |

PR1 và PR2 độc lập hoàn toàn với PR3, làm trước để có kết quả đo được sớm.
PR4 để cuối vì nặng về thao tác tải file, không có rủi ro kỹ thuật.

## 6. Kiểm thử

Repo hiện chưa có test runner. Không dựng hạ tầng test mới trong đợt này — thay vào đó
mỗi PR có tiêu chí kiểm chứng chạy được bằng lệnh:

| PR | Kiểm chứng |
|---|---|
| 1 | `curl -X POST` không token → 401; có token đúng → 200. `npm run lint` exit 0 |
| 2 | `du -sh public/uploads` giảm; ảnh LCP < 200 KB; đếm file AVIF/WebP > 0 |
| 3 | Đếm số file `dist/**/index.html` = 60; đếm từ trong `dist/en/food/index.html` > 300; mỗi trang có đúng 7 thẻ hreflang và 1 canonical trỏ chính nó |
| 4 | `grep -rc "images.unsplash.com" src/` = 0 và `grep -c "upload.wikimedia.org" public/config.json` = 0; `CREDITS.json` có đủ 63 bản ghi |

Sau mỗi PR: `npm run lint` và `npm run build` phải exit 0.

## 7. Ngoài phạm vi đợt này

- **#7 số điện thoại** — chờ Lục Lam cung cấp số chính thức. Trường `telephone` để trống,
  không điền giá trị phỏng đoán.
- **Scope Google Drive** (`src/firebaseAuth.ts:23-25`) — xin cả `drive.readonly`, `drive.file`
  và `drive` toàn quyền. Cần Lục Lam xác nhận tính năng nào thực sự cần scope rộng trước khi thu hẹp;
  thu hẹp mù có thể làm hỏng chức năng đang dùng.
- **Tách nhỏ `App.tsx`** — file 135 KB vẫn nguyên. Hướng A cố tình không đụng tới để giữ rủi ro thấp.
  Đây là món nợ kỹ thuật nên xử lý ở một đợt riêng.
