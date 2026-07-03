// Dynamic import defers evaluation so Webpack can resolve shared
// modules (React, react-dom) before the shell app starts.
import('./bootstrap')
