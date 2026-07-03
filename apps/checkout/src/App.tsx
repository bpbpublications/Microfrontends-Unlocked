import OrderSummary from './components/OrderSummary'
import CheckoutForm from './components/CheckoutForm'
import './index.css'

function App() {
  return (
    <div className="checkout-app">
      <div className="checkout-layout">
        <div className="checkout-main">
          <h1 className="checkout-heading">Checkout</h1>
          <CheckoutForm />
        </div>
        <aside className="checkout-aside">
          <OrderSummary />
        </aside>
      </div>
    </div>
  )
}

export default App
