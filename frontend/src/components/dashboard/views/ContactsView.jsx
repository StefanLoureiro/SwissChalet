import styled from 'styled-components'
import { ActRedBar, ActHeroContent, ActHeroTitle, ActHeroSub } from '../../../styles/dashboardShared'

const ContactsHero = styled.div`
    background: linear-gradient(135deg, #111 0%, #1a1a2e 100%);
    border-radius: 14px;
    padding: 2.5rem 2.5rem;
    color: white;
    margin-bottom: 2rem;
    box-shadow: 0 4px 18px rgba(0,0,0,0.14);
    position: relative;
    overflow: hidden;
`
const ContactsGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.4rem;
    margin-bottom: 2rem;
`
const ContactCard = styled.div`
    background: white;
    border-radius: 14px;
    padding: 1.8rem 2rem;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
`
const ContactCardTitle = styled.h3`
    font-size: 0.7rem;
    font-weight: 700;
    color: #bbb;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 0.2rem;
`
const ContactRow = styled.div`
    display: flex;
    align-items: flex-start;
    gap: 1rem;
`
const ContactIconWrap = styled.div`
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: #fff4f4;
    color: #f30e0e;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-size: 1.1rem;
`
const ContactInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
`
const ContactLabel = styled.span`
    font-size: 0.72rem;
    font-weight: 700;
    color: #bbb;
    text-transform: uppercase;
    letter-spacing: 0.08em;
`
const ContactValue = styled.span`
    font-size: 0.95rem;
    font-weight: 500;
    color: #111;
`
const ContactLink = styled.a`
    font-size: 0.95rem;
    font-weight: 500;
    color: #f30e0e;
    text-decoration: none;
    &:hover { text-decoration: underline; }
`
const SocialGrid = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
`
const SocialBtn = styled.a`
    display: flex;
    align-items: center;
    gap: 0.55rem;
    padding: 0.6rem 1.1rem;
    border-radius: 9px;
    border: 1.5px solid #ebebeb;
    background: #fafafa;
    color: #222;
    font-size: 0.88rem;
    font-weight: 500;
    text-decoration: none;
    transition: background 0.18s, border-color 0.18s, color 0.18s;
    &:hover {
        background: #fff4f4;
        border-color: rgba(243,14,14,0.3);
        color: #f30e0e;
    }
`

export default function ContactsView() {
    return (
        <>
            <ContactsHero>
                <ActHeroContent>
                    <ActHeroTitle>Contact Us</ActHeroTitle>
                    <ActRedBar />
                    <ActHeroSub>
                        We'd love to hear from you. Reach out through any of the channels below
                        and our team will get back to you as soon as possible.
                    </ActHeroSub>
                </ActHeroContent>
            </ContactsHero>

            <ContactsGrid>
                <ContactCard>
                    <ContactCardTitle>Get in Touch</ContactCardTitle>
                    <ContactRow>
                        <ContactIconWrap>📍</ContactIconWrap>
                        <ContactInfo>
                            <ContactLabel>Address</ContactLabel>
                            <ContactValue>Bahnhofstrasse 12</ContactValue>
                            <ContactValue>3800 Interlaken, Switzerland</ContactValue>
                        </ContactInfo>
                    </ContactRow>
                    <ContactRow>
                        <ContactIconWrap>📞</ContactIconWrap>
                        <ContactInfo>
                            <ContactLabel>Phone</ContactLabel>
                            <ContactLink href="tel:+41441234567">+41 44 123 45 67</ContactLink>
                        </ContactInfo>
                    </ContactRow>
                    <ContactRow>
                        <ContactIconWrap>✉️</ContactIconWrap>
                        <ContactInfo>
                            <ContactLabel>Email</ContactLabel>
                            <ContactLink href="mailto:support@swisschalets.com">support@swisschalets.com</ContactLink>
                        </ContactInfo>
                    </ContactRow>
                </ContactCard>

                <ContactCard>
                    <ContactCardTitle>Follow Us</ContactCardTitle>
                    <SocialGrid>
                        <SocialBtn href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                            <span>📘</span> Facebook
                        </SocialBtn>
                        <SocialBtn href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                            <span>📸</span> Instagram
                        </SocialBtn>
                        <SocialBtn href="https://tiktok.com" target="_blank" rel="noopener noreferrer">
                            <span>🎵</span> TikTok
                        </SocialBtn>
                        <SocialBtn href="https://tripadvisor.com" target="_blank" rel="noopener noreferrer">
                            <span>🦉</span> TripAdvisor
                        </SocialBtn>
                        <SocialBtn href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                            <span>🐦</span> Twitter
                        </SocialBtn>
                    </SocialGrid>
                </ContactCard>
            </ContactsGrid>
        </>
    )
}
