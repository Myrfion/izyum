#!/usr/bin/env node

const fs = require("fs")
const path = require("path")
const jsdom = require("jsdom")
const pretty = require("pretty")
const pjson = require("./../package.json")

function getInputFileName(args: Array<string>) {
  return args.join(" ")
}

function getAllFiles(dirPath, arrayOfFiles = undefined) {
  const files = fs.readdirSync(dirPath)

  arrayOfFiles = arrayOfFiles || []

  files.forEach(function (file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
    } else {
      arrayOfFiles.push(path.join(dirPath, "/", file))
    }
  })

  return arrayOfFiles
}

function filterTxtFiles(files: Array<string>): Array<string> {
  return files.filter((file) => path.extname(file) === ".txt")
}

export type ConsoleCommands =
  | "--help"
  | "-v"
  | "--version"
  | "-h"
  | "--help"
  | "-i"
  | "--input"

const initalHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Filename</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
  <!-- Your generated content here... -->
</body>
</html>`

function validateInputArguments(args: Array<string>) {
  if (args.length === 0) {
    throw new Error("Error: file/folder is not provided")
  }
}

const helpMessage = `
  Description: The Izyum is a simple SSG that converts .txt 
  Usage: 
    izyum [options]
  Options:
    --help | -h - shows help message (eg. izyum --help)
    --version | -v - shows the version (eg. izyum --version)
    -input - converts provided .txt file to .html (eg. izyum --input filename.txt)
    -i - covnerts .txt files of provided folder to .html (eg. izyum -i foldername)
`

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
  fs.rmSync("./dist", { recursive: true, force: true })
  fs.mkdirSync("./dist")
}

function transformToSerializedHtml(lines: Array<string>) {
  const { JSDOM } = jsdom
  const dom = new JSDOM(initalHtml)
  const { window } = dom

  let paragraphBuffer = ""

  lines.forEach((line, index) => {
    if (index === 0 && lines.length > 3 && lines[1] === "" && lines[2] === "") {
      window.document.title = line
      const newH1 = window.document.createElement("h1")
      newH1.innerHTML = line
      window.document.body.appendChild(newH1)
    } else if (line === "" && paragraphBuffer !== "") {
      const newP = window.document.createElement("p")
      newP.innerHTML = paragraphBuffer
      window.document.body.appendChild(newP)
      paragraphBuffer = ""
    } else {
      paragraphBuffer += line
    }
  })

  return pretty(dom.serialize())
}

function proccessTextFile(filename: string) {
  const fileContent = getFileContent(filename)

  const result = transformToSerializedHtml(fileContent)
  fs.writeFile(`./dist/${path.parse(filename).name}.html`, result, (err) => {
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
  console.log(files)
  const txtFiles = filterTxtFiles(files)
  console.log(txtFiles)
  txtFiles.forEach((file) => {
    proccessTextFile(file)
  })
}

function proccessInput(args: Array<string>) {
  try {
    validateInputArguments(args)
    const inputPath = getInputFileName(args)
    if (fs.lstatSync(inputPath).isDirectory()) {
      proccessFolder(inputPath)
    } else if (path.extname(inputPath) === ".txt") {
      proccessSingleFile(inputPath)
    } else if (path.extname(inputPath) !== ".txt") {
      throw new Error("Error: Wrong file extension (has to be .txt)")
    } else {
      throw new Error("Error: Unkown input error")
    }
  } catch (error) {
    console.error(error.message)
  }
}

function getArgs() {
  const args = process.argv.slice(2)
  return args
}

function getFileContent(filename: string): Array<string> {
  const allFileContents = fs.readFileSync(filename, "utf-8")

  return allFileContents.split(/\r?\n/)
}

const symbols = getArgs()

switch (symbols[0] as ConsoleCommands) {
  case "-h":
  case "--help":
    printCommandHelp()
    break
  case "-v":
  case "--version":
    printCommandVersion()
    break
  case "--input":
  case "-i":
    proccessInput(symbols.slice(1, symbols.length))
    break
  default:
    console.error("unkown command, try --help")
}