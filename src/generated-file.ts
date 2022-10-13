import * as jsdom from 'jsdom'
import pretty from 'pretty'
import {
  getFileContent,
  SupportedFileFormats,
  getFileFormat,
} from './utils/files'
import { initalHtml } from './utils/contants'

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
    const { JSDOM } = jsdom
    const dom = new JSDOM(initalHtml)
    const { window } = dom
    const newP = window.document.createElement('p')
    // array to store index of elements containing H1 and H2 markers
    let ignoredIndices: Array<number> = []
    this.content.forEach((line, index) => {
      if (index === 0) {
        window.document.title = line
      }
      // check if line is marked as Heading 1
      if (line.match(/^#\s+/g)) {
        const newH1 = window.document.createElement('h1')
        newH1.innerHTML = line.substring(line.indexOf('#') + 1).trimStart()
        window.document.body.appendChild(newH1)
        ignoredIndices.push(index)
      }
      // check if line is marked as Heading 2
      if (line.match(/^##\s+/g)) {
        const newH2 = window.document.createElement('h2')
        newH2.innerHTML = line.substring(line.indexOf('#') + 2).trimStart()
        window.document.body.appendChild(newH2)
        ignoredIndices.push(index)
      }
      // check if line is marked as an Horizontal line
      if (line.includes('---')) {
        const newHr = window.document.createElement('hr')
        window.document.body.appendChild(newHr)
        ignoredIndices.push(index)
      }
      //check if line line has inline code
      if (line.match(/\`(.*)\`/gim)) {
        const newCode = window.document.createElement('p')
        newCode.innerHTML = line.replace(/\`(.*)\`/gim, '<code>$1</code>')
        window.document.body.appendChild(newCode)
        ignoredIndices.push(index)
      }
    })
    // array to store lines not containing H1 and H2
    let filteredLines: Array<string> = []
    if (this.content.toString().includes('**')) {
      // remove elements that contain H1 and H2 markers
      filteredLines = this.content.filter(function (value, index) {
        return ignoredIndices.indexOf(index) == -1
      })
      let result = this.transformToStrongText(filteredLines.join(' '))
      filteredLines = result
    }

    newP.innerHTML = filteredLines.join(' ')
    window.document.body.appendChild(newP)
    return pretty(dom.serialize())
  }

  private transformToStrongText(lines: string) {
    // regular expression to find all bolded text
    const regexForBold: RegExp = /\*{2}([\w\s\S\n\r]+?)\*{2}/gm
    let content = lines.replace(regexForBold, `<strong>$1</strong>`)
    return content.split('\n')
  }
}

export default GeneratedFile
