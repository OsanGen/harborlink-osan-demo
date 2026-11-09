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
  const questions = ui.part('questions');

  return `<div class="early-plan">
    <div class="early-reading" data-motion="case">
      ${state === 'R1' ? ui.block(2) + ui.block(3) : ui.part('intro')}
    </div>
    <div class="early-board ${covered ? 'early-board-covered' : ''}">
      <div class="early-board-art" data-object="planning-board">${ui.asset('A001')}</div>
      ${covered || lifting ? '<div class="early-cover" data-motion="cover" aria-hidden="true"></div>' : ''}
      <div class="early-plan-objects">
        ${objects.map(([name, art], index) => `<figure class="early-plan-object" data-motion="${name}" data-object="plan-${name}">
          ${covered ? '' : ui.asset(art, 'early-plan-sticker')}
          <figcaption>${questions[index]}</figcaption>
        </figure>`).join('')}
      </div>
      ${showingSpec ? `<div class="early-spec" data-motion="spec">${ui.block(4)}</div>` : ''}
    </div>
  </div>`;
}

function workflowRail(ui, state) {
  const activeByState = { R1: [0, 1, 2], R2: [3, 4], R3: [5, 6] };
  const active = activeByState[state] ?? [];
  return `<div class="early-rail">
    ${ui.part('workflowHeading')}
    <ol class="early-steps" role="list">
      ${ui.part('workflowSteps').map(({ name }, index) => `
        <li class="${active.includes(index) ? 'early-step-active' : ''}">
          <span class="early-step-number" aria-hidden="true">${index + 1}</span>
          <span>${name}</span>
          <span class="early-step-line" data-motion="workflow-step-${index + 1}" aria-hidden="true"></span>
        </li>`).join('')}
    </ol>
  </div>`;
}

function workflowDetail(state, ui) {
  switch (state) {
    case 'R0':
      return `<div class="early-reading">${ui.block(3)}</div>`;
    case 'R1':
      return `<div class="early-reading">
        <div data-motion="step-copy">${ui.part('workflow1to3')}</div>
        <div class="early-record" data-motion="saved">${ui.part('savedFirst')}</div>
      </div>`;
    case 'R2':
      return `<div class="early-reading">
        <div data-motion="step-copy">${ui.part('workflow4to5')}</div>
        <div class="early-record early-routing">
          ${ui.part('savedHeading')}
          <div class="early-route-proposal" data-motion="owner">
            <div class="early-route-line" data-motion="route" aria-hidden="true"></div>
            <div class="early-owner">${ui.part('savedOwner')}</div>
          </div>
          <div class="early-draft" data-motion="draft">
            ${ui.asset('A005', 'early-routing-art')}${ui.part('savedReply')}
          </div>
        </div>
      </div>`;
    case 'R3':
      return `<div class="early-reading" data-motion="step-copy">${ui.part('workflow6to7')}</div>`;
    case 'R4':
      return `<div class="early-reading early-record" data-motion="saved" data-object="saved-example">${ui.block(5)}</div>`;
  }
}

function workflow(state, ui) {
  return `<div class="early-workflow">
    <article class="early-ticket" data-object="ticket-a">
      <div>${ui.block(2)}</div>
      ${ui.asset('A002', 'early-ticket-art')}
    </article>
    ${workflowRail(ui, state)}
    <div class="early-workflow-detail">${workflowDetail(state, ui)}</div>
    <aside class="early-authority" data-object="human-boundary">
      ${ui.asset('A004', 'early-authority-art')}
      <div>
        ${ui.block(6)}
        <div class="early-throughout ${state === 'R3' ? 'early-throughout-active' : ''}">
          ${ui.part('workflowThroughout')}
          ${state === 'R3' ? '<span class="early-throughout-line" data-motion="guides" aria-hidden="true"></span>' : ''}
        </div>
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
  return `<div class="early-systems-scene">
    ${status}
    <div class="early-systems-body">
      <div class="early-systems-visual" data-motion="map">
        ${systemInventory(state, ui)}${connectionDiagram(state)}
      </div>
      <div class="early-reading early-systems-detail" data-motion="system-copy">${systemsDetail(state, ui)}</div>
    </div>
  </div>`;
}

export const earlyScenes = {
  S001: {
    final: 'R3',
    render: planningBoard,
    beats: [
      { from: 'R0', to: 'R1', duration: 1400, motion: [
        { target: 'cover', effect: 'lift', delay: 0, duration: 650 },
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
        { target: 'owner', effect: 'slide-right', delay: 120, duration: 420 },
        { target: 'draft', effect: 'rise', delay: 180, duration: 420 },
        { target: 'route', effect: 'line', delay: 200, duration: 400 },
      ] },
      { from: 'R2', to: 'R3', duration: 450, motion: [
        { target: 'step-copy', effect: 'fade', delay: 0, duration: 450 },
        { target: 'workflow-step-6', effect: 'line', delay: 0, duration: 450 },
        { target: 'workflow-step-7', effect: 'line', delay: 0, duration: 450 },
        { target: 'guides', effect: 'line', delay: 0, duration: 450 },
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
      { from: 'R2', to: 'R3', duration: 600, motion: [
        { target: 'mcp-layer', effect: 'fade', delay: 0, duration: 600 },
        { target: 'interface', effect: 'move', delay: 0, duration: 600 },
        { target: 'system-copy', effect: 'fade', delay: 0, duration: 600 },
      ] },
      { from: 'R3', to: 'R4', duration: 450, motion: [
        { target: 'middleware-layer', effect: 'fade', delay: 0, duration: 450 },
        { target: 'system-copy', effect: 'fade', delay: 0, duration: 450 },
      ] },
      { from: 'R4', to: 'R5', duration: 450, motion: [
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
.early-plan,
.early-systems-body {
  display: grid;
  grid-template-columns: minmax(0, 42fr) minmax(0, 58fr);
  align-items: start;
  gap: clamp(1rem, 2.5vw, 2.5rem);
}
.early-reading { min-width: 0; }
.early-reading > :first-child, .early-record > :first-child,
.early-authority h3, .early-status h3 { margin-top: 0; }
.early-reading > :last-child, .early-record > :last-child,
.early-authority p:last-child, .early-status p:last-child { margin-bottom: 0; }
.early-board {
  position: relative;
  isolation: isolate;
  display: grid;
  align-content: center;
  min-width: 0;
  aspect-ratio: 1.5;
  padding: 6% 20% 7% 16%;
}
.early-board-art, .early-cover { position: absolute; inset: 0; pointer-events: none; }
.early-board-art { z-index: -2; }
.early-board-art .sticker { inline-size: 100%; block-size: 100%; }
.early-cover {
  z-index: 1;
  inset: 17.8% 20.5% 21.6% 16.5%;
  border: 3px solid #20242b;
  border-radius: .75rem;
  background: #dceffd;
  background-image: repeating-linear-gradient(0deg, transparent 0 23px, #235c7a29 23px 24px),
    repeating-linear-gradient(90deg, transparent 0 23px, #235c7a29 23px 24px);
}
.early-board-covered .early-cover { z-index: -1; }
.early-plan-objects {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  align-items: start;
  gap: .75rem;
  padding: .25rem 0;
}
.early-plan-object {
  display: grid;
  justify-items: center;
  gap: .2rem;
  margin: 0;
  text-align: center;
  border-radius: .5rem;
}
.early-plan-sticker { inline-size: 100%; max-inline-size: 8rem; block-size: clamp(5rem, 10vw, 8rem); }
.early-plan-object figcaption, .early-spec {
  padding: .35rem .55rem;
  background: #fff;
  border-radius: .35rem;
}
.early-plan-object figcaption { font-size: 22px; line-height: 1.25; }
.early-spec { justify-self: center; max-width: 32rem; margin: .25rem auto 0; text-align: center; }
.early-spec > :first-child { margin-top: 0; }
.early-spec > :last-child { margin-bottom: 0; }
.early-spec p + p { margin-top: .25rem; }
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
.early-workflow-detail ol { padding-inline-start: 1.35em; }
.early-workflow-detail ol li + li { margin-top: .35rem; }
.early-reading > [data-motion="step-copy"] + .early-record { margin-top: .7rem; }
.early-draft, .early-authority { display: flex; align-items: flex-start; gap: .75rem; }
.early-routing-art { flex: 0 0 2rem; max-width: 24%; }
.early-routing > div { min-width: 0; }
.early-ticket h3, .early-routing h3 { margin-top: 0; }
.early-record { padding: .55rem .8rem; background: var(--quiet); border-inline-start: 3px solid var(--focus); }
.early-routing { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .5rem .7rem; }
.early-routing h3 { grid-column: 1 / -1; }
.early-route-proposal { display: flex; align-items: center; }
.early-route-line { flex: 0 0 clamp(.5rem, 2vw, 1.4rem); border-block-end: 2px dashed var(--muted); }
.early-owner, .early-draft { padding: .35rem .5rem; }
.early-draft { align-items: center; }
.early-authority, .early-status {
  padding: .7rem .9rem;
  border-inline-start: 4px solid var(--focus);
  border-radius: .35rem;
}
.early-authority { background: var(--blue); }
.early-authority-art { flex: 0 0 2.5rem; max-width: 2.5rem; }
.early-authority h3, .early-status h3 { margin-bottom: .25rem; }
.early-authority p, .early-status p { margin-block: .2rem; }
.early-throughout { display: inline-block; position: relative; }
.early-throughout-active { font-weight: 650; }
.early-throughout-line {
  position: absolute;
  inset-inline: 0;
  inset-block-end: -.1rem;
  height: 2px;
  background: var(--focus);
}
.early-systems-intro { max-width: 62ch; }
.early-systems-inventory > h3 { margin-bottom: .65rem; }
.early-systems-body { grid-template-columns: minmax(0, 56fr) minmax(0, 44fr); }
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
  margin-top: .8rem;
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
@media (max-width: 1023px) {
  .early-plan, .early-workflow, .early-systems-body { grid-template-columns: minmax(0, 1fr); gap: .8rem; }
  .early-workflow { grid-template-areas: 'ticket' 'rail' 'detail' 'authority'; }
  .early-workflow-detail { padding-block: .25rem; }
  .early-routing { grid-template-columns: minmax(0, 1fr); }
  .early-board { aspect-ratio: auto; padding: .5rem; }
  .early-cover { inset: 0; }
  .early-board-art { display: none; }
  .early-plan-objects { grid-template-columns: minmax(0, 1fr); }
  .early-plan-object { grid-template-columns: minmax(2.75rem, 4rem) minmax(0, 1fr); align-items: center; justify-items: start; text-align: start; }
  .early-board-covered .early-plan-object { grid-template-columns: minmax(0, 1fr); }
  .early-plan-sticker { block-size: 3.75rem; }
  .early-plan-object figcaption { font-size: 20px; }
  .early-spec { justify-self: start; text-align: start; }
}
@media (max-width: 760px) {
  .early-steps { display: flex; flex-wrap: wrap; gap: .25rem .85rem; }
  .early-systems-inventory .early-systems { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 560px) {
  .early-systems, .early-systems-inventory .early-systems { grid-template-columns: minmax(0, 1fr); }
}
`;
