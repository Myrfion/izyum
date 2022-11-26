import { filterTxtFiles, filterMdFiles, printCommandHelp, printCommandVersion } from '../src/index'
import { helpMessage } from '../src/utils/contants';
import pjson from '../package.json'

describe('test index.ts helper functions', () => {
  test('filterTxtFiles to return .txt files', () => {
    expect(filterTxtFiles(['file1.txt', 'file2.txt', 'file3.md', 'file4.txt'])).toStrictEqual(['file1.txt', 'file2.txt', 'file4.txt']);
  })
  test('filterMdFiles to return .md files', () => {
    expect(filterMdFiles(['file1.md', 'file2.md', 'file3.txt', 'file4.txt'])).toStrictEqual(['file1.md', 'file2.md']);
  })
  test('printCommandHelp to return console message', () => {
    expect(printCommandHelp()).toBe(console.log(helpMessage));
  });
  test('printCommandVersion to return console message', () => {
    const commandVersionMessage = `App Name: Izyum
    Verion: ${pjson.version}`;
    expect(printCommandVersion()).toBe(console.log(commandVersionMessage));
  })
})