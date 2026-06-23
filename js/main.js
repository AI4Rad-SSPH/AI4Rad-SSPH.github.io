(function(){
  var h = document.documentElement;
  var b = document.getElementById('themeToggle');
  var s = localStorage.getItem('ai4rad-theme');
  if (s === 'dark' || s === 'light') {
    h.setAttribute('data-theme', s);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    h.setAttribute('data-theme', 'dark');
  } else {
    h.setAttribute('data-theme', 'light');
  }
  update();
  b.addEventListener('click', function(){
    var c = h.getAttribute('data-theme');
    h.setAttribute('data-theme', c === 'dark' ? 'light' : 'dark');
    localStorage.setItem('ai4rad-theme', h.getAttribute('data-theme'));
    update();
  });
  function update(){
    var c = h.getAttribute('data-theme');
    b.textContent = c === 'dark' ? '\u2600\uFE0F' : '\uD83C\uDF19';
  }
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e){
    if (!localStorage.getItem('ai4rad-theme')) {
      h.setAttribute('data-theme', e.matches ? 'dark' : 'light');
      update();
    }
  });
})();

(function(){
  var r = document.querySelectorAll('.reveal');
  if (!r.length) return;
  var o = new IntersectionObserver(function(e){
    e.forEach(function(x){
      if (x.isIntersecting) x.target.classList.add('visible');
    });
  }, { threshold: 0.06 });
  r.forEach(function(x){ o.observe(x); });
})();

(function(){
  var l = document.querySelectorAll('.nav__link');
  var s = [];
  l.forEach(function(x){
    var href = x.getAttribute('href');
    if (!href || href[0] !== '#') return;
    var i = href.slice(1);
    var e = document.getElementById(i);
    if (e) s.push({ link: x, sec: e });
  });
  if (!s.length) return;
  var o = new IntersectionObserver(function(e){
    e.forEach(function(x){
      if (!x.isIntersecting) return;
      l.forEach(function(y){ y.classList.remove('active'); });
      var m = s.filter(function(y){ return y.sec === x.target; })[0];
      if (m) m.link.classList.add('active');
    });
  }, { rootMargin: '-30% 0px -60% 0px', threshold: 0 });
  s.forEach(function(x){ o.observe(x.sec); });
})();

function avatarUrl(member) {
  if (member.avatar_type === 'photo' && member.avatar_path) {
    return member.avatar_path;
  }
  var seed = member.avatar_seed || member.id;
  var bg = member.avatar_bg || 'dbeafe';
  return 'https://api.dicebear.com/9.x/lorelei-neutral/svg?seed=' + encodeURIComponent(seed) + '&backgroundColor=' + bg;
}

// Where a member's avatar should link: internal member page if they have one,
// otherwise their external homepage, otherwise nowhere.
function memberLink(member) {
  if (member.page) return 'members/?id=' + encodeURIComponent(member.id);
  if (member.homepage) return member.homepage;
  return '';
}

function renderLeader(member, lang) {
  var name = lang === 'cn' ? member.name_cn : member.name_en;
  var nameOther = lang === 'cn' ? member.name_en : member.name_cn;
  var dept = lang === 'cn' ? member.department_cn : member.department;
  var aff = lang === 'cn' ? member.affiliation_cn : member.affiliation;
  var tagArr = (lang === 'cn' ? member.tags_cn : member.tags_en) || member.tags || [];
  var tags = tagArr.map(function(x){ return '<span class="leader-card__tag">' + x + '</span>'; }).join('');
  var link = memberLink(member);
  var aOpen = link ? '<a href="' + link + '"' + (member.page ? '' : ' target="_blank" rel="noopener"') + '>' : '';
  var aClose = link ? '</a>' : '';
  var title = lang === 'cn' ? member.title_cn : member.title;
  return '<div class="leader-card reveal"><div class="leader-card__avatar">' + aOpen + '<img src="' + avatarUrl(member) + '" alt="' + name + '" loading="eager">' + aClose + '</div><div><div class="leader-card__name">' + name + '<span class="leader-card__name-en">' + nameOther + '</span></div><div class="leader-card__tags">' + tags + '</div><div class="leader-card__meta">' + title + ' · ' + aff + '<br>' + dept + '</div></div></div>';
}

function renderPI(member, lang) {
  var name = lang === 'cn' ? member.name_cn : member.name_en;
  var nameOther = lang === 'cn' ? member.name_en : member.name_cn;
  var degree = lang === 'cn' ? member.degree_cn : member.degree;
  var major = lang === 'cn' ? member.major_cn : member.major;
  var univ = lang === 'cn' ? member.university_cn : member.university;
  var pos = lang === 'cn' ? member.position_cn : member.position;
  var dept = lang === 'cn' ? member.department_cn : member.department;
  var aff = lang === 'cn' ? member.affiliation_cn : member.affiliation;
  var link = memberLink(member);
  var home = link ? '<a href="' + link + '"' + (member.page ? '' : ' target="_blank" rel="noopener"') + '>' : '';
  var homeEnd = link ? '</a>' : '';
  var line1Parts = [];
  if (degree) line1Parts.push(degree);
  if (univ) line1Parts.push(univ);
  if (major) line1Parts.push(major);
  var line1 = line1Parts.join(', ');
  var line2Parts = [];
  if (pos) line2Parts.push(pos);
  if (dept) line2Parts.push(dept);
  if (aff) line2Parts.push(aff);
  var line2 = line2Parts.join(', ');
  return '<div class="pi-card reveal"><div class="pi-card__avatar">' + home + '<img src="' + avatarUrl(member) + '" alt="' + name + '" loading="eager">' + homeEnd + '</div><div><div class="pi-card__name">' + name + '<span class="' + (lang === 'cn' ? 'pi-card__name-en' : 'pi-card__name-cn') + '">' + nameOther + '</span></div><div class="pi-card__meta">' + line1 + (line1 && line2 ? '<br>' : '') + line2 + '</div></div></div>';
}

function renderMemberCard(member, lang) {
  var name = lang === 'cn' ? member.name_cn : member.name_en;
  var nameOther = lang === 'cn' ? member.name_en : member.name_cn;
  var link = memberLink(member);
  var home = link ? '<a href="' + link + '"' + (member.page ? '' : ' target="_blank" rel="noopener"') + '>' : '';
  var homeEnd = link ? '</a>' : '';
  var metaParts = [];
  // Default doctoral students to plain "PhD"; explicit degrees (e.g. MD, MD/PhD)
  // are used when provided in the data.
  var degreeText = member.degree
    ? (lang === 'cn' ? (member.degree_cn || member.degree) : member.degree)
    : (member.role === 'phd' ? (lang === 'cn' ? '博士' : 'PhD') : '');
  if (degreeText) metaParts.push(degreeText);
  if (member.university) {
    var u = lang === 'cn' ? member.university_cn : member.university;
    if (member.school) u += ' · ' + (lang === 'cn' ? member.school_cn : member.school);
    if (member.program) u += ' · ' + (lang === 'cn' ? member.program_cn : member.program);
    if (member.major) u += ' · ' + (lang === 'cn' ? member.major_cn : member.major);
    metaParts.push(u);
  }
  if (member.year) metaParts.push((lang === 'cn' ? '' : 'Class of ') + member.year + (lang === 'cn' ? '级' : ''));
  if (member.note) metaParts.push(lang === 'cn' ? member.note_cn : member.note);
  var meta = metaParts.join(' · ');
  if (member.links && member.links.github) {
    meta += ' · <a href="' + member.links.github + '" target="_blank" rel="noopener">GitHub</a>';
  }
  return '<div class="member-card"><div class="member-card__avatar">' + home + '<img src="' + avatarUrl(member) + '" alt="' + name + '" loading="eager">' + homeEnd + '</div><div class="member-card__info"><div class="member-card__name">' + name + ' <span class="' + (lang === 'cn' ? 'member-card__name-en' : 'member-card__name-cn') + '">' + nameOther + '</span></div><div class="member-card__meta">' + meta + '</div></div></div>';
}

function renderTeam(data, lang) {
  var container = document.getElementById('team-content');
  if (!container) return;
  var html = '';
  html += '<div class="section-label reveal"><span class="section-label__text">' + (lang === 'cn' ? '团队负责人' : 'Lab Leader') + '</span><span class="section-label__line"></span></div>';
  html += data.leader.map(function(m){ return renderLeader(m, lang); }).join('');

  html += '<div id="investigators" class="section-label reveal" style="margin-top:40px;"><span class="section-label__text">' + (lang === 'cn' ? '课题组PI' : 'Principal Investigators') + '</span><span class="section-label__line"></span></div>';
  html += data.pi.map(function(m){ return renderPI(m, lang); }).join('');

  if (data.postdoc && data.postdoc.length) {
    html += '<div id="postdoc" class="reveal" style="margin-top:40px;"><div class="section-label"><span class="section-label__text">' + (lang === 'cn' ? '博士后' : 'Postdoctoral Researchers') + '</span><span class="section-label__line"></span></div>';
    html += data.postdoc.map(function(m){ return renderPI(m, lang); }).join('');
    html += '</div>';
  }

  html += '<div id="phd" class="student-category reveal"><div class="section-label"><span class="section-label__text">' + (lang === 'cn' ? '博士研究生' : 'Doctoral Students') + '</span><span class="section-label__line"></span></div>';
  html += '<div class="student-category__sub"><div class="student-category__sub-label">' + (lang === 'cn' ? '工学博士（PhD）' : 'Engineering · PhD') + '</div><div class="member-grid">' + data.phd_engineering.map(function(m){ m.degree = m.degree || (lang === 'cn' ? '博士' : 'PhD'); return renderMemberCard(m, lang); }).join('') + '</div></div>';
  html += '<div class="student-category__sub"><div class="student-category__sub-label">' + (lang === 'cn' ? '医学博士（MD）' : 'Medicine · MD') + '</div><div class="member-grid">' + data.phd_medical.map(function(m){ m.degree = m.degree || (lang === 'cn' ? '医学博士' : 'MD'); return renderMemberCard(m, lang); }).join('') + '</div></div>';
  html += '</div>';

  html += '<div id="master" class="student-category reveal"><div class="section-label"><span class="section-label__text">' + (lang === 'cn' ? '硕士研究生' : 'Master Students') + '</span><span class="section-label__line"></span></div>';
  html += '<div class="student-category__sub"><div class="student-category__sub-label">' + (lang === 'cn' ? '工学硕士' : 'Engineering') + '</div><div class="member-grid">' + data.master_engineering.map(function(m){ return renderMemberCard(m, lang); }).join('') + '</div></div>';
  html += '<div class="student-category__sub"><div class="student-category__sub-label">' + (lang === 'cn' ? '医学硕士' : 'Medicine') + '</div><div class="member-grid">' + data.master_medical.map(function(m){ return renderMemberCard(m, lang); }).join('') + '</div></div>';
  html += '</div>';

  html += '<div id="alumni" class="alumni-section reveal" style="margin-top:48px;"><div class="section-label"><span class="section-label__text">' + (lang === 'cn' ? '毕业致谢' : 'Alumni') + '</span><span class="section-label__line"></span></div><div class="member-grid">' + data.alumni.map(function(m){ return renderMemberCard(m, lang); }).join('') + '</div></div>';

  container.innerHTML = html;

  setTimeout(function(){
    var r = container.querySelectorAll('.reveal');
    var o = new IntersectionObserver(function(e){
      e.forEach(function(x){ if (x.isIntersecting) x.target.classList.add('visible'); });
    }, { threshold: 0.06 });
    r.forEach(function(x){ o.observe(x); });
  }, 50);
}
