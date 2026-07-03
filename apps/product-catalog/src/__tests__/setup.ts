import { vi } from 'vitest'

// Stub CSS/SCSS imports so vitest doesn't choke on them
vi.mock('*.css', () => ({}))
vi.mock('*.scss', () => ({}))
