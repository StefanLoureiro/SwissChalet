import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import HomeBG from '../assets/HomeBG.jpg'
import Mountain from '../assets/Mountain.png'
import Ski1 from '../assets/Activities/Ski1.jpg'
import Ski2 from '../assets/Activities/Ski2.jpg'
import Ski3 from '../assets/Activities/Ski3.jpg'
import Hikking1 from '../assets/Activities/Hikking1.jpg'
import Climb1 from '../assets/Activities/Climb1.jpg'
import Climb2 from '../assets/Activities/Climb2.jpg'
import Climb3 from '../assets/Activities/Climb3.jpg'
import Downhill1 from '../assets/Activities/Downhill1.jpg'
import Downhill2 from '../assets/Activities/Downhill2.jpg'
import Paraglade1 from '../assets/Activities/Paraglade1.jpg'
import Paraglade2 from '../assets/Activities/Paraglade2.jpg'
import Trekking1 from '../assets/Activities/Trekking1.jpg'
import Trekking2 from '../assets/Activities/Trekking2.jpg'
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
    height: 100vh;
    display: flex;
    flex-direction: column;
    background: rgba(0, 0, 0, 0.4);
    position: relative;
    overflow: hidden;
`

const HeroBackground = styled.img`
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 0;
    opacity: 0.55;
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
    position: relative;
    z-index: 1;
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
    max-width: 640px;
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

// ── Activity Cards Grid ───────────────────────────────────────────────────────

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
    cursor: default;
    transition: transform 0.3s, box-shadow 0.3s;

    &:hover {
        transform: translateY(-10px);
        box-shadow: 0 14px 40px rgba(0, 0, 0, 0.65);
    }
`

const CardImage = styled.img`
    width: 100%;
    height: 210px;
    object-fit: cover;
    display: block;
    transition: transform 0.5s;

    ${Card}:hover & {
        transform: scale(1.05);
    }
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

const DifficultyTag = styled.span`
    display: inline-block;
    margin-top: 0.4rem;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    background: ${({ $level }) =>
        $level === 'easy' ? 'rgba(34, 197, 94, 0.22)' :
            $level === 'moderate' ? 'rgba(234, 179, 8, 0.22)' :
                'rgba(239, 68, 68, 0.22)'};
    color: ${({ $level }) =>
        $level === 'easy' ? '#86efac' :
            $level === 'moderate' ? '#fde047' :
                '#fca5a5'};
    border: 1px solid ${({ $level }) =>
        $level === 'easy' ? 'rgba(34, 197, 94, 0.4)' :
            $level === 'moderate' ? 'rgba(234, 179, 8, 0.4)' :
                'rgba(239, 68, 68, 0.4)'};
`

// ── Detailed Activity Sections ────────────────────────────────────────────────

const TwoCol = styled.div`
    display: flex;
    flex-direction: ${({ $reverse }) => ($reverse ? 'row-reverse' : 'row')};
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

const ActivityIcon = styled.span`
    font-size: 2.5rem;
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

const ImagePair = styled.div`
    flex: 1;
    max-width: 480px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    height: 360px;
`

const PairImg = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 10px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
`

const SkiGallery = styled.div`
    flex: 1;
    max-width: 480px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    gap: 10px;
    height: 360px;
`

const SkiImgLarge = styled.img`
    grid-row: 1 / 3;
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 10px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
`

const SkiImgSmall = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 10px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
`

// ── Image Strip ───────────────────────────────────────────────────────────────

const ImageStrip = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    height: 300px;
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

function Activities() {
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
                        <NavButton $scrolled={scrolled} onClick={() => { navigate('/about'); window.scrollTo(0, 0); }}>About</NavButton>
                        <NavButton $scrolled={scrolled} onClick={() => { navigate('/chalets'); window.scrollTo(0, 0); }}>Chalets</NavButton>
                        <NavButton $scrolled={scrolled} $active onClick={() => { navigate('/activities'); window.scrollTo(0, 0); }}>Activities</NavButton>
                        <NavButton $scrolled={scrolled} onClick={() => setLoginOpen(true)}>Login</NavButton>
                    </NavButtons>
                </Navbar>

                {/* ── Hero ──────────────────────────────────────────────────── */}
                <HeroSection>
                    <HeroBackground src={Ski1} alt="Alpine skiing" />
                    <HeroCenter>
                        <HeroTitle>Alpine Activities</HeroTitle>
                        <RedBar />
                        <HeroSubtitle>
                            From the thrill of fresh powder to the serenity of mountain trails —
                            discover every adventure the Swiss Alps have to offer.
                        </HeroSubtitle>
                    </HeroCenter>
                </HeroSection>

                {/* ── Activity Overview Cards ───────────────────────────────── */}
                <Section>
                    <CenteredHeader>
                        <SectionTitle>Explore Our Activities</SectionTitle>
                        <RedBar />
                    </CenteredHeader>
                    <CardsGrid>
                        <Card>
                            <CardImage src={Ski2} alt="Skiing" />
                            <CardBody>
                                <CardTitle>⛷️ Skiing</CardTitle>
                                <CardText>
                                    Glide down perfectly groomed pistes or tackle off-piste powder runs
                                    across Switzerland's premier ski resorts.
                                </CardText>
                                <DifficultyTag $level="moderate">All Levels</DifficultyTag>
                            </CardBody>
                        </Card>
                        <Card>
                            <CardImage src={Hikking1} alt="Hiking" />
                            <CardBody>
                                <CardTitle>🥾 Hiking</CardTitle>
                                <CardText>
                                    Explore vast networks of marked trails weaving through Alpine
                                    meadows, glaciers, and breathtaking panoramas.
                                </CardText>
                                <DifficultyTag $level="easy">Easy – Moderate</DifficultyTag>
                            </CardBody>
                        </Card>
                        <Card>
                            <CardImage src={Paraglade2} alt="Paragliding" />
                            <CardBody>
                                <CardTitle>🪂 Paragliding</CardTitle>
                                <CardText>
                                    Soar above the Alps in tandem with a certified pilot for a bird's-eye
                                    view of Swiss valleys and snow-capped summits.
                                </CardText>
                                <DifficultyTag $level="moderate">Guided</DifficultyTag>
                            </CardBody>
                        </Card>
                        <Card>
                            <CardImage src={Climb1} alt="Climbing" />
                            <CardBody>
                                <CardTitle>🧗 Climbing</CardTitle>
                                <CardText>
                                    Test your strength and technique on natural rock faces and via
                                    ferratas, guided by our experienced Alpine instructors.
                                </CardText>
                                <DifficultyTag $level="hard">Intermediate – Expert</DifficultyTag>
                            </CardBody>
                        </Card>
                        <Card>
                            <CardImage src={Downhill1} alt="Downhill" />
                            <CardBody>
                                <CardTitle>🚵 Downhill Biking</CardTitle>
                                <CardText>
                                    Descend exhilarating mountain bike trails carved through forests
                                    and rocky terrain with gear rental and shuttle service.
                                </CardText>
                                <DifficultyTag $level="hard">Intermediate – Expert</DifficultyTag>
                            </CardBody>
                        </Card>
                        <Card>
                            <CardImage src={Trekking1} alt="Trekking" />
                            <CardBody>
                                <CardTitle>🧭 Trekking</CardTitle>
                                <CardText>
                                    Embark on multi-day expeditions through remote Alpine passes,
                                    sleeping in mountain huts under a blanket of stars.
                                </CardText>
                                <DifficultyTag $level="moderate">Moderate – Hard</DifficultyTag>
                            </CardBody>
                        </Card>
                    </CardsGrid>
                </Section>

                {/* ── Skiing ────────────────────────────────────────────────── */}
                <SectionAlt>
                    <TwoCol>
                        <TextBlock>
                            <ActivityIcon>⛷️</ActivityIcon>
                            <SectionTitle>Skiing</SectionTitle>
                            <RedBar />
                            <SectionText>
                                Switzerland is home to some of the world's finest ski resorts —
                                from the legendary slopes of Zermatt and Verbier to the family-friendly
                                runs of Grindelwald. Whether you're a first-timer or a seasoned carver,
                                our certified ski instructors and rental packages ensure you spend more
                                time on the mountain and less time worrying about the details.
                            </SectionText>
                            <SectionText>
                                With access to over 300 km of marked pistes and pristine off-piste terrain,
                                every day on the snow brings a new adventure for all skill levels.
                            </SectionText>
                        </TextBlock>
                        <SkiGallery>
                            <SkiImgLarge src={Ski1} alt="Skiing slope" />
                            <SkiImgSmall src={Ski2} alt="Skiing action" />
                            <SkiImgSmall src={Ski3} alt="Ski resort" />
                        </SkiGallery>
                    </TwoCol>
                </SectionAlt>

                {/* ── Paragliding ───────────────────────────────────────────── */}
                <Section>
                    <TwoCol $reverse>
                        <TextBlock>
                            <ActivityIcon>🪂</ActivityIcon>
                            <SectionTitle>Paragliding</SectionTitle>
                            <RedBar />
                            <SectionText>
                                Experience the ultimate freedom — launching from a mountain ridge
                                and gliding silently over glacial lakes, green valleys, and tiny
                                villages far below. Our paragliding experiences are flown in tandem
                                with fully licensed pilots, so no experience is necessary.
                            </SectionText>
                            <SectionText>
                                Launches available from multiple altitude points around the Bernese
                                Oberland and Valais regions, with flights ranging from 15 minutes
                                to over an hour depending on conditions.
                            </SectionText>
                        </TextBlock>
                        <ImagePair>
                            <PairImg src={Paraglade1} alt="Paragliding launch" />
                            <PairImg src={Paraglade2} alt="Paragliding in flight" />
                        </ImagePair>
                    </TwoCol>
                </Section>

                {/* ── Climbing ──────────────────────────────────────────────── */}
                <SectionAlt>
                    <TwoCol>
                        <TextBlock>
                            <ActivityIcon>🧗</ActivityIcon>
                            <SectionTitle>Rock Climbing</SectionTitle>
                            <RedBar />
                            <SectionText>
                                The Swiss Alps offer some of Europe's most iconic climbing venues.
                                From single-pitch sport routes on sun-warmed limestone to multi-day
                                big-wall ascents, our UIAA-certified guides will match you with the
                                perfect objective for your ability and ambition.
                            </SectionText>
                            <SectionText>
                                All equipment is included. Introductory via ferrata courses are also
                                available for those looking to get a taste of vertical adventure
                                without prior experience.
                            </SectionText>
                        </TextBlock>
                        <ImagePair>
                            <PairImg src={Climb3} alt="Rock climbing" />
                            <PairImg src={Climb2} alt="Alpine climbing" />
                        </ImagePair>
                    </TwoCol>
                </SectionAlt>

                {/* ── Downhill Biking ───────────────────────────────────────── */}
                <Section>
                    <TwoCol $reverse>
                        <TextBlock>
                            <ActivityIcon>🚵</ActivityIcon>
                            <SectionTitle>Downhill Biking</SectionTitle>
                            <RedBar />
                            <SectionText>
                                Alpine bike parks offer purpose-built trails for every level of rider.
                                Hop on a gondola with your bike and let gravity do the rest — descending
                                through forest singletrack, rock gardens, and open mountain faces with
                                stunning views around every bend.
                            </SectionText>
                            <SectionText>
                                We offer full-suspension bike rental, protective gear, and uplift passes.
                                Guided group sessions and private coaching is available for those
                                looking to push their riding to the next level.
                            </SectionText>
                        </TextBlock>
                        <ImagePair>
                            <PairImg src={Downhill1} alt="Downhill mountain biking" />
                            <PairImg src={Downhill2} alt="Biking trail" />
                        </ImagePair>
                    </TwoCol>
                </Section>

                {/* ── Trekking ──────────────────────────────────────────────── */}
                <SectionAlt>
                    <TwoCol>
                        <TextBlock>
                            <ActivityIcon>🧭</ActivityIcon>
                            <SectionTitle>Trekking</SectionTitle>
                            <RedBar />
                            <SectionText>
                                For those who want to go deeper into the mountains, our multi-day
                                trekking itineraries traverse some of the most remote and spectacular
                                corridors in the Alps. Cross high passes, sleep in traditional mountain
                                huts, and wake up to sunrises that will stay with you for a lifetime.
                            </SectionText>
                            <SectionText>
                                Routes range from 2-day gentle tours to 8-day demanding expeditions.
                                All logistics — guide, accommodation, meals, and luggage transfer —
                                are arranged by our team.
                            </SectionText>
                        </TextBlock>
                        <ImagePair>
                            <PairImg src={Trekking1} alt="Alpine trekking" />
                            <PairImg src={Trekking2} alt="Mountain trekking trail" />
                        </ImagePair>
                    </TwoCol>
                </SectionAlt>

                {/* ── Hiking ────────────────────────────────────────────────── */}
                <Section>
                    <TwoCol $reverse>
                        <TextBlock>
                            <ActivityIcon>🥾</ActivityIcon>
                            <SectionTitle>Hiking</SectionTitle>
                            <RedBar />
                            <SectionText>
                                Switzerland's 65,000 km of marked hiking trails wind through Alpine
                                meadows bursting with wildflowers, past crystal-clear mountain lakes,
                                and up to viewpoints that put the whole alpine panorama on display.
                                Trails are well-maintained year-round and accessible for all fitness levels.
                            </SectionText>
                            <SectionText>
                                Our guided day hikes depart from the chalet each morning and range from
                                leisurely valley walks to summit hikes. All necessary equipment and a
                                packed Alpine lunch are provided.
                            </SectionText>
                        </TextBlock>
                        <SideImage src={Hikking1} alt="Alpine hiking" />
                    </TwoCol>
                </Section>

                {/* ── Image Strip ───────────────────────────────────────────── */}
                <ImageStrip>
                    <StripImgWrapper><StripImg src={Ski3} alt="Ski run" /></StripImgWrapper>
                    <StripImgWrapper><StripImg src={Paraglade2} alt="Paragliding view" /></StripImgWrapper>
                    <StripImgWrapper><StripImg src={Downhill2} alt="Downhill trail" /></StripImgWrapper>
                    <StripImgWrapper><StripImg src={Trekking2} alt="Trekking landscape" /></StripImgWrapper>
                </ImageStrip>
            </PageWrapper >
            <BackToTopButton $visible={scrolled} onClick={scrollToTop}>↑ Top</BackToTopButton>
            {loginOpen && <LoginModal onClose={() => setLoginOpen(false)} />}
        </>
    )
}

export default Activities
