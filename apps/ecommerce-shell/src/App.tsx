import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import './App.css'

const ProductCatalog = lazy(() => import('./remotes/ProductCatalog'))
const CartModule = lazy(() => import('./remotes/CartModule'))
const Checkout = lazy(() => import('./remotes/Checkout'))

// Listens for mfe:navigate events dispatched by any MFE and translates them
// into React Router navigation. Must live inside <Router> to access useNavigate.
function NavigationListener() {
  const navigate = useNavigate()

  useEffect(() => {
    function onNavigate(e: Event) {
      const { path } = (e as CustomEvent<{ path: string }>).detail
      navigate(path)
    }
    window.addEventListener('mfe:navigate', onNavigate)
    return () => window.removeEventListener('mfe:navigate', onNavigate)
  }, [navigate])

  return null
}

function App() {
  return (
    <Router>
      <NavigationListener />
      <div className="app-shell">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/products/*"
              element={
                <Suspense fallback={<div className="remote-loading">Loading…</div>}>
                  <ProductCatalog />
                </Suspense>
              }
            />
            <Route
              path="/cart"
              element={
                <Suspense fallback={<div className="remote-loading">Loading…</div>}>
                  <CartModule />
                </Suspense>
              }
            />
            <Route
              path="/checkout"
              element={
                <Suspense fallback={<div className="remote-loading">Loading…</div>}>
                  <Checkout />
                </Suspense>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
