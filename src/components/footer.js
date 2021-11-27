import * as React from "react"

import { FaInstagram, FaTwitter, FaGithub, FaRss } from "react-icons/fa"

const Footer = () => {
  return (
    <footer>
      <div className="footer-social">
        <div className="footer-item">
          <FaInstagram className="footer-icon"/><a href='https://www.instagram.com/henryjburg/'>Instagram</a>
        </div>
        <div className="footer-item">
          <FaTwitter className="footer-icon"/><a href='https://twitter.com/henryjburg'>Twitter</a>
        </div>
        <div className="footer-item">
          <FaGithub className="footer-icon"/><a href='https://github.com/henry-burgess'>GitHub</a>
        </div>
        <div className="footer-item">
          <FaRss className="footer-icon"/><a href='rss.xml'>RSS</a>
        </div>
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