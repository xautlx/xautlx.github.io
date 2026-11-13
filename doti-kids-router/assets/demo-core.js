// 自动生成，别手改：python3 scripts/build-site-demo.py（来源 miniapp/miniprogram/lib/rules.js、usage.js、demo.js）
(function() {
    var wx = {
        switchTab: function() {},
        reLaunch: function() {}
    };
    var defs = {}, cache = {};
    function req(p) {
        var k = p.replace(/^\.\//, "");
        if (!cache[k]) {
            var m = {
                exports: {}
            };
            cache[k] = m;
            defs[k](m, m.exports, req);
        }
        return cache[k].exports;
    }
    defs["rules"] = function(module, exports, require) {
        const SURF = [ 15, 30, 45, 60, 75, 90, 120, 240, 1440, 0 ];
        const LIMIT = [ 15, 30, 45, 60, 75, 90, 120, 240, 1440 ];
        const DAILY = [ 30, 60, 90, 120, 180, 240, 480, 720, 960, 0 ];
        const sleep = (a, b) => a ? [ {
            id: "w1",
            kind: "limit",
            name: "睡觉",
            days: [ 7, 1, 2, 3, 4 ],
            start: a[0],
            end: a[1]
        }, {
            id: "w2",
            kind: "limit",
            name: "睡觉（周末）",
            days: [ 5, 6 ],
            start: b[0],
            end: b[1]
        } ] : [];
        const TEMPLATES = [ {
            key: "preschool",
            name: "学龄前",
            short: "前",
            sub: "3–6 岁 · 看一小会儿，玩一大会儿",
            surfMin: 30,
            limitMin: 75,
            dailyMaxMin: 60,
            sleep: [ [ "20:00", "07:00" ], [ "21:00", "08:00" ] ]
        }, {
            key: "lower",
            name: "小学低年级",
            short: "低",
            sub: "1–3 年级 · 短时多歇",
            surfMin: 30,
            limitMin: 60,
            dailyMaxMin: 90,
            sleep: [ [ "21:00", "07:00" ], [ "22:00", "08:00" ] ]
        }, {
            key: "upper",
            name: "小学高年级",
            short: "高",
            sub: "4–6 年级 · 用一阵、慢一阵",
            surfMin: 30,
            limitMin: 45,
            dailyMaxMin: 120,
            sleep: [ [ "21:30", "07:00" ], [ "22:30", "08:00" ] ]
        }, {
            key: "teen",
            name: "中学以上",
            short: "中",
            sub: "初中、高中 · 留出自己安排的空间",
            surfMin: 45,
            limitMin: 30,
            dailyMaxMin: 180,
            sleep: [ [ "22:30", "06:30" ], [ "23:30", "07:30" ] ]
        }, {
            key: "onDemand",
            name: "按需开放",
            short: "需",
            sub: "任何年龄 · 平时一直限速，要用网找家长临时开放",
            surfMin: 0,
            limitMin: 1440,
            dailyMaxMin: 0,
            sleep: null
        } ];
        const tplOf = k => TEMPLATES.find(t => t.key === k) || null;
        function fromTemplate(key, net) {
            const t = tplOf(key);
            return {
                ...ADV_DEFAULT,
                ...net,
                template: key,
                surfMin: t.surfMin,
                limitMin: t.limitMin,
                dailyMaxMin: t.dailyMaxMin,
                windows: sleep(...t.sleep || [])
            };
        }
        const ADV_DEFAULT = {
            limitKbps: 100,
            kidView: "detail",
            lanFree: true,
            allowDoh: true
        };
        const advIsDefault = n => Object.keys(ADV_DEFAULT).every(k => n[k] == null || n[k] === ADV_DEFAULT[k]);
        const SPEEDS = [ {
            v: 0,
            n: "断网",
            d: "孩子 WiFi 还连着，但什么都上不了；家长在孩子 WiFi 上用小程序管理不受影响"
        }, {
            v: 100,
            n: "很慢",
            tag: "默认",
            d: "约 12KB/s：能发文字消息，图片要等很久，视频放不了"
        }, {
            v: 500,
            n: "慢",
            d: "约 60KB/s：能看图、发语音，视频基本还是放不了"
        } ];
        const speedName = v => (SPEEDS.find(x => x.v === (v == null ? 100 : v)) || SPEEDS[1]).n;
        function advSummary(n) {
            const a = [];
            if (n.limitKbps != null && n.limitKbps !== 100) a.push(n.limitKbps === 0 ? "限速时断网" : "限速时网速" + speedName(n.limitKbps));
            if (n.lanFree === false) a.push("局域网也计时");
            if (n.kidView === "simple") a.push("孩子查看极简");
            if (n.allowDoh === false) a.push("拦截加密 DNS");
            return a.join(" · ");
        }
        function adjusted(net) {
            const t = tplOf(net.template);
            if (!t) return false;
            const w = sleep(...t.sleep || []);
            const same = (a, b) => JSON.stringify(a.map(x => [ x.kind, x.name, x.days.slice().sort(), x.start, x.end ])) === JSON.stringify(b.map(x => [ x.kind, x.name, x.days.slice().sort(), x.start, x.end ]));
            return net.surfMin !== t.surfMin || net.limitMin !== t.limitMin || net.dailyMaxMin !== t.dailyMaxMin || !same(net.windows || [], w);
        }
        const dur = min => min <= 90 ? min + " 分钟" : min / 60 + " 小时";
        const hours = min => min < 60 ? min + " 分钟" : min / 60 + " 小时";
        const surfLabel = m => m === 0 ? "全天一直限速" : m === 1440 ? "全天一直开放" : dur(m);
        const limitLabel = m => m === 1440 ? "全天一直限速" : dur(m);
        const dailyLabel = m => m === 0 ? "不限" : hours(m);
        const WEEK = [ "", "一", "二", "三", "四", "五", "六", "日" ];
        function daysLabel(days) {
            const d = days.slice().sort((a, b) => a - b).join(",");
            if (d === "1,2,3,4,5,6,7") return "每天";
            if (d === "1,2,3,4,5") return "周一至周五";
            if (d === "6,7") return "周六、周日";
            if (d === "1,2,3,4,7") return "周日至周四";
            if (d === "5,6") return "周五、周六";
            return days.slice().sort((a, b) => a - b).map(x => "周" + WEEK[x]).join("、");
        }
        const hm = t => {
            const d = new Date(t * 1e3);
            return String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
        };
        function usedText(min) {
            const h = Math.floor(min / 60), m = min % 60;
            return h ? `${h} 小时${m ? " " + String(m).padStart(2, "0") + " 分" : ""}` : `${m} 分`;
        }
        const ACTIONS = {
            openAll: "今天一直开放",
            limitAll: "今天一直限速"
        };
        const planOn = (n, now) => !!(n && n.plan && (n.plan.action !== "open" || !n.plan.until || n.plan.until > (now || Math.floor(Date.now() / 1e3))));
        function planText(p) {
            return p.action === "open" ? "临时开放 " + minLabel(p.minutes) : ACTIONS[p.action];
        }
        const minLabel = m => m < 60 ? m + " 分钟" : m / 60 + " 小时";
        const OPEN_MINS = [ 15, 30, 45, 60, 90, 120, 240, 360 ];
        function openOpts(now) {
            const mid = new Date(now * 1e3);
            mid.setHours(24, 0, 0, 0);
            return OPEN_MINS.map(m => {
                const end = now + m * 60;
                return {
                    m: m,
                    text: "开放 " + minLabel(m),
                    until: end >= mid.getTime() / 1e3 ? "到今晚 12 点" : "到 " + hm(end)
                };
            });
        }
        function card(n, now, parents) {
            now = now || Math.floor(Date.now() / 1e3);
            const left = s => s >= 3600 ? `${Math.floor(s / 3600)} 小时 ${Math.round(s % 3600 / 60)} 分钟` : `${Math.max(1, Math.round(s / 60))} 分钟`;
            const at = t => {
                if (!t) return "";
                const d = new Date(t * 1e3), n0 = new Date(now * 1e3), s = d.getHours() + ":" + String(d.getMinutes()).padStart(2, "0");
                return d.toDateString() === n0.toDateString() ? s : "明天 " + s;
            };
            const by = p => {
                const x = (parents || []).find(q => q.idx === p.by);
                return x ? x.nick || "家长" : "";
            };
            const who = p => by(p) ? `${by(p)}设的` : "";
            const win = name => {
                const b = String(name || "").replace(/（.*）$/, "").trim() || "固定时段";
                return /(时间|时段)$/.test(b) ? b : b + "时间";
            };
            let o;
            switch (n.period) {
              case "smartOpen":
                o = {
                    cls: "open",
                    tag: "智能开放时段",
                    desc: n.surfMin === 1440 ? "设置里每轮不限时，一直开放" : `还能用 ${left(n.remainSec)}，用完${n.limitMin === 1440 ? "今天一直限速" : "限速 " + dur(n.limitMin)}`,
                    note: n.surfMin === 1440 ? "" : "只算真正上网的时间"
                };
                break;

              case "smartLimit":
                o = n.surfMin === 0 ? {
                    cls: "limit",
                    tag: "全天限速",
                    desc: "设置里每轮可用选了「全天一直限速」"
                } : n.limitMin === 1440 ? {
                    cls: "limit",
                    tag: "今天用完了",
                    desc: `这一轮 ${dur(n.surfMin)}用完，今天一直限速，明天 0 点恢复`
                } : {
                    cls: "limit",
                    tag: "智能限速时段",
                    desc: `休息一下，${at(now + (n.remainSec || 0))} 恢复开放`
                };
                break;

              case "fixedOpen":
                o = {
                    cls: "open",
                    tag: win(n.periodName),
                    desc: `开放到 ${at(n.next)}，之后恢复自动管理`
                };
                break;

              case "fixedLimit":
                o = {
                    cls: "limit",
                    tag: win(n.periodName),
                    desc: `${at(n.next)} 恢复开放`
                };
                break;

              case "tempOpen":
                o = {
                    cls: "open",
                    temp: true,
                    tag: `临时开放 ${minLabel(n.plan.minutes)}`,
                    desc: `到 ${at(n.plan.until)} 结束，之后恢复自动管理`,
                    note: who(n.plan)
                };
                break;

              case "allOpen":
                o = {
                    cls: "open",
                    temp: true,
                    tag: "今天一直开放",
                    desc: "到今晚 12 点，睡觉时间也不限速",
                    note: who(n.plan)
                };
                break;

              case "allLimit":
                o = {
                    cls: "limit",
                    temp: true,
                    tag: "今天一直限速",
                    desc: "到今晚 12 点",
                    note: who(n.plan)
                };
                break;

              case "quotaDone":
                o = {
                    cls: "limit",
                    tag: "今天用完了",
                    desc: `每天最多 ${dailyLabel(n.dailyMaxMin)}，明天 0 点恢复`
                };
                break;

              default:
                o = {
                    cls: "off",
                    tag: "",
                    desc: "读不到状态，路由器可能正在启动"
                };
            }
            o.word = o.cls === "open" ? "开放中" : o.cls === "limit" ? n.limitKbps === 0 ? "断网中" : "限速中" : "读不到";
            o.main = planOn(n, now) ? {
                action: "auto",
                text: "取消临时安排"
            } : {
                action: "open",
                minutes: 30,
                text: "开放 30 分钟"
            };
            o.used = n.onlineMinToday != null ? `今天已上网 ${usedText(n.onlineMinToday)}` : `今天用了 ${usedText(n.usedMinToday || 0)}` + (n.dailyMaxMin ? `（最多 ${dailyLabel(n.dailyMaxMin)}）` : "");
            return o;
        }
        function kidCard(n, now, view) {
            now = now || Math.floor(Date.now() / 1e3);
            if (!n) return {
                cls: "off",
                word: "读不到",
                desc: "路由器可能正在启动，稍等一下"
            };
            if (view === "simple") return n.open ? {
                cls: "open",
                word: "开放中",
                desc: "现在可以上网"
            } : {
                cls: "limit",
                word: "休息中",
                desc: "现在休息一下"
            };
            const left = s => s >= 3600 ? `${Math.floor(s / 3600)} 小时 ${Math.round(s % 3600 / 60)} 分钟` : `${Math.max(1, Math.round(s / 60))} 分钟`;
            const at = t => {
                if (!t) return "";
                const d = new Date(t * 1e3), n0 = new Date(now * 1e3), s = d.getHours() + ":" + String(d.getMinutes()).padStart(2, "0");
                return d.toDateString() === n0.toDateString() ? s : "明天早上 " + s;
            };
            const win = name => {
                const b = String(name || "").replace(/（.*）$/, "").trim() || "休息";
                return /(时间|时段)$/.test(b) ? b : b + "时间";
            };
            let o;
            switch (n.period) {
              case "smartOpen":
                o = {
                    cls: "open",
                    word: "开放中",
                    desc: n.surfMin === 1440 ? "现在可以一直上网" : `这一轮还能用 ${left(n.remainSec || 0)}，${n.limitMin === 1440 ? "用完今天就休息了" : "用完休息 " + dur(n.limitMin)}`
                };
                break;

              case "smartLimit":
                o = n.surfMin === 0 ? {
                    cls: "limit",
                    word: "休息中",
                    desc: "要用网的时候找爸爸妈妈"
                } : n.limitMin === 1440 ? {
                    cls: "limit",
                    word: "今天用完了",
                    desc: "明天恢复开放"
                } : {
                    cls: "limit",
                    word: "休息中",
                    desc: `${at(now + (n.remainSec || 0))} 恢复开放`
                };
                break;

              case "fixedOpen":
                o = {
                    cls: "open",
                    word: "开放中",
                    tag: win(n.periodName),
                    desc: `开放到 ${at(n.next)}`
                };
                break;

              case "fixedLimit":
                o = {
                    cls: "limit",
                    word: win(n.periodName),
                    desc: `${at(n.next)} 恢复开放`
                };
                break;

              case "tempOpen":
                o = {
                    cls: "open",
                    word: "开放中",
                    tag: "爸爸妈妈临时开放",
                    temp: true,
                    desc: `到 ${at(n.plan && n.plan.until)}，之后恢复平常的规则`
                };
                break;

              case "allOpen":
                o = {
                    cls: "open",
                    word: "开放中",
                    tag: "今天一直开放",
                    temp: true,
                    desc: "到今晚 12 点"
                };
                break;

              case "allLimit":
                o = {
                    cls: "limit",
                    word: "休息中",
                    tag: "今天一直休息",
                    temp: true,
                    desc: "到今晚 12 点"
                };
                break;

              case "quotaDone":
                o = {
                    cls: "limit",
                    word: "今天用完了",
                    desc: "明天恢复开放"
                };
                break;

              default:
                o = {
                    cls: "off",
                    word: "读不到",
                    desc: "路由器可能正在启动，稍等一下"
                };
            }
            const pct = (a, b) => Math.max(0, Math.min(100, Math.round(a * 100 / b)));
            if (n.period === "smartOpen" && n.surfMin > 0 && n.surfMin < 1440) {
                const used = Math.max(0, Math.round((n.surfMin * 60 - (n.remainSec || 0)) / 60));
                o.round = {
                    used: used + " 分",
                    total: "每轮 " + dur(n.surfMin),
                    pct: pct(used, n.surfMin)
                };
            }
            const usedMin = n.onlineMinToday != null ? n.onlineMinToday : n.usedMinToday || 0;
            o.today = {
                used: usedText(usedMin),
                max: n.dailyMaxMin ? "每天最多 " + dailyLabel(n.dailyMaxMin) : "每天不限",
                pct: n.dailyMaxMin ? pct(usedMin, n.dailyMaxMin) : null
            };
            return o;
        }
        function tplLine(t) {
            if (t.surfMin === 0 || t.surfMin === 1440) return "每轮可用：" + surfLabel(t.surfMin);
            if (t.limitMin === 1440) return `每轮 ${dur(t.surfMin)} · 之后当日一直限速 · 每天${t.dailyMaxMin ? "最多 " + dailyLabel(t.dailyMaxMin) : "不限"}`;
            return `每轮 ${dur(t.surfMin)} · 限速 ${dur(t.limitMin)} · 每天最多 ${dailyLabel(t.dailyMaxMin)}` + (t.sleep ? ` · 睡觉 ${t.sleep[0][0]}（周五六 ${t.sleep[1][0]}）` : "");
        }
        function cleanDomain(x) {
            let d = String(x == null ? "" : x).trim().toLowerCase();
            d = d.replace(/^[a-z][a-z0-9+.-]*:\/\//, "").replace(/[/?#].*$/, "").replace(/:\d+$/, "").replace(/^\*\./, "").replace(/^www\./, "").replace(/\.$/, "");
            if (d.length < 3 || d.length > 253 || !/^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(d)) return "";
            if (d.split(".").some(p => !p || p.length > 63 || p[0] === "-" || p[p.length - 1] === "-")) return "";
            return d;
        }
        const hm0 = t => String(t).replace(/^0(\d)/, "$1");
        function ruleRows(n) {
            const rows = [ {
                k: "每轮可用",
                v: surfLabel(n.surfMin)
            } ];
            if (n.surfMin !== 0 && n.surfMin !== 1440) rows.push({
                k: "用完限速",
                v: limitLabel(n.limitMin)
            }, {
                k: "每天最多",
                v: dailyLabel(n.dailyMaxMin)
            });
            return rows;
        }
        const winRows = ws => (ws || []).map(w => ({
            name: w.name || (w.kind === "open" ? "开放" : "限速"),
            kind: w.kind,
            time: hm0(w.start) + "–" + hm0(w.end)
        }));
        const sameAsTpl = (n, key) => !adjusted({
            ...n,
            template: key
        });
        module.exports = {
            planOn: planOn,
            kidCard: kidCard,
            SPEEDS: SPEEDS,
            speedName: speedName,
            advSummary: advSummary,
            ruleRows: ruleRows,
            winRows: winRows,
            sameAsTpl: sameAsTpl,
            minLabel: minLabel,
            openOpts: openOpts,
            OPEN_MINS: OPEN_MINS,
            cleanDomain: cleanDomain,
            tplLine: tplLine,
            SURF: SURF,
            LIMIT: LIMIT,
            DAILY: DAILY,
            TEMPLATES: TEMPLATES,
            tplOf: tplOf,
            fromTemplate: fromTemplate,
            adjusted: adjusted,
            dur: dur,
            surfLabel: surfLabel,
            limitLabel: limitLabel,
            dailyLabel: dailyLabel,
            daysLabel: daysLabel,
            hm: hm,
            usedText: usedText,
            card: card,
            planText: planText,
            ADV_DEFAULT: ADV_DEFAULT,
            advIsDefault: advIsDefault
        };
    };
    defs["usage"] = function(module, exports, require) {
        const WEEK = [ "日", "一", "二", "三", "四", "五", "六" ];
        function minText(m) {
            const h = Math.floor(m / 60), r = m % 60;
            return h ? `${h} 小时${r ? " " + r + " 分" : ""}` : `${r} 分`;
        }
        function sizeText(b) {
            if (b >= 1e9) return (b / 1e9).toFixed(1) + "GB";
            if (b >= 1e6) return Math.round(b / 1e6) + "MB";
            return Math.max(0, Math.round(b / 1e3)) + "KB";
        }
        function build(days, key, mac, last = "今天") {
            const week = (days || []).map((d, i, all) => {
                const n = (d.networks || []).find(x => x.key === key);
                const hs = n ? n.hours : [];
                const open = hs.reduce((s, h) => s + (mac ? ((h.devs || []).find(v => v.mac === mac) || {
                    openMin: 0
                }).openMin : h.openMin), 0), limit = 0;
                const dt = new Date(d.date.replace(/-/g, "/"));
                return {
                    date: d.date,
                    has: d.has !== false,
                    label: i === all.length - 1 ? last : WEEK[dt.getDay()],
                    open: open,
                    limit: limit,
                    total: open + limit,
                    md: dt.getMonth() + 1 + " 月 " + dt.getDate() + " 日",
                    hours: hs,
                    events: (d.events || {})[key] || null
                };
            });
            const avgMin = week.length ? Math.round(week.reduce((s, d) => s + d.total, 0) / week.length) : 0;
            return {
                week: week,
                avgMin: avgMin
            };
        }
        function hoursOf(day, mac) {
            const out = [];
            for (let h = 0; h < 24; h++) {
                let x = (day.hours || []).find(v => v.h === h) || {
                    openMin: 0,
                    limitMin: 0,
                    bytes: 0
                };
                if (mac) {
                    const d = (x.devs || []).find(v => v.mac === mac);
                    x = d ? {
                        openMin: d.openMin,
                        bytes: d.down + d.up
                    } : {
                        openMin: 0,
                        bytes: 0
                    };
                }
                out.push({
                    h: h,
                    open: x.openMin,
                    limit: 0,
                    total: x.openMin,
                    bytes: x.bytes,
                    tip: `${String(h).padStart(2, "0")}:00–${String(h + 1).padStart(2, "0")}:00 · 在用 ${minText(x.openMin)} · ${sizeText(x.bytes)}`
                });
            }
            return out;
        }
        const LONG_MIN = 360;
        function trimHours(hours, windows, date) {
            const toM = t => +t.slice(0, 2) * 60 + +t.slice(3, 5);
            const d = new Date(date.replace(/-/g, "/")), dow = d.getDay() || 7, prev = dow === 1 ? 7 : dow - 1;
            const cover = [], skipped = [];
            for (const w of windows || []) {
                if (w.kind !== "limit") continue;
                const s = toM(w.start), e = toM(w.end), len = e > s ? e - s : 1440 - s + e;
                if (len < LONG_MIN) continue;
                let hit = false;
                if (w.days.includes(dow)) {
                    cover.push([ s, Math.min(1440, s + len) ]);
                    hit = true;
                }
                if (e <= s && w.days.includes(prev)) {
                    cover.push([ 0, e ]);
                    hit = true;
                }
                if (hit) skipped.push(`${w.name} ${w.start}–${w.end}`);
            }
            const out = hours.filter(x => x.total > 0 || !cover.some(([a, b]) => a <= x.h * 60 && (x.h + 1) * 60 <= b));
            return {
                hours: out,
                skipped: out.length < hours.length ? skipped : []
            };
        }
        function untilNow(hours, nowH, min = 7) {
            if (nowH == null) return hours;
            const n = Math.max(min, hours.filter(x => x.h <= nowH + 1).length);
            return hours.slice(0, n);
        }
        function xlabs(hours, curH) {
            const step = Math.max(1, Math.ceil(hours.length / 8));
            const out = hours.map((x, i) => ({
                h: x.h,
                t: i % step === 0 ? String(x.h) : ""
            }));
            const i = curH == null ? -1 : out.findIndex(x => x.h === curH);
            if (i >= 0) {
                out[i].t = String(curH);
                out[i].cur = true;
                if (step > 1) for (const j of [ i - 1, i + 1 ]) if (out[j]) out[j].t = "";
            }
            return out;
        }
        const TYPE = {
            phone: "手机",
            pc: "电脑",
            tv: "电视",
            other: "设备"
        };
        function devName(mac, info) {
            const i = info || {};
            return i.name || i.host || (TYPE[i.type] || TYPE.other) + " · " + mac.replace(/:/g, "").slice(-4).toUpperCase();
        }
        function devSub(info) {
            const i = info || {}, t = TYPE[i.type] || TYPE.other;
            if (i.name) return i.host || t;
            return i.host ? t : "没有报名字";
        }
        function devicesOf(day, devices) {
            const m = {};
            for (const x of [].concat(day)) for (const h of x && x.hours || []) for (const d of h.devs || []) {
                const x = m[d.mac] = m[d.mac] || {
                    mac: d.mac,
                    min: 0,
                    bytes: 0
                };
                x.min += d.openMin;
                x.bytes += d.down + d.up;
            }
            return Object.values(m).sort((a, b) => b.min - a.min || b.bytes - a.bytes).map(x => {
                const info = (devices || {})[x.mac] || {};
                return {
                    ...x,
                    name: devName(x.mac, info),
                    sub: devSub(info),
                    type: TYPE[info.type] ? info.type : "other",
                    minText: minText(x.min),
                    size: sizeText(x.bytes)
                };
            });
        }
        function speedText(b) {
            if (b >= 1e6) return (b / 1e6).toFixed(1) + " MB/s";
            return (b >= 1e3 ? Math.round(b / 1e3) : 0) + " KB/s";
        }
        function trend(points, n, w, h, dark) {
            const ps = (points || []).slice(-n).map(p => p[0] + p[1] < 1e3 ? 0 : p[0] + p[1]), m = ps.length;
            if (!m) return {
                svg: "",
                now: "—",
                top: ""
            };
            const max = Math.max(1, ...ps), dx = w / Math.max(1, n - 1), x0 = (n - m) * dx;
            const xy = ps.map((v, i) => [ x0 + i * dx, h - v / max * (h - 2) ]);
            const line = smooth(xy), c = dark ? "#a594ff" : "#5b3bff";
            const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">` + `<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c}" stop-opacity="${dark ? .45 : .3}"/><stop offset="1" stop-color="${c}" stop-opacity="0.02"/></linearGradient></defs>` + (m > 1 ? `<path d="${line} L${f(xy[m - 1][0])} ${h} L${f(xy[0][0])} ${h} Z" fill="url(#g)"/>` : "") + `<path d="${line}" fill="none" stroke="${c}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/></svg>`;
            return {
                svg: "data:image/svg+xml;base64," + b64(svg),
                now: speedText(ps[m - 1]),
                top: speedText(Math.max(...ps))
            };
        }
        const f = v => Math.round(v * 10) / 10;
        function smooth(p) {
            const n = p.length;
            if (n === 1) return `M${f(p[0][0])} ${f(p[0][1])}`;
            const d = [], t = [];
            for (let i = 0; i < n - 1; i++) d.push((p[i + 1][1] - p[i][1]) / (p[i + 1][0] - p[i][0]));
            t[0] = d[0];
            t[n - 1] = d[n - 2];
            for (let i = 1; i < n - 1; i++) t[i] = d[i - 1] * d[i] > 0 ? 2 / (1 / d[i - 1] + 1 / d[i]) : 0;
            let s = `M${f(p[0][0])} ${f(p[0][1])}`;
            for (let i = 0; i < n - 1; i++) {
                const h = (p[i + 1][0] - p[i][0]) / 3;
                s += ` C${f(p[i][0] + h)} ${f(p[i][1] + t[i] * h)} ${f(p[i + 1][0] - h)} ${f(p[i + 1][1] - t[i + 1] * h)} ${f(p[i + 1][0])} ${f(p[i + 1][1])}`;
            }
            return s;
        }
        function b64(str) {
            const A = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
            let o = "";
            for (let i = 0; i < str.length; i += 3) {
                const a = str.charCodeAt(i), b = str.charCodeAt(i + 1) || 0, c = str.charCodeAt(i + 2) || 0;
                o += A[a >> 2] + A[(a & 3) << 4 | b >> 4] + (i + 1 < str.length ? A[(b & 15) << 2 | c >> 6] : "=") + (i + 2 < str.length ? A[c & 63] : "=");
            }
            return o;
        }
        function bars(list, height, full) {
            const max = full || Math.max(1, ...list.map(x => x.total));
            return list.map(x => ({
                ...x,
                hb: Math.max(4, Math.round(x.total / max * height)),
                ho: Math.round(x.open / max * height),
                hl: Math.round(x.limit / max * height)
            }));
        }
        const TIERS = [ 0, 120, 240, 480, 1440 ];
        function tierH(min, height) {
            const seg = height / 4, v = Math.max(0, Math.min(1440, min));
            for (let i = 0; i < 4; i++) if (v <= TIERS[i + 1]) return Math.round((i + (v - TIERS[i]) / (TIERS[i + 1] - TIERS[i])) * seg);
            return height;
        }
        function tierBars(list, height) {
            return list.map(x => ({
                ...x,
                hb: Math.max(4, tierH(x.total, height)),
                ho: tierH(x.open, height),
                hl: 0
            }));
        }
        function tierLines(height) {
            return TIERS.slice(1).map(m => ({
                b: tierH(m, height),
                t: m / 60 + "小时"
            }));
        }
        module.exports = {
            build: build,
            hoursOf: hoursOf,
            trimHours: trimHours,
            untilNow: untilNow,
            xlabs: xlabs,
            bars: bars,
            tierH: tierH,
            tierBars: tierBars,
            tierLines: tierLines,
            minText: minText,
            sizeText: sizeText,
            devName: devName,
            devicesOf: devicesOf,
            speedText: speedText,
            trend: trend
        };
    };
    defs["demo"] = function(module, exports, require) {
        const R = require("./rules");
        let S = null;
        const CODE = "DEMO", NAME = "一点守护路由器 DEMO";
        const DEV = {
            pad: "5a:3c:11:8e:20:01",
            phone: "82:98:c2:c1:7f:45",
            ipad: "6e:01:a4:52:9b:30"
        };
        const PW = {
            k1: "58302716",
            k2: "47195830",
            k3: "90316284",
            admin: "home-wifi-2026"
        };
        function fresh() {
            const k1 = R.fromTemplate("lower", {
                key: "k1",
                ver: 1,
                name: "大宝的网络"
            });
            const k2 = R.fromTemplate("onDemand", {
                key: "k2",
                ver: 1,
                name: "二宝的网络"
            });
            const k3 = R.fromTemplate("upper", {
                key: "k3",
                ver: 1,
                name: "三娃的网络"
            });
            return {
                offset: 0,
                seq: 0,
                settings: {
                    globalVer: 1,
                    routerName: NAME,
                    block: {
                        categories: [ "game" ],
                        custom: [],
                        shareCustom: true
                    },
                    networks: [ k1, k2, k3 ]
                },
                on: {
                    k1: true,
                    k2: true,
                    k3: false
                },
                run: {
                    k1: {
                        mode: "open",
                        left: 22 * 60,
                        used: 38
                    },
                    k2: {
                        mode: "limit",
                        left: 0,
                        used: 15
                    },
                    k3: {
                        mode: "open",
                        left: 30 * 60,
                        used: 0
                    }
                },
                plans: {},
                parents: [ {
                    idx: 1,
                    nick: "妈妈",
                    avatar: "",
                    me: true,
                    by: 0,
                    at: now0() - 6 * 86400
                }, {
                    idx: 2,
                    nick: "爸爸",
                    avatar: "",
                    me: false,
                    by: 1,
                    at: now0() - 5 * 86400
                } ],
                pw: {
                    ...PW
                },
                devs: {
                    [DEV.pad]: {
                        name: "大宝平板",
                        host: "MatePad-11",
                        type: "phone",
                        net: "k1"
                    },
                    [DEV.phone]: {
                        name: "",
                        host: "",
                        type: "phone",
                        net: "k1"
                    },
                    [DEV.ipad]: {
                        name: "",
                        host: "iPad",
                        type: "phone",
                        net: "k2"
                    }
                }
            };
        }
        function now0() {
            return Math.floor(Date.now() / 1e3);
        }
        const now = () => now0() + (S ? S.offset : 0);
        const net = k => S.settings.networks.find(n => n.key === k);
        const midnight = t => {
            const d = new Date(t * 1e3);
            d.setHours(24, 0, 0, 0);
            return Math.floor(d / 1e3);
        };
        function on() {
            return !!S;
        }
        let from = "";
        function enter(f) {
            from = f || "";
            S = fresh();
            wx.switchTab({
                url: "/pages/status/status"
            });
        }
        function exit(to) {
            S = null;
            wx.reLaunch({
                url: to || "/pages/guide/guide?step=prepare"
            });
        }
        function back() {
            const f = from || "/pages/guide/guide";
            exit(f);
        }
        const current = () => ({
            deviceId: "demo",
            code: CODE,
            name: S.settings.routerName,
            demo: true
        });
        function status(k) {
            const n = net(k), r = S.run[k], p = S.plans[k], t = now();
            const base = {
                key: k,
                name: n.name,
                wifiOn: S.on[k],
                surfMin: n.surfMin,
                limitMin: n.limitMin,
                dailyMaxMin: n.dailyMaxMin,
                usedMinToday: r.used,
                onlineMinToday: r.used + (r.extra || 0),
                limitKbps: n.limitKbps == null ? 100 : n.limitKbps,
                since: t,
                want: false,
                ...p ? {
                    plan: p
                } : {}
            };
            if (!S.on[k]) return {
                ...base,
                period: "wifiOff"
            };
            if (p && p.action === "open") return {
                ...base,
                period: "tempOpen",
                next: p.until
            };
            if (p && p.action === "openAll") return {
                ...base,
                period: "allOpen",
                next: midnight(t)
            };
            if (p && p.action === "limitAll") return {
                ...base,
                period: "allLimit",
                next: midnight(t)
            };
            if (n.dailyMaxMin && r.used >= n.dailyMaxMin) return {
                ...base,
                period: "quotaDone",
                next: midnight(t)
            };
            if (n.surfMin === 0) return {
                ...base,
                period: "smartLimit",
                remainSec: midnight(t) - t
            };
            if (n.surfMin === 1440) return {
                ...base,
                period: "smartOpen",
                remainSec: midnight(t) - t
            };
            if (r.mode === "open") return {
                ...base,
                period: "smartOpen",
                remainSec: r.left
            };
            return {
                ...base,
                period: "smartLimit",
                remainSec: n.limitMin === 1440 ? midnight(t) - t : r.left,
                next: n.limitMin === 1440 ? midnight(t) : t + r.left
            };
        }
        function forward(min) {
            const before = {};
            for (const n of S.settings.networks) before[n.key] = status(n.key).period;
            for (let m = 0; m < min; m++) {
                S.offset += 60;
                const t = now();
                for (const n of S.settings.networks) {
                    const k = n.key, r = S.run[k], p = S.plans[k];
                    if (!S.on[k]) continue;
                    if (p && p.action === "open" && t >= p.until) delete S.plans[k];
                    const st = status(k).period;
                    if (st === "smartOpen" || st === "tempOpen" || st === "allOpen") r.used++;
                    if (st === "smartOpen" && n.surfMin !== 1440) {
                        r.left -= 60;
                        if (r.left <= 0) {
                            r.mode = "limit";
                            r.left = n.limitMin * 60;
                        }
                    } else if (st === "smartLimit" && n.limitMin !== 1440 && n.surfMin !== 0) {
                        r.left -= 60;
                        if (r.left <= 0) {
                            r.mode = "open";
                            r.left = n.surfMin * 60;
                        }
                    }
                }
            }
            for (const n of S.settings.networks) {
                const a = before[n.key], b = status(n.key).period;
                if (a === b || !S.on[n.key]) continue;
                if (b === "smartLimit") return `快进 ${min} 分钟：「${n.name}」这一轮用完，网速慢下来了`;
                if (b === "quotaDone") return `快进 ${min} 分钟：「${n.name}」今天的时间用完了，限速到明天 0 点`;
                if (b === "smartOpen") return `快进 ${min} 分钟：「${n.name}」限速结束，网速恢复了`;
            }
            return `快进 ${min} 分钟：孩子一直在用网，时间照常扣`;
        }
        function usage() {
            const out = [], t = now();
            const shape = {
                k1: [ 42, 51, 33, 54, 66, 84, 0 ],
                k2: [ 15, 15, 12, 15, 15, 15, 0 ]
            };
            for (let i = 6; i >= 0; i--) {
                const d = new Date((t - i * 86400) * 1e3), date = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
                const nets = [];
                for (const k of [ "k1", "k2" ]) {
                    const total = i === 0 ? S.run[k].used : shape[k][6 - i], hours = [];
                    let left = total;
                    for (const h of [ 7, 8, 12, 13, 16, 17, 18, 19, 20 ]) {
                        if (left <= 0) break;
                        const m = Math.min(left, h >= 16 ? 34 : 12);
                        const o = Math.max(0, m - (h === 18 ? 4 : 0)), l = h === 18 ? Math.min(4, m) : 0, bytes = m * 35e6;
                        const devs = k === "k1" ? [ {
                            mac: DEV.pad,
                            openMin: o,
                            limitMin: l,
                            down: Math.round(bytes * .92),
                            up: Math.round(bytes * .04)
                        } ].concat(h >= 19 ? [ {
                            mac: DEV.phone,
                            openMin: Math.min(o, 8),
                            limitMin: 0,
                            down: Math.round(bytes * .04),
                            up: 2e5
                        } ] : []) : [ {
                            mac: DEV.ipad,
                            openMin: o,
                            limitMin: l,
                            down: Math.round(bytes * .95),
                            up: Math.round(bytes * .05)
                        } ];
                        hours.push({
                            h: h,
                            openMin: o,
                            limitMin: l,
                            bytes: bytes,
                            down: Math.round(bytes * .96),
                            up: Math.round(bytes * .04),
                            devs: devs
                        });
                        left -= m;
                    }
                    nets.push({
                        key: k,
                        hours: hours
                    });
                }
                out.push({
                    date: date,
                    networks: nets
                });
            }
            return out;
        }
        function speed() {
            const t = Math.floor(now() / 10);
            return S.settings.networks.map(n => {
                const st = status(n.key), open = S.on[n.key] && st.period !== "wifiOff" && !/Limit|quotaDone/.test(st.period), points = [];
                for (let i = 59; i >= 0; i--) {
                    const x = t - i, w = Math.sin(x / 2.3) * .25 + Math.sin(x * 7.1) * .08;
                    points.push(open ? [ Math.round(26e5 * (1 + w)), Math.round(9e4 * (1 + w)) ] : S.on[n.key] ? [ Math.round(11e3 * (1 + w)), 1500 ] : [ 0, 0 ]);
                }
                return {
                    key: n.key,
                    points: points
                };
            });
        }
        const devInfo = () => {
            const o = {};
            for (const m in S.devs) o[m] = {
                name: S.devs[m].name,
                host: S.devs[m].host,
                type: S.devs[m].type
            };
            return o;
        };
        function api(path, opt) {
            const method = opt && opt.method || "GET", q = opt && opt.data || {}, t = now();
            const ok = x => ({
                ok: true,
                now: t,
                ...x
            });
            const [p, qs] = path.split("?");
            if (p === "status") return ok({
                router: {
                    code: CODE,
                    name: S.settings.routerName,
                    version: "1.0.0",
                    wan: true,
                    registered: true,
                    parentWifiPassword: true,
                    clockSynced: true
                },
                networks: speed().map(x => {
                    const p = x.points[x.points.length - 1];
                    return {
                        ...status(x.key),
                        speed: {
                            down: p[0],
                            up: p[1]
                        }
                    };
                })
            });
            if (p === "settings" && method === "GET") return ok({
                settings: JSON.parse(JSON.stringify(S.settings))
            });
            if (p === "settings") {
                for (const n of q.networks || []) {
                    const i = S.settings.networks.findIndex(x => x.key === n.key);
                    S.settings.networks[i] = {
                        ...n,
                        ver: S.settings.networks[i].ver + 1
                    };
                }
                if (q.routerName != null) S.settings.routerName = String(q.routerName).trim().slice(0, 12) || NAME;
                if (q.block) S.settings.block = q.block;
                if (q.routerName != null || q.block) S.settings.globalVer++;
                return ok({
                    settings: JSON.parse(JSON.stringify(S.settings)),
                    conflicts: [],
                    applied: true
                });
            }
            if (p === "today") {
                if (q.action === "auto") delete S.plans[q.key]; else S.plans[q.key] = {
                    seq: ++S.seq,
                    action: q.action,
                    at: t,
                    by: 1,
                    ...q.action === "open" ? {
                        minutes: q.minutes,
                        until: t + q.minutes * 60
                    } : {}
                };
                return ok({
                    network: status(q.key),
                    applied: true
                });
            }
            if (p === "wifi" && method === "GET") {
                const show = qs && qs.replace("show=", "");
                if (show) return ok({
                    key: show,
                    password: S.pw[show]
                });
                return ok({
                    kids: S.settings.networks.map((n, i) => ({
                        key: n.key,
                        ssid: "DOTI-DEMO-0" + (i + 1),
                        on: S.on[n.key]
                    })),
                    parent: [ {
                        key: "admin",
                        ssid: "DOTI-DEMO-ADMIN",
                        ours: true
                    } ]
                });
            }
            if (p === "wifi") {
                if (q.op === "toggle") {
                    if (!q.on && !S.settings.networks.some(n => n.key !== q.key && S.on[n.key])) return {
                        ok: false,
                        error: "KEEP_ONE",
                        msg: "至少要留一个孩子 WiFi 开着"
                    };
                    S.on[q.key] = q.on;
                    return ok({
                        key: q.key,
                        want: q.on
                    });
                }
                if (q.op === "regen") {
                    S.pw[q.key] = q.password || String(Math.floor(1e7 + Math.random() * 9e7));
                    return ok({
                        key: q.key,
                        ssid: "DOTI-DEMO-0" + q.key.slice(1),
                        password: S.pw[q.key]
                    });
                }
                if (q.op === "setParent") {
                    S.pw.admin = q.password;
                    return ok({
                        key: "admin",
                        ssid: "DOTI-DEMO-ADMIN"
                    });
                }
            }
            if (p === "usage") return ok({
                days: usage(),
                devices: devInfo()
            });
            if (p === "speed") return ok({
                step: 10,
                networks: speed()
            });
            if (p === "device" && S.devs[q.mac]) {
                S.devs[q.mac].name = String(q.name || "").trim().slice(0, 10);
                return ok({
                    device: {
                        mac: q.mac,
                        ...devInfo()[q.mac]
                    }
                });
            }
            if (p === "parents" && method === "GET") return ok({
                parents: S.parents.map(x => ({
                    ...x
                })),
                max: 10
            });
            if (p === "parents") {
                if (q.op === "profile") {
                    const me = S.parents[0];
                    if (q.nick != null) me.nick = q.nick || "妈妈";
                    if (q.avatar != null) me.avatar = q.avatar;
                }
                if (q.op === "remove") S.parents = S.parents.filter(x => x.idx !== q.idx);
                return ok({
                    parents: S.parents.map(x => ({
                        ...x
                    })),
                    max: 10
                });
            }
            if (p === "unbind" && q.confirm === "UNBIND") return ok({});
            return {
                ok: false,
                error: "BAD_REQUEST",
                msg: "示例里不能这样做"
            };
        }
        module.exports = {
            on: on,
            enter: enter,
            exit: exit,
            current: current,
            api: api,
            forward: forward,
            NAME: NAME,
            back: back
        };
    };
    window.DotiDemo = {
        rules: req("rules"),
        usage: req("usage"),
        demo: req("demo")
    };
})();
