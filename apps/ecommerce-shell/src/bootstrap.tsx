import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.scss'
import App from './App'

// Pre-load cart module so the mfe:cart:add listener is registered immediately,
// even before the user navigates to /cart for the first time.
import('cartModule/mount').catch(() => {})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
