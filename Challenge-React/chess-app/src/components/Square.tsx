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
  color: "#769656" | "#ccccc9";
  piece: Piece;
  isActive: boolean;
  isPossibleMove: boolean;
  isThreatened: boolean | null;
  onClick: () => void;
}

export const Square: React.FC<SquareProps> = ({
  color,
  piece,
  isActive,
  isPossibleMove,
  isThreatened,
  onClick,
}) => {
  
  // Background color and border depend on the square's color and whether it's active
  let styles: React.CSSProperties = {
    backgroundColor: color,
    border: isActive ? "2px solid blue" : "none",
    zIndex: isActive ? 1 : 0,
  };

  // If the square represents a possible move, add a subtle highlight
  if (isPossibleMove) {
    styles.border = "2px solid yellow";
  }

  if (isThreatened && !isActive) {
    styles.border = "2px solid red";
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
    return piece && piece.startsWith("white") ? "white" : "black";
  };

  return (
    <div className="square" style={styles} onClick={onClick}>
      {piece && 
        <FontAwesomeIcon
          className="piece" 
          icon={getIconForPiece(piece)} 
          color={getIconColor(piece)}
        />
      }
    </div>
  );
};

// Export the Piece type so that other components can use it
export type {Piece};