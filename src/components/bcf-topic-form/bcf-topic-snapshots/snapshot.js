import html2canvas from "html2canvas";
import { toCamelCaseFields } from "../../../utils/misc.js";

async function takeSnapshot2D(el) {
  let fullscreened = false;
  let initialWidth, initialHeight;

  if (document.fullscreenElement === el) {
    fullscreened = true;

    initialWidth = el.style.width;
    initialHeight = el.style.height;

    el.style.width = "100vw";
    el.style.height = "100vh";
  }

  const canvas = await html2canvas(el);

  if (fullscreened) {
    el.style.width = initialWidth;
    el.style.height = initialHeight;
  }

  return canvas.toDataURL();
}

async function getViewpoint2D(viewer) {
  viewer.hideUI();
  const viewpoint = {
    snapshot: {
      snapshotType: "png",
      snapshotData: await takeSnapshot2D(viewer.$viewer.localContext.el),
    },
  };
  viewer.showUI();
  return viewpoint;
}

function getViewpoint3D(viewer) {
  const viewpoint = viewer.getViewpoint();
  return toCamelCaseFields(viewpoint);
}

export {
  takeSnapshot2D,
  getViewpoint2D,
  getViewpoint3D
};
