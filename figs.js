/* ══════════════════════════════════════════════════════════════
   CAD·3D모델링 마스터 — 그림 모음 (그림06 · 2026-09-30)
   공용 그리기 도우미 links/fig.js 를 쓴다. index.html(배우기) 과 lesson.js(수업 슬라이드)가 함께 부른다.

   한 칸의 모양
     키: { cap:'캡션 한 줄', cards:['배우기 카드 제목'…], draw:function(){ … } }
       cards — index.html 의 LEARN 카드 제목(t)과 **똑같이**. 그 카드 제목 바로 아래에 그림이 나온다.
     순서 = 카드 안에서 나오는 순서.

   근거
     · 카드 본문(LEARN) · 슬라이드 본문(lesson.js)
     · 「도면 시트형식 만들기」 hwp — 윤곽선 좌표 · 중심마크 5mm · 표제란 8항목 · 레이어 6개 표
     · 기초제도(씨마스) Ⅵ. 컴퓨터 활용 제도(CAD) 교과서 — 도면 한계(A2 예 0,0~594,420) · 도면층 = 투명 유리 ·
       휠로 ZOOM/PAN · 정다각형 내접(I)/외접(C) · QLEADER 예 4×φ5
   자료에 없는 수치는 넣지 않았다. 치수 그림의 숫자는 기호를 보여 주려는 예시이고, 캡션에 그렇게 적었다.
   슬라이드에만 있던 그림 6장(작업순서·윈도우/크로싱·TRIM/EXTEND·ARRAY·선형/정렬·3D 순서)과
   index.html 에 있던 그림 4장(좌표·객체스냅·A3 시트·레이어 선)을 이 파일로 옮겨 규격대로 다시 그렸다.
   ══════════════════════════════════════════════════════════════ */
var FIGS = (function () {
  var F = window.FIG;
  if (!F) return {};
  var C = F.C;
  var t = F.t, box = F.box, line = F.line, arrow = F.arrow, callout = F.callout;

  /* 레이어 색 — 「도면 시트형식 만들기」 표 (index.html 의 LAYERS 와 같은 값) */
  var LC = { 1: '#38bdf8', 2: '#22c55e', 3: '#eab308', 4: '#ef4444', 5: '#ef4444', 6: '#111827' };
  var CHAIN = '14 4 2 4';

  /* 작은 도우미 */
  function dot(x, y, r, c) { return '<circle cx="' + x + '" cy="' + y + '" r="' + (r || 3.5) + '" fill="' + (c || C.ink) + '"/>'; }
  function divider(x, y1, y2) { return line(x, y1, x, y2, { c: C.grayM, w: 1.4, dash: '6 5' }); }
  function screen(x, y, w, h) { return box(x, y, w, h, { fill: C.grayL, c: C.grayM, r: 6, w: 1.4 }); }
  function head(cx, y, s, c) { return t(cx, y, s, { a: 'm', b: 1, c: c || C.ink }); }
  function note(cx, y, s, c, ans) { return t(cx, y, s, { a: 'm', size: 14, c: c || C.sub, ans: ans }); }
  function ngon(cx, cy, r, n, a0) {
    var p = [];
    for (var i = 0; i < n; i++) { var a = a0 + i * 2 * Math.PI / n; p.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); }
    return p;
  }
  function xmark(x, y, s, c, w) {
    return line(x - s, y - s, x + s, y + s, { c: c, w: w || 2.4 }) + line(x - s, y + s, x + s, y - s, { c: c, w: w || 2.4 });
  }
  /* 등각 투영 — 3D 그림용 */
  function iso(ox, oy, k) {
    return function (x, y, z) { return [ox + (x - y) * 0.866 * k, oy + ((x + y) * 0.5 - z) * k]; };
  }
  function face(P, pts, fill, o) {
    o = o || {};
    return F.poly(pts.map(function (p) { return P(p[0], p[1], p[2]); }), { close: 1, fill: fill, c: o.c || C.ink, w: o.w || 1.4 });
  }
  function cube(P, w, d, h, fills, o) {
    return face(P, [[0, 0, h], [w, 0, h], [w, d, h], [0, d, h]], fills[0], o) +
      face(P, [[0, d, 0], [w, d, 0], [w, d, h], [0, d, h]], fills[1], o) +
      face(P, [[w, 0, 0], [w, d, 0], [w, d, h], [w, 0, h]], fills[2], o);
  }

  return {

  /* ─────────── Ⅰ. CAD 시작하기 ─────────── */
  limits: { cards: ['도면 크기를 정한다 — LIMITS'],
    cap: 'LIMITS 로 도면 크기를 정한 뒤 ZOOM → All 을 해야 화면에 살아난다 (숫자는 교과서의 A2 예시)',
    draw: function () {
      var s = head(116, 28, '① LIMITS 만 한 뒤') + t(348, 28, '② ZOOM →', { a: 'e', b: 1, c: C.blue }) + t(354, 28, 'All', { b: 1, c: C.blue, ans: 1 });
      s += screen(16, 44, 200, 150) + screen(264, 44, 200, 150);
      s += F.path('M60,44 L60,166 L216,166', { c: C.blue, w: 2.2, dash: '8 5' }) + dot(60, 166, 4.5, C.blue) +
        t(68, 180, '0,0', { size: 14, b: 1, c: C.blue }) + t(206, 64, '나머지는 화면 밖', { a: 'e', size: 13, c: C.sub });
      s += box(280, 58, 168, 119, { fill: C.blueL, c: C.blue, w: 2.2, r: 0 }) + dot(280, 177, 4.5, C.blue) + dot(448, 58, 4.5, C.blue) +
        t(288, 163, '0,0', { size: 14, b: 1, c: C.blue }) + t(440, 74, '594,420', { a: 'e', size: 14, b: 1, c: C.blue });
      s += arrow(222, 119, 258, 119, { c: C.sub });
      s += note(116, 214, '화면은 그대로 — 일부만 보인다') + note(364, 214, '도면 전체가 화면에 들어온다', C.blue);
      return F.svg(480, 232, s);
    } },

  grid: { cards: ['모눈과 커서 — GRID · SNAP · ORTHO'],
    cap: 'GRID 는 모눈 점, SNAP 은 점에만 붙는 커서, ORTHO(F8) 는 수평·수직으로만 긋는 선',
    draw: function () {
      var s = '', xs = [8, 164, 320], i, j;
      for (var p = 0; p < 3; p++) s += screen(xs[p], 44, 152, 132);
      function dots(x0) {
        var d = '';
        for (i = 0; i < 6; i++) for (j = 0; j < 5; j++) d += dot(x0 + 26 + i * 20, 68 + j * 20, 2.2, C.sub);
        return d;
      }
      /* GRID */
      var x = xs[0];
      s += head(x + 76, 28, 'GRID') + box(x + 16, 58, 120, 100, { fill: 'none', c: C.blue, w: 1.4, r: 0, dash: '6 4' }) + dots(x);
      s += t(x + 136, 170, 'LIMITS 안에만', { a: 'e', size: 13, c: C.blue });
      /* SNAP */
      x = xs[1];
      s += head(x + 76, 28, 'SNAP') + dots(x);
      var cx = x + 66, cy = 108;
      s += dot(cx + 13, cy - 11, 4, C.grayM) + arrow(cx + 11, cy - 9, cx + 4, cy - 3, { c: C.orange, w: 1.6, head: 8 });
      s += line(cx - 15, cy, cx + 15, cy, { c: C.blue, w: 2 }) + line(cx, cy - 15, cx, cy + 15, { c: C.blue, w: 2 });
      /* ORTHO */
      x = xs[2];
      s += t(x + 70, 28, 'ORTHO', { a: 'e', b: 1 }) + t(x + 76, 28, '(F8)', { b: 1, ans: 1 });
      var px = x + 26, py = 150;
      s += line(px, py, x + 118, 74, { c: C.sub, w: 1.6, dash: '6 4' }) + t(x + 122, 70, '끔', { size: 14, c: C.sub });
      s += line(px, py, x + 136, py, { c: C.blue, w: 2.6 }) + line(px, py, px, 62, { c: C.blue, w: 2.6 }) +
        t(x + 120, 138, '켬', { a: 'm', size: 14, b: 1, c: C.blue }) + dot(px, py, 4, C.ink);
      s += note(xs[0] + 76, 200, '모눈종이처럼\n점을 찍는다', C.ink) + note(xs[1] + 76, 200, '커서가 점에만\n붙는다', C.ink) +
        note(xs[2] + 76, 200, '수평·수직으로만\n그린다', C.ink);
      return F.svg(480, 232, s);
    } },

  zoompan: { cards: ['화면 옮기기 — ZOOM 과 PAN'],
    cap: 'ZOOM 은 크게·작게(휠 돌리기), PAN 은 크기 그대로 보는 자리만 옮긴다(휠 누르고 이동)',
    draw: function () {
      var s = '', xs = [8, 164, 320];
      function part(cx, cy, k, o) {
        o = o || {};
        return box(cx - 30 * k, cy - 20 * k, 60 * k, 40 * k, { fill: o.fill || C.blueL, c: o.c || C.blue, w: 2, r: 3, dash: o.dash }) +
          F.circle(cx + 12 * k, cy, 8 * k, { fill: '#fff', c: o.c || C.blue, w: 2, dash: o.dash });
      }
      for (var p = 0; p < 3; p++) s += screen(xs[p], 44, 152, 120);
      s += head(xs[0] + 76, 28, '원래 화면') + part(xs[0] + 76, 104, 1);
      s += head(xs[1] + 76, 28, 'ZOOM', C.blue) + part(xs[1] + 76, 104, 1.7);
      s += head(xs[2] + 76, 28, 'PAN', C.blue) + part(xs[2] + 76, 104, 1, { fill: 'none', c: C.grayM, dash: '5 4' }) +
        part(xs[2] + 50, 126, 1) + arrow(xs[2] + 92, 90, xs[2] + 70, 108, { c: C.orange, w: 2, head: 9 });
      s += note(xs[0] + 76, 188, '기준', C.ink) + note(xs[1] + 76, 188, '휠 돌리기\n크기가 바뀐다', C.ink) +
        note(xs[2] + 76, 180, '휠 누르고 이동', C.ink) + note(xs[2] + 76, 198, '자리만 바뀐다', C.ink, 1);
      return F.svg(480, 222, s);
    } },

  osnap: { cards: ['객체스냅(OSNAP) — 정확히 찍어 주는 도우미'],
    cap: '객체스냅 표식 — 끝점 □ · 중간점 △ · 중심 ○ · 사분점 ◇ · 교차점 ×',
    draw: function () {
      var O = C.orange, s = '';
      s += line(30, 180, 170, 60, { w: 2.2 });
      s += box(24, 174, 12, 12, { fill: 'none', c: O, w: 2.2, r: 0 }) + box(164, 54, 12, 12, { fill: 'none', c: O, w: 2.2, r: 0 });
      s += F.poly([[100, 111], [108, 125], [92, 125]], { close: 1, c: O, w: 2.2 });
      s += t(44, 200, '끝점', { b: 1 }) + t(182, 58, '끝점', { b: 1 }) + t(114, 134, '중간점', { b: 1 });
      s += F.circle(285, 120, 52, { fill: 'none', w: 2.2 });
      s += F.circle(285, 120, 7, { fill: 'none', c: O, w: 2.2 }) + t(285, 146, '중심', { a: 'm', b: 1 });
      s += F.poly([[337, 112], [345, 120], [337, 128], [329, 120]], { close: 1, c: O, w: 2.2 }) +
        F.poly([[285, 60], [293, 68], [285, 76], [277, 68]], { close: 1, c: O, w: 2.2 }) + t(285, 46, '사분점', { a: 'm', b: 1, ans: 1 });
      s += line(372, 70, 466, 175, { w: 2.2 }) + line(372, 175, 466, 70, { w: 2.2 }) + xmark(419, 122.5, 8, O) +
        t(419, 196, '교차점', { a: 'm', b: 1 });
      return F.svg(480, 218, s);
    } },

  pick: { cards: ['객체 선택 — 윈도우와 크로싱'],
    cap: '윈도우는 상자 안에 완전히 든 것만, 크로싱은 걸치기만 해도 선택된다 (빨강 = 선택됨)',
    draw: function () {
      var s = divider(240, 16, 222);
      function panel(ox, cross) {
        var r = '';
        r += box(ox + 26, 62, 104, 116, { fill: cross ? 'rgba(22,163,74,.10)' : 'rgba(37,99,235,.10)',
          c: cross ? C.green : C.blue, w: 2, r: 0, dash: cross ? '7 5' : null });
        r += box(ox + 48, 80, 44, 44, { fill: 'none', c: C.red, w: 3, r: 0 });
        r += line(ox + 64, 158, ox + 222, 158, { c: cross ? C.red : C.ink, w: cross ? 3 : 2.2 });
        r += F.circle(ox + 192, 96, 18, { fill: 'none', w: 2.2 });
        return r;
      }
      s += panel(0, false) + panel(240, true);
      s += head(120, 30, '윈도우 · 실선 상자', C.blue) + head(360, 30, '크로싱 · 점선 상자', C.green);
      s += note(120, 204, '안에 완전히 든 것만', C.ink, 1) + note(360, 204, '걸치기만 해도', C.ink, 1);
      return F.svg(480, 228, s);
    } },

  /* ─────────── Ⅱ. 좌표와 그리기 ─────────── */
  coord: { cards: ['좌표를 넣는 세 가지 방법'],
    cap: '가로 50 · 세로 30 사각형을 세 방법으로 — @ 가 붙으면 「바로 앞 점 기준」',
    draw: function () {
      var s = divider(160, 16, 236) + divider(320, 16, 236);
      function rect(ox, c) {
        return F.poly([[ox + 52, 184], [ox + 127, 184], [ox + 127, 139], [ox + 52, 139]], { close: 1, c: c, w: 2.4 }) + dot(ox + 52, 184, 4, c);
      }
      /* ① 절대 */
      var ox = 0;
      s += head(80, 30, '① 절대좌표', C.blue) + t(80, 54, 'x,y', { a: 'm', size: 15, b: 1, c: C.sub });
      s += line(ox + 22, 214, ox + 150, 214, { c: C.line, w: 1.4 }) + line(ox + 22, 214, ox + 22, 76, { c: C.line, w: 1.4 });
      s += t(ox + 24, 228, '0,0', { size: 13, c: C.sub }) + rect(ox, C.blue);
      s += t(ox + 52, 199, '20,20', { a: 'm', size: 13, b: 1 }) + t(ox + 127, 199, '70,20', { a: 'm', size: 13, b: 1 }) +
        t(ox + 127, 126, '70,50', { a: 'm', size: 13, b: 1 }) + t(ox + 52, 126, '20,50', { a: 'm', size: 13, b: 1 });
      /* ② 상대 */
      ox = 160;
      s += head(ox + 80, 30, '② 상대좌표', C.green) + t(ox + 80, 54, '@x,y', { a: 'm', size: 15, b: 1, c: C.sub }) + rect(ox, C.green);
      s += t(ox + 46, 176, '시작', { a: 'e', size: 13, c: C.sub });
      s += arrow(ox + 56, 198, ox + 127, 198, { c: C.green, w: 1.6, head: 9 }) + t(ox + 90, 214, '@50,0', { a: 'm', size: 15, b: 1 });
      s += arrow(ox + 140, 184, ox + 140, 141, { c: C.green, w: 1.6, head: 9 }) + t(ox + 90, 162, '@0,30', { a: 'm', size: 15, b: 1 });
      /* ③ 상대극 */
      ox = 320;
      s += head(ox + 80, 30, '③ 상대극좌표', C.orange) + t(ox + 80, 54, '@거리<각도', { a: 'm', size: 15, b: 1, c: C.sub }) + rect(ox, C.orange);
      s += arrow(ox + 56, 198, ox + 127, 198, { c: C.orange, w: 1.6, head: 9 }) + t(ox + 90, 214, '@50<0', { a: 'm', size: 15, b: 1 });
      s += arrow(ox + 140, 184, ox + 140, 141, { c: C.orange, w: 1.6, head: 9 }) + t(ox + 90, 162, '@30<90', { a: 'm', size: 15, b: 1 });
      return F.svg(480, 244, s);
    } },

  polar5: { cards: ['같은 사각형을 세 방법으로 그려 보기'],
    cap: '기울어진 변은 상대극좌표로 — 한 변 80 인 정오각형은 거리는 그대로, 각도만 72° 씩 늘린다',
    draw: function () {
      var L = 110, a = 0, p = [[176, 222]], i, s = '';
      for (i = 0; i < 4; i++) { var q = p[p.length - 1]; p.push([q[0] + L * Math.cos(a), q[1] - L * Math.sin(a)]); a += 72 * Math.PI / 180; }
      var cx = 0, cy = 0; p.forEach(function (q) { cx += q[0] / 5; cy += q[1] / 5; });
      s += line(p[1][0], p[1][1], p[1][0] + 80, p[1][1], { c: C.line, w: 1.2, dash: '5 4' });
      var ar = 34, ex = p[1][0] + ar * Math.cos(72 * Math.PI / 180), ey = p[1][1] - ar * Math.sin(72 * Math.PI / 180);
      s += F.path('M' + (p[1][0] + ar) + ',' + p[1][1] + ' A' + ar + ',' + ar + ' 0 0 0 ' + ex.toFixed(1) + ',' + ey.toFixed(1), { c: C.orange, w: 1.8 });
      s += t(p[1][0] + 44, p[1][1] - 12, '72°', { size: 15, b: 1, c: C.orange });
      s += F.poly(p, { close: 1, c: C.blue, w: 2.6 });
      var lab = ['① @80<0', '② @80<72', '③ @80<144', '④ @80<216', '⑤ @80<288'];
      for (i = 0; i < 5; i++) {
        var A = p[i], B = p[(i + 1) % 5], mx = (A[0] + B[0]) / 2, my = (A[1] + B[1]) / 2;
        var dx = mx - cx, dy = my - cy, d = Math.sqrt(dx * dx + dy * dy), k = i === 1 ? 40 : 26;
        var al = dx / d > 0.3 ? 's' : (dx / d < -0.3 ? 'e' : 'm');
        s += t(mx + dx / d * k, my + dy / d * k, lab[i], { a: al, size: 15, b: i < 3 ? 1 : 0 });
      }
      s += dot(p[0][0], p[0][1], 5, C.ink) + t(p[0][0] - 8, p[0][1] + 16, '시작', { a: 'e', size: 13, c: C.sub });
      return F.svg(480, 262, s);
    } },

  xline: { cards: ['선 그리기 — LINE 과 XLINE'],
    cap: 'LINE 은 점과 점 사이의 선, XLINE 은 화면 끝까지 이어지는 무한선 — 중심선을 잡을 때 쓴다',
    draw: function () {
      var s = divider(240, 16, 214);
      s += head(120, 30, 'LINE — 점과 점 사이');
      s += F.poly([[40, 170], [110, 76], [204, 150]], { w: 2.6 }) + dot(40, 170, 5) + dot(110, 76, 5) + dot(204, 150, 5);
      s += t(36, 188, 'P1', { a: 'm', size: 14, b: 1 }) + t(110, 60, 'P2', { a: 'm', size: 14, b: 1 }) + t(210, 170, 'P3', { a: 'm', size: 14, b: 1 });
      s += note(120, 204, '끝이 있는 선', C.ink);
      s += head(360, 30, 'XLINE — 무한선', C.red) + screen(256, 44, 208, 146);
      s += F.circle(360, 117, 30, { fill: '#fff', w: 2.2 });
      s += line(256, 117, 464, 117, { c: C.red, w: 1.6, dash: CHAIN }) + line(360, 44, 360, 190, { c: C.red, w: 1.6, dash: CHAIN });
      s += t(458, 60, '화면 끝까지', { a: 'e', size: 13, c: C.red, b: 1 });
      s += note(360, 208, '중심선으로 많이 쓴다', C.ink);
      return F.svg(480, 222, s);
    } },

  polygon: { cards: ['이어진 하나로 그리기 — PLINE · POLYGON · RECTANG'],
    cap: 'POLYGON 은 원에 내접(I) — 꼭짓점이 원 위, 외접(C) — 변이 원에 닿음 · RECTANG 은 대각선 두 점',
    draw: function () {
      var s = divider(160, 16, 214) + divider(320, 16, 214), cy = 116, a0 = -Math.PI / 2;
      s += head(80, 30, '원에 내접 (I)') + F.circle(80, cy, 56, { fill: 'none', c: C.line, w: 1.4, dash: '6 4' });
      s += F.poly(ngon(80, cy, 56, 5, a0), { close: 1, c: C.blue, w: 2.4 }) + line(80, cy, 80, cy - 56, { c: C.orange, w: 1.8 }) + dot(80, cy, 3.5);
      s += note(80, 196, '꼭짓점이 원 위', C.ink);
      var r = 46, R = r / Math.cos(Math.PI / 5), m = a0 + Math.PI / 5;
      s += head(240, 30, '원에 외접 (C)') + F.circle(240, cy, r, { fill: 'none', c: C.line, w: 1.4, dash: '6 4' });
      s += F.poly(ngon(240, cy, R, 5, a0), { close: 1, c: C.blue, w: 2.4 }) +
        line(240, cy, 240 + r * Math.cos(m), cy + r * Math.sin(m), { c: C.orange, w: 1.8 }) + dot(240, cy, 3.5);
      s += note(240, 196, '변이 원에 닿는다', C.ink);
      s += head(400, 30, 'RECTANG') + box(345, 76, 110, 84, { fill: 'none', c: C.blue, w: 2.4, r: 0 });
      s += line(345, 160, 455, 76, { c: C.line, w: 1.2, dash: '5 4' }) + dot(345, 160, 5, C.orange) + dot(455, 76, 5, C.orange);
      s += t(345, 178, 'P1', { a: 'm', size: 14, b: 1 }) + t(455, 60, 'P2', { a: 'm', size: 14, b: 1 });
      s += note(400, 196, '대각선 두 점', C.ink);
      return F.svg(480, 214, s);
    } },

  circle: { cards: ['둥근 것 — CIRCLE · ARC · ELLIPSE'],
    cap: 'CIRCLE 옵션 여섯 가지 — 주황 점은 찍는 자리 · 접하는 자리',
    draw: function () {
      var O = C.orange, s = line(8, 150, 472, 150, { c: C.edge, w: 1.4 }) + divider(160, 12, 290) + divider(320, 12, 290);
      var T = [['r', '반지름'], ['d', '지름'], ['2p', '두 점'], ['3p', '세 점'], ['ttr', '접선 둘 + 반지름'], ['ttt', '접선 셋']];
      for (var k = 0; k < 6; k++) {
        var ox = (k % 3) * 160, oy = k < 3 ? 0 : 150, cx = ox + 80, cy = oy + 96, r = 32, b = '';
        b += t(cx, oy + 22, T[k][0], { a: 'm', b: 1, size: 17, c: C.blue, ans: k === 4 }) + t(cx, oy + 42, T[k][1], { a: 'm', size: 13, c: C.sub, ans: k === 4 });
        if (k === 0) b += F.circle(cx, cy, r, { fill: 'none', w: 2.2 }) + dot(cx, cy, 3.5) + line(cx, cy, cx + r, cy, { c: O, w: 2 }) +
          t(cx + 16, cy - 10, 'r', { a: 'm', size: 15, b: 1, c: O });
        if (k === 1) b += F.circle(cx, cy, r, { fill: 'none', w: 2.2 }) + line(cx - r, cy, cx + r, cy, { c: O, w: 2 }) +
          t(cx, cy - 12, 'd', { a: 'm', size: 15, b: 1, c: O });
        if (k === 2) b += F.circle(cx, cy, r, { fill: 'none', w: 2.2 }) + dot(cx - r, cy, 5, O) + dot(cx + r, cy, 5, O);
        if (k === 3) b += F.circle(cx, cy, r, { fill: 'none', w: 2.2 }) + [200, 320, 80].map(function (d) {
          var a = d * Math.PI / 180; return dot(cx + r * Math.cos(a), cy - r * Math.sin(a), 5, O); }).join('');
        if (k === 4) {
          b += line(cx - 60, cy + r, cx + 60, cy + r, { w: 1.8 }) + line(cx - r, cy - 46, cx - r, cy + r + 8, { w: 1.8 });
          b += F.circle(cx, cy, r, { fill: 'none', c: C.blue, w: 2.2 }) + dot(cx, cy + r, 5, O) + dot(cx - r, cy, 5, O) +
            line(cx, cy, cx + r * 0.71, cy - r * 0.71, { c: O, w: 1.6 }) + t(cx + 16, cy - 20, 'r', { size: 15, b: 1, c: O });
        }
        if (k === 5) {
          var rr = 26, c2 = cy + 4, V = ngon(cx, c2, rr * 2, 3, -Math.PI / 2);
          b += F.poly(V, { close: 1, w: 1.8 }) + F.circle(cx, c2, rr, { fill: 'none', c: C.blue, w: 2.2 });
          b += [90, -30, 210].map(function (d) { var a = d * Math.PI / 180; return dot(cx + rr * Math.cos(a), c2 + rr * Math.sin(a), 5, O); }).join('');
        }
        s += b;
      }
      return F.svg(480, 298, s);
    } },

  donut: { cards: ['점과 도넛 — POINT · DDPTYPE · DONUT'],
    cap: 'DONUT 은 내경과 외경 사이를 채운다(내경 0 이면 꽉 찬 원) · DDPTYPE 은 점의 모양을 바꾼다',
    draw: function () {
      var s = divider(160, 16, 206) + divider(320, 16, 206), cy = 104;
      s += head(80, 30, 'DONUT');
      s += '<path d="M36,' + cy + ' a44,44 0 1 0 88,0 a44,44 0 1 0 -88,0 Z M56,' + cy + ' a24,24 0 1 1 48,0 a24,24 0 1 1 -48,0 Z" fill="' + C.ink + '" fill-rule="evenodd"/>';
      s += F.arrow(57, cy, 103, cy, { c: C.orange, w: 1.4, head: 8, both: true }) + t(80, cy - 11, '내경', { a: 'm', size: 13, b: 1, c: C.orange });
      s += line(36, cy + 6, 36, cy + 64, { c: C.blue, w: 1 }) + line(124, cy + 6, 124, cy + 64, { c: C.blue, w: 1 }) +
        F.arrow(36, cy + 58, 124, cy + 58, { c: C.blue, w: 1.2, head: 8, both: true }) + t(80, cy + 74, '외경', { a: 'm', size: 14, b: 1, c: C.blue });
      s += head(240, 30, '내경 0') + F.circle(240, cy, 44, { fill: C.ink, c: C.ink }) + note(240, 180, '꽉 찬 원이 된다', C.ink);
      s += head(400, 30, 'POINT · DDPTYPE');
      s += dot(354, cy, 1.6) + t(354, cy + 30, '기본 점', { a: 'm', size: 14 }) + t(354, cy + 48, '잘 안 보인다', { a: 'm', size: 13, c: C.sub });
      s += arrow(370, cy, 414, cy, { c: C.sub, w: 1.6, head: 9 });
      s += F.circle(436, cy, 12, { fill: 'none', c: C.blue, w: 2 }) + xmark(436, cy, 8.5, C.blue, 2) +
        t(436, cy + 38, '모양\n바꾼 점', { a: 'm', size: 14 });
      return F.svg(480, 206, s);
    } },

  /* ─────────── Ⅲ. 도면 편집하기 ─────────── */
  oops: { cards: ['지우기와 되돌리기'],
    cap: '선을 지우고(ERASE) 원을 그린 뒤 — OOPS 는 지운 선을 되살리고, U 는 방금 한 명령(원)을 취소한다',
    draw: function () {
      var s = '';
      function frame(fx, fy, o) {
        var b = box(fx, fy, 140, 80, { fill: '#fff', c: C.grayM, r: 6, w: 1.4 });
        b += box(fx + 14, fy + 20, 40, 40, { fill: 'none', w: 2.2, r: 0 });
        if (o.line) b += line(fx + 66, fy + 64, fx + 94, fy + 16, { c: o.line === 'back' ? C.green : (o.line === 'ghost' ? C.grayM : C.ink),
          w: o.line === 'back' ? 3.4 : 2.2, dash: o.line === 'ghost' ? '5 4' : null });
        if (o.circ) b += F.circle(fx + 116, fy + 40, 15, { fill: 'none', c: o.circ === 'ghost' ? C.red : C.ink, w: 2.2, dash: o.circ === 'ghost' ? '5 4' : null });
        return b;
      }
      s += head(80, 28, '① 선 · 사각형') + frame(10, 40, { line: 1 });
      s += head(240, 28, '② ERASE 선') + frame(170, 40, { line: 'ghost' });
      s += head(400, 28, '③ CIRCLE 원') + frame(330, 40, { circ: 1 });
      s += arrow(152, 80, 168, 80, { c: C.sub, head: 9 }) + arrow(312, 80, 328, 80, { c: C.sub, head: 9 });
      s += F.route([[400, 122], [400, 138], [160, 138], [160, 164]], { c: C.sub, w: 1.6, head: 9 }) +
        F.route([[400, 138], [320, 138], [320, 164]], { c: C.sub, w: 1.6, head: 9 });
      s += t(146, 152, 'OOPS', { a: 'e', b: 1, c: C.green }) + frame(90, 166, { line: 'back', circ: 1 });
      s += t(334, 152, 'U', { a: 's', b: 1, c: C.red }) + frame(250, 166, { circ: 'ghost' });
      s += t(160, 268, '지운 선이 돌아온다', { a: 'm', size: 14, b: 1, c: C.green, ans: 1 }) + t(320, 268, '방금 그린 원이 취소된다', { a: 'm', size: 14, b: 1, c: C.red });
      return F.svg(480, 284, s);
    } },

  mirror: { cards: ['옮기고 복사하기 — COPY · MOVE · MIRROR'],
    cap: 'MOVE 는 원래 것이 없어지고 COPY 는 남는다 · MIRROR 는 축으로 대칭 복사(글자까지 뒤집힌다)',
    draw: function () {
      var s = divider(160, 16, 232) + divider(320, 16, 232);
      function L(x, y, o) { return F.poly([[x, y], [x + 40, y], [x + 40, y + 14], [x + 14, y + 14], [x + 14, y + 44], [x, y + 44]], { close: 1, c: o.c || C.ink, w: 2.2, dash: o.dash, fill: o.fill || 'none' }); }
      s += head(80, 30, 'MOVE 옮기기') + L(22, 62, { c: C.grayM, dash: '5 4' }) + L(92, 112, { c: C.blue, fill: C.blueL }) +
        arrow(54, 90, 96, 122, { c: C.sub, w: 1.6, head: 9 });
      s += note(80, 196, '원래 것이\n없어진다', C.ink);
      s += head(240, 30, 'COPY 복사') + L(182, 62, {}) + L(252, 112, { c: C.blue, fill: C.blueL }) +
        arrow(214, 90, 256, 122, { c: C.sub, w: 1.6, head: 9 });
      s += note(240, 196, '원래 것이\n남는다', C.ink, 1);
      var ax = 400;
      s += head(400, 30, 'MIRROR 대칭') + line(ax, 50, ax, 176, { c: C.red, w: 1.4, dash: CHAIN });
      s += L(336, 70, {}) + F.g(L(0, 0, { c: C.blue, fill: C.blueL }), { x: ax + (ax - 336), y: 70, s: '-1 1' });
      s += t(362, 150, 'CAD', { a: 'm', b: 1, size: 18 }) + F.g(t(0, 0, 'CAD', { a: 'm', b: 1, size: 18, c: C.red }), { x: 438, y: 150, s: '-1 1' });
      s += note(400, 196, '글자도 뒤집힌다', C.red) + t(400, 216, 'MIRRTEXT 로 바로 세운다', { a: 'm', size: 13, c: C.sub, ans: 1 });
      return F.svg(480, 234, s);
    } },

  offset: { cards: ['OFFSET — 도면 요소의 대부분을 만드는 명령'],
    cap: 'OFFSET — 일정 간격만큼 떨어진 같은 모양을 하나 더. 원을 오프셋하면 동심원',
    draw: function () {
      var s = divider(240, 16, 206);
      s += head(120, 30, '선 → 평행선') + line(30, 150, 196, 150, { w: 2.6 }) + line(30, 96, 196, 96, { c: C.blue, w: 2.6 });
      s += F.arrow(214, 150, 214, 96, { c: C.orange, w: 1.4, head: 8, both: true }) + t(206, 123, '간격', { a: 'e', size: 14, b: 1, c: C.orange });
      s += t(30, 170, '원래', { size: 14 }) + t(30, 80, '새로 생김', { size: 14, b: 1, c: C.blue });
      s += t(344, 30, '원 →', { a: 'e', b: 1 }) + t(350, 30, '동심원', { b: 1, ans: 1 }) + F.circle(360, 118, 34, { fill: 'none', w: 2.6 }) + F.circle(360, 118, 62, { fill: 'none', c: C.blue, w: 2.6 }) + dot(360, 118, 3.5);
      s += F.arrow(394, 118, 422, 118, { c: C.orange, w: 1.4, head: 8, both: true }) + t(428, 118, '간격', { a: 's', size: 13, b: 1, c: C.orange });
      s += note(120, 198, '판재·벽 두께를 빨리 그린다', C.ink) + note(360, 198, '같은 중심, 더 큰 원', C.ink);
      return F.svg(480, 212, s);
    } },

  array: { cards: ['ARRAY — 규칙적으로 여러 개'],
    cap: 'ARRAY — 하나만 그리고 사각형(R) 은 행·열로, 원형(P) 은 중심을 빙 둘러 늘어놓는다 (파랑 = 처음 그린 것)',
    draw: function () {
      var s = divider(240, 16, 212), c, r;
      s += head(120, 30, '사각형 배열 (R)', C.blue);
      for (c = 0; c < 3; c++) for (r = 0; r < 2; r++) {
        var first = c === 0 && r === 1;
        s += box(46 + c * 56, 62 + r * 54, 34, 34, { fill: first ? C.blueL : C.grayL, c: first ? C.blue : C.line, w: first ? 2.6 : 1.8, r: 4 });
      }
      s += t(137, 164, '열 3', { a: 'm', size: 14, b: 1 }) + t(30, 106, '행 2', { a: 'e', size: 14, b: 1 });
      s += note(120, 196, '행 · 열 · 간격', C.ink);
      s += head(360, 30, '원형 배열 (P)', C.blue) + F.circle(360, 116, 52, { fill: 'none', c: C.line, w: 1.4, dash: '6 4' });
      s += line(352, 116, 368, 116, { w: 1.6 }) + line(360, 108, 360, 124, { w: 1.6 }) + t(372, 130, '중심', { size: 13, c: C.sub });
      for (var i = 0; i < 6; i++) {
        var a = -Math.PI / 2 + i * Math.PI / 3;
        s += F.circle(360 + 52 * Math.cos(a), 116 + 52 * Math.sin(a), 10, { fill: i ? C.grayL : C.blueL, c: i ? C.line : C.blue, w: i ? 1.8 : 2.6 });
      }
      s += note(360, 196, '중심 · 개수 · 각도', C.ink);
      return F.svg(480, 212, s);
    } },

  stretch: { cards: ['크기 바꾸기 — SCALE 과 STRETCH'],
    cap: 'SCALE 은 배율로 가로·세로가 함께, STRETCH 는 걸친 쪽만 늘어난다',
    draw: function () {
      var s = divider(130, 16, 206) + divider(305, 16, 206);
      s += head(65, 30, '원래') + box(40, 126, 50, 34, { fill: C.blueL, c: C.blue, w: 2.2, r: 0 });
      s += head(218, 30, 'SCALE 2배', C.blue) + box(158, 92, 50, 34, { fill: 'none', c: C.grayM, w: 1.4, r: 0, dash: '5 4' }) +
        box(158, 92, 100, 68, { fill: C.blueL, c: C.blue, w: 2.2, r: 0 });
      s += note(218, 186, '가로·세로 모두 커진다', C.ink);
      s += head(392, 30, 'STRETCH', C.green) + box(330, 126, 100, 34, { fill: C.blueL, c: C.blue, w: 2.2, r: 0 }) +
        box(330, 126, 50, 34, { fill: 'none', c: C.grayM, w: 1.4, r: 0, dash: '5 4' });
      s += box(410, 108, 38, 70, { fill: 'rgba(22,163,74,.10)', c: C.green, w: 1.6, r: 0, dash: '7 5' }) +
        arrow(384, 88, 424, 88, { c: C.green, w: 2, head: 9 }) + t(404, 74, '걸친 쪽', { a: 'm', size: 13, c: C.green, b: 1 });
      s += note(392, 186, '한쪽만 늘어난다', C.ink, 1);
      return F.svg(480, 206, s);
    } },

  trim: { cards: ['TRIM 과 EXTEND — 짝으로 외운다'],
    cap: 'TRIM 은 경계 밖으로 튀어나온 쪽을 자르고, EXTEND 는 모자란 쪽을 경계까지 늘린다 — ① 경계 먼저, ② 대상',
    draw: function () {
      var s = divider(240, 16, 222);
      s += head(120, 30, 'TRIM 자르기', C.red);
      s += line(130, 52, 130, 170, { c: C.blue, w: 3 }) + t(130, 186, '경계', { a: 'm', size: 14, b: 1, c: C.blue }) + F.num(148, 60, 1, { c: C.blue });
      s += line(30, 110, 130, 110, { w: 2.6 }) + line(130, 110, 214, 110, { c: C.red, w: 2.6, dash: '6 5' }) + xmark(176, 110, 9, C.red) +
        F.num(178, 84, 2, { c: C.red });
      s += note(120, 210, '튀어나온 쪽을 잘라낸다', C.ink);
      s += head(360, 30, 'EXTEND 늘리기', C.green);
      s += line(440, 52, 440, 170, { c: C.blue, w: 3 }) + t(440, 186, '경계', { a: 'm', size: 14, b: 1, c: C.blue }) + F.num(422, 60, 1, { c: C.blue });
      s += line(266, 110, 356, 110, { w: 2.6 }) + arrow(356, 110, 438, 110, { c: C.green, w: 2.6, dash: '6 5' }) + F.num(346, 84, 2, { c: C.green });
      s += note(360, 210, '모자란 쪽을 늘린다', C.ink);
      return F.svg(480, 224, s);
    } },

  chamfer: { cards: ['모서리 다듬기 — CHAMFER 와 FILLET'],
    cap: '모따기(CHAMFER) 는 비스듬히 깎아 C 로, 모깎기(FILLET) 는 둥글게 굴려 R 로 적는다 (숫자는 예시)',
    draw: function () {
      var s = divider(240, 16, 206);
      s += head(120, 30, 'CHAMFER 모따기');
      s += F.path('M40,176 L40,72 L136,72 L176,112 L176,176 Z', { fill: C.grayL, w: 2.4 });
      s += F.poly([[136, 72], [176, 72], [176, 112]], { c: C.line, w: 1.4, dash: '5 4' });
      s += callout(156, 92, 196, 60, 'C1', { c: C.orange, tc: C.orange, b: 1, size: 17, ans: 1 });
      s += note(120, 198, '비스듬히 깎는다 → C', C.ink);
      s += head(360, 30, 'FILLET 모깎기');
      s += F.path('M280,176 L280,72 L376,72 A40,40 0 0 1 416,112 L416,176 Z', { fill: C.grayL, w: 2.4 });
      s += F.poly([[376, 72], [416, 72], [416, 112]], { c: C.line, w: 1.4, dash: '5 4' });
      s += callout(404, 84, 440, 56, 'R3', { c: C.orange, tc: C.orange, b: 1, size: 17 });
      s += note(360, 198, '둥글게 굴린다 → R', C.ink);
      return F.svg(480, 212, s);
    } },

  /* ─────────── Ⅳ. 해칭 · 문자 · 도면층 ─────────── */
  hatch: { cards: ['해칭 — BHATCH'],
    cap: 'BHATCH — 닫힌 영역은 자동으로 채워지고, 한 곳이라도 끊겨 있으면 해칭이 안 된다',
    draw: function () {
      var s = divider(240, 16, 214);
      s += t(120, 30, '닫힌 영역', { a: 'm', b: 1, c: C.green, ans: 1 }) + F.hatch(40, 60, 160, 104, { gap: 11, c: C.blue }) + box(40, 60, 160, 104, { fill: 'none', w: 2.4, r: 0 });
      s += note(120, 190, '자동으로 채워진다', C.green);
      s += head(360, 30, '끊긴 영역', C.red);
      s += line(280, 76, 340, 76, { w: 2.4 }) + line(372, 76, 440, 76, { w: 2.4 }) + line(440, 76, 440, 164, { w: 2.4 }) +
        line(440, 164, 280, 164, { w: 2.4 }) + line(280, 164, 280, 76, { w: 2.4 });
      s += F.circle(356, 76, 20, { fill: 'none', c: C.red, w: 2, dash: '5 4' }) + t(380, 56, '끊긴 자리', { size: 14, b: 1, c: C.red });
      s += t(360, 124, '해칭 안 됨', { a: 'm', b: 1, c: C.red });
      s += note(360, 190, 'TRIM · EXTEND 로 붙인다', C.ink);
      return F.svg(480, 212, s);
    } },

  layers: { cards: ['도면층(LAYER) — 투명 도면을 여러 장 겹친 것'],
    cap: '도면층 — 투명한 도면 여러 장에 나누어 그리고, 겹쳐 보면 한 장의 도면이 된다',
    draw: function () {
      var s = '', names = ['외형선 층', '중심선 층', '치수 층'];
      for (var i = 0; i < 3; i++) {
        var oy = 34 + i * 62;
        var P = (function (oy) { return function (x, y) { return [110 + x * 0.9 + (140 - y) * 0.55, oy + y * 0.36]; }; })(oy);
        var pl = function (pts, o) { return F.poly(pts.map(function (q) { return P(q[0], q[1]); }), o); };
        s += pl([[0, 0], [200, 0], [200, 140], [0, 140]], { close: 1, fill: 'rgba(219,234,254,.72)', c: C.blue, w: 1.4 });
        if (i === 0) {
          s += pl([[40, 30], [160, 30], [160, 110], [40, 110]], { close: 1, c: LC[2], w: 2.6 });
          var cp = []; for (var k = 0; k <= 24; k++) { var a = k * Math.PI / 12; cp.push([100 + 20 * Math.cos(a), 70 + 20 * Math.sin(a)]); }
          s += pl(cp, { c: LC[2], w: 2.4 });
        }
        if (i === 1) s += pl([[20, 70], [180, 70]], { c: LC[5], w: 1.6, dash: CHAIN }) + pl([[100, 12], [100, 128]], { c: LC[5], w: 1.6, dash: CHAIN });
        if (i === 2) s += pl([[40, 112], [40, 132]], { c: LC[4], w: 1.2 }) + pl([[160, 112], [160, 132]], { c: LC[4], w: 1.2 }) +
          pl([[40, 126], [160, 126]], { c: LC[4], w: 1.6 });
        s += t(98, oy + 26, names[i], { a: 'e', size: 15, b: 1 });
      }
      s += arrow(362, 118, 386, 118, { c: C.sub, w: 2 });
      var rx = 392, ry = 78;
      s += box(rx, ry, 80, 74, { fill: '#fff', c: C.grayM, r: 4, w: 1.4 });
      s += box(rx + 14, ry + 12, 52, 38, { fill: 'none', c: LC[2], w: 2.2, r: 0 }) + F.circle(rx + 40, ry + 31, 9, { fill: 'none', c: LC[2], w: 2 });
      s += line(rx + 6, ry + 31, rx + 74, ry + 31, { c: LC[5], w: 1.2, dash: '8 3 2 3' }) + line(rx + 40, ry + 6, rx + 40, ry + 56, { c: LC[5], w: 1.2, dash: '8 3 2 3' });
      s += line(rx + 14, ry + 62, rx + 66, ry + 62, { c: LC[4], w: 1.2 });
      s += t(rx + 40, ry + 96, '겹쳐 보면', { a: 'm', size: 14, b: 1 }) + t(rx + 40, ry + 114, '한 장', { a: 'm', size: 14, b: 1 });
      return F.svg(480, 250, s);
    } },

  block: { cards: ['블록 — BLOCK 과 INSERT'],
    cap: 'BLOCK 으로 한 번 묶어 두면, INSERT 로 넣을 때마다 위치 · 크기 · 회전을 따로 정한다',
    draw: function () {
      var s = '';
      function sym(o) { return F.g(F.path('M-9,-16 L0,0 L18,-32', { c: o.c || C.blue, w: 2.4 }), o); }
      s += head(90, 30, 'BLOCK 한 번 묶기') + box(46, 58, 88, 88, { fill: 'none', c: C.sub, w: 1.4, r: 6, dash: '6 4' });
      s += sym({ x: 84, y: 130 }) + dot(84, 130, 4.5, C.orange) + callout(84, 130, 70, 172, '기준점', { c: C.orange, size: 14 });
      s += arrow(150, 102, 196, 102, { c: C.sub, w: 2 });
      s += head(340, 30, 'INSERT 여러 번');
      s += box(230, 112, 200, 80, { fill: C.grayL, w: 2.2, r: 0 });
      s += sym({ x: 262, y: 112 }) + t(262, 70, '위치', { a: 'm', size: 14, b: 1 });
      s += sym({ x: 330, y: 112, s: 1.6 }) + t(366, 70, '크기 1.6배', { a: 's', size: 14, b: 1 });
      s += sym({ x: 430, y: 160, r: 90 }) + t(430, 206, '회전 90°', { a: 'e', size: 14, b: 1 });
      return F.svg(480, 218, s);
    } },

  /* ─────────── Ⅴ. 치수 기입과 출력 ─────────── */
  dims: { cards: ['길이 치수 — 선형과 정렬'],
    cap: '비스듬한 변에 선형(DIMLINEAR) 을 쓰면 수평 거리가, 정렬(DIMALIGNED) 을 쓰면 실제 길이가 적힌다',
    draw: function () {
      var s = divider(240, 16, 222);
      function part(ox) { return F.poly([[ox + 40, 180], [ox + 120, 80], [ox + 200, 80], [ox + 200, 180]], { close: 1, fill: C.grayL, w: 2.4 }); }
      s += t(120, 24, 'DIMLINEAR 선형', { a: 'm', b: 1 }) + part(0);
      s += line(40, 176, 40, 44, { c: C.red, w: 1 }) + line(120, 76, 120, 44, { c: C.red, w: 1 }) +
        F.arrow(40, 52, 120, 52, { c: C.red, w: 1.2, head: 9, both: true }) + t(80, 40, '수평 거리', { a: 'm', size: 14, b: 1, c: C.red });
      s += note(120, 206, '비스듬한 변에는 틀린다', C.red);
      s += t(360, 24, 'DIMALIGNED 정렬', { a: 'm', b: 1 }) + part(240);
      s += F.dim(280, 180, 360, 80, '실제 길이', { off: 24, c: C.green, size: 14 });
      s += note(360, 206, '변과 나란히 — 실제 길이', C.green);
      return F.svg(480, 222, s);
    } },

  dimround: { cards: ['둥근 것의 치수 — 반지름 · 지름 · 각도'],
    cap: '완전한 원은 지름 ⌀, 원의 일부(호)는 반지름 R, 각도는 호로 잰다 (숫자는 예시)',
    draw: function () {
      var s = divider(160, 16, 216) + divider(320, 16, 216), O = C.orange;
      s += t(80, 26, 'DIMDIAMETER', { a: 'm', b: 1, size: 15 }) + t(80, 46, '완전한 원 → ⌀', { a: 'm', size: 14, c: C.sub });
      var cx = 80, cy = 130, r = 44, a = -Math.PI / 6;
      s += F.circle(cx, cy, r, { fill: 'none', w: 2.4 });
      s += line(cx - 7, cy, cx + 7, cy, { c: C.blue, w: 1.6 }) + line(cx, cy - 7, cx, cy + 7, { c: C.blue, w: 1.6 });
      s += F.arrow(cx - r * Math.cos(a), cy - r * Math.sin(a), cx + r * Math.cos(a), cy + r * Math.sin(a), { c: O, w: 1.3, head: 9, both: true });
      s += t(cx + 34, cy - 58, '⌀30', { a: 'm', size: 15, b: 1, c: O });
      s += callout(cx + 5, cy + 4, cx + 10, cy + 70, '중심 표시', { c: C.blue, size: 13, a: 'm' });
      s += t(240, 26, 'DIMRADIUS', { a: 'm', b: 1, size: 15 }) + t(240, 46, '호 → R', { a: 'm', size: 14, c: C.sub });
      s += F.path('M186,190 L186,86 L256,86 A34,34 0 0 1 290,120 L290,190 Z', { fill: C.grayL, w: 2.4 });
      s += dot(256, 120, 3) + F.arrow(256, 120, 256 + 34 * 0.707, 120 - 34 * 0.707, { c: O, w: 1.3, head: 9 }) +
        t(284, 76, 'R10', { size: 15, b: 1, c: O });
      s += t(400, 26, 'DIMANGULAR', { a: 'm', b: 1, size: 15 }) + t(400, 46, '각도', { a: 'm', size: 14, c: C.sub });
      var vx = 345, vy = 180, q = Math.PI / 4;
      s += line(vx, vy, 465, vy, { w: 2.4 }) + line(vx, vy, vx + 110 * Math.cos(q), vy - 110 * Math.sin(q), { w: 2.4 });
      s += F.path('M' + (vx + 64) + ',' + vy + ' A64,64 0 0 0 ' + (vx + 64 * Math.cos(q)).toFixed(1) + ',' + (vy - 64 * Math.sin(q)).toFixed(1), { c: O, w: 1.6 });
      s += t(vx + 78 * Math.cos(q / 2), vy - 78 * Math.sin(q / 2), '45°', { size: 15, b: 1, c: O });
      return F.svg(480, 216, s);
    } },

  dimchain: { cards: ['여러 개를 이어서 — QDIM · 기준선 · 연속'],
    cap: '기준선 치수는 한 기준에서 층층이, 연속 치수는 앞 치수 끝에서 한 줄로 (숫자는 예시)',
    draw: function () {
      var s = divider(240, 16, 250);
      function part(ox) {
        var x = [ox + 30, ox + 80, ox + 117.5, ox + 155];
        return { x: x, s: F.poly([[x[0], 200], [x[0], 130], [x[1], 130], [x[1], 150], [x[2], 150], [x[2], 170], [x[3], 170], [x[3], 200]], { close: 1, fill: C.grayL, w: 2.4 }) };
      }
      var A = part(24), B = part(264), c1 = C.blue, c2 = C.orange;
      s += t(120, 26, 'DIMBASELINE 기준선', { a: 'm', b: 1, size: 15 }) + A.s;
      var ys = [110, 88, 66], tx = ['20', '35', '50'], tops = [130, 150, 170];
      s += line(A.x[0], 126, A.x[0], 58, { c: c1, w: 1 });
      for (var i = 0; i < 3; i++) {
        s += line(A.x[i + 1], tops[i] - 4, A.x[i + 1], ys[i] - 6, { c: c1, w: 1 });
        s += F.dim(A.x[0], ys[i], A.x[i + 1], ys[i], tx[i], { c: c1, size: 14 });
      }
      s += note(120, 226, '한 기준에서 — 층층이', C.ink, 1) + t(120, 246, '누적 오차를 막는다', { a: 'm', size: 13, c: C.sub });
      s += t(360, 26, 'DIMCONTINUE 연속', { a: 'm', b: 1, size: 15 }) + B.s;
      var tx2 = ['20', '15', '15'];
      s += line(B.x[0], 126, B.x[0], 104, { c: c2, w: 1 });
      for (i = 0; i < 3; i++) {
        s += line(B.x[i + 1], tops[i] - 4, B.x[i + 1], 104, { c: c2, w: 1 });
        s += F.dim(B.x[i], 110, B.x[i + 1], 110, tx2[i], { c: c2, size: 14 });
      }
      s += note(360, 226, '앞 치수 끝에서 — 한 줄로', C.ink, 1) + t(360, 246, '칸마다 길이가 중요할 때', { a: 'm', size: 13, c: C.sub });
      return F.svg(480, 258, s);
    } },

  leader: { cards: ['지시선과 공차 — QLEADER · TOLERANCE'],
    cap: 'QLEADER 는 지시선으로 가공 지시를 붙이고, TOLERANCE 는 기하공차 틀을 넣는다 (4×⌀5 는 교과서 예시)',
    draw: function () {
      var s = divider(240, 16, 218);
      s += t(120, 26, 'QLEADER 지시선', { a: 'm', b: 1 });
      s += box(26, 88, 172, 100, { fill: C.grayL, w: 2.4, r: 0 });
      [[56, 114], [168, 114], [56, 162], [168, 162]].forEach(function (p) { s += F.circle(p[0], p[1], 9, { fill: '#fff', w: 2 }); });
      s += F.route([[232, 60], [196, 60], [174.4, 107.6]], { c: C.blue, w: 1.4, head: 9 }) + t(214, 46, '4×⌀5', { a: 'm', size: 15, b: 1, c: C.blue });
      s += note(120, 210, '구멍 · 모따기 가공 지시', C.ink);
      s += t(360, 26, 'TOLERANCE 기하공차', { a: 'm', b: 1 });
      s += box(272, 62, 176, 40, { fill: '#fff', w: 1.8, r: 0 }) + line(320, 62, 320, 102, { w: 1.4 }) + line(404, 62, 404, 102, { w: 1.4 });
      s += t(296, 82, '기호', { a: 'm', size: 14 }) + t(362, 82, '공차값', { a: 'm', size: 14 }) + t(426, 82, '기준', { a: 'm', size: 14 });
      s += box(290, 150, 150, 34, { fill: C.grayL, w: 2.4, r: 0 });
      s += F.route([[296, 102], [296, 126], [340, 126], [340, 148]], { c: C.ink, w: 1.2, head: 9 });
      s += note(360, 210, '틀 안에 기호 · 공차값 · 기준', C.ink);
      return F.svg(480, 220, s);
    } },

  plot: { cards: ['출력 — PLOT'],
    cap: '도면층마다 선가중치를 정해 두어야 출력했을 때 선 굵기가 구별된다 (굵기는 레이어 표의 값)',
    draw: function () {
      var s = divider(240, 16, 212);
      function part(ox, wo, wh, wc) {
        return box(ox + 26, 66, 120, 100, { fill: 'none', w: wo, r: 0 }) +
          line(ox + 72, 66, ox + 72, 166, { w: wh, dash: '7 5' }) + line(ox + 100, 66, ox + 100, 166, { w: wh, dash: '7 5' }) +
          line(ox + 86, 52, ox + 86, 180, { w: wc, dash: CHAIN });
      }
      s += head(120, 30, '설정 안 하면', C.red) + part(8, 1.2, 1.2, 1.2) + note(120, 200, '굵기가 다 같다', C.red);
      s += head(360, 30, '도면층마다 선가중치', C.green) + part(240, 3.4, 2, 1.1);
      s += callout(386, 110, 404, 88, '외형선 0.5', { size: 13 }) + callout(340, 140, 404, 132, '숨은선 0.35', { size: 13 }) +
        callout(326, 176, 404, 170, '중심선 0.25', { size: 13 });
      s += note(360, 200, '굵기로 구별된다', C.green);
      return F.svg(480, 212, s);
    } },

  /* ─────────── Ⅵ. 도면 시트형식 (실기) ─────────── */
  flow: { cards: ['도면 작업의 순서'],
    cap: '생산자동화기능사 CAD 작업의 순서 — 선 두께와 색 설정이 두 번 나온다',
    draw: function () {
      var s = '', B = [[24, 36], [276, 36], [24, 140], [276, 140]],
        L = ['도면시트형식\n만들기', '선 두께와\n색 설정', '투상도와\n치수 완성', '선 두께와\n색 설정'];
      for (var i = 0; i < 4; i++) {
        var odd = i % 2 === 1;
        s += box(B[i][0], B[i][1], 180, 68, { fill: odd ? C.orangeL : C.blueL, c: odd ? C.orange : C.blue, w: 2.2 }) +
          F.num(B[i][0] + 2, B[i][1] + 2, i + 1, { c: odd ? C.orange : C.blue }) +
          t(B[i][0] + 90, B[i][1] + 34, L[i], { a: 'm', b: 1, halo: false });
      }
      s += arrow(208, 70, 270, 70, { c: C.sub }) + F.route([[366, 108], [366, 122], [114, 122], [114, 136]], { c: C.sub, w: 2 }) +
        arrow(208, 174, 270, 174, { c: C.sub });
      s += t(240, 226, '② 시트형식(윤곽선·표제란)에 한 번 · ④ 그린 도면에 한 번', { a: 'm', size: 13, c: C.orange, b: 1, ans: 1 });
      return F.svg(480, 240, s);
    } },

  sheet: { cards: ['A3 시트와 윤곽선'],
    cap: 'A3 가로 시트 — 윤곽선은 좌표 두 개(10,10 · 410,287)로 못박고, 네 변 가운데에 중심마크(안팎 5mm)',
    draw: function () {
      var k = 440 / 420, X = function (x) { return 20 + x * k; }, Y = function (y) { return 40 + (297 - y) * k; }, s = '';
      s += t(20, 22, 'A3 용지 420 × 297 (가로)', { b: 1, size: 15, c: C.sub });
      s += box(X(0), Y(297), 420 * k, 297 * k, { fill: '#fff', c: C.line, w: 1.2, r: 0, dash: '5 4' });
      s += box(X(10), Y(287), 400 * k, 277 * k, { fill: 'none', c: LC[1], w: 3.2, r: 0 });
      var mx = X(210), my = Y(148.5);
      s += line(mx, Y(292), mx, Y(282), { c: LC[2], w: 2.8 }) + line(mx, Y(15), mx, Y(5), { c: LC[2], w: 2.8 }) +
        line(X(5), my, X(15), my, { c: LC[2], w: 2.8 }) + line(X(405), my, X(415), my, { c: LC[2], w: 2.8 });
      s += dot(X(10), Y(10), 5, LC[1]) + dot(X(410), Y(287), 5, LC[1]);
      s += t(X(10) + 10, Y(10) - 16, '10,10', { size: 15, b: 1, c: '#0284c7', ans: 1 }) + t(X(410) - 10, Y(287) + 16, '410,287', { a: 'e', size: 15, b: 1, c: '#0284c7', ans: 1 });
      s += t(X(10) + 12, Y(287) + 20, '윤곽선 · 1번 레이어', { size: 15, b: 1, c: '#0284c7' });
      s += callout(mx, Y(282) + 2, mx + 22, Y(282) + 40, '중심마크 · 2번', { c: '#15803d', tc: '#15803d', b: 1, size: 14, ans: 1 });
      s += callout(X(15), my, X(15) + 30, my + 30, '안팎 5mm', { c: '#15803d', tc: '#15803d', size: 14, ans: 1 });
      var tx = X(270), ty = Y(62), tw = X(410) - tx, th = Y(10) - ty;
      s += box(tx, ty, tw, th, { fill: 'none', c: LC[2], w: 2.4, r: 0 }) + line(tx, ty + th / 2, tx + tw, ty + th / 2, { c: LC[4], w: 1.2 }) +
        line(tx + tw * 0.45, ty, tx + tw * 0.45, ty + th, { c: LC[4], w: 1.2 });
      s += callout(tx + 10, ty + 10, tx - 40, ty - 26, '표제란', { b: 1, size: 15 });
      return F.svg(480, 362, s);
    } },

  title: { cards: ['표제란'],
    cap: '표제란에 들어갈 여덟 가지(원자료 순서) — 선 그리기와 오프셋으로 칸, 노트로 글자 (칸 배치는 예시)',
    draw: function () {
      var s = '', xs = [20, 160, 260, 360, 460], ys = [54, 104, 154],
        W = [['생산자동화기능사', '수험번호', '성명', '감독위원 (인)'], ['과제명', 'CAD 작업', '척도', '각법']];
      for (var r = 0; r < 2; r++) for (var c = 0; c < 4; c++)
        s += t((xs[c] + xs[c + 1]) / 2, (ys[r] + ys[r + 1]) / 2, W[r][c], { a: 'm', size: 15, b: c === 0 ? 1 : 0 });
      s += line(20, 104, 460, 104, { c: LC[4], w: 1.3 });
      for (c = 1; c < 4; c++) s += line(xs[c], 54, xs[c], 154, { c: LC[4], w: 1.3 });
      s += box(20, 54, 440, 100, { fill: 'none', c: LC[2], w: 3, r: 0 });
      s += t(20, 30, '표제란', { b: 1, size: 17 });
      var legend = [[LC[2], 3, '바깥 테두리 → 2번 레이어 (녹색 0.5)'], [LC[4], 1.3, '안쪽 칸 선 → 4번 레이어 (빨강 0.25)'],
        [LC[3], 2, '글자 → 3번 레이어 · 3.5mm 고딕체']];
      legend.forEach(function (g, i) {
        var y = 184 + i * 24;
        s += line(24, y, 64, y, { c: g[0], w: g[1] }) + t(76, y, g[2], { size: 14, ans: i === 2 });
      });
      return F.svg(480, 246, s);
    } },

  lines: { cards: ['레이어 6개 — 통째로 외운다'],
    cap: '레이어 6개 — 번호마다 색 · 두께 · 선모양이 정해져 있다 (「도면 시트형식 만들기」 표)',
    draw: function () {
      var rows = (typeof LAYERS !== 'undefined') ? LAYERS : [], s = '';
      rows.forEach(function (l, i) {
        var y = 32 + i * 42;
        var dash = l.line === '점선' ? '8 5' : (l.line === '일점쇄선' ? '18 5 3 5' : (l.line.indexOf('가상선') === 0 ? '18 4 3 4 3 4' : null));
        var kind = l.line.indexOf('가상선') === 0 ? '이점쇄선' : l.line;
        s += F.num(22, y, l.no, { c: C.ink }) + line(44, y, 184, y, { c: l.hex, w: parseFloat(l.w) * 4, dash: dash });
        s += t(198, y, l.name.split(',')[0], { b: 1, size: 15, ans: l.no === 5 }) + t(262, y, l.color + ' ' + l.w + ' · ' + kind, { size: 14, c: C.sub, ans: l.no === 5 });
      });
      return F.svg(480, 270, s);
    } },

  assign: { cards: ['선마다 레이어 배정하기'],
    cap: '그린 도면의 선마다 레이어 번호 — 외형선 2 · 숨은선 3 · 치수선 4 · 중심선 5 (치수 60 은 예시)',
    draw: function () {
      var s = '';
      s += box(40, 70, 210, 116, { fill: 'none', c: LC[2], w: 3, r: 0 });
      s += line(125, 70, 125, 186, { c: LC[3], w: 2.2, dash: '7 5' }) + line(165, 70, 165, 186, { c: LC[3], w: 2.2, dash: '7 5' });
      s += line(145, 54, 145, 202, { c: LC[5], w: 1.3, dash: CHAIN });
      s += line(40, 190, 40, 230, { c: LC[4], w: 1 }) + line(250, 190, 250, 230, { c: LC[4], w: 1 }) +
        F.arrow(40, 224, 250, 224, { c: LC[4], w: 1.2, head: 9, both: true }) + t(145, 212, '60', { a: 'm', size: 15, b: 1, c: '#a16207' });
      s += callout(250, 110, 300, 84, '외형선 → 2번', { size: 15, b: 1 });
      s += callout(145, 60, 300, 48, '중심선 → 5번', { size: 15, b: 1 });
      s += callout(165, 150, 300, 136, '숨은선 → 3번', { size: 15, b: 1, ans: 1 });
      s += callout(210, 224, 300, 196, '치수선 → 4번', { size: 15, b: 1 });
      s += callout(154, 212, 300, 240, '치수문자 → 3번', { size: 15, b: 1, ans: 1 });
      return F.svg(480, 256, s);
    } },

  note: { cards: ['주서 읽는 법'],
    cap: '「도시되고 지시되지 않은」 = 그림에는 있는데 치수가 없는 것 → 주서에 적힌 값으로 만든다',
    draw: function () {
      var s = '';
      s += F.path('M80,168 L80,74 L94,60 L286,60 A14,14 0 0 1 300,74 L300,168 Z', { fill: C.grayL, w: 2.4 });
      s += callout(86, 66, 60, 34, '치수 없는 모따기', { c: C.orange, tc: C.orange, b: 1, size: 14, a: 's', ans: 1 });
      s += callout(296, 64, 330, 34, '치수 없는 라운드', { c: C.blue, tc: C.blue, b: 1, size: 14, ans: 1 });
      s += box(20, 196, 440, 110, { fill: C.yellowL, c: C.line, w: 1.2, r: 6 });
      s += t(36, 216, '주서', { b: 1 });
      s += t(36, 242, '1. 도시되고 지시되지 않은 모따기 C1', { size: 15, c: C.orange, b: 1 });
      s += t(36, 266, '2. 도시되고 지시되지 않은 라운드 R2', { size: 15, c: C.blue, b: 1 });
      s += t(36, 290, '3. 일반공차 ±0.1, 일반모따기 C0.2', { size: 15 });
      s += arrow(190, 172, 190, 192, { c: C.sub, w: 1.6, head: 8 });
      return F.svg(480, 318, s);
    } },

  /* ─────────── Ⅶ. 3D 모델링 (솔리드웍스) ─────────── */
  flow3d: { cards: ['3D 모델링은 어떤 순서로 하나'],
    cap: '3D 모델링 — 평면 고르기 → 스케치 → 피처로 형상, 피처 하나마다 이 한 바퀴를 돈다',
    draw: function () {
      var s = '', B = [[20, 26], [260, 26], [260, 146], [20, 146]],
        L = ['① 평면 고르기', '② 스케치 그리기', '③ 피처로 형상', '④ 다음 피처'];
      for (var i = 0; i < 4; i++) {
        s += box(B[i][0], B[i][1], 200, 104, { fill: i === 3 ? C.grayL : '#fff', c: i === 3 ? C.line : C.blue, w: 2, dash: i === 3 ? '7 5' : null });
        s += t(B[i][0] + 100, B[i][1] + 88, L[i], { a: 'm', b: 1, halo: false, ans: i === 1 || i === 2 });
        var P = iso(B[i][0] + 100, B[i][1] + 22, 1.05);
        if (i < 2) s += face(P, [[0, 0, 0], [44, 0, 0], [44, 44, 0], [0, 44, 0]], C.orangeL, { c: C.orange, w: 1.6 });
        if (i === 1) s += face(P, [[10, 10, 0], [34, 10, 0], [34, 34, 0], [10, 34, 0]], 'none', { c: C.blue, w: 2.2 });
        if (i >= 2) s += cube(P, 34, 34, 22, [C.blueL, '#bfdbfe', '#93c5fd'], { w: 1.4 });
        if (i === 3) s += face(P, [[12, 12, 22], [22, 12, 22], [22, 22, 22], [12, 22, 22]], C.ink, { w: 1.2 });
      }
      s += arrow(222, 78, 256, 78, { c: C.sub }) + arrow(360, 132, 360, 144, { c: C.sub, head: 9 }) +
        arrow(258, 198, 224, 198, { c: C.sub }) + arrow(120, 144, 120, 132, { c: C.sub, head: 9, dash: '4 3' });
      return F.svg(480, 262, s);
    } },

  render: { cards: ['실습과제 7 — 렌더링'],
    cap: '렌더링 — 형상과 치수는 그대로, 재질과 빛만 입혀 실물처럼 보이게 한다',
    draw: function () {
      var s = '';
      s += head(110, 30, '형상만');
      var P = iso(110, 108, 1.5);
      s += cube(P, 44, 44, 34, [C.grayL, C.grayM, '#b8bec8'], { w: 1.6 });
      s += arrow(196, 120, 272, 120, { c: C.sub }) + t(234, 104, '재질 · 빛', { a: 'm', size: 14, b: 1, c: C.orange });
      s += head(370, 30, '렌더링', C.blue);
      s += '<ellipse cx="372" cy="186" rx="70" ry="12" fill="#000" opacity=".13"/>';
      var Q = iso(370, 108, 1.5);
      s += cube(Q, 44, 44, 34, ['#93c5fd', '#2563eb', '#1e3a8a'], { c: '#1e3a8a', w: 1 });
      s += face(Q, [[6, 6, 34], [26, 6, 34], [18, 20, 34], [4, 18, 34]], 'rgba(255,255,255,.55)', { c: 'none', w: 0 });
      s += note(240, 212, '치수 · 모양은 하나도 바뀌지 않는다', C.ink);
      return F.svg(480, 226, s);
    } },

  gear: { cards: ['실습과제 8 — 기어'],
    cap: '기어 — 이 하나를 만들고 원형 패턴으로 잇수만큼 둘러 세운다 (잇수 12 는 예시)',
    draw: function () {
      var s = '';
      function tooth(cx, cy, deg, hot) {
        return F.g(F.poly([[-9, -50], [9, -50], [5, -68], [-5, -68]], { close: 1, fill: hot ? C.blueL : C.grayM, c: hot ? C.blue : C.ink, w: hot ? 2.2 : 1.4 }),
          { x: cx, y: cy, r: deg });
      }
      s += head(110, 26, '이 하나만 그린다');
      s += F.circle(110, 128, 52, { fill: C.grayL, w: 2 }) + tooth(110, 128, 0, 1) + dot(110, 128, 4);
      s += arrow(190, 128, 262, 128, { c: C.sub }) + t(226, 112, '원형 패턴', { a: 'm', size: 14, b: 1, c: C.blue, ans: 1 });
      s += head(360, 26, '잇수만큼 둘러 세운다');
      for (var i = 1; i < 12; i++) s += tooth(360, 128, i * 30, 0);
      s += tooth(360, 128, 0, 1) + F.circle(360, 128, 52, { fill: C.grayL, w: 2 }) + dot(360, 128, 4);
      s += note(240, 222, '이를 잇수만큼 따로 그리지 않는다', C.ink);
      return F.svg(480, 234, s);
    } }
  };
})();
