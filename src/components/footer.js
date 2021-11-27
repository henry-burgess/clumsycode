import * as React from "react"

import { FaTwitter, FaGithub, FaRss } from "react-icons/fa"

const Footer = () => {
  return (
    <footer>
      <div className="footer-item">
        <FaTwitter className="footer-icon"/><a href='https://twitter.com/henryjburg'>twitter</a>
      </div>
      <div className="footer-item">
        <FaGithub className="footer-icon"/><a href='https://github.com/henry-burgess'>github</a>
      </div>
      <div className="footer-item">
        <FaRss className="footer-icon"/><a href='rss.xml'>rss</a>
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