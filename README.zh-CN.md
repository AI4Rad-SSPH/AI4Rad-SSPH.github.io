<p align="center">
  <strong>中文</strong> &nbsp;·&nbsp; <a href="README.md">🌐 English</a>
</p>

<div align="center">

<img src="images/brand/team-logo.png" alt="AI4Rad Lab" width="140">

# AI4Rad Lab · 医学影像人工智能

**医学影像人工智能实验室**<br>
上海交通大学医学院附属第六人民医院 放射介入科 ·
上海交通大学医学院

<h3>🌐 <a href="https://ai4rad-ssph.github.io/">ai4rad-ssph.github.io</a></h3>

<img src="ai4rad_home_light_v2.png" alt="AI4Rad Lab 首页" width="880">

[![Website](https://img.shields.io/badge/网站-已上线-0d9488?style=flat-square)](https://ai4rad-ssph.github.io/)
[![Publications](https://img.shields.io/badge/实验室论文-33-0d9488?style=flat-square)](https://ai4rad-ssph.github.io/publications_ch.html)
[![Team](https://img.shields.io/badge/团队-30人-0d9488?style=flat-square)](https://ai4rad-ssph.github.io/team_ch.html)
[![License](https://img.shields.io/badge/许可证-MIT-0d9488?style=flat-square)](LICENSE)

</div>

---

**AI4Rad 实验室**官方网站——上海交通大学医学院附属第六人民医院放射介入科的医学影像人工智能研究团队。

我们致力于让 AI 真正服务于临床放射——从血管分割、灌注分析到大规模疾病诊断与报告自动生成。核心临床方向为**泛血管影像**（脑血管、心脏与冠脉、外周血管）与**骨肌系统影像**，并辐射更广泛的放射影像应用，推动医学 AI 的**临床转化**。

## 🔬 研究方向

我们的研究建立在四类核心 AI 技术能力之上，服务于团队的七大临床影像方向。

- **视觉基础模型**：医学影像的视觉表征与结构化理解——诊断、分割、检测与定量。
- **多模态大语言模型**：融合影像、报告、病史与知识库，用于诊断推理与结构化报告。
- **影像生成**：面向临床价值的图像生成、修复、去噪与增强，含跨模态合成。
- **空间智能与物理仿真**：三维建模、配准、血流与骨肌力学仿真，以及可解释定量分析。

## ⭐ 代表性项目

| 项目 | 期刊 | 链接 |
|---|---|---|
| **HR-LLM-Stroke** — 面向急诊卒中治疗推荐的多智能体大语言模型框架 | 《医学互联网研究杂志》, 2026 | [论文](https://doi.org/10.2196/96304) · [代码](https://github.com/FrankZhangRp/HR-LLM-Stroke) · [演示](https://frankzhangrp.github.io/HR-LLM-Stroke/) |
| **BrainMIND** — 多中心基准与读片研究，评测 10 个大语言模型从脑 MRI 报告生成诊断印象的能力 | 《npj 数字医学》, 2026 | [论文](https://www.nature.com/articles/s41746-026-02380-4) · [代码](https://github.com/FrankZhangRp/BrainMIND) |
| **LumbarSR** — 配对临床 CT 与显微 CT 的腰椎超分辨率数据集 | 《科学数据》, 2026 | [挑战赛](https://github.com/FrankZhangRp/LumbarSR-Challenge) |
| **脑血管与卒中 AI** — 动脉瘤检测、ASPECTS 评分、血栓表征 | 《Radiology》/《European Radiology》 | — |

> 完整论文列表见 **[Publications](https://ai4rad-ssph.github.io/publications_ch.html)**。

## 🏗️ 仓库结构

```
.
├── index.html / index_ch.html        # 首页（英文 / 中文）
├── about.html / about_ch.html         # 关于（使命与愿景）
├── team.html  / team_ch.html          # 团队页（读取 data/team.json 渲染）
├── publications.html / _ch.html       # 可筛选的论文列表（实验室论文）
├── contact.html / _ch.html            # 联系页
├── members/
│   └── index.html                     # 共用成员主页模板（?id=<id>&lang=cn）
├── css/style.css                      # 样式、暗色模式、2K/4K 响应式
├── js/
│   ├── main.js                        # 主题切换、滚动动画、团队渲染
│   └── pub.js                         # 论文卡片渲染 + 筛选 + 作者超链接
├── data/
│   ├── team.json                      # 团队花名册（PI 维护，30 人）
│   ├── members/<id>.json              # 每人一个文件（由本人维护）
│   ├── publications/<paper-id>.json   # 每篇论文一个文件 + 自动生成的 manifest.json
│   └── members/_template.json         # 复制以创建你自己的页面
├── tools/build-pubs.py                # 重建论文索引（校验字段）
├── images/
│   ├── brand/                         # 实验室 logo + 六院/交大 logo
│   ├── members/                       # 成员照片
│   └── *.png/jpg                      # 论文封面图
├── MEMBER_GUIDE.md                    # 成员如何更新自己的信息与页面
└── DESIGN_SYSTEM.md                   # 视觉规范（配色、字体、logo）
```

## ⚙️ 工作原理

- **数据驱动。** 页面通过 `fetch()` 读取 JSON 并用原生 JS 渲染——无构建步骤、无框架。全部静态托管在 GitHub Pages（用 `.nojekyll`）。
- **团队页**读取 `data/team.json`；成员条目设为 `"page": true` 后，其卡片会链接到个人主页。
- **成员主页**共用一个模板 `members/index.html`，地址为 `members/?id=<id>`（中文加 `&lang=cn`）。它读取 `data/members/<id>.json`，并自动从论文索引拉取该成员的论文。
- **论文**以「一篇一文件」存放在 `data/publications/`。`manifest.json` 由 `tools/build-pubs.py` 生成（校验必填字段、核对 `team.json` 的 author IDs、去重）。**CI 会自动处理**：PR 会被校验，合并时索引自动重建并提交——见 `.github/workflows/`。本地运行脚本仅供预览。
- **作者姓名**在论文列表中自动链接到成员主页，并在其个人主页上加粗高亮（容错匹配，如 "Bicong Yan" ↔ "Bi-Cong Yan"）。

## 👥 维护团队成员

**PI** 编辑 `data/team.json`，在相应类别下添加条目：
`leader`、`pi`、`postdoc`、`phd_engineering`、`phd_medical`、`master_engineering`、`master_medical`、`alumni`。

没有照片的成员会自动使用首字母头像。设 `"page": true` 可为成员开通个人主页。

**成员**可以维护自己的主页——详见 **[MEMBER_GUIDE.md](MEMBER_GUIDE.md)**（双语，面向人类与 AI 代理）。涵盖更新个人信息、照片与论文，以及「Pull Request → owner 审核合并」流程。简言之：复制 `data/members/_template.json` 为 `data/members/<your-id>.json`，填写内容，在 `images/members/` 放入照片，本地预览后提交 Pull Request。

## 🚀 本地预览

```bash
python3 -m http.server 8000
```

然后打开 `http://localhost:8000`。

## 📦 部署

由 **GitHub Pages** 从 `main` 分支自动部署。推送到 `main` 后约 1 分钟上线。

## 📄 许可

[MIT](LICENSE)——仅限网站代码。成员照片、论文图片、logo 的版权归原作者/所有者所有。

---

<div align="center">

**AI4Rad Lab** · 放射介入科 · 上海交通大学医学院附属第六人民医院 · 上海交通大学医学院

🌐 [ai4rad-ssph.github.io](https://ai4rad-ssph.github.io/) ·
🐙 [GitHub](https://github.com/AI4Rad-SSPH) ·
📧 zhangrp@sjtu.edu.cn

</div>
