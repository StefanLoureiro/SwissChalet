import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import HomeBG from '../assets/HomeBG.jpg'
import Mountain from '../assets/Mountain.png'
import LoginModal from '../components/LoginModal'

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
    height: 60vh;
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
    max-width: 620px;
    line-height: 1.75;
    text-shadow: 0 1px 6px rgba(0, 0, 0, 0.6);
`

const RedBar = styled.div`
    width: 56px;
    height: 3px;
    background: #f30e0e;
`

// ── FAQ Section ───────────────────────────────────────────────────────────────

const FaqsSection = styled.section`
    background: rgba(0, 0, 0, 0.52);
    backdrop-filter: blur(3px);
    padding: 6rem 4rem;
`

const FaqsInner = styled.div`
    max-width: 860px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 3.5rem;
`

const CenteredHeader = styled.div`
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
`

const SectionTitle = styled.h2`
    color: white;
    font-size: 2.4rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.7);
`

const CategoryTitle = styled.h3`
    color: white;
    font-size: 1.3rem;
    font-weight: 600;
    letter-spacing: 0.04em;
    margin-bottom: 1rem;
    padding-left: 0.2rem;
    border-left: 3px solid #f30e0e;
    padding-left: 0.75rem;
`

const CategoryGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
`

const AccordionItem = styled.div`
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 10px;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.04);
    transition: background 0.2s;

    &:hover {
        background: rgba(255, 255, 255, 0.07);
    }
`

const AccordionHeader = styled.button`
    width: 100%;
    background: none;
    border: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.2rem 1.5rem;
    cursor: pointer;
    text-align: left;
    gap: 1rem;
`

const AccordionQuestion = styled.span`
    color: white;
    font-size: 1rem;
    font-weight: 500;
    line-height: 1.5;
`

const AccordionIcon = styled.span`
    color: #f30e0e;
    font-size: 1.4rem;
    font-weight: 300;
    flex-shrink: 0;
    transition: transform 0.3s;
    transform: ${({ $open }) => ($open ? 'rotate(45deg)' : 'rotate(0deg)')};
`

const AccordionBody = styled.div`
    max-height: ${({ $open }) => ($open ? '400px' : '0')};
    overflow: hidden;
    transition: max-height 0.35s ease;
`

const AccordionAnswer = styled.p`
    color: rgba(255, 255, 255, 0.75);
    font-size: 0.97rem;
    line-height: 1.8;
    padding: 0 1.5rem 1.4rem;
`

// ── Back to top ───────────────────────────────────────────────────────────────

const BackToTopButton = styled.button`
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    z-index: 200;
    background: none;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    font-size: 1.5rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    cursor: pointer;
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.6);
    opacity: ${({ $visible }) => ($visible ? 1 : 0)};
    pointer-events: ${({ $visible }) => ($visible ? 'auto' : 'none')};
    transition: opacity 0.3s, color 0.2s;

    &:hover {
        color: #f30e0e;
    }
`

// ── Data ──────────────────────────────────────────────────────────────────────

const FAQ_CATEGORIES = [
    {
        category: 'Bookings & Reservations',
        items: [
            {
                q: 'How do I make a booking?',
                a: 'You can book directly through our website by selecting your desired chalet, choosing your dates, and completing the secure checkout process. Our team will confirm your reservation within 24 hours.',
            },
            {
                q: 'Can I modify or cancel my reservation?',
                a: 'Yes. Modifications are free of charge up to 30 days before check-in. Cancellations made more than 30 days in advance receive a full refund. Cancellations within 30 days are subject to our standard cancellation policy detailed in your booking confirmation.',
            },
            {
                q: 'Is a deposit required to secure my booking?',
                a: 'A 30% deposit is required at the time of booking to secure your reservation. The remaining balance is due 30 days before your arrival date.',
            },
            {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit cards (Visa, Mastercard, American Express), bank transfers, and PayPal. All transactions are processed securely through our encrypted payment gateway.',
            },
        ],
    },
    {
        category: 'Check-in & Check-out',
        items: [
            {
                q: 'What are the standard check-in and check-out times?',
                a: 'Standard check-in is from 15:00 and check-out is by 11:00. Early check-in or late check-out may be arranged subject to availability — please contact us in advance.',
            },
            {
                q: 'How do I receive the keys to my chalet?',
                a: 'Our local property manager will greet you upon arrival and hand over the keys in person, providing a full orientation of the property. If your arrival is outside of their availability, a secure key-box arrangement will be arranged and details sent in advance.',
            },
            {
                q: 'Is there a security deposit?',
                a: 'Yes, a refundable security deposit is held against a valid credit card at check-in. The full amount is released within 7 days of check-out, provided no damages are reported.',
            },
        ],
    },
    {
        category: 'Chalets & Amenities',
        items: [
            {
                q: 'What is included in each chalet?',
                a: 'All chalets come fully equipped with bed linen, towels, a fully stocked kitchen, Wi-Fi, and heating. Many properties also feature a fireplace, hot tub, ski storage, and panoramic terrace. Specific amenities are listed on each chalet\'s detail page.',
            },
            {
                q: 'Are pets allowed?',
                a: 'Pet policies vary by property. Chalets that accept pets are clearly labelled. Please inform us at the time of booking if you are bringing a pet so we can confirm suitability and any applicable charges.',
            },
            {
                q: 'Do you offer catering or private chef services?',
                a: 'Yes. We partner with a network of professional Alpine chefs who can provide everything from a welcome hamper and daily breakfast to full-board dining experiences. This service can be added during the booking process or arranged afterwards through our concierge team.',
            },
        ],
    },
    {
        category: 'Activities & Experiences',
        items: [
            {
                q: 'Can you arrange ski passes and equipment rental?',
                a: 'Absolutely. Our concierge team can pre-book ski passes, arrange equipment rental with delivery to your chalet, and organise ski lessons with certified instructors — all before your arrival.',
            },
            {
                q: 'Are activities available in summer as well?',
                a: 'Yes! Our Alps come alive in summer with guided hikes, mountain biking, paragliding, via ferrata climbing, wild swimming, and wellness retreats. We curate seasonal activity packages tailored to your interests.',
            },
            {
                q: 'Do you offer airport transfers?',
                a: 'We offer private airport transfer services from Zurich, Geneva, and Basel airports to all our properties. Details can be added when completing your booking or requested via our concierge at any time.',
            },
        ],
    },
    {
        category: 'Support',
        items: [
            {
                q: 'What happens if something goes wrong during my stay?',
                a: 'Our support team is available 24/7. Each reservation includes an emergency contact number for your local property manager. Issues are treated as a priority, and we commit to resolving all maintenance matters within hours of being reported.',
            },
            {
                q: 'How can I contact your team?',
                a: 'You can reach us by email at support@swisschalets.com or by phone at +41 44 123 45 67. Our team is available Monday to Sunday, 08:00–20:00 CET, with emergency out-of-hours support for active guests.',
            },
        ],
    },
]

// ── Component ─────────────────────────────────────────────────────────────────

function AccordionEntry({ question, answer }) {
    const [open, setOpen] = useState(false)
    return (
        <AccordionItem>
            <AccordionHeader onClick={() => setOpen(o => !o)} aria-expanded={open}>
                <AccordionQuestion>{question}</AccordionQuestion>
                <AccordionIcon $open={open}>+</AccordionIcon>
            </AccordionHeader>
            <AccordionBody $open={open}>
                <AccordionAnswer>{answer}</AccordionAnswer>
            </AccordionBody>
        </AccordionItem>
    )
}

function Faqs() {
    const navigate = useNavigate()
    const [scrolled, setScrolled] = useState(false)
    const [loginOpen, setLoginOpen] = useState(false)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 60)
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

    return (
        <>
            <PageWrapper>
                <Navbar $scrolled={scrolled}>
                    <NavLogo onClick={() => { navigate('/'); window.scrollTo(0, 0) }}>
                        <NavLogoImage src={Mountain} alt="Mountain" />
                        <NavLogoText $scrolled={scrolled}>The SwissChalet</NavLogoText>
                    </NavLogo>
                    <NavButtons>
                        <NavButton $scrolled={scrolled} onClick={() => navigate('/about')}>About</NavButton>
                        <NavButton $scrolled={scrolled} onClick={() => navigate('/chalets')}>Chalets</NavButton>
                        <NavButton $scrolled={scrolled} onClick={() => navigate('/activities')}>Activities</NavButton>
                        <NavButton $scrolled={scrolled} onClick={() => setLoginOpen(true)}>Login</NavButton>
                    </NavButtons>
                </Navbar>

                {/* ── Hero ─────────────────────────────────────────────────── */}
                <HeroSection>
                    <HeroCenter>
                        <HeroTitle>FAQs</HeroTitle>
                        <RedBar />
                        <HeroSubtitle>
                            Everything you need to know about booking, staying, and exploring
                            with The SwissChalet.
                        </HeroSubtitle>
                    </HeroCenter>
                </HeroSection>

                {/* ── Accordion ─────────────────────────────────────────────── */}
                <FaqsSection>
                    <FaqsInner>
                        <CenteredHeader>
                            <SectionTitle>Frequently Asked Questions</SectionTitle>
                            <RedBar />
                        </CenteredHeader>

                        {FAQ_CATEGORIES.map(({ category, items }) => (
                            <CategoryGroup key={category}>
                                <CategoryTitle>{category}</CategoryTitle>
                                {items.map(({ q, a }) => (
                                    <AccordionEntry key={q} question={q} answer={a} />
                                ))}
                            </CategoryGroup>
                        ))}
                    </FaqsInner>
                </FaqsSection>
            </PageWrapper>

            <BackToTopButton $visible={scrolled} onClick={scrollToTop}>↑ Top</BackToTopButton>
            {loginOpen && <LoginModal onClose={() => setLoginOpen(false)} />}
        </>
    )
}

export default Faqs
