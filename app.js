import { lessonPages } from './lesson-data.js';
import { earlyScenes, earlyStyles } from './scenes-early.js';
import { lateScenes, lateStyles } from './scenes-late.js';

const scenes = { ...earlyScenes, ...lateScenes };
const stickers = {
  A001: ['A001_planning_board.png', 881, 647, 50],
  A002: ['A002_request_slip.png', 630, 721, 50],
  A003: ['A003_service_station.png', 866, 574, 88.5017],
  A004: ['A004_human_reviewer.png', 551, 902, 92.3503],
  A005: ['A005_document_sheet.png', 566, 857, 50],
  A006: ['A006_records_cabinet.png', 691, 841, 92.39],
};

const sceneStyles = document.createElement('style');
sceneStyles.textContent = earlyStyles + lateStyles;
document.head.append(sceneStyles);

const element = id => document.getElementById(id);
const title = element('page-title');
const context = element('page-context');
const workflow = element('workflow-context');
const stage = element('scene-stage');
const takeaway = element('takeaway');
const previous = element('previous');
const play = element('play');
const next = element('next');
const options = element('options');
const indicator = element('page-indicator');
const announcement = element('announcement');
const motionControl = element('reduced-motion');
const panel = element('reading-panel');
const panelTitle = element('panel-title');
const panelContent = element('panel-content');
const systemMotion = matchMedia('(prefers-reduced-motion: reduce)');

const presentation = {
  pageIndex: 0,
  states: lessonPages.map(() => 'R0'),
  active: null,
  panelOpener: null,
  motionOverride: null,
};

const page = () => lessonPages[presentation.pageIndex];
const scene = () => scenes[page().id];
const state = () => presentation.states[presentation.pageIndex];
const reducedMotion = () => presentation.motionOverride ?? systemMotion.matches;

function block(id) {
  const key = typeof id === 'number' ? page().id + '-C' + String(id).padStart(2, '0') : id;
  return page().blocks[key] ?? '';
}

function escapeAttribute(value) {
  return value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
}

function asset(id, className = '', alt = '') {
  const [path, width, height, anchorY] = stickers[id];
  return `<span class="sticker ${escapeAttribute(className)}" data-sticker="${id}"
    style="--sticker-ratio: ${width} / ${height}; --sticker-anchor-x: 50%; --sticker-anchor-y: ${anchorY}%">
    <img src="./${path}" width="${width}" height="${height}" alt="${escapeAttribute(alt)}" draggable="false">
    <span class="sticker-fallback" aria-hidden="true"></span>
  </span>`;
}

function nextBeat() {
  return scene().beats.find(beat => beat.from === state());
}

function renderScene(destination, entering = null) {
  const view = document.createElement('div');
  view.className = 'scene-view';
  view.dataset.view = destination;
  view.inert = Boolean(entering);
  view.innerHTML = scene().render(destination, {
    block,
    part: key => page().parts?.[key],
    asset,
    entering,
  });
  stage.replaceChildren(view);
  stage.dataset.scene = page().id;
  stage.dataset.state = state();
  stage.setAttribute('aria-busy', String(Boolean(entering)));
}

function renderTransport() {
  const active = presentation.active;
  const beat = nextBeat();
  const namedGate = Boolean(beat?.trigger);
  previous.disabled = presentation.pageIndex === 0;
  next.disabled = presentation.pageIndex === lessonPages.length - 1;
  play.disabled = !active && (!beat || namedGate);
  if (active) {
    play.textContent = active.paused ? 'Play' : 'Pause';
  } else {
    play.textContent = state() === 'R0' ? 'Play' : 'Continue';
  }
  indicator.textContent = `Page ${presentation.pageIndex + 1} of ${lessonPages.length}`;
}

function renderCommitted() {
  const { title: headline, context: caseContext, workflowContext } = page();
  title.textContent = headline;
  context.textContent = caseContext;
  workflow.textContent = workflowContext;
  workflow.hidden = !workflowContext;
  renderScene(state());
  renderTakeaway(state());
  renderTransport();
}

function renderTakeaway(destination, entering = false) {
  takeaway.hidden = destination !== scene().final;
  takeaway.inert = entering;
  takeaway.innerHTML = takeaway.hidden ? '' : block(page().takeaway);
}

function announceState() {
  const positions = ['R0', ...scene().beats.map(beat => beat.to)];
  const position = positions.indexOf(state()) + 1;
  const gate = stage.querySelector('[data-action="introduce"], [data-action="trace"]');
  announcement.textContent = `Page ${presentation.pageIndex + 1} of ${lessonPages.length}. ` +
    `Step ${position} of ${positions.length}.` +
    (nextBeat()?.trigger && gate ? ` ${gate.textContent.trim()} to continue.` : '');
}

function stopBeat() {
  const active = presentation.active;
  presentation.active = null;
  active?.animations.forEach(animation => animation.cancel());
}

function commit(destination) {
  const focusedTransport = document.activeElement === play;
  stopBeat();
  presentation.states[presentation.pageIndex] = destination;
  renderCommitted();
  announceState();
  if (focusedTransport && play.disabled) {
    (stage.querySelector('[data-action="introduce"], [data-action="trace"]') ?? title)
      .focus({ preventScroll: true });
  }
}

function matchingPositions() {
  return new Map(Array.from(stage.querySelectorAll('[data-object]'), node =>
    [node.dataset.object, node.getBoundingClientRect()]));
}

function motionFrames(node, effect, positions) {
  switch (effect) {
    case 'lift':
      return [{ transform: 'translateY(0)', opacity: 1 }, { transform: 'translateY(-32%)', opacity: 0 }];
    case 'focus':
      return [{ boxShadow: '0 0 0 0 transparent' }, { boxShadow: '0 0 0 3px #235c7a' }];
    case 'line':
      return [{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0 0 0)' }];
    case 'slide-left':
      return [{ transform: 'translateX(24px)', opacity: 0 }, { transform: 'none', opacity: 1 }];
    case 'slide-right':
      return [{ transform: 'translateX(-24px)', opacity: 0 }, { transform: 'none', opacity: 1 }];
    case 'exit-left':
      return [{ translate: 'none', opacity: 1 }, { translate: '-24px 0', opacity: 0 }];
    case 'move': {
      const old = positions.get(node.dataset.object);
      if (old) {
        const now = node.getBoundingClientRect();
        return [{ translate: `${old.left - now.left}px ${old.top - now.top}px` }, { translate: 'none' }];
      }
      return [{ translate: '0 12px', opacity: 0 }, { translate: 'none', opacity: 1 }];
    }
    case 'rise':
      return [{ translate: '0 12px', opacity: 0 }, { translate: 'none', opacity: 1 }];
    default:
      return [{ opacity: 0 }, { opacity: 1 }];
  }
}

function startBeat(beat, opener = null) {
  if (!beat || presentation.active) return;
  const shouldFocus = opener === document.activeElement;
  if (reducedMotion()) {
    commit(beat.to);
    if (shouldFocus) (play.disabled ? title : play).focus({ preventScroll: true });
    return;
  }

  const positions = matchingPositions();
  renderScene(beat.to, beat);
  renderTakeaway(beat.to, true);
  const targets = Array.from(stage.querySelectorAll('[data-motion]'));
  if (!takeaway.hidden) targets.push(takeaway);
  const animations = beat.motion.flatMap(({ target, effect, delay = 0, duration }) =>
    targets
      .filter(node => node.dataset.motion.split(/\s+/).includes(target))
      .map(node => node.animate(motionFrames(node, effect, positions), {
        delay,
        duration,
        fill: 'both',
        easing: ['line', 'fade'].includes(effect) ? 'linear' : 'cubic-bezier(0.22, 1, 0.36, 1)',
      })));
  const clock = stage.animate([], beat.duration);
  const active = { beat, animations: [...animations, clock], paused: false };
  presentation.active = active;
  renderTransport();
  if (shouldFocus) play.focus({ preventScroll: true });
  clock.finished.then(() => {
    if (presentation.active === active) commit(beat.to);
  }, () => {
    // Canceling a superseded beat also cancels its clock.
  });
}

function pauseBeat() {
  const active = presentation.active;
  if (!active || active.paused) return;
  active.animations.forEach(animation => animation.pause());
  active.paused = true;
  renderTransport();
}

function useTransport() {
  const active = presentation.active;
  if (active?.paused) {
    active.animations.forEach(animation => animation.play());
    active.paused = false;
    renderTransport();
  } else if (active) {
    pauseBeat();
  } else {
    const beat = nextBeat();
    if (beat && !beat.trigger) startBeat(beat);
  }
}

function navigate(offset) {
  const destination = presentation.pageIndex + offset;
  if (destination < 0 || destination >= lessonPages.length) return;
  const focused = document.activeElement;
  stopBeat();
  presentation.pageIndex = destination;
  options.open = false;
  renderCommitted();
  announceState();
  if ((focused === previous && !previous.disabled) || (focused === next && !next.disabled)) {
    title.scrollIntoView({ block: 'start' });
  } else {
    title.focus();
  }
}

function resetDemo() {
  stopBeat();
  if (panel.open) panel.close();
  presentation.panelOpener = null;
  presentation.pageIndex = 0;
  presentation.states.fill('R0');
  options.open = false;
  renderCommitted();
  announceState();
  title.focus();
}

function syncMotionPreference() {
  motionControl.checked = reducedMotion();
  if (motionControl.checked && presentation.active) commit(presentation.active.beat.to);
}

function openPanel(kind, opener) {
  if (panel.open) return;
  pauseBeat();
  const pages = {
    full: ['Show full page', page().audience],
    notes: ['Presenter notes', page().notes],
    draft: ['Read the prepared draft', ['S004-C15']],
  };
  const [label, ids] = pages[kind];
  presentation.panelOpener = opener;
  panelTitle.textContent = label;
  panelContent.innerHTML = ids.map(block).join('');
  if (kind === 'draft') {
    const qualification = panelContent.firstElementChild;
    panelTitle.textContent = qualification.textContent;
    qualification.remove();
  }
  panel.showModal();
  panel.scrollTop = 0;
  panelTitle.focus({ preventScroll: true });
}

previous.addEventListener('click', () => navigate(-1));
next.addEventListener('click', () => navigate(1));
play.addEventListener('click', event => {
  if (event.detail < 2) useTransport();
});
motionControl.addEventListener('change', () => {
  presentation.motionOverride = motionControl.checked;
  syncMotionPreference();
});
systemMotion.addEventListener('change', syncMotionPreference);
element('close-panel').addEventListener('click', () => panel.close());
panel.addEventListener('close', () => {
  const opener = presentation.panelOpener;
  presentation.panelOpener = null;
  panelContent.replaceChildren();
  if (opener?.isConnected) opener.focus({ preventScroll: true });
});

stage.addEventListener('error', event => {
  if (event.target instanceof HTMLImageElement) event.target.closest('.sticker')?.classList.add('is-missing');
}, true);

stage.addEventListener('toggle', event => {
  if (event.target.matches('details[data-reading-disclosure][open]')) pauseBeat();
}, true);

document.addEventListener('keydown', event => {
  if (event.repeat && ['Enter', ' '].includes(event.key) && event.target.closest('button')) {
    event.preventDefault();
  }
  if (event.key !== 'Escape' || panel.open) return;
  const disclosure = event.target.closest('details[data-reading-disclosure][open]');
  if (disclosure) {
    disclosure.open = false;
    disclosure.querySelector('summary').focus();
  }
});

document.addEventListener('click', event => {
  const button = event.target.closest('button[data-action]');
  if (!button || !button.isConnected || event.detail > 1) return;
  const { action } = button.dataset;
  switch (action) {
    case 'introduce':
    case 'trace': {
      const beat = nextBeat();
      if (beat?.trigger === action) startBeat(beat, button);
      else if (action === 'trace' && ['R4D', 'R5'].includes(state())) {
        startBeat(scene().beats.find(item => item.trigger === 'trace'), button);
      }
      break;
    }
    case 'replay':
      commit('R0');
      break;
    case 'reset':
      resetDemo();
      break;
    case 'final':
      commit(scene().final);
      break;
    case 'full':
    case 'notes':
    case 'draft':
      openPanel(action, button);
      break;
  }
});

syncMotionPreference();
renderCommitted();
