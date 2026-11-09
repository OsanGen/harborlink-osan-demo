import { lessonPages } from './lesson-data.js?v=2';
import { earlyScenes, earlyStyles } from './scenes-early.js?v=3';
import { lateScenes, lateStyles } from './scenes-late.js?v=3';

const scenes = { ...earlyScenes, ...lateScenes };
const pageStates = lessonPages.map(({ id }) => ['R0', ...scenes[id].beats.map(beat => beat.to)]);
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
const content = element('presentation-content');
const title = element('page-title');
const context = element('page-context');
const workflow = element('workflow-context');
const stage = element('scene-stage');
const takeaway = element('takeaway');
const previous = element('previous');
const next = element('next');
const options = element('options');
const optionsToggle = options.querySelector('summary');
const indicator = element('page-indicator');
const announcement = element('announcement');
const motionControl = element('reduced-motion');
const panel = element('reading-panel');
const panelTitle = element('panel-title');
const panelContent = element('panel-content');
const systemMotion = matchMedia('(prefers-reduced-motion: reduce)');

const presentation = {
  pageIndex: 0,
  stepIndex: 0,
  active: null,
  panelOpener: null,
  motionOverride: null,
};

const page = () => lessonPages[presentation.pageIndex];
const scene = () => scenes[page().id];
const lastStep = () => pageStates[presentation.pageIndex].length - 1;
const state = () => pageStates[presentation.pageIndex][presentation.stepIndex];
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
  previous.disabled = !active && presentation.pageIndex === 0 && presentation.stepIndex === 0;
  next.disabled = presentation.pageIndex === lessonPages.length - 1 && presentation.stepIndex === lastStep();
  next.setAttribute('aria-disabled', String(Boolean(active) || next.disabled));
  indicator.textContent = `Page ${presentation.pageIndex + 1} of ${lessonPages.length} · ` +
    `Step ${presentation.stepIndex + 1} of ${lastStep() + 1}`;
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

function stopBeat() {
  const active = presentation.active;
  presentation.active = null;
  active?.animations.forEach(animation => animation.cancel());
}

function commit(stepIndex, pageIndex = presentation.pageIndex) {
  const focused = document.activeElement;
  stopBeat();
  presentation.pageIndex = pageIndex;
  presentation.stepIndex = stepIndex;
  renderCommitted();
  announcement.textContent = indicator.textContent;
  if (focused === previous && previous.disabled) next.focus({ preventScroll: true });
  if (focused === next && next.disabled) previous.focus({ preventScroll: true });
}

function motionFrames(effect) {
  switch (effect) {
    case 'lift':
      return [{ transform: 'translateY(0)', opacity: 1 }, { transform: 'translateY(-32%)', opacity: 0 }];
    case 'fade-out':
      return [{ opacity: 1 }, { opacity: 0 }];
    case 'focus':
      return [{ boxShadow: '0 0 0 0 transparent' }, { boxShadow: '0 0 0 3px #235c7a' }];
    case 'line':
      return [{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0 0 0)' }];
    case 'slide-right':
      return [{ transform: 'translateX(-24px)', opacity: 0 }, { transform: 'none', opacity: 1 }];
    case 'rise':
      return [{ translate: '0 12px', opacity: 0 }, { translate: 'none', opacity: 1 }];
    default:
      return [{ opacity: 0 }, { opacity: 1 }];
  }
}

function startBeat(beat) {
  const destinationStep = presentation.stepIndex + 1;
  if (reducedMotion()) {
    commit(destinationStep);
    return;
  }

  renderScene(beat.to, beat);
  renderTakeaway(beat.to, true);
  const targets = Array.from(stage.querySelectorAll('[data-motion]'));
  if (!takeaway.hidden) targets.push(takeaway);
  const animations = beat.motion.flatMap(({ target, effect, delay = 0, duration }) =>
    targets
      .filter(node => node.dataset.motion.split(/\s+/).includes(target))
      .map(node => node.animate(motionFrames(effect), {
        delay,
        duration,
        fill: 'both',
        easing: ['line', 'fade', 'fade-out'].includes(effect) ? 'linear' : 'cubic-bezier(0.22, 1, 0.36, 1)',
      })));
  const clock = stage.animate([], beat.duration);
  const active = { destinationStep, animations: [...animations, clock] };
  presentation.active = active;
  renderTransport();
  clock.finished.then(() => {
    if (presentation.active === active) commit(destinationStep);
  }, () => {
    // Canceling a superseded beat also cancels its clock.
  });
}

function prepareNavigation() {
  options.open = false;
  content.scrollTop = 0;
}

function goForward(event) {
  if (event.detail > 1 || presentation.active || next.disabled) return;
  prepareNavigation();
  const beat = scene().beats[presentation.stepIndex];
  if (beat) startBeat(beat);
  else commit(0, presentation.pageIndex + 1);
}

function goBack(event) {
  if (event.detail > 1 || previous.disabled) return;
  prepareNavigation();
  if (presentation.active) {
    commit(presentation.stepIndex);
  } else if (presentation.stepIndex > 0) {
    commit(presentation.stepIndex - 1);
  } else {
    const previousPage = presentation.pageIndex - 1;
    commit(pageStates[previousPage].length - 1, previousPage);
  }
}

function resetDemo() {
  prepareNavigation();
  commit(0, 0);
  title.focus();
}

function syncMotionPreference() {
  motionControl.checked = reducedMotion();
  if (motionControl.checked && presentation.active) commit(presentation.active.destinationStep);
}

function openPanel(kind, opener) {
  if (panel.open) return;
  if (presentation.active) commit(presentation.active.destinationStep);
  const pages = {
    full: ['Show full page', page().audience],
    notes: ['Presenter notes', page().notes],
  };
  const [label, ids] = pages[kind];
  presentation.panelOpener = opener;
  panelTitle.textContent = label;
  panelContent.innerHTML = ids.map(block).join('');
  panel.showModal();
  panel.scrollTop = 0;
  panelTitle.focus({ preventScroll: true });
}

previous.addEventListener('click', goBack);
next.addEventListener('click', goForward);
motionControl.addEventListener('change', () => {
  presentation.motionOverride = motionControl.checked;
  syncMotionPreference();
});
systemMotion.addEventListener('change', syncMotionPreference);
element('close-panel').addEventListener('click', () => panel.close());
panel.addEventListener('close', () => {
  if (panel.open) return;
  const opener = presentation.panelOpener;
  presentation.panelOpener = null;
  panelContent.replaceChildren();
  if (opener?.isConnected) opener.focus({ preventScroll: true });
});

stage.addEventListener('error', event => {
  if (event.target instanceof HTMLImageElement) event.target.closest('.sticker')?.classList.add('is-missing');
}, true);

document.addEventListener('keydown', event => {
  if (event.repeat && ['Enter', ' '].includes(event.key) && event.target.closest('button')) {
    event.preventDefault();
  }
  if (event.key === 'Escape' && !panel.open && options.open) {
    options.open = false;
    optionsToggle.focus();
  }
});

document.addEventListener('click', event => {
  const button = event.target.closest('button[data-action]');
  if (!button || !button.isConnected || event.detail > 1) return;
  const { action } = button.dataset;
  switch (action) {
    case 'replay':
    case 'final':
      prepareNavigation();
      commit(action === 'replay' ? 0 : lastStep());
      optionsToggle.focus();
      break;
    case 'reset':
      resetDemo();
      break;
    case 'full':
    case 'notes':
      openPanel(action, button);
      break;
  }
});

syncMotionPreference();
renderCommitted();
