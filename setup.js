const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const https = require('https');

// Function to run npm install in a given directory
const installDependencies = (folder, callback) => {
  const fullPath = path.join(__dirname, folder);

  if (fs.existsSync(path.join(fullPath, 'package.json'))) {
    console.log(`Installing dependencies for ${folder}...`);

    exec('npm install', { cwd: fullPath }, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error installing dependencies in ${folder}:`, error);
        return;
      }
      console.log(`Dependencies installed successfully in ${folder}`);
      if (callback) callback(); // Execute callback after dependencies are installed
    });
  } else {
    console.log(`No package.json found in ${folder}. Skipping npm install.`);
    if (callback) callback(); // Execute callback even if no package.json is found
  }
};

// Helper function to download a file and follow redirects
const downloadFile = (url, dest, callback) => {
  https.get(url, (response) => {
    // Handle redirection
    if (response.statusCode === 302 || response.statusCode === 301) {
      console.log('Redirecting to', response.headers.location);
      return downloadFile(response.headers.location, dest, callback);
    }

    if (response.statusCode !== 200) {
      callback(new Error(`Failed to download file: Status code ${response.statusCode}`));
      return;
    }

    const file = fs.createWriteStream(dest);
    response.pipe(file);

    file.on('finish', () => {
      file.close(callback);
    });

    file.on('error', (err) => {
      fs.unlink(dest, () => callback(err));
    });
  }).on('error', (err) => {
    fs.unlink(dest, () => callback(err));
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
    console.error('Error: Stockfish binary not found inside the extracted files.');
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
const downloadStockfish = () => {
  const unzipper = require('unzipper'); // Now require it after dependencies are installed
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

  // Download and handle redirects
  downloadFile(stockfishUrl, zipFilePath, (err) => {
    if (err) {
      console.error('Error downloading Stockfish:', err.message);
      return;
    }

    console.log('Stockfish ZIP downloaded successfully.');
    console.log('Extracting Stockfish binary...');

    // Unzip the file
    fs.createReadStream(zipFilePath)
      .pipe(unzipper.Extract({ path: extractPath }))
      .on('close', () => {
        console.log('Stockfish binary extracted.');

        // Move the binary from 'stockfish' folder inside the extracted path to backend/stockfishBinary
        moveBinaryFile(extractPath, extractPath);

        // Clean up all extracted files except the binary
        cleanUpExtractedFiles(extractPath);

        // Clean up by removing the downloaded ZIP file
        fs.unlinkSync(zipFilePath);
      })
      .on('error', (error) => {
        console.error('Error extracting Stockfish:', error);
      });
  });
};

// Step 1: Install root dependencies and then proceed with the rest
installDependencies('.', () => {
  // Step 2: Install dependencies for both /backend and /frontend
  installDependencies('backend', () => {
    installDependencies('frontend', () => {
      // Step 3: Download Stockfish binary after dependencies are installed
      downloadStockfish();
    });
  });
});
