export function getViewerOptions($viewer) {
  return $viewer.globalContext.localContexts
    .filter(ctx => ctx.viewer)
    .map((ctx, i) => ({ key: ctx.id, index: i, name: ctx.viewer.$plugin.name, context: ctx }));
}

export function highlightViewer(context) {
  context.el.style.boxSizing = "border-box";
  context.el.style.border = "2px solid var(--color-primary)";
  context.el.style.opacity = ".85";
}

export function unhighlightViewer(context) {
  context.el.style.boxSizing = "";
  context.el.style.border = "";
  context.el.style.opacity = "";
}
