import * as jsdom from 'jsdom'
import pretty from 'pretty'
import {
  getFileContent,
  SupportedFileFormats,
  getFileFormat,
} from './utils/files'
import { initalHtml } from './utils/contants'
import { marked } from 'marked'
import path from 'path'

class GeneratedFile {
  filePath: string
  content: string[]
  fileFormat: SupportedFileFormats

  public constructor(filePath: string) {
    this.filePath = filePath
    this.content = getFileContent(filePath)
    this.fileFormat = getFileFormat(filePath)
  }

  public getSerializedHtml() {
    if (this.fileFormat === '.txt') {
      return this.getSerializedHtmlFromTxt()
    }
    if (this.fileFormat === '.md') {
      return this.getSerializedHtmlFromMd()
    }
  }

  private getSerializedHtmlFromTxt() {
    const { JSDOM } = jsdom
    const dom = new JSDOM(initalHtml)
    const { window } = dom

    let paragraphBuffer = ''
    this.content.forEach((line, index) => {
      if (
        index === 0 &&
        this.content.length > 3 &&
        this.content[1] === '' &&
        this.content[2] === ''
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
    const parsedHTML = marked.parse(this.content.join('\n'))
    const { JSDOM } = jsdom
    const dom = new JSDOM(
      this.getWrappedHtml(parsedHTML, path.parse(this.filePath).name)
    )

    return pretty(dom.serialize())
  }

  private getWrappedHtml(parsedHtml: string, title: string) {
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
