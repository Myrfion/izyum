#!/usr/bin/env node

import * as fs from 'fs'
import * as path from 'path'
import { configurateProgram } from './program'
import { helpMessage } from './utils/contants'
import { getAllFiles, prepearDistFolder, saveFile } from './utils/files'
import pjson from '../package.json'
import GeneratedFile from './generated-file'

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

function proccessTextFile(filename: string) {
  const generatedFile = new GeneratedFile(filename)
  let result = generatedFile.getSerializedHtml()
  if (result) {
    saveFile(filename, result)
  }
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
