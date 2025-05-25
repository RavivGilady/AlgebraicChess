const { spawn } = require('child_process');
const path = require('path');
const {getBinaryName} = require('./downloadStockfish');

const stockfishPath = path.join(__dirname,'stockfishBinary',getBinaryName());
// Function to send a command to Stockfish and get the response
function sendCommand(engine, command, expectResponse = true) {
    return new Promise((resolve, reject) => {
        let response = '';
        let isExpectingResponse = expectResponse;

        console.log(`Sending command: ${command}`); // Debugging

        // Send the command to Stockfish
        engine.stdin.write(command + '\n');

        // Listen for data from Stockfish
        engine.stdout.on('data', (data) => {
            response += data.toString();

            // Handle specific commands differently
            if (command.startsWith('go') && isExpectingResponse) {
                // For 'go' command, look for the best move in the response
                const bestMoveMatch = response.match(/bestmove\s(\w+)/);
                if (bestMoveMatch) {
                    resolve(bestMoveMatch[1]);
                }
            } else if (isExpectingResponse) {
                // For other commands expecting a response, resolve when a newline is detected
                if (response.includes('\n')) {
                    resolve(response.trim());
                }
            }
        });

        // Listen for errors from Stockfish
        engine.stderr.on('data', (data) => {
            console.error(`Error from Stockfish: ${data.toString()}`); // Debugging
        });

        // Handle errors
        engine.on('error', (err) => {
            reject(err);
        });

        // If not expecting a response, resolve immediately
        if (!isExpectingResponse) {
            resolve('No response expected');
        }
    });
}

async function runStockfish(elo,fen) {
    try {

        console.log('Starting Stockfish...'); // Debugging

        // Start Stockfish
        const engine = spawn(stockfishPath);

        // Initialize UCI
        console.log('Initializing UCI...');
        await sendCommand(engine, 'uci');
        await sendCommand(engine, 'isready');
        console.log('Engine is ready');
         

        await sendCommand(engine, 'setoption name UCI_LimitStrength value true',false);
        console.log('UCI_LimitStrength set to true');

        // Set Stockfish to a specific Elo rating
        console.log(`Setting UCI_Elo to ${elo}...`);
        await sendCommand(engine, `setoption name UCI_Elo value ${elo}`,false);
        console.log(`UCI_Elo set to ${elo}`);
        // Set up a position (no response expected)
        // console.log('Setting position...');
        await sendCommand(engine, `position fen ${fen}`, false);
        // console.log('Position set');

        // Request a move (response expected)
        // console.log('Requesting move...');
        const bestMove = await sendCommand(engine, 'go movetime 1000');
        // console.log('Best move:', bestMove);
        
        // Quit Stockfish
        // console.log('Quitting Stockfish...');
        await sendCommand(engine, 'quit', false);
        return bestMove;
    } catch (err) {
        console.error('Error:', err.message);
    }
}
module.exports = runStockfish;