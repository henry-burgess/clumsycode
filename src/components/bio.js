import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"

const Bio = () => {
  const data = useStaticQuery(graphql`
    query BioQuery {
      site {
        siteMetadata {
          author {
            name
            summary
          }
          social {
            twitter
            github
          }
        }
      }
    }
  `)

  const author = data.site.siteMetadata?.author
  const social = data.site.siteMetadata?.social

  return (
    <div className="bio">
      <StaticImage
        className="bio-avatar"
        layout="fixed"
        formats={["auto"]}
        src="../images/memoji.jpg"
        width={50}
        height={50}
        quality={95}
        alt="Memoji"
      />
      {author?.name && (
        <p>
          A blog written by <strong>{author.name}</strong> {author?.summary || null}
          {` `}
          <a href={`https://twitter.com/${social?.twitter || ``}`}>
            You should follow me on Twitter
          </a>
          {` or `}
          <a href={`https://github.com/${social?.github || ``}`}>
            have a look at my GitHub
          </a>
        </p>
      )}
    </div>
  )
}

export default Bio