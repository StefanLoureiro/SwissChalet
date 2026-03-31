import styled from 'styled-components'
import Mountain from '../assets/Mountain.png'
import facebook from '../assets/facebook.png'
import instagram from '../assets/instagram.png'
import tiktok from '../assets/tiktok.png'
import tripadvisor from '../assets/tripadvisor.png'
import twitter from '../assets/twitter.png'

const FooterWrapper = styled.footer`
    background-color: #1a1a1a;
    color: #ccc;
    padding: 3rem 4rem 1.5rem;
    overflow-x: hidden;
`

const FooterGrid = styled.div`
    display: grid;
    grid-template-columns: 2fr 1fr 1.5fr 1fr;
    gap: 2rem;
    margin-bottom: 2rem;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`

const FooterSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
`

const BrandRow = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
`

const BrandLogo = styled.img`
    height: 2rem;
`

const BrandName = styled.span`
    color: white;
    font-size: 1.1rem;
    font-weight: 600;
`

const SectionTitle = styled.h4`
    color: white;
    font-size: 0.95rem;
    margin-bottom: 0.4rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
`

const FooterLink = styled.a`
    color: #ccc;
    text-decoration: none;
    font-size: 0.9rem;
    cursor: pointer;

    &:hover {
        color: white;
    }
`

const ContactText = styled.p`
    font-size: 0.9rem;
    line-height: 1.6;
`

const SocialRow = styled.div`
    display: flex;
    gap: 1rem;
    margin-top: 0.4rem;
`

const SocialIcon = styled.img`
    height: 1.6rem;
    cursor: pointer;
    opacity: 0.8;
    transition: opacity 0.2s;

    &:hover {
        opacity: 1;
    }
`

const Divider = styled.hr`
    border: none;
    border-top: 1px solid #333;
    margin-bottom: 1.2rem;
`

const FooterBottom = styled.p`
    text-align: center;
    font-size: 0.85rem;
    color: #666;
`

function Footer() {
    return (
        <FooterWrapper>
            <FooterGrid>
                {/* Brand */}
                <FooterSection>
                    <BrandRow>
                        <BrandLogo src={Mountain} alt="Logo" />
                        <BrandName>The SwissChalet</BrandName>
                    </BrandRow>
                    <ContactText>
                        Your gateway to the finest Swiss mountain chalets.
                        Book your perfect alpine retreat today.
                    </ContactText>
                </FooterSection>

                {/* Links */}
                <FooterSection>
                    <SectionTitle>Company</SectionTitle>
                    <FooterLink href="/about">About</FooterLink>
                    <FooterLink href="/faqs">FAQs</FooterLink>
                    <FooterLink href="/terms">Terms &amp; Policy</FooterLink>
                </FooterSection>

                {/* Contact */}
                <FooterSection>
                    <SectionTitle>Contact</SectionTitle>
                    <ContactText>Bahnhofstrasse 12, 3800 Interlaken, Switzerland</ContactText>
                    <FooterLink href="tel:+41441234567">+41 44 123 45 67</FooterLink>
                    <FooterLink href="mailto:support@swisschalets.com">support@swisschalets.com</FooterLink>
                </FooterSection>

                {/* Social */}
                <FooterSection>
                    <SectionTitle>Follow Us</SectionTitle>
                    <SocialRow>
                        <a href="https://facebook.com" aria-label="Facebook"><SocialIcon src={facebook} alt="Facebook" /></a>
                        <a href="https://instagram.com" aria-label="Instagram"><SocialIcon src={instagram} alt="Instagram" /></a>
                        <a href="https://tiktok.com" aria-label="TikTok"><SocialIcon src={tiktok} alt="TikTok" style={{ filter: 'invert(1)' }} /></a>
                        <a href="https://tripadvisor.com" aria-label="TripAdvisor"><SocialIcon src={tripadvisor} alt="TripAdvisor" /></a>
                        <a href="https://twitter.com" aria-label="Twitter"><SocialIcon src={twitter} alt="Twitter" style={{ filter: 'invert(1)' }} /></a>
                    </SocialRow>
                </FooterSection>
            </FooterGrid>

            <Divider />
            <FooterBottom>© 2026 Switzerland Chalets. All rights reserved.</FooterBottom>
        </FooterWrapper>
    )
}

export default Footer
