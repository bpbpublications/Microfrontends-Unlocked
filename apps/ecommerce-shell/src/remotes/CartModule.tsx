import { useEffect, useRef, useState } from 'react'

function CartModule() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    let unmount: (() => void) | undefined

    import('cartModule/mount')
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
        <div className="remote-loading">Loading Cart…</div>
      )}
      {status === 'error' && (
        <div className="remote-error">
          ⚠️ Could not load Cart module.
          <br />
          Run <code>npm run dev</code> in the <code>cart-module</code> directory
          to start the remote on <code>http://localhost:3002</code>.
        </div>
      )}
      <div ref={containerRef} style={{ display: status === 'error' ? 'none' : 'block' }} />
    </div>
  )
}

export default CartModule
