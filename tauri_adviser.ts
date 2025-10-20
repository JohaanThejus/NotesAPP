import { getCurrentWindow } from "@tauri-apps/api/window";

const appWindow = getCurrentWindow();

// Cast buttons to HTMLElement
const minimizeBtn = document.querySelector(".minimize") as HTMLElement | null;
const maximizeBtn = document.querySelector(".maximize") as HTMLElement | null;
const closeBtn = document.querySelector(".close") as HTMLElement | null;

// Minimize
minimizeBtn?.addEventListener("click", () => {
  appWindow.minimize();
});

// Maximize / Restore
maximizeBtn?.addEventListener("click", async () => {
  await appWindow.toggleMaximize();
  updateMaximizeIcon();
});

// Close
closeBtn?.addEventListener("click", () => {
  appWindow.close();
});

// --- ICON TOGGLE ---
async function updateMaximizeIcon() {
  if (!maximizeBtn) return; // safety check
  
  const isMax = await appWindow.isMaximized();
  
  if (isMax) {
    // Show "Restore" icon (two overlapping squares with offset)
    maximizeBtn.innerHTML = `
      <svg viewBox="0 0 12 12" width="12" height="12">
        <rect x="3.5" y="1.5" width="7" height="7" fill="none" stroke="white" stroke-width="1"/>
        <path d="M 1.5 3.5 L 1.5 10.5 L 8.5 10.5 L 8.5 8.5" fill="none" stroke="white" stroke-width="1"/>
        <line x1="3.5" y1="3.5" x2="1.5" y2="3.5" stroke="white" stroke-width="1"/>
      </svg>
    `;
  } else {
    // Show "Maximize" icon (single square)
    maximizeBtn.innerHTML = `
      <svg viewBox="0 0 12 12" width="12" height="12">
        <rect x="2" y="2" width="8" height="8" fill="none" stroke="white" stroke-width="1"/>
      </svg>
    `;
  }
}

// Run once on load so it matches current state
updateMaximizeIcon();

// Optional: update icon automatically if window is resized/maximized/restored
appWindow.onResized(() => updateMaximizeIcon());
