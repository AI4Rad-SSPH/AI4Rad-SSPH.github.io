// Dependency-free regression checks for bilingual roster and publication flows.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const teamElement = { innerHTML: '', querySelectorAll: () => [] };
const sandbox = {
  document: {
    documentElement: {},
    getElementById: id => id === 'team-content' ? teamElement : null,
    querySelectorAll: () => []
  },
  location: { pathname: '/publications_ch.html' },
  setTimeout: fn => fn(),
  IntersectionObserver: class { observe() {} }
};
sandbox.window = sandbox;
vm.createContext(sandbox);
for (const file of ['js/main.js', 'js/pub.js']) {
  vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), sandbox);
}
let failed = 0;
function check(name, run) {
  try { run(); console.log('PASS ' + name); }
  catch (error) { failed++; console.error('FAIL ' + name + ': ' + error.message); }
}
const member = { id: 'sample-student', name_en: 'Sample Student', name_cn: '示例学生', role: 'phd', year: '2026', page: true };
check('English profile routes remain stable', () => {
  assert.equal(sandbox.memberLink(member, 'en'), 'members/?id=sample-student');
});
check('Chinese team links retain language', () => {
  assert.equal(sandbox.memberLink(member, 'cn'), 'members/?id=sample-student&lang=cn');
});
check('Member names are clickable profile entries', () => {
  assert.match(sandbox.renderMemberCard(member, 'cn'), /member-card__name[^>]*><a href="members\/\?id=sample-student&lang=cn">示例学生<\/a>/);
});
check('Rendering both languages does not alter degree data', () => {
  const team = { leader: [], pi: [], phd_medical: [structuredClone(member)], phd_engineering: [], master_medical: [], master_engineering: [], alumni: [] };
  const before = JSON.stringify(team);
  sandbox.renderTeam(team, 'cn');
  sandbox.renderTeam(team, 'en');
  assert.equal(JSON.stringify(team), before);
  assert.doesNotMatch(teamElement.innerHTML, /医学博士/);
});
check('Author links retain Chinese language and highlight current author', () => {
  const html = sandbox.Pub.renderCard({ title: 'Paper', authors_text: 'Sample Student', author_ids: [member.id] }, 'cn', { members: { [member.id]: { en: member.name_en, cn: member.name_cn } }, currentId: member.id });
  assert.match(html, /pub-author--me/);
  assert.match(html, /href="members\/\?id=sample-student&lang=cn"/);
});
check('Hyphenated author names still resolve', () => {
  const html = sandbox.Pub.renderCard({ title: 'Paper', authors_text: 'Bi-Cong Yan', author_ids: ['bicong-yan'] }, 'en', { members: { 'bicong-yan': { en: 'Bicong Yan', cn: '严碧聪' } } });
  assert.match(html, /href="members\/\?id=bicong-yan"/);
});
check('Accepted work has a clear status and no invented paper link', () => {
  const html = sandbox.Pub.renderCard({ title: 'Accepted study', venue: 'Insights into Imaging', status: 'accepted', links: {} }, 'cn');
  assert.match(html, /已接收 · 待发表/);
  assert.doesNotMatch(html, /href=/);
});
check('Paper titles open the article page before the PDF', () => {
  const html = sandbox.Pub.renderCard({ title: 'Study', links: { pages: 'https://example.org/article', pdf: 'https://example.org/article.pdf' } }, 'en');
  assert.match(html, /pub-title"><a href="https:\/\/example.org\/article"/);
});
check('Status filters and Chinese author search compose correctly', () => {
  const elements = { '.filters': { innerHTML: '' }, '.pub-list': { innerHTML: '' }, '.filter-count': { textContent: '' } };
  const handlers = {};
  const filterRoot = { querySelector: key => elements[key], addEventListener: (event, handler) => { handlers[event] = handler; } };
  const previous = sandbox.document.getElementById;
  sandbox.document.getElementById = id => id === 'test-filter' ? filterRoot : previous(id);
  const papers = [
    { title: 'Accepted study', type: 'journal', status: 'accepted', year: 2026, author_ids: [member.id] },
    { title: 'Published study', type: 'journal', year: 2026, author_ids: ['second-student'] }
  ];
  sandbox.Pub.initFilter('test-filter', papers, 'cn', () => member.name_cn, { members: { [member.id]: { en: member.name_en, cn: member.name_cn } } });
  assert.equal(elements['.filter-count'].textContent, '共 2 篇');
  assert.match(elements['.filters'].innerHTML, /<details class="filter-advanced"><summary>/);
  handlers.toggle({ target: { classList: { contains: () => true }, open: true } });
  handlers.click({ target: { closest: () => ({ dataset: { facet: 'status', value: 'accepted' } }) } });
  assert.match(elements['.filters'].innerHTML, /<details class="filter-advanced" open>/);
  assert.equal(elements['.filter-count'].textContent, '共 1 篇');
  assert.match(elements['.pub-list'].innerHTML, /Accepted study/);
  handlers.input({ target: { classList: { contains: () => true }, value: '示例学生' } });
  assert.equal(elements['.filter-count'].textContent, '共 1 篇');
  handlers.input({ target: { classList: { contains: () => true }, value: 'no match' } });
  assert.equal(elements['.filter-count'].textContent, '共 0 篇');
  assert.match(elements['.pub-list'].innerHTML, /没有匹配的论文/);
  sandbox.document.getElementById = previous;
});
check('All visible members have unique IDs and matching profiles', () => {
  const team = JSON.parse(fs.readFileSync(path.join(root, 'data/team.json'), 'utf8'));
  const ids = new Set();
  for (const member of Object.values(team).flat()) {
    assert.ok(!ids.has(member.id), 'Duplicate member: ' + member.id);
    ids.add(member.id);
    if (!member.page) continue;
    const profile = JSON.parse(fs.readFileSync(path.join(root, 'data/members', member.id + '.json'), 'utf8'));
    assert.equal(profile.id, member.id);
    assert.equal(profile.name_cn, member.name_cn);
    assert.equal(profile.name_en.replace(/-/g, '').toLowerCase(), member.name_en.replace(/-/g, '').toLowerCase());
  }
});
check('News has both languages and valid internal destinations', () => {
  const news = JSON.parse(fs.readFileSync(path.join(root, 'data/news.json'), 'utf8'));
  for (const item of news) {
    assert.ok(item.date && item.text_en && item.text_cn);
    for (const link of item.links || []) {
      assert.ok(link.label_en && link.label_cn);
      for (const href of [link.href, link.href_cn].filter(Boolean)) {
        if (!/^https?:/.test(href)) assert.ok(fs.existsSync(path.join(root, href.split(/[?#]/)[0])), href);
      }
    }
  }
});
const linkedPaper = {
  id: 'role-aware-study', author_ids: ['co-first', 'co-corresponding', 'ordinary'],
  author_roles: { 'co-first': ['co_first'], 'co-corresponding': ['co_corresponding'] }
};
const linkedAnnouncement = {
  publication_id: linkedPaper.id, date: '2026.09',
  text_en: 'Our study was accepted.', text_cn: '研究已被接收。',
  links: [{ href: 'publications.html', href_cn: 'publications_ch.html', label_en: 'Publications', label_cn: '论文成果' }]
};
check('Publication news reaches only verified first and corresponding authors', () => {
  for (const [id, role] of [['co-first', '共同第一作者'], ['co-corresponding', '共同通讯作者']]) {
    const items = sandbox.Pub.memberNews({ id }, [linkedPaper], [linkedAnnouncement], 'cn');
    assert.equal(items.length, 1);
    assert.match(items[0].text, new RegExp(role));
  }
  for (const id of ['ordinary', 'not-an-author']) {
    assert.equal(sandbox.Pub.memberNews({ id }, [linkedPaper], [linkedAnnouncement], 'cn').length, 0);
  }
  const unknown = { ...linkedPaper, author_roles: undefined };
  assert.equal(sandbox.Pub.memberNews({ id: 'co-first' }, [unknown], [linkedAnnouncement], 'cn').length, 0);
  const invalid = { ...linkedPaper, author_ids: ['ordinary'] };
  assert.equal(sandbox.Pub.memberNews({ id: 'co-first' }, [invalid], [linkedAnnouncement], 'cn').length, 0);
});
check('Shared news replaces stale member copies and keeps personal milestones', () => {
  const member = { id: 'co-first', news_cn: [
    { publication_id: linkedPaper.id, date: '2026年8月', text: '旧的投稿动态' },
    { date: '2025年', text: '加入团队' }
  ] };
  const before = JSON.stringify(member);
  const items = sandbox.Pub.memberNews(member, [linkedPaper], [linkedAnnouncement], 'cn');
  assert.equal(items.length, 2);
  assert.equal(items[0].publication_id, linkedPaper.id);
  assert.match(items[0].text, /研究已被接收/);
  assert.doesNotMatch(items[0].text, /旧的投稿动态/);
  assert.equal(items[1].text, '加入团队');
  assert.equal(JSON.stringify(member), before);
  member.id = 'ordinary';
  assert.equal(sandbox.Pub.memberNews(member, [linkedPaper], [linkedAnnouncement], 'cn').length, 1);
});
check('Member news preserves language and safely renders shared text and links', () => {
  const cn = sandbox.Pub.memberNews({ id: 'co-first' }, [linkedPaper], [linkedAnnouncement], 'cn')[0];
  const en = sandbox.Pub.memberNews({ id: 'co-first' }, [linkedPaper], [linkedAnnouncement], 'en')[0];
  assert.match(cn.text, /href="\/publications_ch.html"/);
  assert.match(en.text, /href="\/publications.html"/);
  assert.match(en.text, /Co-first author/);
  const escaped = sandbox.Pub.memberNews({ id: 'co-first' }, [linkedPaper], [{ ...linkedAnnouncement, text_en: '<script>unsafe</script>' }], 'en')[0];
  assert.doesNotMatch(escaped.text, /<script>/);
  assert.match(escaped.text, /&lt;script&gt;/);
});
check('News sorting understands Chinese, English, and numeric dates', () => {
  const member = { id: 'co-first', news_en: [
    { date: '2025', text: 'Joined' }, { date: 'August 2026', text: 'August' },
    { date: '2026.10', text: 'October' }, { date: '2026年7月', text: 'July' }
  ] };
  const dates = sandbox.Pub.memberNews(member, [linkedPaper], [linkedAnnouncement], 'en').map(n => n.date);
  assert.equal(JSON.stringify(dates), JSON.stringify(['2026.10', '2026.09', 'August 2026', '2026年7月', '2025']));
});
check('A failed manifest cannot leak unverified publication news', () => {
  const member = { id: 'ordinary', news_cn: [
    { publication_id: linkedPaper.id, date: '2026.09', text: '论文动态' },
    { date: '2026年', text: '入学' }
  ] };
  const items = sandbox.Pub.memberNews(member, [], [], 'cn');
  assert.equal(items.length, 1);
  assert.equal(items[0].text, '入学');
});
check('Real member news matches verified roles in both languages without duplicates', () => {
  const papers = JSON.parse(fs.readFileSync(path.join(root, 'data/publications/manifest.json'), 'utf8'));
  const announcements = JSON.parse(fs.readFileSync(path.join(root, 'data/news.json'), 'utf8'));
  const sharedIds = new Set(announcements.map(n => n.publication_id).filter(Boolean));
  const byId = Object.fromEntries(papers.map(p => [p.id, p]));
  for (const file of fs.readdirSync(path.join(root, 'data/members')).filter(f => f.endsWith('.json') && f !== '_template.json')) {
    const member = JSON.parse(fs.readFileSync(path.join(root, 'data/members', file), 'utf8'));
    for (const lang of ['en', 'cn']) {
      assert.ok(!(member['news_' + lang] || []).some(n => sharedIds.has(n.publication_id)),
        member.id + ': shared publication announcements belong only in news.json');
    }
    const expected = announcements.filter(n => {
      const paper = byId[n.publication_id];
      return paper && paper.author_ids.includes(member.id) && (paper.author_roles || {})[member.id]?.length;
    }).map(n => n.publication_id).sort();
    for (const lang of ['en', 'cn']) {
      const items = sandbox.Pub.memberNews(member, papers, announcements, lang);
      const linkedIds = items.filter(n => sharedIds.has(n.publication_id)).map(n => n.publication_id).sort();
      assert.equal(JSON.stringify(linkedIds), JSON.stringify(expected), member.id + ' ' + lang);
    }
  }
  for (const paper of papers) {
    if (!paper.author_roles) continue;
    const source = JSON.parse(fs.readFileSync(path.join(root, 'data/publications', paper.file), 'utf8'));
    assert.deepEqual(paper.author_roles, source.author_roles);
  }
});
check('All page scripts compile', () => {
  const pages = fs.readdirSync(root).filter(file => file.endsWith('.html')).concat('members/index.html');
  for (const file of pages) {
    const html = fs.readFileSync(path.join(root, file), 'utf8');
    for (const script of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)) {
      new vm.Script(script[1], { filename: file });
    }
  }
  for (const file of fs.readdirSync(path.join(root, 'js')).filter(file => file.endsWith('.js'))) {
    new vm.Script(fs.readFileSync(path.join(root, 'js', file), 'utf8'), { filename: file });
  }
});
process.exitCode = failed ? 1 : 0;
