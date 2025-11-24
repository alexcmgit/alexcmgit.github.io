import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  html {
    --container-width: 720px;

    // Dark mode (purple theme)
    // --border-color:     #3E2A6Bff;   /* darkened deep-purple 700-ish */
    // --background-color: #110E17ff;   /* deep, neutral-purple black */
    // --surface-color:    #1C1524ff;   /* slightly lifted surface */
    // --link-color:       #8a49fcff;   /* Google Deep Purple 500 (accent) */
    // --text-color:       #C7BEE0ff;   /* desaturated light lavender-gray */
    // --title-color:      #E6DFF6ff;   /* bright soft lavender (header) */

    // Dark mode (blue theme)
    // --border-color:     #154A75ff;   /* darker, muted blue */
    // --background-color: #0B1116ff;   /* deep blue-tinted black */
    // --surface-color:    #141C24ff;   /* lifted dark blue card surface */
    // --link-color:       #1E88E5ff;   /* Google Blue accent */
    // --text-color:       #BFD2E6ff;   /* soft blue-gray text */
    // --title-color:      #E3EDF7ff;   /* light, high-contrast blue-white */

    // Dark mode (pink theme)
    // --border-color:     #6B2D3Fff;   /* deep muted pink/burgundy */
    // --background-color: #150D10ff;   /* dark, slightly rosy-black */
    // --surface-color:    #22161Cff;   /* lifted dark surface with a warm tint */
    // --link-color:       #E91E63ff;   /* Google Material Pink accent */
    // --text-color:       #E5C6CFff;   /* soft rosy-gray text */
    // --title-color:      #F6DEE7ff;   /* bright pink-white for headers */

    // Dark mode (pink #ff8da1 theme)
    --border-color:     #7A4E58ff;   /* muted deep rose, desaturated & darker */
    --background-color: #130E10ff;   /* dark rosy-black */
    --surface-color:    #20171Aff;   /* elevated, still low saturation */
    --link-color:       #FF8DA1ff;   /* your accent color */
    --text-color:       #E3CCD1ff;   /* soft pinkish light gray */
    --title-color:      #F7E3E7ff;   /* bright pink-white for headers */



    // Light mode - Nature
    // --border-color: #1F8A70;
    // --background-color: #DDFFBB;
    // --link-color: #1F8A70;
    // --surface-color: #DDFFBB;
    // --text-color: #41644A;
    // --title-color: #263A29;

    // Light mode - Default
    // --border-color: #f5f5f5;
    // --background-color: #FFFFFF;
    // --link-color: #1F8A70;
    // --surface-color: #FbFbFb;
    // --text-color: #061b16;
    // --title-color: #030d0b;

    background: var(--background-color);
  }

  .gria-image-wrapper {
    // background: red !important;
    // min-width: 0;
    // max-height: 50vh;
  }

  html,
  body {
    font-family: 'Roboto Mono', serif;

    padding: 0;
    margin: 0;
    box-sizing: border-box;

    color: var(--text-color);
  }

  a {
    color: var(--link-color);
    text-decoration: none;
  }

  html .shiki,
  html .shiki span {
    color: var(--shiki-dark) !important;
    /* Optional, if you also want font styles */
    font-family: "JetBrains Mono";
    font-style: var(--shiki-dark-font-style) !important;
    font-weight: var(--shiki-dark-font-weight) !important;
    text-decoration: var(--shiki-dark-text-decoration) !important;
  }
  .markdown-body .shiki, .markdown-body .shiki-unknown {
    background-color: var(--surface-color) !important;
  }
  .markdown-body .shiki-unknown {
    color: #e1e1e1 !important;
  }
`;
