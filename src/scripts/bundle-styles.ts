import fs from 'fs'
import path from 'path'
import prettier from 'prettier'

const __dirname = path.dirname(new URL(import.meta.url).pathname)
const stylesDir = path.join(__dirname, '../styles')

async function run() {
  const stylesContent = ['variables', 'base', 'layout', 'components']
    .map((file) => {
      const filePath = path.join(stylesDir, `${file}.css`)
      const fileContent = fs.readFileSync(filePath, 'utf8')
      return fileContent + '\n\n'
    })
    .join('')
  const OUTPUT_FILE = path.join(__dirname, '../../www/styles.css')
  const formattedOutput = await prettier.format(stylesContent, { parser: 'css' })
  fs.writeFileSync(OUTPUT_FILE, formattedOutput)
  console.log(`Generated styles data at ${OUTPUT_FILE}`)
}

run()
