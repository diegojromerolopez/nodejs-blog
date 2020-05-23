import React from 'react'
const Notification = ({ message, notifType }) => {
  if(message !== null){
    return  (
      <div className={notifType}>
        {message}
      </div>
    )
  }
  return ''
}

export default Notification