import styled from 'styled-components'
import HomeBG from '../../assets/HomeBG.jpg'
import { greeting } from '../../utils/dateHelpers'

const WelcomeBanner = styled.div`
    background: linear-gradient(135deg, #141414 0%, #2b1111 100%);
    border-radius: 14px;
    padding: 1.8rem 2.2rem;
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    box-shadow: 0 4px 18px rgba(0,0,0,0.14);
    position: relative;
    overflow: hidden;
`
const WelcomeBannerBg = styled.img`
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.22;
    border-radius: 14px;
    pointer-events: none;
`
const WelcomeBannerContent = styled.div`
    position: relative;
    z-index: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
`
const WelcomeGreeting = styled.h1`
    font-size: 1.75rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    margin-bottom: 0.25rem;
`
const WelcomeDate = styled.p`
    color: rgba(255,255,255,0.5);
    font-size: 0.88rem;
`
const StatsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.1rem;
    margin-bottom: 2rem;
`
const StatCard = styled.div`
    background: white;
    border-radius: 12px;
    padding: 1.3rem 1.5rem;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    border-left: 4px solid ${({ $accent }) => $accent || '#f30e0e'};
`
const StatLabel = styled.span`
    font-size: 0.72rem;
    font-weight: 700;
    color: #999;
    text-transform: uppercase;
    letter-spacing: 0.08em;
`
const StatValue = styled.span`
    font-size: 2rem;
    font-weight: 800;
    color: #111;
    line-height: 1;
    letter-spacing: -0.03em;
`
const StatSub = styled.span`
    font-size: 0.76rem;
    color: #bbb;
`

export default function HomeView({ user, bookings, upcomingBookings, totalNights, today }) {
    return (
        <>
            <WelcomeBanner>
                <WelcomeBannerBg src={HomeBG} alt="" />
                <WelcomeBannerContent>
                    <div>
                        <WelcomeGreeting>
                            {greeting()}, {user.first_name || user.username || 'Guest'} 👋
                        </WelcomeGreeting>
                        <WelcomeDate>
                            {today.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                        </WelcomeDate>
                    </div>
                </WelcomeBannerContent>
            </WelcomeBanner>

            <StatsGrid>
                <StatCard $accent="#f30e0e">
                    <StatLabel>Total Bookings</StatLabel>
                    <StatValue>{bookings.length}</StatValue>
                    <StatSub>all time</StatSub>
                </StatCard>
                <StatCard $accent="#1e88e5">
                    <StatLabel>Upcoming Trips</StatLabel>
                    <StatValue>{upcomingBookings.length}</StatValue>
                    <StatSub>confirmed &amp; pending</StatSub>
                </StatCard>
                <StatCard $accent="#43a047">
                    <StatLabel>Nights Stayed</StatLabel>
                    <StatValue>{totalNights}</StatValue>
                    <StatSub>across all stays</StatSub>
                </StatCard>
            </StatsGrid>
        </>
    )
}
