import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

export function mount(el: HTMLElement) {
  const root = createRoot(el)
  root.render(
    // StrictMode is intentionally omitted when embedded — double-invoking
    // effects in the host shell causes duplicate event listener registrations.
    <App />,
  )
  return { unmount: () => root.unmount() }
}
