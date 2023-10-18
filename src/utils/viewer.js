export function getViewerList(viewers) {
  return Object.values(viewers).flat();
}

export function getViewerOptions(viewers) {
  return Object.entries(viewers)
    .map(([id, list]) => list.map((v, i) => ({ key: `${id}-${i}`, id, index: i, viewer: v })))
    .flat();
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
