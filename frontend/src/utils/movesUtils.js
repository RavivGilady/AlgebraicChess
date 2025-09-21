/**
 * Formats the last plies from a flat SAN list into standard chess move numbering
 * @param {Array<string>} moves - Flat ply list in chronological order (White then Black)
 * @param {number} lastPlies - Number of last plies to show
 * @returns {string} - Formatted moves string with proper chess notation
 * @throws {Error} - If lastPlies is not finite or negative
 *
 * @example
 * formatLastPlies(["e4","e5","d4","d5"], 4) // "1. e4 e5 2. d4 d5"
 * formatLastPlies(["e4","e5","d4","d5","Nc3"], 3) // "2. d4 d5 3. Nc3"
 * formatLastPlies(["e4","e5","d4"], 2) // "1... e5 2. d4"
 */
export function formatLastPlies(moves, lastPlies = 4) {
  // Input validation
  if (!Array.isArray(moves)) {
    throw new Error("moves must be an array");
  }

  if (!Number.isFinite(lastPlies) || lastPlies < 0) {
    throw new Error("lastPlies must be a finite non-negative number");
  }

  // Edge cases
  if (moves.length === 0 || lastPlies <= 0) {
    return "";
  }

  // Determine the window start index
  const start = Math.max(0, moves.length - lastPlies);
  const windowMoves = moves.slice(start);

  if (windowMoves.length === 0) {
    return "";
  }

  const segments = [];

  // Check if window starts on Black (odd start index)
  if (start % 2 === 1) {
    // Window starts on Black: N... <blackMove>
    const moveNumber = Math.floor(start / 2) + 1;
    segments.push(`${moveNumber}... ${windowMoves[0]}`);

    // Process remaining pairs
    for (let i = 1; i < windowMoves.length; i += 2) {
      const currentMoveNumber = Math.floor((start + i) / 2) + 1;
      if (i + 1 < windowMoves.length) {
        // Complete pair: N. <white> <black>
        segments.push(
          `${currentMoveNumber}. ${windowMoves[i]} ${windowMoves[i + 1]}`,
        );
      } else {
        // Unpaired White move: N. <white>
        segments.push(`${currentMoveNumber}. ${windowMoves[i]}`);
      }
    }
  } else {
    // Window starts on White: process normally
    for (let i = 0; i < windowMoves.length; i += 2) {
      const currentMoveNumber = Math.floor((start + i) / 2) + 1;
      if (i + 1 < windowMoves.length) {
        // Complete pair: N. <white> <black>
        segments.push(
          `${currentMoveNumber}. ${windowMoves[i]} ${windowMoves[i + 1]}`,
        );
      } else {
        // Unpaired White move: N. <white>
        segments.push(`${currentMoveNumber}. ${windowMoves[i]}`);
      }
    }
  }

  return segments.join(" ");
}
