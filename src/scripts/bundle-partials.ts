import fs from 'fs'
import path from 'path'
import glob from 'fast-glob'
import prettier from 'prettier'

const __dirname = path.dirname(new URL(import.meta.url).pathname)
const partialsDir = path.join(__dirname, '../partials')

async function run() {
  const partialFiles = glob.sync('**/*.html', { cwd: partialsDir })

  let partialsOutput = `export const partials = {`
  const OUTPUT_FILE = path.join(__dirname, '../utils/partial-data.ts')

  for (const file of partialFiles) {
    const content = fs.readFileSync(path.join(partialsDir, file), 'utf8')
    const partialName = path.basename(file, '.html')
    partialsOutput += `'${partialName}': \`${content.replace(/\`/g, '\\`')}\`,`
  }

  partialsOutput += `};\n\nexport type PartialName = keyof typeof partials;`
  const formattedOutput = await prettier.format(partialsOutput, { parser: 'typescript' })
  fs.writeFileSync(OUTPUT_FILE, formattedOutput)
  console.log(`Generated partials data at ${OUTPUT_FILE}`)
}

run()
