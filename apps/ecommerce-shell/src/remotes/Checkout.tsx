import { useEffect, useRef, useState } from 'react'

function Checkout() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    let unmount: (() => void) | undefined

    import('checkout/mount')
      .then(({ mount }) => {
        unmount = mount(el).unmount
        setStatus('ready')
      })
      .catch(() => setStatus('error'))

    return () => unmount?.()
  }, [])

  return (
    <div className="remote-wrapper">
      {status === 'loading' && (
        <div className="remote-loading">Loading Checkout…</div>
      )}
      {status === 'error' && (
        <div className="remote-error">
          ⚠️ Could not load Checkout module.
          <br />
          Make sure the remote is running on <code>http://localhost:3003</code>.
        </div>
      )}
      <div ref={containerRef} style={{ display: status === 'error' ? 'none' : 'block' }} />
    </div>
  )
}

export default Checkout
