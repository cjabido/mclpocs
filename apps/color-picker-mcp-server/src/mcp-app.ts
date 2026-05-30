import {
  App,
  applyDocumentTheme,
  applyHostFonts,
  applyHostStyleVariables,
  type McpUiHostContext,
} from "@modelcontextprotocol/ext-apps";
import "./global.css";
import "./mcp-app.css";

// ── DOM refs ────────────────────────────────────────────────────────────────
const mainEl = document.querySelector(".main") as HTMLElement;
const colorInput = document.getElementById("color-input") as HTMLInputElement;
const colorPreview = document.getElementById("color-preview") as HTMLDivElement;
const hueSlider = document.getElementById("hue") as HTMLInputElement;
const satSlider = document.getElementById("sat") as HTMLInputElement;
const litSlider = document.getElementById("lit") as HTMLInputElement;
const hueVal = document.getElementById("hue-val")!;
const satVal = document.getElementById("sat-val")!;
const litVal = document.getElementById("lit-val")!;
const hexDisplay = document.getElementById("hex-display")!;
const rgbDisplay = document.getElementById("rgb-display")!;
const hslDisplay = document.getElementById("hsl-display")!;
const useBtn = document.getElementById("use-color-btn") as HTMLButtonElement;
const statusEl = document.getElementById("status")!;

// ── Color math ──────────────────────────────────────────────────────────────

function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, Math.round(l * 100)];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToHex(h: number, s: number, l: number): string {
  const sn = s / 100, ln = l / 100;
  const a = sn * Math.min(ln, 1 - ln);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = ln - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function hexToRgb(hex: string): [number, number, number] {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
}

// ── UI sync ──────────────────────────────────────────────────────────────────

function updateSatLitGradients(h: number, s: number) {
  satSlider.style.background = `linear-gradient(to right, hsl(${h},0%,50%), hsl(${h},100%,50%))`;
  litSlider.style.background = `linear-gradient(to right, hsl(${h},${s}%,0%), hsl(${h},${s}%,50%), hsl(${h},${s}%,100%))`;
}

function applyHex(hex: string, source: "wheel" | "sliders") {
  const [h, s, l] = hexToHsl(hex);
  const [r, g, b] = hexToRgb(hex);

  colorPreview.style.backgroundColor = hex;
  hexDisplay.textContent = hex;
  rgbDisplay.textContent = `${r}, ${g}, ${b}`;
  hslDisplay.textContent = `${h}°, ${s}%, ${l}%`;
  useBtn.style.background = hex;

  if (source === "wheel") {
    hueSlider.value = String(h);
    satSlider.value = String(s);
    litSlider.value = String(l);
  } else {
    colorInput.value = hex;
  }

  hueVal.textContent = `${h}°`;
  satVal.textContent = `${s}%`;
  litVal.textContent = `${l}%`;
  updateSatLitGradients(h, s);
}

// ── Event listeners ──────────────────────────────────────────────────────────

colorInput.addEventListener("input", () => {
  applyHex(colorInput.value, "wheel");
});

function onSliderChange() {
  const h = parseInt(hueSlider.value);
  const s = parseInt(satSlider.value);
  const l = parseInt(litSlider.value);
  applyHex(hslToHex(h, s, l), "sliders");
}

hueSlider.addEventListener("input", onSliderChange);
satSlider.addEventListener("input", onSliderChange);
litSlider.addEventListener("input", onSliderChange);

// ── MCP App lifecycle ─────────────────────────────────────────────────────────

function handleHostContext(ctx: McpUiHostContext) {
  if (ctx.theme) applyDocumentTheme(ctx.theme);
  if (ctx.styles?.variables) applyHostStyleVariables(ctx.styles.variables);
  if (ctx.styles?.css?.fonts) applyHostFonts(ctx.styles.css.fonts);
  if (ctx.safeAreaInsets) {
    mainEl.style.paddingTop = `${ctx.safeAreaInsets.top}px`;
    mainEl.style.paddingRight = `${ctx.safeAreaInsets.right}px`;
    mainEl.style.paddingBottom = `${ctx.safeAreaInsets.bottom}px`;
    mainEl.style.paddingLeft = `${ctx.safeAreaInsets.left}px`;
  }
}

const mcpApp = new App({ name: "Color Picker App", version: "1.0.0" });

mcpApp.onhostcontextchanged = handleHostContext;
mcpApp.onerror = console.error;

mcpApp.ontoolinput = (params) => {
  const args = params.arguments as { initialColor?: string } | undefined;
  const initial = args?.initialColor;
  if (initial && /^#[0-9a-fA-F]{6}$/.test(initial)) {
    applyHex(initial, "wheel");
  }
};

mcpApp.ontoolresult = () => {};

mcpApp.onteardown = async () => ({});

useBtn.addEventListener("click", async () => {
  const hex = colorInput.value;
  const [h, s, l] = hexToHsl(hex);
  const [r, g, b] = hexToRgb(hex);

  useBtn.disabled = true;
  statusEl.textContent = "Sending color to conversation…";

  try {
    const text =
      `Selected color: ${hex} | RGB(${r}, ${g}, ${b}) | HSL(${h}°, ${s}%, ${l}%)`;

    await mcpApp.sendMessage({
      role: "user",
      content: [{ type: "text", text }],
    });

    statusEl.textContent = `Sent: ${hex}`;
  } catch (e) {
    console.error(e);
    statusEl.textContent = "Could not send — copy the values above manually.";
  } finally {
    useBtn.disabled = false;
  }
});

// ── Boot ──────────────────────────────────────────────────────────────────────

mcpApp.connect().then(() => {
  const ctx = mcpApp.getHostContext();
  if (ctx) handleHostContext(ctx);
  applyHex(colorInput.value, "wheel");
});
