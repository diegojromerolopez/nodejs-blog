import React, { useState } from 'react'

const Togglable = props => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
    if(visible && props.onVisible){
      props.onVisible()
    }
    if(!visible && props.onHidden){
      props.onHidden()
    }
  }

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{props.viewButtonLabel || 'view'}</button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button onClick={toggleVisibility}>{props.hideButtonLabel || 'hide'}</button>
      </div>
    </div>
  )
}

Togglable.displayName = 'Togglable'

export default Togglable