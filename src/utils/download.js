async function downloadBlobAs(name, blob) {
  const { URL } = window;
  const link = document.createElement("a");
  link.rel = "noopener";
  link.download = name;
  // Create object url from blob
  link.href = URL.createObjectURL(blob);

  // Trigger "Save As" dialog
  setTimeout(() => link.click(), 0);
  // Revoke object url after 40 seconds
  setTimeout(() => URL.revokeObjectURL(link.href), 4e4);
};

export { downloadBlobAs }