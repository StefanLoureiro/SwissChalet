import { useState, useEffect, useRef } from 'react'
import styled, { keyframes } from 'styled-components'
import { getAccessToken } from '../../services/auth'
import { nightsBetween } from '../../utils/dateHelpers'

const fadeSlideIn = keyframes`
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
`

const ModalOverlay = styled.div`
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.72);
    z-index: 400;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
    backdrop-filter: blur(4px);
`
const ModalBox = styled.div`
    background: white;
    border-radius: 18px;
    width: 100%;
    max-width: 800px;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
    box-shadow: 0 24px 60px rgba(0,0,0,0.4);
    animation: ${fadeSlideIn} 0.22s ease;
`
const ModalCloseBtn = styled.button`
    position: absolute;
    top: 1rem;
    right: 1rem;
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: rgba(255,255,255,0.92);
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #333;
    font-size: 1.05rem;
    font-weight: 700;
    box-shadow: 0 2px 10px rgba(0,0,0,0.18);
    transition: background 0.18s, color 0.18s;
    z-index: 10;
    &:hover { background: #fff; color: #f30e0e; }
`
const ModalGallery = styled.div`
    width: 100%;
    height: 340px;
    background: #1a1a1a;
    border-radius: 18px 18px 0 0;
    overflow: hidden;
    flex-shrink: 0;
`
const ModalMainImg = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
`
const ModalGalleryPlaceholder = styled.div`
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #1a1a1a 0%, #2d3a2d 100%);
`
const ModalThumbRow = styled.div`
    display: flex;
    gap: 8px;
    padding: 0.7rem 1.6rem;
    overflow-x: auto;
    background: #f8f8f8;
    border-bottom: 1px solid #eee;
`
const ModalThumb = styled.img`
    width: 72px;
    height: 54px;
    object-fit: cover;
    border-radius: 7px;
    cursor: pointer;
    flex-shrink: 0;
    opacity: ${({ $active }) => $active ? '1' : '0.52'};
    border: 2.5px solid ${({ $active }) => $active ? '#f30e0e' : 'transparent'};
    transition: opacity 0.18s, border-color 0.18s;
    &:hover { opacity: 1; }
`
const ModalBody = styled.div`
    padding: 1.8rem 2rem 2.2rem;
`
const ModalTitleRow = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 0.5rem;
`
const ModalTitle = styled.h2`
    font-size: 1.55rem;
    font-weight: 700;
    color: #111;
    letter-spacing: -0.02em;
    line-height: 1.25;
`
const ModalPriceBadge = styled.div`
    background: #f30e0e;
    color: white;
    padding: 0.5rem 1.1rem;
    border-radius: 24px;
    font-size: 1.1rem;
    font-weight: 700;
    white-space: nowrap;
    flex-shrink: 0;
    span {
        font-size: 0.74rem;
        font-weight: 400;
        opacity: 0.85;
        margin-left: 2px;
    }
`
const ModalLocation = styled.div`
    font-size: 0.88rem;
    color: #888;
    margin-bottom: 1.3rem;
`
const ModalDivider = styled.hr`
    border: none;
    border-top: 1px solid #f0f0f0;
    margin: 1.3rem 0;
`
const ModalStatsRow = styled.div`
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    margin-bottom: 0.5rem;
`
const ModalStatItem = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.2rem;
    background: #f6f6f6;
    border-radius: 10px;
    padding: 0.9rem 1.4rem;
    min-width: 88px;
`
const ModalStatVal = styled.span`
    font-size: 1.6rem;
    font-weight: 800;
    color: #111;
    line-height: 1;
`
const ModalStatLbl = styled.span`
    font-size: 0.7rem;
    font-weight: 600;
    color: #999;
    text-transform: uppercase;
    letter-spacing: 0.07em;
`
const ModalSectionLabel = styled.h4`
    font-size: 0.7rem;
    font-weight: 700;
    color: #bbb;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 0.65rem;
`
const ModalDesc = styled.p`
    font-size: 0.92rem;
    color: #444;
    line-height: 1.78;
`
const ModalAmenities = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
`
const ModalAmenityTag = styled.span`
    font-size: 0.82rem;
    font-weight: 500;
    padding: 0.32rem 0.85rem;
    border-radius: 8px;
    background: #e8f5e9;
    color: #2e7d32;
`
const BookingSection = styled.div`
    margin-top: 1.4rem;
`
const BookingToggleBtn = styled.button`
    width: 100%;
    padding: 0.85rem 1.4rem;
    background: #f30e0e;
    color: white;
    border: none;
    border-radius: 10px;
    font-size: 0.95rem;
    font-weight: 700;
    cursor: pointer;
    letter-spacing: 0.01em;
    transition: background 0.2s, transform 0.15s;
    &:hover { background: #c90a0a; transform: translateY(-1px); }
`
const BookingFormWrap = styled.form`
    margin-top: 1rem;
    background: #fafafa;
    border: 1.5px solid #ebebeb;
    border-radius: 12px;
    padding: 1.4rem 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
`
const BookingFormGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 0.6fr;
    gap: 0.9rem;
    @media (max-width: 520px) { grid-template-columns: 1fr; }
`
const BookingFormField = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
`
const BookingFormLabel = styled.label`
    font-size: 0.7rem;
    font-weight: 700;
    color: #999;
    text-transform: uppercase;
    letter-spacing: 0.08em;
`
const BookingFormInput = styled.input`
    font-size: 0.92rem;
    color: #222;
    padding: 0.55rem 0.75rem;
    border: 1.5px solid #ddd;
    border-radius: 8px;
    background: #fff;
    outline: none;
    transition: border-color 0.2s;
    &:focus { border-color: #f30e0e; }
`
const BookingFormRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.8rem;
    flex-wrap: wrap;
`
const BookingSummary = styled.span`
    font-size: 0.85rem;
    color: #555;
`
const BookingSubmitBtn = styled.button`
    padding: 0.72rem 1.8rem;
    background: #111;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 0.9rem;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.2s;
    white-space: nowrap;
    &:hover { background: #000; }
    &:disabled { background: #888; cursor: not-allowed; }
`
const ActivityToggleRow = styled.div`
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.75rem 0 0;
    border-top: 1px dashed #e0e0e0;
`
const ActivityToggleCheck = styled.input`
    width: 16px;
    height: 16px;
    accent-color: #f30e0e;
    cursor: pointer;
    flex-shrink: 0;
`
const ActivityToggleLabel = styled.label`
    font-size: 0.88rem;
    font-weight: 600;
    color: #333;
    cursor: pointer;
    user-select: none;
`
const ActivitySelects = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.9rem;
    margin-top: 0.8rem;
    @media (max-width: 520px) { grid-template-columns: 1fr; }
`
const ActivitySelect = styled.select`
    font-size: 0.88rem;
    color: #222;
    padding: 0.55rem 0.75rem;
    border: 1.5px solid #ddd;
    border-radius: 8px;
    background: #fff;
    outline: none;
    cursor: pointer;
    transition: border-color 0.2s;
    &:focus { border-color: #f30e0e; }
    &:disabled { background: #f5f5f5; color: #aaa; }
`
const ActivityNote = styled.p`
    font-size: 0.78rem;
    color: #aaa;
    margin-top: 0.4rem;
    line-height: 1.5;
`
const BookingFeedback = styled.div`
    font-size: 0.85rem;
    font-weight: 500;
    color: ${({ $error }) => $error ? '#c62828' : '#2e7d32'};
    background: ${({ $error }) => $error ? '#ffebee' : '#e8f5e9'};
    padding: 0.6rem 0.9rem;
    border-radius: 8px;
    line-height: 1.5;
`

export default function ChaletModal({ chalet, onClose, userId, onBookingCreated }) {
    const [activeImgIdx, setActiveImgIdx] = useState(0)
    const [showBookingForm, setShowBookingForm] = useState(false)
    const [bookingForm, setBookingForm] = useState({ start_date: '', end_date: '', guests: 1 })
    const [bookingState, setBookingState] = useState({ loading: false, msg: '', error: false, success: false })
    const [addActivity, setAddActivity] = useState(false)
    const [activities, setActivities] = useState([])
    const [activitiesLoading, setActivitiesLoading] = useState(false)
    const [selectedActivityId, setSelectedActivityId] = useState('')
    const [selectedScheduleId, setSelectedScheduleId] = useState('')
    const bookingSectionRef = useRef(null)

    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') onClose() }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [onClose])

    const handleBooking = async (e) => {
        e.preventDefault()
        setBookingState({ loading: true, msg: '', error: false, success: false })
        const token = getAccessToken()
        try {
            const res = await fetch('/api/bookings/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    chalet: chalet.id,
                    user: userId,
                    start_date: bookingForm.start_date,
                    end_date: bookingForm.end_date,
                    guests: parseInt(bookingForm.guests, 10),
                }),
            })
            const data = await res.json()
            if (!res.ok) {
                const firstKey = Object.keys(data)[0]
                const msg = firstKey
                    ? (Array.isArray(data[firstKey]) ? data[firstKey][0] : data[firstKey])
                    : 'Booking failed.'
                throw new Error(msg)
            }
            onBookingCreated(data)

            if (selectedScheduleId) {
                await fetch('/api/activity-bookings/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        chalet_booking: data.id,
                        schedule: parseInt(selectedScheduleId, 10),
                        guests: parseInt(bookingForm.guests, 10),
                    }),
                })
            }

            setBookingState({ loading: false, msg: 'Reservation confirmed! Your stay is now pending approval.', error: false, success: true })
            setShowBookingForm(false)
        } catch (err) {
            setBookingState({ loading: false, msg: err.message, error: true, success: false })
        }
    }

    const handleToggleActivity = () => {
        const opening = !addActivity
        setAddActivity(opening)
        setSelectedActivityId('')
        setSelectedScheduleId('')
        if (opening && activities.length === 0) {
            setActivitiesLoading(true)
            fetch('/api/activities/')
                .then(r => r.json())
                .then(data => {
                    setActivities(Array.isArray(data) ? data : (data.results ?? []))
                    setActivitiesLoading(false)
                })
                .catch(() => setActivitiesLoading(false))
        }
    }

    return (
        <ModalOverlay onClick={onClose}>
            <ModalBox onClick={e => e.stopPropagation()}>
                <ModalCloseBtn onClick={onClose} aria-label="Close">✕</ModalCloseBtn>

                <ModalGallery>
                    {chalet.images?.length > 0
                        ? <ModalMainImg src={chalet.images[activeImgIdx]?.image} alt={chalet.title} />
                        : <ModalGalleryPlaceholder />}
                </ModalGallery>

                {chalet.images?.length > 1 && (
                    <ModalThumbRow>
                        {chalet.images.map((img, i) => (
                            <ModalThumb
                                key={img.id}
                                src={img.image}
                                alt={img.caption || `Image ${i + 1}`}
                                $active={i === activeImgIdx}
                                onClick={() => setActiveImgIdx(i)}
                            />
                        ))}
                    </ModalThumbRow>
                )}

                <ModalBody>
                    <ModalTitleRow>
                        <ModalTitle>{chalet.title}</ModalTitle>
                        <ModalPriceBadge>
                            CHF {parseFloat(chalet.price_per_night).toLocaleString('de-CH', { minimumFractionDigits: 0 })}
                            <span>/night</span>
                        </ModalPriceBadge>
                    </ModalTitleRow>

                    {chalet.location && (
                        <ModalLocation>
                            📍 {[chalet.location.address, chalet.location.city, chalet.location.country].filter(Boolean).join(', ')}
                        </ModalLocation>
                    )}

                    <ModalStatsRow>
                        <ModalStatItem>
                            <ModalStatVal>{chalet.capacity}</ModalStatVal>
                            <ModalStatLbl>👥 {chalet.capacity === 1 ? 'Guest' : 'Guests'}</ModalStatLbl>
                        </ModalStatItem>
                        <ModalStatItem>
                            <ModalStatVal>{chalet.bedrooms}</ModalStatVal>
                            <ModalStatLbl>🛏 {chalet.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}</ModalStatLbl>
                        </ModalStatItem>
                        <ModalStatItem>
                            <ModalStatVal>{chalet.bathrooms}</ModalStatVal>
                            <ModalStatLbl>🚿 {chalet.bathrooms === 1 ? 'Bathroom' : 'Bathrooms'}</ModalStatLbl>
                        </ModalStatItem>
                    </ModalStatsRow>

                    {chalet.description && (
                        <>
                            <ModalDivider />
                            <ModalSectionLabel>About this chalet</ModalSectionLabel>
                            <ModalDesc>{chalet.description}</ModalDesc>
                        </>
                    )}

                    {chalet.amenities?.length > 0 && (
                        <>
                            <ModalDivider />
                            <ModalSectionLabel>Amenities</ModalSectionLabel>
                            <ModalAmenities>
                                {chalet.amenities.map(a => (
                                    <ModalAmenityTag key={a.id}>{a.name}</ModalAmenityTag>
                                ))}
                            </ModalAmenities>
                        </>
                    )}

                    <BookingSection ref={bookingSectionRef}>
                        <ModalDivider />
                        {bookingState.success ? (
                            <BookingFeedback>{bookingState.msg}</BookingFeedback>
                        ) : (
                            <>
                                <BookingToggleBtn
                                    type="button"
                                    onClick={() => {
                                        const opening = !showBookingForm
                                        setShowBookingForm(v => !v)
                                        if (opening) {
                                            setTimeout(() => {
                                                bookingSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
                                            }, 50)
                                        }
                                    }}
                                >
                                    {showBookingForm ? 'Cancel' : 'Reserve this Chalet'}
                                </BookingToggleBtn>

                                {showBookingForm && (
                                    <BookingFormWrap onSubmit={handleBooking}>
                                        <BookingFormGrid>
                                            <BookingFormField>
                                                <BookingFormLabel htmlFor="bk-start">Check-in</BookingFormLabel>
                                                <BookingFormInput
                                                    id="bk-start"
                                                    type="date"
                                                    required
                                                    min={new Date().toISOString().split('T')[0]}
                                                    value={bookingForm.start_date}
                                                    onChange={e => setBookingForm(f => ({ ...f, start_date: e.target.value }))}
                                                />
                                            </BookingFormField>
                                            <BookingFormField>
                                                <BookingFormLabel htmlFor="bk-end">Check-out</BookingFormLabel>
                                                <BookingFormInput
                                                    id="bk-end"
                                                    type="date"
                                                    required
                                                    min={bookingForm.start_date || new Date().toISOString().split('T')[0]}
                                                    value={bookingForm.end_date}
                                                    onChange={e => setBookingForm(f => ({ ...f, end_date: e.target.value }))}
                                                />
                                            </BookingFormField>
                                            <BookingFormField>
                                                <BookingFormLabel htmlFor="bk-guests">Guests</BookingFormLabel>
                                                <BookingFormInput
                                                    id="bk-guests"
                                                    type="number"
                                                    required
                                                    min="1"
                                                    max={chalet.capacity}
                                                    value={bookingForm.guests}
                                                    onChange={e => setBookingForm(f => ({ ...f, guests: e.target.value }))}
                                                />
                                            </BookingFormField>
                                        </BookingFormGrid>

                                        <ActivityToggleRow>
                                            <ActivityToggleCheck
                                                id="bk-add-activity"
                                                type="checkbox"
                                                checked={addActivity}
                                                onChange={handleToggleActivity}
                                            />
                                            <ActivityToggleLabel htmlFor="bk-add-activity">
                                                Add an activity to this stay
                                            </ActivityToggleLabel>
                                        </ActivityToggleRow>

                                        {addActivity && (
                                            <>
                                                <ActivitySelects>
                                                    <BookingFormField>
                                                        <BookingFormLabel htmlFor="bk-activity">Activity</BookingFormLabel>
                                                        <ActivitySelect
                                                            id="bk-activity"
                                                            value={selectedActivityId}
                                                            disabled={activitiesLoading}
                                                            onChange={e => { setSelectedActivityId(e.target.value); setSelectedScheduleId('') }}
                                                        >
                                                            <option value="">{activitiesLoading ? 'Loading…' : '— Select activity —'}</option>
                                                            {activities.map(a => (
                                                                <option key={a.id} value={a.id}>
                                                                    {a.title} · CHF {parseFloat(a.price).toLocaleString('de-CH', { minimumFractionDigits: 0 })} · {a.difficulty}
                                                                </option>
                                                            ))}
                                                        </ActivitySelect>
                                                    </BookingFormField>

                                                    <BookingFormField>
                                                        <BookingFormLabel htmlFor="bk-schedule">Schedule</BookingFormLabel>
                                                        <ActivitySelect
                                                            id="bk-schedule"
                                                            value={selectedScheduleId}
                                                            disabled={!selectedActivityId}
                                                            onChange={e => setSelectedScheduleId(e.target.value)}
                                                        >
                                                            <option value="">— Select date/time —</option>
                                                            {(activities.find(a => String(a.id) === String(selectedActivityId))?.schedules ?? [])
                                                                .filter(s => {
                                                                    if (!bookingForm.start_date || !bookingForm.end_date) return true
                                                                    const sd = new Date(s.start)
                                                                    return sd >= new Date(bookingForm.start_date) && sd <= new Date(bookingForm.end_date)
                                                                })
                                                                .map(s => (
                                                                    <option key={s.id} value={s.id}>
                                                                        {new Date(s.start).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                                                        {s.seats_available != null ? ` · ${s.seats_available} seats left` : ''}
                                                                    </option>
                                                                ))}
                                                        </ActivitySelect>
                                                    </BookingFormField>
                                                </ActivitySelects>
                                                <ActivityNote>Activity booking is optional — leave schedule unselected to skip.</ActivityNote>
                                            </>
                                        )}

                                        <BookingFormRow>
                                            {bookingForm.start_date && bookingForm.end_date && (
                                                <BookingSummary>
                                                    {nightsBetween(bookingForm.start_date, bookingForm.end_date)} night{nightsBetween(bookingForm.start_date, bookingForm.end_date) !== 1 ? 's' : ''}
                                                    {' · '}CHF {(nightsBetween(bookingForm.start_date, bookingForm.end_date) * parseFloat(chalet.price_per_night)).toLocaleString('de-CH', { minimumFractionDigits: 2 })}
                                                </BookingSummary>
                                            )}
                                            <BookingSubmitBtn type="submit" disabled={bookingState.loading}>
                                                {bookingState.loading ? 'Booking…' : 'Confirm Reservation'}
                                            </BookingSubmitBtn>
                                        </BookingFormRow>

                                        {bookingState.msg && bookingState.error && (
                                            <BookingFeedback $error>{bookingState.msg}</BookingFeedback>
                                        )}
                                    </BookingFormWrap>
                                )}
                            </>
                        )}
                    </BookingSection>
                </ModalBody>
            </ModalBox>
        </ModalOverlay>
    )
}
