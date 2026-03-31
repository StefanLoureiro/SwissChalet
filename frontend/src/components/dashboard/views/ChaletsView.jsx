import styled from 'styled-components'
import ChaletBg from '../../../assets/Challets/Inside12.jpg'
import { PageHeading, EmptyState, ActRedBar } from '../../../styles/dashboardShared'

const ChaletHero = styled.div`
    background: linear-gradient(135deg, #0d1f14 0%, #1b3025 100%);
    border-radius: 14px;
    padding: 2.5rem 2.5rem;
    color: white;
    margin-bottom: 2rem;
    box-shadow: 0 4px 18px rgba(0,0,0,0.14);
    position: relative;
    overflow: hidden;
`
const ChaletHeroBg = styled.img`
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.28;
    border-radius: 14px;
`
const ChaletHeroContent = styled.div`
    position: relative;
    z-index: 1;
`
const ChaletHeroTitle = styled.h1`
    font-size: 2rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    margin-bottom: 0.4rem;
`
const ChaletHeroSub = styled.p`
    color: rgba(255,255,255,0.65);
    font-size: 0.95rem;
    max-width: 560px;
    line-height: 1.6;
`
const ChaletCardsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.4rem;
    margin-bottom: 2rem;
`
const ChaletCard = styled.div`
    border-radius: 14px;
    overflow: hidden;
    box-shadow: 0 4px 16px rgba(0,0,0,0.08);
    background: white;
    display: flex;
    flex-direction: column;
    cursor: pointer;
    transition: transform 0.25s, box-shadow 0.25s;
    &:hover { transform: translateY(-6px); box-shadow: 0 12px 32px rgba(0,0,0,0.13); }
`
const ChaletImageWrap = styled.div`
    position: relative;
    height: 200px;
    flex-shrink: 0;
`
const ChaletCardImg = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
`
const ChaletImgPlaceholder = styled.div`
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #1a1a1a 0%, #2d3a2d 50%, #1a2e1a 100%);
`
const ChaletPriceBadge = styled.div`
    position: absolute;
    bottom: 12px;
    right: 12px;
    background: rgba(0,0,0,0.75);
    color: white;
    padding: 0.35rem 0.8rem;
    border-radius: 20px;
    font-size: 0.97rem;
    font-weight: 700;
    backdrop-filter: blur(6px);
    span {
        font-size: 0.72rem;
        font-weight: 400;
        opacity: 0.75;
        margin-left: 2px;
    }
`
const ChaletCardBody = styled.div`
    padding: 1.2rem 1.3rem;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.52rem;
`
const ChaletCardTitle = styled.h3`
    font-size: 1.05rem;
    font-weight: 700;
    color: #111;
    line-height: 1.3;
`
const ChaletLocation = styled.span`
    font-size: 0.82rem;
    color: #888;
`
const ChaletStatsRow = styled.div`
    display: flex;
    gap: 0.4rem;
    flex-wrap: wrap;
`
const ChaletStatPill = styled.span`
    font-size: 0.75rem;
    font-weight: 500;
    color: #444;
    background: #f3f4f6;
    padding: 0.22rem 0.6rem;
    border-radius: 6px;
`
const ChaletDesc = styled.p`
    font-size: 0.82rem;
    color: #666;
    line-height: 1.6;
    flex: 1;
`
const ChaletAmenities = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
    margin-top: 0.1rem;
`
const ChaletAmenityTag = styled.span`
    font-size: 0.72rem;
    font-weight: 600;
    padding: 0.2rem 0.55rem;
    border-radius: 6px;
    background: ${({ $muted }) => $muted ? '#f5f5f5' : '#e8f5e9'};
    color: ${({ $muted }) => $muted ? '#aaa' : '#2e7d32'};
    letter-spacing: 0.02em;
`

export default function ChaletsView({ chalets, chaletsLoading, onSelectChalet }) {
    return (
        <>
            <ChaletHero>
                <ChaletHeroBg src={ChaletBg} alt="Chalet background" />
                <ChaletHeroContent>
                    <ChaletHeroTitle>Our Chalets</ChaletHeroTitle>
                    <ActRedBar />
                    <ChaletHeroSub>
                        Handpicked Swiss Alpine retreats — from cosy mountain hideaways
                        to grand family chalets with panoramic peak views.
                    </ChaletHeroSub>
                </ChaletHeroContent>
            </ChaletHero>

            <PageHeading>
                {chaletsLoading
                    ? 'Loading chalets…'
                    : `${chalets.length} Chalet${chalets.length !== 1 ? 's' : ''} Available`}
            </PageHeading>

            {chaletsLoading ? (
                <EmptyState>Loading chalets…</EmptyState>
            ) : chalets.length === 0 ? (
                <EmptyState>No chalets available at the moment.</EmptyState>
            ) : (
                <ChaletCardsGrid>
                    {chalets.map(c => (
                        <ChaletCard key={c.id} onClick={() => onSelectChalet(c)}>
                            <ChaletImageWrap>
                                {c.images?.[0]?.image
                                    ? <ChaletCardImg src={c.images[0].image} alt={c.title} />
                                    : <ChaletImgPlaceholder />}
                                <ChaletPriceBadge>
                                    CHF {parseFloat(c.price_per_night).toLocaleString('de-CH', { minimumFractionDigits: 0 })}
                                    <span>/night</span>
                                </ChaletPriceBadge>
                            </ChaletImageWrap>
                            <ChaletCardBody>
                                <ChaletCardTitle>{c.title}</ChaletCardTitle>
                                {c.location && (
                                    <ChaletLocation>
                                        📍 {[c.location.city, c.location.country].filter(Boolean).join(', ')}
                                    </ChaletLocation>
                                )}
                                <ChaletStatsRow>
                                    <ChaletStatPill>👥 {c.capacity} {c.capacity === 1 ? 'guest' : 'guests'}</ChaletStatPill>
                                    <ChaletStatPill>🛏 {c.bedrooms} {c.bedrooms === 1 ? 'bed' : 'beds'}</ChaletStatPill>
                                    <ChaletStatPill>🚿 {c.bathrooms} {c.bathrooms === 1 ? 'bath' : 'baths'}</ChaletStatPill>
                                </ChaletStatsRow>
                                {c.description ? (
                                    <ChaletDesc>
                                        {c.description.length > 120 ? c.description.slice(0, 117) + '…' : c.description}
                                    </ChaletDesc>
                                ) : null}
                                {c.amenities?.length > 0 && (
                                    <ChaletAmenities>
                                        {c.amenities.slice(0, 4).map(a => (
                                            <ChaletAmenityTag key={a.id}>{a.name}</ChaletAmenityTag>
                                        ))}
                                        {c.amenities.length > 4 && (
                                            <ChaletAmenityTag $muted>+{c.amenities.length - 4} more</ChaletAmenityTag>
                                        )}
                                    </ChaletAmenities>
                                )}
                            </ChaletCardBody>
                        </ChaletCard>
                    ))}
                </ChaletCardsGrid>
            )}
        </>
    )
}
