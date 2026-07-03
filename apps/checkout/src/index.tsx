// Async boundary — Module Federation shared singletons must be negotiated
// before any imports that touch shared packages. This dynamic import ensures
// Webpack completes the version negotiation before React is loaded.
import('./bootstrap')
