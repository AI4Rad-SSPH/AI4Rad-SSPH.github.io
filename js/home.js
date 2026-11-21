// Homepage news and live overview metrics share the lab's canonical JSON sources.
(function () {
  var root = document.getElementById('home-news');
  var lang = document.documentElement.lang === 'zh-CN' ? 'cn' : 'en';
  function esc(value) {
    return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function renderList(items) {
    return '<ul class="news-list-plain">' + items.map(function (item) {
      var links = (item.links || []).map(function (link) {
        var href = lang === 'cn' ? (link.href_cn || link.href) : link.href;
        var external = /^https?:/.test(href);
        return '<a href="' + esc(href) + '"' + (external ? ' target="_blank" rel="noopener"' : '') + '>' + esc(link['label_' + lang]) + '</a>';
      }).join(' · ');
      return '<li><span class="news-date">' + esc(item.date) + '</span><div>' +
        esc(item['text_' + lang]) + (links ? ' ' + links : '') + '</div></li>';
    }).join('') + '</ul>';
  }
  if (root) {
    fetch('data/news.json?v=20261121').then(function (response) {
      if (!response.ok) throw new Error('News request failed');
      return response.json();
    }).then(function (items) {
      var html = renderList(items.slice(0, 5));
      if (items.length > 5) {
        html += '<details class="news-archive"><summary>' +
          (lang === 'cn' ? '展开历史动态（' + (items.length - 5) + ' 条）' : 'Earlier announcements (' + (items.length - 5) + ')') +
          '</summary>' + renderList(items.slice(5)) + '</details>';
      }
      root.innerHTML = html;
    }).catch(function (error) {
      root.innerHTML = '<p class="text-body" style="padding:12px 0;">' + (lang === 'cn' ?
        '动态暂时无法加载，请刷新页面或查看论文成果与团队页面。' :
        'News could not be loaded. Please refresh or visit Publications and Team.') + '</p>';
      console.error(error);
    });
  }

  var statPubs = document.getElementById('stat-pubs');
  if (statPubs) {
    fetch('data/publications/manifest.json?v=20261121')
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (papers) {
        if (!Array.isArray(papers)) return;
        var count = papers.filter(function (p) { return p.lab !== false; }).length;
        if (count > 0) statPubs.textContent = String(count);
      }).catch(function () {});
  }

  var statMembers = document.getElementById('stat-members');
  if (statMembers) {
    fetch('data/team.json?v=20261121')
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (team) {
        if (!team || typeof team !== 'object') return;
        var total = 0;
        Object.keys(team).forEach(function (k) {
          if (Array.isArray(team[k])) total += team[k].length;
        });
        if (total > 0) statMembers.textContent = String(total);
      }).catch(function () {});
  }
})();
