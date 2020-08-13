
import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import Logo1 from './jethwanilogo.png';
import Logo2 from './faizianlogo.png';

function Square(props) {
        let className = "square";
        return (
            <button className={className} onClick={props.onClick}>
                {props.value}
            </button>
        );
}

class Board extends React.Component {
    
    renderSquare(i) {
        return <Square 
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        highlight={this.props.winLine && this.props.winLine.includes(i)}
        />;
    }

    render() {

       return (
        <div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }
}

class Game extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        history: [{
          squares: Array(9).fill(null),
        }],
        stepNumber: 0,
        xIsNext: true,
      }
    }

    handleClick(i) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[this.state.stepNumber];
      const squares = current.squares.slice();
      if (calculateWinner(squares) || squares[i]) {
        return;
      }
      squares[i] = this.state.xIsNext ? <img src={Logo1} alt="Deathwani" /> : <img src={Logo2} alt="Painman" />;
      this.setState({
        history: history.concat(
         [{ 
           squares: squares, 
          }]),
          stepNumber: history.length,     
         xIsNext: !this.state.xIsNext,
      });
    }

    jumpTo(step) {
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0,
      })
    }

    render() {
        const history = this.state.history;
        const current = history[history.length - 1];
        const winInfo = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
          const desc = move ?
          'Go to move #' + move :
          'Go to game start';
          return (
            <li key={move}>
              <button onClick={() => this.jumpTo(move)}>{desc}</button>
            </li>
          );
        });

        let status;
        let winningLine;
        if (winInfo) {
          status = 'Winner: ' + winInfo.winner;
          winningLine = winInfo.line;
        } else if(this.state.stepNumber === 9) {
          status = 'Game is Tied!';
        } else {
          status = 'Next player: ' + (this.state.xIsNext ? 'Deathwani': 'Painman');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board 
                    squares={current.squares}
                    onClick={(i) => this.handleClick(i)}
                    winLine = {winningLine}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

class Navbar extends React.Component{
  render() {
      return (
        <div>
            <nav className = 'Nav'>
              <h1 id='heading'>TicTacToe</h1>
            </nav>
            <Game />
        </div>
      );
  }
}

// ========================================

ReactDOM.render(
    <Navbar />,
    document.getElementById('root')
);

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
    const [a,b,c] = lines[i];
    if (squares[a] && squares[b] && squares[c] && 
      squares[a].props.alt === squares[b].props.alt && squares[a].props.alt === squares[c].props.alt) {
      return {
        winner: squares[a].props.alt,
        line: lines[i],
      }
    }
  }
  return null;
}

