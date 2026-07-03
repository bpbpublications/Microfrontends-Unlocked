import { useMemo } from 'react'

interface CartItem {
  id: number
  title: string
  price: number
  quantity: number
  image: string
}

function loadCartItems(): CartItem[] {
  try {
    return JSON.parse(localStorage.getItem('mfe_cart_items') || '[]')
  } catch {
    return []
  }
}

function OrderSummary() {
  // Read once on mount — the checkout page is a final step, cart edits happen
  // before this. Re-reading on every render would require an event listener
  // that's out of scope for this component's responsibility.
  const items = useMemo(loadCartItems, [])

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="order-summary">
      <h2 className="order-summary__heading">Order Summary</h2>

      {items.length === 0 ? (
        <p className="order-summary__empty">Your cart is empty.</p>
      ) : (
        <>
          <ul className="order-summary__items">
            {items.map((item) => (
              <li key={item.id} className="order-summary__item">
                <img
                  src={item.image}
                  alt={item.title}
                  className="order-summary__item-img"
                />
                <div className="order-summary__item-info">
                  <p className="order-summary__item-title">{item.title}</p>
                  <p className="order-summary__item-meta">
                    {item.quantity} × ${item.price.toFixed(2)}
                  </p>
                </div>
                <span className="order-summary__item-subtotal">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>

          <div className="order-summary__divider" />

          <div className="order-summary__row">
            <span>Items ({itemCount})</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="order-summary__row">
            <span>Shipping</span>
            <span className="free">Free</span>
          </div>

          <div className="order-summary__divider" />

          <div className="order-summary__row order-summary__row--total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </>
      )}
    </div>
  )
}

export default OrderSummary
