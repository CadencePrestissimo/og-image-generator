import { readFileSync } from 'fs';
import marked from 'marked'
import { sanitizeHtml } from './sanitizer'
import { ParsedRequest } from './types'
const twemoji = require('twemoji')
const twOptions = { folder: 'svg', ext: '.svg' }
const emojify = (text: string) => twemoji.parse(text, twOptions)

const sourceRglr = readFileSync(`${__dirname}/../_fonts/SourceSansPro-Regular.woff2`).toString('base64');
const sourceBold = readFileSync(`${__dirname}/../_fonts/SourceSansPro-Bold.woff2`).toString('base64');
const robotoRglr = readFileSync(`${__dirname}/../_fonts/RobotoCondensed-Regular.woff2`).toString('base64');
const robotoBold = readFileSync(`${__dirname}/../_fonts/RobotoCondensed-Bold.woff2`).toString('base64');

function getCss(theme: string, fontFamily: string, fontSize: string) {
  let background = 'white'
  let foreground = 'black'
  let radial = 'lightgray'

  if (theme === 'dark') {
    background = 'black'
    foreground = 'white'
    radial = 'dimgray'
  }
  return `
    @font-face {
        font-family: 'Source Sans Pro';
        font-style:  normal;
        font-weight: normal;
        src: url(data:font/woff2;charset=utf-8;base64,${sourceRglr}) format('woff2');
    }

    @font-face {
        font-family: 'Source Sans Pro';
        font-style:  normal;
        font-weight: bold;
        src: url(data:font/woff2;charset=utf-8;base64,${sourceBold}) format('woff2');
    }

    @font-face {
        font-family: 'Roboto Condensed';
        font-style:  normal;
        font-weight: normal;
        src: url(data:font/woff2;charset=utf-8;base64,${robotoRglr}) format('woff2');
    }

    @font-face {
        font-family: 'Roboto Condensed';
        font-style:  normal;
        font-weight: bold;
        src: url(data:font/woff2;charset=utf-8;base64,${robotoBold}) format('woff2');
    }

    body {
        background: ${background};
        background-image: radial-gradient(circle at 25px 25px, ${radial} 2%, transparent 0%), radial-gradient(circle at 75px 75px, ${radial} 2%, transparent 0%);
        background-size: 100px 100px;
        height: 100vh;
        display: flex;
        text-align: center;
        align-items: center;
        justify-content: center;
    }

    code {
        color: #D400FF;
        font-family: 'Vera';
        white-space: pre-wrap;
        letter-spacing: -5px;
    }

    code:before, code:after {
        content: '\`';
    }

    .logo-wrapper {
        display: flex;
        align-items: center;
        align-content: center;
        justify-content: center;
        justify-items: center;
    }

    .logo {
        margin: 0 75px;
        max-width: 100%;
    }

    .dark-svg {
        filter: invert(100%) sepia(0%) saturate(0%) hue-rotate(12deg) brightness(103%) contrast(103%);
    }

    .plus {
        color: #BBB;
        font-family: Times New Roman, Verdana;
        font-size: 100px;
    }

    .spacer {
        margin: 150px;
    }

    .emoji {
        height: 1em;
        width: 1em;
        margin: 0 .05em 0 .1em;
        vertical-align: -0.1em;
    }

    .heading {
        font-family: '${sanitizeHtml(fontFamily)}', sans-serif;
        font-size: ${sanitizeHtml(fontSize)};
        font-style: normal;
        color: ${foreground};
        line-height: 1.8;
    }`
}

export function getHtml(parsedReq: ParsedRequest) {
  const { text, theme, md, fontFamily, fontSize, images, widths, heights } = parsedReq
  return `<!DOCTYPE html>
<html>
    <meta charset="utf-8">
    <title>Generated Image</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        ${getCss(theme, fontFamily, fontSize)}
    </style>
    <body>
        <div>
            <div class="spacer">
            <div class="logo-wrapper">
                ${images
                  .map(
                    (img, i) =>
                      getPlusSign(i) +
                      getImage(img, theme, widths[i], heights[i])
                  )
                  .join('')}
            </div>
            <div class="spacer">
            <div class="heading">${emojify(
              md ? marked(text) : sanitizeHtml(text)
            )}
            </div>
        </div>
    </body>
</html>`
}

function getImage(src: string, theme: string, width = 'auto', height = '225') {
  return `<img
        class="logo ${theme === 'dark' ? 'dark-svg' : ''}"
        alt="Generated Image"
        src="${sanitizeHtml(src)}"
        width="${sanitizeHtml(width)}"
        height="${sanitizeHtml(height)}"
    />`
}

function getPlusSign(i: number) {
  return i === 0 ? '' : '<div class="plus">+</div>'
}
