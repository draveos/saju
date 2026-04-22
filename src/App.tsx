// src/App.tsx
import React, { useState, useEffect } from 'react';
import './App.css';
import {
  getSeededRandom, calcSaju, getSipsin, STEMS, BRANCHES,
  ELEMENTS, ELEM_COLORS, getWesternZodiac, getDaewoon, DAY_MASTER_DATA
} from './utils/sajuLogic';
import { sinsalAt, sinsalDef } from './data/sinsal';
import { unseongAt, unseongDef } from './data/unseong';
import { isGongmang } from './data/gongmang';
import { generateNarrative, buildFacts } from './utils/narrative';
import { generateReport } from './utils/reportGenerator';
import { FortuneTellerScene } from './components/FortuneTellerScene';

type AppStep = 'intro' | 'input' | 'result';

interface FortuneData {
  general_fortunes: Array<{ grade: string; message: string; detail: string }>;
  fortune_cookies: Array<{ message: string; lucky_numbers: number[] }>;
  quotes: Array<{ author: string; text: string }>;
}

const GRADE_CONFIG: Record<string, { label: string; cssClass: string; emoji: string; desc: string }> = {
  '대길': { label: 'GREAT FORTUNE', cssClass: 'grade-daegil', emoji: '✦', desc: '최고의 운' },
  '길':   { label: 'GOOD FORTUNE',  cssClass: 'grade-gil',    emoji: '◈', desc: '좋은 운' },
  '중길': { label: 'FAIR FORTUNE',  cssClass: 'grade-jungil', emoji: '◇', desc: '보통의 운' },
  '소길': { label: 'MILD FORTUNE',  cssClass: 'grade-sogil',  emoji: '·', desc: '소소한 운' },
  '평':   { label: 'NEUTRAL',       cssClass: 'grade-pyeong', emoji: '—', desc: '평범한 날' },
  '소흉': { label: 'MILD CAUTION',  cssClass: 'grade-soheung',emoji: '△', desc: '약간 조심' },
  '흉':   { label: 'CAUTION',       cssClass: 'grade-heung',  emoji: '▼', desc: '주의 필요' },
};

/* 유저별 고유 ID — 첫 방문 시 발급, localStorage에 영구 저장 */
const getUserUID = (): number => {
  try {
    let uid = localStorage.getItem('oracle_uid');
    if (!uid) {
      uid = Math.random().toString(36).slice(2, 11) + Math.random().toString(36).slice(2, 11);
      localStorage.setItem('oracle_uid', uid);
    }
    // 문자열 → 숫자 (charCode 합산)
    return uid.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  } catch {
    // 시크릿 모드 등 localStorage 차단 시 랜덤 fallback
    return Math.floor(Math.random() * 99999);
  }
};

const getDailySeed = (extra = 0) => {
  const n = new Date();
  const datePart = n.getFullYear() * 10000 + (n.getMonth() + 1) * 100 + n.getDate();
  return datePart + getUserUID() + extra;
};

const getTomorrowLabel = () => {
  const t = new Date();
  t.setDate(t.getDate() + 1);
  return `${t.getMonth() + 1}월 ${t.getDate()}일 자정`;
};

/* ───────────────────────────────────────────
   새 창 HTML 생성 — 완전 inline CSS, html2canvas 가능
─────────────────────────────────────────── */
const buildSaveHTML = (result: any, formName: string): string => {
  const EC   = ['#4ade80','#f87171','#fbbf24','#94a3b8','#60a5fa'];
  const STC  = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
  const BRC  = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
  const ENM  = ['木','火','土','金','水'];

  const gc   = result.grade ? GRADE_CONFIG[result.grade] : null;
  const n    = new Date();
  const today = `${n.getFullYear()}년 ${n.getMonth()+1}월 ${n.getDate()}일`;
  const fname = `fortune-${formName || 'result'}-${n.getFullYear()}${String(n.getMonth()+1).padStart(2,'0')}${String(n.getDate()).padStart(2,'0')}`;

  const GCOL: Record<string, { border: string; bg: string; glow: string; tc: string }> = {
    'grade-daegil': { border:'rgba(251,191,36,.6)',  bg:'linear-gradient(145deg,#1a1506,#120f04)', glow:'0 0 60px rgba(251,191,36,.15)', tc:'#fbbf24' },
    'grade-gil':    { border:'rgba(245,158,11,.45)', bg:'linear-gradient(145deg,#170f04,#0f0a02)', glow:'0 0 40px rgba(245,158,11,.08)', tc:'#f59e0b' },
    'grade-jungil': { border:'rgba(217,119,6,.35)',  bg:'linear-gradient(145deg,#120b02,#0e0802)', glow:'', tc:'#d97706' },
    'grade-sogil':  { border:'rgba(180,130,60,.25)', bg:'#0e0c08', glow:'', tc:'#b48240' },
    'grade-pyeong': { border:'rgba(100,116,139,.3)', bg:'#0c0c12', glow:'', tc:'#94a3b8' },
    'grade-soheung':{ border:'rgba(185,28,28,.38)',  bg:'linear-gradient(145deg,#150606,#0f0404)', glow:'0 0 30px rgba(185,28,28,.08)', tc:'#f87171' },
    'grade-heung':  { border:'rgba(153,27,27,.55)',  bg:'linear-gradient(145deg,#1a0404,#120303)', glow:'0 0 50px rgba(153,27,27,.12)', tc:'#ef4444' },
  };
  const gs = gc ? (GCOL[gc.cssClass] ?? GCOL['grade-pyeong']!) : { border:'rgba(201,168,76,.38)', bg:'#0e0d14', glow:'', tc:'#c9a84c' };

  /* ── 카드 내용 ── */
  let body = '';

  if (result.type === 'saju') {
    const yearBranch = result.saju.pillars.year[1];
    const [dayStemSv, dayBranchSv] = result.saju.pillars.day;
    const pillars = ['hour','day','month','year'].map((k,i) => {
      const [s,b] = result.saju.pillars[k];
      const isDay = k === 'day';
      const sinsal = sinsalDef(sinsalAt(yearBranch, b));
      const unseong = unseongDef(unseongAt(result.saju.dayStemIdx, b));
      const empty = !isDay && isGongmang(dayStemSv, dayBranchSv, b);
      const emptyDash = empty ? 'border-style:dashed;' : '';
      const emptyMark = empty ? '<span style="margin-left:4px;font-size:9px;color:#c9a84c;opacity:.7;">◯</span>' : '';
      return `<div style="background:${isDay?'rgba(201,168,76,.12)':'rgba(255,255,255,.03)'};border:1px solid ${isDay?'rgba(201,168,76,.38)':'rgba(201,168,76,.15)'};${emptyDash}border-radius:16px;padding:14px 6px;text-align:center;">
        <div style="font-family:'Cormorant Garamond',serif;font-size:10px;letter-spacing:2px;color:#7a7060;margin-bottom:8px;">${['시','일','월','연'][i]}${emptyMark}</div>
        <div style="font-size:28px;font-weight:700;color:${EC[s%5]};line-height:1.2;">${STC[s]}</div>
        <div style="font-size:28px;font-weight:700;color:${EC[b%5]};line-height:1.2;">${BRC[b]}</div>
        <div style="font-size:10px;color:#7a7060;margin-top:6px;">${isDay?'일간':''}</div>
        <div style="font-family:'Cormorant Garamond',serif;font-size:10px;letter-spacing:1px;color:${isDay?'#c9a84c':'#7a7060'};margin-top:3px;opacity:.85;">${sinsal.nameKr}</div>
        <div style="font-family:'Cormorant Garamond',serif;font-size:10px;letter-spacing:1px;color:#7a7060;margin-top:2px;opacity:.7;">${unseong.nameKr}</div>
      </div>`;
    }).join('');

    const bars = ENM.map((el,i) => {
      const pct = Math.round((result.saju.counts[i]/8)*100);
      return `<div style="display:flex;align-items:center;gap:12px;margin-bottom:10px;">
        <span style="width:20px;text-align:center;font-size:16px;font-weight:700;color:${EC[i]};">${el}</span>
        <div style="flex:1;height:5px;background:rgba(255,255,255,.06);border-radius:3px;overflow:hidden;">
          <div style="height:100%;width:${pct}%;background:${EC[i]};border-radius:3px;"></div>
        </div>
        <span style="width:16px;text-align:right;font-size:11px;color:#7a7060;">${result.saju.counts[i]}</span>
      </div>`;
    }).join('');

    const tableRows = [
      ['일간', result.dm.key, true],
      ['성향', result.dm.desc, false],
      ['강점', result.dm.strength, false],
      ['약점', result.dm.weakness, false],
    ].map(([th,td,hl]) =>
        `<div style="display:flex;padding:14px 18px;border-bottom:1px solid rgba(201,168,76,.15);gap:16px;">
        <div style="font-family:'Cormorant Garamond',serif;font-size:11px;letter-spacing:2px;color:#c9a84c;min-width:36px;padding-top:2px;">${th}</div>
        <div style="font-size:13px;color:${hl?'#e8c97a':'#f0ece0'};line-height:1.6;font-weight:${hl?'600':'300'};">${td}</div>
      </div>`
    ).join('');

    const daewoon = result.daewoon.slice(0,6).map((dw: any) =>
        `<div style="display:flex;flex-direction:column;align-items:center;gap:4px;min-width:44px;padding:10px 6px;border:1px solid rgba(201,168,76,.15);border-radius:12px;background:rgba(255,255,255,.02);">
        <span style="font-size:10px;color:#7a7060;font-family:'Cormorant Garamond',serif;">${dw.age_s}세</span>
        <span style="font-size:16px;font-weight:700;color:${EC[dw.s%5]};">${STC[dw.s]}</span>
        <span style="font-size:16px;font-weight:700;color:${EC[dw.br%5]};">${BRC[dw.br]}</span>
      </div>`
    ).join('');

    body = `
      <span style="font-family:'Cormorant Garamond',serif;font-size:11px;letter-spacing:5px;color:#c9a84c;display:block;text-align:center;margin-bottom:8px;">DESTINY ANALYSIS</span>
      <h2 style="font-size:18px;text-align:center;font-weight:600;color:#f0ece0;margin-bottom:6px;">${result.title}</h2>
      <div style="text-align:center;color:#c9a84c;font-size:10px;letter-spacing:10px;margin-bottom:28px;">✦ · ✦ · ✦</div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:28px;">${pillars}</div>
      <div style="margin-bottom:28px;">
        <span style="font-family:'Cormorant Garamond',serif;font-size:11px;letter-spacing:4px;color:#c9a84c;display:block;margin-bottom:16px;text-transform:uppercase;">오행 분포</span>
        ${bars}
      </div>
      <div style="background:rgba(255,255,255,.02);border:1px solid rgba(201,168,76,.15);border-radius:16px;overflow:hidden;margin-bottom:24px;">${tableRows}</div>
      <div style="display:flex;align-items:center;gap:12px;padding:14px 18px;background:rgba(255,255,255,.02);border:1px solid rgba(201,168,76,.15);border-radius:14px;margin-bottom:24px;">
        <span style="font-size:28px;">${result.western.symbol}</span>
        <div>
          <div style="font-size:14px;font-weight:600;color:#f0ece0;">${result.western.sign}</div>
          <div style="font-size:12px;color:#7a7060;margin-top:2px;">${result.western.desc}</div>
        </div>
      </div>
      <div style="padding-top:16px;border-top:1px solid rgba(201,168,76,.15);">
        <span style="font-family:'Cormorant Garamond',serif;font-size:11px;letter-spacing:4px;color:#c9a84c;display:block;margin-bottom:14px;">대운 흐름</span>
        <div style="display:flex;gap:8px;">${daewoon}</div>
      </div>`;
  } else {
    const badge = gc ? `
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:20px;padding:10px 14px;border-radius:12px;background:rgba(0,0,0,.3);border:1px solid rgba(255,255,255,.07);">
        <span style="font-size:16px;">${gc.emoji}</span>
        <div style="flex:1;">
          <div style="font-size:14px;font-weight:700;color:${gs.tc};">${result.grade}</div>
          <div style="font-family:'Cormorant Garamond',serif;font-size:10px;letter-spacing:2px;color:#7a7060;margin-top:2px;">${gc.label}</div>
        </div>
        <span style="font-family:'Cormorant Garamond',serif;font-size:11px;color:#7a7060;padding:3px 10px;border:1px solid rgba(255,255,255,.1);border-radius:20px;">${gc.desc}</span>
      </div>` : '';

    const dateRow = result.dateLabel
        ? `<div style="font-family:'Cormorant Garamond',serif;font-size:11px;letter-spacing:3px;color:#7a7060;text-align:center;margin-bottom:18px;">${result.dateLabel}</div>`
        : '';

    const divider = `
      <div style="display:flex;align-items:center;gap:10px;margin:18px 0;">
        <div style="flex:1;height:1px;background:rgba(255,255,255,.08);"></div>
        <span style="color:#c9a84c;font-size:10px;">✦</span>
        <div style="flex:1;height:1px;background:rgba(255,255,255,.08);"></div>
      </div>`;

    const refresh = result.type === 'fortune'
        ? `<div style="display:flex;align-items:center;gap:8px;margin-top:20px;padding:10px 14px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:10px;">
          <span style="color:#c9a84c;font-size:14px;">↻</span>
          <span style="font-family:'Cormorant Garamond',serif;font-size:11px;letter-spacing:1px;color:#7a7060;">${getTomorrowLabel()} 이후 새로운 운세가 열립니다</span>
        </div>` : '';

    const author = result.type === 'quote'
        ? `<p style="margin-top:14px;font-family:'Cormorant Garamond',serif;font-size:12px;color:#7a7060;">— ${result.title}</p>` : '';

    body = `
      <span style="font-family:'Cormorant Garamond',serif;font-size:11px;letter-spacing:5px;color:#c9a84c;display:block;text-align:center;margin-bottom:8px;">DESTINY ANALYSIS</span>
      <h2 style="font-size:18px;text-align:center;font-weight:600;color:#f0ece0;margin-bottom:6px;">${result.title}</h2>
      <div style="text-align:center;color:#c9a84c;font-size:10px;letter-spacing:10px;margin-bottom:28px;">✦ · ✦ · ✦</div>
      <div style="background:${gs.bg};border:1px solid ${gs.border};border-radius:20px;padding:28px 24px;${gs.glow?`box-shadow:${gs.glow};`:''}">
        ${badge}
        ${dateRow}
        <p style="font-size:15px;line-height:1.85;color:#f0ece0;font-weight:300;margin-bottom:16px;">${result.content}</p>
        ${result.detail ? divider + `<p style="font-family:'Cormorant Garamond',serif;font-size:13px;color:#7a7060;font-style:italic;line-height:1.6;">${result.detail}</p>` : ''}
        ${author}
        ${refresh}
      </div>`;
  }

  /* ── 완성 HTML ── */
  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>운명 리포트 — ${today}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@300;400;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap" rel="stylesheet">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{
      background:#07070d;
      font-family:'Noto Serif KR',serif;
      color:#f0ece0;
      min-height:100vh;
      display:flex;flex-direction:column;align-items:center;
      padding:48px 20px 60px;gap:20px;
    }
    .page{width:100%;max-width:480px;display:flex;flex-direction:column;align-items:center;gap:24px;}
    .char-img{
      width:96px;height:96px;border-radius:50%;
      border:1px solid rgba(201,168,76,.38);
      box-shadow:0 0 40px rgba(201,168,76,.15),0 0 0 4px rgba(201,168,76,.05);
      object-fit:cover;display:block;margin:0 auto;
    }
    .char-label{
      font-family:'Cormorant Garamond',serif;font-size:11px;
      letter-spacing:6px;color:#c9a84c;text-transform:uppercase;
      opacity:.7;text-align:center;margin-top:8px;
    }
    .card{
      width:100%;background:#0e0d14;
      border:1px solid ${gs.border};border-radius:28px;padding:40px 32px;
      box-shadow:0 32px 80px rgba(0,0,0,.7)${gs.glow?','+gs.glow:''};
    }
    .ornament{text-align:center;margin-bottom:24px;display:flex;align-items:center;gap:10px;}
    .ornament::before,.ornament::after{content:'';flex:1;height:1px;background:rgba(201,168,76,.35);}
    .ornament-icon{color:#c9a84c;font-size:16px;}
    .footer{
      font-family:'Cormorant Garamond',serif;font-size:11px;
      letter-spacing:3px;color:#4a4538;text-align:center;
    }

    /* 버튼 영역 */
    .btn-group{display:flex;gap:12px;width:100%;max-width:480px;}
    .dl-btn{
      flex:1;padding:14px 0;border-radius:14px;cursor:pointer;
      font-family:'Noto Serif KR',serif;font-size:13px;font-weight:700;
      transition:filter .2s,opacity .2s;border:none;
    }
    .dl-btn-img{background:#f0ece0;color:#07070d;}
    .dl-btn-img:hover{filter:brightness(.92);}
    .dl-btn-pdf{background:transparent;color:#f0ece0;border:1px solid rgba(201,168,76,.3);}
    .dl-btn-pdf:hover{border-color:rgba(201,168,76,.65);}
    .dl-btn:disabled{opacity:.45;cursor:not-allowed;filter:none;}

    /* 로딩 오버레이 */
    #ov{
      display:none;position:fixed;inset:0;
      background:rgba(7,7,13,.88);z-index:999;
      flex-direction:column;align-items:center;justify-content:center;gap:16px;
    }
    #ov.show{display:flex;}
    .spin{
      width:40px;height:40px;border-radius:50%;
      border:1px solid rgba(201,168,76,.35);border-top-color:#c9a84c;
      animation:sp 1s linear infinite;
    }
    @keyframes sp{to{transform:rotate(360deg)}}
    .ov-txt{font-family:'Cormorant Garamond',serif;font-size:13px;letter-spacing:4px;color:#c9a84c;opacity:.8;}

    @media print{
      body{background:#07070d!important;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
      .btn-group,#ov{display:none!important;}
    }
  </style>
</head>
<body>
  <div id="ov">
    <div class="spin"></div>
    <p class="ov-txt">이미지 생성 중…</p>
  </div>

  <div class="page" id="capture">
    <div>
      <img src="https://draveos.github.io/saju/front_character.png" class="char-img" alt="Oracle" ... />
      <p class="char-label">Celestial Oracle</p>
    </div>
    <div class="card">
      <div class="ornament"><span class="ornament-icon">✦</span></div>
      ${body}
    </div>
    <p class="footer">${today} &nbsp;·&nbsp; Celestial Oracle</p>
  </div>

  <div class="btn-group">
    <button class="dl-btn dl-btn-img" id="btnImg">🖼&nbsp; 이미지 다운로드</button>
    <button class="dl-btn dl-btn-pdf" id="btnPdf">📄&nbsp; PDF 저장</button>
  </div>

  <script>
    /* 이미지 다운로드 */
    document.getElementById('btnImg').addEventListener('click', async () => {
      const ov   = document.getElementById('ov');
      const btn  = document.getElementById('btnImg');
      ov.classList.add('show');
      btn.disabled = true;
      try {
        await document.fonts.ready;
        await new Promise(r => setTimeout(r, 150));

        const el = document.getElementById('capture');
        const canvas = await html2canvas(el, {
          backgroundColor: '#07070d',
          scale: 2,
          useCORS: true,
          allowTaint: true,
          logging: false,
          width: el.offsetWidth,
          height: el.scrollHeight,
          windowWidth: el.offsetWidth,
          windowHeight: el.scrollHeight,
        });

        const a = document.createElement('a');
        a.download = '${fname}.png';
        a.href = canvas.toDataURL('image/png');
        a.click();
      } catch(e) {
        alert('이미지 생성에 실패했습니다.\\nPDF 저장을 이용해 주세요.');
        console.error(e);
      } finally {
        ov.classList.remove('show');
        btn.disabled = false;
      }
    });

    /* PDF 저장 */
    document.getElementById('btnPdf').addEventListener('click', () => window.print());
  </script>
</body>
</html>`;
};

/* ─── App ─── */
const App: React.FC = () => {
  const [data, setData]     = useState<FortuneData | null>(null);
  const [step, setStep]     = useState<AppStep>('intro');
  const [result, setResult] = useState<any>(null);

  const [form, setForm] = useState({
    year: '', month: '', day: '', hour: '',
    gender: 'M' as 'M' | 'F', name: '',
  });

  useEffect(() => {
    fetch('./fortune_data.json').then(r => r.json()).then(setData)
        .catch(e => console.error('Data load error:', e));
  }, []);

  const handleNext = (nextStep: AppStep, res: any = null) => {
    setResult(res); setStep(nextStep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMenuSelect = (menuId: number) => {
    if (!data) return;
    if (menuId === 1) return setStep('input');

    const rng = getSeededRandom(getDailySeed(menuId * 97));
    const n   = new Date();
    const dateLabel = `${n.getFullYear()}년 ${n.getMonth()+1}월 ${n.getDate()}일`;
    let res: any = {};

    if (menuId === 2) {
      const f = data.general_fortunes[Math.floor(rng() * data.general_fortunes.length)];
      res = { type:'fortune', grade:f.grade, title:'오늘의 전체 운세', content:f.message, detail:f.detail, dateLabel };
    } else if (menuId === 3) {
      const c = data.fortune_cookies[Math.floor(rng() * data.fortune_cookies.length)];
      res = { type:'cookie', title:'포춘쿠키의 조언', content:c.message, detail:`Lucky: ${c.lucky_numbers.join('  ·  ')}` };
    } else {
      const q = data.quotes[Math.floor(rng() * data.quotes.length)];
      res = { type:'quote', title:q.author, content:q.text };
    }
    handleNext('result', res);
  };

  const handleSajuSubmit = () => {
    const { year, month, day, hour, gender, name } = form;
    const y = Number(year), m = Number(month), d = Number(day), h = Number(hour || '0');
    if (!y || !m || !d) return;
    const saju    = calcSaju(y, m, d, h, gender);
    const dm      = DAY_MASTER_DATA[saju.dayStemIdx];
    const daewoon = getDaewoon(saju.pillars.month[0], saju.pillars.month[1], saju.forward, 5);
    handleNext('result', { type:'saju', title:`${name||'여행자'}님의 운명 리포트`, saju, dm, daewoon, western:getWesternZodiac(m,d) });
  };


  const [smashing, setSmashing] = useState(false);

  const handleSmash = () => {
    if (smashing) return;
    setSmashing(true);
    setTimeout(() => {
      try { window.close(); } catch (_) {}
      setTimeout(() => {
        setSmashing(false);
        setStep('intro');
        setResult(null);
      }, 300);
    }, 900);
  };

  const openSavePage = () => {
    if (!result) return;
    const html = buildSaveHTML(result, form.name);
    const win  = window.open('', '_blank');
    if (!win) { alert('팝업이 차단되었습니다. 팝업 허용 후 다시 시도해 주세요.'); return; }
    win.document.open();
    win.document.write(html);
    win.document.close();
  };

  if (!data) return (
      <div className="loading-screen">
        <div className="loading-orb" />
        <p className="loading-text">운명의 지도를 펼치는 중</p>
      </div>
  );

  const maxCount  = 8;
  const gradeConf = result?.grade ? GRADE_CONFIG[result.grade] : null;

  return (
      <div className="container">
        <div className="starfield" />
        <div className="capture-area">

          {/* Character */}
          <div className={`character-wrap fade-in ${smashing ? 'smashing-char' : ''}`}>
            <div className="character-ring" />
            <img src={`${import.meta.env.BASE_URL}front_character.png`} className="character-img" alt="Fortune Teller" />
            <span className="character-label">Celestial Oracle</span>
          </div>

          {/* Card */}
          <div className={`dialog-box fade-up ${gradeConf ? gradeConf.cssClass : ''} ${smashing ? 'smashing' : ''}`}>
            <div className="card-ornament"><span className="ornament-icon">✦</span></div>

            {/* INTRO */}
            {step === 'intro' && (
                <>
                  <p className="main-text fade-up stagger-1">
                    안녕하세요.<br />오늘도 와주셨네요.
                  </p>
                  <div className="menu-list">
                    {[
                      { id:1, icon:'☯', label:'타고난 사주와 성격 분석' },
                      { id:2, icon:'✦', label:'오늘의 전체 운세' },
                      { id:3, icon:'🥠', label:'신비로운 포춘쿠키' },
                      { id:4, icon:'◈', label:'오늘의 명언' },
                    ].map((item, i) => (
                        <button key={item.id} className={`btn-menu fade-up stagger-${i+2}`}
                                onClick={() => handleMenuSelect(item.id)}>
                          <span className="menu-num">0{item.id}</span>
                          <span>{item.icon}&nbsp; {item.label}</span>
                          <span className="menu-arrow">›</span>
                        </button>
                    ))}
                  </div>
                </>
            )}

            {/* INPUT */}
            {step === 'input' && (
                <div className="input-form">
                  <p className="main-text fade-up">생년월일과 이름을 입력해 주세요.</p>
                  <div className="fade-up stagger-1">
                    <label className="form-label">이름 (선택)</label>
                    <input className="saju-input" placeholder="홍길동"
                           onChange={e => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div className="fade-up stagger-2">
                    <label className="form-label">생년월일</label>
                    <div className="date-row">
                      <input type="number" className="saju-input" placeholder="1990" min="1900" max="2025" value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} />
                      <input type="number" className="saju-input" placeholder="월"   min="1"    max="12"   value={form.month} onChange={e => setForm({ ...form, month: e.target.value })} />
                      <input type="number" className="saju-input" placeholder="일"   min="1"    max="31"   value={form.day}   onChange={e => setForm({ ...form, day:   e.target.value })} />
                    </div>
                  </div>
                  <div className="fade-up stagger-3">
                    <label className="form-label">태어난 시 (선택, 0–23)</label>
                    <input type="number" className="saju-input" placeholder="모르면 비워두세요"
                           min="0" max="23" value={form.hour} onChange={e => setForm({ ...form, hour: e.target.value })} />
                  </div>
                  <div className="fade-up stagger-4">
                    <label className="form-label">성별</label>
                    <div className="gender-row">
                      {(['M','F'] as const).map(g => (
                          <button key={g} className={`gender-btn ${form.gender === g ? 'active' : ''}`}
                                  onClick={() => setForm({ ...form, gender: g })}>
                            {g === 'M' ? '♂ 남성' : '♀ 여성'}
                          </button>
                      ))}
                    </div>
                  </div>
                  <button className="btn-submit fade-up stagger-5" onClick={handleSajuSubmit}>나의 운명 확인하기</button>
                  <button className="btn-back fade-up stagger-5" onClick={() => setStep('intro')}>돌아가기</button>
                </div>
            )}

            {/* RESULT */}
            {step === 'result' && result && (
                <div className="result-container">
                  <span className="result-eyebrow fade-up">DESTINY ANALYSIS</span>
                  <h2 className="result-title fade-up stagger-1">{result.title}</h2>
                  <div className="stars-row fade-up stagger-1">✦ · ✦ · ✦</div>

                  {result.type === 'saju' ? (
                      <>
                        <FortuneTellerScene
                          lines={generateNarrative({
                            name: form.name,
                            dayStemIdx: result.saju.dayStemIdx,
                            pillars: result.saju.pillars,
                            dayMasterKey: result.dm.key,
                            counts: result.saju.counts,
                            daewoon: result.daewoon,
                            userAge: form.year ? (new Date().getFullYear() - Number(form.year)) : undefined,
                            forward: result.saju.forward,
                            birthYear: Number(form.year) || 0,
                            birthMonth: Number(form.month) || 0,
                            birthDay: Number(form.day) || 0,
                            birthHour: Number(form.hour) || 0,
                          })}
                        />
                        <div className="wonguk-grid fade-up stagger-2">
                          {(['hour','day','month','year'] as const).map((k,i) => {
                            const [s,b] = result.saju.pillars[k];
                            const [dayS, dayB] = result.saju.pillars.day;
                            const yearBranch = result.saju.pillars.year[1];
                            const sinsal = sinsalDef(sinsalAt(yearBranch, b));
                            const unseong = unseongDef(unseongAt(result.saju.dayStemIdx, b));
                            const empty = k !== 'day' && isGongmang(dayS, dayB, b);
                            return (
                                <div key={k} className={`wonguk-column ${k==='day'?'pillar-day':''} ${empty?'pillar-gongmang':''}`}>
                                  <div className="wonguk-label">{['시','일','월','연'][i]}{empty && <span className="gongmang-mark" title="공망 — 해당 지지의 기운이 허하다">◯</span>}</div>
                                  <div className="wonguk-char" style={{ color: ELEM_COLORS[s%5] }}>{STEMS[s]}</div>
                                  <div className="wonguk-char" style={{ color: ELEM_COLORS[b%5] }}>{BRANCHES[b]}</div>
                                  <div className="wonguk-sipsin">{k==='day'?'일간':getSipsin(result.saju.dayStemIdx,s)}</div>
                                  <div className="wonguk-sinsal" title={sinsal.theme}>{sinsal.nameKr}</div>
                                  <div className="wonguk-unseong" title={unseong.theme}>{unseong.nameKr}</div>
                                </div>
                            );
                          })}
                        </div>

                        <div className="element-chart fade-up stagger-3">
                          <span className="section-label">오행 분포</span>
                          {ELEMENTS.map((el,i) => (
                              <div key={el} className="element-row">
                                <span className="el-name" style={{ color: ELEM_COLORS[i] }}>{el}</span>
                                <div className="el-bar-bg">
                                  <div className="el-bar-fill" style={{ width:`${(result.saju.counts[i]/maxCount)*100}%`, backgroundColor:ELEM_COLORS[i], boxShadow:`0 0 8px ${ELEM_COLORS[i]}99` }} />
                                </div>
                                <span className="el-count">{result.saju.counts[i]}</span>
                              </div>
                          ))}
                        </div>

                        <div className="fortune-table fade-up stagger-4">
                          <div className="tr"><div className="th">일간</div><div className="td highlight">{result.dm.key}</div></div>
                          <div className="tr"><div className="th">성향</div><div className="td">{result.dm.desc}</div></div>
                          <div className="tr"><div className="th">강점</div><div className="td">{result.dm.strength}</div></div>
                          <div className="tr"><div className="th">약점</div><div className="td">{result.dm.weakness}</div></div>
                        </div>

                        <div className="zodiac-row fade-up stagger-5">
                          <span className="zodiac-symbol">{result.western.symbol}</span>
                          <div>
                            <div className="zodiac-name">{result.western.sign}</div>
                            <div className="zodiac-desc">{result.western.desc}</div>
                          </div>
                        </div>

                        <div className="daewoon-section fade-up stagger-6">
                          <span className="section-label">대운 흐름</span>
                          <div className="daewoon-list">
                            {result.daewoon.slice(0,6).map((dw: any) => (
                                <div key={dw.age_s} className="daewoon-item">
                                  <span className="daewoon-age">{dw.age_s}세</span>
                                  <span className="daewoon-kanji" style={{ color:ELEM_COLORS[dw.s%5] }}>{STEMS[dw.s]}</span>
                                  <span className="daewoon-kanji" style={{ color:ELEM_COLORS[dw.br%5] }}>{BRANCHES[dw.br]}</span>
                                </div>
                            ))}
                          </div>
                        </div>

                        {/* 사주 리포트 카드 — 11 카테고리 */}
                        {(() => {
                          const narrCtx = {
                            name: form.name,
                            dayStemIdx: result.saju.dayStemIdx,
                            pillars: result.saju.pillars,
                            dayMasterKey: result.dm.key,
                            counts: result.saju.counts,
                            daewoon: result.daewoon,
                            userAge: form.year ? (new Date().getFullYear() - Number(form.year)) : undefined,
                            forward: result.saju.forward,
                            birthYear: Number(form.year) || 0,
                            birthMonth: Number(form.month) || 0,
                            birthDay: Number(form.day) || 0,
                            birthHour: Number(form.hour) || 0,
                          };
                          const facts = buildFacts(narrCtx);
                          const seed = narrCtx.birthYear * 10000 + narrCtx.birthMonth * 100 + narrCtx.birthDay + 7;
                          const cards = generateReport(facts, result.daewoon, seed);
                          return (
                            <div className="report-section fade-up stagger-6">
                              <span className="section-label">사주 리포트</span>
                              <div className="report-grid">
                                {cards.map((c) => (
                                  <div key={c.category} className={`report-card report-${c.category}`}>
                                    <div className="report-head">
                                      <span className="report-icon">{c.icon}</span>
                                      <span className="report-title">{c.labelKr}</span>
                                    </div>
                                    {c.lines.map((ln, i) => (
                                      <p key={i} className="report-line">{ln}</p>
                                    ))}
                                    {c.luckyAges && c.luckyAges.length > 0 && (
                                      <div className="lucky-age-list">
                                        {c.luckyAges.map((la, i) => (
                                          <div key={i} className="lucky-age-item">
                                            <span className="lucky-age-range">{la.ageStart}~{la.ageEnd}세</span>
                                            <span className="lucky-age-kanji">{la.stemKr}{la.branchKr}</span>
                                            <span className="lucky-age-reason">{la.reason}</span>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                    {c.luckyAges && c.luckyAges.length === 0 && (
                                      <p className="report-line report-line-muted">대운 8구간 중 뚜렷한 강세 구간은 없다.</p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })()}
                      </>
                  ) : (
                      <div className={`quote-card fade-up stagger-2 ${gradeConf ? gradeConf.cssClass : ''}`}>
                        {result.grade && gradeConf && (
                            <div className={`grade-badge ${gradeConf.cssClass}`}>
                              <span className="grade-emoji">{gradeConf.emoji}</span>
                              <div className="grade-text">
                                <span className="grade-kr">{result.grade}</span>
                                <span className="grade-en">{gradeConf.label}</span>
                              </div>
                              <span className="grade-desc-tag">{gradeConf.desc}</span>
                            </div>
                        )}
                        {result.dateLabel && <div className="date-label">{result.dateLabel}</div>}
                        <p className="quote-text">{result.content}</p>
                        {result.detail && (
                            <>
                              <div className="divider"><span className="divider-icon">✦</span></div>
                              <p className="quote-detail">{result.detail}</p>
                            </>
                        )}
                        {result.type === 'quote' && <p className="quote-author">— {result.title}</p>}
                        {result.type === 'fortune' && (
                            <div className="daily-refresh-notice">
                              <span className="refresh-icon">↻</span>
                              {getTomorrowLabel()} 이후 새로운 운세가 열립니다
                            </div>
                        )}
                      </div>
                  )}
                </div>
            )}
          </div>
        </div>

        {step === 'result' && (
            <div className={`action-group fade-up ${smashing ? 'smashing' : ''}`}>
              <button className="btn-save" onClick={openSavePage}>리포트 저장</button>
              <button className="btn-reset" onClick={() => { setStep('intro'); setResult(null); }}>처음으로</button>
              <button className="btn-smash" onClick={handleSmash} title="다 날려버리기">💥</button>
            </div>
        )}
      </div>
  );
};

export default App;