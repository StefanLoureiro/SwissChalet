import { useState } from 'react'
import styled from 'styled-components'

const FaqItem = styled.div`
    border: 1.5px solid #ececec;
    border-radius: 9px;
    overflow: hidden;
    transition: border-color 0.2s;
    &:hover { border-color: rgba(243,14,14,0.25); }
`
const FaqHeader = styled.button`
    width: 100%;
    background: none;
    border: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.2rem;
    cursor: pointer;
    text-align: left;
    gap: 1rem;
`
const FaqQuestion = styled.span`
    font-size: 0.9rem;
    font-weight: 500;
    color: #111;
    line-height: 1.5;
`
const FaqIcon = styled.span`
    color: #f30e0e;
    font-size: 1.3rem;
    font-weight: 300;
    flex-shrink: 0;
    transition: transform 0.3s;
    transform: ${({ $open }) => ($open ? 'rotate(45deg)' : 'rotate(0deg)')};
    display: inline-block;
`
const FaqBody = styled.div`
    max-height: ${({ $open }) => ($open ? '400px' : '0')};
    overflow: hidden;
    transition: max-height 0.35s ease;
`
const FaqAnswer = styled.p`
    font-size: 0.86rem;
    color: #555;
    line-height: 1.78;
    padding: 0 1.2rem 1.1rem;
`

export default function DashFaqEntry({ question, answer }) {
    const [open, setOpen] = useState(false)
    return (
        <FaqItem>
            <FaqHeader onClick={() => setOpen(o => !o)} aria-expanded={open}>
                <FaqQuestion>{question}</FaqQuestion>
                <FaqIcon $open={open}>+</FaqIcon>
            </FaqHeader>
            <FaqBody $open={open}>
                <FaqAnswer>{answer}</FaqAnswer>
            </FaqBody>
        </FaqItem>
    )
}
