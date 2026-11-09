import { lessonPages } from './lesson-data.js?v=7';
import { earlyScenes, earlyStyles } from './scenes-early.js?v=7';
import { lateScenes, lateStyles } from './scenes-late.js?v=5';

const scenes = { ...earlyScenes, ...lateScenes };
const PRESENTATION_SCALE = 2.5;
const MIN_REVEAL_MS = 1400;
const READING_PAUSE_MS = 700;
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
const lesson = content.querySelector('.lesson');
const title = element('page-title');
const context = element('page-context');
const workflow = element('workflow-context');
const stage = element('scene-stage');
const takeaway = element('takeaway');
const previous = element('previous');
const next = element('next');
const nextLabel = element('next-label');
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
  readingTimer: null,
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
  next.setAttribute('aria-disabled', String(Boolean(active) || presentation.readingTimer !== null || next.disabled));
  nextLabel.textContent = active ? 'Revealing…' : 'Next';
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
  fitLesson();
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

function commit(stepIndex, pageIndex = presentation.pageIndex, pauseForReading = false) {
  const focused = document.activeElement;
  stopBeat();
  clearTimeout(presentation.readingTimer);
  presentation.readingTimer = pauseForReading ? setTimeout(() => {
    presentation.readingTimer = null;
    renderTransport();
  }, READING_PAUSE_MS) : null;
  presentation.pageIndex = pageIndex;
  presentation.stepIndex = stepIndex;
  renderCommitted();
  announcement.textContent = indicator.textContent;
  if (focused === previous && previous.disabled) next.focus({ preventScroll: true });
  if (focused === next && next.disabled) previous.focus({ preventScroll: true });
}

function syncPlayback() {
  const active = presentation.active;
  if (!active) return;
  const paused = panel.open || document.hidden;
  for (const animation of active.animations) {
    if (paused && animation.playState === 'running') animation.pause();
    else if (!paused && animation.playState === 'paused') animation.play();
  }
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
    case 'rise':
      return [{ translate: '0 12px', opacity: 0 }, { translate: 'none', opacity: 1 }];
    default:
      return [{ opacity: 0 }, { opacity: 1 }];
  }
}

function fitLesson() {
  const style = getComputedStyle(content);
  const width = content.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
  const height = content.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom) - 1;
  if (width <= 0 || height <= 0) return;

  const maxWidth = parseFloat(style.getPropertyValue('--lesson-width'));
  const measure = layoutWidth => {
    lesson.style.setProperty('--layout-width', `${layoutWidth}px`);
    const vertical = height / lesson.offsetHeight;
    const horizontal = width / Math.max(layoutWidth, lesson.scrollWidth);
    return { layoutWidth, scale: Math.min(1, horizontal, vertical), heightLimited: vertical < horizontal };
  };

  let lower = Math.min(width, maxWidth);
  let best = measure(lower);
  let upper = Math.min(maxWidth, width / best.scale);

  // Wider wrapping can fit dense steps at a larger readable scale.
  if (upper - lower >= 1) {
    const widest = measure(upper);
    if (widest.scale > best.scale) best = widest;
    for (let attempt = 0; attempt < 5 && upper - lower >= 1; attempt++) {
      const candidate = measure((lower + upper) / 2);
      if (candidate.scale > best.scale) best = candidate;
      if (candidate.heightLimited) lower = candidate.layoutWidth;
      else upper = candidate.layoutWidth;
    }
  }

  lesson.style.setProperty('--layout-width', `${best.layoutWidth}px`);
  lesson.style.setProperty('--lesson-scale', best.scale);
}

function startBeat(beat) {
  const destinationStep = presentation.stepIndex + 1;
  if (reducedMotion()) {
    commit(destinationStep, presentation.pageIndex, true);
    return;
  }

  renderScene(beat.to, beat);
  renderTakeaway(beat.to, true);
  fitLesson();
  const targets = Array.from(stage.querySelectorAll('[data-motion]'));
  if (!takeaway.hidden) targets.push(takeaway);
  const timeScale = Math.max(PRESENTATION_SCALE, MIN_REVEAL_MS / beat.duration);
  const animations = beat.motion.flatMap(({ target, effect, delay = 0, duration }) =>
    targets
      .filter(node => node.dataset.motion.split(/\s+/).includes(target))
      .map(node => node.animate(motionFrames(effect), {
        delay: delay * timeScale,
        duration: duration * timeScale,
        fill: 'both',
        easing: ['line', 'fade', 'fade-out'].includes(effect) ? 'linear' : 'cubic-bezier(0.22, 1, 0.36, 1)',
      })));
  animations.push(stage.animate([], beat.duration * timeScale));
  const startTime = document.timeline.currentTime;
  if (startTime !== null) animations.forEach(animation => { animation.startTime = startTime; });
  const active = { destinationStep, animations };
  presentation.active = active;
  renderTransport();
  announcement.textContent = `Revealing step ${destinationStep + 1} of ${lastStep() + 1}.`;
  syncPlayback();
  Promise.all(animations.map(animation => animation.finished)).then(() => {
    if (presentation.active === active) commit(destinationStep, presentation.pageIndex, true);
  }, () => {
    // Canceling a superseded beat also cancels its clock.
  });
}

function prepareNavigation() {
  options.open = false;
}

function goForward(event) {
  if (event.detail > 1 || panel.open || next.getAttribute('aria-disabled') === 'true') return;
  const beat = scene().beats[presentation.stepIndex];
  if (beat) {
    options.open = false;
    startBeat(beat);
  } else {
    prepareNavigation();
    commit(0, presentation.pageIndex + 1, true);
  }
}

function goBack(event) {
  if (event.detail > 1 || panel.open || previous.disabled) return;
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
  if (motionControl.checked && presentation.active) commit(presentation.active.destinationStep, presentation.pageIndex, true);
}

function openPanel(kind, opener) {
  if (panel.open) return;
  const pages = {
    full: ['Show full page', page().audience],
    notes: ['Presenter notes', page().notes],
  };
  const [label, ids] = pages[kind];
  presentation.panelOpener = opener;
  panelTitle.textContent = label;
  panelContent.innerHTML = ids.map(block).join('');
  panel.showModal();
  syncPlayback();
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
document.addEventListener('visibilitychange', syncPlayback);
element('close-panel').addEventListener('click', () => panel.close());
panel.addEventListener('close', () => {
  if (panel.open) return;
  const opener = presentation.panelOpener;
  presentation.panelOpener = null;
  panelContent.replaceChildren();
  if (opener?.isConnected) opener.focus({ preventScroll: true });
  syncPlayback();
});

stage.addEventListener('error', event => {
  if (event.target instanceof HTMLImageElement) {
    event.target.closest('.sticker')?.classList.add('is-missing');
    fitLesson();
  }
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
new ResizeObserver(fitLesson).observe(content);
