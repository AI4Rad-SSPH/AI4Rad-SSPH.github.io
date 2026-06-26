<div align="center">

<img src="ai4rad_home_light_v2.png" alt="AI4Rad Lab homepage" width="880">

# AI4Rad Lab · Medical Imaging AI

**Medical Imaging Artificial Intelligence Laboratory**<br>
Department of Radiology, Shanghai Sixth People's Hospital ·
Shanghai Jiao Tong University School of Medicine

<h3>🌐 <a href="https://ai4rad-ssph.github.io/">ai4rad-ssph.github.io</a></h3>

[![Website](https://img.shields.io/badge/website-live-0d9488?style=flat-square)](https://ai4rad-ssph.github.io/)
[![Publications](https://img.shields.io/badge/lab%20papers-33-0d9488?style=flat-square)](https://ai4rad-ssph.github.io/publications.html)
[![Team](https://img.shields.io/badge/team-30-0d9488?style=flat-square)](https://ai4rad-ssph.github.io/team.html)
[![License](https://img.shields.io/badge/license-MIT-0d9488?style=flat-square)](LICENSE)

</div>

---

## English

The official website of **AI4Rad Lab**, a medical imaging AI research group at the
Department of Radiology, Shanghai Sixth People's Hospital (SJTU School of Medicine).

We build AI that works in real clinical radiology — from vessel segmentation and
perfusion analysis to large-scale disease diagnosis and automated reporting — with a
focus on **vascular & stroke imaging**, **cardiac & coronary CT**, and the **clinical
translation** of medical AI.

### 🔬 Research directions

- **Vision foundation models** — detection, segmentation, and quantitative biomarkers for vascular and musculoskeletal imaging.
- **Multimodal large language models** — integrating imaging, reports, and clinical data for structured reporting and diagnostic reasoning.
- **Medical image generation** — synthesis, denoising, and super-resolution to improve image quality and reduce scan time.
- **Clinical AI generalization** — robustness across sites, scanners, and patient distributions.

### ⭐ Selected projects

| Project | Venue | Links |
|---|---|---|
| **HR-LLM-Stroke** — multi-agent LLM framework for emergency stroke treatment recommendation | *J Med Internet Res*, 2026 | [Paper](https://doi.org/10.2196/96304) · [Code](https://github.com/FrankZhangRp/HR-LLM-Stroke) · [Demo](https://frankzhangrp.github.io/HR-LLM-Stroke/) |
| **BrainMIND** — LLM-based diagnostic impression generation from brain MRI reports | *npj Digital Medicine*, 2026 | [Paper](https://www.nature.com/articles/s41746-026-02380-4) · [Code](https://github.com/AI4Rad-SSPH/BrainMIND) |
| **LumbarSR** — paired clinical CT & micro-CT dataset for lumbar vertebra super-resolution | *Scientific Data*, 2026 | [Challenge](https://github.com/FrankZhangRp/LumbarSR-Challenge) |
| **Cerebrovascular & Stroke AI** — aneurysm detection, ASPECTS scoring, thrombus characterization | *Radiology* / *European Radiology* | — |

> See the full list at **[Publications](https://ai4rad-ssph.github.io/publications.html)**.

---

## 中文

**AI4Rad 实验室**官方网站——上海交通大学医学院附属第六人民医院放射介入科的医学影像人工智能研究团队。

我们致力于让 AI 真正服务于临床放射——从血管分割、灌注分析到大规模疾病诊断与报告自动生成，聚焦**血管与卒中影像**、**心脏与冠脉 CT**，以及医学 AI 的**临床转化**。

### 🔬 研究方向

- **视觉基础模型**：面向血管与骨肌影像的检测、分割与定量生物标志提取。
- **多模态大语言模型**：融合影像、报告与临床数据，用于结构化报告与诊断推理。
- **影像生成与增强**：图像合成、去噪与超分辨率，提升图像质量并缩短扫描时间。
- **临床 AI 泛化性**：跨机构、跨设备、跨人群的模型迁移与分布外泛化。

### ⭐ 代表性项目

| 项目 | 期刊 | 链接 |
|---|---|---|
| **HR-LLM-Stroke** — 面向急诊卒中治疗推荐的多智能体大语言模型框架 | 《医学互联网研究杂志》, 2026 | [论文](https://doi.org/10.2196/96304) · [代码](https://github.com/FrankZhangRp/HR-LLM-Stroke) · [演示](https://frankzhangrp.github.io/HR-LLM-Stroke/) |
| **BrainMIND** — 基于大语言模型的脑 MRI 报告诊断印象生成 | 《npj 数字医学》, 2026 | [论文](https://www.nature.com/articles/s41746-026-02380-4) · [代码](https://github.com/AI4Rad-SSPH/BrainMIND) |
| **LumbarSR** — 配对临床 CT 与显微 CT 的腰椎超分辨率数据集 | 《科学数据》, 2026 | [挑战赛](https://github.com/FrankZhangRp/LumbarSR-Challenge) |
| **脑血管与卒中 AI** — 动脉瘤检测、ASPECTS 评分、血栓表征 | 《Radiology》/《European Radiology》 | — |

> 完整论文列表见 **[Publications](https://ai4rad-ssph.github.io/publications_ch.html)**。

---

## 🏗️ Repository structure · 仓库结构

```
.
├── index.html / index_ch.html        # Homepage (EN / 中文)
├── team.html  / team_ch.html          # Team page, rendered from data/team.json
├── publications.html / _ch.html       # Filterable publications list (lab papers)
├── contact.html / _ch.html            # Contact page
├── members/
│   └── index.html                     # Shared member-page template (?id=<id>&lang=cn)
├── css/style.css                      # Styles, dark mode, responsive 2K/4K
├── js/
│   ├── main.js                        # Theme toggle, scroll reveal, team renderer
│   └── pub.js                         # Publication card renderer + filters + author links
├── data/
│   ├── team.json                      # Team roster (PI-maintained, 30 members)
│   ├── members/<id>.json              # One file per member — owned by that member
│   ├── publications/<paper-id>.json   # One file per paper + auto-generated manifest.json
│   └── members/_template.json         # Copy to start your own page
├── tools/build-pubs.py                # Rebuild publications manifest (validates fields)
├── images/
│   ├── brand/                         # Lab logo + SSPH/SJTU affiliation logos
│   ├── members/                       # Member photos
│   └── *.png/jpg                      # Paper cover figures
├── MEMBER_GUIDE.md                    # How members update their own info & page
└── DESIGN_SYSTEM.md                   # Visual identity spec (colors, fonts, logos)
```

## ⚙️ How it works · 工作原理

- **Data-driven.** Pages `fetch()` JSON and render with vanilla JS — no build step, no
  framework. Everything is static and served by GitHub Pages (with `.nojekyll`).
- **Team page** reads `data/team.json`; a member's card links to a personal page once their
  entry has `"page": true`.
- **Member pages** share one template, `members/index.html`, addressed as
  `members/?id=<id>` (append `&lang=cn` for Chinese). It loads `data/members/<id>.json` and
  auto-pulls that member's papers from the publications manifest.
- **Publications** live as one JSON per paper under `data/publications/`. Run
  `python3 tools/build-pubs.py` to regenerate `manifest.json` (it validates required fields,
  author IDs against `team.json`, and dedupes).
- **Author names** in publication lists are auto-linked to member pages, with the current
  member highlighted on their own profile (hyphen-tolerant matching, e.g. "Bicong Yan" ↔ "Bi-Cong Yan").

## 👥 Updating team members · 维护团队成员

**PI** edits `data/team.json`, adding an entry under the relevant category:
`leader`, `pi`, `postdoc`, `phd_engineering`, `phd_medical`, `master_engineering`,
`master_medical`, `alumni`.

Members without a photo get an initials-avatar fallback automatically. Set `"page": true`
to give a member a personal page.

**Members** can update their own page — see **[MEMBER_GUIDE.md](MEMBER_GUIDE.md)** (bilingual,
human- and agent-friendly). It covers updating your profile, photo, and publications, and
the Pull-Request → owner-review-and-merge workflow. In short: copy
`data/members/_template.json` to `data/members/<your-id>.json`, fill it in, drop a photo in
`images/members/`, preview locally, and open a Pull Request.

## 🚀 Local preview · 本地预览

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## 📦 Deployment · 部署

Deployed automatically by **GitHub Pages** from the `main` branch. Push to `main` and the
live site updates within ~1 minute.

## 📄 License · 许可

[MIT](LICENSE) — the website code. Member photos, paper figures, and logos remain the
property of their respective owners.

---

<div align="center">

**AI4Rad Lab** · Department of Radiology · Shanghai Sixth People's Hospital ·
Shanghai Jiao Tong University School of Medicine

🌐 [ai4rad-ssph.github.io](https://ai4rad-ssph.github.io/) ·
🐙 [GitHub](https://github.com/AI4Rad-SSPH) ·
📧 zhangrp@sjtu.edu.cn

</div>
