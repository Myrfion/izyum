import * as files from '../src/utils/files'
import * as fs from 'fs'

jest.mock('fs')

describe('utils/files helper module', () => {
  test('getFileFormat accepts txt and md files', () => {
    expect(files.getFileFormat('test.txt')).toBe('.txt')
    expect(files.getFileFormat('test.md')).toBe('.md')
  })

  test('getFileFormat throws unknown types', () => {
    expect(() => files.getFileFormat('test.test')).toThrow()
  })

  test('saveFile saves a file in dist folder', () => {
    files.saveFile('name', 'test')
    expect(fs.writeFile).toHaveBeenCalled()
  })
})
