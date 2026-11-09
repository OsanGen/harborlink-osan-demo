function incidentOutcomes(ui) {
  return `<div class="late-outcomes">
    <section class="late-outcome late-outcome-continue" data-motion="outcome-continue">${ui.block(4)}</section>
    <section class="late-outcome late-outcome-wait" data-motion="outcome-wait">${ui.block(5)}</section>
    <section class="late-outcome late-outcome-authority" data-motion="outcome-authority">${ui.block(6)}</section>
  </div>`;
}

function incidentReviewers(ui) {
  return `<div class="late-reviewers" data-motion="reviewer">
    ${ui.asset('A004', 'late-reviewer-art', '')}
    <div>${ui.block(7)}</div>
  </div>`;
}

function incidentScene(state, ui) {
  switch (state) {
    case 'R0':
      return `<div class="late-incident-intro late-identity-question">
        ${ui.part('incidentIdentity')}${ui.block(10)}
      </div>`;
    case 'R1':
      return `<div class="late-case-layout" data-motion="incident">
        <div>
          ${ui.block(2)}${ui.block(10)}
          <section class="late-incident-report">${ui.block(13)}</section>
        </div>
        ${ui.asset('A002', 'late-request-art', '')}
      </div>`;
    case 'R2':
      return `<div class="late-stack">
        <div class="late-identity-question">${ui.part('incidentIdentity')}${ui.block(10)}</div>
        <section class="late-evidence">
          ${ui.part('incidentEvidenceHeading')}
          <div class="late-evidence-grid">
            <div data-motion="first-policy">
              ${ui.asset('A005', 'late-policy-art', '')}
              ${ui.part('incidentEvidencePolicyA')}
            </div>
            <div data-motion="second-policy">
              ${ui.asset('A005', 'late-policy-art', '')}
              ${ui.part('incidentEvidencePolicyB')}
            </div>
            <div data-motion="billing-evidence">
              ${ui.asset('A006', 'late-policy-art', '')}
              ${ui.part('incidentEvidenceBilling')}
            </div>
          </div>
        </section>
        <section class="late-evidence-note" data-motion="evidence-note">${ui.block(14)}</section>
      </div>`;
    case 'R3':
      return `<div class="late-stack">
        <div>${ui.part('incidentIdentity')}</div>
        ${incidentOutcomes(ui)}
        <section class="late-incident-answer" data-motion="answer">${ui.block(11)}</section>
      </div>`;
    case 'R4':
      return `<div class="late-stack">
        <div>${ui.part('incidentIdentity')}</div>
        <div class="late-case-layout">
          <div>
            ${ui.part('incidentChangesHeading')}
            <div class="late-changes">
              <div data-motion="change-1">${ui.part('incidentChange1')}</div>
              <div data-motion="change-2">${ui.part('incidentChange2')}</div>
              <div data-motion="change-3">${ui.part('incidentChange3')}</div>
            </div>
          </div>
          ${incidentReviewers(ui)}
        </div>
      </div>`;
    case 'R5':
      return `<div class="late-stack late-incident-final">
        <div>${ui.part('incidentIdentity')}</div>
        <div class="late-draft-layout">
          <section class="late-draft" data-motion="draft">${ui.block(15)}</section>
          <div class="late-final-context" data-motion="draft-context">
            ${incidentReviewers(ui)}
            ${incidentOutcomes(ui)}
          </div>
        </div>
      </div>`;
  }
}

function calendarIllustration() {
  const cells = '<span></span>'.repeat(14);
  return `<div class="late-calendar" aria-hidden="true">${cells}</div>`;
}

function pilotScorecard(ui, showDefinitions) {
  const rows = [1, 2, 3].map((index) => {
    const definition = showDefinitions
      ? `<td role="cell" class="late-definition" data-motion="definition-${index}">
          <span class="late-cell-label" aria-hidden="true">${ui.part('measureDefinitionsLabel')}</span>
          ${ui.part(`measureDefinition${index}`)}
        </td>`
      : '';
    return `<tr role="row" data-motion="measure-${index}">${ui.part(`pilotTableRow${index}`)}${definition}</tr>`;
  }).join('');
  const headers = ui.part('pilotTableHeaders');
  const extendedHeaders = showDefinitions
    ? headers.replace('</tr>', `<th scope="col" role="columnheader">${ui.part('measureDefinitionsLabel')}</th></tr>`)
    : headers;
  return `<section class="late-scorecard" data-motion="scorecard">
    ${ui.part('pilotTableHeading')}
    <table class="late-table${showDefinitions ? ' late-table-definitions' : ''}" role="table">
      <thead role="rowgroup">${extendedHeaders}</thead>
      <tbody role="rowgroup">${rows}</tbody>
    </table>
    ${ui.part('pilotResults')}
  </section>`;
}

function pilotResponsibility(ui, showCharter = false) {
  const finalCharter = showCharter ? `<div class="late-charter" data-motion="charter">
    ${ui.block(9)}
  </div>` : '';
  return `<div class="late-pilot-roles">
    <section class="late-pilot-owner" data-motion="pilot-owner">
      ${ui.block(7)}
      ${finalCharter}
    </section>
    <section class="late-stop-rule" data-motion="stop-rule">${ui.block(8)}</section>
  </div>`;
}

function pilotScene(state, ui) {
  switch (state) {
    case 'R0':
      return `<div class="late-scope">
        ${calendarIllustration()}
        <div>${ui.block(2)}${ui.block(3)}</div>
      </div>`;
    case 'R1':
      return `<div class="late-pilot-measurement">
        ${ui.entering?.from === 'R0'
          ? `<div class="late-calendar-exit" data-motion="calendar-exit">${calendarIllustration()}</div>`
          : ''}
        <div class="late-stack" data-motion="kpi">
          <div>${ui.block(4)}</div>
          ${pilotScorecard(ui, false)}
        </div>
      </div>`;
    case 'R2':
      return `<div class="late-stack">
        <div>${ui.block(4)}</div>
        ${pilotScorecard(ui, true)}
      </div>`;
    case 'R3':
      return pilotResponsibility(ui);
    case 'R4':
      return `<div class="late-stack">
        ${pilotScorecard(ui, false)}
        ${pilotResponsibility(ui, true)}
      </div>`;
  }
}

function familiarGroups(state, ui) {
  const objects = [
    ui.asset('A005', 'late-recall-art', ''),
    ui.asset('A003', 'late-recall-art', '') + ui.asset('A006', 'late-recall-art', ''),
    ui.asset('A005', 'late-recall-art', '') + ui.asset('A005', 'late-recall-art', ''),
    calendarIllustration() + ui.asset('A005', 'late-recall-art', ''),
  ];
  const grid = labeled => `<ol class="late-familiar-grid" role="list">${objects.map((art, index) => {
    const number = index + 1;
    const label = labeled
      ? `<div class="late-artifact-copy" data-motion="artifact-label-${number}">${ui.part(`artifact${number}`)}</div>`
      : '';
    return `<li class="late-recalled">
      <div class="late-recalled-art"${labeled ? ` data-motion="recall-${number}"` : ''}>${art}</div>
      ${label}
    </li>`;
  }).join('')}</ol>`;
  const board = exiting => `<div class="late-board-plate${exiting ? ' late-board-exit' : ''}"${exiting ? ' data-motion="blueprint" aria-hidden="true"' : ''}>
    <div class="late-board-surface" aria-hidden="true">${ui.asset('A001', 'late-board-art', '')}</div>
    ${grid(false)}
  </div>`;
  if (state === 'R0') return board(false);
  return `<div class="late-familiar">
    ${ui.entering?.from === 'R0' ? board(true) : ''}
    <div class="late-connected-heading" data-motion="connected-heading">${ui.part('connectedWorkHeading')}</div>
    ${grid(true)}
  </div>`;
}

function emailPair(ui, includeArt) {
  const art = includeArt ? ui.asset('A005', 'late-policy-art', '') : '';
  return `<div class="late-email-pair">
    <div data-motion="email-draft" data-object="email-draft">${art}${ui.part('artifact5')}</div>
    <div data-motion="email-revision" data-object="email-revision">${art}${ui.part('artifact6')}</div>
  </div>`;
}

function intendedSiteGraphic() {
  return `<div class="late-site-graphic" aria-hidden="true">
    <span></span><span></span><span></span>
  </div>`;
}

function handoffView(ui) {
  return `<div class="late-stack">
    ${ui.part('handoffHeading')}
    <div class="late-handoff">
      <section class="late-work-output" data-motion="work-output">
        ${ui.part('handoffWorkOutput')}
        ${ui.part('artifactNames')}
      </section>
      <div class="late-handoff-pair">
        <section class="late-run-handoff" data-motion="run-handoff">
          ${ui.asset('A005', 'late-mini-art', '')}
          ${ui.part('handoffMatching')}
        </section>
        <div class="late-dashed-link" data-motion="site-link" aria-hidden="true"></div>
        <section class="late-intended-site" data-motion="intended-site">
          ${intendedSiteGraphic()}
          ${ui.part('handoffIntendedSite')}
        </section>
      </div>
    </div>
    <div class="late-trace-start">${ui.part('handoffCurrentPair')}</div>
  </div>`;
}

const traceDestinations = [
  { state: 'R4A', label: 'A03', block: 9 },
  { state: 'R4B', label: 'A04', block: 10 },
  { state: 'R4C', label: 'A06', block: 11 },
  { state: 'R4D', label: 'Intended review site', block: 12 },
];

function traceView(state, ui) {
  const current = traceDestinations.find((destination) => destination.state === state);
  const references = traceDestinations.map((destination) => {
    const selected = destination === current;
    const outline = selected
      ? '<span class="late-trace-outline" data-motion="trace-outline" aria-hidden="true"></span>'
      : '';
    const site = destination.state === 'R4D' ? ' late-trace-site' : '';
    return `<li class="late-trace-reference${site}"${selected ? ' aria-current="step"' : ''}>
      ${outline}
      ${destination.state === 'R4D' ? intendedSiteGraphic() : ''}
      <span>${destination.label}</span>
    </li>`;
  }).join('');
  return `<div class="late-stack">
    <ol class="late-trace-track">${references}</ol>
    <div class="late-trace-detail" data-motion="trace-detail">${ui.block(current.block)}</div>
    <div class="late-trace-evidence">
      <div>${ui.block(4)}</div>
      <div>${ui.part('handoffCurrentPair')}</div>
    </div>
  </div>`;
}

function evidenceScene(state, ui) {
  let detail;
  switch (state) {
    case 'R0':
    case 'R1':
      detail = familiarGroups(state, ui);
      break;
    case 'R2':
      detail = `<div class="late-stack">
        ${ui.part('connectedWorkHeading')}
        ${ui.part('artifactNames1to4')}
        ${emailPair(ui, true)}
        <div data-motion="recommendation">${ui.block(4)}</div>
      </div>`;
      break;
    case 'R3':
      detail = handoffView(ui);
      break;
    case 'R4A':
    case 'R4B':
    case 'R4C':
    case 'R4D':
      detail = traceView(state, ui);
      break;
    case 'R5':
      detail = `<div class="late-stack late-evidence-final">
        <div class="late-live-cue" data-motion="live-cue">
          ${ui.asset('A005', 'late-mini-art', '')}
          <div>${ui.block(13)}</div>
          <div>${ui.block(14)}</div>
        </div>
        <div class="late-trace-evidence">
          <div>${ui.block(4)}${emailPair(ui, false)}</div>
          <div>${ui.part('handoffCurrentPair')}${ui.block(12)}</div>
        </div>
      </div>`;
      break;
  }
  return `<div class="late-stack late-evidence-scene">
    <section class="late-finding" data-object="pinned-finding">${ui.block(3)}</section>
    ${detail}
  </div>`;
}

export const lateScenes = {
  S004: {
    final: 'R5',
    render: incidentScene,
    beats: [
      { from: 'R0', to: 'R1', duration: 450, motion: [
        { target: 'incident', effect: 'fade', delay: 0, duration: 450 },
      ] },
      { from: 'R1', to: 'R2', duration: 550, motion: [
        { target: 'first-policy', effect: 'fade', delay: 0, duration: 550 },
        { target: 'second-policy', effect: 'fade', delay: 0, duration: 550 },
        { target: 'billing-evidence', effect: 'fade', delay: 0, duration: 550 },
        { target: 'evidence-note', effect: 'fade', delay: 200, duration: 350 },
      ] },
      { from: 'R2', to: 'R3', duration: 550, motion: [
        { target: 'outcome-continue', effect: 'fade', delay: 0, duration: 220 },
        { target: 'outcome-wait', effect: 'fade', delay: 110, duration: 220 },
        { target: 'outcome-authority', effect: 'fade', delay: 220, duration: 220 },
        { target: 'answer', effect: 'fade', delay: 350, duration: 200 },
      ] },
      { from: 'R3', to: 'R4', duration: 450, motion: [
        { target: 'reviewer', effect: 'rise', delay: 0, duration: 450 },
        { target: 'change-1', effect: 'fade', delay: 0, duration: 250 },
        { target: 'change-2', effect: 'fade', delay: 100, duration: 250 },
        { target: 'change-3', effect: 'fade', delay: 200, duration: 250 },
      ] },
      { from: 'R4', to: 'R5', duration: 220, motion: [
        { target: 'draft', effect: 'fade', delay: 0, duration: 220 },
        { target: 'draft-context', effect: 'fade', delay: 40, duration: 180 },
        { target: 'takeaway', effect: 'fade', delay: 90, duration: 130 },
      ] },
    ],
  },
  S005: {
    final: 'R4',
    render: pilotScene,
    beats: [
      { from: 'R0', to: 'R1', duration: 600, motion: [
        { target: 'calendar-exit', effect: 'fade-out', delay: 0, duration: 180 },
        { target: 'kpi', effect: 'fade', delay: 180, duration: 180 },
        { target: 'measure-1', effect: 'fade', delay: 180, duration: 300 },
        { target: 'measure-2', effect: 'fade', delay: 240, duration: 300 },
        { target: 'measure-3', effect: 'fade', delay: 300, duration: 300 },
      ] },
      { from: 'R1', to: 'R2', duration: 450, motion: [
        { target: 'measure-1', effect: 'focus', delay: 0, duration: 230 },
        { target: 'definition-1', effect: 'fade', delay: 0, duration: 230 },
        { target: 'measure-2', effect: 'focus', delay: 110, duration: 230 },
        { target: 'definition-2', effect: 'fade', delay: 110, duration: 230 },
        { target: 'measure-3', effect: 'focus', delay: 220, duration: 230 },
        { target: 'definition-3', effect: 'fade', delay: 220, duration: 230 },
      ] },
      { from: 'R2', to: 'R3', duration: 450, motion: [
        { target: 'pilot-owner', effect: 'fade', delay: 0, duration: 320 },
        { target: 'stop-rule', effect: 'fade', delay: 120, duration: 330 },
      ] },
      { from: 'R3', to: 'R4', duration: 220, motion: [
        { target: 'scorecard', effect: 'fade', delay: 0, duration: 180 },
        { target: 'charter', effect: 'fade', delay: 60, duration: 160 },
        { target: 'takeaway', effect: 'fade', delay: 100, duration: 120 },
      ] },
    ],
  },
  S006: {
    final: 'R5',
    render: evidenceScene,
    beats: [
      { from: 'R0', to: 'R1', duration: 1200, motion: [
        { target: 'blueprint', effect: 'fade-out', delay: 0, duration: 450 },
        ...[1, 2, 3, 4].map((number) => ({
          target: `recall-${number}`, effect: 'rise', delay: 450 + (number - 1) * 55, duration: 335,
        })),
        ...[1, 2, 3, 4].map((number) => ({
          target: `artifact-label-${number}`, effect: 'fade', delay: 950, duration: 250,
        })),
        { target: 'connected-heading', effect: 'fade', delay: 950, duration: 250 },
      ] },
      { from: 'R1', to: 'R2', duration: 650, anchor: 'email-draft', motion: [
        { target: 'email-draft', effect: 'rise', delay: 0, duration: 500 },
        { target: 'email-revision', effect: 'rise', delay: 0, duration: 500 },
        { target: 'recommendation', effect: 'fade', delay: 300, duration: 350 },
      ] },
      { from: 'R2', to: 'R3', duration: 800, motion: [
        { target: 'work-output', effect: 'rise', delay: 0, duration: 450 },
        { target: 'run-handoff', effect: 'fade', delay: 200, duration: 350 },
        { target: 'intended-site', effect: 'fade', delay: 450, duration: 350 },
        { target: 'site-link', effect: 'line', delay: 450, duration: 350 },
      ] },
      { from: 'R3', to: 'R4A', duration: 400, anchor: 'trace-detail', motion: [
        { target: 'trace-outline', effect: 'fade', delay: 0, duration: 400 },
        { target: 'trace-detail', effect: 'fade', delay: 125, duration: 275 },
      ] },
      ...[['R4A', 'R4B'], ['R4B', 'R4C'], ['R4C', 'R4D']].map(([from, to]) => ({
        from, to, duration: 400, anchor: 'trace-detail', motion: [
          { target: 'trace-outline', effect: 'fade', delay: 0, duration: 400 },
          { target: 'trace-detail', effect: 'fade', delay: 125, duration: 275 },
        ],
      })),
      { from: 'R4D', to: 'R5', duration: 500, motion: [
        { target: 'live-cue', effect: 'fade', delay: 0, duration: 500 },
        { target: 'takeaway', effect: 'fade', delay: 280, duration: 220 },
      ] },
    ],
  },
};

export const lateStyles = `
.late-stack { display: grid; gap: 16px; min-width: 0; }
.late-incident-intro {
  background: var(--quiet);
  padding: clamp(20px, 4vw, 48px);
  border: 2px solid var(--divider);
  border-radius: 12px;
}
.late-identity-question { display: grid; gap: 6px; }
.late-identity-question h3:not(:first-child),
.late-case-layout > div h3:not(:first-child) { margin-top: 12px; }
.late-case-layout {
  display: grid;
  grid-template-columns: minmax(0, 3fr) minmax(180px, 1fr);
  gap: 30px;
  align-items: center;
}
.late-request-art { width: min(100%, 220px); justify-self: center; }
.late-policy-art { width: 100px; }
.late-reviewer-art { width: 94px; }
.late-mini-art { width: 64px; }
.late-incident-report, .late-evidence-note, .late-draft {
  min-width: 0;
  padding: 16px clamp(14px, 2vw, 24px);
  border-inline-start: 4px solid var(--focus);
  background: var(--quiet);
}
.late-incident-report { margin-top: 16px; }
.late-incident-report blockquote { margin: 6px 0 0; border: 0; padding: 0; }
.late-evidence-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
}
.late-evidence-grid > div { display: grid; justify-items: center; text-align: center; gap: 6px; align-content: start; }
.late-evidence-grid .late-policy-art { height: clamp(80px, 9vw, 112px); }
.late-outcomes {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) repeat(2, minmax(0, 1fr));
  gap: clamp(12px, 1.8vw, 24px);
}
.late-outcome {
  min-width: 0;
  padding: clamp(12px, 1.4vw, 18px);
  line-height: 1.34;
  border: 1px solid var(--divider);
  border-block-start: 4px solid var(--outcome-accent);
  border-radius: 8px;
  background: var(--outcome-surface);
}
.late-outcome-continue { --outcome-accent: #357768; --outcome-surface: #edf7f4; }
.late-outcome-wait { --outcome-accent: #956826; --outcome-surface: #fff8e0; }
.late-outcome-authority { --outcome-accent: #404b59; --outcome-surface: var(--quiet); }
.late-outcome h3 { font-size: 1em; line-height: 1.22; margin-block-end: .55em; }
.late-outcome p + p { margin-block-start: .45em; }
.late-incident-answer {
  border-block-start: 1px solid var(--divider);
  padding-block-start: 14px;
  line-height: 1.34;
}
@media (min-width: 1024px) {
  .late-outcomes .late-outcome h3 { min-block-size: 2.44em; }
}
.late-reviewers, .late-run-handoff, .late-intended-site {
  display: flex;
  align-items: center;
  gap: 12px;
}
.late-reviewers .sticker, .late-run-handoff .sticker { flex: none; }
.late-changes { display: grid; gap: 4px; }
.late-changes > div { border-inline-start: 3px solid var(--focus); padding: 8px 12px; }
.late-draft-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr);
  align-items: start;
  gap: clamp(16px, 3vw, 36px);
}
.late-final-context { display: grid; gap: 12px; min-width: 0; }
.late-final-context .late-outcomes { grid-template-columns: minmax(0, 1fr); gap: 8px; }
.late-final-context .late-outcome {
  padding: 10px 12px;
  border-block-start: 1px solid var(--divider);
  border-inline-start: 4px solid var(--outcome-accent);
}
.late-final-context .late-outcome h3 { min-block-size: 0; }
.late-incident-final .late-reviewer-art { width: 60px; }
.late-scope {
  display: grid;
  grid-template-columns: minmax(0, 26fr) minmax(0, 74fr);
  gap: clamp(20px, 4vw, 56px);
  align-items: center;
}
.late-scope h3:not(:first-child) { margin-top: 18px; }
.late-calendar {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 4px;
  padding: 8px;
  background: var(--quiet);
  border: 3px solid var(--ink);
  border-radius: 6px;
}
.late-calendar span { display: block; aspect-ratio: 1; border: 1px solid var(--focus); background: var(--mint); }
.late-pilot-measurement { position: relative; }
.late-calendar-exit { position: absolute; z-index: 2; top: 50%; width: min(26%, 320px); pointer-events: none; }
.late-scorecard { font-size: max(22px, 0.93em); min-width: 0; }
.late-scorecard > p:last-child { margin-top: 10px; font-weight: 650; color: var(--muted); }
.late-table {
  margin-top: 10px;
  table-layout: fixed;
  border-collapse: separate;
  border-spacing: 0;
  border: 1px solid var(--divider);
  border-radius: 8px;
  overflow: hidden;
}
.late-table th, .late-table td { padding: .38em .65em; }
.late-table thead th { background: var(--blue); }
.late-table thead th:first-child { width: 46%; }
.late-table-definitions thead th:first-child { width: 36%; }
.late-table-definitions thead th:nth-child(2),
.late-table-definitions thead th:nth-child(3) { width: 17%; }
.late-table tbody tr:nth-child(even) { background: var(--quiet); }
.late-table tbody tr:last-child > :is(th, td) { border-block-end: 0; }
.late-table tbody td { font-variant-numeric: tabular-nums; }
.late-table .late-definition { border-inline-start: 1px solid var(--divider); }
.late-cell-label { display: none; }
.late-pilot-roles {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.65fr);
  gap: clamp(12px, 1.8vw, 24px);
}
.late-pilot-owner, .late-stop-rule {
  min-width: 0;
  padding: clamp(12px, 1.6vw, 20px);
  border: 1px solid var(--divider);
  border-radius: 8px;
  background: var(--quiet);
}
.late-stop-rule { border-inline-start: 4px solid var(--focus); }
.late-stop-rule p + p { color: var(--muted); }
.late-charter {
  margin-block-start: 12px;
  padding-block-start: 12px;
  border-block-start: 1px solid var(--divider);
}
.late-charter h3 { font-size: .9em; color: var(--muted); }
.late-charter p { font-weight: 650; }
.late-evidence-scene { font-size: max(22px, 0.93em); }
.late-finding {
  position: relative;
  z-index: 2;
  min-height: 88px;
  background: var(--yellow);
  padding: 12px 16px;
  border-inline-start: 4px solid var(--ink);
}
.late-board-plate {
  /* The plate crops the PNG's transparent margin and aligns the cover to its visible interior. */
  --board-interior: 10.2% 12.9% 14.3% 7.3%;
  position: relative;
  width: min(100%, clamp(390px, 145.6dvh - 610px, 660px));
  aspect-ratio: 747 / 513;
  margin-inline: auto;
}
.late-board-surface {
  position: absolute;
  inset: 0;
  overflow: clip;
  pointer-events: none;
}
.late-board-art {
  position: absolute;
  width: 117.94%;
  max-width: none;
  top: -13.06%;
  left: -8.97%;
}
.late-board-surface::after {
  position: absolute;
  inset: var(--board-interior);
  content: "";
  border-radius: 5px;
  background:
    linear-gradient(90deg, rgb(35 92 122 / 10%) 1px, transparent 1px) 0 0 / 24px 24px,
    linear-gradient(rgb(35 92 122 / 10%) 1px, transparent 1px) 0 0 / 24px 24px,
    var(--blue);
}
.late-board-exit {
  position: absolute;
  inset-inline: 0;
  top: 0;
  pointer-events: none;
}
.late-familiar { position: relative; isolation: isolate; }
.late-connected-heading { position: relative; }
.late-connected-heading h3 { margin-bottom: 0; }
.late-recalled { min-width: 0; }
.late-recalled + .late-recalled { margin-top: 0; }
.late-recalled-art {
  min-width: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: clamp(3px, .7vw, 10px);
  padding: 6px;
  border-radius: 8px;
  background: var(--quiet);
}
.late-evidence-scene .late-familiar-grid {
  position: relative;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: clamp(10px, 1.6vw, 24px);
  padding: 0;
  list-style: none;
}
.late-evidence-scene .late-board-plate > .late-familiar-grid {
  position: absolute;
  inset: var(--board-interior);
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-template-rows: repeat(2, minmax(0, 1fr));
  gap: clamp(6px, 1vw, 14px);
  padding: clamp(8px, 1.4vw, 20px);
}
.late-board-plate .late-recalled { min-height: 0; }
.late-board-plate .late-recalled-art {
  height: 100%;
  min-height: 0;
  background: var(--canvas);
}
.late-recall-art {
  flex: none;
  width: min(43%, 82px);
  height: clamp(37px, 7.8vw, 106px);
}
.late-recalled-art .late-calendar {
  flex: 0 1 108px;
  min-width: 0;
  gap: 2px;
  padding: 4px;
  border-width: 2px;
}
.late-familiar > .late-familiar-grid { margin-top: 12px; }
.late-familiar > .late-familiar-grid .late-recalled-art { height: clamp(108px, 11vw, 148px); }
.late-artifact-copy { padding-top: 10px; }
.late-artifact-copy h4 { line-height: 1.22; margin-bottom: 4px; }
.late-artifact-copy p { line-height: 1.38; }
.late-board-plate .late-recall-art {
  height: min(100%, clamp(37px, 8vw, 96px));
}
.late-evidence-scene :is(ol, ul) { padding-inline-start: 1.35em; }
.late-evidence-scene > .late-stack > ol:not(.late-trace-track) {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: 42px;
}
.late-email-pair {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}
.late-email-pair > div {
  border-block-start: 3px solid var(--focus);
  padding: 8px 12px;
  background: var(--quiet);
}
.late-email-pair .sticker { float: inline-start; margin-inline-end: 8px; width: 72px; }
.late-handoff {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
  gap: 18px;
  align-items: start;
}
.late-work-output, .late-run-handoff, .late-intended-site {
  border: 3px solid var(--ink);
  border-radius: 8px;
  padding: 10px 14px;
}
.late-work-output { background: var(--blue); }
.late-run-handoff, .late-intended-site { background: var(--quiet); }
.late-intended-site { border-style: dashed; }
.late-handoff-pair { display: grid; }
.late-site-graphic {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  flex: 0 0 58px;
  gap: 4px;
  padding: 4px;
  min-height: 42px;
  border: 2px dashed var(--focus);
  border-radius: 4px;
}
.late-site-graphic span { border: 1px solid var(--focus); }
.late-site-graphic span:first-child { grid-column: 1 / -1; }
.late-dashed-link { width: 0; height: 22px; border-inline-start: 3px dashed var(--focus); justify-self: center; }
.late-trace-start { border-top: 1px solid var(--divider); padding-top: 12px; }
.late-evidence-scene .late-trace-track {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
  list-style: none;
  padding: 0;
}
.late-trace-reference {
  position: relative;
  display: grid;
  align-items: center;
  padding: 8px 12px;
  border: 2px solid var(--ink);
  border-radius: 4px;
  background: var(--quiet);
}
.late-trace-reference + .late-trace-reference { margin-top: 0; }
.late-trace-reference + .late-trace-reference::before {
  content: "";
  position: absolute;
  width: 16px;
  inset-inline-start: -18px;
  top: calc(50% - 1px);
  border-block-start: 2px solid var(--focus);
}
.late-trace-site, .late-trace-reference.late-trace-site::before { border-style: dashed; }
.late-trace-site { display: flex; align-items: center; gap: 8px; }
.late-trace-outline { position: absolute; inset: -3px; border: 4px solid var(--focus); border-radius: 6px; pointer-events: none; }
.late-trace-detail { padding: 10px 12px; background: var(--blue); }
.late-trace-evidence { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 24px; }
.late-trace-evidence .late-email-pair { margin-top: 12px; }
.late-live-cue {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) minmax(0, 1fr);
  gap: 16px;
  align-items: center;
  padding: 12px;
  border: 3px solid var(--focus);
  background: var(--blue);
}
.late-live-cue .sticker { width: 60px; }
.late-evidence-final { gap: 8px; }
.late-evidence-final .late-trace-evidence h3:not(:first-child) { margin-top: 8px; }

@media (max-width: 1023px) {
  .late-scorecard, .late-evidence-scene { font-size: inherit; }
  .late-case-layout, .late-draft-layout, .late-scope, .late-outcomes, .late-evidence-grid,
  .late-pilot-roles, .late-handoff,
  .late-trace-evidence, .late-live-cue, .late-email-pair, .late-evidence-scene .late-trace-track,
  .late-evidence-scene > .late-stack > ol:not(.late-trace-track) { grid-template-columns: minmax(0, 1fr); }
  .late-case-layout { gap: 14px; }
  .late-request-art { width: 116px; }
  .late-reviewer-art { width: 60px; }
  .late-evidence-grid > div { grid-template-columns: 66px minmax(0, 1fr); align-items: center; justify-items: start; text-align: start; }
  .late-evidence-grid .late-policy-art { width: 66px; height: 68px; }
  .late-scope .late-calendar { max-width: 320px; grid-row: 2; }
  .late-evidence-scene .late-familiar-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
  .late-familiar > .late-familiar-grid .late-recall-art { height: 68px; }
  .late-trace-reference + .late-trace-reference::before {
    width: 0;
    height: 16px;
    inset-inline-start: 26px;
    top: -18px;
    border-block-start: 0;
    border-inline-start: 2px solid var(--focus);
  }
  .late-trace-reference.late-trace-site::before { border-inline-start-style: dashed; }
  .late-live-cue .sticker { display: none; }
}

@media (max-width: 600px) {
  .late-evidence-scene .late-familiar > .late-familiar-grid { grid-template-columns: minmax(0, 1fr); }
  .late-familiar > .late-familiar-grid .late-recalled { display: grid; grid-template-columns: minmax(88px, 28%) minmax(0, 1fr); gap: 12px; }
  .late-familiar > .late-familiar-grid .late-recalled-art { height: 78px; }
  .late-familiar > .late-familiar-grid .late-recall-art { height: 58px; }
  .late-artifact-copy { padding-top: 0; }
}

@media (max-width: 680px) {
  .late-table { display: block; border: 0; border-radius: 0; overflow: visible; }
  .late-table thead {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }
  .late-table tbody { display: grid; gap: 10px; }
  .late-table tbody tr {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    padding: 10px 12px;
    border: 1px solid var(--divider);
    border-radius: 8px;
  }
  .late-table tbody :is(th, td) { display: block; padding: 3px; border: 0; }
  .late-table tbody :is(th, .late-definition) { grid-column: 1 / -1; }
  .late-table .late-definition { border-top: 1px solid var(--divider); border-inline-start: 0; margin-top: 4px; padding-top: 6px; }
  .late-cell-label { display: block; font-weight: 650; font-size: 0.9em; }
}
`;
