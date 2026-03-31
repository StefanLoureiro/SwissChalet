import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useCallback } from 'react'
import HomeBG from '../assets/HomeBG.jpg'
import Mountain from '../assets/Mountain.png'
import LoginModal from '../components/LoginModal'

import Inside1 from '../assets/Challets/Inside1.jpg'
import Inside2 from '../assets/Challets/Inside2.jpg'
import Inside3 from '../assets/Challets/Inside3.jpg'
import Inside4 from '../assets/Challets/Inside4.jpg'
import Inside5 from '../assets/Challets/Inside5.jpg'
import Inside6 from '../assets/Challets/Inside6.jpg'
import Inside7 from '../assets/Challets/Inside7.jpg'
import Inside8 from '../assets/Challets/Inside8.jpg'
import Inside9 from '../assets/Challets/Inside9.jpg'
import Inside10 from '../assets/Challets/Inside10.jpg'
import Inside11 from '../assets/Challets/Inside11.jpg'
import Inside12 from '../assets/Challets/Inside12.jpg'
import Inside13 from '../assets/Challets/Inside13.jpg'
import Inside14 from '../assets/Challets/Inside14.jpg'
import Inside15 from '../assets/Challets/Inside15.jpg'
import Inside16 from '../assets/Challets/Inside16.jpg'
import Inside17 from '../assets/Challets/Inside17.jpg'
import Inside18 from '../assets/Challets/Inside18.jpg'

const GALLERY = [
    Inside1, Inside2, Inside3, Inside4,
    Inside5, Inside6, Inside7, Inside8,
    Inside9, Inside10, Inside11, Inside12,
    Inside13, Inside14, Inside18, Inside15, Inside16, Inside17
]

// ── Navbar ────────────────────────────────────────────────────────────────────

const Navbar = styled.nav`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.4rem 2rem;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    background: ${({ $scrolled }) => ($scrolled ? 'white' : 'transparent')};
    box-shadow: ${({ $scrolled }) => ($scrolled ? '0 2px 12px rgba(0,0,0,0.12)' : 'none')};
    transition: background 0.3s, box-shadow 0.3s;
`

const NavLogo = styled.div`
    display: flex;
    align-items: center;
    gap: 0.6rem;
    cursor: pointer;
`

const NavLogoImage = styled.img`
    height: 3rem;
`

const NavLogoText = styled.span`
    color: ${({ $scrolled }) => ($scrolled ? '#222' : 'white')};
    font-size: 1.4rem;
    font-weight: 600;
    text-shadow: ${({ $scrolled }) => ($scrolled ? 'none' : '0 2px 6px rgba(0,0,0,0.5)')};
    transition: color 0.3s;
`

const NavButtons = styled.div`
    display: flex;
    gap: 2.5rem;
`

const NavButton = styled.button`
    background: none;
    border: none;
    color: ${({ $scrolled }) => ($scrolled ? '#222' : 'white')};
    font-size: 1.1rem;
    cursor: pointer;
    transition: color 0.2s;
    border-bottom: 2px solid ${({ $active }) => ($active ? '#f30e0e' : 'transparent')};
    padding-bottom: 2px;

    &:hover {
        color: #f30e0e;
        border-bottom: 2px solid #292720;
    }
`

// ── Page ──────────────────────────────────────────────────────────────────────

const PageWrapper = styled.div`
    background-image: url(${HomeBG});
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
    min-height: 100vh;
    width: 100%;
`

// ── Hero ──────────────────────────────────────────────────────────────────────

const HeroSection = styled.div`
    height: 100vh;
    display: flex;
    flex-direction: column;
    background: rgba(0, 0, 0, 0.45);
`

const HeroCenter = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 1;
    gap: 1.2rem;
    text-align: center;
    padding: 0 2rem;
`

const HeroTitle = styled.h1`
    color: white;
    font-size: 4.5rem;
    font-weight: 700;
    text-shadow: 0 2px 14px rgba(0, 0, 0, 0.7);
    letter-spacing: 0.04em;
`

const HeroSubtitle = styled.p`
    color: rgba(255, 255, 255, 0.85);
    font-size: 1.25rem;
    max-width: 660px;
    line-height: 1.75;
    text-shadow: 0 1px 6px rgba(0, 0, 0, 0.6);
`

const RedBar = styled.div`
    width: 56px;
    height: 3px;
    background: #f30e0e;
`

// ── Shared sections ───────────────────────────────────────────────────────────

const Section = styled.section`
    background: rgba(0, 0, 0, 0.52);
    backdrop-filter: blur(3px);
    padding: 6rem 4rem;
`

const SectionAlt = styled.section`
    background: rgba(0, 0, 0, 0.38);
    backdrop-filter: blur(3px);
    padding: 6rem 4rem;
`

const CenteredHeader = styled.div`
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    margin-bottom: 3.5rem;
`

const SectionTitle = styled.h2`
    color: white;
    font-size: 2.4rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.7);
`

const SectionText = styled.p`
    color: rgba(255, 255, 255, 0.88);
    font-size: 1.05rem;
    line-height: 1.85;
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
    max-width: 820px;
    text-align: center;
    margin: 0 auto;
`

// ── Feature cards ─────────────────────────────────────────────────────────────

const FeaturesGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
    max-width: 1100px;
    margin: 3rem auto 0;
`

const Feature = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    padding: 2rem;
    background: rgba(255, 255, 255, 0.06);
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: background 0.25s;

    &:hover {
        background: rgba(255, 255, 255, 0.1);
    }
`

const FeatureIcon = styled.span`
    font-size: 2rem;
`

const FeatureTitle = styled.h3`
    color: white;
    font-size: 1.15rem;
    font-weight: 600;
`

const FeatureText = styled.p`
    color: rgba(255, 255, 255, 0.75);
    font-size: 0.95rem;
    line-height: 1.7;
`

// ── Gallery grid ──────────────────────────────────────────────────────────────

const GalleryGrid = styled.div`
    columns: 4;
    column-gap: 12px;
    max-width: 1300px;
    margin: 0 auto;

    @media (max-width: 1100px) { columns: 3; }
    @media (max-width: 760px)  { columns: 2; }
`

const GalleryItem = styled.div`
    break-inside: avoid;
    margin-bottom: 12px;
    overflow: hidden;
    border-radius: 8px;
    cursor: pointer;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.45);
    position: relative;

    &::after {
        content: '';
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0);
        transition: background 0.3s;
        border-radius: 8px;
    }

    &:hover::after {
        background: rgba(0, 0, 0, 0.25);
    }
`

const GalleryImg = styled.img`
    width: 100%;
    display: block;
    transition: transform 0.45s ease;

    ${GalleryItem}:hover & {
        transform: scale(1.04);
    }
`

// ── Lightbox ──────────────────────────────────────────────────────────────────

const LightboxOverlay = styled.div`
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.92);
    z-index: 500;
    display: flex;
    align-items: center;
    justify-content: center;
`

const LightboxContent = styled.div`
    position: relative;
    max-width: 90vw;
    max-height: 90vh;
    display: flex;
    align-items: center;
    gap: 1rem;
`

const LightboxImg = styled.img`
    max-width: 80vw;
    max-height: 85vh;
    object-fit: contain;
    border-radius: 8px;
    box-shadow: 0 16px 64px rgba(0, 0, 0, 0.8);
`

const LightboxArrow = styled.button`
    background: rgba(255, 255, 255, 0.12);
    border: 1px solid rgba(255, 255, 255, 0.25);
    color: white;
    font-size: 1.8rem;
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: background 0.2s;

    &:hover {
        background: rgba(255, 255, 255, 0.25);
    }
`

const LightboxClose = styled.button`
    position: absolute;
    top: -2.8rem;
    right: 0;
    background: none;
    border: none;
    color: white;
    font-size: 2rem;
    cursor: pointer;
    line-height: 1;
    opacity: 0.75;
    transition: opacity 0.2s;

    &:hover {
        opacity: 1;
    }
`

const LightboxCounter = styled.span`
    position: absolute;
    bottom: -2.2rem;
    left: 50%;
    transform: translateX(-50%);
    color: rgba(255, 255, 255, 0.55);
    font-size: 0.9rem;
    white-space: nowrap;
`

// ── Back-to-top ───────────────────────────────────────────────────────────────

const BackToTop = styled.button`
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    z-index: 200;
    background: none;
    color: white;
    border: none;
    font-size: 1.5rem;
    font-weight: 600;
    cursor: pointer;
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.6);
    opacity: ${({ $visible }) => ($visible ? 1 : 0)};
    pointer-events: ${({ $visible }) => ($visible ? 'auto' : 'none')};
    transition: opacity 0.3s, color 0.2s;

    &:hover { color: #f30e0e; }
`

// ── Component ─────────────────────────────────────────────────────────────────

function Chalet() {
    const navigate = useNavigate()
    const [scrolled, setScrolled] = useState(false)
    const [showTop, setShowTop] = useState(false)
    const [lightbox, setLightbox] = useState(null) // index or null
    const [loginOpen, setLoginOpen] = useState(false)

    useEffect(() => {
        const onScroll = () => {
            const y = window.scrollY
            setScrolled(y > 60)
            setShowTop(y > 400)
        }
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    const openLightbox = (i) => setLightbox(i)
    const closeLightbox = () => setLightbox(null)

    const prevImage = useCallback(() => {
        setLightbox(i => (i - 1 + GALLERY.length) % GALLERY.length)
    }, [])

    const nextImage = useCallback(() => {
        setLightbox(i => (i + 1) % GALLERY.length)
    }, [])

    useEffect(() => {
        if (lightbox === null) return
        const onKey = (e) => {
            if (e.key === 'ArrowLeft') prevImage()
            if (e.key === 'ArrowRight') nextImage()
            if (e.key === 'Escape') closeLightbox()
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [lightbox, prevImage, nextImage])

    return (
        <PageWrapper>

            {/* ── Navbar ────────────────────────────────────────────────── */}
            <Navbar $scrolled={scrolled}>
                <NavLogo onClick={() => { navigate('/'); window.scrollTo(0, 0); }}>
                    <NavLogoImage src={Mountain} alt="Mountain" />
                    <NavLogoText $scrolled={scrolled}>The SwissChalet</NavLogoText>
                </NavLogo>
                <NavButtons>
                    <NavButton $scrolled={scrolled} onClick={() => { navigate('/about'); window.scrollTo(0, 0); }}>About</NavButton>
                    <NavButton $scrolled={scrolled} $active onClick={() => { navigate('/chalets'); window.scrollTo(0, 0); }}>Chalets</NavButton>
                    <NavButton $scrolled={scrolled} onClick={() => { navigate('/activities'); window.scrollTo(0, 0); }}>Activities</NavButton>
                    <NavButton $scrolled={scrolled} onClick={() => setLoginOpen(true)}>Login</NavButton>
                </NavButtons>
            </Navbar>

            {/* ── Hero ──────────────────────────────────────────────────── */}
            <HeroSection>
                <HeroCenter>
                    <HeroTitle>Our Chalets</HeroTitle>
                    <RedBar />
                    <HeroSubtitle>
                        Handcrafted Alpine retreats where traditional Swiss architecture meets
                        contemporary luxury. Every corner tells a story of warmth and craftsmanship.
                    </HeroSubtitle>
                </HeroCenter>
            </HeroSection>

            {/* ── Intro ─────────────────────────────────────────────────── */}
            <Section>
                <CenteredHeader>
                    <SectionTitle>Inside Our Retreats</SectionTitle>
                    <RedBar />
                </CenteredHeader>
                <SectionText>
                    Step inside and discover spaces where exposed timber beams meet soft Nordic
                    textiles, where stone fireplaces warm long winter evenings, and where every room
                    opens onto views of the Swiss Alps. Our chalets are designed to feel like home —
                    just with an exceptional mountain backdrop.
                </SectionText>
                <FeaturesGrid>
                    <Feature>
                        <FeatureIcon>🔥</FeatureIcon>
                        <FeatureTitle>Stone Fireplaces</FeatureTitle>
                        <FeatureText>
                            Every chalet features a handbuilt stone fireplace — the centrepiece of
                            cosy Alpine evenings after a day on the slopes.
                        </FeatureText>
                    </Feature>
                    <Feature>
                        <FeatureIcon>🛏️</FeatureIcon>
                        <FeatureTitle>Premium Bedrooms</FeatureTitle>
                        <FeatureText>
                            Luxurious bedding, blackout curtains, and mountain views from every
                            window for the deepest, most restorative sleep.
                        </FeatureText>
                    </Feature>
                    <Feature>
                        <FeatureIcon>🍽️</FeatureIcon>
                        <FeatureTitle>Fully Equipped Kitchens</FeatureTitle>
                        <FeatureText>
                            From hearty breakfasts to gourmet dinners — our kitchens are stocked
                            and ready, or our private chef service is just a call away.
                        </FeatureText>
                    </Feature>
                    <Feature>
                        <FeatureIcon>🛁</FeatureIcon>
                        <FeatureTitle>Spa Bathrooms</FeatureTitle>
                        <FeatureText>
                            Rain showers, freestanding baths, and heated floors turn every morning
                            into a spa ritual high in the mountains.
                        </FeatureText>
                    </Feature>
                    <Feature>
                        <FeatureIcon>🪵</FeatureIcon>
                        <FeatureTitle>Timber & Stone Interiors</FeatureTitle>
                        <FeatureText>
                            Traditional Alpine craftsmanship — reclaimed wood, local stone, and
                            handwoven textiles create an atmosphere of authentic warmth.
                        </FeatureText>
                    </Feature>
                    <Feature>
                        <FeatureIcon>📶</FeatureIcon>
                        <FeatureTitle>Modern Amenities</FeatureTitle>
                        <FeatureText>
                            High-speed Wi-Fi, smart TVs, and climate control — because mountain
                            living should never mean sacrificing modern comfort.
                        </FeatureText>
                    </Feature>
                </FeaturesGrid>
            </Section>

            {/* ── Gallery ───────────────────────────────────────────────── */}
            <SectionAlt>
                <CenteredHeader>
                    <SectionTitle>Interior Gallery</SectionTitle>
                    <RedBar />
                    <SectionText style={{ marginTop: '0.5rem' }}>
                        Click any photo to explore in full detail.
                    </SectionText>
                </CenteredHeader>
                <GalleryGrid>
                    {GALLERY.map((src, i) => (
                        <GalleryItem key={i} onClick={() => openLightbox(i)}>
                            <GalleryImg src={src} alt={`Chalet interior ${i + 1}`} />
                        </GalleryItem>
                    ))}
                </GalleryGrid>
            </SectionAlt>

            {/* ── Lightbox ──────────────────────────────────────────────── */}
            {lightbox !== null && (
                <LightboxOverlay onClick={closeLightbox}>
                    <LightboxContent onClick={(e) => e.stopPropagation()}>
                        <LightboxClose onClick={closeLightbox}>✕</LightboxClose>
                        <LightboxArrow onClick={prevImage}>‹</LightboxArrow>
                        <LightboxImg src={GALLERY[lightbox]} alt={`Chalet interior ${lightbox + 1}`} />
                        <LightboxArrow onClick={nextImage}>›</LightboxArrow>
                        <LightboxCounter>{lightbox + 1} / {GALLERY.length}</LightboxCounter>
                    </LightboxContent>
                </LightboxOverlay>
            )}

            {/* ── Back to top ───────────────────────────────────────────── */}
            <BackToTop $visible={showTop} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                ↑ Top
            </BackToTop>
            {loginOpen && <LoginModal onClose={() => setLoginOpen(false)} />}
        </PageWrapper>
    )
}

export default Chalet
