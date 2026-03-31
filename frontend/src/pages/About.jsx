import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import HomeBG from '../assets/HomeBG.jpg'
import Mountain from '../assets/Mountain.png'
import LoginModal from '../components/LoginModal'
import G2 from '../assets/ChalletGallery/G2.jpg'
import G3 from '../assets/ChalletGallery/G3.jpg'
import G4 from '../assets/ChalletGallery/G4.jpg'
import G5 from '../assets/ChalletGallery/G5.jpg'
import G6 from '../assets/ChalletGallery/G6.jpg'
import Ski1 from '../assets/Activities/Ski1.jpg'
import Hikking1 from '../assets/Activities/Hikking1.jpg'

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
    background: rgba(0, 0, 0, 0.35);
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

// ── Shared section primitives ─────────────────────────────────────────────────

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
`

const CenteredHeader = styled.div`
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    margin-bottom: 3.5rem;
`

// ── Who We Are ────────────────────────────────────────────────────────────────

const TwoCol = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 4rem;
    max-width: 1100px;
    margin: 0 auto;
`

const TextBlock = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
`

const SideImage = styled.img`
    flex: 1;
    max-width: 480px;
    width: 100%;
    height: 360px;
    object-fit: cover;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.55);
`

// ── What We Offer ─────────────────────────────────────────────────────────────

const CardsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
    max-width: 1100px;
    margin: 0 auto;
`

const Card = styled.div`
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
`

const CardImage = styled.img`
    width: 100%;
    height: 200px;
    object-fit: cover;
    display: block;
`

const CardBody = styled.div`
    padding: 1.4rem;
    background: rgba(10, 10, 10, 0.92);
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
`

const CardTitle = styled.h3`
    color: white;
    font-size: 1.2rem;
    font-weight: 600;
`

const CardText = styled.p`
    color: rgba(255, 255, 255, 0.75);
    font-size: 0.95rem;
    line-height: 1.7;
`

// ── Why Choose Us ─────────────────────────────────────────────────────────────

const FeaturesGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
    max-width: 1100px;
    margin: 0 auto;
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

// ── Image Strip ───────────────────────────────────────────────────────────────

const ImageStrip = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    height: 320px;
`

const StripImgWrapper = styled.div`
    overflow: hidden;
`

const StripImg = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.5s;

    &:hover {
        transform: scale(1.06);
    }
`

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

// ── Component ─────────────────────────────────────────────────────────────────

function About() {
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
                    <NavLogo onClick={() => { navigate('/'); window.scrollTo(0, 0); }}>
                        <NavLogoImage src={Mountain} alt="Mountain" />
                        <NavLogoText $scrolled={scrolled}>The SwissChalet</NavLogoText>
                    </NavLogo>
                    <NavButtons>
                        <NavButton $scrolled={scrolled} $active onClick={() => { navigate('/about'); window.scrollTo(0, 0); }}>About</NavButton>
                        <NavButton $scrolled={scrolled} onClick={() => { navigate('/chalets'); window.scrollTo(0, 0); }}>Chalets</NavButton>
                        <NavButton $scrolled={scrolled} onClick={() => { navigate('/activities'); window.scrollTo(0, 0); }}>Activities</NavButton>
                        <NavButton $scrolled={scrolled} onClick={() => setLoginOpen(true)}>Login</NavButton>
                    </NavButtons>
                </Navbar>

                {/* ── Hero ─────────────────────────────────────────────────── */}
                <HeroSection>
                    <HeroCenter>
                        <HeroTitle>About Us</HeroTitle>
                        <RedBar />
                        <HeroSubtitle>
                            Discover the story behind The SwissChalet — a commitment to Alpine
                            authenticity, luxury comfort, and unforgettable mountain experiences.
                        </HeroSubtitle>
                    </HeroCenter>
                </HeroSection>

                {/* ── Who We Are ───────────────────────────────────────────── */}
                <Section>
                    <TwoCol>
                        <TextBlock>
                            <SectionTitle>Who We Are</SectionTitle>
                            <RedBar />
                            <SectionText>
                                Founded in the heart of Switzerland, The SwissChalet was born from a
                                passion for the mountains and a desire to share their magic with the
                                world. We are a family-run company with deep roots in Alpine culture,
                                dedicated to offering guests an authentic and enriching stay in some of
                                Switzerland's most stunning locations.
                            </SectionText>
                            <SectionText>
                                From our first chalet perched above the Bernese Oberland to our growing
                                collection of properties across the Swiss Alps, every retreat we manage
                                carries the same soul — warmth, craftsmanship, and a genuine connection
                                to the landscape that surrounds it.
                            </SectionText>
                        </TextBlock>
                        <SideImage src={G2} alt="Our chalet interior" />
                    </TwoCol>
                </Section>

                {/* ── What We Offer ─────────────────────────────────────────── */}
                <SectionAlt>
                    <CenteredHeader>
                        <SectionTitle>What We Offer</SectionTitle>
                        <RedBar />
                    </CenteredHeader>
                    <CardsGrid>
                        <Card>
                            <CardImage src={G3} alt="Luxury Chalets" />
                            <CardBody>
                                <CardTitle>Luxury Chalets</CardTitle>
                                <CardText>
                                    Handpicked properties blending traditional Alpine architecture with
                                    modern comforts — fireplaces, panoramic terraces, and all the warmth
                                    of a mountain home.
                                </CardText>
                            </CardBody>
                        </Card>
                        <Card>
                            <CardImage src={Ski1} alt="Mountain Activities" />
                            <CardBody>
                                <CardTitle>Mountain Activities</CardTitle>
                                <CardText>
                                    Skiing, snowboarding, hiking, paragliding and more. Our curated
                                    experiences let you explore the Alps at your own pace, every season
                                    of the year.
                                </CardText>
                            </CardBody>
                        </Card>
                        <Card>
                            <CardImage src={G4} alt="Personalised Hospitality" />
                            <CardBody>
                                <CardTitle>Personalised Hospitality</CardTitle>
                                <CardText>
                                    From airport transfers to private chefs and guided tours, our
                                    concierge team ensures every detail of your stay is taken care of.
                                </CardText>
                            </CardBody>
                        </Card>
                    </CardsGrid>
                </SectionAlt>

                {/* ── Why Choose Us ─────────────────────────────────────────── */}
                <Section>
                    <CenteredHeader>
                        <SectionTitle>Why Choose Us</SectionTitle>
                        <RedBar />
                    </CenteredHeader>
                    <FeaturesGrid>
                        <Feature>
                            <FeatureIcon>🏔️</FeatureIcon>
                            <FeatureTitle>Unbeatable Locations</FeatureTitle>
                            <FeatureText>
                                All our chalets sit in prime Alpine spots, within minutes of ski lifts,
                                hiking trails, and charming Swiss villages.
                            </FeatureText>
                        </Feature>
                        <Feature>
                            <FeatureIcon>⭐</FeatureIcon>
                            <FeatureTitle>Swiss Quality Standards</FeatureTitle>
                            <FeatureText>
                                Every property is personally inspected and maintained by our team to
                                uphold the highest standards of quality and cleanliness.
                            </FeatureText>
                        </Feature>
                        <Feature>
                            <FeatureIcon>🤝</FeatureIcon>
                            <FeatureTitle>Dedicated 24/7 Support</FeatureTitle>
                            <FeatureText>
                                Our support team is always a call away — whether you need local
                                recommendations, emergency assistance, or last-minute arrangements.
                            </FeatureText>
                        </Feature>
                        <Feature>
                            <FeatureIcon>🌿</FeatureIcon>
                            <FeatureTitle>Sustainable Tourism</FeatureTitle>
                            <FeatureText>
                                We partner with local craftsmen and support conservation initiatives to
                                protect the Alpine ecosystem for future generations.
                            </FeatureText>
                        </Feature>
                        <Feature>
                            <FeatureIcon>❄️</FeatureIcon>
                            <FeatureTitle>Year-Round Experiences</FeatureTitle>
                            <FeatureText>
                                Winter skiing, spring wildflower walks, summer mountain biking, autumn
                                foliage hikes — spectacular in every season.
                            </FeatureText>
                        </Feature>
                        <Feature>
                            <FeatureIcon>🏠</FeatureIcon>
                            <FeatureTitle>Feel At Home</FeatureTitle>
                            <FeatureText>
                                More than a rental — our chalets are curated homes where you can cook,
                                relax, and truly live the Alpine lifestyle as a local would.
                            </FeatureText>
                        </Feature>
                    </FeaturesGrid>
                </Section>

                {/* ── Image Strip ───────────────────────────────────────────── */}
                <ImageStrip>
                    <StripImgWrapper><StripImg src={G5} alt="Swiss Alps" /></StripImgWrapper>
                    <StripImgWrapper><StripImg src={Hikking1} alt="Hiking" /></StripImgWrapper>
                    <StripImgWrapper><StripImg src={G6} alt="Chalet view" /></StripImgWrapper>
                </ImageStrip>
            </PageWrapper>
            <BackToTopButton $visible={scrolled} onClick={scrollToTop}>↑ Top</BackToTopButton>
            {loginOpen && <LoginModal onClose={() => setLoginOpen(false)} />}
        </>
    )
}

export default About
