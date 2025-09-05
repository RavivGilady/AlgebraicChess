const path = require('path')
const fs = require('fs')
const https = require('https')
const { execSync } = require('child_process')

const downloadFile = (url, dest) => {
  return new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        if (response.statusCode === 302 || response.statusCode === 301) {
          console.log('Redirecting to', response.headers.location)
          return resolve(downloadFile(response.headers.location, dest))
        }

        if (response.statusCode !== 200) {
          return reject(
            new Error(
              `Failed to download file: Status code ${response.statusCode}`
            )
          )
        }

        const file = fs.createWriteStream(dest)
        response.pipe(file)

        file.on('finish', () => {
          file.close(resolve)
        })

        file.on('error', (err) => {
          fs.unlink(dest, () => reject(err))
        })
      })
      .on('error', (err) => {
        fs.unlink(dest, () => reject(err))
      })
  })
}

const getBinaryName = () => {
  if (process.platform === 'win32')
    return 'stockfish-windows-x86-64-sse41-popcnt.exe'
  if (process.platform === 'linux') return 'stockfish-ubuntu-x86-64'
  return 'stockfish' // fallback
}

const moveBinaryFile = (extractedDir, destinationDir) => {
  const binaryName = 'stockfish-windows-x86-64-sse41-popcnt.exe'
  const sourcePath = path.join(extractedDir, 'stockfish', binaryName)
  const destinationPath = path.join(destinationDir, binaryName)

  if (fs.existsSync(sourcePath)) {
    fs.renameSync(sourcePath, destinationPath)
    console.log(`Stockfish binary moved to ${destinationPath}`)
  } else {
    throw new Error('Stockfish binary not found inside the extracted files.')
  }
}

const cleanUpExtractedFiles = (extractedDir) => {
  const stockfishFolder = path.join(extractedDir, 'stockfish')
  if (fs.existsSync(stockfishFolder)) {
    fs.rmSync(stockfishFolder, { recursive: true, force: true })
    console.log('Cleaned up extracted files except the binary.')
  }
}

const downloadStockfish = async () => {
  const destDir = path.join(__dirname, './stockfishBinary')
  const os = require('os')
  const isLinux = os.platform() === 'linux'
  const finalBinary = path.join(__dirname, 'stockfishBinary', getBinaryName())

  if (isLinux) {
    const linuxUrl =
      'https://github.com/official-stockfish/Stockfish/releases/latest/download/stockfish-ubuntu-x86-64.tar'
    const tarPath = path.join(__dirname, 'stockfish.tar') // temp tar path
    const extractedBinary = path.join(
      destDir,
      'stockfish',
      'stockfish-ubuntu-x86-64'
    )

    if (fs.existsSync(finalBinary)) {
      console.log(
        'Stockfish binary already exists. Skipping download & fixing permissions.'
      )
      fs.chmodSync(finalBinary, 0o755)
      return
    }

    fs.mkdirSync(destDir, { recursive: true })

    console.log('Downloading Stockfish for Linux...')
    await downloadFile(linuxUrl, tarPath)

    console.log('Extracting Stockfish...')
    execSync(`tar -xf "${tarPath}" -C "${destDir}"`)

    if (!fs.existsSync(extractedBinary)) {
      throw new Error(`Expected binary not found at ${extractedBinary}`)
    }

    fs.renameSync(extractedBinary, finalBinary)

    fs.chmodSync(finalBinary, 0o755)
    console.log('✅ Linux Stockfish is ready at:', finalBinary)

    fs.unlinkSync(tarPath)
  } else if (os.platform() === 'win32') {
    const stockfishUrl =
      'https://github.com/official-stockfish/Stockfish/releases/latest/download/stockfish-windows-x86-64-sse41-popcnt.zip'
    const zipFilePath = path.join(destDir, 'stockfish.zip')

    if (fs.existsSync(finalBinary)) {
      console.log('Stockfish binary already exists. Skipping download.')
      return
    }

    console.log('Downloading Stockfish binary for Windows...')
    // Ensure the stockfishBinary directory exists
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true })
    }

    await downloadFile(stockfishUrl, zipFilePath)
    console.log('Stockfish ZIP downloaded successfully.')
    console.log('Extracting Stockfish binary...')

    const unzipper = require('unzipper')

    await new Promise((resolve, reject) => {
      fs.createReadStream(zipFilePath)
        .pipe(unzipper.Extract({ path: destDir }))
        .on('close', resolve)
        .on('error', reject)
    })

    console.log('Stockfish binary extracted.')

    moveBinaryFile(destDir, destDir)

    cleanUpExtractedFiles(destDir)

    fs.unlinkSync(zipFilePath)
  }
}

downloadStockfish()
  .then(() => console.log('Stockfish downloaded and set up successfully.'))
  .catch((error) => console.error('Error downloading Stockfish:', error))

exports.downloadStockfish = downloadStockfish
exports.getBinaryName = getBinaryName
