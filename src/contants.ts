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

exports.module = {helpMessage, initalHtml}