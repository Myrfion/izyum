import GeneratedFile from '../src/generated-file'

jest.mock('fs')

const MOCK_TXT_CONTENT_INPUT = `hello

world`
const MOCK_TXT_WITH_HEADER_INPUT = `Title


`
const MOCK_MD_CONTENT_INPUT = `# heading

Paragraph`
const EXPECTED_HTML_OUTPUT = `<!DOCTYPE html>
<html lang="en">

  <head>
    <meta charset="utf-8">
    <title>Filename</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
  </head>

  <body>
    <!-- Your generated content here... -->

    <p>hello</p>
  </body>

</html>`
const EXPECTED_HTML_FROM_MD_OUTPUT = `<!DOCTYPE html>
<html lang="en">

  <head>
    <meta charset="utf-8">
    <title>test-file</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
  </head>

  <body>
    <h1 id="heading">heading</h1>
    <p>Paragraph</p>


  </body>

</html>`
const EXPECTED_HTML_FROM_TXT_WITH_HEADING_OUTPUT = `<!DOCTYPE html>
<html lang="en">

  <head>
    <meta charset="utf-8">
    <title>Title</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
  </head>

  <body>
    <!-- Your generated content here... -->

    <h1>Title</h1>
  </body>

</html>`

describe('Genereted file module', () => {
  test('txt to html conversion', () => {
    const generatedFile = new GeneratedFile(
      MOCK_TXT_CONTENT_INPUT,
      '.txt',
      'test-file'
    )
    const htmlOutput = generatedFile.getSerializedHtml()
    expect(htmlOutput).toBe(EXPECTED_HTML_OUTPUT)
  })

  test('txt to html conversion (with title)', () => {
    const generatedFile = new GeneratedFile(
      MOCK_TXT_WITH_HEADER_INPUT,
      '.txt',
      'test-file'
    )
    const htmlOutput = generatedFile.getSerializedHtml()
    console.log(htmlOutput)
    expect(htmlOutput).toBe(EXPECTED_HTML_FROM_TXT_WITH_HEADING_OUTPUT)
  })

  test('md to html conversion', () => {
    const generatedFile = new GeneratedFile(
      MOCK_MD_CONTENT_INPUT,
      '.md',
      'test-file'
    )
    const htmlOutput = generatedFile.getSerializedHtml()
    expect(htmlOutput).toBe(EXPECTED_HTML_FROM_MD_OUTPUT)
  })

  test('getWrappedHtml()', () => {
    const wrappedHtml = GeneratedFile.getWrappedHtml(
      '<p>hello world</p>',
      'test-file'
    )
    expect(wrappedHtml).toBe(`<!doctype html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <title>test-file</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
    </head>
    <body>
      <p>hello world</p>
    </body>
    </html>`)
  })
})
