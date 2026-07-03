import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import CheckoutForm from '../../components/CheckoutForm'

function fillForm(overrides: Partial<Record<string, string>> = {}) {
  const defaults = {
    name: 'Jane Smith',
    email: 'jane@example.com',
    address: '123 Main St',
    city: 'New York',
    zip: '10001',
  }
  const values = { ...defaults, ...overrides }
  fireEvent.change(screen.getByLabelText(/full name/i), { target: { name: 'name', value: values.name } })
  fireEvent.change(screen.getByLabelText(/email/i),     { target: { name: 'email', value: values.email } })
  fireEvent.change(screen.getByLabelText(/street address/i), { target: { name: 'address', value: values.address } })
  fireEvent.change(screen.getByLabelText(/city/i),      { target: { name: 'city', value: values.city } })
  fireEvent.change(screen.getByLabelText(/zip/i),       { target: { name: 'zip', value: values.zip } })
}

beforeEach(() => {
  vi.restoreAllMocks()
})

describe('CheckoutForm', () => {
  it('renders all required form fields', () => {
    render(<CheckoutForm />)
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/street address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/city/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/zip/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /place order/i })).toBeInTheDocument()
  })

  it('shows validation errors when submitted with empty fields', async () => {
    render(<CheckoutForm />)
    fireEvent.submit(screen.getByRole('button', { name: /place order/i }).closest('form')!)
    expect(await screen.findByText(/full name is required/i)).toBeInTheDocument()
    expect(screen.getByText(/email is required/i)).toBeInTheDocument()
    expect(screen.getByText(/street address is required/i)).toBeInTheDocument()
    expect(screen.getByText(/city is required/i)).toBeInTheDocument()
    expect(screen.getByText(/zip code is required/i)).toBeInTheDocument()
  })

  it('shows an error for an invalid email format', () => {
    render(<CheckoutForm />)
    fillForm({ email: 'not-an-email' })
    fireEvent.submit(screen.getByRole('button', { name: /place order/i }).closest('form')!)
    expect(screen.getByText(/enter a valid email/i)).toBeInTheDocument()
  })

  it('clears a field error when the user types in that field', async () => {
    render(<CheckoutForm />)
    fireEvent.submit(screen.getByRole('button', { name: /place order/i }).closest('form')!)
    expect(await screen.findByText(/full name is required/i)).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { name: 'name', value: 'Jane' },
    })
    expect(screen.queryByText(/full name is required/i)).not.toBeInTheDocument()
  })

  it('dispatches mfe:order:placed with correct payload on valid submit', () => {
    const listener = vi.fn()
    window.addEventListener('mfe:order:placed', listener)

    render(<CheckoutForm />)
    fillForm()
    fireEvent.submit(screen.getByRole('button', { name: /place order/i }).closest('form')!)

    expect(listener).toHaveBeenCalledOnce()
    const detail = (listener.mock.calls[0][0] as CustomEvent).detail
    expect(detail.customer.name).toBe('Jane Smith')
    expect(detail.customer.email).toBe('jane@example.com')
    expect(detail.address.street).toBe('123 Main St')
    expect(detail.address.city).toBe('New York')
    expect(detail.address.zip).toBe('10001')
    expect(typeof detail.timestamp).toBe('string')

    window.removeEventListener('mfe:order:placed', listener)
  })

  it('shows the confirmation screen after a valid submit', () => {
    render(<CheckoutForm />)
    fillForm()
    fireEvent.submit(screen.getByRole('button', { name: /place order/i }).closest('form')!)

    expect(screen.getByText(/order placed/i)).toBeInTheDocument()
    expect(screen.getByText(/jane smith/i)).toBeInTheDocument()
    expect(screen.getByText(/jane@example\.com/i)).toBeInTheDocument()
  })

  it('dispatches mfe:navigate to / when Back to Home is clicked on confirmation', () => {
    const listener = vi.fn()
    window.addEventListener('mfe:navigate', listener)

    render(<CheckoutForm />)
    fillForm()
    fireEvent.submit(screen.getByRole('button', { name: /place order/i }).closest('form')!)
    fireEvent.click(screen.getByRole('button', { name: /back to home/i }))

    expect(listener).toHaveBeenCalledOnce()
    expect((listener.mock.calls[0][0] as CustomEvent).detail.path).toBe('/')

    window.removeEventListener('mfe:navigate', listener)
  })
})
