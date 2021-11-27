import * as React from "react"

const Header = ({ children }) => {
  return (
    <div
      className="global-header"
    >
      {children}
      <div className="header-items">
        <a href='/tags'>Tags</a>
        <a href='/about'>About</a>
      </div>
    </div>
  )
}
 
export default Header