import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'
import { login, register } from '../services/auth'

const fadeIn = keyframes`
    from { opacity: 0; }
    to   { opacity: 1; }
`

const slideUp = keyframes`
    from { transform: translateY(40px); opacity: 0; }
    to   { transform: translateY(0);    opacity: 1; }
`

const Overlay = styled.div`
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: ${fadeIn} 0.2s ease;
`

const Modal = styled.div`
    background: rgba(255, 255, 255, 0.97);
    border-radius: 14px;
    padding: 2.8rem 2.6rem 2.4rem;
    width: 100%;
    max-width: 420px;
    box-shadow: 0 24px 64px rgba(0, 0, 0, 0.35);
    animation: ${slideUp} 0.25s ease;
    position: relative;
`

const CloseButton = styled.button`
    position: absolute;
    top: 1rem;
    right: 1.2rem;
    background: none;
    border: none;
    font-size: 1.4rem;
    color: #888;
    cursor: pointer;
    line-height: 1;
    transition: color 0.2s;

    &:hover {
        color: #f30e0e;
    }
`

const ModalTitle = styled.h2`
    font-size: 1.7rem;
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 0.4rem;
    letter-spacing: 0.02em;
`

const ModalSubtitle = styled.p`
    font-size: 0.92rem;
    color: #666;
    margin-bottom: 1.8rem;
`

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1.1rem;
`

const Field = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
`

const Label = styled.label`
    font-size: 0.85rem;
    font-weight: 600;
    color: #333;
    letter-spacing: 0.03em;
    text-transform: uppercase;
`

const Input = styled.input`
    padding: 0.72rem 0.95rem;
    border: 1.5px solid #ddd;
    border-radius: 8px;
    font-size: 0.97rem;
    color: #1a1a1a;
    background: #fafafa;
    outline: none;
    transition: border-color 0.2s;

    &:focus {
        border-color: #f30e0e;
        background: #fff;
    }
`

const ErrorText = styled.p`
    font-size: 0.82rem;
    color: #f30e0e;
    margin-top: 0.1rem;
`

const SubmitButton = styled.button`
    margin-top: 0.4rem;
    padding: 0.82rem;
    background: #f30e0e;
    color: white;
    font-size: 1rem;
    font-weight: 600;
    letter-spacing: 0.04em;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.2s;

    &:hover {
        background: #c90a0a;
    }

    &:disabled {
        background: #f8a0a0;
        cursor: not-allowed;
    }
`

const Divider = styled.div`
    text-align: center;
    color: #aaa;
    font-size: 0.85rem;
    margin: 0.3rem 0;
`

const SwitchText = styled.p`
    text-align: center;
    font-size: 0.88rem;
    color: #555;
    margin-top: 0.5rem;

    span {
        color: #f30e0e;
        font-weight: 600;
        cursor: pointer;

        &:hover {
            text-decoration: underline;
        }
    }
`

function LoginModal({ onClose }) {
    const navigate = useNavigate()
    const [mode, setMode] = useState('login') // 'login' | 'register'
    const [form, setForm] = useState({ username: '', email: '', password: '', name: '', confirm: '' })
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
        setErrors(prev => ({ ...prev, [e.target.name]: '' }))
    }

    const validate = () => {
        const errs = {}
        if (!form.username.trim()) errs.username = 'Username is required.'
        if (mode === 'register') {
            if (!form.name.trim()) errs.name = 'Full name is required.'
            if (!form.email.trim()) errs.email = 'Email is required.'
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email.'
            if (form.confirm !== form.password) errs.confirm = 'Passwords do not match.'
        }
        if (!form.password) errs.password = 'Password is required.'
        else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters.'
        return errs
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const errs = validate()
        if (Object.keys(errs).length) { setErrors(errs); return }
        setLoading(true)
        try {
            if (mode === 'login') {
                await login(form.username, form.password)
                onClose()
                navigate('/dashboard')
            } else {
                await register(form.name, form.username, form.email, form.password)
                onClose()
            }
        } catch (err) {
            setErrors(prev => ({ ...prev, api: err.message }))
        } finally {
            setLoading(false)
        }
    }

    const switchMode = () => {
        setMode(m => (m === 'login' ? 'register' : 'login'))
        setForm({ username: '', email: '', password: '', name: '', confirm: '' })
        setErrors({})
    }

    return (
        <Overlay onClick={onClose}>
            <Modal onClick={e => e.stopPropagation()}>
                <CloseButton onClick={onClose} aria-label="Close">&#x2715;</CloseButton>
                <ModalTitle>{mode === 'login' ? 'Welcome back' : 'Create account'}</ModalTitle>
                <ModalSubtitle>
                    {mode === 'login'
                        ? 'Sign in to manage your bookings.'
                        : 'Join The SwissChalet and start exploring.'}
                </ModalSubtitle>

                <Form onSubmit={handleSubmit} noValidate>
                    {mode === 'register' && (
                        <Field>
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="John Doe"
                                value={form.name}
                                onChange={handleChange}
                                autoComplete="name"
                            />
                            {errors.name && <ErrorText>{errors.name}</ErrorText>}
                        </Field>
                    )}

                    <Field>
                        <Label htmlFor="username">Username</Label>
                        <Input
                            id="username"
                            name="username"
                            type="text"
                            placeholder="johndoe"
                            value={form.username}
                            onChange={handleChange}
                            autoComplete="username"
                        />
                        {errors.username && <ErrorText>{errors.username}</ErrorText>}
                    </Field>

                    {mode === 'register' && (
                        <Field>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="you@example.com"
                                value={form.email}
                                onChange={handleChange}
                                autoComplete="email"
                            />
                            {errors.email && <ErrorText>{errors.email}</ErrorText>}
                        </Field>
                    )}

                    <Field>
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            value={form.password}
                            onChange={handleChange}
                            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                        />
                        {errors.password && <ErrorText>{errors.password}</ErrorText>}
                    </Field>

                    {mode === 'register' && (
                        <Field>
                            <Label htmlFor="confirm">Confirm Password</Label>
                            <Input
                                id="confirm"
                                name="confirm"
                                type="password"
                                placeholder="••••••••"
                                value={form.confirm}
                                onChange={handleChange}
                                autoComplete="new-password"
                            />
                            {errors.confirm && <ErrorText>{errors.confirm}</ErrorText>}
                        </Field>
                    )}

                    {errors.api && <ErrorText style={{ textAlign: 'center' }}>{errors.api}</ErrorText>}
                    <SubmitButton type="submit" disabled={loading}>
                        {loading ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Create Account'}
                    </SubmitButton>
                </Form>

                <Divider style={{ marginTop: '1.2rem' }}>or</Divider>

                <SwitchText>
                    {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                    <span onClick={switchMode}>
                        {mode === 'login' ? 'Register' : 'Sign In'}
                    </span>
                </SwitchText>
            </Modal>
        </Overlay>
    )
}

export default LoginModal
