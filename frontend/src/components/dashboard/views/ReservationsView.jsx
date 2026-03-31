import styled from 'styled-components'
import { PageHeading, EmptyState } from '../../../styles/dashboardShared'
import { formatDate, nightsBetween } from '../../../utils/dateHelpers'

const FilterRow = styled.div`
    display: flex;
    gap: 0.45rem;
    margin-bottom: 1.4rem;
`
const FilterTab = styled.button`
    padding: 0.42rem 1.05rem;
    border-radius: 20px;
    border: none;
    background: ${({ $active }) => $active ? '#1a1a1a' : '#e4e4e4'};
    color: ${({ $active }) => $active ? 'white' : '#666'};
    font-size: 0.82rem;
    font-weight: ${({ $active }) => $active ? '600' : '400'};
    cursor: pointer;
    transition: background 0.18s, color 0.18s;
    &:hover { background: ${({ $active }) => $active ? '#111' : '#d0d0d0'}; }
`
const BookingCard = styled.div`
    background: white;
    border-radius: 12px;
    padding: 1.3rem 1.5rem;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    margin-bottom: 0.9rem;
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 1.2rem;
    align-items: center;
    transition: box-shadow 0.2s;
    &:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.09); }
`
const BookingInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
`
const BookingTitle = styled.span`
    font-weight: 600;
    font-size: 0.98rem;
    color: #111;
`
const BookingMeta = styled.span`
    font-size: 0.82rem;
    color: #888;
`
const BookingRight = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.45rem;
`
const StatusBadge = styled.span`
    font-size: 0.72rem;
    font-weight: 700;
    padding: 0.22rem 0.65rem;
    border-radius: 20px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    background: ${({ $s }) =>
        $s === 'confirmed' ? '#e8f5e9' : $s === 'pending' ? '#fff8e1' : '#ffebee'};
    color: ${({ $s }) =>
        $s === 'confirmed' ? '#2e7d32' : $s === 'pending' ? '#e65100' : '#c62828'};
`
const BookingPrice = styled.span`
    font-size: 1.05rem;
    font-weight: 700;
    color: #111;
`
const CancelBookingBtn = styled.button`
    font-size: 0.75rem;
    font-weight: 600;
    padding: 0.28rem 0.75rem;
    border-radius: 20px;
    border: 1.5px solid #f30e0e;
    background: transparent;
    color: #f30e0e;
    cursor: pointer;
    transition: background 0.18s, color 0.18s;
    white-space: nowrap;
    &:hover { background: #f30e0e; color: white; }
    &:disabled { opacity: 0.5; cursor: not-allowed; }
`
const ActivityBookingRow = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    margin-top: 0.4rem;
`
const ActivityBookingPill = styled.span`
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    font-size: 0.74rem;
    font-weight: 600;
    padding: 0.2rem 0.6rem;
    border-radius: 6px;
    background: #e8f0ff;
    color: #1a56db;
    letter-spacing: 0.01em;
`

export default function ReservationsView({ filteredBookings, loading, reservFilter, setReservFilter, cancellingId, handleCancelBooking, today }) {
    return (
        <>
            <PageHeading>My Reservations</PageHeading>
            <FilterRow>
                {['all', 'upcoming', 'past', 'cancelled'].map(f => (
                    <FilterTab key={f} $active={reservFilter === f} onClick={() => setReservFilter(f)}>
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                    </FilterTab>
                ))}
            </FilterRow>

            {loading ? (
                <EmptyState>Loading reservations…</EmptyState>
            ) : filteredBookings.length === 0 ? (
                <EmptyState>No reservations found.</EmptyState>
            ) : (
                filteredBookings.map(b => (
                    <BookingCard key={b.id}>
                        <BookingInfo>
                            <BookingTitle>
                                {b.chalet_title || `Chalet #${b.chalet}`}
                            </BookingTitle>
                            <BookingMeta>
                                {formatDate(b.start_date)} → {formatDate(b.end_date)}
                                &nbsp;·&nbsp;{b.nights ?? nightsBetween(b.start_date, b.end_date)} nights
                                &nbsp;·&nbsp;{b.guests} {b.guests === 1 ? 'guest' : 'guests'}
                            </BookingMeta>
                            <BookingMeta>Booked {formatDate(b.created)}</BookingMeta>
                            {b.activity_bookings?.length > 0 && (
                                <ActivityBookingRow>
                                    {b.activity_bookings.map(ab => (
                                        <ActivityBookingPill key={ab.id}>
                                            🏔 {ab.activity_title}
                                            {ab.schedule_start && (
                                                <span style={{ fontWeight: 400, opacity: 0.75 }}>
                                                    &nbsp;·&nbsp;{new Date(ab.schedule_start).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                                                </span>
                                            )}
                                        </ActivityBookingPill>
                                    ))}
                                </ActivityBookingRow>
                            )}
                        </BookingInfo>
                        <BookingRight>
                            <StatusBadge $s={b.status}>{b.status}</StatusBadge>
                            <BookingPrice>
                                CHF {parseFloat(b.total_price ?? 0).toLocaleString('de-CH', { minimumFractionDigits: 2 })}
                            </BookingPrice>
                            {b.status !== 'cancelled' && new Date(b.start_date) >= today && (
                                <CancelBookingBtn
                                    disabled={cancellingId === b.id}
                                    onClick={() => handleCancelBooking(b.id)}
                                >
                                    {cancellingId === b.id ? 'Cancelling…' : 'Cancel'}
                                </CancelBookingBtn>
                            )}
                        </BookingRight>
                    </BookingCard>
                ))
            )}
        </>
    )
}
