import { useEffect, useRef, useState } from 'react'

function ProductCatalog() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    let unmount: (() => void) | undefined

    // Dynamically import the exposed mount function from the remote.
    // Webpack resolves 'productCatalog/mount' via the remoteEntry.js
    // declared in ModuleFederationPlugin.
    import('productCatalog/mount')
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
        <div className="remote-loading">Loading Product Catalog…</div>
      )}
      {status === 'error' && (
        <div className="remote-error">
          ⚠️ Could not load Product Catalog.
          <br />
          Make sure the remote is running on <code>http://localhost:3001</code>.
        </div>
      )}
      {/* Container is always in the DOM so the Vue app can mount into it */}
      <div ref={containerRef} style={{ display: status === 'error' ? 'none' : 'block' }} />
    </div>
  )
}

export default ProductCatalog
