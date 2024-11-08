const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const https = require('https');

// Helper function to run npm install in a directory
const installDependencies = (folder) => {
    return new Promise((resolve, reject) => {
        const fullPath = path.join(__dirname, folder);

        if (fs.existsSync(path.join(fullPath, 'package.json'))) {
            console.log(`Installing dependencies for ${folder}...`);

            exec('npm install', { cwd: fullPath }, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error installing dependencies in ${folder}:`, error);
                    reject(error);
                    return;
                }
                console.log(`Dependencies installed successfully in ${folder}`);
                resolve();
            });
        } else {
            console.log(`No package.json found in ${folder}. Skipping npm install.`);
            resolve();
        }
    });
};

// Helper function to download a file and follow redirects
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
    const stockfishUrl = 'https://github.com/official-stockfish/Stockfish/releases/latest/download/stockfish-windows-x86-64-sse41-popcnt.zip';
    const zipFilePath = path.join(__dirname, 'stockfish.zip');
    const extractPath = path.join(__dirname, 'backend/stockfishBinary');
    const finalBinaryPath = path.join(extractPath, 'stockfish-windows-x86-64-sse41-popcnt.exe');

    // Check if Stockfish binary already exists
    if (fs.existsSync(finalBinaryPath)) {
        console.log('Stockfish binary already exists. Skipping download.');
        return;
    }

    console.log('Downloading Stockfish binary...');

    // Ensure the stockfishBinary directory exists
    if (!fs.existsSync(extractPath)) {
        fs.mkdirSync(extractPath, { recursive: true });
    }

    // Download and extract Stockfish
    await downloadFile(stockfishUrl, zipFilePath);
    console.log('Stockfish ZIP downloaded successfully.');
    console.log('Extracting Stockfish binary...');

    const unzipper = require('unzipper'); // Require only when needed

    await new Promise((resolve, reject) => {
        fs.createReadStream(zipFilePath)
            .pipe(unzipper.Extract({ path: extractPath }))
            .on('close', resolve)
            .on('error', reject);
    });

    console.log('Stockfish binary extracted.');

    // Move the binary from 'stockfish' folder inside the extracted path to backend/stockfishBinary
    moveBinaryFile(extractPath, extractPath);

    // Clean up all extracted files except the binary
    cleanUpExtractedFiles(extractPath);

    // Clean up by removing the downloaded ZIP file
    fs.unlinkSync(zipFilePath);
};


installDependencies('.')
    .then(() => installDependencies('backend'))
    .then(() => installDependencies('frontend'))
    .then(() => downloadStockfish())
    .then(() => console.log('Setup completed successfully.'))
    .catch((error) => console.error('Setup failed:', error));

