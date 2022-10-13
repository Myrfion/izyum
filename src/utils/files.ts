import * as fs from 'fs'
import * as path from 'path'

export type SupportedFileFormats = '.txt' | '.md'

export function getAllFiles(
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

export function prepearDistFolder() {
  fs.rmSync('./dist', { recursive: true, force: true })
  fs.mkdirSync('./dist')
}

export function getFileContent(filename: string): Array<string> {
  const allFileContents = fs.readFileSync(filename, 'utf-8')

  return allFileContents.split(/\r?\n/)
}

export function saveFile(filename: string, content: string) {
  fs.writeFile(`./dist/${path.parse(filename).name}.html`, content, err => {
    if (err) {
      console.error(err)
    }
  })
}

export function getFileFormat(filePath: string): SupportedFileFormats {
  if (path.extname(filePath) === '.txt') {
    return '.txt'
  }
  if (path.extname(filePath) === '.md') {
    return '.md'
  }

  throw Error('Error: unsupported file format')
}
