import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'
import Mountain from '../assets/Mountain.png'

// ── hooks ─────────────────────────────────────────────────────────────────────
import { useDashboardData } from '../hooks/useDashboardData'
import { useChalets } from '../hooks/useChalets'
import { useProfile } from '../hooks/useProfile'

// ── shared helpers ─────────────────────────────────────────────────────────────
import { nightsBetween } from '../utils/dateHelpers'

// ── dashboard sub-components ──────────────────────────────────────────────────
import DashboardSidebar, { SIDEBAR_W, NAV_H } from '../components/dashboard/DashboardSidebar'
import ChaletModal from '../components/dashboard/ChaletModal'

// ── tab views ─────────────────────────────────────────────────────────────────
import HomeView from '../components/dashboard/views/HomeView'
import ReservationsView from '../components/dashboard/views/ReservationsView'
import ChaletsView from '../components/dashboard/views/ChaletsView'
import ActivitiesView from '../components/dashboard/views/ActivitiesView'
import AboutView from '../components/dashboard/views/AboutView'
import FaqsView from '../components/dashboard/views/FaqsView'
import ContactsView from '../components/dashboard/views/ContactsView'
import ProfileView from '../components/dashboard/views/ProfileView'

// ── layout ────────────────────────────────────────────────────────────────────

const fadeSlideIn = keyframes`
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
`

const PageWrapper = styled.div`
    background: #f0f2f5;
    min-height: 100vh;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    padding-top: ${NAV_H};
`

const BodyRow = styled.div`
    display: flex;
    align-items: flex-start;
`

/* ─ Navbar brand strip (inside sidebar at top) ─ */
const NavBrand = styled.div`
    position: fixed;
    top: 0; left: 0;
    width: ${SIDEBAR_W};
    height: ${NAV_H};
    display: flex;
    align-items: center;
    gap: 0.55rem;
    padding: 0 1.4rem;
    background: #111;
    cursor: pointer;
    z-index: 201;
    border-bottom: 1px solid rgba(255,255,255,0.06);
`
const NavBrandImg = styled.img`
    height: 2.1rem;
    filter: brightness(0) invert(1);
`
const NavBrandText = styled.span`
    color: white;
    font-size: 1rem;
    font-weight: 600;
    white-space: nowrap;
    letter-spacing: 0.01em;
`

/* ─ Top bar (right of sidebar) ─ */
const TopNav = styled.nav`
    position: fixed;
    top: 0;
    left: ${SIDEBAR_W};
    right: 0;
    height: ${NAV_H};
    background: #fff;
    border-bottom: 1px solid #e8e8e8;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 2rem;
    z-index: 200;
    box-shadow: 0 1px 4px rgba(0,0,0,0.05);
`
const NavLinks = styled.div`
    display: flex;
    align-items: center;
    gap: 2rem;
`
const NavLink = styled.button`
    background: none;
    border: none;
    font-size: 0.9rem;
    font-weight: 500;
    color: #444;
    cursor: pointer;
    padding: 0.3rem 0;
    border-bottom: 2px solid transparent;
    transition: color 0.2s, border-color 0.2s;
    &:hover {
        color: #f30e0e;
        border-bottom-color: #f30e0e;
    }
`
const NavRight = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
`

const Main = styled.main`
    flex: 1;
    min-width: 0;
`
const Content = styled.div`
    padding: 2.2rem 2.5rem;
    max-width: 1160px;
    animation: ${fadeSlideIn} 0.25s ease;
`

const BackToTopBtn = styled.button`
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: #ff0000;
    color: white;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 14px rgba(243,14,14,0.35);
    opacity: ${({ $visible }) => $visible ? '1' : '0'};
    pointer-events: ${({ $visible }) => $visible ? 'auto' : 'none'};
    transform: ${({ $visible }) => $visible ? 'translateY(0)' : 'translateY(12px)'};
    transition: opacity 0.25s, transform 0.25s;
    z-index: 300;
    font-size: 1.2rem;
    line-height: 1;
    &:hover { background: #c90a0a; transform: translateY(-2px); }
`

// ── component ─────────────────────────────────────────────────────────────────
function Dashboard() {
    const navigate = useNavigate()
    const { tab } = useParams()
    const activeTab = tab || 'home'

    const [selectedChalet, setSelectedChalet] = useState(null)
    const [showTop, setShowTop] = useState(false)
    const [reservFilter, setReservFilter] = useState('all')

    const { user, setUser, bookings, setBookings, loading, handleSignOut, handleCancelBooking, cancellingId } = useDashboardData()
    const { chalets, chaletsLoading } = useChalets(activeTab)
    const profileProps = useProfile(user, setUser)

    useEffect(() => {
        const onScroll = () => setShowTop(window.scrollY > 300)
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    const today = new Date()
    const upcomingBookings = bookings.filter(b => b.status !== 'cancelled' && new Date(b.start_date) >= today)
    const pastBookings = bookings.filter(b => new Date(b.end_date) < today)
    const totalNights = pastBookings.reduce((sum, b) => sum + nightsBetween(b.start_date, b.end_date), 0)

    const displayName = user.first_name
        ? `${user.first_name}${user.last_name ? ' ' + user.last_name : ''}`
        : user.username || 'Guest'
    const initials = (
        (user.first_name?.[0] ?? '') + (user.last_name?.[0] ?? '')
    ).toUpperCase() || user.username?.[0]?.toUpperCase() || 'G'

    const filteredBookings =
        reservFilter === 'upcoming' ? upcomingBookings
            : reservFilter === 'past' ? pastBookings
                : reservFilter === 'cancelled' ? bookings.filter(b => b.status === 'cancelled')
                    : bookings

    return (
        <PageWrapper>
            <NavBrand onClick={() => { navigate('/dashboard/home'); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>
                <NavBrandImg src={Mountain} alt="Logo" />
                <NavBrandText>The SwissChalet</NavBrandText>
            </NavBrand>

            <TopNav>
                <NavLinks>
                    <NavLink onClick={() => navigate('/dashboard/about')}>About</NavLink>
                    <NavLink onClick={() => navigate('/dashboard/faqs')}>FAQs</NavLink>
                    <NavLink onClick={() => navigate('/dashboard/contacts')}>Contacts</NavLink>
                </NavLinks>
                <NavRight />
            </TopNav>

            <BodyRow>
                <DashboardSidebar
                    initials={initials}
                    displayName={displayName}
                    activeTab={activeTab}
                    onNavigate={(t) => navigate(`/dashboard/${t}`)}
                    onSignOut={handleSignOut}
                />
                <Main>
                    <Content key={activeTab}>
                        {activeTab === 'home' && (
                            <HomeView
                                user={user}
                                bookings={bookings}
                                upcomingBookings={upcomingBookings}
                                totalNights={totalNights}
                                today={today}
                            />
                        )}
                        {activeTab === 'reservations' && (
                            <ReservationsView
                                filteredBookings={filteredBookings}
                                loading={loading}
                                reservFilter={reservFilter}
                                setReservFilter={setReservFilter}
                                cancellingId={cancellingId}
                                handleCancelBooking={handleCancelBooking}
                                today={today}
                            />
                        )}
                        {activeTab === 'chalets' && (
                            <ChaletsView
                                chalets={chalets}
                                chaletsLoading={chaletsLoading}
                                onSelectChalet={setSelectedChalet}
                            />
                        )}
                        {activeTab === 'activities' && <ActivitiesView />}
                        {activeTab === 'about' && <AboutView />}
                        {activeTab === 'faqs' && <FaqsView />}
                        {activeTab === 'contacts' && <ContactsView />}
                        {activeTab === 'profile' && (
                            <ProfileView
                                user={user}
                                initials={initials}
                                displayName={displayName}
                                {...profileProps}
                            />
                        )}
                    </Content>
                </Main>
            </BodyRow>

            {selectedChalet && (
                <ChaletModal
                    key={selectedChalet.id}
                    chalet={selectedChalet}
                    onClose={() => setSelectedChalet(null)}
                    userId={user.id}
                    onBookingCreated={(booking) => setBookings(prev => [booking, ...prev])}
                />
            )}

            <BackToTopBtn
                $visible={showTop}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                aria-label="Back to top"
            >
                ↑
            </BackToTopBtn>
        </PageWrapper>
    )
}

export default Dashboard
