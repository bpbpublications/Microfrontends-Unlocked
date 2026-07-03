// Type declarations for Module Federation remote modules.
// Webpack resolves these at runtime; TypeScript needs these stubs at build time.

declare module 'productCatalog/mount' {
  export function mount(el: HTMLElement): { unmount: () => void }
}

declare module 'cartModule/mount' {
  export function mount(el: HTMLElement): { unmount: () => void }
}

declare module 'checkout/mount' {
  export function mount(el: HTMLElement): { unmount: () => void }
}
