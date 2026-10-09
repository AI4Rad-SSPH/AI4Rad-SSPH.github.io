#!/usr/bin/env python3
"""
build-pubs.py — scan data/publications/*.json and generate manifest.json

Usage:  python3 tools/build-pubs.py

What it does:
  1. Loads all member ids from data/team.json (for author_ids validation).
  2. Scans data/publications/ for *.json (skips _template.json, manifest.json).
  3. Validates each paper: required fields, valid type, unique id, author_ids
     must reference real members (warns on unknown ids).
  4. Writes data/publications/manifest.json — an array sorted by year desc,
     each entry carrying the fields the client needs to render + filter
     without fetching every individual file.

No third-party dependencies. Run after adding/editing any paper file.
"""
import json
import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PUB_DIR = ROOT / "data" / "publications"
TEAM_JSON = ROOT / "data" / "team.json"
NEWS_JSON = ROOT / "data" / "news.json"
MANIFEST = PUB_DIR / "manifest.json"
SKIP = {"_template.json", "manifest.json"}

REQUIRED = ["id", "title", "type", "year", "venue"]
VALID_TYPES = {"journal", "conference", "preprint", "other"}
VALID_STATUSES = {"published", "early_access", "accepted", "preprint"}
VALID_AUTHOR_ROLES = {"first", "co_first", "corresponding", "co_corresponding"}

# Fields copied into the manifest (enough to render a card + filter).
MANIFEST_FIELDS = [
    "id", "file", "title", "authors_text", "author_ids",
    "type", "year", "venue", "cover", "tags", "doi", "links",
    "topic", "featured", "abstract", "lab", "status", "published_date", "author_roles",
]


def load_member_ids():
    team = json.loads(TEAM_JSON.read_text(encoding="utf-8"))
    ids = set()
    for cat in ("leader", "pi", "postdoc", "phd_engineering", "phd_medical",
                "master_engineering", "master_medical", "honors_students", "alumni"):
        for m in team.get(cat, []):
            if "id" in m:
                ids.add(m["id"])
    return ids


def validate_author_roles(paper, member_ids):
    """News eligibility must be explicit and refer to real authors."""
    errors = []
    roles_by_author = paper.get("author_roles", {})
    if not isinstance(roles_by_author, dict):
        return ["author_roles must be an object mapping member IDs to role arrays"]
    for author_id, roles in roles_by_author.items():
        if author_id not in member_ids or author_id not in (paper.get("author_ids") or []):
            errors.append(f"author_roles '{author_id}' must be a team member in author_ids")
        if not isinstance(roles, list) or not roles or any(
                not isinstance(role, str) or role not in VALID_AUTHOR_ROLES for role in roles):
            errors.append(f"author_roles '{author_id}' must contain verified first/corresponding roles")
            continue
        if len(roles) != len(set(roles)):
            errors.append(f"author_roles '{author_id}' contains duplicate roles")
        if {"first", "co_first"} <= set(roles) or {"corresponding", "co_corresponding"} <= set(roles):
            errors.append(f"author_roles '{author_id}' mixes sole and shared versions of the same role")
    return errors


def main():
    if not PUB_DIR.is_dir():
        sys.exit(f"✗ missing {PUB_DIR}")
    member_ids = load_member_ids()

    papers = []
    errors, warnings = [], []
    seen_ids = set()

    for path in sorted(PUB_DIR.glob("*.json")):
        if path.name in SKIP:
            continue
        rel = path.name
        try:
            p = json.loads(path.read_text(encoding="utf-8"))
        except json.JSONDecodeError as e:
            errors.append(f"{rel}: invalid JSON ({e})")
            continue

        # required fields
        for field in REQUIRED:
            if field not in p or p[field] in (None, "", []):
                errors.append(f"{rel}: missing required field '{field}'")

        # type validity
        if p.get("type") not in VALID_TYPES:
            errors.append(f"{rel}: invalid type '{p.get('type')}' "
                          f"(must be one of {sorted(VALID_TYPES)})")

        if "status" in p and p["status"] not in VALID_STATUSES:
            errors.append(f"{rel}: invalid status '{p['status']}'")

        # unique id
        pid = p.get("id")
        if not pid:
            continue
        if pid in seen_ids:
            errors.append(f"{rel}: duplicate id '{pid}'")
        seen_ids.add(pid)

        # author_ids reference real members
        for aid in p.get("author_ids", []) or []:
            if aid not in member_ids:
                warnings.append(f"{rel}: author_id '{aid}' not found "
                                f"in team.json (paper may not show on that member's page)")

        errors.extend(f"{rel}: {error}" for error in validate_author_roles(p, member_ids))

        # build manifest entry
        entry = {}
        entry["file"] = rel
        for f in MANIFEST_FIELDS:
            if f == "file":
                continue
            if f in p:
                entry[f] = p[f]
        # sensible defaults so client never hits undefined
        entry.setdefault("author_ids", [])
        entry.setdefault("tags", [])
        entry.setdefault("links", {})
        entry.setdefault("topic", [])
        entry.setdefault("featured", False)
        entry.setdefault("lab", True)  # only lab papers show on the site-wide list
        papers.append(entry)

    papers.sort(key=lambda x: (x.get("year", 0), x.get("published_date", ""),
                               x.get("title", "")), reverse=True)

    # Each publication announcement is maintained once and shared with members.
    news_ids = set()
    for item in json.loads(NEWS_JSON.read_text(encoding="utf-8")):
        pid = item.get("publication_id")
        if not pid:
            continue
        if pid not in seen_ids:
            errors.append(f"news.json: unknown publication_id '{pid}'")
        if pid in news_ids:
            errors.append(f"news.json: duplicate publication announcement '{pid}'")
        news_ids.add(pid)

    if errors:
        print("✗ Validation errors — manifest NOT written:")
        for e in errors:
            print(f"  • {e}")
        for w in warnings:
            print(f"  ⚠ {w}")
        sys.exit(1)

    MANIFEST.write_text(
        json.dumps(papers, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    print(f"✓ Wrote {MANIFEST.relative_to(ROOT)} — {len(papers)} papers")
    for w in warnings:
        print(f"  ⚠ {w}")


if __name__ == "__main__":
    main()
