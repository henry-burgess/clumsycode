import * as React from "react"

const Header = ({ children }) => {
  return (
    <div
      className="global-header"
    >
      {children}
      <div>
        <a href='/about'>About</a>
      </div>
    </div>
  )
}
 
export default Header