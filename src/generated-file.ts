import * as jsdom from 'jsdom'
import pretty from 'pretty'
import { SupportedFileFormats } from './utils/files'
import { initalHtml } from './utils/contants'
import { marked } from 'marked'

class GeneratedFile {
  input: string
  format: SupportedFileFormats
  name: string

  public constructor(
    input: string,
    format: SupportedFileFormats,
    name: string
  ) {
    this.input = input
    this.format = format
    this.name = name
  }

  public getSerializedHtml() {
    if (this.format === '.txt') {
      return this.getSerializedHtmlFromTxt()
    }
    if (this.format === '.md') {
      return this.getSerializedHtmlFromMd()
    }
  }

  private getSerializedHtmlFromTxt() {
    const { JSDOM } = jsdom
    const dom = new JSDOM(initalHtml)
    const { window } = dom
    let paragraphBuffer = ''
    const content = this.input.split(/\r?\n/)
    content.forEach((line, index) => {
      if (
        index === 0 &&
        content.length > 3 &&
        content[1] === '' &&
        content[2] === ''
      ) {
        window.document.title = line
        const newH1 = window.document.createElement('h1')
        newH1.innerHTML = line
        window.document.body.appendChild(newH1)
      } else if (line === '' && paragraphBuffer !== '') {
        const newP = window.document.createElement('p')
        newP.innerHTML = paragraphBuffer
        window.document.body.appendChild(newP)
        paragraphBuffer = ''
      } else {
        paragraphBuffer += line
      }
    })

    return pretty(dom.serialize())
  }

  private getSerializedHtmlFromMd() {
    const parsedHTML = marked.parse(this.input)
    const { JSDOM } = jsdom
    const dom = new JSDOM(GeneratedFile.getWrappedHtml(parsedHTML, this.name))

    return pretty(dom.serialize())
  }

  public static getWrappedHtml(parsedHtml: string, title: string) {
    return `<!doctype html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <title>${title}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
    </head>
    <body>
      ${parsedHtml}
    </body>
    </html>`
  }
}

export default GeneratedFile
