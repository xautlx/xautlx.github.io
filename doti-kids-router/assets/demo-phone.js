// 首屏手机演示：用 demo-core.js（小程序演示模式同一份逻辑）画状态页，结构和类名照小程序 pages/status/status.wxml（类名加 m- 前缀，
// 样式是 demo-ui.css，从小程序 wxss 转来）。快进 30 分、临时安排和小程序一样算。没人动时每隔几秒自动快进一次；一碰手机就停。
// 中英两种：中文直接用小程序的文案（rules.card / demo.forward）；英文按同样的状态在这里另写文案（跟着官网 html[data-lang] 切换）。
(function () {
  var box = document.getElementById('dphone'); if (!box || !window.DotiDemo) return
  var D = window.DotiDemo, R = D.rules, U = D.usage, demo = D.demo
  var SHOW = ['k1', 'k2']   // 三娃的 WiFi 在示例里是关的，首屏只放两张
  var scr = box.querySelector('.scr'), ui = box.querySelector('.dui'), list = ui.querySelector('.m-cards'),
    msgEl = ui.querySelector('.m-fab-msg'), sheet = ui.querySelector('.m-sheet')
  var touched = false, auto = null, autoN = 0, msgT = null, at = 0, sheetKey = ''
  var live = 'k1', liveT = null   // 展开最近 5 分钟网速的网络（点底行右边的网速展开 / 收起），首屏默认展开第一张
  var root = document.documentElement
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] }) }
  function en() { return root.getAttribute('data-lang') === 'en' }

  // ---------- 文案 ----------
  var T = {
    zh: { nav: '一点守护', router: '一点守护路由器 DEMO', home: '● 已连接', demo: '演示模式', ff: '快进 30 分', reset: '重来',
      tab0: '状态', tab1: '孩子', tab2: '路由器', tab3: '我的', ssub: '只管今天，过了半夜 12 点自动取消',
      oa: '今天一直开放', oad: '到今晚 12 点，睡觉时间也不限速', la: '今天一直限速', lad: '到今晚 12 点', cancel: '取消',
      more: '其他临时安排', live: '最近 5 分钟网速', every: '每 10 秒刷新', peak: '最高 ', ago: '5 分钟前', now: '现在',
      full: '请微信搜索小程序「一点守护」完整体验', again: '从头再演示一遍', back: '已回到开始：大宝这一轮还能用 22 分钟', today: ' · 今天的临时安排' },
    en: { nav: 'Doti', router: 'Doti Router DEMO', home: '● Connected', demo: 'Demo', ff: '+30 min', reset: 'Reset',
      tab0: 'Status', tab1: 'Kids', tab2: 'Router', tab3: 'Me', ssub: 'For today only — resets at midnight',
      oa: 'Open all day', oad: 'Until midnight, bedtime included', la: 'Slow all day', lad: 'Until midnight', cancel: 'Cancel',
      more: 'More options', live: 'Last 5 minutes', every: 'Every 10 s', peak: 'Peak ', ago: '5 min ago', now: 'Now',
      full: 'Search WeChat for the mini program “一点守护” for the full experience', again: 'Playing the demo again',
      back: 'Back to the start: Kid 1 has 22 min left this round', today: ' · Today only' }
  }
  function t(k) { return T[en() ? 'en' : 'zh'][k] }
  var NAMES = { k1: "Kid 1's network", k2: "Kid 2's network", k3: "Kid 3's network" }
  function nameOf(n) { return en() ? NAMES[n.key] || n.name : n.name }

  // 英文状态卡（对应 rules.card：同样的状态、同样的按钮动作）
  function mins(m) { return m < 60 ? m + ' min' : (m % 60 ? Math.floor(m / 60) + ' h ' + m % 60 + ' min' : m / 60 + ' h') }
  function leftEn(s) { return s >= 3600 ? Math.floor(s / 3600) + ' h ' + Math.round((s % 3600) / 60) + ' min' : Math.max(1, Math.round(s / 60)) + ' min' }
  function atEn(x, now) {
    if (!x) return ''
    var d = new Date(x * 1000), n0 = new Date(now * 1000), s = d.getHours() + ':' + String(d.getMinutes()).padStart(2, '0')
    return d.toDateString() === n0.toDateString() ? s : 'tomorrow ' + s
  }
  function winEn(name) { var b = String(name || '').replace(/（.*）$/, ''); return /睡觉/.test(b) ? 'Bedtime' : /网课/.test(b) ? 'Online class' : 'Scheduled' }
  function cardEn(n, now) {
    var o
    switch (n.period) {
      case 'smartOpen': o = { cls: 'open', tag: 'Smart open', desc: n.surfMin === 1440 ? 'No limit per round — always open'
        : leftEn(n.remainSec) + ' left, then ' + (n.limitMin === 1440 ? 'slow for the rest of today' : 'slow for ' + mins(n.limitMin)) }; break
      case 'smartLimit': o = n.surfMin === 0 ? { cls: 'limit', tag: 'Slow all day', desc: 'Rounds are set to “slow all day”' }
        : n.limitMin === 1440 ? { cls: 'limit', tag: 'Done for today', desc: 'This ' + mins(n.surfMin) + ' round is used up — slow until midnight' }
        : { cls: 'limit', tag: 'Smart slow-down', desc: 'Taking a break — full speed at ' + atEn(now + (n.remainSec || 0), now) }; break
      case 'fixedOpen': o = { cls: 'open', tag: winEn(n.periodName), desc: 'Open until ' + atEn(n.next, now) + ', then back to auto' }; break
      case 'fixedLimit': o = { cls: 'limit', tag: winEn(n.periodName), desc: 'Full speed at ' + atEn(n.next, now) }; break
      case 'tempOpen': o = { cls: 'open', temp: true, tag: 'Open for ' + mins(n.plan.minutes), desc: 'Until ' + atEn(n.plan.until, now) + ', then back to auto' }; break
      case 'allOpen': o = { cls: 'open', temp: true, tag: 'Open all day', desc: 'Until midnight, bedtime included' }; break
      case 'allLimit': o = { cls: 'limit', temp: true, tag: 'Slow all day', desc: 'Until midnight' }; break
      case 'quotaDone': o = { cls: 'limit', tag: 'Done for today', desc: 'Daily max of ' + mins(n.dailyMaxMin) + ' reached — back at midnight' }; break
      default: o = { cls: 'off', tag: '', desc: 'Status unavailable' }
    }
    o.word = o.cls === 'open' ? 'Full speed' : o.cls === 'limit' ? (n.limitKbps === 0 ? 'Offline' : 'Slowed') : '—'
    o.main = n.plan ? { action: 'auto', text: 'Cancel plan' } : o.cls === 'limit' ? { action: 'open', minutes: 30, text: 'Open 30 min' } : { action: 'openAll', text: 'Open all day' }
    o.used = 'Online today: ' + mins(n.onlineMinToday != null ? n.onlineMinToday : n.usedMinToday || 0)
    return o
  }
  // 英文快进说明（对应 demo.forward 的中文说明）
  function ffEn(before, after) {
    for (var i = 0; i < after.length; i++) {
      var a = before[after[i].key], b = after[i].period, nm = NAMES[after[i].key]
      if (a === b || !after[i].wifiOn) continue
      if (b === 'smartLimit') return '+30 min: ' + nm + ' used up this round — speed slowed down'
      if (b === 'quotaDone') return '+30 min: ' + nm + ' hit today’s limit — slow until midnight'
      if (b === 'smartOpen') return '+30 min: ' + nm + '’s break is over — full speed again'
    }
    return '+30 min: the kids kept using the internet, time keeps counting'
  }

  // ---------- 画面 ----------
  // 屏幕里按 375 宽排版，整体缩放到实际屏幕宽度
  function fit() { ui.style.setProperty('--z', scr.clientWidth / 375) }
  fit(); window.addEventListener('resize', fit)
  // 暗黑跟官网的外观设置（data-theme 或跟随系统）；语言跟官网 data-lang
  var mq = window.matchMedia('(prefers-color-scheme: dark)')
  function theme() { var x = root.getAttribute('data-theme'); root.classList.toggle('dk', x ? x === 'dark' : mq.matches) }
  function statics() { ui.querySelectorAll('[data-t]').forEach(function (e) { e.textContent = t(e.dataset.t) }) }
  theme(); statics()
  new MutationObserver(function () { theme(); statics(); if (list.childElementCount) { render(); if (sheetKey) openSheet(sheetKey) } })
    .observe(root, { attributes: true, attributeFilter: ['data-theme', 'data-lang'] })
  function reTheme() { theme(); render() }
  mq.addEventListener ? mq.addEventListener('change', reTheme) : mq.addListener(reTheme)

  function start() { demo.enter(); render() }
  function render() {
    var r = demo.api('status'); at = r.now
    list.classList.toggle('m-roomy', !live)   // 展开网速时用紧凑排版（小程序也是放不下就紧凑）
    list.innerHTML = r.networks.filter(function (n) { return SHOW.indexOf(n.key) >= 0 }).map(function (n) {
      var c = en() ? cardEn(n, r.now) : R.card(n, r.now), rate = n.speed ? U.speedText(n.speed.down + n.speed.up) : '—'
      var lv = live === n.key ? liveData(n.key) : null
      return '<div class="m-kid m-' + n.key + ' m-t-' + c.cls + '">' +
        '<div class="m-gname">' + esc(nameOf(n)) + '</div>' +
        '<div class="m-ssid"><img class="m-wf thl" src="assets/demo/wifi.svg" alt=""><img class="m-wf thd" src="assets/demo/wifi-dark.svg" alt="">DOTI-DEMO-0' + n.key.slice(1) + '</div>' +
        '<div class="m-head" data-a="info"><div class="m-top"><div class="m-ic">' + (c.cls === 'open' ? '✓' : '!') + '</div><div class="m-w">' + c.word + '</div>' +
        (c.tag ? '<div class="m-ptag' + (c.temp ? ' m-temp' : '') + '">' + esc(c.tag) + '</div>' : '') + '</div>' +
        '<div class="m-desc">' + esc(c.desc) + '<span class="wxt"> ›</span></div></div>' +
        '<div class="m-btns"><div class="m-bb m-main" data-a="' + c.main.action + '" data-k="' + n.key + '" data-m="' + (c.main.minutes || '') + '">' + c.main.text + '</div>' +
        '<div class="m-bb m-ghost" data-a="more" data-k="' + n.key + '">' + t('more') + '</div></div>' +
        '<div class="m-foot"><div class="m-used" data-a="info">' + esc(c.used) + ' ›</div><div class="m-rate" data-a="live" data-k="' + n.key + '">' + (lv ? lv.now : rate) + '<div class="m-tri' + (lv ? ' m-up' : '') + '"></div></div></div>' +
        (lv ? '<div class="m-live" data-a="info"><div class="m-lh"><span class="wxt">' + t('live') + '</span><span class="wxt">' + t('every') + '</span></div>' +
          '<div class="m-tchart">' + (lv.svg ? '<img class="m-curve" src="' + lv.svg + '" alt="">' : '') + (lv.top ? '<div class="m-tl"><span class="wxt">' + t('peak') + lv.top + '</span></div>' : '') + '</div>' +
          '<div class="m-lx"><span class="wxt">' + t('ago') + '</span><span class="wxt">' + t('now') + '</span></div></div>' : '') + '</div>'
    }).join('')
  }
  // 最近 5 分钟网速曲线：和小程序同一个画法（usage.trend，30 个点）
  function liveData(k) {
    var x = demo.api('speed').networks.filter(function (v) { return v.key === k })[0]
    return U.trend(x && x.points, 30, 600, 140, root.classList.contains('dk'))
  }
  function liveRun() { clearInterval(liveT); if (live) liveT = setInterval(render, 10000) }
  function say(m) { msgEl.textContent = m; msgEl.classList.add('on'); clearTimeout(msgT); msgT = setTimeout(function () { msgEl.classList.remove('on') }, 3800) }
  function ff() {
    var before = {}; demo.api('status').networks.forEach(function (n) { before[n.key] = n.period })
    var zh = demo.forward(30)
    say(en() ? ffEn(before, demo.api('status').networks) : zh); render()
  }
  function today(k, a, m) { demo.api('today', { method: 'POST', data: { key: k, action: a, minutes: m ? +m : undefined } }); render() }

  // 今天的临时安排（照小程序 status.wxml 的面板）
  function openSheet(k) {
    sheetKey = k
    var n = demo.api('status').networks.filter(function (x) { return x.key === k })[0], plan = n.plan ? (n.plan.action === 'open' ? 'open' + n.plan.minutes : n.plan.action) : ''
    sheet.querySelector('.m-title').textContent = nameOf(n) + t('today')
    sheet.querySelector('.m-mins').innerHTML = R.openOpts(at).map(function (o) {
      var txt = en() ? 'Open ' + mins(o.m) : o.text
      var until = !en() ? o.until : o.until.indexOf(':') < 0 ? 'until midnight' : 'until ' + o.until.replace(/^到 /, '')
      return '<div class="m-mo' + (plan === 'open' + o.m ? ' m-on' : '') + '" data-a="open" data-k="' + k + '" data-m="' + o.m + '"><div class="m-mn">' + txt + '</div><div class="m-mu">' + until + '</div></div>'
    }).join('')
    sheet.querySelectorAll('.m-opt').forEach(function (b) { b.dataset.k = k; b.classList.toggle('m-on', plan === b.dataset.a) })
    box.classList.add('sheet')
  }
  function closeSheet() { sheetKey = ''; box.classList.remove('sheet') }

  ui.addEventListener('click', function (e) {
    var b = e.target.closest('[data-a]'); if (!b) return
    var a = b.dataset.a
    if (a === 'ff') return ff()
    if (a === 'reset') { closeSheet(); start(); return say(t('back')) }
    if (a === 'more') return openSheet(b.dataset.k)
    if (a === 'close') return closeSheet()
    if (a === 'live') { live = live === b.dataset.k ? '' : b.dataset.k; render(); return liveRun() }
    if (a === 'info' || a === 'tab') return say(t('full'))
    closeSheet(); today(b.dataset.k, a, b.dataset.m)
  })
  // 访客一碰手机就停止自动演示
  box.addEventListener('pointerdown', function () { touched = true; clearInterval(auto); box.classList.remove('hint') })

  start(); liveRun()
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!reduce) setTimeout(function () {
    if (touched) return
    box.classList.add('hint')
    ff()
    auto = setInterval(function () { if (touched) return clearInterval(auto); if (++autoN >= 5) { autoN = 0; start(); return say(t('again')) } ff() }, 6500)
  }, 3500)
})()
