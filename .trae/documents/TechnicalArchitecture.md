## 1. 架构设计

纯前端静态架构，零后端服务，所有计算在浏览器完成，可免费托管于 Cloudflare Pages / Vercel / Netlify。

```mermaid
flowchart TD
    "用户浏览器" --> "React 单页应用"
    "React 单页应用" --> "路由层 React Router"
    "路由层 React Router" --> "工具首页"
    "路由层 React Router" --> "关于页"
    "路由层 React Router" --> "隐私政策页"
    "工具首页" --> "时间转换核心模块"
    "时间转换核心模块" --> "原生 Intl API 时区处理"
    "时间转换核心模块" --> "剪贴板 API"
    "React 单页应用" --> "i18n 双语切换层"
    "React 单页应用" --> "主题切换 Context"
    "React 单页应用" --> "静态资源 CDN 托管"
    "静态资源 CDN 托管" --> "Google AdSense 脚本（流量达标后接入）"
```

## 2. 技术说明
- **前端框架**：React@18 + TypeScript@5
- **构建工具**：Vite@5（vite-init 初始化）
- **样式方案**：Tailwind CSS@3 + CSS 变量（实现主题切换）
- **路由**：React Router@6（HashRouter 模式，兼容纯静态托管）
- **i18n**：自建轻量 Context 方案（中/英两份 JSON 字典，避免引入重依赖）
- **字体**：Google Fonts 加载 `Outfit`、`JetBrains Mono`、`Noto Sans SC`
- **图标**：`lucide-react` 线性图标库
- **后端**：无
- **数据库**：无
- **外部服务**：Google AdSense（流量达标后接入，仅脚本标签）
- **部署**：Cloudflare Pages（首选，全球 CDN + 免费额度充足）

## 3. 路由定义
| 路由 | 用途 |
|-------|---------|
| `/` | 工具首页：实时时钟 + 时间戳互转 + 时区矩阵 + 批量转换 + 知识卡片 |
| `/about` | 关于页：产品定位与技术说明 |
| `/privacy-policy` | 隐私政策页：AdSense 合规必备 |
| `*` | 404 兜底页 |

## 4. SEO 与变现接入设计

### 4.1 SEO 配置
- 每路由独立 `<title>` / `<meta description>`（中英双语版）
- 首页注入 `WebApplication` 结构化数据 JSON-LD
- 生成 `sitemap.xml` 与 `robots.txt`
- 关键内容预渲染（Vite 静态生成时已天然 SSR 友好）
- 中英双语通过 `hreflang` 标注

### 4.2 AdSense 接入预留
- 首页预留 2 个广告位容器（顶部横幅 + 侧栏/卡片间），初版空置
- 流量达标后插入 AdSense 脚本与单位代码即可激活

## 5. 目录结构

```
timeforge/
├── public/
│   ├── robots.txt
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── layout/          # Navbar / Footer / Layout
│   │   ├── tool/            # 工具首页各模块组件
│   │   └── ui/              # 通用 UI 原子组件
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── About.tsx
│   │   ├── Privacy.tsx
│   │   └── NotFound.tsx
│   ├── i18n/
│   │   ├── zh.ts
│   │   ├── en.ts
│   │   └── index.tsx        # i18n Provider
│   ├── lib/
│   │   ├── time.ts          # 时间转换核心函数
│   │   └── timezone.ts      # 时区数据
│   ├── context/
│   │   └── ThemeContext.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## 6. 核心工具函数设计

```typescript
// src/lib/time.ts 关键签名
type TimestampUnit = 'seconds' | 'milliseconds';

// 自动识别秒/毫秒并返回规范化时间戳
function normalizeTimestamp(input: number | string): { value: number; unit: TimestampUnit };

// 时间戳转多时区可读日期
function timestampToTimezones(ts: number, unit: TimestampUnit, zones: string[]): TimeZoneResult[];

// 日期+时区转时间戳
function dateToTimestamp(date: Date, timezone: string): { seconds: number; milliseconds: number };

// 相对时间加减
function shiftTime(base: Date, delta: TimeDelta): Date;

// 批量转换
function batchConvert(input: string): BatchResult[];
```

## 7. 性能与可访问性
- 字体使用 `font-display: swap` 避免阻塞
- 图标按需引入，避免打包冗余
- 关键交互元素提供 `aria-label`（双语切换时同步更新）
- 颜色对比度满足 WCAG AA（深底浅字 ≥ 4.5:1）
- 键盘可完整操作所有工具，复制按钮支持 Enter 触发
