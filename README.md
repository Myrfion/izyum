<h1>Izyum 🍇</h1>

<p>Fast and nice SSG written with typescript and node.js</p>

<h2>Installation</h2>

<ul>
  <li>Run <code>npm install</code></li>
  <li>Run <code>npm run build</code></li>
  <li>Run <code>npm link</code></li>
</ul>

<h2>Usage</h2>

<p>Run <code>Izyum [options]</code></p>

<h2>Available commands</h2>

<ul>
  <li><code>izyum -v | --version</code> - shows currenly installed app version</li>
  <li><code>izyum -h | --help</code> - shows help message about ways to use the app</li>
  <li><code>izyum -i | --input [path to .txt file]</code> - transforms provided .txt file to html</li>
   <li><code>izyum -i | --input [path to dir]</code> - transforms all .txt files in that directory or in it's child directories to html</li>
</ul>

<h2>Examles</h2>

<h3>Test files</h3>

<p>The project has test directory which has some .txt files that you could use for testing purposes</p>

<h3>Usage examples</h3>

<p><code>izyum -i tests</code></p>
<p>or</p>
<p><code>izyum --input tests/The Adventure of the Speckled Band.txt</code></p>

<h2>Implemented optional features ✅</h2>

<ol>
  <li>try to parse a title from your input files. If there is a title, it will be the first line followed by two blank lines. In your generated HTML, use this to populate the <code>&lt;title>...&lt;/title&gt;</code> and add an &lt;h1&gt;...&lt;/h1&gt; to the top of the <code>&lt;body></code>
  </li>
  <li>allow the input to be a deep tree of files and folders. That is, if the user specifies a folder for --input, check to see if any of the items contained within are folders and recursively parse those as well.</li>
   <li>Allow the input to be a markdown file. If the user specifies a file with <code>.md</code> extension for <code>--input</code>, the tool will look for instances of lines beginning with <code># </code>, and  add those lines inside individual <code>&lt;h1>...&lt;/h1&gt;</code> tags. Similarly, if the tool detects lines beginning with <code>## </code>, then those lines will be added within individual <code>&lt;h2>...&lt;/h2&gt;</code> tags. Furthermore, text marked within a pair of <code>**</code> will be transformed 
   into bolded text. For example: <code>**Tom is a cat**</code> will be
   converted into <code>&lt;strong&gt;Tom is a cat&lt;/strong&gt;</code>. Additionally, the line marked with 3 or more dash symbols (---) is converted to the <code>&lt;hr /></code></li>
</ol>
