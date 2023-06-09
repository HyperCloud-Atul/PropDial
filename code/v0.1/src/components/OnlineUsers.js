import { useState } from 'react';
import { useCollection } from '../hooks/useCollection'

// components
import Avatar from './Avatar'

// styles
import './OnlineUsers.css'

export default function OnlineUsers(props) {
  const { isPending, error, documents } = useCollection('users');

  const [onlineUsers, setOnlineUsers] = useState(false);
  function openOnlineUser() {
    setOnlineUsers(!onlineUsers);
    props.setFlag(onlineUsers);
  }

  return (
    <div className={onlineUsers ? 'user-list open' : 'user-list'}>
      <div className="user-list-arrow" onClick={openOnlineUser}>
        <span className="material-symbols-outlined" style={{ transition: '1s', transform: onlineUsers ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          arrow_back
        </span>
      </div>
      <div className='user-list-content'>
        <div className='user-list-content-inner'>
          <h2>All Users</h2>
          {isPending && <div>Loading users...</div>}
          {error && <div>{error}</div>}
          {documents && documents.map(user => (
            <div key={user.id} className="user-list-item">
              {user.online && <span className="online-user"></span>}
              <span>{user.displayName}</span>
              <Avatar src={user.photoURL} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
