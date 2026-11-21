# AI4Rad Lab 统一视觉形象识别系统（VI）规范 v2.0

> 适用范围：上海交通大学医学院附属第六人民医院放射介入科 · 上海交通大学影像医学研究所 · **AI4Rad 医学影像人工智能实验室（AI4Radiology Lab）** 官方网站、学术汇报（PPT / LaTeX Beamer）、会议海报、开源仓库（GitHub）、新媒体（公众号 / 小红书）及多中心临床研究文档。

---

## 1. 品牌核心符号与视觉寓意（Brand Symbolism）

AI4Rad 实验室主徽标以**定量医学影像设备几何学**与**六院放射介入科两大标杆临床亚专科**为核心视觉基因，全部采用无外部字体依赖的纯矢量贝塞尔路径（Pure `<path>` SVG）精密绘制：

1. **外环 · 四象限 CT/MRI 扫描机架与极坐标刻度环（Scanner Gantry & Calibration Ring）**
   - 外环由正交十字准星切分为四象限机架圆弧，内嵌 `6° / 30°` 极坐标扫描刻度环，象征高场强 MRI、高端多排 CT 与 DSA 精密物理成像及定量测量。
   - 左半环采用**六院医疗青（`#008E9B`）**，右半环采用**学术深海蓝（`#0A3A7E`）**，体现临床医学与信息工程的双轮驱动。
2. **左半球 · 脑皮层与神经血管图网络（Neurovascular & Multimodal AI）**
   - 以几何化大脑皮层脑回轮廓结合神经网络/血管拓扑节点（Graph Nodes & Edges），代表科室享誉国内的心脑血管与卒中神经影像、神经介入诊疗，以及视觉基础模型与多模态大语言模型推理。
3. **右半球 · 骨肌膝关节与三维有限元/骨小梁网格（Musculoskeletal & Spatial Simulation）**
   - 以股骨远端髁部、胫骨平台与腓骨头的雕塑感轮廓，叠合三维测地线三角网格与骨小梁微结构线网（采用 SVG `<mask>` 真透明镂空工艺），代表全国标杆级骨肌系统影像诊断，以及三维空间智能、超分辨重建与生物力学/血流动力学物理仿真。
4. **赤道核心字标 · `AI4R` 与底座组合（`AI4Radiology · SSPH · SJTU`）**
   - 中央赤道留白带承载高对比度几何字标 **`AI4R`**：`A` 与 `4` 为学术墨蓝（`#0B2D5C`），`I` 为六院医疗青（`#008E9B`），**`R` 为交大红 / 动脉介入红（`#B81D35`）**——既致敬上海交通大学校色基因，又呼应放射介入科动脉血管造影与微创介入特色。
   - 底部主字标 `AI4Radiology` 将数字 `4` 以医疗青高亮，下方配以双横线修饰的机构缩写 `SSPH · SJTU`。

---

## 2. 三级光学字号响应式徽标体系（Optical Size Hierarchy）

为彻底解决传统单一栅格图在小尺寸下细节糊连、深色背景下反差不足的问题，VI v2.0 建立了**三级光学字号（Optical Sizing）**矢量矩阵，全部存放于 `images/brand/` 与 `images/brand/vi/`：

| 级别 | 资产名称 | 文件路径（SVG / 2x PNG） | 适用尺寸 | 结构特征与使用场景 |
| :--- | :--- | :--- | :--- | :--- |
| **L1 · 标准主徽标**<br>*Primary Emblem* | 竖版全要素主徽标（浅色 / 深色） | `images/brand/team-logo.svg`<br>`images/brand/team-logo-dark.svg`<br>`images/brand/team-logo.png`<br>`images/brand/vi/logo-emblem-light.svg`<br>`images/brand/vi/logo-emblem-dark.svg` | `≥ 96 px` | 含完整 `6°` 机架刻度、骨小梁细节、`AI4Radiology` 与 `SSPH · SJTU` 底座。用于官网首屏、页脚、小红书封面、海报与宣传册封面。 |
| **L2 · 紧凑图形标**<br>*Compact Mark* | `1:1` 纯圆图形标（浅色 / 深色） | `images/brand/vi/logo-mark-light.svg`<br>`images/brand/vi/logo-mark-dark.svg`<br>`images/brand/vi/logo-mark-light.png`<br>`images/brand/vi/logo-mark-dark.png` | `28 – 95 px` | 去除底部小字，加粗机架环与解剖轮廓，仅保留 `30°` 主刻度并放大 `AI4R`。用于网站顶部导航栏（`34–38 px`）、GitHub 组织头像、社交媒体圆形头像。 |
| **L3 · 微尺寸图标**<br>*Micro Favicon* | 浏览器标签与桌面图标 | `images/brand/vi/favicon.svg`<br>`images/brand/vi/favicon-64.png`<br>`images/brand/vi/apple-touch-icon.png` | `16 – 32 px` | 圆角白底衬牌 + 超粗四象限青蓝环 + 超大号 `AI4R`，省略细微网格，确保在 `16×16` 浏览器标签栏中依然清晰锐利。 |
| **L4 · 中英横版联合标**<br>*Horizontal Lockup* | 中文横版 / 英文横版（浅色 / 深色） | `images/brand/vi/logo-horizontal-cn.svg`<br>`images/brand/vi/logo-horizontal-cn-dark.svg`<br>`images/brand/vi/logo-horizontal-en.svg`<br>`images/brand/vi/logo-horizontal-en-dark.svg` | 高度 `≥ 44 px` | 左侧图形标 + 分隔线 + 实验室中英文全称及依托单位（六院放射介入科 · 交大影像医学研究所）。用于学术 PPT / Beamer 页眉、学术海报刊头、公文信头与 GitHub README 顶部。 |
| **L5 · 单色学术印章**<br>*Monochrome Stamp* | 单色墨蓝版 / 反白全透明版 | `images/brand/vi/logo-mono-ink.svg`<br>`images/brand/vi/logo-mono-white.svg` | `≥ 64 px` | 纯单色全透明镂空矢量，用于深色摄影背景叠加、激光刻印、会议胸牌及单色印刷品。 |

---

## 3. 标准色彩系统（Official Color Palette）

### 3.1 品牌主色（Light Mode 标准色）

| 色彩名称 | HEX | RGB | CMYK（印刷参考） | 视觉角色与使用规范 |
| :--- | :--- | :--- | :--- | :--- |
| **六院医疗青 · SSPH Teal** | `#008E9B` | `0, 142, 155` | `C88 M15 Y32 K0` | 主品牌色：徽标左环、神经图网络、导航激活态、核心强调元素 |
| **学院深海蓝 · Academic Navy** | `#0A3A7E` | `10, 58, 126` | `C96 M76 Y10 K8` | 第二主色：徽标右环、骨肌与三维网格、链接悬停态 |
| **交大/动脉红 · Arterial Crimson** | `#B81D35` | `184, 29, 53` | `C18 M96 Y72 K6` | 点睛强调色：徽标 `R` 字母、重点奖项标签（面积控制在 `< 10%`） |
| **学术墨蓝 · Deep Ink** | `#0B2D5C` | `11, 45, 92` | `C98 M82 Y28 K26` | 标准字标色：`AI4Radiology` 主文字、一级标题深色强调 |
| **次级岩灰 · Institutional Slate** | `#445B73` | `68, 91, 115` | `C68 M48 Y32 K12` | 辅助文字色：`SSPH · SJTU` 副标、机构全称说明 |

### 3.2 原生深色模式色板（Dark Mode — `#0B1418` 基底）

在深色界面下，**严禁给透明 Logo 强行套白底方框**，应直接调用 `-dark.svg` 原生深色资产（对比度均达 WCAG AA/AAA 标准）：

| 角色 | 深色模式 HEX | 说明 |
| :--- | :--- | :--- |
| **提亮医疗青 · Luminous Teal** | `#2AD0C3` | 深色背景左环与神经图网络（对比度 `10.4 : 1`） |
| **提亮学院蓝 · Luminous Azure** | `#5EA6FA` | 深色背景右环与骨肌三维网格（对比度 `7.8 : 1`） |
| **提亮珊瑚红 · Coral Crimson** | `#F54E67` | 深色背景 `R` 字母点睛色（对比度 `5.7 : 1`） |
| **冰蓝白字标 · Ice Ink** | `#EEF7F6` / `#E6F1FF` | 深色背景 `A`、`4` 及 `AI4Radiology` 主文字 |

---

## 4. 版式与字体规范（Typography）

1. **徽标内部字形**：所有官方 SVG 徽标内的中英文字符均已通过 `Inter`（Variable `550–840`）与 `Hiragino Sans GB` 转曲为纯几何 `<path>`，在任何操作系统、浏览器 `<img>` 标签、Illustrator、LaTeX 与打印输出中保证 **100% 零字体缺失与像素级一致**。
2. **网页与排版配套字体**：
   - **英文展示标题**：`Newsreader`（学术期刊衬线体，自托管 WOFF2）
   - **中文展示标题**：`Songti SC` / `Noto Serif SC` / `STSong`（典雅学术宋体）
   - **正文与界面 UI**：`Inter`（自托管 WOFF2）+ `PingFang SC` / `Hiragino Sans GB` / `Microsoft YaHei`

---

## 5. 安全间距与禁用规范（Clear Space & Misuse Rules）

- **最小安全留白（Clear Space）**：徽标四周应保留不少于圆环直径 **`0.15 D`** 的净空区域，不得紧贴页面裁切线或其他密集文字。
- **与依托单位院徽/校徽并列规范**：
  - AI4Rad 实验室徽标代表课题组/实验室层级，**不替代**上海市第六人民医院院徽（`ssph-med-logo.svg`）与上海交通大学校徽（`sjtu-logo-zh.svg` / `sjtu-logo-en.svg`）。
  - 在学术海报与页脚联合展示时，实验室标识与医院/学校徽标应分层或以 `1px` 竖向分隔线清晰区隔，保持各自原始长宽比。
- **五项严禁行为**：
  1. 严禁非等比拉伸、压扁或旋转徽标；
  2. 严禁在 `32 px` 以下小尺寸强行使用带底座小字的竖版全要素徽标（应改用 `logo-mark` 或 `favicon`）；
  3. 严禁在深色背景上直接放置浅色模式深蓝字标，或给透明徽标包裹突兀的白底补丁（应切换 `-dark.svg` 或 `logo-mono-white.svg`）；
  4. 严禁私自更改青、蓝、红三色的位置对应关系（左青神经、右蓝骨肌、红 `R`）；
  5. 严禁为徽标添加廉价立体浮雕、霓虹外发光或高饱和彩虹渐变。

---

*版本：VI v2.0（2026-11 全面矢量重构版）*
