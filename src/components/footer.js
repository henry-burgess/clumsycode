import * as React from "react"

const Footer = () => {
  return (
    <footer>
        <div>
          <a href='https://twitter.com/henryjburg'>twitter</a>
        </div>
        <div>
          <a href='https://github.com/henry-burgess'>github</a>
        </div>
        <div>
          <a href='rss.xml'>rss</a>
        </div>
        <div>
          © {new Date().getFullYear()}, Built with
          {` `}
          <a href="https://www.gatsbyjs.com">Gatsby</a>
        </div>
      </footer>
   )
 }
 
 export default Footer