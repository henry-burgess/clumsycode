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
          You should follow me on&nbsp;
          <a href={`https://twitter.com/${social?.twitter || ``}`}>
            Twitter
          </a>
          &nbsp;or have a look at my&nbsp;
          <a href={`https://github.com/${social?.github || ``}`}>
            GitHub
          </a>
          .
        </p>
      )}
    </div>
  )
}

export default Bio