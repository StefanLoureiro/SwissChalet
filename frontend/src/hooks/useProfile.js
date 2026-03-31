import { useState } from 'react'
import { updateMe } from '../services/auth'

export function useProfile(user, setUser) {
    const [editing, setEditing] = useState(false)
    const [editForm, setEditForm] = useState({ first_name: '', last_name: '', email: '' })
    const [saveState, setSaveState] = useState({ loading: false, msg: '', error: false })

    const startEditing = () => {
        setEditForm({ first_name: user.first_name, last_name: user.last_name, email: user.email })
        setSaveState({ loading: false, msg: '', error: false })
        setEditing(true)
    }

    const cancelEditing = () => {
        setEditing(false)
        setSaveState({ loading: false, msg: '', error: false })
    }

    const handleSave = async (e) => {
        e.preventDefault()
        setSaveState({ loading: true, msg: '', error: false })
        try {
            const updated = await updateMe(editForm)
            setUser(prev => ({ ...prev, ...updated }))
            setEditing(false)
            setSaveState({ loading: false, msg: 'Changes saved.', error: false })
        } catch (err) {
            setSaveState({ loading: false, msg: err.message, error: true })
        }
    }

    return { editing, editForm, setEditForm, saveState, startEditing, cancelEditing, handleSave }
}
