/*
 * pub.js — shared publication card renderer + filterable list controller.
 * Used by publications.html (full list w/ filters) and members/index.html
 * (per-author subset). Depends on css/style.css .pub-* classes.
 */
(function (global) {
  'use strict';

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
  // authors_text intentionally allows inline HTML (<strong>), so NOT escaped.
  function escAttr(s) { return esc(s); }

  // Resolve an asset path (cover) to an absolute site-root URL so it works
  // regardless of whether this page lives at site root or in /members/.
  function assetRoot(p) {
    if (!p) return '';
    if (/^(https?:|data:|\/)/.test(p)) return p;   // already absolute
    return '/' + p;                                  // site-root relative
  }

  // Member-page base path, relative to whichever page is rendering.
  // publications.html / team.html are at site root; members/index.html is in
  // /members/. Detect once: if the URL contains /members/, links are relative
  // to the current dir; otherwise they need the /members/ prefix.
  var inMembers = /\/members\//.test(location.pathname);
  function memberHref(id) {
    return inMembers ? '?id=' + encodeURIComponent(id) : 'members/?id=' + encodeURIComponent(id);
  }

  // Build name variants for matching an author_id against free-form authors_text.
  // Handles "Bi-Cong Yan"/"BiCong Yan"/"Bi Cong Yan", and Chinese names.
  // Returns an array (longest first) for robust matching.
  function nameVariants(name) {
    var out = {};
    if (!name) return [];
    name = name.trim();
    out[name] = true;
    if (name.indexOf('-') >= 0) {
      out[name.replace(/-/g, '')] = true;   // "Bi-Cong" -> "BiCong"
      out[name.replace(/-/g, ' ')] = true;  // "Bi-Cong" -> "Bi Cong"
    }
    return Object.keys(out).sort(function (a, b) { return b.length - a.length; });
  }

  // Escape regex specials.
  function reEscape(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

  // Build a hyphen-tolerant regex for a (non-hyphenated) team name, so that
  // "Bicong Yan" also matches the text "Bi-Cong Yan". Each character boundary
  // between name chars optionally allows a '-'.
  function tolerantPattern(nameNoHyphen) {
    var chars = nameNoHyphen.split('');
    // word boundary (no letter/digit before), then chars with optional hyphens,
    // then word boundary (no letter/digit after).
    return '(?<![\\p{L}\\p{N}])' +
      chars.map(function (c) { return reEscape(c); }).join('-?') +
      '(?![\\p{L}\\p{N}])';
  }

  // Turn free-form authors_text into HTML where every team-member author is a
  // link to their member page, and the *current* member (opts.currentId) is also
  // bolded. opts: { members: {id:{en,cn}}, currentId, lang }
  function linkAuthors(text, authorIds, opts) {
    opts = opts || {};
    var members = opts.members || {};
    var currentId = opts.currentId || '';
    if (!text) return '';
    // Collect (matchStart, matchEnd, id) for all team authors, then apply
    // replacements from rightmost to leftmost so offsets stay valid.
    var hits = [];
    (authorIds || []).forEach(function (id) {
      if (!members[id]) return;
      var rec = members[id];
      var variants = nameVariants(rec.en).concat(nameVariants(rec.cn));
      for (var k = 0; k < variants.length; k++) {
        var v = variants[k];
        if (!v) continue;
        var cv = v.replace(/-/g, '');
        var re = new RegExp(tolerantPattern(cv), 'iu');
        var mm = re.exec(text);
        if (mm) {
          hits.push({ start: mm.index, end: mm.index + mm[0].length, id: id, name: mm[0] });
          break;  // first variant that matches wins
        }
      }
    });
    // de-duplicate overlapping hits: keep earliest-starting, drop overlaps.
    hits.sort(function (a, b) { return a.start - b.start || b.end - a.end; });
    var kept = [];
    var lastEnd = -1;
    hits.forEach(function (h) {
      if (h.start >= lastEnd) { kept.push(h); lastEnd = h.end; }
    });
    // apply right-to-left
    var html = text;
    for (var i = kept.length - 1; i >= 0; i--) {
      var h = kept[i];
      var origName = html.substring(h.start, h.end);
      var isCurrent = h.id === currentId;
      var cls = 'pub-author' + (isCurrent ? ' pub-author--me' : '');
      var replacement = '<a class="' + cls + '" href="' + memberHref(h.id) + '">' + esc(origName) + '</a>';
      html = html.substring(0, h.start) + replacement + html.substring(h.end);
    }
    return html;
  }

  // Render one paper as an <li.pub-card>. `lang` is 'en' | 'cn'.
  // `ctx` (optional): { members, currentId } — enables author links + highlight.
  function renderCard(p, lang, ctx) {
    ctx = ctx || {};
    var title = esc(p.title);
    var titleInner = (p.featured ? '<span class="pub-featured">' +
      (lang === 'cn' ? '代表作' : 'Featured') + '</span>' : '') + title;
    var url = p.links && (p.links.pdf || p.links.doi) || p.url ||
      (p.doi ? 'https://doi.org/' + p.doi : '');
    var titleHtml = url
      ? '<a href="' + escAttr(url) + '" target="_blank" rel="noopener">' + titleInner + '</a>'
      : titleInner;

    var h = '<li class="pub-card">';
    if (p.cover) {
      h += '<div class="pub-card__media"><img src="' + escAttr(assetRoot(p.cover)) +
           '" alt="" loading="lazy"></div>';
    }
    h += '<div class="pub-card__body">';
    h += '<div class="pub-title">' + titleHtml + '</div>';
    if (p.authors_text) {
      var authorsHtml = (ctx.members && p.author_ids && p.author_ids.length)
        ? linkAuthors(p.authors_text, p.author_ids, { members: ctx.members, currentId: ctx.currentId, lang: lang })
        : esc(p.authors_text);
      h += '<div class="pub-authors">' + authorsHtml + '</div>';
    }
    if (p.venue) h += '<div class="pub-venue">' + esc(p.venue) + '</div>';

    if (p.tags && p.tags.length) {
      h += '<div class="pub-tags">' + p.tags.map(function (tg) {
        return '<span class="pub-tag pub-tag--' + escAttr(tg.kind || 'venue') + '">' +
               esc(tg.label) + '</span>';
      }).join('') + '</div>';
    }

    // links row: pdf, code, project, pages, doi — in a stable order
    var order = ['pdf', 'code', 'project', 'pages', 'doi', 'video'];
    var links = p.links || {};
    var linkHtml = order.filter(function (k) { return links[k]; }).map(function (k) {
      return '<a class="pub-link pub-link--' + k + '" href="' + escAttr(links[k]) +
             '" target="_blank" rel="noopener">' + k + '</a>';
    }).join('');
    if (linkHtml) h += '<div class="pub-links">' + linkHtml + '</div>';

    if (p.abstract) h += '<p class="pub-abstract">' + esc(p.abstract) + '</p>';
    h += '</div></li>';
    return h;
  }

  // ---- Filterable list controller for publications.html ----
  // papers: array from manifest.json
  // ctx (optional): { members } — enables author-name hyperlinks in cards.
  function initFilter(containerId, papers, lang, memberNameById, ctx) {
    ctx = ctx || {};
    var root = document.getElementById(containerId);
    if (!root) return;

    var state = { type: 'all', year: 'all', topic: 'all', author: 'all', q: '' };

    // build filter facets
    var types = uniq(papers.map(function (p) { return p.type; }));
    var years = uniq(papers.map(function (p) { return p.year; })).sort(function (a, b) { return b - a; });
    var topics = uniq([].concat.apply([], papers.map(function (p) { return p.topic || []; }))).sort();
    var authors = uniq([].concat.apply([], papers.map(function (p) { return p.author_ids || []; }))).sort();

    function chip(label, value, active, facet) {
      return '<button class="chip' + (active ? ' chip--active' : '') +
        '" data-facet="' + facet + '" data-value="' + escAttr(value) + '">' + esc(label) + '</button>';
    }

    function renderFilters() {
      var h = '';
      h += '<div class="filter-row"><span class="filter-label">' +
           (lang === 'cn' ? '类型' : 'Type') + '</span>';
      h += chip(lang === 'cn' ? '全部' : 'All', 'all', state.type === 'all', 'type');
      types.forEach(function (t) {
        h += chip(t, t, state.type === t, 'type');
      });
      h += '</div>';

      if (years.length > 1) {
        h += '<div class="filter-row"><span class="filter-label">' +
             (lang === 'cn' ? '年份' : 'Year') + '</span>';
        h += chip(lang === 'cn' ? '全部' : 'All', 'all', state.year === 'all', 'year');
        years.forEach(function (y) {
          h += chip(String(y), String(y), state.year === String(y), 'year');
        });
        h += '</div>';
      }

      if (topics.length > 1) {
        h += '<div class="filter-row"><span class="filter-label">' +
             (lang === 'cn' ? '主题' : 'Topic') + '</span>';
        h += chip(lang === 'cn' ? '全部' : 'All', 'all', state.topic === 'all', 'topic');
        topics.forEach(function (tp) {
          h += chip(tp, tp, state.topic === tp, 'topic');
        });
        h += '</div>';
      }

      if (authors.length > 1) {
        h += '<div class="filter-row"><span class="filter-label">' +
             (lang === 'cn' ? '作者' : 'Author') + '</span>';
        h += chip(lang === 'cn' ? '全部' : 'All', 'all', state.author === 'all', 'author');
        authors.forEach(function (a) {
          var name = memberNameById ? memberNameById(a) : a;
          h += chip(name || a, a, state.author === a, 'author');
        });
        h += '</div>';
      }

      h += '<div class="filter-row"><input class="filter-search" type="search" placeholder="' +
           (lang === 'cn' ? '搜索标题 / 作者 / 期刊…' : 'Search title / author / venue…') +
           '" value="' + escAttr(state.q) + '"></div>';
      root.querySelector('.filters').innerHTML = h;
    }

    function applyFilters() {
      var q = state.q.toLowerCase();
      var shown = papers.filter(function (p) {
        if (state.type !== 'all' && p.type !== state.type) return false;
        if (state.year !== 'all' && String(p.year) !== state.year) return false;
        if (state.topic !== 'all' && !(p.topic || []).length) return false;
        if (state.topic !== 'all' && (p.topic || []).indexOf(state.topic) < 0) return false;
        if (state.author !== 'all' && (p.author_ids || []).indexOf(state.author) < 0) return false;
        if (q) {
          var hay = (p.title + ' ' + (p.authors_text || '') + ' ' + (p.venue || '')).toLowerCase();
          if (hay.indexOf(q) < 0) return false;
        }
        return true;
      });
      var list = root.querySelector('.pub-list');
      list.innerHTML = shown.length
        ? shown.map(function (p) { return renderCard(p, lang, ctx); }).join('')
        : '<li class="pub-empty">' + (lang === 'cn' ? '没有匹配的论文。' : 'No matching papers.') + '</li>';
      root.querySelector('.filter-count').textContent =
        (lang === 'cn' ? '共 ' : '') + shown.length +
        (lang === 'cn' ? ' 篇' : (shown.length === 1 ? ' paper' : ' papers'));
    }

    root.addEventListener('click', function (e) {
      var btn = e.target.closest('.chip');
      if (!btn) return;
      state[btn.dataset.facet] = btn.dataset.value;
      renderFilters();
      applyFilters();
    });

    root.addEventListener('input', function (e) {
      if (e.target.classList.contains('filter-search')) {
        state.q = e.target.value;
        applyFilters();
      }
    });

    renderFilters();
    applyFilters();
  }

  function uniq(arr) {
    var seen = {}, out = [];
    arr.forEach(function (v) { if (v != null && v !== '' && !seen[v]) { seen[v] = out.push(v); } });
    return out;
  }

  global.Pub = { renderCard: renderCard, initFilter: initFilter, esc: esc };
})(window);
