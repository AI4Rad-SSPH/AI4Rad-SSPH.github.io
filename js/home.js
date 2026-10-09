// Homepage news shares one bilingual source. Array order is editorial: newest
// announcements first; year-only dates do not imply a specific event month.
(function () {
  var root = document.getElementById('home-news');
  if (!root) return;
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
  fetch('data/news.json?v=20261009').then(function (response) {
    if (!response.ok) throw new Error('News request failed');
    return response.json();
  }).then(function (items) {
    root.innerHTML = renderList(items.slice(0, 5));
    if (items.length > 5) {
      root.innerHTML += '<details class="news-archive"><summary>' +
        (lang === 'cn' ? '更多动态' : 'Earlier news') + '</summary>' +
        renderList(items.slice(5)) + '</details>';
    }
  }).catch(function (error) {
    root.innerHTML = '<p class="text-body">' + (lang === 'cn' ?
      '动态暂时无法加载，请刷新页面或查看论文成果与团队页面。' :
      'News could not be loaded. Please refresh or visit Publications and Team.') + '</p>';
    console.error(error);
  });
})();
