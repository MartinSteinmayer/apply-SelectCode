import React from "react";
import "./Square.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChessKnight, faChessQueen } from '@fortawesome/free-solid-svg-icons';

// Define the type for the piece, which can be 'white-queen', 'white-knight', 'black-queen', 'black-knight', or null
type Piece = 
  | "white-queen"
  | "white-knight"
  | "black-queen"
  | "black-knight"
  | null;

// Define the type for the Square component's props
interface SquareProps {
  id: string;
  color: "black" | "white";
  piece: Piece;
  isActive: boolean;
  isPossibleMove: boolean;
  onClick: () => void;
}

export const Square: React.FC<SquareProps> = ({
  color,
  piece,
  isActive,
  isPossibleMove,
  onClick,
}) => {
  
  // Background color and border depend on the square's color and whether it's active
  let styles: React.CSSProperties = {
    backgroundColor: color,
    border: isActive ? "2px solid blue" : "none",
  };

  // If the square represents a possible move, add a subtle highlight
  if (isPossibleMove) {
    styles.backgroundColor = "yellow";
  }

  // Function to determine the appropriate FontAwesome icon based on the piece type
  const getIconForPiece = (piece: Piece) => {
    switch(piece) {
      case "white-queen":
        return faChessQueen;
      case "black-queen":
        return faChessQueen;
      case "white-knight":
        return faChessKnight;
      case "black-knight":
        return faChessKnight;
      default:
        return faChessKnight;
    }
  };

  // Determine icon color based on piece type
  const getIconColor = (piece: Piece) => {
    return piece && piece.startsWith("white") ? "grey" : "black";
  };

  return (
    <div className="square" style={styles} onClick={onClick}>
      {piece && 
        <FontAwesomeIcon 
          icon={getIconForPiece(piece)} 
          color={getIconColor(piece)}
        />
      }
    </div>
  );
};
