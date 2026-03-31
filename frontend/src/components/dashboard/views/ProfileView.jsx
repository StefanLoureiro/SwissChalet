import styled from 'styled-components'
import { PageHeading } from '../../../styles/dashboardShared'

const ProfileCard = styled.div`
    background: white;
    border-radius: 14px;
    padding: 2rem 2.2rem;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    max-width: 580px;
    margin-bottom: 1.2rem;
`
const ProfileHeader = styled.div`
    display: flex;
    align-items: center;
    gap: 1.4rem;
    padding-bottom: 1.4rem;
    border-bottom: 1px solid #f0f0f0;
    margin-bottom: 1.4rem;
`
const BigAvatar = styled.div`
    width: 78px; height: 78px;
    border-radius: 50%;
    background: #f30e0e;
    color: white;
    font-size: 1.85rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
`
const ProfileMeta = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
`
const ProfileName = styled.h2`
    font-size: 1.35rem;
    font-weight: 700;
    color: #111;
`
const ProfileUsername = styled.span`
    font-size: 0.88rem;
    color: #aaa;
`
const InfoGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.1rem;
`
const InfoField = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
`
const InfoLabel = styled.span`
    font-size: 0.7rem;
    font-weight: 700;
    color: #bbb;
    text-transform: uppercase;
    letter-spacing: 0.08em;
`
const InfoValue = styled.span`
    font-size: 0.93rem;
    color: #222;
    font-weight: 500;
`
const InfoInput = styled.input`
    font-size: 0.93rem;
    color: #222;
    font-weight: 500;
    padding: 0.5rem 0.7rem;
    border: 1.5px solid #ddd;
    border-radius: 7px;
    outline: none;
    background: #fafafa;
    transition: border-color 0.2s;
    &:focus { border-color: #f30e0e; background: #fff; }
`
const ProfileActions = styled.div`
    display: flex;
    gap: 0.7rem;
    margin-top: 1.4rem;
`
const SaveBtn = styled.button`
    padding: 0.62rem 1.4rem;
    background: #f30e0e;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 0.88rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
    &:hover { background: #c90a0a; }
    &:disabled { background: #f8a0a0; cursor: not-allowed; }
`
const CancelBtn = styled.button`
    padding: 0.62rem 1.4rem;
    background: none;
    color: #666;
    border: 1.5px solid #ddd;
    border-radius: 8px;
    font-size: 0.88rem;
    font-weight: 500;
    cursor: pointer;
    transition: border-color 0.2s, color 0.2s;
    &:hover { border-color: #bbb; color: #333; }
`
const EditBtn = styled.button`
    padding: 0.62rem 1.4rem;
    background: none;
    color: #333;
    border: 1.5px solid #ddd;
    border-radius: 8px;
    font-size: 0.88rem;
    font-weight: 500;
    cursor: pointer;
    margin-top: 1.4rem;
    transition: border-color 0.2s, color 0.2s;
    &:hover { border-color: #f30e0e; color: #f30e0e; }
`
const SaveFeedback = styled.span`
    font-size: 0.82rem;
    color: ${({ $error }) => $error ? '#f30e0e' : '#2e7d32'};
    align-self: center;
`

export default function ProfileView({ user, initials, displayName, editing, editForm, setEditForm, saveState, startEditing, cancelEditing, handleSave }) {
    return (
        <>
            <PageHeading>Guest Profile</PageHeading>
            <ProfileCard>
                <ProfileHeader>
                    <BigAvatar>{initials}</BigAvatar>
                    <ProfileMeta>
                        <ProfileName>{displayName}</ProfileName>
                        <ProfileUsername>@{user.username}</ProfileUsername>
                    </ProfileMeta>
                </ProfileHeader>
                <form onSubmit={handleSave}>
                    <InfoGrid>
                        <InfoField>
                            <InfoLabel>First Name</InfoLabel>
                            {editing
                                ? <InfoInput value={editForm.first_name} onChange={e => setEditForm(f => ({ ...f, first_name: e.target.value }))} />
                                : <InfoValue>{user.first_name || '—'}</InfoValue>}
                        </InfoField>
                        <InfoField>
                            <InfoLabel>Last Name</InfoLabel>
                            {editing
                                ? <InfoInput value={editForm.last_name} onChange={e => setEditForm(f => ({ ...f, last_name: e.target.value }))} />
                                : <InfoValue>{user.last_name || '—'}</InfoValue>}
                        </InfoField>
                        <InfoField>
                            <InfoLabel>Username</InfoLabel>
                            <InfoValue>{user.username || '—'}</InfoValue>
                        </InfoField>
                        <InfoField>
                            <InfoLabel>Email</InfoLabel>
                            {editing
                                ? <InfoInput type="email" value={editForm.email} onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))} />
                                : <InfoValue>{user.email || '—'}</InfoValue>}
                        </InfoField>
                    </InfoGrid>
                    {editing ? (
                        <ProfileActions>
                            <SaveBtn type="submit" disabled={saveState.loading}>
                                {saveState.loading ? 'Saving…' : 'Save Changes'}
                            </SaveBtn>
                            <CancelBtn type="button" onClick={cancelEditing}>Cancel</CancelBtn>
                            {saveState.msg && <SaveFeedback $error={saveState.error}>{saveState.msg}</SaveFeedback>}
                        </ProfileActions>
                    ) : (
                        <>
                            <EditBtn type="button" onClick={startEditing}>Edit Profile</EditBtn>
                            {saveState.msg && <SaveFeedback $error={saveState.error} style={{ marginLeft: '1rem' }}>{saveState.msg}</SaveFeedback>}
                        </>
                    )}
                </form>
            </ProfileCard>
        </>
    )
}
