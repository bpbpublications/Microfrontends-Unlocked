import { useState } from 'react'
import { Button } from '@shop/react-ui'

interface FormState {
  name: string
  email: string
  address: string
  city: string
  zip: string
}

const empty: FormState = { name: '', email: '', address: '', city: '', zip: '' }

function CheckoutForm() {
  const [form, setForm] = useState<FormState>(empty)
  const [errors, setErrors] = useState<Partial<FormState>>({})
  const [submitted, setSubmitted] = useState(false)

  function validate(): boolean {
    const next: Partial<FormState> = {}
    if (!form.name.trim()) next.name = 'Full name is required'
    if (!form.email.trim()) next.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = 'Enter a valid email'
    if (!form.address.trim()) next.address = 'Street address is required'
    if (!form.city.trim()) next.city = 'City is required'
    if (!form.zip.trim()) next.zip = 'ZIP code is required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormState]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    // Broadcast the order placed event — cart module listens and clears itself.
    // Any MFE can react to this event: analytics, shell navigation, etc.
    window.dispatchEvent(
      new CustomEvent('mfe:order:placed', {
        detail: {
          customer: { name: form.name, email: form.email },
          address: { street: form.address, city: form.city, zip: form.zip },
          timestamp: new Date().toISOString(),
        },
      }),
    )

    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="checkout-confirmation">
        <div className="checkout-confirmation__icon">✓</div>
        <h2 className="checkout-confirmation__title">Order Placed!</h2>
        <p className="checkout-confirmation__message">
          Thank you, <strong>{form.name}</strong>. A confirmation will be sent to{' '}
          <strong>{form.email}</strong>.
        </p>
        <Button
          variant="secondary"
          onClick={() =>
            window.dispatchEvent(
              new CustomEvent('mfe:navigate', { detail: { path: '/' } }),
            )
          }
          style={{ marginTop: '1.5rem' }}
        >
          Back to Home
        </Button>
      </div>
    )
  }

  return (
    <form className="checkout-form" onSubmit={handleSubmit} noValidate>
      <section className="checkout-form__section">
        <h2 className="checkout-form__section-title">Contact</h2>

        <div className="form-group">
          <label htmlFor="name">Full name</label>
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            className={errors.name ? 'input input--error' : 'input'}
            placeholder="Jane Smith"
          />
          {errors.name && <span className="field-error">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className={errors.email ? 'input input--error' : 'input'}
            placeholder="jane@example.com"
          />
          {errors.email && <span className="field-error">{errors.email}</span>}
        </div>
      </section>

      <section className="checkout-form__section">
        <h2 className="checkout-form__section-title">Shipping Address</h2>

        <div className="form-group">
          <label htmlFor="address">Street address</label>
          <input
            id="address"
            name="address"
            type="text"
            value={form.address}
            onChange={handleChange}
            className={errors.address ? 'input input--error' : 'input'}
            placeholder="123 Main St"
          />
          {errors.address && <span className="field-error">{errors.address}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="city">City</label>
            <input
              id="city"
              name="city"
              type="text"
              value={form.city}
              onChange={handleChange}
              className={errors.city ? 'input input--error' : 'input'}
              placeholder="New York"
            />
            {errors.city && <span className="field-error">{errors.city}</span>}
          </div>

          <div className="form-group form-group--zip">
            <label htmlFor="zip">ZIP</label>
            <input
              id="zip"
              name="zip"
              type="text"
              value={form.zip}
              onChange={handleChange}
              className={errors.zip ? 'input input--error' : 'input'}
              placeholder="10001"
            />
            {errors.zip && <span className="field-error">{errors.zip}</span>}
          </div>
        </div>
      </section>

      <Button type="submit" size="lg" fullWidth>
        Place Order
      </Button>
    </form>
  )
}

export default CheckoutForm
