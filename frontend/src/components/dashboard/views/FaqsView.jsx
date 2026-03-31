import styled from 'styled-components'
import G6 from '../../../assets/ChalletGallery/G6.jpg'
import { FAQ_DATA } from '../../../data/faqData'
import DashFaqEntry from '../DashFaqEntry'
import { PageHeading, ActRedBar, AboutHero, ActHeroBg, ActHeroContent, ActHeroTitle, ActHeroSub } from '../../../styles/dashboardShared'

const FaqsWrap = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2rem;
    margin-bottom: 2rem;
`
const FaqCategory = styled.div`
    background: white;
    border-radius: 12px;
    padding: 1.5rem 1.6rem;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    display: flex;
    flex-direction: column;
    gap: 0.7rem;
`
const FaqCategoryTitle = styled.h3`
    font-size: 0.92rem;
    font-weight: 700;
    color: #111;
    letter-spacing: 0.01em;
    padding-left: 0.75rem;
    border-left: 3px solid #f30e0e;
    margin-bottom: 0.3rem;
`

export default function FaqsView() {
    return (
        <>
            <AboutHero>
                <ActHeroBg src={G6} alt="" />
                <ActHeroContent>
                    <ActHeroTitle>FAQs</ActHeroTitle>
                    <ActRedBar />
                    <ActHeroSub>
                        Everything you need to know about booking, staying, and exploring
                        with The SwissChalet.
                    </ActHeroSub>
                </ActHeroContent>
            </AboutHero>

            <PageHeading>Frequently Asked Questions</PageHeading>
            <FaqsWrap>
                {FAQ_DATA.map(cat => (
                    <FaqCategory key={cat.category}>
                        <FaqCategoryTitle>{cat.category}</FaqCategoryTitle>
                        {cat.items.map(item => (
                            <DashFaqEntry key={item.q} question={item.q} answer={item.a} />
                        ))}
                    </FaqCategory>
                ))}
            </FaqsWrap>
        </>
    )
}
