import React, { useState } from 'react';
import './App.css';

// Color palette from task details
const COLORS = {
  accent: '#FFEB3B',
  primary: '#1976D2',
  secondary: '#424242',
};

// PUBLIC_INTERFACE
function getNextPlayer(board) {
  /** Given a board, returns the next player's marker: "X" or "O". */
  const moves = board.filter(Boolean).length;
  return moves % 2 === 0 ? 'X' : 'O';
}

// PUBLIC_INTERFACE
function calculateWinner(board) {
  /** Checks board for a winner or draw. Returns {winner, line, isDraw}. */
  const lines = [
    [0,1,2],[3,4,5],[6,7,8], // Rows
    [0,3,6],[1,4,7],[2,5,8], // Cols
    [0,4,8],[2,4,6],         // Diags
  ];
  for (let line of lines) {
    const [a,b,c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line, isDraw: false };
    }
  }
  if (board.every(Boolean)) {
    return { winner: null, line: null, isDraw: true };
  }
  return { winner: null, line: null, isDraw: false };
}

// PUBLIC_INTERFACE
function Square({ value, onClick, isWinner }) {
  /**
   * Renders a single square in the board.
   * Highlights if it's part of the winning line.
   */
  return (
    <button
      className="ttt-square"
      onClick={onClick}
      style={{
        color: value === 'X'
          ? COLORS.primary
          : value === 'O'
          ? COLORS.secondary
          : undefined,
        background:
          isWinner
            ? COLORS.accent + '22'
            : 'var(--square-bg, white)',
        borderColor: isWinner ? COLORS.accent : '#dadada',
        transition: 'background 0.2s',
      }}
      aria-label={value ? `Player ${value}` : 'Empty'}
    >
      {value}
    </button>
  );
}

// PUBLIC_INTERFACE
function TicTacToeBoard({ board, onSelect, winningLine, disabled }) {
  /**
   * Renders the 3x3 grid of Tic Tac Toe.
   */
  return (
    <div
      className="ttt-board"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, minmax(70px, 1fr))',
        gap: '10px',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'white',
        borderRadius: 16,
        padding: 20,
        boxShadow: '0 2px 12px rgba(60,60,60,0.07)',
        margin: '0 auto',
      }}
    >
      {board.map((val, i) => (
        <Square
          key={i}
          value={val}
          onClick={!val && !disabled ? () => onSelect(i) : undefined}
          isWinner={winningLine && winningLine.includes(i)}
        />
      ))}
    </div>
  );
}

// PUBLIC_INTERFACE
function PlayerStatus({ winner, isDraw, currentPlayer }) {
  /**
   * Displays the status: Current player, winner, or draw.
   */
  let content;
  if (winner) {
    content = (
      <span>
        <span style={{
          color: winner === 'X' ? COLORS.primary : COLORS.secondary,
          fontWeight: 700,
        }}>{winner}</span> wins!
      </span>
    );
  } else if (isDraw) {
    content = <span>It's a draw.</span>;
  } else {
    content = (
      <span>
        <span style={{
          color: currentPlayer === 'X' ? COLORS.primary : COLORS.secondary,
          fontWeight: 600,
        }}>{currentPlayer}</span>'s turn
      </span>
    );
  }
  return (
    <div
      className="ttt-status"
      style={{
        marginBottom: 24,
        fontSize: '1.5rem',
        letterSpacing: '0.01em',
        minHeight: '2.2rem',
        textAlign: 'center',
      }}
      aria-live="polite"
    >
      {content}
    </div>
  );
}

// PUBLIC_INTERFACE
function ControlBar({ onRestart, disabled }) {
  /**
   * Renders the control buttons (Restart).
   */
  return (
    <div
      className="ttt-controls"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        marginTop: 28,
      }}
    >
      <button
        className="btn btn-large"
        style={{
          background: COLORS.accent,
          color: '#1A1A1A',
          fontWeight: 600,
          minWidth: 120,
        }}
        onClick={onRestart}
        disabled={disabled}
      >
        Restart
      </button>
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  /* Main App: handles game state and layout */
  const [board, setBoard] = useState(Array(9).fill(null));
  const gameStatus = calculateWinner(board);
  const currentPlayer = getNextPlayer(board);

  function handleSquareClick(idx) {
    if (gameStatus.winner || gameStatus.isDraw || board[idx]) return;
    setBoard(board => {
      const copy = board.slice();
      copy[idx] = getNextPlayer(board);
      return copy;
    });
  }

  function restartGame() {
    setBoard(Array(9).fill(null));
  }

  // Responsive minWidth for the board
  const responsiveBoardWrapper = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: 'calc(100vh - 72px)',
    justifyContent: 'center',
    paddingTop: 60,
    paddingBottom: 32,
  };

  return (
    <div className="app" style={{ background: '#f7faff', minHeight: '100vh' }}>
      <nav className="navbar" style={{ background: COLORS.primary, color: 'white' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <div className="logo">
              <span className="logo-symbol" style={{ color: COLORS.accent }}>&#9675;</span>
              Tic Tac Toe
            </div>
          </div>
        </div>
      </nav>
      <main>
        <div style={responsiveBoardWrapper}>
          <PlayerStatus
            winner={gameStatus.winner}
            isDraw={gameStatus.isDraw}
            currentPlayer={currentPlayer}
          />
          <TicTacToeBoard
            board={board}
            onSelect={handleSquareClick}
            winningLine={gameStatus.line}
            disabled={!!gameStatus.winner || gameStatus.isDraw}
          />
          <ControlBar
            onRestart={restartGame}
            disabled={board.every(sq => !sq)}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
