import styled from 'styled-components'
import Ski1 from '../../../assets/Activities/Ski1.jpg'
import Ski2 from '../../../assets/Activities/Ski2.jpg'
import Ski3 from '../../../assets/Activities/Ski3.jpg'
import Hikking1 from '../../../assets/Activities/Hikking1.jpg'
import Climb1 from '../../../assets/Activities/Climb1.jpg'
import Climb2 from '../../../assets/Activities/Climb2.jpg'
import Climb3 from '../../../assets/Activities/Climb3.jpg'
import Downhill1 from '../../../assets/Activities/Downhill1.jpg'
import Downhill2 from '../../../assets/Activities/Downhill2.jpg'
import Paraglade1 from '../../../assets/Activities/Paraglade1.jpg'
import Paraglade2 from '../../../assets/Activities/Paraglade2.jpg'
import Trekking1 from '../../../assets/Activities/Trekking1.jpg'
import Trekking2 from '../../../assets/Activities/Trekking2.jpg'
import { PageHeading, ActRedBar, ActHeroBg, ActHeroContent, ActHeroTitle, ActHeroSub } from '../../../styles/dashboardShared'

const ActHero = styled.div`
    background: linear-gradient(135deg, #141414 0%, #1a1a2e 100%);
    border-radius: 14px;
    padding: 2.5rem 2.5rem;
    color: white;
    margin-bottom: 2rem;
    box-shadow: 0 4px 18px rgba(0,0,0,0.14);
    position: relative;
    overflow: hidden;
`
const ActCardsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.2rem;
    margin-bottom: 2rem;
`
const ActCard = styled.div`
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 16px rgba(0,0,0,0.1);
    background: white;
    display: flex;
    flex-direction: column;
    transition: transform 0.25s, box-shadow 0.25s;
    &:hover { transform: translateY(-6px); box-shadow: 0 10px 28px rgba(0,0,0,0.15); }
`
const ActCardImage = styled.img`
    width: 100%;
    height: 180px;
    object-fit: cover;
    display: block;
`
const ActCardBody = styled.div`
    padding: 1.1rem 1.2rem;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
`
const ActCardTitle = styled.h3`
    font-size: 1rem;
    font-weight: 700;
    color: #111;
`
const ActCardText = styled.p`
    font-size: 0.83rem;
    color: #666;
    line-height: 1.6;
    flex: 1;
`
const ActDiffTag = styled.span`
    display: inline-block;
    padding: 0.18rem 0.65rem;
    border-radius: 20px;
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    background: ${({ $level }) =>
        $level === 'easy' ? '#e8f5e9' : $level === 'moderate' ? '#fff8e1' : '#ffebee'};
    color: ${({ $level }) =>
        $level === 'easy' ? '#2e7d32' : $level === 'moderate' ? '#e65100' : '#c62828'};
`
const ActDetailSection = styled.div`
    background: white;
    border-radius: 12px;
    padding: 1.8rem 2rem;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    margin-bottom: 1.2rem;
    display: flex;
    flex-direction: ${({ $reverse }) => $reverse ? 'row-reverse' : 'row'};
    gap: 2.5rem;
    align-items: center;
`
const ActTextBlock = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
`
const ActActivityEmoji = styled.span`
    font-size: 2rem;
    line-height: 1;
`
const ActDetailTitle = styled.h2`
    font-size: 1.3rem;
    font-weight: 700;
    color: #111;
    letter-spacing: -0.02em;
`
const ActDetailText = styled.p`
    font-size: 0.88rem;
    color: #555;
    line-height: 1.75;
`
const ActSideImage = styled.img`
    flex: 1;
    max-width: 380px;
    width: 100%;
    height: 280px;
    object-fit: cover;
    border-radius: 10px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.12);
`
const ActImagePair = styled.div`
    flex: 1;
    max-width: 380px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    height: 280px;
`
const ActPairImg = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
`
const ActSkiGallery = styled.div`
    flex: 1;
    max-width: 380px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    gap: 8px;
    height: 280px;
`
const ActSkiImgLarge = styled.img`
    grid-row: 1 / 3;
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
`
const ActSkiImgSmall = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
`

export default function ActivitiesView() {
    return (
        <>
            <ActHero>
                <ActHeroBg src={Ski1} alt="" />
                <ActHeroContent>
                    <ActHeroTitle>Alpine Activities</ActHeroTitle>
                    <ActRedBar />
                    <ActHeroSub>
                        From the thrill of fresh powder to the serenity of mountain trails —
                        discover every adventure the Swiss Alps have to offer.
                    </ActHeroSub>
                </ActHeroContent>
            </ActHero>

            <PageHeading>Explore Our Activities</PageHeading>
            <ActCardsGrid>
                <ActCard>
                    <ActCardImage src={Ski2} alt="Skiing" />
                    <ActCardBody>
                        <ActCardTitle>⛷️ Skiing</ActCardTitle>
                        <ActCardText>Glide down perfectly groomed pistes or tackle off-piste powder runs across Switzerland's premier ski resorts.</ActCardText>
                        <ActDiffTag $level="moderate">All Levels</ActDiffTag>
                    </ActCardBody>
                </ActCard>
                <ActCard>
                    <ActCardImage src={Hikking1} alt="Hiking" />
                    <ActCardBody>
                        <ActCardTitle>🥾 Hiking</ActCardTitle>
                        <ActCardText>Explore vast networks of marked trails weaving through Alpine meadows, glaciers, and breathtaking panoramas.</ActCardText>
                        <ActDiffTag $level="easy">Easy – Moderate</ActDiffTag>
                    </ActCardBody>
                </ActCard>
                <ActCard>
                    <ActCardImage src={Paraglade2} alt="Paragliding" />
                    <ActCardBody>
                        <ActCardTitle>🪂 Paragliding</ActCardTitle>
                        <ActCardText>Soar above the Alps in tandem with a certified pilot for a bird's-eye view of Swiss valleys and snow-capped summits.</ActCardText>
                        <ActDiffTag $level="moderate">Guided</ActDiffTag>
                    </ActCardBody>
                </ActCard>
                <ActCard>
                    <ActCardImage src={Climb1} alt="Climbing" />
                    <ActCardBody>
                        <ActCardTitle>🧗 Climbing</ActCardTitle>
                        <ActCardText>Test your strength and technique on natural rock faces and via ferratas, guided by our experienced Alpine instructors.</ActCardText>
                        <ActDiffTag $level="hard">Intermediate – Expert</ActDiffTag>
                    </ActCardBody>
                </ActCard>
                <ActCard>
                    <ActCardImage src={Downhill1} alt="Downhill" />
                    <ActCardBody>
                        <ActCardTitle>🚵 Downhill Biking</ActCardTitle>
                        <ActCardText>Descend exhilarating mountain bike trails carved through forests and rocky terrain with gear rental and shuttle service.</ActCardText>
                        <ActDiffTag $level="hard">Intermediate – Expert</ActDiffTag>
                    </ActCardBody>
                </ActCard>
                <ActCard>
                    <ActCardImage src={Trekking1} alt="Trekking" />
                    <ActCardBody>
                        <ActCardTitle>🧭 Trekking</ActCardTitle>
                        <ActCardText>Embark on multi-day expeditions through remote Alpine passes, sleeping in mountain huts under a blanket of stars.</ActCardText>
                        <ActDiffTag $level="moderate">Moderate – Hard</ActDiffTag>
                    </ActCardBody>
                </ActCard>
            </ActCardsGrid>

            <ActDetailSection>
                <ActTextBlock>
                    <ActActivityEmoji>⛷️</ActActivityEmoji>
                    <ActDetailTitle>Skiing</ActDetailTitle>
                    <ActRedBar />
                    <ActDetailText>Switzerland is home to some of the world's finest ski resorts — from the legendary slopes of Zermatt and Verbier to the family-friendly runs of Grindelwald. Whether you're a first-timer or a seasoned carver, our certified ski instructors and rental packages ensure you spend more time on the mountain.</ActDetailText>
                    <ActDetailText>With access to over 300 km of marked pistes and pristine off-piste terrain, every day on the snow brings a new adventure for all skill levels.</ActDetailText>
                </ActTextBlock>
                <ActSkiGallery>
                    <ActSkiImgLarge src={Ski1} alt="Skiing slope" />
                    <ActSkiImgSmall src={Ski2} alt="Skiing action" />
                    <ActSkiImgSmall src={Ski3} alt="Ski resort" />
                </ActSkiGallery>
            </ActDetailSection>

            <ActDetailSection $reverse>
                <ActTextBlock>
                    <ActActivityEmoji>🪂</ActActivityEmoji>
                    <ActDetailTitle>Paragliding</ActDetailTitle>
                    <ActRedBar />
                    <ActDetailText>Experience the ultimate freedom — launching from a mountain ridge and gliding silently over glacial lakes, green valleys, and tiny villages far below. Our paragliding experiences are flown in tandem with fully licensed pilots, so no experience is necessary.</ActDetailText>
                    <ActDetailText>Launches available from multiple altitude points around the Bernese Oberland and Valais regions, with flights ranging from 15 minutes to over an hour.</ActDetailText>
                </ActTextBlock>
                <ActImagePair>
                    <ActPairImg src={Paraglade1} alt="Paragliding launch" />
                    <ActPairImg src={Paraglade2} alt="Paragliding in flight" />
                </ActImagePair>
            </ActDetailSection>

            <ActDetailSection>
                <ActTextBlock>
                    <ActActivityEmoji>🧗</ActActivityEmoji>
                    <ActDetailTitle>Rock Climbing</ActDetailTitle>
                    <ActRedBar />
                    <ActDetailText>The Swiss Alps offer some of Europe's most iconic climbing venues. From single-pitch sport routes on sun-warmed limestone to multi-day big-wall ascents, our UIAA-certified guides will match you with the perfect objective for your ability and ambition.</ActDetailText>
                    <ActDetailText>All equipment is included. Introductory via ferrata courses are also available for those looking to get a taste of vertical adventure without prior experience.</ActDetailText>
                </ActTextBlock>
                <ActImagePair>
                    <ActPairImg src={Climb3} alt="Rock climbing" />
                    <ActPairImg src={Climb2} alt="Alpine climbing" />
                </ActImagePair>
            </ActDetailSection>

            <ActDetailSection $reverse>
                <ActTextBlock>
                    <ActActivityEmoji>🚵</ActActivityEmoji>
                    <ActDetailTitle>Downhill Biking</ActDetailTitle>
                    <ActRedBar />
                    <ActDetailText>Alpine bike parks offer purpose-built trails for every level of rider. Hop on a gondola with your bike and let gravity do the rest — descending through forest singletrack, rock gardens, and open mountain faces with stunning views around every bend.</ActDetailText>
                    <ActDetailText>We offer full-suspension bike rental, protective gear, and uplift passes. Guided group sessions and private coaching is available.</ActDetailText>
                </ActTextBlock>
                <ActImagePair>
                    <ActPairImg src={Downhill1} alt="Downhill mountain biking" />
                    <ActPairImg src={Downhill2} alt="Biking trail" />
                </ActImagePair>
            </ActDetailSection>

            <ActDetailSection>
                <ActTextBlock>
                    <ActActivityEmoji>🧭</ActActivityEmoji>
                    <ActDetailTitle>Trekking</ActDetailTitle>
                    <ActRedBar />
                    <ActDetailText>For those who want to go deeper into the mountains, our multi-day trekking itineraries traverse some of the most remote and spectacular corridors in the Alps. Cross high passes, sleep in traditional mountain huts, and wake up to sunrises that will stay with you for a lifetime.</ActDetailText>
                    <ActDetailText>Routes range from 2-day gentle tours to 8-day demanding expeditions. All logistics — guide, accommodation, meals, and luggage transfer — are arranged by our team.</ActDetailText>
                </ActTextBlock>
                <ActImagePair>
                    <ActPairImg src={Trekking1} alt="Alpine trekking" />
                    <ActPairImg src={Trekking2} alt="Mountain trekking trail" />
                </ActImagePair>
            </ActDetailSection>

            <ActDetailSection $reverse>
                <ActTextBlock>
                    <ActActivityEmoji>🥾</ActActivityEmoji>
                    <ActDetailTitle>Hiking</ActDetailTitle>
                    <ActRedBar />
                    <ActDetailText>Switzerland's 65,000 km of marked hiking trails wind through Alpine meadows bursting with wildflowers, past crystal-clear mountain lakes, and up to viewpoints that put the whole alpine panorama on display. Trails are well-maintained year-round and accessible for all fitness levels.</ActDetailText>
                    <ActDetailText>Our guided day hikes depart from the chalet each morning and range from leisurely valley walks to summit hikes. All necessary equipment and a packed Alpine lunch are provided.</ActDetailText>
                </ActTextBlock>
                <ActSideImage src={Hikking1} alt="Alpine hiking" />
            </ActDetailSection>
        </>
    )
}
