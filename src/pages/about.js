import * as React from "react"
import { graphql } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"

import Layout from "../components/layout"
import Seo from "../components/seo"

const Index = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`

  return (
    <Layout location={location} title={siteTitle}>
      <Seo title="About" />
      <h1>About</h1>
      <div>
        <StaticImage
          className="about-avatar"
          layout="fixed"
          formats={["auto"]}
          src="../images/memoji.jpg"
          width={100}
          height={100}
          quality={95}
          alt="Memoji"
        />
        <h2>Hello! 👋</h2>
        <p>
          I'm Henry! Originally from Australia 🇦🇺&nbsp;, I relocated to Saint Louis, MO after I graduated to 
          work as a software engineer in a neuroscience lab.
        </p>
        <p>
          In this blog, I want to document some of my adventures in Saint Louis, just like a journal.
          I'll throw in some technical content as well, but I'll also try and include some photos and 
          posts about my other adventures.
        </p>
        <p>
          In my spare time, I try to get out and about to see all the sights and sounds. Otherwise, I 
          enjoy tinkering with the things I usually talk about on this blog, or trying to learn how to 
          use my espresso machine properly.
        </p>
      </div>
    </Layout>
  )
}

export default Index

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`