import styled from 'styled-components'
import Mountain from '../../assets/Mountain.png'
import { HomeIcon, CalendarIcon, UserIcon, SignOutIcon, CompassIcon, ChaletIcon } from '../icons/DashboardIcons'

export const SIDEBAR_W = '240px'
export const NAV_H = '60px'

const Sidebar = styled.aside`
    position: sticky;
    top: ${NAV_H};
    width: ${SIDEBAR_W};
    height: calc(100vh - ${NAV_H});
    flex-shrink: 0;
    background: #1a1a1a;
    display: flex;
    flex-direction: column;
    z-index: 150;
    overflow-y: auto;
`
const SidebarProfile = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.3rem;
    padding: 1.6rem 1.2rem 1.4rem;
    border-bottom: 1px solid rgba(255,255,255,0.07);
`
const Avatar = styled.div`
    width: 58px; height: 58px;
    border-radius: 50%;
    background: #f30e0e;
    color: white;
    font-size: 1.35rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0.2rem;
    flex-shrink: 0;
`
const AvatarName = styled.span`
    color: white;
    font-weight: 600;
    font-size: 0.95rem;
    text-align: center;
`
const SidebarNav = styled.nav`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
    padding: 1rem 0.7rem 0;
`
const SidebarItem = styled.button`
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.72rem 1rem;
    border-radius: 8px;
    background: ${({ $active }) => $active ? 'rgba(243,14,14,0.14)' : 'transparent'};
    color: ${({ $active, $signout }) =>
        $signout ? '#ff7070' : $active ? '#f30e0e' : 'rgba(255,255,255,0.65)'};
    border: none;
    cursor: pointer;
    font-size: 0.88rem;
    font-weight: ${({ $active }) => $active ? '600' : '400'};
    text-align: left;
    width: 100%;
    transition: background 0.18s, color 0.18s;
    &:hover {
        background: ${({ $signout }) => $signout ? 'rgba(255,112,112,0.1)' : 'rgba(255,255,255,0.07)'};
        color: ${({ $active, $signout }) => $signout ? '#ff7070' : $active ? '#f30e0e' : 'white'};
    }
`
const SidebarBottom = styled.div`
    padding: 0 0.7rem 1.2rem;
`

const NAV_ITEMS = [
    { id: 'home', label: 'Home', icon: <HomeIcon /> },
    { id: 'reservations', label: 'Reservations', icon: <CalendarIcon /> },
    { id: 'chalets', label: 'Chalets', icon: <ChaletIcon /> },
    { id: 'activities', label: 'Activities', icon: <CompassIcon /> },
    { id: 'profile', label: 'Guest Profile', icon: <UserIcon /> },
]

export default function DashboardSidebar({ initials, displayName, activeTab, onNavigate, onSignOut }) {
    return (
        <Sidebar>
            <SidebarProfile>
                <Avatar>{initials}</Avatar>
                <AvatarName>{displayName}</AvatarName>
            </SidebarProfile>

            <SidebarNav>
                {NAV_ITEMS.map(item => (
                    <SidebarItem
                        key={item.id}
                        $active={activeTab === item.id}
                        onClick={() => onNavigate(item.id)}
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </SidebarItem>
                ))}
            </SidebarNav>

            <SidebarBottom>
                <SidebarItem $signout onClick={onSignOut}>
                    <SignOutIcon />
                    <span>Sign Out</span>
                </SidebarItem>
            </SidebarBottom>
        </Sidebar>
    )
}
