import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import './Header.css'

function Header() {
  const [cartCount, setCartCount] = useState(() => {
    try {
      const items: { quantity: number }[] = JSON.parse(
        localStorage.getItem('mfe_cart_items') || '[]',
      )
      return items.reduce((s, i) => s + i.quantity, 0)
    } catch {
      return 0
    }
  })

  useEffect(() => {
    function onCartUpdated(e: Event) {
      setCartCount((e as CustomEvent<{ count: number }>).detail.count)
    }
    window.addEventListener('mfe:cart:updated', onCartUpdated)
    return () => window.removeEventListener('mfe:cart:updated', onCartUpdated)
  }, [])

  return (
    <header className="shell-header">
      <div className="shell-header__inner">
        <Link to="/" className="shell-header__brand">ShopMFE</Link>
        <nav className="shell-header__nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-link${isActive ? ' nav-link--active' : ''}`}
          >
            Home
          </NavLink>
          <NavLink
            to="/products"
            className={({ isActive }) => `nav-link${isActive ? ' nav-link--active' : ''}`}
          >
            Products
          </NavLink>
          <NavLink
            to="/cart"
            className={({ isActive }) => `nav-link nav-link--cart${isActive ? ' nav-link--active' : ''}`}
          >
            Cart
            {cartCount > 0 && (
              <span className="cart-badge">{cartCount > 99 ? '99+' : cartCount}</span>
            )}
          </NavLink>
          <NavLink
            to="/checkout"
            className={({ isActive }) => `nav-link${isActive ? ' nav-link--active' : ''}`}
          >
            Checkout
          </NavLink>
        </nav>
      </div>
    </header>
  )
}

export default Header
