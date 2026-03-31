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
    background: rgba(0, 0, 0, 0.48);
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

// ── Sections ──────────────────────────────────────────────────────────────────

const Section = styled.section`
    background: rgba(0, 0, 0, 0.52);
    backdrop-filter: blur(3px);
    padding: 5rem 4rem;
`

const SectionAlt = styled.section`
    background: rgba(0, 0, 0, 0.38);
    backdrop-filter: blur(3px);
    padding: 5rem 4rem;
`

const SectionInner = styled.div`
    max-width: 860px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 1.4rem;
`

const SectionTitle = styled.h2`
    color: white;
    font-size: 2rem;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.7);
`

const SectionText = styled.p`
    color: rgba(255, 255, 255, 0.85);
    font-size: 1rem;
    line-height: 1.9;
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
`

const SubTitle = styled.h3`
    color: white;
    font-size: 1.2rem;
    font-weight: 600;
    margin-top: 0.6rem;
    text-shadow: 0 1px 6px rgba(0, 0, 0, 0.5);
`

const PolicyList = styled.ul`
    color: rgba(255, 255, 255, 0.85);
    font-size: 1rem;
    line-height: 1.9;
    padding-left: 1.6rem;
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);

    li {
        margin-bottom: 0.45rem;
    }
`

// ── Table of Contents ──────────────────────────────────────────────────────────

const TocSection = styled.section`
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    padding: 2.5rem 4rem;
`

const TocInner = styled.div`
    max-width: 860px;
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;
    gap: 0.8rem 2.4rem;
`

const TocLink = styled.a`
    color: rgba(255, 255, 255, 0.75);
    font-size: 0.95rem;
    text-decoration: none;
    cursor: pointer;
    transition: color 0.2s;

    &:hover {
        color: #f30e0e;
    }
`

// ── Back to Top ───────────────────────────────────────────────────────────────

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

function Terms() {
    const navigate = useNavigate()
    const [scrolled, setScrolled] = useState(false)
    const [showTop, setShowTop] = useState(false)
    const [loginOpen, setLoginOpen] = useState(false)

    useEffect(() => {
        const onScroll = () => {
            setScrolled(window.scrollY > 60)
            setShowTop(window.scrollY > 400)
        }
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
                        <NavButton $scrolled={scrolled} onClick={() => { navigate('/about'); window.scrollTo(0, 0); }}>About</NavButton>
                        <NavButton $scrolled={scrolled} onClick={() => { navigate('/chalets'); window.scrollTo(0, 0); }}>Chalets</NavButton>
                        <NavButton $scrolled={scrolled} onClick={() => { navigate('/activities'); window.scrollTo(0, 0); }}>Activities</NavButton>
                        <NavButton $scrolled={scrolled} onClick={() => setLoginOpen(true)}>Login</NavButton>
                    </NavButtons>
                </Navbar>

                {/* ── Hero ─────────────────────────────────────────────────── */}
                <HeroSection>
                    <HeroCenter>
                        <HeroTitle>Terms &amp; Policies</HeroTitle>
                        <RedBar />
                        <HeroSubtitle>
                            Please read these terms carefully before using our services.
                            Last updated: March 26, 2026.
                        </HeroSubtitle>
                    </HeroCenter>
                </HeroSection>

                {/* ── Table of Contents ─────────────────────────────────────── */}
                <TocSection>
                    <TocInner>
                        <TocLink href="#terms-of-service">Terms of Service</TocLink>
                        <TocLink href="#privacy-policy">Privacy Policy</TocLink>
                        <TocLink href="#booking-policy">Booking Policy</TocLink>
                        <TocLink href="#cancellation-policy">Cancellation &amp; Refunds</TocLink>
                        <TocLink href="#cookie-policy">Cookie Policy</TocLink>
                    </TocInner>
                </TocSection>

                {/* ── Terms of Service ──────────────────────────────────────── */}
                <Section id="terms-of-service">
                    <SectionInner>
                        <SectionTitle>Terms of Service</SectionTitle>
                        <RedBar />
                        <SectionText>
                            By accessing or using The SwissChalet website and booking services, you
                            agree to be bound by these Terms of Service. If you do not agree with
                            any part of these terms, you may not use our services.
                        </SectionText>
                        <SubTitle>1. Use of Services</SubTitle>
                        <SectionText>
                            Our services are intended for individuals who are at least 18 years of
                            age. By using this platform you represent that you are of legal age
                            and have the legal capacity to enter into a binding agreement. You agree
                            to use our services solely for lawful purposes and in accordance with
                            these terms.
                        </SectionText>
                        <SubTitle>2. Intellectual Property</SubTitle>
                        <SectionText>
                            All content on this website — including text, photographs, graphics,
                            logos, and software — is the property of The SwissChalet or its content
                            suppliers and is protected by applicable intellectual property laws.
                            Reproduction, distribution, or commercial use without prior written
                            consent is strictly prohibited.
                        </SectionText>
                        <SubTitle>3. Limitation of Liability</SubTitle>
                        <SectionText>
                            The SwissChalet shall not be liable for any indirect, incidental,
                            special, or consequential damages arising from your use of our services
                            or your inability to access them. Our liability is limited to the maximum
                            extent permitted by applicable law.
                        </SectionText>
                        <SubTitle>4. Governing Law</SubTitle>
                        <SectionText>
                            These terms are governed by Swiss law. Any disputes arising from these
                            terms shall be subject to the exclusive jurisdiction of the courts of
                            Switzerland.
                        </SectionText>
                    </SectionInner>
                </Section>

                {/* ── Privacy Policy ────────────────────────────────────────── */}
                <SectionAlt id="privacy-policy">
                    <SectionInner>
                        <SectionTitle>Privacy Policy</SectionTitle>
                        <RedBar />
                        <SectionText>
                            Your privacy matters to us. This policy explains what personal data we
                            collect, how we use it, and your rights under the Swiss Federal Act on
                            Data Protection (FADP) and the EU General Data Protection Regulation
                            (GDPR) where applicable.
                        </SectionText>
                        <SubTitle>Data We Collect</SubTitle>
                        <PolicyList>
                            <li>Identification data: name, email address, phone number.</li>
                            <li>Booking details: dates, chalet preferences, number of guests.</li>
                            <li>Payment information: processed securely through our payment provider — we do not store card details.</li>
                            <li>Usage data: pages visited, browser type, IP address, and referral source.</li>
                            <li>Communications: emails, messages, and feedback you send us.</li>
                        </PolicyList>
                        <SubTitle>How We Use Your Data</SubTitle>
                        <PolicyList>
                            <li>To process and manage your bookings.</li>
                            <li>To send booking confirmations, reminders, and updates.</li>
                            <li>To personalise your experience and improve our services.</li>
                            <li>To comply with legal and regulatory obligations.</li>
                            <li>To send marketing communications, only with your explicit consent.</li>
                        </PolicyList>
                        <SubTitle>Data Retention &amp; Security</SubTitle>
                        <SectionText>
                            We retain your personal data only for as long as necessary to fulfil
                            the purposes outlined in this policy or as required by law. We employ
                            industry-standard security measures including encryption, secure server
                            infrastructure, and access controls to protect your information.
                        </SectionText>
                        <SubTitle>Your Rights</SubTitle>
                        <SectionText>
                            You have the right to access, correct, or delete your personal data at
                            any time. To exercise your rights, please contact us at
                            privacy@swisschalet.com.
                        </SectionText>
                    </SectionInner>
                </SectionAlt>

                {/* ── Booking Policy ────────────────────────────────────────── */}
                <Section id="booking-policy">
                    <SectionInner>
                        <SectionTitle>Booking Policy</SectionTitle>
                        <RedBar />
                        <SectionText>
                            All bookings are subject to availability and confirmed only upon receipt
                            of the required deposit. Prices are displayed in Swiss Francs (CHF) and
                            include applicable taxes unless stated otherwise.
                        </SectionText>
                        <SubTitle>Deposit &amp; Payment</SubTitle>
                        <PolicyList>
                            <li>A deposit of 30% of the total booking value is required at the time of reservation.</li>
                            <li>The remaining balance is due 30 days prior to the arrival date.</li>
                            <li>For bookings made within 30 days of arrival, full payment is required at the time of booking.</li>
                            <li>We accept major credit cards, bank transfers, and selected digital payment methods.</li>
                        </PolicyList>
                        <SubTitle>Guest Responsibilities</SubTitle>
                        <PolicyList>
                            <li>Guests must be at least 18 years old to make a booking.</li>
                            <li>The number of guests may not exceed the maximum occupancy of the chalet.</li>
                            <li>Pets are allowed only in designated pet-friendly properties.</li>
                            <li>Guests are responsible for any damage caused to the property during their stay.</li>
                            <li>Smoking is prohibited inside all chalets.</li>
                        </PolicyList>
                        <SubTitle>Check-in &amp; Check-out</SubTitle>
                        <PolicyList>
                            <li>Check-in time: from 16:00. Early check-in may be available upon request.</li>
                            <li>Check-out time: by 11:00. Late check-out may be available upon request.</li>
                            <li>A security deposit may be required at check-in and will be refunded within 7 days of departure.</li>
                        </PolicyList>
                    </SectionInner>
                </Section>

                {/* ── Cancellation Policy ──────────────────────────────────── */}
                <SectionAlt id="cancellation-policy">
                    <SectionInner>
                        <SectionTitle>Cancellation &amp; Refunds</SectionTitle>
                        <RedBar />
                        <SectionText>
                            We understand plans can change. Our cancellation policy is designed to
                            be fair while allowing us to manage availability effectively.
                        </SectionText>
                        <SubTitle>Standard Cancellation Terms</SubTitle>
                        <PolicyList>
                            <li><strong style={{ color: 'white' }}>More than 60 days before arrival:</strong> Full refund of deposit, minus a CHF 50 administration fee.</li>
                            <li><strong style={{ color: 'white' }}>30–60 days before arrival:</strong> 50% refund of the total booking value.</li>
                            <li><strong style={{ color: 'white' }}>Less than 30 days before arrival:</strong> No refund. We strongly recommend travel insurance.</li>
                            <li><strong style={{ color: 'white' }}>No-show:</strong> The full amount is forfeited.</li>
                        </PolicyList>
                        <SubTitle>Modifications</SubTitle>
                        <SectionText>
                            Date changes are subject to availability and may incur a rebooking fee
                            of CHF 75. All modification requests must be submitted in writing to
                            bookings@swisschalet.com at least 14 days before the arrival date.
                        </SectionText>
                        <SubTitle>Force Majeure</SubTitle>
                        <SectionText>
                            In the event of circumstances beyond our control — including natural
                            disasters, pandemics, or government travel restrictions — we will offer
                            a full credit note valid for 24 months, or a refund where legally required.
                        </SectionText>
                    </SectionInner>
                </SectionAlt>

                {/* ── Cookie Policy ─────────────────────────────────────────── */}
                <Section id="cookie-policy">
                    <SectionInner>
                        <SectionTitle>Cookie Policy</SectionTitle>
                        <RedBar />
                        <SectionText>
                            Our website uses cookies to enhance your browsing experience and help us
                            understand how visitors use our site. By continuing to browse, you consent
                            to our use of cookies in accordance with this policy.
                        </SectionText>
                        <SubTitle>Types of Cookies We Use</SubTitle>
                        <PolicyList>
                            <li><strong style={{ color: 'white' }}>Essential cookies:</strong> Required for the website to function properly. They cannot be disabled.</li>
                            <li><strong style={{ color: 'white' }}>Analytics cookies:</strong> Help us understand how visitors interact with the site (e.g., Google Analytics).</li>
                            <li><strong style={{ color: 'white' }}>Preference cookies:</strong> Remember your settings and preferences for a better experience.</li>
                            <li><strong style={{ color: 'white' }}>Marketing cookies:</strong> Used to deliver relevant advertisements. Only set with your consent.</li>
                        </PolicyList>
                        <SubTitle>Managing Cookies</SubTitle>
                        <SectionText>
                            You can manage or disable non-essential cookies at any time through your
                            browser settings or our cookie preference centre. Please note that
                            disabling certain cookies may affect the functionality of this website.
                            For more information, visit your browser's help documentation.
                        </SectionText>
                        <SubTitle>Contact</SubTitle>
                        <SectionText>
                            If you have any questions about these policies, please contact us at
                            legal@swisschalet.com or write to us at The SwissChalet, Bahnhofstrasse
                            12, 3800 Interlaken, Switzerland.
                        </SectionText>
                    </SectionInner>
                </Section>
            </PageWrapper>

            <BackToTopButton $visible={showTop} onClick={scrollToTop}>↑ Top</BackToTopButton>
            {loginOpen && <LoginModal onClose={() => setLoginOpen(false)} />}
        </>
    )
}

export default Terms
