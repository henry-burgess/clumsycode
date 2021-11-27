import * as React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"

const Index = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`

  return (
    <Layout location={location} title={siteTitle}>
      <Seo title="About" />
      <h1>About</h1>
      <div>
        <h2>Who am I?</h2>
        <p>
          I'm Henry. Originally from Australia, I relocated to Saint Louis, MO after I graduated to 
          work as a software engineer in a neuroscience lab.
        </p>
        <p>
          In this blog, I want to document some of my adventures in Saint Louis, just like a journal.
          I'll throw in some technical content as well, but I'll also try and include some photos and 
          posts about my other adventures.
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