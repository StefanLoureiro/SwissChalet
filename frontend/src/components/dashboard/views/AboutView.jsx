import styled from 'styled-components'
import G2 from '../../../assets/ChalletGallery/G2.jpg'
import G3 from '../../../assets/ChalletGallery/G3.jpg'
import G4 from '../../../assets/ChalletGallery/G4.jpg'
import G5 from '../../../assets/ChalletGallery/G5.jpg'
import Ski1 from '../../../assets/Activities/Ski1.jpg'
import { PageHeading, ActRedBar, AboutHero, ActHeroBg, ActHeroContent, ActHeroTitle, ActHeroSub } from '../../../styles/dashboardShared'

const AboutSection = styled.div`
    background: white;
    border-radius: 12px;
    padding: 2rem 2.2rem;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    margin-bottom: 2rem;
`
const AboutTwoCol = styled.div`
    display: flex;
    gap: 3rem;
    align-items: center;
`
const AboutTextBlock = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.9rem;
`
const AboutSectionTitle = styled.h2`
    font-size: 1.4rem;
    font-weight: 700;
    color: #111;
    letter-spacing: -0.02em;
`
const AboutSectionText = styled.p`
    font-size: 0.9rem;
    color: #555;
    line-height: 1.78;
`
const AboutSideImage = styled.img`
    flex: 1;
    max-width: 400px;
    width: 100%;
    height: 280px;
    object-fit: cover;
    border-radius: 10px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.1);
`
const AboutCardsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.2rem;
    margin-bottom: 2rem;
`
const AboutCard = styled.div`
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 14px rgba(0,0,0,0.08);
    background: white;
    display: flex;
    flex-direction: column;
`
const AboutCardImage = styled.img`
    width: 100%;
    height: 170px;
    object-fit: cover;
    display: block;
`
const AboutCardBody = styled.div`
    padding: 1.1rem 1.2rem;
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
`
const AboutCardTitle = styled.h3`
    font-size: 1rem;
    font-weight: 700;
    color: #111;
`
const AboutCardText = styled.p`
    font-size: 0.83rem;
    color: #666;
    line-height: 1.65;
`
const AboutFeaturesGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    margin-bottom: 2rem;
`
const AboutFeature = styled.div`
    background: white;
    border-radius: 12px;
    padding: 1.4rem 1.5rem;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    transition: box-shadow 0.2s;
    &:hover { box-shadow: 0 6px 18px rgba(0,0,0,0.1); }
`
const AboutFeatureIcon = styled.span`
    font-size: 1.7rem;
    line-height: 1;
`
const AboutFeatureTitle = styled.h3`
    font-size: 0.95rem;
    font-weight: 700;
    color: #111;
`
const AboutFeatureText = styled.p`
    font-size: 0.82rem;
    color: #666;
    line-height: 1.65;
`

export default function AboutView() {
    return (
        <>
            <AboutHero>
                <ActHeroBg src={G5} alt="" />
                <ActHeroContent>
                    <ActHeroTitle>About Us</ActHeroTitle>
                    <ActRedBar />
                    <ActHeroSub>
                        Discover the story behind The SwissChalet — a commitment to Alpine
                        authenticity, luxury comfort, and unforgettable mountain experiences.
                    </ActHeroSub>
                </ActHeroContent>
            </AboutHero>

            <AboutSection>
                <AboutTwoCol>
                    <AboutTextBlock>
                        <AboutSectionTitle>Who We Are</AboutSectionTitle>
                        <ActRedBar />
                        <AboutSectionText>
                            Founded in the heart of Switzerland, The SwissChalet was born from a
                            passion for the mountains and a desire to share their magic with the
                            world. We are a family-run company with deep roots in Alpine culture,
                            dedicated to offering guests an authentic and enriching stay in some of
                            Switzerland's most stunning locations.
                        </AboutSectionText>
                        <AboutSectionText>
                            From our first chalet perched above the Bernese Oberland to our growing
                            collection of properties across the Swiss Alps, every retreat we manage
                            carries the same soul — warmth, craftsmanship, and a genuine connection
                            to the landscape that surrounds it.
                        </AboutSectionText>
                    </AboutTextBlock>
                    <AboutSideImage src={G2} alt="Our chalet interior" />
                </AboutTwoCol>
            </AboutSection>

            <PageHeading>What We Offer</PageHeading>
            <AboutCardsGrid>
                <AboutCard>
                    <AboutCardImage src={G3} alt="Luxury Chalets" />
                    <AboutCardBody>
                        <AboutCardTitle>Luxury Chalets</AboutCardTitle>
                        <AboutCardText>
                            Handpicked properties blending traditional Alpine architecture with
                            modern comforts — fireplaces, panoramic terraces, and all the warmth
                            of a mountain home.
                        </AboutCardText>
                    </AboutCardBody>
                </AboutCard>
                <AboutCard>
                    <AboutCardImage src={Ski1} alt="Mountain Activities" />
                    <AboutCardBody>
                        <AboutCardTitle>Mountain Activities</AboutCardTitle>
                        <AboutCardText>
                            Skiing, snowboarding, hiking, paragliding and more. Our curated
                            experiences let you explore the Alps at your own pace, every season
                            of the year.
                        </AboutCardText>
                    </AboutCardBody>
                </AboutCard>
                <AboutCard>
                    <AboutCardImage src={G4} alt="Personalised Hospitality" />
                    <AboutCardBody>
                        <AboutCardTitle>Personalised Hospitality</AboutCardTitle>
                        <AboutCardText>
                            From airport transfers to private chefs and guided tours, our
                            concierge team ensures every detail of your stay is taken care of.
                        </AboutCardText>
                    </AboutCardBody>
                </AboutCard>
            </AboutCardsGrid>

            <PageHeading>Why Choose Us</PageHeading>
            <AboutFeaturesGrid>
                <AboutFeature>
                    <AboutFeatureIcon>🏔️</AboutFeatureIcon>
                    <AboutFeatureTitle>Unbeatable Locations</AboutFeatureTitle>
                    <AboutFeatureText>All our chalets sit in prime Alpine spots, within minutes of ski lifts, hiking trails, and charming Swiss villages.</AboutFeatureText>
                </AboutFeature>
                <AboutFeature>
                    <AboutFeatureIcon>⭐</AboutFeatureIcon>
                    <AboutFeatureTitle>Swiss Quality Standards</AboutFeatureTitle>
                    <AboutFeatureText>Every property is personally inspected and maintained by our team to uphold the highest standards of quality and cleanliness.</AboutFeatureText>
                </AboutFeature>
                <AboutFeature>
                    <AboutFeatureIcon>🤝</AboutFeatureIcon>
                    <AboutFeatureTitle>Dedicated 24/7 Support</AboutFeatureTitle>
                    <AboutFeatureText>Our support team is always a call away — whether you need local recommendations, emergency assistance, or last-minute arrangements.</AboutFeatureText>
                </AboutFeature>
                <AboutFeature>
                    <AboutFeatureIcon>🌿</AboutFeatureIcon>
                    <AboutFeatureTitle>Sustainable Tourism</AboutFeatureTitle>
                    <AboutFeatureText>We partner with local craftsmen and support conservation initiatives to protect the Alpine ecosystem for future generations.</AboutFeatureText>
                </AboutFeature>
                <AboutFeature>
                    <AboutFeatureIcon>❄️</AboutFeatureIcon>
                    <AboutFeatureTitle>Year-Round Experiences</AboutFeatureTitle>
                    <AboutFeatureText>Winter skiing, spring wildflower walks, summer mountain biking, autumn foliage hikes — spectacular in every season.</AboutFeatureText>
                </AboutFeature>
                <AboutFeature>
                    <AboutFeatureIcon>🏠</AboutFeatureIcon>
                    <AboutFeatureTitle>Feel At Home</AboutFeatureTitle>
                    <AboutFeatureText>More than a rental — our chalets are curated homes where you can cook, relax, and truly live the Alpine lifestyle as a local would.</AboutFeatureText>
                </AboutFeature>
            </AboutFeaturesGrid>
        </>
    )
}
