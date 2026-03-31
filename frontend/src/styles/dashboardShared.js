import styled from 'styled-components'

// Shared across multiple dashboard tab views

export const PageHeading = styled.h1`
    font-size: 1.4rem;
    font-weight: 700;
    color: #111;
    letter-spacing: -0.02em;
    margin-bottom: 1.4rem;
`

export const EmptyState = styled.div`
    background: white;
    border-radius: 12px;
    padding: 3rem 2rem;
    text-align: center;
    color: #bbb;
    font-size: 0.92rem;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
`

export const ActRedBar = styled.div`
    width: 40px;
    height: 3px;
    background: #f30e0e;
    margin: 0.6rem 0;
`

// Hero inner elements reused across Activities, About, FAQs, Contacts
export const ActHeroBg = styled.img`
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.28;
    border-radius: 14px;
`
export const ActHeroContent = styled.div`
    position: relative;
    z-index: 1;
`
export const ActHeroTitle = styled.h1`
    font-size: 2rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    margin-bottom: 0.4rem;
`
export const ActHeroSub = styled.p`
    color: rgba(255,255,255,0.65);
    font-size: 0.95rem;
    max-width: 560px;
    line-height: 1.6;
`

// About-style hero wrapper — also used for FAQs
export const AboutHero = styled.div`
    background: linear-gradient(135deg, #141414 0%, #2b1a0d 100%);
    border-radius: 14px;
    padding: 2.5rem 2.5rem;
    color: white;
    margin-bottom: 2rem;
    box-shadow: 0 4px 18px rgba(0,0,0,0.14);
    position: relative;
    overflow: hidden;
`
