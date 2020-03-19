import Typography from "typography"
import Wordpress2016 from "typography-theme-wordpress-2016"

Wordpress2016.overrideThemeStyles = () => {
  return {
    "a.gatsby-resp-image-link": {
      boxShadow: `none`,
    },
  }
}

delete Wordpress2016.googleFonts

// const typography = new Typography(Wordpress2016)
const typography = new Typography({
  baseFontSize: "18px",
  baseLineHeight: 1.666,
  headerFontFamily: [
    "맑은 고딕",
    "Malgun Gothic",
    "애플 SD 산돌고딕 Neo",
    "Apple SD Gothic Neo",
    "sans-serif",
  ],
  bodyFontFamily: [
    "맑은 고딕",
    "Malgun Gothic",
    "애플 SD 산돌고딕 Neo",
    "Apple SD Gothic Neo",
    "sans-serif",
  ],
})

// Hot reload typography in development.
if (process.env.NODE_ENV !== `production`) {
  typography.injectStyles()
}

export default typography
export const rhythm = typography.rhythm
export const scale = typography.scale