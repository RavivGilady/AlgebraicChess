/**
 * Formats the last moves from an array where each move consists of 2 consecutive items
 * For odd counts with more than 2*maxMoves items, shows 2*maxMoves+1 items:
 * "52 ... e4, 53. e4 d5, 54. Nf3 Nc6, 55. Bb5"
 * @param {Array} moves - Array of moves (e.g., ['a', 'b', 'c', 'd', 'e'])
 * @param {number} maxMoves - Maximum number of moves to show (default: 1)
 * @returns {string} - Formatted moves string (e.g., "52 ... e4, 53. e4 d5, 54. Nf3 Nc6, 55. Bb5")
 */
export function formatLastMoves(moves, maxMoves = 1) {
  if (!moves || moves.length === 0) return "";

  const totalMoves = moves.length;
  const isOdd = totalMoves % 2 === 1;
  const formattedMoves = [];

  // Calculate the starting move number based on the total moves
  const startingMoveNumber = Math.floor(totalMoves / 2) + 1;
  let moveNumber = startingMoveNumber;

  // If odd and we have more than 2*maxMoves items, show 2*maxMoves + 1 items
  if (isOdd && totalMoves > maxMoves * 2) {
    // Take the last 2*maxMoves + 1 items
    const relevantMoves = moves.slice(-(maxMoves * 2 + 1));

    // First move: black move with dots (no white move before)
    formattedMoves.push(`${moveNumber} ... ${relevantMoves[0]}`);
    moveNumber++;

    // Middle moves: normal pairs (2*maxMoves - 1 items)
    for (let i = 1; i < relevantMoves.length - 1; i += 2) {
      if (i + 1 < relevantMoves.length - 1) {
        formattedMoves.push(
          `${moveNumber} ${relevantMoves[i]} ${relevantMoves[i + 1]}`,
        );
        moveNumber++;
      }
    }

    // Last move: white move only
    formattedMoves.push(
      `${moveNumber} ${relevantMoves[relevantMoves.length - 1]}`,
    );
  } else {
    // For even counts or when we don't have enough moves, take last maxMoves * 2 items
    const relevantMoves = moves.slice(-maxMoves * 2);

    // Process moves from the end backwards
    for (let i = relevantMoves.length - 1; i >= 0; i -= 2) {
      if (i > 0) {
        // Complete move (two items) - process in reverse order
        formattedMoves.unshift(
          `${moveNumber}. ${relevantMoves[i - 1]} ${relevantMoves[i]}`,
        );
        moveNumber++;
      } else {
        // Single item at the beginning
        formattedMoves.unshift(`${moveNumber}. ${relevantMoves[i]}`);
        moveNumber++;
      }
    }
  }

  return formattedMoves.join(" ");
}
