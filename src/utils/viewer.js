import { markRaw } from "vue";

export function getViewerOptions($viewer) {
  return $viewer.globalContext.localContexts
    .filter(ctx => ctx.viewer && ctx.loadedModels.length > 0)
    .map((ctx, i) => ({ key: ctx.id, index: i, name: ctx.viewer.$plugin.name, context: markRaw(ctx) }));
}

export async function getViewerViewpoint(context) {
  const ctx = context.viewer.$viewer.localContext;
  const viewpoint = await ctx.getViewpoint();
  viewpoint.snapshot = await ctx.getSnapshot();
  return viewpoint;
}

export function highlightViewer(context) {
  const ctx = context.viewer.$viewer.localContext;
  ctx.el.style.outlineOffset = "-2px";
  ctx.el.style.outline = "2px solid var(--color-primary)";
  ctx.el.style.opacity = ".85";
}

export function unhighlightViewer(context) {
  const ctx = context.viewer.$viewer.localContext;
  ctx.el.style.outlineOffset = "";
  ctx.el.style.outline = "";
  ctx.el.style.opacity = "";
}
