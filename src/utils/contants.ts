export const initalHtml = `<!doctype html>
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

export const helpMessage = `
  Description: The Izyum is a simple SSG that converts .txt 
  Usage: 
    izyum [options]
  Options:
    --help | -h - shows help message (eg. izyum --help)
    --version | -v - shows the version (eg. izyum --version)
    -i | --input [path to .txt | .md file] - transforms provided input to html
    -i | --input [path to dir] - transforms all .txt files in that directory or in it's child directories to html
    -c | --config [path to .json file] - performs commands specified in json format 
    `
