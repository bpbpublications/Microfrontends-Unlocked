import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@shop/react-ui'
import './Home.css'

function Home() {
  const navigate = useNavigate()
  return (
    <div className="home">
      <section className="hero">
        <h1 className="hero__title">Hello from the Shell!</h1>
        <p className="hero__subtitle">
          This is the <strong>host application</strong> — the central hub that
          loads and orchestrates remote Microfrontend modules via Webpack Module Federation.
        </p>
        <Button size="lg" onClick={() => navigate('/products')} style={{ marginTop: '1.5rem' }}>
          Shop Now
        </Button>
      </section>

      <section className="mfe-slots">
        <h2 className="mfe-slots__heading">Module Slots</h2>
        <div className="slot-grid">
          <Link to="/products" className="slot slot--live">
            <div className="slot__icon">🛍️</div>
            <h3 className="slot__title">Product Catalog</h3>
            <p className="slot__status slot__status--live">Live · Vue 3 Remote</p>
          </Link>
          <Link to="/cart" className="slot slot--live slot--cart">
            <div className="slot__icon">🛒</div>
            <h3 className="slot__title">Shopping Cart</h3>
            <p className="slot__status slot__status--cart">Live · Vue 3 + Vite Remote</p>
          </Link>
          <Link to="/checkout" className="slot slot--live slot--checkout">
            <div className="slot__icon">💳</div>
            <h3 className="slot__title">Checkout</h3>
            <p className="slot__status slot__status--checkout">Live · React Remote</p>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home
