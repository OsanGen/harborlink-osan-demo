const systemArt = ['A003', 'A003', 'A006', 'A005', 'A002', null];

function planningBoard(state, ui) {
  const covered = state === 'R0';
  const showingSpec = state === 'R2' || state === 'R3';
  const lifting = ui.entering?.from === 'R0' && ui.entering?.to === 'R1';
  const objects = [
    ['request', 'A002'],
    ['plan', 'A005'],
    ['reviewer', 'A004'],
  ];
  const opening = covered || state === 'R1';
  const caseCopy = opening ? ui.block(2) + ui.block(3) : '';
  return `<div class="early-plan">
    <div class="early-plan-reading">
      <div class="early-reading${state === 'R1' && !lifting ? ' early-plan-spacer' : ''}"${state === 'R1' ? ' aria-hidden="true" inert' : ''}${lifting ? ' data-motion="intro"' : ''}>${ui.part('intro')}</div>
      ${opening ? `<div class="early-reading${covered ? ' early-plan-spacer' : ''}" data-motion="case"${covered ? ' aria-hidden="true" inert' : ''}>${caseCopy}</div>` : ''}
    </div>
    ${showingSpec ? `<section class="early-spec" data-motion="spec">${ui.block(4)}</section>` : ''}
    <div class="early-board">
      <div class="early-board-plate" aria-hidden="true">
        <div class="early-board-art">${ui.asset('A001', 'board-artwork')}</div>
        <div class="early-board-window">
          ${covered ? '' : `<div class="early-plan-objects">
            ${objects.map(([name, art]) => `<div class="early-plan-object" data-motion="${name}">
              ${ui.asset(art, 'early-plan-sticker')}
            </div>`).join('')}
          </div>`}
          ${covered || lifting ? '<div class="early-cover" data-motion="cover"></div>' : ''}
        </div>
      </div>
      <ol class="early-plan-questions" role="list">
        ${ui.part('questions').map(question => `<li>${question}</li>`).join('')}
      </ol>
    </div>
  </div>`;
}

const workflowGroups = { R1: [0, 3], R2: [3, 5], R3: [5, 7] };

function workflowRail(ui, state) {
  const [start, end] = workflowGroups[state] ?? [0, 0];
  return `<div class="early-rail">
    ${ui.part('workflowHeading')}
    <ol class="early-steps" role="list">
      ${ui.part('workflowSteps').map(({ name }, index) => `
        <li class="${index >= start && index < end ? 'early-step-active' : ''}">
          <span class="early-step-number" aria-hidden="true">${index + 1}</span>
          <span>${name}</span>
          <span class="early-step-line" data-motion="workflow-step-${index + 1}" aria-hidden="true"></span>
        </li>`).join('')}
    </ol>
  </div>`;
}

function workflowActions(ui, [start, end]) {
  return `<ol class="early-triage-actions" role="list" start="${start + 1}" data-motion="step-copy">
    ${ui.part('workflowSteps').slice(start, end).map(({ name, description }, index) => `<li>
      <span class="early-triage-number" aria-hidden="true">${start + index + 1}</span>
      <div><strong>${name}:</strong> ${description}</div>
    </li>`).join('')}
  </ol>`;
}

function workflowResult(state, ui) {
  if (state === 'R3') {
    return `<aside class="early-triage-result early-triage-guidance" data-motion="guides">${ui.part('workflowThroughout')}</aside>`;
  }
  const savedFields = ui.part('savedFields');
  const keysByState = { R1: ['classification', 'priority', 'confidence'], R2: ['owner', 'reply'] };
  const motions = state === 'R2' ? { owner: 'owner', reply: 'draft' } : {};
  const keys = keysByState[state] ?? Object.keys(savedFields);
  const rows = keys.map(key => {
    const [label, value] = savedFields[key];
    const highlight = key === 'confidence' ? ' class="early-result-confidence"' : '';
    const motion = motions[key] ? ` data-motion="${motions[key]}"` : '';
    return `<div${highlight}${motion}><dt>${label}:</dt> <dd>${value}</dd></div>`;
  }).join('');
  return `<section class="early-triage-result" data-motion="saved">${ui.part('savedHeading')}<dl>${rows}</dl></section>`;
}

function workflow(state, ui) {
  const group = workflowGroups[state];
  const opening = state === 'R0';
  const layout = opening ? '' : ' early-workflow-triage' + (group ? '' : ' early-workflow-recap');
  return `<div class="early-workflow${layout}">
    <article class="early-ticket" data-object="ticket-a">
      <div>${ui.block(2)}</div>
      ${ui.asset('A002', 'early-ticket-art')}
    </article>
    ${workflowRail(ui, state)}
    ${opening
      ? `<div class="early-workflow-detail"><div class="early-reading">${ui.block(3)}</div></div>`
      : (group ? workflowActions(ui, group) : '') + workflowResult(state, ui)}
    <aside class="early-authority" data-object="human-boundary">
      ${ui.asset('A004', 'early-authority-art')}
      <div>
        ${ui.block(6)}
        ${state === 'R3' ? '' : `<div class="early-throughout">${ui.part('workflowThroughout')}</div>`}
      </div>
    </aside>
  </div>`;
}

function systemInventory(state, ui) {
  const expanded = state === 'R0' || state === 'R1';
  const showIcons = expanded || state === 'R5';
  const descriptions = ui.part('systemDescriptions');
  return `<ul class="early-systems ${showIcons ? '' : 'early-systems-quiet'}" role="list">
    ${ui.part('systemNames').map((name, index) => {
      const active = (state === 'R0' && index < 3) || (state === 'R1' && index >= 3);
      let icon = '';
      if (showIcons) {
        icon = systemArt[index] ? ui.asset(systemArt[index], 'early-system-art') : '<span class="early-report-icon" aria-hidden="true"></span>';
      }
      return `<li class="${active ? 'early-system-active' : ''}" data-object="system-${index}">
        ${icon}
        ${active
          ? `<div class="early-system-copy" data-motion="system-copy">${descriptions[index]}</div>
            <span class="early-system-line" data-motion="system" aria-hidden="true"></span>`
          : `<span class="early-system-name">${name}</span>`}
      </li>`;
    }).join('')}
  </ul>`;
}

function connectionDiagram(state) {
  if (state === 'R2' || state === 'R3') {
    return `<div class="early-connection" aria-hidden="true">
      <span class="early-diagram-node"></span>
      <span class="early-dashed" data-motion="connection-line"></span>
      <div class="early-protocol ${state === 'R3' ? 'early-protocol-mcp' : ''}">
        ${state === 'R3' ? '<span class="early-mcp-layer" data-motion="mcp-layer">MCP</span>' : ''}
        <span class="early-api" data-object="generic-api" data-motion="interface">API</span>
      </div>
    </div>`;
  }
  if (state === 'R4') {
    return `<div class="early-connection early-middleware" data-motion="middleware-layer" aria-hidden="true">
      <span class="early-diagram-node"></span><span class="early-dashed"></span>
      <span class="early-api">Middleware</span><span class="early-dashed"></span><span class="early-diagram-node"></span>
    </div>`;
  }
  return '';
}

function systemsDetail(state, ui) {
  switch (state) {
    case 'R2': return ui.part('integrationApi');
    case 'R3': return ui.part('mcp');
    case 'R4': return ui.part('middleware');
    case 'R5': {
      let index = 0;
      const questions = ui.block(4).replaceAll('<p>', () => `<p data-motion="question-${++index}">`);
      return `<div class="early-questions">${questions}</div><div class="early-record" data-motion="output">${ui.block(6)}</div>`;
    }
  }
}

function systems(state, ui) {
  const expanded = state === 'R0' || state === 'R1';
  const status = `<aside class="early-status" data-object="connections-status">${ui.block(5)}</aside>`;
  if (expanded) {
    return `<div class="early-systems-scene">
      ${state === 'R0' ? `<div class="early-systems-intro">${ui.part('intro')}</div>` : ''}
      ${status}
      <section class="early-systems-inventory">
        ${ui.part('systemHeading')}
        ${systemInventory(state, ui)}
        ${state === 'R0' ? `<div class="early-legacy-definition">${ui.part('legacyDefinition')}</div>` : ''}
      </section>
    </div>`;
  }
  const diagram = connectionDiagram(state);
  return `<div class="early-systems-scene">
    ${status}
    <div class="early-systems-body${diagram ? ' early-systems-with-diagram' : ''}">
      <div class="early-systems-visual" data-motion="map">
        ${systemInventory(state, ui)}
      </div>
      <div class="early-reading early-systems-detail" data-motion="system-copy">${systemsDetail(state, ui)}</div>
      ${diagram}
    </div>
  </div>`;
}

export const earlyScenes = {
  S001: {
    final: 'R3',
    render: planningBoard,
    beats: [
      { from: 'R0', to: 'R1', duration: 1400, anchor: 'request', motion: [
        { target: 'cover', effect: 'lift', delay: 0, duration: 650 },
        { target: 'intro', effect: 'fade-out', delay: 0, duration: 350 },
        { target: 'case', effect: 'fade', delay: 350, duration: 300 },
        { target: 'request', effect: 'focus', delay: 650, duration: 250 },
        { target: 'plan', effect: 'focus', delay: 900, duration: 250 },
        { target: 'reviewer', effect: 'focus', delay: 1150, duration: 250 },
      ] },
      { from: 'R1', to: 'R2', duration: 450, motion: [
        { target: 'spec', effect: 'fade', delay: 0, duration: 450 },
        { target: 'plan', effect: 'focus', delay: 0, duration: 450 },
      ] },
      { from: 'R2', to: 'R3', duration: 220, motion: [
        { target: 'takeaway', effect: 'fade', delay: 0, duration: 220 },
      ] },
    ],
  },
  S002: {
    final: 'R4',
    render: workflow,
    beats: [
      { from: 'R0', to: 'R1', duration: 600, motion: [
        { target: 'workflow-step-1', effect: 'line', delay: 0, duration: 200 },
        { target: 'workflow-step-2', effect: 'line', delay: 110, duration: 200 },
        { target: 'workflow-step-3', effect: 'line', delay: 220, duration: 200 },
        { target: 'step-copy', effect: 'fade', delay: 120, duration: 360 },
        { target: 'saved', effect: 'rise', delay: 220, duration: 380 },
      ] },
      { from: 'R1', to: 'R2', duration: 600, motion: [
        { target: 'step-copy', effect: 'fade', delay: 0, duration: 380 },
        { target: 'workflow-step-4', effect: 'line', delay: 100, duration: 420 },
        { target: 'workflow-step-5', effect: 'line', delay: 180, duration: 420 },
        { target: 'saved', effect: 'fade', delay: 0, duration: 120 },
        { target: 'owner', effect: 'fade', delay: 120, duration: 420 },
        { target: 'draft', effect: 'rise', delay: 180, duration: 420 },
      ] },
      { from: 'R2', to: 'R3', duration: 450, motion: [
        { target: 'step-copy', effect: 'fade', delay: 0, duration: 450 },
        { target: 'workflow-step-6', effect: 'line', delay: 0, duration: 450 },
        { target: 'workflow-step-7', effect: 'line', delay: 0, duration: 450 },
        { target: 'guides', effect: 'fade', delay: 0, duration: 450 },
      ] },
      { from: 'R3', to: 'R4', duration: 220, motion: [
        { target: 'saved', effect: 'fade', delay: 0, duration: 220 },
        { target: 'takeaway', effect: 'fade', delay: 0, duration: 220 },
      ] },
    ],
  },
  S003: {
    final: 'R5',
    render: systems,
    beats: [
      { from: 'R0', to: 'R1', duration: 450, motion: [
        { target: 'system', effect: 'line', delay: 0, duration: 450 },
        { target: 'system-copy', effect: 'fade', delay: 0, duration: 450 },
      ] },
      { from: 'R1', to: 'R2', duration: 450, motion: [
        { target: 'system-copy', effect: 'fade', delay: 0, duration: 450 },
        { target: 'interface', effect: 'fade', delay: 0, duration: 450 },
        { target: 'connection-line', effect: 'line', delay: 0, duration: 450 },
      ] },
      { from: 'R2', to: 'R3', duration: 600, anchor: 'system-copy', motion: [
        { target: 'interface', effect: 'fade', delay: 0, duration: 300 },
        { target: 'mcp-layer', effect: 'fade', delay: 120, duration: 480 },
        { target: 'system-copy', effect: 'fade', delay: 0, duration: 600 },
      ] },
      { from: 'R3', to: 'R4', duration: 450, anchor: 'system-copy', motion: [
        { target: 'middleware-layer', effect: 'fade', delay: 0, duration: 450 },
        { target: 'system-copy', effect: 'fade', delay: 0, duration: 450 },
      ] },
      { from: 'R4', to: 'R5', duration: 450, anchor: 'question-1', motion: [
        { target: 'map', effect: 'fade', delay: 0, duration: 350 },
        { target: 'question-1', effect: 'fade', delay: 0, duration: 150 },
        { target: 'question-2', effect: 'fade', delay: 100, duration: 150 },
        { target: 'question-3', effect: 'fade', delay: 200, duration: 150 },
        { target: 'output', effect: 'fade', delay: 350, duration: 100 },
        { target: 'takeaway', effect: 'fade', delay: 350, duration: 100 },
      ] },
    ],
  },
};

export const earlyStyles = `
.early-systems-body {
  display: grid;
  grid-template-columns: minmax(0, 42fr) minmax(0, 58fr);
  align-items: start;
  gap: clamp(1rem, 2.5vw, 2.5rem);
}
.early-plan {
  display: grid;
  grid-template-columns: minmax(0, 42fr) minmax(0, 58fr);
  grid-template-areas: "intro board" "spec board";
  grid-template-rows: auto 1fr;
  gap: clamp(1rem, 2.5vw, 2.5rem);
  align-items: start;
}
.early-plan-reading { grid-area: intro; display: grid; }
.early-plan-reading > div { grid-area: 1 / 1; }
/* Keep the opening board in place while the introduction changes to the case. */
.early-plan-spacer { visibility: hidden; }
.early-plan-reading p + h3 { margin-top: 1em; }
.early-reading { min-width: 0; }
.early-reading > :first-child, .early-record > :first-child,
.early-authority h3, .early-status h3 { margin-top: 0; }
.early-reading > :last-child, .early-record > :last-child,
.early-authority p:last-child, .early-status p:last-child { margin-bottom: 0; }
.early-board {
  grid-area: board;
  width: min(100%, clamp(440px, 140dvh - 550px, 590px));
  margin-inline: auto;
}
.early-board-plate {
  position: relative;
  isolation: isolate;
  aspect-ratio: 747 / 513;
}
.early-board-art, .early-board-window, .early-cover { position: absolute; inset: 0; }
.early-board-art, .early-board-window { overflow: clip; }
.early-board-window {
  inset: var(--board-interior);
  border-radius: var(--board-radius);
  background: var(--canvas);
}
.early-cover { background: var(--board-paper); }
.early-plan-objects {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  height: 100%;
  gap: clamp(8px, 1vw, 14px);
  padding: clamp(8px, 1.6vw, 20px);
}
.early-plan-object {
  display: grid;
  grid-template: minmax(0, 1fr) / minmax(0, 1fr);
  place-items: center;
  min-width: 0;
  min-height: 0;
  background: var(--quiet);
  border-radius: .5rem;
}
.early-plan-object[data-motion="reviewer"] { background: var(--pink); }
.early-plan-sticker { width: min(84%, 8rem); height: min(78%, 8rem); }
.early-plan-questions {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(8px, 1vw, 14px);
  list-style: none;
  padding: 0 var(--board-right) 0 var(--board-left);
  margin-block: 14px 0;
}
.early-plan-questions li {
  margin: 0;
  padding-top: 8px;
  border-top: 2px solid var(--divider);
  font-size: 20px;
  line-height: 1.3;
  font-weight: 600;
  text-align: center;
}
.early-spec {
  grid-area: spec;
  padding: clamp(12px, 1.6vw, 20px);
  border-inline-start: 4px solid var(--focus);
  border-radius: 6px;
  background: var(--mint);
}
.early-spec p:first-of-type { font-weight: 650; }
.early-spec p + p { margin-top: .35em; }
.early-workflow, .early-systems-scene { display: grid; gap: clamp(1rem, 2vw, 1.6rem); }
.early-workflow {
  grid-template-columns: minmax(0, 46fr) minmax(0, 54fr);
  grid-template-areas: 'rail rail' 'ticket detail' 'authority authority';
  column-gap: clamp(1rem, 2.5vw, 2.5rem);
  align-items: start;
}
.early-rail { grid-area: rail; }
.early-ticket { grid-area: ticket; }
.early-workflow-detail { grid-area: detail; min-width: 0; padding-block: clamp(.85rem, 2vw, 1.2rem); }
.early-authority { grid-area: authority; }
.early-rail > h3 { color: var(--muted); font-size: .85em; }
.early-steps {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: clamp(.4rem, 1.2vw, 1rem);
  margin: .35rem 0 0;
  padding: 0;
  list-style: none;
}
.early-steps li {
  position: relative;
  display: flex;
  align-items: baseline;
  gap: .38rem;
  min-width: 0;
  margin: 0;
  padding: .35rem 0 .55rem;
  border-block-end: 1px solid var(--divider);
  color: var(--muted);
  font-size: .82em;
  font-weight: 600;
}
.early-step-number { color: var(--focus); font-size: .8em; font-variant-numeric: tabular-nums; }
.early-step-line, .early-system-line {
  position: absolute;
  inset-inline: 0;
  inset-block-end: -1px;
  height: 3px;
  pointer-events: none;
}
.early-steps li.early-step-active { color: var(--ink); }
.early-step-active .early-step-line, .early-system-line { background: var(--focus); }
.early-ticket {
  display: grid;
  grid-template-columns: minmax(0, 1fr) clamp(2.5rem, 6vw, 3.75rem);
  gap: .7rem;
  align-items: start;
  padding: clamp(.85rem, 2vw, 1.2rem);
  border-inline-start: 4px solid var(--focus);
  border-radius: .35rem;
  background: var(--quiet);
}
.early-ticket blockquote { margin: .55rem 0 0; padding: 0; border: 0; }
.early-ticket-art { inline-size: 100%; }
.early-workflow-triage {
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr) minmax(0, 1.05fr);
  grid-template-areas: 'rail rail rail' 'ticket actions result' 'authority authority authority';
  align-items: stretch;
  column-gap: clamp(12px, 1.6vw, 22px);
}
.early-workflow-recap { grid-template-areas: 'rail rail rail' 'ticket result result' 'authority authority authority'; }
.early-workflow-triage .early-ticket, .early-triage-result {
  padding: .7rem .85rem;
  border: 1px solid var(--divider);
  border-radius: .6rem;
}
.early-workflow-triage .early-ticket { grid-template-columns: minmax(0, 1fr) 2.25rem; }
.early-workflow-triage .early-triage-actions {
  grid-area: actions;
  display: grid;
  grid-auto-rows: 1fr;
  gap: .38rem;
  padding: 0;
  list-style: none;
}
.early-workflow-triage .early-triage-actions > li {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-content: center;
  align-items: start;
  gap: .55rem;
  margin: 0;
  padding: .5rem .65rem;
  border: 1px solid var(--divider);
  border-radius: .5rem;
  line-height: 1.3;
  font-size: .92em;
}
.early-triage-actions strong { display: block; }
.early-triage-number {
  display: grid;
  place-items: center;
  width: 1.6em;
  height: 1.6em;
  border-radius: 50%;
  background: var(--blue);
  color: var(--focus);
  font-weight: 750;
}
.early-triage-result { grid-area: result; line-height: 1.3; }
.early-triage-result dl > div { padding: .35rem 0; border-top: 1px solid var(--divider); }
.early-triage-result dl > div:first-child { border-top: 0; }
.early-triage-result dl > .early-result-confidence {
  padding: .35rem .5rem;
  border: 0;
  border-radius: .35rem;
  background: var(--yellow);
}
.early-triage-result dt { font-size: .76em; font-weight: 700; color: var(--muted); }
.early-triage-result dd { margin-inline-start: 0; font-size: .92em; }
.early-triage-guidance { background: var(--quiet); border-inline-start: 4px solid var(--focus); }
.early-triage-guidance p { font-weight: 650; }
.early-workflow-recap .early-triage-result dl > div {
  display: grid;
  grid-template-columns: minmax(0, .42fr) minmax(0, 1fr);
  align-items: baseline;
  gap: .65rem;
}
.early-authority { display: flex; align-items: flex-start; gap: .75rem; }
.early-ticket h3 { margin-top: 0; }
.early-record { padding: .55rem .8rem; background: var(--quiet); border-inline-start: 3px solid var(--focus); }
.early-authority, .early-status {
  padding: .7rem .9rem;
  border-inline-start: 4px solid var(--focus);
  border-radius: .35rem;
}
.early-authority { background: var(--pink); }
.early-authority-art { flex: 0 0 2.5rem; max-width: 2.5rem; }
.early-authority h3, .early-status h3 { margin-bottom: .25rem; }
.early-authority p, .early-status p { margin-block: .2rem; }
.early-throughout { display: inline-block; }
.early-systems-intro { max-width: 62ch; }
.early-systems-inventory > h3 { margin-bottom: .65rem; }
.early-systems-body { grid-template-columns: minmax(0, 56fr) minmax(0, 44fr); }
.early-systems-with-diagram {
  grid-template-areas: "map detail" "diagram detail";
  row-gap: .8rem;
}
.early-systems-with-diagram .early-systems-visual { grid-area: map; }
.early-systems-with-diagram .early-systems-detail { grid-area: detail; }
.early-systems-with-diagram .early-connection { grid-area: diagram; }
.early-systems-detail { display: grid; align-content: start; gap: .6rem; }
.early-systems-detail > p { margin: 0; }
.early-systems {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: .55rem .75rem;
  list-style: none;
  padding: 0;
  margin: 0;
}
.early-systems-inventory .early-systems { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.early-systems li {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: .65rem;
  padding: .55rem .65rem;
  margin: 0;
  min-width: 0;
  border-block-end: 1px solid var(--divider);
  line-height: 1.25;
}
.early-systems .early-system-active { background: var(--blue); }
.early-system-name { align-self: center; font-weight: 650; }
.early-system-copy { min-width: 0; }
.early-system-copy strong { display: block; margin-bottom: .2rem; }
.early-legacy-definition {
  margin-top: .7rem;
  color: var(--muted);
}
.early-system-art { flex: 0 0 2.65rem; inline-size: 2.65rem; block-size: 2.65rem; }
.early-report-icon {
  flex: 0 0 2.1rem;
  block-size: 1.6rem;
  margin: .5rem .275rem;
  border: 2px solid #20242b;
  border-block-start: .4rem solid #20242b;
  border-radius: .2rem;
  background: #fff;
}
.early-systems-quiet li { color: var(--muted); }
.early-connection {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: .4rem;
  padding: .6rem;
  min-width: 0;
  border-radius: .4rem;
  background: #f6f8fa;
  font-weight: 600;
}
.early-diagram-node {
  flex: 0 0 clamp(1rem, 6vw, 3rem);
  aspect-ratio: 1;
  border: 3px solid #20242b;
  border-radius: .3rem;
  background: #fff;
}
.early-dashed { flex: 1 1 1.4rem; max-width: 4rem; border-top: 3px dashed #525d6b; }
.early-protocol { position: relative; display: grid; justify-items: center; gap: .25rem; }
.early-protocol-mcp { padding: .45rem .9rem; }
.early-mcp-layer::before { position: absolute; inset: 0; border: 3px solid #20242b; border-radius: .35rem; content: ''; }
.early-api { border: 3px solid #20242b; border-radius: .25rem; padding: .4rem .75rem; background: #dceffd; }
.early-middleware .early-api { background: #d4f3e5; padding-inline: .4rem; }
.early-status { background: var(--yellow); }
.early-questions > :first-child { margin-top: 0; }
@media (max-width: 1023px) and (orientation: portrait), (max-width: 760px) {
  .early-plan, .early-workflow, .early-systems-body { grid-template-columns: minmax(0, 1fr); gap: .8rem; }
  .early-plan { grid-template-areas: "intro" "board"; grid-template-rows: auto; }
  .early-plan:has(.early-spec) { grid-template-areas: "intro" "spec" "board"; }
  .early-systems-with-diagram { grid-template-areas: "detail" "diagram" "map"; }
  .early-workflow { grid-template-areas: 'ticket' 'rail' 'detail' 'authority'; }
  .early-workflow-triage { grid-template-areas: 'ticket' 'rail' 'actions' 'result' 'authority'; }
  .early-workflow-recap { grid-template-areas: 'ticket' 'rail' 'result' 'authority'; }
  .early-workflow-detail { padding-block: .25rem; }
}
@media (max-width: 760px) {
  .early-steps { display: flex; flex-wrap: wrap; gap: .25rem .85rem; }
  .early-workflow-triage .early-triage-actions:not([start="1"]) { grid-auto-rows: auto; }
  .early-triage-result dl > [data-motion] dt,
  .early-workflow-recap .early-triage-result dt { font-size: .82em; }
  .early-systems-inventory .early-systems { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 560px) {
  .early-plan-questions { padding-inline: 0; }
  .early-plan-questions li { font-size: clamp(16px, 4.5vw, 20px); }
  .early-systems, .early-systems-inventory .early-systems { grid-template-columns: minmax(0, 1fr); }
  .early-systems-with-diagram .early-systems-quiet { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
`;
