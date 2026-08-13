# Remaining SEO/AEO Work — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Đóng 10 trong 11 mục SEO/AEO còn tồn đọng của gift.luclam.vn — sinh 60 trang HTML tĩnh cho 6 ngôn ngữ, tối ưu ảnh, khoá hai endpoint ghi dữ liệu, và kéo ảnh hotlink về hạ tầng nhà.

**Architecture:** Một script Node chạy sau `vite build` đọc `src/translations.ts` và xuất ra `dist/<lang>/<topic>/index.html` với nội dung thật. SPA không hydrate đè lên HTML tĩnh — nó render vào `#root` rồi gỡ khối `#static-content` đi. Bảng ánh xạ slug ↔ chủ đề nằm ở `src/routes.ts`, dùng chung cho cả SPA và bộ sinh để hai bên không lệch nhau.

**Tech Stack:** React 19, Vite 6, TypeScript 5.8, Express 4, tsx (chạy script `.ts` trực tiếp), sharp (tối ưu ảnh, devDependency mới)

**Spec:** [docs/superpowers/specs/2026-08-13-seo-aeo-remaining-design.md](../specs/2026-08-13-seo-aeo-remaining-design.md)

## Global Constraints

- Nhánh làm việc: `fix/seo-aeo-remaining`. Không commit thẳng vào `main`.
- Sau **mỗi** task: `npm run lint` và `npm run build` phải exit 0.
- Repo **không có test runner** và spec đã chốt là không dựng mới trong đợt này. Mỗi task kiểm chứng bằng lệnh chạy được, không phải bằng unit test framework.
- Domain chính thức: `https://gift.luclam.vn`. Mọi URL tuyệt đối dùng domain này.
- Sáu ngôn ngữ, đúng thứ tự này ở mọi nơi: `vi`, `en`, `ja`, `ko`, `zh`, `zht`.
- Ánh xạ `lang` → thuộc tính HTML `lang`: `vi→vi`, `en→en`, `ja→ja`, `ko→ko`, `zh→zh-CN`, `zht→zh-TW`.
- Mười chủ đề, đúng thứ tự trong `pagesList` tại `src/App.tsx:175`: `cover`, `welcome`, `atmosphere`, `transport`, `stay`, `food`, `culture`, `shopping`, `luclam`, `info`.
- **Không** điền giá trị phỏng đoán vào trường `telephone` của JSON-LD. Mục #7 để trống, chờ Lục Lam.
- Giữ nguyên 30 URL `cdn.hstatic.net` — đã xác nhận là hạ tầng của Lục Lam.
- Giữ nguyên 8 URL video `assets.mixkit.co` — hotlink có chủ đích, file quá nặng để kéo về.

---

# Phase 1 — Bảo mật và dọn dẹp

Bốn task đầu độc lập hoàn toàn với phần SSG. Ship được ngay.

---

### Task 1: Xác thực cho hai endpoint ghi dữ liệu

`POST /api/upload` và `POST /api/config` hiện cho phép bất kỳ ai ghi đè nội dung trang và tải file lên máy chủ. Server này **có chạy trên VPS thật**, nên đây là lỗ hổng đang mở.

**Files:**
- Modify: `server.ts:1-11` (thêm import và đọc token), `server.ts:40` (`POST /api/upload`), `server.ts:67` (`POST /api/config`)
- Modify: `.env.example`

**Interfaces:**
- Consumes: không có
- Produces: middleware `requireAdmin(req, res, next)` — dùng lại nếu sau này thêm endpoint ghi khác

- [ ] **Step 1: Thêm import `crypto` và đọc token lúc khởi động**

Sửa phần đầu `server.ts`, ngay sau các import hiện có:

```ts
import express from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { createServer as createViteServer } from "vite";

const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

if (!ADMIN_TOKEN) {
  console.error(
    "ADMIN_TOKEN chưa được đặt. Server từ chối khởi động để không chạy ở trạng thái mở.\n" +
    "Đặt biến môi trường ADMIN_TOKEN rồi chạy lại."
  );
  process.exit(1);
}
```

Đây là lựa chọn cứng rắn có chủ đích: thà server không lên còn hơn lên mà không có khoá.

- [ ] **Step 2: Viết middleware `requireAdmin`**

Thêm vào trong `startServer()`, ngay sau dòng `app.use(express.json(...))`:

```ts
function requireAdmin(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const header = req.get("authorization") ?? "";
  const prefix = "Bearer ";

  if (!header.startsWith(prefix)) {
    return res.status(401).json({ error: "Thiếu token xác thực" });
  }

  const supplied = Buffer.from(header.slice(prefix.length));
  const expected = Buffer.from(ADMIN_TOKEN as string);

  // So sánh độ dài trước, vì timingSafeEqual ném lỗi khi hai buffer khác độ dài.
  // Rò rỉ độ dài token là chấp nhận được; rò rỉ nội dung thì không.
  if (
    supplied.length !== expected.length ||
    !crypto.timingSafeEqual(supplied, expected)
  ) {
    return res.status(401).json({ error: "Token không hợp lệ" });
  }

  next();
}
```

- [ ] **Step 3: Gắn middleware vào hai endpoint ghi**

Đổi hai dòng khai báo route. `GET /api/config` và `GET /api/health` **giữ nguyên công khai** — chúng chỉ đọc.

```ts
app.post("/api/upload", requireAdmin, async (req, res) => {
```

```ts
app.post("/api/config", requireAdmin, async (req, res) => {
```

- [ ] **Step 4: Thêm biến vào `.env.example`**

Nối vào cuối `.env.example`:

```
# Token quản trị cho POST /api/upload và POST /api/config.
# Sinh bằng: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Server sẽ từ chối khởi động nếu biến này trống.
ADMIN_TOKEN=
```

- [ ] **Step 5: Kiểm chứng — server từ chối khởi động khi thiếu token**

Run:
```bash
node -e "delete process.env.ADMIN_TOKEN" && ADMIN_TOKEN= npx tsx server.ts
```
Expected: in ra thông báo "ADMIN_TOKEN chưa được đặt…" và thoát với mã 1.

- [ ] **Step 6: Kiểm chứng — 401 khi không có token, 200 khi token đúng**

Mở một terminal chạy server:
```bash
ADMIN_TOKEN=test123 npx tsx server.ts
```

Terminal khác:
```bash
curl -s -o /dev/null -w "%{http_code}\n" -X POST http://localhost:3000/api/config \
  -H "Content-Type: application/json" -d '{"overrides":{},"customMedia":{}}'
```
Expected: `401`

```bash
curl -s -o /dev/null -w "%{http_code}\n" -X POST http://localhost:3000/api/config \
  -H "Content-Type: application/json" -H "Authorization: Bearer test123" \
  -d '{"overrides":{},"customMedia":{}}'
```
Expected: `200`

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/api/health
```
Expected: `200` (endpoint đọc vẫn công khai)

Dừng server. **Khôi phục `public/config.json`** nếu lần gọi 200 đã ghi đè nó: `git checkout public/config.json`

- [ ] **Step 7: Commit**

```bash
git add server.ts .env.example
git commit -m "Require bearer token for the two write endpoints

POST /api/upload and POST /api/config accepted unauthenticated writes,
letting anyone overwrite site content and upload files. The server runs
on a real VPS, so this was live.

Comparison uses timingSafeEqual. The server now refuses to start without
ADMIN_TOKEN rather than running open.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

> **Lưu ý triển khai:** phải đặt `ADMIN_TOKEN` trên VPS **trước** khi deploy commit này, nếu không server sẽ không khởi động lại được. CreatorStudio cũng cần gửi header `Authorization` — xem Task 2.

---

### Task 2: CreatorStudio gửi token và chặn vòng lặp onError

Hai việc trong cùng một file, cùng một lần đọc context.

**Files:**
- Modify: `src/components/CreatorStudio.tsx:782-791` (thẻ `img` có `onError` không chốt chặn)
- Modify: các chỗ gọi `fetch('/api/upload')` và `fetch('/api/config')` trong `src/components/CreatorStudio.tsx`

**Interfaces:**
- Consumes: `requireAdmin` từ Task 1 — client phải gửi `Authorization: Bearer <token>`
- Produces: không có

- [ ] **Step 1: Tìm các lời gọi fetch cần thêm header**

Run:
```bash
grep -n "api/upload\|api/config" src/components/CreatorStudio.tsx src/App.tsx
```

Ghi lại số dòng. Chỉ các lời gọi `method: 'POST'` mới cần header — `GET /api/config` giữ nguyên.

- [ ] **Step 2: Thêm ô nhập token vào CreatorStudio**

Token do người quản trị dán vào, lưu ở `localStorage`. Không hardcode vào bundle — bundle là file công khai.

Thêm gần đầu component `CreatorStudio`:

```tsx
const [adminToken, setAdminToken] = useState<string>(() => {
  try {
    return localStorage.getItem('luclam_admin_token') ?? '';
  } catch {
    return '';
  }
});

const saveAdminToken = (value: string) => {
  setAdminToken(value);
  try {
    localStorage.setItem('luclam_admin_token', value);
  } catch {
    // localStorage có thể bị chặn ở chế độ riêng tư; token vẫn dùng được trong phiên này.
  }
};
```

Và một ô nhập trong phần cài đặt của studio:

```tsx
<label className="flex flex-col gap-1 text-xs text-zinc-400">
  <span className="uppercase tracking-wider font-bold">Token quản trị</span>
  <input
    type="password"
    value={adminToken}
    onChange={(e) => saveAdminToken(e.target.value)}
    placeholder="Dán ADMIN_TOKEN của máy chủ"
    className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-zinc-200 font-mono"
  />
</label>
```

- [ ] **Step 3: Gửi header ở mỗi lời gọi POST**

Với mỗi lời gọi tìm được ở Step 1, thêm header. Ví dụ dạng chuẩn:

```ts
const response = await fetch('/api/config', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${adminToken}`,
  },
  body: JSON.stringify({ overrides, customMedia }),
});

if (response.status === 401) {
  alert('Token quản trị sai hoặc chưa nhập. Kiểm tra lại ô Token quản trị.');
  return;
}
```

- [ ] **Step 4: Chặn vòng lặp onError**

Thay thẻ `img` ở `src/components/CreatorStudio.tsx:782-791`. Bản hiện tại gán `src` sang URL Unsplash mà không có cờ chặn — nếu URL đó cũng hỏng thì `onError` bắn lại vô hạn.

```tsx
<img
  src={item.serverUrl || `indexeddb-media://${item.id}`}
  alt={item.name}
  width={64}
  height={64}
  loading="lazy"
  decoding="async"
  className="w-full h-full object-cover"
  onError={(e) => {
    const image = e.currentTarget;
    if (image.dataset.fallbackApplied === 'true') {
      image.style.display = 'none';
      return;
    }
    image.dataset.fallbackApplied = 'true';
    image.src = '/uploads/cover_benthanh.jpg';
  }}
/>
```

Dùng ảnh nội bộ thay vì Unsplash — nhất quán với `useFallbackImage` ở `src/App.tsx:52-62`. Bước này đồng thời đóng một phần mục #12.

- [ ] **Step 5: Kiểm chứng**

Run:
```bash
npm run lint
```
Expected: exit 0, không lỗi.

```bash
grep -c "dataset.fallbackApplied" src/components/CreatorStudio.tsx
```
Expected: `2` (một lần kiểm tra, một lần gán)

```bash
grep -c "images.unsplash.com" src/components/CreatorStudio.tsx
```
Expected: `0`

- [ ] **Step 6: Commit**

```bash
git add src/components/CreatorStudio.tsx
git commit -m "Send admin token from CreatorStudio and guard its onError

The studio now reads ADMIN_TOKEN from a password field backed by
localStorage and sends it as a bearer header on both write calls.

Its thumbnail onError reassigned src to an Unsplash URL with no guard,
which loops forever if that URL also fails. Now uses the same
fallbackApplied flag as App.tsx and a local fallback image.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: Thuộc tính kích thước cho ảnh còn thiếu

Cả 7 ảnh trên trang công khai đã đủ `width`/`height`/`loading`/`decoding`. Còn sót ảnh modal và hai ảnh admin.

**Files:**
- Modify: `src/components/PlaceDetailModal.tsx:250-255`
- Modify: `src/components/CreatorStudio.tsx:672`, `src/components/CreatorStudio.tsx:865`

**Interfaces:**
- Consumes: không có
- Produces: không có

- [ ] **Step 1: Ảnh hero trong modal**

Thay thẻ `img` ở `src/components/PlaceDetailModal.tsx:250`:

```tsx
<img
  src={resolvedImg}
  alt={place.name}
  width={1280}
  height={720}
  loading="lazy"
  decoding="async"
  className={`w-full h-full object-cover transition-transform duration-500 ${isCreator ? 'group-hover/hero:scale-105' : ''}`}
  referrerPolicy="no-referrer"
/>
```

`1280×720` là tỉ lệ khung 16:9 mà container đang dùng — trình duyệt chỉ cần tỉ lệ để giữ chỗ, không cần kích thước thật của file.

- [ ] **Step 2: Hai ảnh trong CreatorStudio**

`src/components/CreatorStudio.tsx:672`:

```tsx
<img
  src={file.thumbnailLink}
  alt=""
  width={40}
  height={40}
  loading="lazy"
  decoding="async"
  className="w-10 h-10 object-cover rounded-lg shrink-0 bg-zinc-900 border border-zinc-800"
  referrerPolicy="no-referrer"
/>
```

`src/components/CreatorStudio.tsx:865`:

```tsx
<img
  src={img.url}
  alt={img.name}
  width={200}
  height={48}
  loading="lazy"
  decoding="async"
  className="w-full h-12 object-cover"
/>
```

- [ ] **Step 3: Kiểm chứng — mọi thẻ img đều có width**

Run:
```bash
grep -c "<img" src/App.tsx src/components/*.tsx
grep -c "width=" src/App.tsx src/components/*.tsx
```
Expected: hai lệnh cho ra cùng bộ số cho từng file (App.tsx `7`/`7`, CreatorStudio.tsx `3`/`3`, PlaceDetailModal.tsx `1`/`1`).

```bash
npm run lint
```
Expected: exit 0

- [ ] **Step 4: Commit**

```bash
git add src/components/PlaceDetailModal.tsx src/components/CreatorStudio.tsx
git commit -m "Give the modal and admin images intrinsic dimensions

Closes the last four images without width/height/loading/decoding.
These open after interaction so they never counted toward initial CLS,
but the attributes belong there regardless.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: Một thẻ h1, ngôn ngữ mặc định tiếng Việt

**Files:**
- Modify: `src/App.tsx:475-481` (h1 thương hiệu ở sidebar)
- Modify: `src/App.tsx:76` (giá trị rơi về của `getInitialLanguage`)

**Interfaces:**
- Consumes: không có
- Produces: không có

- [ ] **Step 1: Đổi h1 thương hiệu thành div**

`src/App.tsx:475` hiện là `<h1>` chứa tên thương hiệu trong sidebar, song song với `<h1>` tiêu đề trang bìa ở dòng 759. Giữ `<h1>` ở trang bìa, hạ cấp cái ở sidebar:

```tsx
<div
  onClick={handleBrandClick}
  className="text-2xl font-serif tracking-wider text-[#d16b4c] font-bold select-none cursor-pointer"
>
  {t.brand}
</div>
```

Giữ nguyên toàn bộ class, chỉ thêm `cursor-pointer` vì `div` không có con trỏ tay mặc định như heading đang được click.

> HTML5 cho phép nhiều `h1` và Google đã xác nhận đây không phải yếu tố xếp hạng. Sửa vì cấu trúc gọn, không phải vì thứ hạng — đừng báo cáo mục này như một lỗi SEO đã khắc phục.

- [ ] **Step 2: Đổi giá trị rơi về sang tiếng Việt**

`src/App.tsx:76` hiện rơi về `'en'`, trong khi khung HTML tĩnh khai `lang="vi"` với nội dung tiếng Việt. Sau khi có 60 trang tĩnh, mỗi trang tự khai ngôn ngữ của nó, nhưng giá trị rơi về vẫn nên khớp với trang gốc `/`:

```ts
  return supportedLanguages.includes(language) ? language : 'vi';
```

- [ ] **Step 3: Kiểm chứng**

Run:
```bash
grep -c "<h1" src/App.tsx
```
Expected: `1`

```bash
grep -n "supportedLanguages.includes(language)" src/App.tsx
```
Expected: dòng kết thúc bằng `: 'vi';`

```bash
npm run lint && npm run build
```
Expected: cả hai exit 0

- [ ] **Step 4: Commit**

```bash
git add src/App.tsx
git commit -m "Keep one h1 and default to Vietnamese

The sidebar brand h1 became a div; the cover heading stays the only h1.
getInitialLanguage now falls back to 'vi' so an unrecognised locale
matches the lang the static shell declares.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 5: Dọn file thừa trong repo

**Files:**
- Delete: `find_renders.py`, `inspect_ja_sections.py`, `bun.lock`
- Delete: `public/uploads/test_0.jpg`, `test_1.jpg`, `test_2.jpg`, `test_3.jpg`
- Modify: `package.json` (gỡ `@google/genai`)

**Interfaces:**
- Consumes: không có
- Produces: không có

- [ ] **Step 1: Xác nhận `@google/genai` thật sự không được dùng**

Run:
```bash
grep -rn "@google/genai\|GoogleGenAI\|from 'genai'" src/ app/ server.ts index.html 2>/dev/null
```
Expected: không có kết quả. Nếu **có** kết quả, dừng lại và báo — đừng gỡ dependency đang được dùng.

- [ ] **Step 2: Xác nhận ảnh test không được tham chiếu**

Run:
```bash
grep -rn "test_0\|test_1\|test_2\|test_3" src/ public/config.json index.html
```
Expected: không có kết quả.

- [ ] **Step 3: Xoá file và gỡ dependency**

```bash
git rm find_renders.py inspect_ja_sections.py bun.lock
git rm public/uploads/test_0.jpg public/uploads/test_1.jpg public/uploads/test_2.jpg public/uploads/test_3.jpg
npm uninstall @google/genai
```

`bun.lock` bị xoá vì CI dùng `npm ci` với `package-lock.json`; giữ hai lockfile song song là mời gọi lệch phiên bản.

- [ ] **Step 4: Kiểm chứng**

Run:
```bash
du -sh public/uploads
```
Expected: khoảng 5.0M (giảm ~2.1MB so với 7.1M).

```bash
npm run lint && npm run build
```
Expected: cả hai exit 0

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Remove unused files and dependency

@google/genai was declared but imported nowhere. bun.lock sat beside
package-lock.json while CI uses npm ci. Two scratch Python scripts and
2.1MB of test images were shipping in the build.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

# Phase 2 — Ảnh

---

### Task 6: Script tối ưu ảnh

Ảnh LCP hiện 1.2 MB. Trên 4G mất khoảng 3–5 giây để hiện, trượt Core Web Vitals.

**Files:**
- Create: `scripts/optimize-images.ts`
- Modify: `package.json` (thêm `sharp` vào devDependencies, thêm script `images`)

**Interfaces:**
- Consumes: không có
- Produces: file `<tên>-<bề rộng>.avif` và `<tên>-<bề rộng>.webp` trong `public/uploads/`, dùng bởi Task 7

- [ ] **Step 1: Cài sharp**

```bash
npm install --save-dev sharp
```

- [ ] **Step 2: Viết script**

Create `scripts/optimize-images.ts`:

```ts
import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

const UPLOADS = path.join(process.cwd(), 'public', 'uploads');
const WIDTHS = [640, 1280, 1920];
const SOURCE_PATTERN = /\.(jpe?g|png)$/i;

// Bỏ qua file đã là bản dẫn xuất, tránh nén chồng lên chính nó khi chạy lại.
const DERIVED_PATTERN = /-(640|1280|1920)\.(avif|webp)$/i;

async function optimise(fileName: string) {
  const sourcePath = path.join(UPLOADS, fileName);
  const baseName = fileName.replace(SOURCE_PATTERN, '');
  const image = sharp(sourcePath);
  const meta = await image.metadata();
  const sourceWidth = meta.width ?? 0;

  for (const width of WIDTHS) {
    // Không phóng to ảnh nhỏ hơn bề rộng đích.
    if (sourceWidth && width > sourceWidth) continue;

    await sharp(sourcePath)
      .resize({ width })
      .avif({ quality: 55 })
      .toFile(path.join(UPLOADS, `${baseName}-${width}.avif`));

    await sharp(sourcePath)
      .resize({ width })
      .webp({ quality: 72 })
      .toFile(path.join(UPLOADS, `${baseName}-${width}.webp`));
  }

  // Nén lại chính file gốc để thẻ src fallback cũng nhẹ đi.
  const recompressed = await sharp(sourcePath)
    .resize({ width: Math.min(1920, sourceWidth || 1920) })
    .jpeg({ quality: 78, mozjpeg: true })
    .toBuffer();

  const originalSize = (await fs.stat(sourcePath)).size;
  if (recompressed.length < originalSize) {
    await fs.writeFile(sourcePath, recompressed);
  }

  console.log(`  ${fileName}: ${(originalSize / 1024).toFixed(0)}KB → ${(recompressed.length / 1024).toFixed(0)}KB + AVIF/WebP`);
}

async function main() {
  const entries = await fs.readdir(UPLOADS);
  const sources = entries.filter(
    (name) => SOURCE_PATTERN.test(name) && !DERIVED_PATTERN.test(name)
  );

  console.log(`Đang xử lý ${sources.length} ảnh nguồn…`);
  for (const fileName of sources) {
    await optimise(fileName);
  }
  console.log('Xong.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
```

- [ ] **Step 3: Thêm npm script**

Trong `package.json`, thêm vào `scripts`:

```json
"images": "tsx scripts/optimize-images.ts"
```

Script này chạy **thủ công** và kết quả được commit. Không nối vào `build` — để CI không phải cài `sharp` (binary nặng, hay hỏng trên runner).

- [ ] **Step 4: Chạy và kiểm chứng**

Run:
```bash
npm run images
```
Expected: in ra từng file với kích thước trước/sau.

```bash
ls public/uploads/*.avif | wc -l
```
Expected: lớn hơn `0`.

```bash
ls -l public/uploads/cover_benthanh-1280.avif | awk '{printf "%.0f KB\n", $5/1024}'
```
Expected: dưới `200 KB`. Nếu vượt, hạ `quality` của AVIF xuống 45 và chạy lại.

```bash
du -sh public/uploads
```
Ghi lại con số để so sánh sau.

- [ ] **Step 5: Commit**

```bash
git add scripts/optimize-images.ts package.json package-lock.json public/uploads
git commit -m "Add image optimisation script and generated AVIF/WebP

Exports AVIF and WebP at 640/1280/1920 and recompresses the JPEG
originals in place as the src fallback. Runs manually via npm run images
so CI does not need sharp.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 7: Dùng `<picture>` cho ảnh nội dung

**Files:**
- Create: `src/components/ResponsiveImage.tsx`
- Modify: `src/App.tsx` (7 thẻ `img` — dòng 90, 725, 1342, 1384, 1426, 1828, 1957)

**Interfaces:**
- Consumes: file dẫn xuất từ Task 6
- Produces: component `ResponsiveImage` với props `{ src, alt, width, height, className, sizes?, priority? }`

- [ ] **Step 1: Viết component**

Create `src/components/ResponsiveImage.tsx`:

```tsx
import React from 'react';

const WIDTHS = [640, 1280, 1920];
const LOCAL_IMAGE = /^\/uploads\/.+\.(jpe?g|png)$/i;

type Props = {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  sizes?: string;
  /** Ảnh LCP: bỏ lazy-load và nạp sớm. */
  priority?: boolean;
  onError?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
};

function buildSrcSet(src: string, extension: 'avif' | 'webp') {
  const base = src.replace(/\.(jpe?g|png)$/i, '');
  return WIDTHS.map((w) => `${base}-${w}.${extension} ${w}w`).join(', ');
}

export function ResponsiveImage({
  src,
  alt,
  width,
  height,
  className,
  sizes = '100vw',
  priority = false,
  onError,
}: Props) {
  const loading = priority ? 'eager' : 'lazy';
  const fetchPriority = priority ? 'high' : 'auto';

  // Ảnh ngoài (Unsplash, hstatic, Wikimedia) không có bản dẫn xuất — trả thẻ img thường.
  if (!LOCAL_IMAGE.test(src)) {
    return (
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        decoding="async"
        fetchPriority={fetchPriority}
        className={className}
        referrerPolicy="no-referrer"
        onError={onError}
      />
    );
  }

  return (
    <picture>
      <source type="image/avif" srcSet={buildSrcSet(src, 'avif')} sizes={sizes} />
      <source type="image/webp" srcSet={buildSrcSet(src, 'webp')} sizes={sizes} />
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        decoding="async"
        fetchPriority={fetchPriority}
        className={className}
        onError={onError}
      />
    </picture>
  );
}
```

- [ ] **Step 2: Thay thẻ img ảnh bìa (ảnh LCP)**

`src/App.tsx:725` là ảnh bìa — đây là ảnh LCP nên đặt `priority`:

```tsx
<ResponsiveImage
  src={coverImage}
  alt={t.cover.heading}
  width={1920}
  height={1080}
  priority
  sizes="(max-width: 768px) 100vw, 420px"
  className="w-full h-full object-cover"
  onError={useFallbackImage}
/>
```

Giữ nguyên biến nguồn ảnh mà dòng 725 đang dùng — chỉ đổi thẻ, không đổi dữ liệu.

- [ ] **Step 3: Thay 6 thẻ img còn lại**

Với mỗi dòng 90, 1342, 1384, 1426, 1828, 1957: đổi `<img …/>` thành `<ResponsiveImage …/>`, giữ nguyên `src`, `alt`, `width`, `height`, `className`, `onError`. **Không** đặt `priority` cho các ảnh này — chỉ ảnh bìa ở Step 2 mới được ưu tiên nạp.

Ví dụ dòng 90 (thumbnail 64×64 trong `ThumbnailPreview`), trước:

```tsx
<img
  src={resolved}
  alt=""
  width={64}
  height={64}
  loading="lazy"
  decoding="async"
  className="w-full h-full object-cover"
  referrerPolicy="no-referrer"
  onError={useFallbackImage}
/>
```

sau:

```tsx
<ResponsiveImage
  src={resolved}
  alt=""
  width={64}
  height={64}
  sizes="64px"
  className="w-full h-full object-cover"
  onError={useFallbackImage}
/>
```

`loading`, `decoding` và `referrerPolicy` bỏ đi vì `ResponsiveImage` tự đặt. Thuộc tính `sizes` đặt theo bề rộng hiển thị thật của từng ảnh — với ảnh nhỏ thì ghi cố định (`64px`), với ảnh tràn khung thì dùng dạng điều kiện như ở Step 2.

Thêm import ở đầu file:

```tsx
import { ResponsiveImage } from './components/ResponsiveImage';
```

- [ ] **Step 4: Kiểm chứng**

Run:
```bash
grep -c "<ResponsiveImage" src/App.tsx
```
Expected: `7`

```bash
grep -c "<img" src/App.tsx
```
Expected: `0`

```bash
npm run lint && npm run build
```
Expected: cả hai exit 0

```bash
grep -o 'type="image/avif"' dist/index.html | wc -l
```
Expected: `0` — khối tĩnh trong `index.html` chưa dùng `<picture>` ở giai đoạn này; Task 11 sẽ xử lý. Bước này chỉ xác nhận build không vỡ.

- [ ] **Step 5: Commit**

```bash
git add src/components/ResponsiveImage.tsx src/App.tsx
git commit -m "Serve content images as picture with AVIF and WebP sources

ResponsiveImage builds srcsets from the derivatives generated by
npm run images, and falls back to a plain img for external hosts that
have no derivatives. The cover image is marked priority as the LCP.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

# Phase 3 — Sinh trang tĩnh và định tuyến

Đây là phần lớn nhất. Nó đóng #2, #3, #5 và mở khoá #8.

---

### Task 8: Bảng ánh xạ slug dùng chung

Một nguồn sự thật duy nhất cho cả SPA và bộ sinh tĩnh. Nếu hai bên tự giữ bảng riêng, chúng sẽ lệch nhau.

**Files:**
- Create: `src/routes.ts`

**Interfaces:**
- Consumes: `Language` từ `src/translations.ts`
- Produces:
  - `TOPICS: readonly Topic[]` — 10 chủ đề đúng thứ tự
  - `type Topic = 'cover' | 'welcome' | … | 'info'`
  - `HTML_LANG: Record<Language, string>`
  - `pathFor(lang: Language, topic: Topic): string` — trả `/`, `/am-thuc/`, `/en/food/`…
  - `parsePath(pathname: string): { lang: Language; topic: Topic }`
  - `ALL_ROUTES: Array<{ lang: Language; topic: Topic; path: string }>` — đủ 60 phần tử

- [ ] **Step 1: Viết file**

Create `src/routes.ts`:

```ts
import type { Language } from './translations';

export const TOPICS = [
  'cover', 'welcome', 'atmosphere', 'transport', 'stay',
  'food', 'culture', 'shopping', 'luclam', 'info',
] as const;

export type Topic = (typeof TOPICS)[number];

export const LANGUAGES: readonly Language[] = ['vi', 'en', 'ja', 'ko', 'zh', 'zht'];

export const DEFAULT_LANGUAGE: Language = 'vi';

export const HTML_LANG: Record<Language, string> = {
  vi: 'vi', en: 'en', ja: 'ja', ko: 'ko', zh: 'zh-CN', zht: 'zh-TW',
};

/** Slug tiếng Việt dùng ở gốc site. */
const VI_SLUG: Record<Topic, string> = {
  cover: '',
  welcome: 'gioi-thieu',
  atmosphere: 'khu-vuc',
  transport: 'di-chuyen',
  stay: 'luu-tru',
  food: 'am-thuc',
  culture: 'van-hoa',
  shopping: 'mua-sam',
  luclam: 'luc-lam',
  info: 'thong-tin-huu-ich',
};

/** Slug ASCII dùng cho 5 ngôn ngữ còn lại. */
const INTL_SLUG: Record<Topic, string> = {
  cover: '',
  welcome: 'welcome',
  atmosphere: 'atmosphere',
  transport: 'transport',
  stay: 'stay',
  food: 'food',
  culture: 'culture',
  shopping: 'shopping',
  luclam: 'luclam',
  info: 'info',
};

export function slugFor(lang: Language, topic: Topic): string {
  return lang === DEFAULT_LANGUAGE ? VI_SLUG[topic] : INTL_SLUG[topic];
}

export function pathFor(lang: Language, topic: Topic): string {
  const slug = slugFor(lang, topic);
  const prefix = lang === DEFAULT_LANGUAGE ? '' : `/${lang}`;
  return slug ? `${prefix}/${slug}/` : `${prefix}/` || '/';
}

export function parsePath(pathname: string): { lang: Language; topic: Topic } {
  const segments = pathname.split('/').filter(Boolean);

  let lang: Language = DEFAULT_LANGUAGE;
  let rest = segments;

  if (segments.length > 0 && (LANGUAGES as string[]).includes(segments[0])) {
    lang = segments[0] as Language;
    rest = segments.slice(1);
  }

  if (rest.length === 0) return { lang, topic: 'cover' };

  const table = lang === DEFAULT_LANGUAGE ? VI_SLUG : INTL_SLUG;
  const found = TOPICS.find((topic) => table[topic] === rest[0]);

  return { lang, topic: found ?? 'cover' };
}

export const ALL_ROUTES = LANGUAGES.flatMap((lang) =>
  TOPICS.map((topic) => ({ lang, topic, path: pathFor(lang, topic) }))
);
```

- [ ] **Step 2: Kiểm chứng bằng một lần chạy tsx**

Run:
```bash
npx tsx -e "
import { ALL_ROUTES, pathFor, parsePath } from './src/routes';
console.log('routes:', ALL_ROUTES.length);
console.log('vi food:', pathFor('vi', 'food'));
console.log('en food:', pathFor('en', 'food'));
console.log('vi cover:', pathFor('vi', 'cover'));
console.log('ja cover:', pathFor('ja', 'cover'));
console.log('parse /am-thuc/:', JSON.stringify(parsePath('/am-thuc/')));
console.log('parse /en/food/:', JSON.stringify(parsePath('/en/food/')));
console.log('parse /:', JSON.stringify(parsePath('/')));
console.log('unique:', new Set(ALL_ROUTES.map(r => r.path)).size);
"
```

Expected, từng dòng một:
```
routes: 60
vi food: /am-thuc/
en food: /en/food/
vi cover: /
ja cover: /ja/
parse /am-thuc/: {"lang":"vi","topic":"food"}
parse /en/food/: {"lang":"en","topic":"food"}
parse /: {"lang":"vi","topic":"cover"}
unique: 60
```

Dòng `unique: 60` là quan trọng nhất — nó chứng minh không có hai chủ đề nào đụng slug.

- [ ] **Step 3: Commit**

```bash
git add src/routes.ts
git commit -m "Add the shared slug table for routing and prerendering

One source of truth for the 60 lang/topic URLs so the SPA router and the
static generator cannot drift apart.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 9: Định tuyến trong SPA

**Files:**
- Modify: `src/App.tsx:64-77` (`getInitialLanguage`), `src/App.tsx:105` (khởi tạo state), `src/App.tsx:271-283` (`handleLangChange`), `src/App.tsx:389-399` (`navigateToPage`)

**Interfaces:**
- Consumes: `pathFor`, `parsePath`, `TOPICS`, `Topic` từ `src/routes.ts`
- Produces: URL đổi theo chủ đề — điều kiện tiên quyết cho canonical đúng ở Task 11

- [ ] **Step 1: Đọc ngôn ngữ và chủ đề từ đường dẫn**

Thay `getInitialLanguage` ở `src/App.tsx:64-77`. Thứ tự ưu tiên: đường dẫn → `?lang=` → `localStorage` → ngôn ngữ trình duyệt → `'vi'`.

```ts
import { pathFor, parsePath, TOPICS, type Topic } from './routes';

function getInitialState(): { lang: Language; topic: Topic } {
  const fromPath = parsePath(window.location.pathname);

  // Đường dẫn không phải gốc đã xác định cả ngôn ngữ lẫn chủ đề — tin nó.
  if (window.location.pathname !== '/') return fromPath;

  const requested = new URLSearchParams(window.location.search).get('lang') as Language | null;
  if (requested && supportedLanguages.includes(requested)) {
    return { lang: requested, topic: 'cover' };
  }

  try {
    const saved = localStorage.getItem('saigon_guide_lang') as Language | null;
    if (saved && supportedLanguages.includes(saved)) return { lang: saved, topic: 'cover' };
  } catch {
    // Storage có thể bị chặn ở chế độ riêng tư; tiếp tục với ngôn ngữ trình duyệt.
  }

  const browserLanguage = navigator.language.toLowerCase();
  if (browserLanguage.startsWith('zh-tw') || browserLanguage.startsWith('zh-hk')) {
    return { lang: 'zht', topic: 'cover' };
  }
  const language = browserLanguage.split('-')[0] as Language;
  return {
    lang: supportedLanguages.includes(language) ? language : 'vi',
    topic: 'cover',
  };
}
```

- [ ] **Step 2: Khởi tạo state từ đó**

Thay `src/App.tsx:105` và dòng khởi tạo `currentPage`:

```tsx
const [initialState] = useState(getInitialState);
const [lang, setLang] = useState<Language>(initialState.lang);
const [currentPage, setCurrentPage] = useState<number>(
  TOPICS.indexOf(initialState.topic)
);
```

- [ ] **Step 3: `navigateToPage` ghi URL**

Thay `src/App.tsx:389-399`:

```tsx
const navigateToPage = (index: number) => {
  if (index < 0 || index >= pagesList.length) return;
  setCurrentPage(index);

  const nextPath = pathFor(lang, TOPICS[index]);
  if (window.location.pathname !== nextPath) {
    window.history.pushState({ topic: TOPICS[index] }, '', nextPath);
  }

  if (phoneScreenRef.current) {
    const pageWidth = phoneScreenRef.current.clientWidth;
    phoneScreenRef.current.scrollTo({ left: index * pageWidth, behavior: 'smooth' });
  }
};
```

- [ ] **Step 4: Nút back/forward hoạt động**

Thêm effect mới, đặt cạnh effect đồng bộ `documentElement.lang` ở dòng 267:

```tsx
useEffect(() => {
  const handlePopState = () => {
    const { lang: nextLang, topic } = parsePath(window.location.pathname);
    setLang(nextLang);
    setCurrentPage(TOPICS.indexOf(topic));
  };

  window.addEventListener('popstate', handlePopState);
  return () => window.removeEventListener('popstate', handlePopState);
}, []);
```

- [ ] **Step 5: Đổi ngôn ngữ giữ nguyên chủ đề**

Thay `handleLangChange` ở `src/App.tsx:271-283`:

```tsx
const handleLangChange = (selectedLang: Language) => {
  setLang(selectedLang);
  window.history.pushState({}, '', pathFor(selectedLang, TOPICS[currentPage]));
  try {
    localStorage.setItem('saigon_guide_lang', selectedLang);
  } catch (e) {
    console.warn('Failed to save language:', e);
  }
};
```

Đang đọc trang ẩm thực tiếng Việt mà bấm sang tiếng Nhật thì tới `/ja/food/`, không văng về trang bìa.

- [ ] **Step 6: Kiểm chứng thủ công**

Run:
```bash
ADMIN_TOKEN=dev npx tsx server.ts
```

Trong trình duyệt, kiểm từng mục:
1. Mở `http://localhost:3000/am-thuc/` → mở thẳng vào trang ẩm thực, tiếng Việt
2. Bấm sang chủ đề khác → thanh địa chỉ đổi theo
3. Bấm nút back → quay lại chủ đề trước, nội dung khớp
4. Mở `http://localhost:3000/ja/transport/` → trang di chuyển, tiếng Nhật
5. Đang ở `/am-thuc/`, bấm cờ Nhật → tới `/ja/food/`, vẫn ở trang ẩm thực

Cả 5 mục phải đúng thì mới sang bước sau.

```bash
npm run lint && npm run build
```
Expected: cả hai exit 0

- [ ] **Step 7: Commit**

```bash
git add src/App.tsx
git commit -m "Route topics and languages through the URL

navigateToPage and handleLangChange now pushState the real path, a
popstate listener restores state on back/forward, and startup reads
language and topic from the pathname before falling back to query,
storage, then browser locale.

Ten topics stopped being one URL.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 10: Bộ sinh HTML tĩnh

**Files:**
- Create: `scripts/prerender/render-content.ts` (dựng phần thân từ dữ liệu)
- Create: `scripts/prerender/index.ts` (đọc dist, ghi 60 file)
- Modify: `package.json` (nối vào `build`)

**Interfaces:**
- Consumes: `ALL_ROUTES`, `pathFor`, `HTML_LANG` từ `src/routes.ts`; `translations` từ `src/translations.ts`
- Produces:
  - `renderContent(lang: Language, topic: Topic): string` — trả HTML phần thân, không có thẻ `<html>`
  - `escapeHtml(value: string): string`

- [ ] **Step 1: Viết bộ dựng nội dung**

Create `scripts/prerender/render-content.ts`:

```ts
import { translations, type Language } from '../../src/translations';
import { pathFor, TOPICS, type Topic } from '../../src/routes';

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Đi đệ quy qua một nhánh dữ liệu dịch và dựng ra HTML phẳng.
 * Dữ liệu trong translations.ts không đồng nhất giữa các chủ đề —
 * chỗ là chuỗi, chỗ là mảng object có title/desc/label/detail —
 * nên bộ dựng bám vào hình dạng dữ liệu thay vì vào một schema cố định.
 */
function renderNode(node: unknown, depth = 0): string {
  if (typeof node === 'string') {
    const text = node.trim();
    if (!text) return '';
    return `<p>${escapeHtml(text)}</p>`;
  }

  if (Array.isArray(node)) {
    return `<ul>${node.map((item) => `<li>${renderNode(item, depth + 1)}</li>`).join('')}</ul>`;
  }

  if (node && typeof node === 'object') {
    const entries = Object.entries(node as Record<string, unknown>);
    const headingLevel = Math.min(depth + 3, 6);

    return entries
      .map(([key, value]) => {
        // Khoá mang tính tiêu đề thì lên thẻ heading, phần còn lại xuống thân.
        if (
          typeof value === 'string' &&
          ['title', 'name', 'heading', 'label'].includes(key)
        ) {
          return `<h${headingLevel}>${escapeHtml(value)}</h${headingLevel}>`;
        }
        // Bỏ qua khoá kỹ thuật không phải nội dung đọc được.
        if (['id', 'icon', 'color', 'image', 'img', 'url', 'video'].includes(key)) {
          return '';
        }
        return renderNode(value, depth + 1);
      })
      .join('');
  }

  return '';
}

export function renderContent(lang: Language, topic: Topic): string {
  const t = translations[lang];
  const topicData = (t as Record<string, unknown>)[topic];
  const topicName = t.pages[topic];

  const nav = TOPICS.filter((item) => item !== topic)
    .map(
      (item) =>
        `<li><a href="${pathFor(lang, item)}">${escapeHtml(t.pages[item])}</a></li>`
    )
    .join('');

  const languageNav = (['vi', 'en', 'ja', 'ko', 'zh', 'zht'] as Language[])
    .filter((other) => other !== lang)
    .map(
      (other) =>
        `<li><a href="${pathFor(other, topic)}" hreflang="${other}">${escapeHtml(
          translations[other].title
        )}</a></li>`
    )
    .join('');

  const heading =
    topic === 'cover'
      ? `${escapeHtml(t.title)} — ${escapeHtml(t.subtitle)}`
      : escapeHtml(topicName);

  return `
    <article>
      <h1>${heading}</h1>
      ${renderNode(topicData, 0)}
    </article>
    <nav aria-label="Chủ đề khác"><ul>${nav}</ul></nav>
    <nav aria-label="Ngôn ngữ khác"><ul>${languageNav}</ul></nav>
  `;
}
```

- [ ] **Step 2: Kiểm chứng bộ dựng trước khi ghi file**

Run:
```bash
npx tsx -e "
import { renderContent } from './scripts/prerender/render-content';
const html = renderContent('en', 'food');
const words = html.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length;
console.log('words:', words);
console.log('has h1:', /<h1>/.test(html));
console.log('sample:', html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').slice(0, 160));
"
```

Expected: `words:` lớn hơn `300`, `has h1: true`, và dòng sample là văn xuôi tiếng Anh đọc được. Nếu số từ dưới 300, `renderNode` đang bỏ sót nhánh dữ liệu — kiểm lại danh sách khoá bị lọc.

- [ ] **Step 3: Commit bộ dựng**

```bash
git add scripts/prerender/render-content.ts
git commit -m "Add the content renderer for static pages

Walks the translation tree by shape rather than a fixed schema, since
topic data is not uniform across the ten topics.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 11: Thẻ meta, hreflang và structured data

**Files:**
- Create: `scripts/prerender/render-head.ts`

**Interfaces:**
- Consumes: `ALL_ROUTES`, `pathFor`, `HTML_LANG`; `escapeHtml` từ Task 10
- Produces: `renderHead(lang, topic, assets): string` — trả toàn bộ nội dung `<head>`

- [ ] **Step 1: Viết bộ dựng head**

Create `scripts/prerender/render-head.ts`:

```ts
import { translations, type Language } from '../../src/translations';
import { pathFor, HTML_LANG, LANGUAGES, type Topic } from '../../src/routes';
import { escapeHtml } from './render-content';

const ORIGIN = 'https://gift.luclam.vn';
const OG_IMAGE = `${ORIGIN}/uploads/cover_benthanh.jpg`;

export type Assets = { scripts: string[]; stylesheets: string[] };

function absolute(path: string) {
  return `${ORIGIN}${path}`;
}

function hreflangTags(topic: Topic): string {
  const tags = LANGUAGES.map(
    (lang) =>
      `<link rel="alternate" hreflang="${HTML_LANG[lang]}" href="${absolute(
        pathFor(lang, topic)
      )}" />`
  );
  // x-default trỏ bản tiếng Anh: khách không khớp ngôn ngữ nào thường đọc được tiếng Anh.
  tags.push(
    `<link rel="alternate" hreflang="x-default" href="${absolute(pathFor('en', topic))}" />`
  );
  return tags.join('\n    ');
}

function breadcrumb(lang: Language, topic: Topic): string {
  if (topic === 'cover') return '';
  const t = translations[lang];

  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: t.title,
        item: absolute(pathFor(lang, 'cover')),
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: t.pages[topic],
        item: absolute(pathFor(lang, topic)),
      },
    ],
  });
}

function faqPage(lang: Language, topic: Topic): string {
  if (topic !== 'info' && topic !== 'cover') return '';

  const info = translations[lang].info as {
    categories: Array<{ title: string; items: Array<{ label: string; detail: string }> }>;
  };

  const questions = info.categories.flatMap((category) =>
    category.items.map((item) => ({
      '@type': 'Question',
      name: item.label,
      acceptedAnswer: { '@type': 'Answer', text: item.detail },
    }))
  );

  if (questions.length === 0) return '';

  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${absolute(pathFor(lang, topic))}#faq`,
    mainEntity: questions,
  });
}

function localBusiness(lang: Language): string {
  // Trường telephone cố ý để trống: số chính thức chưa được Lục Lam xác nhận,
  // và một số sai còn hại hơn không có số. Xem mục #7 trong spec.
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': ['TeaStore', 'LocalBusiness'],
    name: 'Lục Lam Art Of Tea',
    alternateName: translations[lang].title,
    image: OG_IMAGE,
    '@id': ORIGIN,
    url: absolute(pathFor(lang, 'cover')),
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Tầng B2, Takashimaya, 92-94 Nam Kỳ Khởi Nghĩa',
      addressLocality: 'Quận 1',
      addressRegion: 'Thành phố Hồ Chí Minh',
      postalCode: '700000',
      addressCountry: 'VN',
    },
    geo: { '@type': 'GeoCoordinates', latitude: 10.7733, longitude: 106.7011 },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',
      ],
      opens: '09:30',
      closes: '22:00',
    },
    sameAs: ['https://www.facebook.com/luclamartoftea'],
  });
}

export function renderHead(lang: Language, topic: Topic, assets: Assets): string {
  const t = translations[lang];
  const isCover = topic === 'cover';

  const title = isCover
    ? `${t.title} | ${t.subtitle}`
    : `${t.pages[topic]} | ${t.title}`;

  const description = isCover
    ? t.subtitle
    : `${t.pages[topic]} — ${t.subtitle}`;

  const canonical = absolute(pathFor(lang, topic));

  const jsonLd = [
    isCover ? localBusiness(lang) : '',
    breadcrumb(lang, topic),
    faqPage(lang, topic),
  ]
    .filter(Boolean)
    .map((json) => `<script type="application/ld+json">${json}</script>`)
    .join('\n    ');

  const styles = assets.stylesheets
    .map((href) => `<link rel="stylesheet" href="${href}" />`)
    .join('\n    ');

  return `<meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <meta name="author" content="Lục Lam Art Of Tea" />
    <link rel="canonical" href="${canonical}" />
    ${hreflangTags(topic)}
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:image" content="${OG_IMAGE}" />
    <meta property="og:site_name" content="Lục Lam Art Of Tea" />
    <meta property="og:locale" content="${HTML_LANG[lang]}" />
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:title" content="${escapeHtml(title)}" />
    <meta property="twitter:description" content="${escapeHtml(description)}" />
    <meta property="twitter:image" content="${OG_IMAGE}" />
    ${styles}
    ${jsonLd}`;
}
```

- [ ] **Step 2: Kiểm chứng**

Run:
```bash
npx tsx -e "
import { renderHead } from './scripts/prerender/render-head';
const head = renderHead('ja', 'food', { scripts: ['/assets/x.js'], stylesheets: ['/assets/x.css'] });
console.log('hreflang:', (head.match(/hreflang=/g) || []).length);
console.log('canonical:', (head.match(/rel=\"canonical\"/g) || []).length);
console.log('breadcrumb:', /BreadcrumbList/.test(head));
console.log('telephone:', /telephone/.test(head));
const cover = renderHead('vi', 'cover', { scripts: [], stylesheets: [] });
console.log('faq questions:', (cover.match(/\"@type\":\"Question\"/g) || []).length);
"
```

Expected:
```
hreflang: 7
canonical: 1
breadcrumb: true
telephone: false
faq questions: 7
```

`telephone: false` là bắt buộc — spec cấm điền số phỏng đoán. `faq questions` phải lớn hơn `3` (con số cũ); 7 là số mục trong `info.categories` tiếng Việt.

- [ ] **Step 3: Commit**

```bash
git add scripts/prerender/render-head.ts
git commit -m "Add per-page head, hreflang and structured data

Every page declares its own canonical plus seven hreflang tags.
BreadcrumbList becomes meaningful now that a real hierarchy exists, and
FAQPage is generated from info.categories rather than three hand-written
questions. telephone stays absent pending confirmation.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 12: Ghi 60 trang, sitemap và 404

**Files:**
- Create: `scripts/prerender/index.ts`
- Modify: `package.json` (nối `prerender` vào `build`)
- Delete: `public/sitemap.xml` (từ nay sinh tự động)

**Interfaces:**
- Consumes: `renderContent` (Task 10), `renderHead` (Task 11), `ALL_ROUTES` (Task 8)
- Produces: `dist/**/index.html` × 60, `dist/sitemap.xml`, `dist/404.html`

- [ ] **Step 1: Viết bộ ghi file**

Create `scripts/prerender/index.ts`:

```ts
import fs from 'fs/promises';
import path from 'path';
import { ALL_ROUTES, pathFor, HTML_LANG } from '../../src/routes';
import { renderContent } from './render-content';
import { renderHead, type Assets } from './render-head';

const DIST = path.join(process.cwd(), 'dist');
const ORIGIN = 'https://gift.luclam.vn';

/** Lấy đường dẫn asset đã hash từ index.html mà Vite vừa sinh. */
async function readAssets(): Promise<Assets> {
  const html = await fs.readFile(path.join(DIST, 'index.html'), 'utf-8');

  const scripts = [...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map((m) => m[1]);
  const stylesheets = [...html.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/g)].map(
    (m) => m[1]
  );

  if (scripts.length === 0) {
    throw new Error('Không tìm thấy thẻ script nào trong dist/index.html — Vite build hỏng?');
  }

  return { scripts, stylesheets };
}

function renderPage(lang: string, head: string, body: string, scripts: string[]) {
  const scriptTags = scripts
    .map((src) => `<script type="module" crossorigin src="${src}"></script>`)
    .join('\n    ');

  return `<!doctype html>
<html lang="${HTML_LANG[lang as keyof typeof HTML_LANG]}">
  <head>
    ${head}
  </head>
  <body>
    <div id="root"></div>
    <div id="static-content">${body}</div>
    ${scriptTags}
  </body>
</html>
`;
}

async function writeSitemap() {
  const urls = ALL_ROUTES.filter((route) => route.lang === 'vi')
    .map((route) => {
      const alternates = ['vi', 'en', 'ja', 'ko', 'zh', 'zht']
        .map(
          (lang) =>
            `      <xhtml:link rel="alternate" hreflang="${
              HTML_LANG[lang as keyof typeof HTML_LANG]
            }" href="${ORIGIN}${pathFor(lang as never, route.topic)}" />`
        )
        .join('\n');

      return `  <url>
    <loc>${ORIGIN}${route.path}</loc>
    <changefreq>weekly</changefreq>
    <priority>${route.topic === 'cover' ? '1.0' : '0.8'}</priority>
${alternates}
  </url>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`;

  await fs.writeFile(path.join(DIST, 'sitemap.xml'), xml, 'utf-8');
}

async function main() {
  const assets = await readAssets();
  let written = 0;

  for (const route of ALL_ROUTES) {
    const head = renderHead(route.lang, route.topic, assets);
    const body = renderContent(route.lang, route.topic);
    const html = renderPage(route.lang, head, body, assets.scripts);

    const outputDir = path.join(DIST, route.path);
    await fs.mkdir(outputDir, { recursive: true });
    await fs.writeFile(path.join(outputDir, 'index.html'), html, 'utf-8');
    written += 1;
  }

  await writeSitemap();

  // GitHub Pages phục vụ 404.html cho đường dẫn không khớp file nào.
  // Trả về trang chủ tiếng Việt để SPA vẫn khởi động được.
  await fs.copyFile(path.join(DIST, 'index.html'), path.join(DIST, '404.html'));

  console.log(`Đã sinh ${written} trang + sitemap.xml + 404.html`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
```

Lưu ý: vòng lặp ghi cả route `vi/cover` với `path` là `/`, nên `dist/index.html` do Vite sinh sẽ **bị ghi đè** bằng bản có nội dung tĩnh. Đó là ý đồ. `readAssets()` chạy **trước** vòng lặp nên vẫn đọc được bản gốc của Vite.

- [ ] **Step 2: Nối vào build**

Sửa `scripts.build` trong `package.json`:

```json
"build": "vite build && tsx scripts/prerender/index.ts && esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs"
```

- [ ] **Step 3: Xoá sitemap tĩnh**

```bash
git rm public/sitemap.xml
```

Từ nay sinh tự động với đủ 60 URL. Giữ lại `public/robots.txt` — nó đã trỏ đúng `https://gift.luclam.vn/sitemap.xml`.

- [ ] **Step 4: Gỡ khối tĩnh sau khi React mount**

Thêm effect vào `src/App.tsx`, cạnh effect `popstate` ở Task 9:

```tsx
useEffect(() => {
  // Khối tĩnh phục vụ crawler. Gỡ sau khi React đã render để không hiện hai lần.
  document.getElementById('static-content')?.remove();
}, []);
```

Effect chạy sau lần paint đầu tiên của React, nên không có khoảnh khắc trang trống.

- [ ] **Step 5: Chạy build và kiểm chứng**

Run:
```bash
npm run build
```
Expected: exit 0, dòng cuối in `Đã sinh 60 trang + sitemap.xml + 404.html`

```bash
find dist -name index.html | wc -l
```
Expected: `60`

```bash
sed 's/<[^>]*>/ /g' dist/en/food/index.html | tr -s ' \n' ' \n' | wc -w
```
Expected: lớn hơn `300` (trước đây là 79 từ, chỉ tiếng Việt)

```bash
grep -c "hreflang=" dist/ja/transport/index.html
```
Expected: `7`

```bash
grep -o '<link rel="canonical" href="[^"]*"' dist/ja/transport/index.html
```
Expected: `<link rel="canonical" href="https://gift.luclam.vn/ja/transport/"`

```bash
grep -c "<loc>" dist/sitemap.xml
```
Expected: `10`

```bash
grep -c "xhtml:link" dist/sitemap.xml
```
Expected: `60`

- [ ] **Step 6: Kiểm chứng trong trình duyệt**

```bash
npx vite preview
```

Mở `/en/food/`, tắt JavaScript trong DevTools, tải lại. Nội dung ẩm thực tiếng Anh phải hiện đầy đủ. Bật lại JavaScript, tải lại — SPA tiếp quản, không hiện hai lần nội dung.

- [ ] **Step 7: Commit**

```bash
git add scripts/prerender/index.ts package.json src/App.tsx
git rm --cached public/sitemap.xml 2>/dev/null || true
git commit -m "Generate 60 static pages, sitemap and 404 at build time

Server HTML went from 79 Vietnamese words to full content in all six
languages, each on its own URL with its own canonical and hreflang set.
The SPA removes the static block after mount instead of hydrating over
it, since the markup shapes differ by design.

Closes the render, hreflang and deep-link items.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 13: Script kiểm chứng đầu ra và nối vào CI

Bộ sinh tĩnh dễ hỏng âm thầm — thêm một chủ đề mà quên slug, hoặc đổi cấu trúc `translations.ts` là số trang tụt xuống mà build vẫn exit 0.

**Files:**
- Create: `scripts/verify-output.ts`
- Modify: `package.json` (script `verify`)
- Modify: `.github/workflows/deploy-pages.yml` (chạy verify sau build)

**Interfaces:**
- Consumes: `ALL_ROUTES` từ `src/routes.ts`, thư mục `dist/`
- Produces: exit 1 kèm thông báo cụ thể khi đầu ra sai

- [ ] **Step 1: Viết script**

Create `scripts/verify-output.ts`:

```ts
import fs from 'fs/promises';
import path from 'path';
import { ALL_ROUTES } from '../src/routes';

const DIST = path.join(process.cwd(), 'dist');
const MIN_WORDS = 150;

const failures: string[] = [];

function check(condition: boolean, message: string) {
  if (!condition) failures.push(message);
}

function wordCount(html: string): number {
  const body = html.split('<body>')[1] ?? html;
  return body
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<[^>]*>/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
}

async function main() {
  for (const route of ALL_ROUTES) {
    const file = path.join(DIST, route.path, 'index.html');
    let html: string;

    try {
      html = await fs.readFile(file, 'utf-8');
    } catch {
      failures.push(`Thiếu trang: ${route.path}`);
      continue;
    }

    const label = `${route.lang}/${route.topic}`;
    const canonicalMatches = html.match(/<link rel="canonical" href="([^"]+)"/g) ?? [];
    const hreflangCount = (html.match(/hreflang=/g) ?? []).length;
    const words = wordCount(html);

    check(canonicalMatches.length === 1, `${label}: cần đúng 1 canonical, thấy ${canonicalMatches.length}`);
    check(
      html.includes(`href="https://gift.luclam.vn${route.path}"`),
      `${label}: canonical không trỏ chính nó`
    );
    check(hreflangCount === 7, `${label}: cần 7 hreflang, thấy ${hreflangCount}`);
    check(words >= MIN_WORDS, `${label}: chỉ ${words} từ, tối thiểu ${MIN_WORDS}`);
    check(!html.includes('telephone'), `${label}: JSON-LD có trường telephone — mục #7 chưa được xác nhận`);
  }

  const sitemap = await fs.readFile(path.join(DIST, 'sitemap.xml'), 'utf-8');
  const alternates = (sitemap.match(/xhtml:link/g) ?? []).length;
  check(alternates === 60, `sitemap: cần 60 thẻ alternate, thấy ${alternates}`);

  if (failures.length > 0) {
    console.error(`Kiểm chứng thất bại (${failures.length} lỗi):`);
    for (const failure of failures) console.error(`  - ${failure}`);
    process.exit(1);
  }

  console.log(`Kiểm chứng đạt: ${ALL_ROUTES.length} trang, sitemap đủ alternate.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
```

- [ ] **Step 2: Thêm npm script**

```json
"verify": "tsx scripts/verify-output.ts"
```

- [ ] **Step 3: Chứng minh script bắt được lỗi thật (red-green)**

Xoá tạm một trang rồi chạy verify — nó phải thất bại:

```bash
npm run build
rm dist/en/food/index.html
npm run verify
```
Expected: exit 1, in `- Thiếu trang: /en/food/`

Sinh lại rồi chạy lại — phải đạt:

```bash
npm run build && npm run verify
```
Expected: exit 0, in `Kiểm chứng đạt: 60 trang, sitemap đủ alternate.`

Bước này bắt buộc. Một script kiểm chứng chưa từng thất bại là một script chưa được kiểm chứng.

- [ ] **Step 4: Nối vào CI**

Trong `.github/workflows/deploy-pages.yml`, thêm bước sau `- name: Build`:

```yaml
      - name: Verify generated output
        run: npm run verify
```

- [ ] **Step 5: Commit**

```bash
git add scripts/verify-output.ts package.json .github/workflows/deploy-pages.yml
git commit -m "Verify the generated output in CI

Asserts all 60 pages exist with one self-referencing canonical, seven
hreflang tags and real content, and that no telephone field slipped into
the JSON-LD. A silent drop from 60 pages to 3 would otherwise still
exit 0.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 14: Sửa fallback SPA của server production

`server.ts:101-103` trả `dist/index.html` cho **mọi** đường dẫn. Sau khi có 60 file tĩnh, điều đó nghĩa là VPS phục vụ sai trang: `/en/food/` sẽ nhận HTML tiếng Việt của trang bìa.

**Files:**
- Modify: `server.ts:98-104`

**Interfaces:**
- Consumes: đầu ra của Task 12
- Produces: không có

- [ ] **Step 1: Ưu tiên file tĩnh, chỉ fallback khi không có**

```ts
  } else {
    const distPath = path.join(process.cwd(), "dist");

    // extensions: ['html'] để /en/food/ khớp dist/en/food/index.html
    app.use(express.static(distPath, { extensions: ["html"] }));

    app.get("*", (req, res) => {
      // Đường dẫn không khớp file tĩnh nào: trả 404.html để mã trạng thái
      // trung thực. Trả index.html với mã 200 chính là lỗi soft-404 mà
      // mục #4 của bản đánh giá đã nêu.
      res.status(404).sendFile(path.join(distPath, "404.html"));
    });
  }
```

- [ ] **Step 2: Kiểm chứng**

```bash
npm run build
NODE_ENV=production ADMIN_TOKEN=dev node dist/server.cjs
```

Terminal khác:
```bash
curl -s http://localhost:3000/en/food/ | grep -o '<link rel="canonical" href="[^"]*"'
```
Expected: `<link rel="canonical" href="https://gift.luclam.vn/en/food/"`

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/khong-ton-tai/
```
Expected: `404`

- [ ] **Step 3: Commit**

```bash
git add server.ts
git commit -m "Serve the generated pages instead of always sending index.html

The catch-all returned dist/index.html for every path, so /en/food/ got
the Vietnamese cover page. Static files now win, and unmatched paths get
a real 404 rather than a soft-404 200.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

# Phase 4 — Kéo ảnh hotlink về

---

### Task 15: Tải ảnh và ghi credit

63 ảnh: 45 Unsplash (35 ở `defaultMedia.ts`, 10 ở `translations.ts`) và 18 Wikimedia (`config.json`). Giữ nguyên 30 URL hstatic và 8 video Mixkit.

**Files:**
- Create: `scripts/fetch-external-media.ts`
- Create: `public/uploads/external/CREDITS.json` (do script sinh)

**Interfaces:**
- Consumes: URL trong `src/defaultMedia.ts`, `src/translations.ts`, `public/config.json`
- Produces: file ảnh trong `public/uploads/external/`, bản đồ URL cũ → đường dẫn mới trong `CREDITS.json`

- [ ] **Step 1: Viết script tải**

Create `scripts/fetch-external-media.ts`:

```ts
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

const OUTPUT_DIR = path.join(process.cwd(), 'public', 'uploads', 'external');
const SOURCES = [
  path.join(process.cwd(), 'src', 'defaultMedia.ts'),
  path.join(process.cwd(), 'src', 'translations.ts'),
  path.join(process.cwd(), 'public', 'config.json'),
];

// Chỉ hai host này. hstatic là hạ tầng nhà, mixkit là video giữ hotlink có chủ đích.
const TARGET_HOSTS = /https:\/\/(images\.unsplash\.com|upload\.wikimedia\.org)\/[^"'\s)]+/g;

type Credit = {
  originalUrl: string;
  localPath: string;
  host: string;
  license: string;
  attribution: string;
};

function fileNameFor(url: string): string {
  const hash = crypto.createHash('sha1').update(url).digest('hex').slice(0, 10);
  const guessedExt = (url.match(/\.(jpe?g|png|webp|avif)/i) ?? ['.jpg'])[0].split('?')[0];
  return `${hash}${guessedExt}`;
}

function licenseFor(host: string): string {
  if (host === 'images.unsplash.com') return 'Unsplash License';
  return 'Xem trang mô tả trên Wikimedia Commons — thường là CC BY-SA';
}

async function main() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const urls = new Set<string>();
  for (const source of SOURCES) {
    const content = await fs.readFile(source, 'utf-8');
    for (const match of content.matchAll(TARGET_HOSTS)) urls.add(match[0]);
  }

  console.log(`Tìm thấy ${urls.size} URL cần kéo về.`);

  const credits: Credit[] = [];
  let failed = 0;

  for (const url of urls) {
    const host = new URL(url).host;
    const fileName = fileNameFor(url);
    const target = path.join(OUTPUT_DIR, fileName);

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const buffer = Buffer.from(await response.arrayBuffer());
      await fs.writeFile(target, buffer);

      credits.push({
        originalUrl: url,
        localPath: `/uploads/external/${fileName}`,
        host,
        license: licenseFor(host),
        attribution: '',
      });

      console.log(`  ✓ ${fileName}  (${(buffer.length / 1024).toFixed(0)}KB)  ${host}`);
    } catch (error) {
      failed += 1;
      console.error(`  ✗ ${url}: ${(error as Error).message}`);
    }
  }

  await fs.writeFile(
    path.join(OUTPUT_DIR, 'CREDITS.json'),
    JSON.stringify(credits, null, 2),
    'utf-8'
  );

  console.log(`\nĐã tải ${credits.length} ảnh, lỗi ${failed}.`);
  console.log('CREDITS.json đã sinh — cần điền tay trường "attribution" cho ảnh Wikimedia.');

  if (failed > 0) process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
```

- [ ] **Step 2: Chạy và kiểm chứng**

Run:
```bash
npx tsx scripts/fetch-external-media.ts
```
Expected: in `Tìm thấy 63 URL cần kéo về.` rồi 63 dòng `✓`, kết thúc `Đã tải 63 ảnh, lỗi 0.`

Nếu có dòng `✗`, ghi lại URL hỏng — đó là ảnh đã chết ở nguồn, cần thay bằng ảnh khác chứ không phải lỗi script.

```bash
ls public/uploads/external/*.jpg public/uploads/external/*.png 2>/dev/null | wc -l
```
Expected: `63`

- [ ] **Step 3: Điền attribution cho ảnh Wikimedia**

Với mỗi bản ghi có `host` là `upload.wikimedia.org` trong `CREDITS.json`, mở trang mô tả trên Wikimedia Commons, chép tên tác giả và giấy phép chính xác vào trường `attribution`, ví dụ:

```json
{
  "originalUrl": "https://upload.wikimedia.org/wikipedia/commons/...",
  "localPath": "/uploads/external/a1b2c3d4e5.jpg",
  "host": "upload.wikimedia.org",
  "license": "CC BY-SA 4.0",
  "attribution": "Ảnh: Nguyễn Văn A, CC BY-SA 4.0, qua Wikimedia Commons"
}
```

Nghĩa vụ ghi nguồn của CC BY-SA đi theo tấm ảnh chứ không theo nơi host — tự host mà thiếu credit thì vi phạm vẫn nguyên như khi hotlink.

- [ ] **Step 4: Tối ưu ảnh vừa tải**

```bash
npm run images
```

Script từ Task 6 chỉ quét `public/uploads/`, không quét thư mục con. Sửa `scripts/optimize-images.ts`, đổi dòng đọc thư mục:

```ts
const entries = await fs.readdir(UPLOADS, { recursive: true }) as string[];
```

Rồi chạy lại.

- [ ] **Step 5: Commit**

```bash
git add scripts/fetch-external-media.ts scripts/optimize-images.ts public/uploads/external
git commit -m "Pull hotlinked images onto our own hosting

63 images from Unsplash and Wikimedia now live in public/uploads/external
with a CREDITS.json recording source, licence and attribution.

hstatic URLs stay: confirmed as Lục Lam's own Haravan store. Mixkit
videos stay hotlinked deliberately — too heavy to vendor.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 16: Thay URL trong nguồn và hiển thị credit

**Files:**
- Create: `scripts/rewrite-media-urls.ts`
- Modify: `src/defaultMedia.ts`, `src/translations.ts`, `public/config.json` (do script sửa)
- Modify: `src/components/PlaceDetailModal.tsx` (hiển thị credit)

**Interfaces:**
- Consumes: `CREDITS.json` từ Task 15
- Produces: không còn URL Unsplash/Wikimedia trong mã nguồn

- [ ] **Step 1: Viết script thay thế**

Create `scripts/rewrite-media-urls.ts`:

```ts
import fs from 'fs/promises';
import path from 'path';

type Credit = { originalUrl: string; localPath: string };

const CREDITS = path.join(process.cwd(), 'public', 'uploads', 'external', 'CREDITS.json');
const TARGETS = [
  path.join(process.cwd(), 'src', 'defaultMedia.ts'),
  path.join(process.cwd(), 'src', 'translations.ts'),
  path.join(process.cwd(), 'public', 'config.json'),
];

async function main() {
  const credits: Credit[] = JSON.parse(await fs.readFile(CREDITS, 'utf-8'));
  let totalReplacements = 0;

  for (const target of TARGETS) {
    let content = await fs.readFile(target, 'utf-8');
    let fileReplacements = 0;

    for (const credit of credits) {
      const before = content;
      content = content.split(credit.originalUrl).join(credit.localPath);
      if (content !== before) fileReplacements += 1;
    }

    await fs.writeFile(target, content, 'utf-8');
    totalReplacements += fileReplacements;
    console.log(`  ${path.basename(target)}: ${fileReplacements} URL đã thay`);
  }

  console.log(`Tổng ${totalReplacements} URL đã thay.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
```

- [ ] **Step 2: Chạy**

```bash
npx tsx scripts/rewrite-media-urls.ts
```
Expected: tổng cộng 63 URL đã thay.

- [ ] **Step 3: Hiển thị credit trong modal chi tiết địa điểm**

Ảnh Wikimedia bắt buộc phải hiện credit ở nơi ảnh xuất hiện. Thêm vào `src/components/PlaceDetailModal.tsx`, ngay dưới thẻ ảnh hero:

```tsx
{creditFor(resolvedImg) && (
  <p className="absolute bottom-1 right-2 text-[9px] text-white/70 bg-black/40 px-1.5 py-0.5 rounded">
    {creditFor(resolvedImg)}
  </p>
)}
```

Và một helper nhỏ ở đầu file:

```tsx
import credits from '../../public/uploads/external/CREDITS.json';

function creditFor(localPath: string | undefined): string | null {
  if (!localPath) return null;
  const entry = (credits as Array<{ localPath: string; attribution: string }>).find(
    (item) => item.localPath === localPath
  );
  return entry?.attribution || null;
}
```

- [ ] **Step 4: Kiểm chứng**

Run:
```bash
grep -rc "images.unsplash.com" src/ ; grep -c "upload.wikimedia.org" public/config.json
```
Expected: cả hai ra `0`.

```bash
grep -rc "cdn.hstatic.net" src/translations.ts
```
Expected: `30` — vẫn nguyên, đúng như đã chốt.

```bash
grep -c "assets.mixkit.co" src/defaultMedia.ts
```
Expected: `8` — video giữ hotlink có chủ đích.

```bash
npm run lint && npm run build && npm run verify
```
Expected: cả ba exit 0

- [ ] **Step 5: Commit**

```bash
git add scripts/rewrite-media-urls.ts src/defaultMedia.ts src/translations.ts public/config.json src/components/PlaceDetailModal.tsx
git commit -m "Point media at our own hosting and show attribution

All 63 Unsplash and Wikimedia URLs now resolve locally. The place detail
modal renders the attribution string from CREDITS.json, which CC BY-SA
requires wherever the image appears.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

## Đối chiếu cuối cùng với bản đánh giá

Sau Task 16, chạy một lượt kiểm toàn bộ:

```bash
npm run lint && npm run build && npm run verify
find dist -name index.html | wc -l          # 60
du -sh public/uploads                        # giảm rõ rệt so với 7.1M ban đầu
grep -c "<h1" src/App.tsx                    # 1
grep -rc "images.unsplash.com" src/          # 0
```

| Mục | Trạng thái sau plan | Task |
|---|---|---|
| #1 onError | Đóng | 2 |
| #2 render client-side | Đóng | 10, 12 |
| #3 hreflang | Đóng | 11, 12 |
| #5 deep link | Đóng | 9 |
| #6 ảnh nặng | Đóng | 6, 7 |
| #7 số điện thoại | **Còn treo** — chờ Lục Lam | — |
| #8 BreadcrumbList + FAQ | Đóng | 11 |
| #10 ngôn ngữ mặc định | Đóng | 4 |
| #11 hotlink | Đóng | 15, 16 |
| #12 kích thước ảnh | Đóng | 2, 3 |
| #14 hai h1 | Đóng | 4 |
| API không xác thực | Đóng | 1, 2 |
| Rác repo | Đóng | 5 |
| Scope Google Drive | **Ngoài phạm vi** — cần xác nhận tính năng nào cần | — |
