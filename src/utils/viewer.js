export function getViewerOptions($viewer) {
  return $viewer.globalContext.getViewers()
    .map((v, i) => ({ key: `${i}-${v.plugin.name}`, index: i, name: v.plugin.name, viewer: v }));
}

export function highlightViewer(viewer) {
  viewer.$viewer.localContext.el.style.boxSizing = "border-box";
  viewer.$viewer.localContext.el.style.border = "2px solid var(--color-primary)";
  viewer.$viewer.localContext.el.style.opacity = ".85";
}

export function unhighlightViewer(viewer) {
  viewer.$viewer.localContext.el.style.boxSizing = "";
  viewer.$viewer.localContext.el.style.border = "";
  viewer.$viewer.localContext.el.style.opacity = "";
}
