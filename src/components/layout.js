import React from "react"
import { Link } from "gatsby"
import Bio from "../components/bio" // 내가추가함.
import { rhythm, scale } from "../utils/typography"

const Layout = ({ location, title, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`
  let header

  if (location.pathname === rootPath) {
    header = (
      <h1
        style={{
          ...scale(1.5),
          marginBottom: rhythm(1.5),
          marginTop: 0,
        }}
      >
        <Link
          style={{
            boxShadow: `none`,
            textDecoration: `none`,
            color: `inherit`,
          }}
          to={`/`}
        >
          {title}
        </Link>
      </h1>
    )
  } else {
    header = (
      <h3
        style={{
          marginTop: 0,
        }}
      >
        <Link
          style={{
            boxShadow: `none`,
            textDecoration: `none`,
            color: `inherit`,
          }}
          to={`/`}
        >
          {title}
        </Link>
      </h3>
    )
  }
  return (
    <>
      <div
        style={{
          marginLeft: `auto`,
          marginRight: `auto`,
          maxWidth: rhythm(24),
          padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
        }}
      >
        <header>{header}</header>
        <main
          style={{
            minHeight: rhythm(21), // 으웨...
          }}
        >
          {children}
        </main>
        {/* <footer>
        © {new Date().getFullYear()}, Built with
        {` `}
        <a href="https://www.gatsbyjs.org">Gatsby</a>
      </footer> */}
      </div>
      <footer
        style={{
          backgroundColor: "rgba(0,0,0,0.9)",
          color: "rgba(255, 255, 255, 0.7)",
          margin: `0`,
          // maxWidth: rhythm(24),
          width: "100%",
          paddingLeft: `10%`,
          height: "auto",
          overflow: "hidden",
          // position: "absolute",
          bottom: 0,
        }}
      >
        <Bio />
      </footer>
    </>
  )
}

export default Layout
