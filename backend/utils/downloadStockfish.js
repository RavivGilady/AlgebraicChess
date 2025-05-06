const path = require('path');
const fs = require('fs');
const https = require('https');

const downloadFile = (url, dest) => {
    return new Promise((resolve, reject) => {
        https.get(url, (response) => {
            // Handle redirection
            if (response.statusCode === 302 || response.statusCode === 301) {
                console.log('Redirecting to', response.headers.location);
                return resolve(downloadFile(response.headers.location, dest));
            }

            if (response.statusCode !== 200) {
                return reject(new Error(`Failed to download file: Status code ${response.statusCode}`));
            }

            const file = fs.createWriteStream(dest);
            response.pipe(file);

            file.on('finish', () => {
                file.close(resolve);
            });

            file.on('error', (err) => {
                fs.unlink(dest, () => reject(err));
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => reject(err));
        });
    });
};

// Function to move binary file from the extracted folder to backend/stockfishBinary
const moveBinaryFile = (extractedDir, destinationDir) => {
    const binaryName = 'stockfish-windows-x86-64-sse41-popcnt.exe';
    const sourcePath = path.join(extractedDir, 'stockfish', binaryName); // Inside 'stockfish' folder
    const destinationPath = path.join(destinationDir, binaryName);

    if (fs.existsSync(sourcePath)) {
        fs.renameSync(sourcePath, destinationPath);
        console.log(`Stockfish binary moved to ${destinationPath}`);
    } else {
        throw new Error('Stockfish binary not found inside the extracted files.');
    }
};

// Function to delete all extracted content except the binary
const cleanUpExtractedFiles = (extractedDir) => {
    const stockfishFolder = path.join(extractedDir, 'stockfish');
    if (fs.existsSync(stockfishFolder)) {
        fs.rmSync(stockfishFolder, { recursive: true, force: true });
        console.log('Cleaned up extracted files except the binary.');
    }
};

// Function to download and unzip Stockfish binary
const downloadStockfish = async () => {
    const destDir = path.join(__dirname, './stockfishBinary');
    const os = require('os');
    const isLinux = os.platform() === 'linux';
    if (isLinux) {
        const linuxUrl = 'https://github.com/official-stockfish/Stockfish/releases/latest/download/stockfish-linux-x86-64-modern';
        const binaryPath = destDir.join(__dirname, '/stockfish');

        if (fs.existsSync(binaryPath)) {
            console.log('Stockfish binary already exists. Skipping download.');
            return;
        }

        fs.mkdirSync(path.dirname(binaryPath), { recursive: true });

        console.log('Downloading Stockfish for Linux...');
        await downloadFile(linuxUrl, binaryPath);

        // Make it executable
        fs.chmodSync(binaryPath, 0o755);
        console.log('Linux Stockfish ready.');
    }
    else if (os.platform() === 'win32') {
    const stockfishUrl = 'https://github.com/official-stockfish/Stockfish/releases/latest/download/stockfish-windows-x86-64-sse41-popcnt.zip';
    const zipFilePath = path.join(destDir, 'stockfish.zip');
    const finalBinaryPath = path.join(destDir, 'stockfish-windows-x86-64-sse41-popcnt.exe');

    // Check if Stockfish binary already exists
    if (fs.existsSync(finalBinaryPath)) {
        console.log('Stockfish binary already exists. Skipping download.');
        return;
    }

    console.log('Downloading Stockfish binary...');

    // Ensure the stockfishBinary directory exists
    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
    }

    // Download and extract Stockfish
    await downloadFile(stockfishUrl, zipFilePath);
    console.log('Stockfish ZIP downloaded successfully.');
    console.log('Extracting Stockfish binary...');

    const unzipper = require('unzipper'); // Require only when needed

    await new Promise((resolve, reject) => {
        fs.createReadStream(zipFilePath)
            .pipe(unzipper.Extract({ path: destDir }))
            .on('close', resolve)
            .on('error', reject);
    });

    console.log('Stockfish binary extracted.');

    // Move the binary from 'stockfish' folder inside the extracted path to backend/stockfishBinary
    moveBinaryFile(destDir, destDir);

    // Clean up all extracted files except the binary
    cleanUpExtractedFiles(destDir);

    // Clean up by removing the downloaded ZIP file
    fs.unlinkSync(zipFilePath);
    }

};

downloadStockfish()
    .then(() => console.log('Stockfish downloaded and set up successfully.'))
    .catch((error) => console.error('Error downloading Stockfish:', error));

exports.downloadStockfish = downloadStockfish;