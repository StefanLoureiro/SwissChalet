import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAccessToken, fetchMe, logout } from '../services/auth'

export function useDashboardData() {
    const navigate = useNavigate()
    const [user, setUser] = useState({ id: null, username: '', first_name: '', last_name: '', email: '' })
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)
    const [cancellingId, setCancellingId] = useState(null)

    useEffect(() => {
        const token = getAccessToken()
        if (!token) { navigate('/'); return }

        fetchMe()
            .then(me => {
                if (!me) { navigate('/'); return }
                setUser(me)
                return fetch(`/api/bookings/?user=${me.id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
            })
            .then(r => r?.json())
            .then(data => {
                if (data) setBookings(Array.isArray(data) ? data : (data.results ?? []))
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [navigate])

    const handleSignOut = () => { logout(); navigate('/') }

    const handleCancelBooking = async (bookingId) => {
        if (!window.confirm('Are you sure you want to cancel this reservation? This action cannot be undone.')) return
        setCancellingId(bookingId)
        try {
            const token = getAccessToken()
            const res = await fetch(`/api/bookings/${bookingId}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status: 'cancelled' }),
            })
            if (!res.ok) throw new Error('Failed to cancel reservation.')
            const updated = await res.json()
            setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: updated.status } : b))
        } catch (err) {
            alert(err.message)
        } finally {
            setCancellingId(null)
        }
    }

    return { user, setUser, bookings, setBookings, loading, handleSignOut, handleCancelBooking, cancellingId }
}
