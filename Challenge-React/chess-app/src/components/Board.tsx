import React from "react";
import { Square, Piece } from "./Square";
import "./Board.css";

interface BoardProps {
  squares: Record<string, Piece>;
  activeSquare: string | null;
  possibleMoves: string[];
  threatSquare: string | null;
  boardOrientation: "normal" | "flipped";
  onSquareClick: (id: string) => void;
}

export const Board: React.FC<BoardProps> = ({
  squares,
  activeSquare,
  possibleMoves,
  threatSquare,
  boardOrientation,
  onSquareClick,
}) => {

  // Helper function to determine color of a square
  const getSquareColor = (row: number, col: number): "#ccccc9" | "#769656" => {
    return (row + col) % 2 === 0 ? "#ccccc9" : "#769656";
  };


  const rows = boardOrientation === "normal" ?  [0, 1, 2, 3, 4, 5, 6, 7] : [7, 6, 5, 4, 3, 2, 1, 0];
  const columns = boardOrientation === "normal" ? ["A", "B", "C", "D", "E", "F", "G", "H"] : ["H", "G", "F", "E", "D", "C", "B", "A"];

  return (
    <div className="board">
      {rows.map(
        (
          row // Using Array.from to create an array of length 8 and map over it with row as the index
        ) =>
          columns.map((colLetter, col) => {
            // Mapping over the columns array to get the column letter and column index
            const id = `${colLetter}${8 - row}`; // Using 8 - row to start numbering from the top
            const piece = squares[id] || null;
            const color = getSquareColor(row, col);
            const isActive = activeSquare === id;
            const isPossibleMove = possibleMoves.includes(id);
            const isThreatened = threatSquare === id;

            return (
              <Square
                key={id}
                id={id}
                color={color}
                piece={piece}
                isActive={isActive}
                isPossibleMove={isPossibleMove}
                isThreatened={isThreatened}
                onClick={() => onSquareClick(id)}
              />
            );
          })
      )}
    </div>
  );
};
