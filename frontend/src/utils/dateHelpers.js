export function greeting() {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 18) return 'Good afternoon'
    return 'Good evening'
}

export function daysUntil(dateStr) {
    return Math.ceil((new Date(dateStr) - new Date()) / 86400000)
}

export function formatDate(d) {
    return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function nightsBetween(start, end) {
    return Math.max(0, Math.ceil((new Date(end) - new Date(start)) / 86400000))
}
