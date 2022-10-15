#!/usr/bin/env node

import * as fs from 'fs'
import * as path from 'path'
import * as jsdom from 'jsdom'
import pretty from 'pretty'
import { configurateProgram } from './program'
import { initalHtml, helpMessage } from './contants'
import pjson from '../package.json'

function getAllFiles(
  dirPath: string,
  arrayOfFiles: Array<string> | undefined = undefined
) {
  const files = fs.readdirSync(dirPath)

  arrayOfFiles = arrayOfFiles || []

  files.forEach(function (file) {
    if (fs.statSync(dirPath + '/' + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + '/' + file, arrayOfFiles)
    } else if (arrayOfFiles) {
      arrayOfFiles.push(path.join(dirPath, '/', file))
    }
  })

  return arrayOfFiles
}

function filterTxtFiles(files: Array<string>): Array<string> {
  return files.filter(file => path.extname(file) === '.txt')
}

function filterMdFiles(files: Array<string>): Array<string> {
  return files.filter(file => path.extname(file) === '.md')
}

function printCommandHelp() {
  console.log(helpMessage)
}

function printCommandVersion() {
  console.log(`
    App Name: Izyum
    Verion: ${pjson.version}
  `)
}

function prepearDistFolder() {
  fs.rmSync('./dist', { recursive: true, force: true })
  fs.mkdirSync('./dist')
}

function transformToStrongText(lines: string) {
  // regular expression to find all bolded text
  const regexForBold: RegExp = /\*{2}([\w\s\S\n\r]+?)\*{2}/gm
  let content = lines.replace(regexForBold, `<strong>$1</strong>`)
  return content.split('\n')
}
// function to process Markdown files
function transformMdToSerializedHtml(lines: Array<string>) {
  const { JSDOM } = jsdom
  const dom = new JSDOM(initalHtml)
  const { window } = dom
  const newP = window.document.createElement('p')
  // array to store index of elements containing H1 and H2 markers
  let ignoredIndices: Array<number> = []
  lines.forEach((line, index) => {
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
  if (lines.toString().includes('**')) {
    // remove elements that contain H1 and H2 markers
    filteredLines = lines.filter(function (value, index) {
      return ignoredIndices.indexOf(index) == -1
    })
    let result = transformToStrongText(filteredLines.join(' '))
    filteredLines = result
  }

  newP.innerHTML = filteredLines.join(' ')
  window.document.body.appendChild(newP)
  return pretty(dom.serialize())
}

function transformToSerializedHtml(lines: Array<string>) {
  const { JSDOM } = jsdom
  const dom = new JSDOM(initalHtml)
  const { window } = dom

  let paragraphBuffer = ''
  lines.forEach((line, index) => {
    if (index === 0 && lines.length > 3 && lines[1] === '' && lines[2] === '') {
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

function proccessTextFile(filename: string) {
  let result = ''
  const fileContent = getFileContent(filename)

  if (path.extname(filename) === '.txt') {
    result = transformToSerializedHtml(fileContent)
  }
  if (path.extname(filename) === '.md') {
    result = transformMdToSerializedHtml(fileContent)
  }
  fs.writeFile(`./dist/${path.parse(filename).name}.html`, result, err => {
    if (err) {
      console.error(err)
    }
  })
}

function proccessSingleFile(filename: string) {
  prepearDistFolder()
  proccessTextFile(filename)
}

function proccessFolder(dirPath: string) {
  prepearDistFolder()
  const files = getAllFiles(dirPath)
  const txtFiles = filterTxtFiles(files)
  const mdFiles = filterMdFiles(files)

  txtFiles.forEach(file => {
    proccessTextFile(file)
  })
  mdFiles.forEach(file => {
    proccessTextFile(file)
  })
}

function proccessInput(inputPath: string) {
  try {
    if (fs.lstatSync(inputPath).isDirectory()) {
      proccessFolder(inputPath)
    } else if (path.extname(inputPath) === '.txt') {
      proccessSingleFile(inputPath)
    } else if (path.extname(inputPath) === '.md') {
      proccessSingleFile(inputPath)
    } else if (
      path.extname(inputPath) !== '.txt' &&
      path.extname(inputPath) !== '.md'
    ) {
      throw new Error('Error: Wrong file extension (has to be .txt or .md)')
    } else {
      throw new Error('Error: Unkown input error')
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message)
    }
  }
}

function processConfig(inputPath: string) {
  try {
    if (
      !fs.lstatSync(inputPath).isDirectory() &&
      path.extname(inputPath) == '.json'
    ) {
      const configObject = JSON.parse(fs.readFileSync(inputPath).toString())
      if (!('input' in configObject)) {
        throw new Error('Error: No "input" property in config file')
      }
      proccessInput(configObject['input'])
    } else if (path.extname(inputPath) !== '.json') {
      throw new Error('Error: Wrong config file extension (has to be .json)')
    } else {
      throw new Error('Error: Unkown input error')
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message)
    }
  }
}

function getFileContent(filename: string): Array<string> {
  const allFileContents = fs.readFileSync(filename, 'utf-8')

  return allFileContents.split(/\r?\n/)
}

const program = configurateProgram()

const options = program.opts()

if (options.help) {
  printCommandHelp()
} else if (options.input) {
  proccessInput(options.input)
} else if (options.version) {
  printCommandVersion()
} else if (options.config) {
  processConfig(options.config)
}
