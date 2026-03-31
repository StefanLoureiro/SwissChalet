import { useState, useEffect } from 'react'

export function useChalets(activeTab) {
    const [chalets, setChalets] = useState([])
    const [chaletsLoading, setChaletsLoading] = useState(false)

    useEffect(() => {
        if (activeTab !== 'chalets' || chalets.length > 0) return
        setChaletsLoading(true)
        fetch('/api/chalets/')
            .then(r => r.json())
            .then(data => {
                setChalets(Array.isArray(data) ? data : (data.results ?? []))
                setChaletsLoading(false)
            })
            .catch(() => setChaletsLoading(false))
    }, [activeTab, chalets.length])

    return { chalets, chaletsLoading }
}
