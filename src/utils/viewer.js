export function getViewerOptions($viewer) {
  return $viewer.globalContext.localContexts
    .filter(ctx => ctx.viewer && ctx.loadedModels.length > 0)
    .map((ctx, i) => ({ key: ctx.id, index: i, name: ctx.viewer.$plugin.name, context: ctx }));
}

export async function getViewerViewpoint(context) {
  const ctx = context.viewer.$viewer.localContext;
  return {
    ...ctx.getViewpoint(),
    snapshot: await ctx.getSnapshot()
  };
}

export function highlightViewer(context) {
  const ctx = context.viewer.$viewer.localContext;
  ctx.el.style.boxSizing = "border-box";
  ctx.el.style.border = "2px solid var(--color-primary)";
  ctx.el.style.opacity = ".85";
}

export function unhighlightViewer(context) {
  const ctx = context.viewer.$viewer.localContext;
  ctx.el.style.boxSizing = "";
  ctx.el.style.border = "";
  ctx.el.style.opacity = "";
}
