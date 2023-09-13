import { useState } from "react";
import "./App.css";
import { Square, Piece } from "./components/Square";
import { Board } from "./components/Board";
import "./styles.css";

const initialSetup: Record<string, Piece> = {
  // Black pieces

  E7: "black-queen",
  D7: "black-knight",

  // White pieces
  D2: "white-queen",
  E2: "white-knight",
};

function App() {
  const [squares, setSquares] = useState<Record<string, Piece>>(initialSetup);
  const [currentPlayer, setCurrentPlayer] = useState<"white" | "black">("white");
  const [activeSquare, setActiveSquare] = useState<string | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<string[]>([]);
  const [threatSquare, setThreatSquare] = useState<string | null>(null);
  const [boardOrientation, setBoardOrientation] = useState<"normal" | "flipped">("normal");

  const columns = ["A", "B", "C", "D", "E", "F", "G", "H"];

  const getPossibleQueenMoves = (id: string): string[] => {
    const directions = [
      { row: 0, col: 1 }, // Right
      { row: 1, col: 1 }, // Down-right
      { row: 1, col: 0 }, // Down
      { row: 1, col: -1 }, // Down-left
      { row: 0, col: -1 }, // Left
      { row: -1, col: -1 }, // Up-left
      { row: -1, col: 0 }, // Up
      { row: -1, col: 1 }, // Up-right
    ];

    const [col, row] = id.split("");
    const colIdx = columns.indexOf(col);
    const rowIdx = parseInt(row);
    const boardSize = 8;
    const moves: string[] = [];

    directions.forEach((dir) => {
      for (let i = 1; i < boardSize; i++) {
        const newRow = rowIdx + dir.row * i;
        const newCol = colIdx + dir.col * i;

        if (
          newRow < 0 ||
          newRow > boardSize ||
          newCol < 0 ||
          newCol >= boardSize
        ) {
          break; // Out of bounds
        }

        const selectedSquareId = `${columns[newCol]}${newRow}`;

        const pieceOnSquare = squares[selectedSquareId];

        if (!pieceOnSquare) {
          moves.push(selectedSquareId); // Empty square
        } else if (pieceOnSquare.startsWith(currentPlayer)) {
          break; // Friendly piece
        } else {
          moves.push(selectedSquareId); // Enemy piece
          break;
        }
      }
    });

    return moves;
  };

  const getPossibleKnightMoves = (id: string): string[] => {
    const directions = [
      { row: 2, col: 1 }, // Two up one right
      { row: 2, col: -1 }, // Two up one left
      { row: 1, col: 2 }, // One up two right
      { row: 1, col: -2 }, // One up two left
      { row: -2, col: 1 }, // Two down one right
      { row: -2, col: -1 }, // Two down one left
      { row: -1, col: 2 }, // One down two right
      { row: -1, col: -2 }, // One down two left
    ];

    const [col, row] = id.split("");
    const colIdx = columns.indexOf(col);
    const rowIdx = parseInt(row);
    const boardSize = 8;

    const moves: string[] = [];

    directions.forEach((dir) => {
      const newRow = rowIdx + dir.row;
      const newCol = colIdx + dir.col;

      if (
        newRow < 0 ||
        newRow > boardSize ||
        newCol < 0 ||
        newCol >= boardSize
      ) {
        return; // Out of bounds
      }

      const selectedSquareId = `${columns[newCol]}${newRow}`;

      const pieceOnSquare = squares[selectedSquareId];

      if (!pieceOnSquare) {
        moves.push(selectedSquareId); // Empty square
      } else if (pieceOnSquare.startsWith(currentPlayer)) {
        return; // Friendly piece
      } else {
        moves.push(selectedSquareId); // Enemy piece
      }
    });

    return moves;
  };

  const getPossibleMoves = (id: string): string[] => {
    if (!squares[id] || !squares[id]?.startsWith(currentPlayer)) {
      return [];
    }
    const piece = squares[id];
    if (piece === "white-queen" || piece === "black-queen") {
      return getPossibleQueenMoves(id);
    } else {
      return getPossibleKnightMoves(id);
    }
  };

  const movePiece = (id: string): void => {
    if (activeSquare === id) {
      setActiveSquare(null);
      setPossibleMoves([]);
      return;
    }
    if (squares[id] && squares[id]?.startsWith(currentPlayer)) {
      setActiveSquare(id);
      setPossibleMoves(getPossibleMoves(id));
      return;
    }
    if (possibleMoves.includes(id)) {
      const newSquares = { ...squares };
      const takenPiece = newSquares[id];
      console.log("takenPiece", takenPiece);
      newSquares[id] = squares[activeSquare!];
      newSquares[activeSquare!] = null;
      setSquares(newSquares);
      setActiveSquare(null);
      setPossibleMoves([]);
      if (takenPiece?.endsWith("queen")) {
        gameOver(takenPiece);
      }
      setCurrentPlayer(currentPlayer === "white" ? "black" : "white");
      if (threatSquare) {
        setThreatSquare(null);
      }
      if (newSquares[id]?.endsWith("knight")) {
        setThreatSquare(isQueenUnderThreat(id));
      }
    }
  };

  const isQueenUnderThreat = (knight_square: string): string | null => {
    console.log("knight_square", knight_square);
    console.log("currentPlayer", currentPlayer);
    const possibleMoves = getPossibleKnightMoves(knight_square);
    console.log("possibleMoves", possibleMoves);
    for (const move of possibleMoves) {
      if (
        squares[move] &&
        squares[move]?.includes("queen") &&
        !squares[move]?.startsWith(currentPlayer)
      ) {
        console.log("move", move);
        return move; // A knight can move to a square occupied by a queen
      }
    }
    return null;
  };

  const gameOver = (piece: Piece): void => {
    if (piece === "white-queen") {
      alert("Black wins!");
      window.location.reload();
    } else {
      alert("White wins!");
      window.location.reload();
    }
  };

  return (
    <>
      <div className="main">
        <Board
          // Pass the necessary props to the Board component
          squares={squares}
          activeSquare={activeSquare}
          possibleMoves={possibleMoves}
          threatSquare={threatSquare}
          onSquareClick={movePiece}
          boardOrientation={boardOrientation}
        />
        <button className="flip-button"
          onClick={() =>
            setBoardOrientation((prev) =>
              prev === "normal" ? "flipped" : "normal"
            )
          }
        >
          Flip Board
        </button>
        <div>Current Player: {currentPlayer}</div>
      </div>
    </>
  );
}

export default App;
