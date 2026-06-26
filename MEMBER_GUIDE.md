# Member Guide · 成员维护指南

> **How to update your profile, photo, and publications on the AI4Rad Lab website.**
> **如何在 AI4Rad Lab 网站更新你的个人信息、头像与论文。**
>
> This document is written to be readable by both humans and AI coding agents.
> 本文档同时面向人类与 AI 编程代理撰写。

---

## TL;DR — who edits what · 权限速查

| You want to… / 你想…… | Edit this file / 改这个文件 | Then / 然后 |
|---|---|---|
| **Update your profile** (bio, news, links) / 更新个人简介、动态、链接 | `data/members/<your-id>.json` | Open a Pull Request → **PI merges** / 提 PR，PI 合并 |
| **Add / change your photo** / 上传或更换头像 | `images/members/<your-id>.jpg` + the `photo` field | Open a Pull Request → **PI merges** |
| **Add / fix a publication** / 新增或修正论文 | `data/publications/<paper-id>.json` + `author_ids` | Open a Pull Request → **PI merges** |
| Be listed on the team / 加入团队花名册 | — | Ask the PI to edit `data/team.json` / 联系 PI |

> **Golden rule · 核心原则**: every change goes through a **Pull Request** that the **organization owner / PI (Ruipeng Zhang)** reviews and merges. No one pushes directly to `main`.
> 所有改动都通过 **Pull Request** 提交，由 **组织 owner / PI（张瑞鹏）审核并合并**，任何人都不直接推送 `main`。

Your `<your-id>` is the `id` already assigned to you in [`data/team.json`](data/team.json)
(e.g. `ruipeng-zhang`, `mengfei-wang`). 你的 `<your-id>` 是 `data/team.json` 中你那条记录的 `id`。

---

## Workflow at a glance · 流程一览

```
  Fork repo ──▶ create branch ──▶ edit your files ──▶ preview locally ──▶ open Pull Request
                                                                                 │
                                                                                 ▼
                                              PI / owner reviews ──▶ merge to main ──▶ live ✅
```

1. **Fork** the repo on GitHub (top-right Fork button). 在 GitHub 右上角 Fork 仓库。
2. **Branch** from `main`: `git checkout -b profile/<your-id>`. 从 `main` 拉新分支。
3. **Edit** only the files you own (see tables below). 只改属于你的文件。
4. **Preview** locally (see [§ Preview](#-preview-locally--本地预览)). 本地预览。
5. **Pull Request** against `main`, describing what you changed. 向 `main` 提 PR，说明改动。
6. The **PI reviews** and **merges**. The site auto-deploys ~1 min after merge. PI 审核合并后约 1 分钟上线。

> Not comfortable with Git? You can edit files directly on the GitHub web UI and it
> will offer to open a PR for you — or send your content to the PI to commit on your behalf.
> 不熟悉 Git？可直接在 GitHub 网页编辑文件，系统会自动帮你发起 PR；也可把内容发给 PI 代为提交。

---

## 1 · Update your profile · 更新个人信息

**File / 文件:** `data/members/<your-id>.json`

If it does not exist yet, copy the template:
如尚未创建，复制模板：

```bash
cp data/members/_template.json data/members/<your-id>.json
```

### Field reference · 字段说明

All sections are **optional** — omit/delete any you don't need. 所有字段均可选，不需要的可整段删除。

| Field · 字段 | Type | Description · 说明 |
|---|---|---|
| `id` | string | Must match your `id` in `team.json`. Do not change. 必须与 team.json 一致，勿改。 |
| `name_en` / `name_cn` | string | Your name in English / Chinese. 中英文姓名。 |
| `photo` | string | Path to your photo, e.g. `"images/members/<your-id>.jpg"`. Omit → initials-avatar fallback. 留空则用首字母头像。 |
| `title_en` / `title_cn` | string | One-line role shown under your name. 姓名下的一行身份。 |
| `bio_en` / `bio_cn` | string (HTML ok) | Short paragraph; `<strong>` and `<a href>` allowed. 简介，可用加粗与链接。 |
| `links` | object | `email`, `orcid`, `scholar`, `github`, `homepage` — any can be empty `""`. 联系方式，可留空。 |
| `education_en` / `education_cn` | object[] | `{ "period": "2019.09 – 2024.06", "place": "University", "detail": "PhD, …" }`. Education & experience timeline. 教育与经历时间线。 |
| `interests_en` / `interests_cn` | string[] | Bullet list of research interests. 研究兴趣。 |
| `news_en` / `news_cn` | object[] | `{ "date": "2026.06", "highlight": true, "text": "…" }`. 动态时间线。 |
| `awards_en` / `awards_cn` | string[] | Honors & awards. 荣誉奖项。 |
| `services_en` / `services_cn` | string[] | Academic services (reviewing, etc.). 学术服务。 |

> ⚠️ **Keep both languages in sync.** The Chinese page reads the `_cn` fields; the English page reads the `_en` fields. 中英文请保持同步。
>
> ⚠️ **Public content only.** Do not put unpublished/in-progress project details, internal links, or private contact info here. 只放已公开内容，不涉及未发表或在研细节、内网链接、私人联系方式。

A complete real example: [`data/members/ruipeng-zhang.json`](data/members/ruipeng-zhang.json).
完整真实示例见 `ruipeng-zhang.json`。

---

## 2 · Add / change your photo · 上传或更换头像

1. Save your photo as `images/members/<your-id>.jpg` (or `.png`).
   将照片保存为 `images/members/<your-id>.jpg`（或 `.png`）。
2. In `data/members/<your-id>.json`, set: `"photo": "images/members/<your-id>.jpg"`.
   在 JSON 中设置 `photo` 字段指向该路径。
3. Reference the path **exactly** as `images/members/...` (relative to the site root). 路径按站点根目录相对写。

### Photo guidelines · 照片要求

- **Aspect ratio / 比例**: portrait, ~3:4 (the card is 220×293 px). 竖版人像，约 3:4。
- **Size / 大小**: keep under ~500 KB; compress large originals (`width ≤ 800px` is plenty). 单张 < 500KB，宽度 ≤ 800px 足够。
- **No photo?** Just omit the `photo` field — an **initials avatar** is generated automatically. 没有照片可不填，自动生成首字母头像。
- **⚠️ Two places must agree / 两处要保持一致**: a photo must be referenced in **both** `data/members/<your-id>.json` (`photo`) **and** `data/team.json` (`avatar_type: "photo"` + `avatar_path`). The member page reads the first; the Team page reads the second. If you only set one, they will show different avatars. Ask the PI to update the `team.json` entry. 照片必须在成员页 JSON 的 `photo` 字段和 `team.json` 的 `avatar_type:"photo"` + `avatar_path` **两处同时引用**——成员主页读前者，Team 卡片读后者，只改一处会不一致。`team.json` 由 PI 维护，请联系 PI 同步。

---

## 3 · Add / fix a publication · 新增或修正论文

Publications live as **one JSON file per paper** under `data/publications/`. The site reads them through an auto-generated `manifest.json`. 论文以「一篇一文件」存放在 `data/publications/`，站点通过自动生成的 `manifest.json` 读取。

### A. Create the paper file · 创建论文文件

Copy the template and name it after the paper (kebab-case slug):
复制模板，用论文的英文短标识命名：

```bash
cp data/publications/_template.json data/publications/<paper-id>.json
```

### B. Fill in the fields · 填写字段

| Field · 字段 | Required | Description · 说明 |
|---|---|---|
| `id` | ✅ | Same as filename, e.g. `"multiagent-llm-emergency-stroke"`. 与文件名一致。 |
| `title` | ✅ | Full paper title. 完整标题。 |
| `authors_text` | ✅ | Author list as a string, e.g. `"Bicong Yan, Ruipeng Zhang, …, Yuehua Li."`. HTML ok (`<strong>`, `<em>`). 作者字符串。 |
| `author_ids` | ✅ | Array of team-member `id`s who are co-authors, e.g. `["bicong-yan","ruipeng-zhang"]`. These auto-link names to member pages and pull the paper onto each author's page. 团队合著者的 id 列表，用于自动关联。 |
| `type` | ✅ | `"journal"` / `"conference"` / `"preprint"`. 类型。 |
| `year` | ✅ | Publication year (number). 年份。 |
| `venue` | ✅ | Journal/conference name. 期刊或会议。 |
| `doi` | — | DOI string, e.g. `"10.2196/96304"`. DOI。 |
| `links` | — | `pdf`, `code`, `project`, `doi` — any subset. 各类链接。 |
| `topic` | — | Topic tags, e.g. `["Stroke Imaging","Large Language Models"]`. 主题标签。 |
| `tags` | — | Badges, each `{ "label": "Q1", "kind": "jcr" }`. `kind` colors it: `jcr`/`if`/`venue`/`type`/`award`/`ccf`/`cas`. 徽章。 |
| `abstract` | — | One-paragraph abstract. 摘要。 |
| `cover` | — | Cover figure path, e.g. `"images/hr-llm-stroke-framework.png"`. 封面图路径。 |
| `featured` | — | `true` marks a representative work (shows a "Featured" badge). 标记为代表作。 |
| `lab` | — | `true` (default) shows on the site-wide publications page; `false` = personal-only (e.g. a co-author's prior work). 是否在全站论文页展示。 |

### C. Link it to your member page · 关联到成员页

You usually don't need to do anything extra — the paper appears on a member's page
automatically when their `id` is in the paper's `author_ids`. 论文会自动出现在 `author_ids` 所列成员的页面上。

### D. The manifest rebuilds itself · 索引会自动重建

You **do not** need to touch `data/publications/manifest.json` by hand. When your PR
is merged, a GitHub Action runs `tools/build-pubs.py` and commits the refreshed
manifest automatically. 你**不需要**手动改 `manifest.json`：PR 合并后，GitHub Action 会自动重建并提交。

Two CI safety nets back this up · 两道 CI 防线：

- **On your PR**, every JSON is parsed and the publications are validated (required
  fields, valid `type`, unique `id`, real `author_ids`). A broken file fails the check
  before the PI merges. 你的 PR 会校验所有 JSON 与论文字段，出错则在合并前拦下。
- **On merge to `main`**, the manifest is rebuilt and committed for you. 合并到 `main` 后自动重建并提交 manifest。

Optional — to preview locally before opening the PR, you can rebuild it yourself:
如需本地预览，可自行重建：

```bash
python3 tools/build-pubs.py
```

This validates required fields, checks `author_ids` against `team.json`, and rewrites
`data/publications/manifest.json` sorted by year (newest first). 该脚本会校验字段、核对 author_ids、按年份降序重写 manifest。 If you do commit it, the merge-time rebuild simply confirms it's already current. 若你一并提交，合并时的重建只会确认它已是最新。

---

## 🔍 Preview locally · 本地预览

```bash
python3 -m http.server 8000
```

Then check your page in **both languages** / 然后检查中英文两种语言：
- English: `http://localhost:8000/members/?id=<your-id>`
- 中文: `http://localhost:8000/members/?id=<your-id>&lang=cn`
- Publications list: `http://localhost:8000/publications.html`

---

## ✅ Do · ❌ Don't · 约定

- ✅ **Edit only your own files**: `data/members/<your-id>.json` + your images + your paper JSONs. 只改自己的文件。
- ✅ **Keep both languages in sync** and factual (published work only). 中英文同步，只放已公开内容。
- ✅ **One concern per PR** (e.g. "add my photo" or "add paper X"), so review is fast. 一个 PR 一件事，便于审核。
- ✅ **No need to rebuild the manifest** — CI does it on merge (running `build-pubs.py` locally is optional, for preview). 无需手动重建 manifest，CI 会在合并时处理。
- ❌ **Don't edit** other members' files, `data/team.json`, `css/`, `js/`, or the page templates — ask the PI instead. 不要改他人文件或站点框架，找 PI。
- ❌ **Don't commit** large raw images, `.DS_Store`, or local screenshots. 不要提交大图、系统文件、本地截图。
- ❌ **Don't expose** internal IPs, internal links, unpublished results, or private contact info. 不要暴露内网地址、未发表成果、私人联系方式。

---

## Need help? · 需要帮助？

- Open a [GitHub Issue](https://github.com/AI4Rad-SSPH/AI4Rad-SSPH.github.io/issues), or
- Email the PI: **zhangrp@sjtu.edu.cn**.
- 提 [GitHub Issue](https://github.com/AI4Rad-SSPH/AI4Rad-SSPH.github.io/issues)，或邮件联系 PI：**zhangrp@sjtu.edu.cn**。
