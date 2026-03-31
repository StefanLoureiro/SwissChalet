import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import LoginModal from '../components/LoginModal'
import HomeBG from '../assets/HomeBG.jpg'
import ChFlag from '../assets/ChFlag.png'
import Mountain from '../assets/Mountain.png'
import G1 from '../assets/ChalletGallery/G1.jpg'
import G2 from '../assets/ChalletGallery/G2.jpg'
import G3 from '../assets/ChalletGallery/G3.jpg'
import G4 from '../assets/ChalletGallery/G4.jpg'
import G5 from '../assets/ChalletGallery/G5.jpg'
import G6 from '../assets/ChalletGallery/G6.jpg'
import G7 from '../assets/ChalletGallery/G7.jpg'
import G8 from '../assets/ChalletGallery/G8.jpg'
import Ski1 from '../assets/Activities/Ski1.jpg'
import Ski2 from '../assets/Activities/Ski2.jpg'
import Ski3 from '../assets/Activities/Ski3.jpg'
import Hikking1 from '../assets/Activities/Hikking1.jpg'
import Climb1 from '../assets/Activities/Climb1.jpg'
import Paraglide2 from '../assets/Activities/Paraglade2.jpg'
import Trekking1 from '../assets/Activities/Trekking1.jpg'
import Trekking2 from '../assets/Activities/Trekking2.jpg'


const GALLERY_IMAGES = [G1, G2, G3, G4, G5, G6, G7, G8, Ski1, Ski2, Ski3, Hikking1, Climb1, Paraglide2, Trekking1, Trekking2]

const Wrapper = styled.div`
    background-image: url(${HomeBG});
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
    min-height: 100vh;
    width: 100%;
`

const HeroSection = styled.div`
    height: 100vh;
    display: flex;
    flex-direction: column;
`

const VideoSection = styled.div`
    width: 100%;
    aspect-ratio: 16 / 9;
    position: relative;
`

const VideoIframe = styled.iframe`
    width: 100%;
    height: 100%;
    border: none;
    display: block;
`

const CarouselSection = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 5rem 2rem 5rem;
    
    backdrop-filter: blur(2px);
    gap: 1.2rem;
    position: relative;
    z-index: 0;
    overflow: hidden;
`

const GallerySection = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 5rem 4rem;
    background: rgba(0, 0, 0, 0.45);
    backdrop-filter: blur(2px);
    gap: 4rem;
    position: relative;
    z-index: 1;
   
`

const IntroRow = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 4rem;
    width: 100%;
    max-width: 1100px;
`

const SectionIntro = styled.div`
    text-align: left;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
`

const IntroImage = styled.img`
    flex: 1;
    max-width: 480px;
    width: 100%;
    height: 320px;
    object-fit: cover;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
`

const ActivityGrid = styled.div`
    flex: 1;
    max-width: 480px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    height: 320px;
`

const ActivityGridImg = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 10px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
`

const SectionIntroTitle = styled.h2`
    color: white;
    font-size: 2.2rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.7);
`

const SectionIntroText = styled.p`
    color: rgba(255, 255, 255, 0.88);
    font-size: 1.05rem;
    line-height: 1.8;
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
`

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
`

const NavLogoImage = styled.img`
    height: 3rem;
`

const NavLogoText = styled.span`
    color: ${({ $scrolled }) => ($scrolled ? '#222' : 'white')};
    font-size: 1.4rem;
    font-weight: 600;
    text-shadow: ${({ $scrolled }) => ($scrolled ? 'none' : '0 2px 6px rgba(0, 0, 0, 0.5)')};
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
    transition: color 0.2s, border-bottom 0.2s;
    border-bottom: 2px solid transparent;
    padding-bottom: 2px;

    &:hover {
        color: #f30e0e;
        border-bottom: 2px solid #292720;
    }
`

const CenterContent = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
`

const TitleWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 0.75rem;
`

const Title = styled.h1`
    color: white;
    font-size: 4rem;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
`

const Flag = styled.img`
    height: 4rem;
`

const HeroContent = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
`

const ExploreButton = styled.button`
    background: none;
    border: 2px solid white;
    color: white;
    font-size: 1.1rem;
    padding: 0.75rem 2rem;
    cursor: pointer;
    letter-spacing: 0.05em;
    transition: background 0.2s, color 0.2s;

    &:hover {
        background: white;
        color: #f30e0e;
    }
`

const CarouselOuter = styled.div`
    width: 860px;
    position: relative;
`

const CarouselViewport = styled.div`
    width: 100%;
    height: 360px;
    overflow: hidden;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
    position: relative;
`

const CarouselTrack = styled.div`
    display: flex;
    height: 100%;
    transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    transform: translateX(calc(${({ $current }) => $current} * -620px + 120px));
`

const CarouselSlide = styled.div`
    flex: 0 0 600px;
    height: 100%;
    margin-right: 20px;
    border-radius: 10px;
    overflow: hidden;
    transition: transform 0.6s, opacity 0.6s;
    transform: ${({ $active }) => ($active ? 'scale(1)' : 'scale(0.93)')};
    opacity: ${({ $active }) => ($active ? 1 : 0.5)};
`

const CarouselImg = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
`

const CarouselArrow = styled.button`
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    ${({ $side }) => $side}: 12px;
    background: rgba(0, 0, 0, 0.45);
    border: none;
    color: white;
    font-size: 1.6rem;
    width: 2.4rem;
    height: 2.4rem;
    border-radius: 50%;
    cursor: pointer;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s;

    &:hover {
        background: rgba(0, 0, 0, 0.75);
    }
`

const CarouselDots = styled.div`
    display: flex;
    justify-content: center;
    gap: 0.45rem;
    margin-top: 0.6rem;
`

const Dot = styled.span`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${({ $active }) => ($active ? 'white' : 'rgba(255,255,255,0.4)')};
    transition: background 0.3s;
    cursor: pointer;
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

function Home() {
    const navigate = useNavigate()
    const [current, setCurrent] = useState(0)
    const [scrolled, setScrolled] = useState(false)
    const [videoVisible, setVideoVisible] = useState(false)
    const [loginOpen, setLoginOpen] = useState(false)
    const videoRef = useRef(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setVideoVisible(true) },
            { threshold: 0.4 }
        )
        if (videoRef.current) observer.observe(videoRef.current)
        return () => observer.disconnect()
    }, [])

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY >= window.innerHeight - 10)
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent(prev => (prev + 1) % GALLERY_IMAGES.length)
        }, 3500)
        return () => clearInterval(timer)
    }, [])

    const prev = () => setCurrent(c => (c - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length)
    const next = () => setCurrent(c => (c + 1) % GALLERY_IMAGES.length)
    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

    return (
        <>
            <Wrapper>
                <HeroSection>
                    <Navbar $scrolled={scrolled}>
                        <NavLogo>
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

                    <CenterContent>
                        <HeroContent>
                            <TitleWrapper>
                                <Title>Welcome to Switzerland </Title>
                                <Flag src={ChFlag} alt="Swiss Flag" />
                            </TitleWrapper>
                            <ExploreButton onClick={() => navigate('/chalets')}>Explore the Chalets</ExploreButton>
                        </HeroContent>
                    </CenterContent>
                </HeroSection>


                <GallerySection>
                    <IntroRow>
                        <SectionIntro>
                            <SectionIntroTitle>Our Chalets</SectionIntroTitle>
                            <SectionIntroText>
                                Nestled in the heart of the Swiss Alps, our chalets offer a unique blend of traditional Alpine charm and modern comfort. Surrounded by breathtaking mountain peaks, dense pine forests, and pristine snow, each chalet is a private retreat where you can unwind by a roaring fireplace, wake up to panoramic views, and step outside into some of the world's finest ski slopes and hiking trails. Whether you seek a cozy winter escape or a vibrant summer adventure, the Swiss mountains are waiting for you.
                            </SectionIntroText>
                        </SectionIntro>
                        <IntroImage src={G1} alt="Chalet" />
                    </IntroRow>

                    <IntroRow>
                        <ActivityGrid>
                            <ActivityGridImg src={Ski3} alt="Skiing" />
                            <ActivityGridImg src={Hikking1} alt="Hiking" />
                        </ActivityGrid>
                        <SectionIntro style={{ textAlign: 'right' }}>
                            <SectionIntroTitle>Activities</SectionIntroTitle>
                            <SectionIntroText>
                                From thrilling ski slopes and snowboard runs to serene mountain hikes and paragliding over breathtaking valleys — the Swiss Alps offer an adventure for every soul. Whether you chase adrenaline on the pistes, explore hidden trails through pine forests, or simply breathe in the crisp mountain air, our chalets put you at the heart of it all. Every season brings a new reason to explore.
                            </SectionIntroText>
                        </SectionIntro>
                    </IntroRow>
                </GallerySection>

                <CarouselSection>
                    <CarouselOuter>
                        <CarouselViewport>
                            <CarouselTrack $current={current}>
                                {GALLERY_IMAGES.map((img, i) => (
                                    <CarouselSlide key={i} $active={i === current}>
                                        <CarouselImg src={img} alt={`Chalet ${i + 1}`} />
                                    </CarouselSlide>
                                ))}
                            </CarouselTrack>
                            <CarouselArrow $side="left" onClick={prev}>&#8249;</CarouselArrow>
                            <CarouselArrow $side="right" onClick={next}>&#8250;</CarouselArrow>
                        </CarouselViewport>
                        <CarouselDots>
                            {GALLERY_IMAGES.map((_, i) => (
                                <Dot key={i} $active={i === current} onClick={() => setCurrent(i)} />
                            ))}
                        </CarouselDots>
                    </CarouselOuter>
                </CarouselSection>

                <VideoSection ref={videoRef}>
                    <VideoIframe
                        src={`https://www.youtube.com/embed/FI62fjKHrBM?autoplay=${videoVisible ? 1 : 0}&rel=0&mute=1`}
                        title="Swiss Chalet Video"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </VideoSection>
            </Wrapper>
            <BackToTopButton $visible={scrolled} onClick={scrollToTop}>↑ Top</BackToTopButton>
            {loginOpen && <LoginModal onClose={() => setLoginOpen(false)} />}
        </>
    )
}

export default Home