export function getViewerOptions($viewer) {
  return $viewer.globalContext.localContexts
    .filter(ctx => ctx.viewer && ctx.loadedModels.length > 0)
    .map((ctx, i) => ({ key: ctx.id, index: i, name: ctx.viewer.$plugin.name, context: ctx }));
}

export function highlightViewer(context) {
  const el = context.viewer.$viewer.localContext.el;
  el.style.boxSizing = "border-box";
  el.style.border = "2px solid var(--color-primary)";
  el.style.opacity = ".85";
}

export function unhighlightViewer(context) {
  const el = context.viewer.$viewer.localContext.el;
  el.style.boxSizing = "";
  el.style.border = "";
  el.style.opacity = "";
}
