import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  html {
    --container-width: 820px;

    // Dark mode
    --border-color: #232429;
    --background-color: #100e0dff;
    --link-color: #EE5D43;
    --surface-color: #201b1aff;
    --text-color: #9c817dff;
    --title-color: #d0b4afff;

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
    background-color: var(--background-color) !important;
  }
  .markdown-body .shiki-unknown {
    color: #e1e1e1 !important;
  }
`;
