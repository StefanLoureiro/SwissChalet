const BASE = '/api/auth'

export async function login(username, password) {
    const res = await fetch(`${BASE}/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    })

    if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.detail || 'Invalid username or password.')
    }

    const data = await res.json()
    localStorage.setItem('access_token', data.access)
    localStorage.setItem('refresh_token', data.refresh)
    return data
}

export async function register(name, username, email, password) {
    const parts = name.trim().split(' ')
    const first_name = parts[0] || ''
    const last_name = parts.slice(1).join(' ') || ''

    const res = await fetch(`${BASE}/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, first_name, last_name }),
    })

    if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        const firstKey = Object.keys(data)[0]
        const msg = firstKey
            ? (Array.isArray(data[firstKey]) ? data[firstKey][0] : data[firstKey])
            : 'Registration failed.'
        throw new Error(msg)
    }

    return await res.json()
}

export function logout() {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
}

export function getAccessToken() {
    return localStorage.getItem('access_token')
}

export async function fetchMe() {
    const token = getAccessToken()
    if (!token) return null
    const res = await fetch('/api/auth/me/', {
        headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) return null
    return await res.json()
}

export async function updateMe(fields) {
    const token = getAccessToken()
    if (!token) return null
    const res = await fetch('/api/auth/me/', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(fields),
    })
    if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        const firstKey = Object.keys(data)[0]
        const msg = firstKey
            ? (Array.isArray(data[firstKey]) ? data[firstKey][0] : data[firstKey])
            : 'Failed to save changes.'
        throw new Error(msg)
    }
    return await res.json()
}
