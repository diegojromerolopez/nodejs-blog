import React from 'react'
const Logout = ({ handleLogout, user }) => (
  <div>
    <form onSubmit={handleLogout}>
      <div>
        {user.username} logged in
      </div>
      <button type="submit">logout</button>
    </form>
  </div>
)

export default Logout