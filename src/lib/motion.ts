const KEY = "reduce-motion";
const EVENT = "motionchange";

type LenisLike = { scrollTo: (t: HTMLElement | number, o?: { offset?: number; duration?: number }) => void; stop(): void; start(): void };
declare global {
  interface Window {
    __lenis?: LenisLike;
  }
}

/** True when the OS asks for reduced motion OR the visitor toggled it in the command palette. */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const stored = localStorage.getItem(KEY);
    if (stored !== null) return stored === "1";
  } catch {
    /* storage blocked */
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function applyReducedMotion(on: boolean) {
  document.documentElement.classList.toggle("reduce-motion", on);
  window.dispatchEvent(new CustomEvent(EVENT, { detail: on }));
}

export function setReducedMotion(on: boolean) {
  try {
    localStorage.setItem(KEY, on ? "1" : "0");
  } catch {
    /* ignore */
  }
  applyReducedMotion(on);
}

export function onMotionChange(cb: (reduced: boolean) => void) {
  const h = (e: Event) => cb((e as CustomEvent<boolean>).detail);
  window.addEventListener(EVENT, h);
  return () => window.removeEventListener(EVENT, h);
}

export function scrollToId(id: string) {
  const el = id === "top" ? null : document.getElementById(id);
  const reduced = document.documentElement.classList.contains("reduce-motion");
  if (window.__lenis && !reduced) {
    window.__lenis.scrollTo(el ?? 0, { offset: el ? -24 : 0, duration: 1.4 });
  } else {
    (el ?? document.body).scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  }
  history.replaceState(null, "", id === "top" ? location.pathname : `#${id}`);
}
