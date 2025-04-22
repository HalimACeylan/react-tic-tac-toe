import logo from "./logo.svg";
import { useState } from "react";
import "./App.css";
function Square({ className,value, onSquareClick,highlight }) {
  return (
    <button
    onClick={onSquareClick}
    className={`${className} ${highlight ? "square-winner" : ""}`}
  >
    {value}
  </button>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {winner: squares[a], lines: lines[i]};
    }
  }
  return {winner: null, lines: []};
}

function Board({ xIsNext, squares, onPlay }) {
  const {winner,lines} = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }
  function handleClick(i) {
    const nextSquares = squares.slice();
    let {winner,_} = calculateWinner(nextSquares);
    if (squares[i] || winner) {
      return;
    }
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  const boardRows = [0, 1, 2].map((i) => (
    <div key={i} className="board-row">
      {[0, 1, 2].map((j) => {
        const index = i * 3 + j;
        const isHighlighted = lines?.includes(index);
        return (
          <Square
            className="square"
            key={index}
            value={squares[index]}
            onSquareClick={() => handleClick(index)}
            highlight={isHighlighted}
          />
        );
      })}
    </div>
  ));

  return (
    <>
      <div className="status">{status}</div>
      {boardRows}
    </>
  );
}
function BoardToDisplay({ squares, xIsNext }) {
  const {winner,lines} = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  const boardRows = [0, 1, 2].map((i) => (
    <div key={i} className="board-row">
      {[0, 1, 2].map((j) => {
        const index = i * 3 + j;
        const isHighlighted = lines?.includes(index);
        return (
          <Square
            className="square-to-show"
            key={index}
            value={squares[index]}
            highlight={isHighlighted}
          />
        );
      })}
    </div>
  ));

  return (
    <>
      <div className="status">{status}</div>
      {boardRows}
    </>
  );
}
function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const [isAscending, setIsAscending] = useState(true);
  const handleSort = () => {
    setIsAscending(!isAscending);
  };
  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }
  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = "Go to move #" + move;
    } else {
      description = "Go to game start";
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
        {move  === 0 ? "": <BoardToDisplay squares={squares} xIsNext={move % 2 === 0} />}
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <p>You are at the move #{currentMove + 1}</p>
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>
          {isAscending ? moves : [...moves].reverse()}
        </ol>
        <button onClick={handleSort}>
              {isAscending ? "Sort Descending" : "Sort Ascending"}
            </button>
      </div>
    </div>
  );
}

function App() {
  return <Game />;
}

export default App;
