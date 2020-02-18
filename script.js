let board = null;

const game = new Chess();

function onDragStart(source, piece, position, orientation) {
    if(game.game_over()) return false;
    
    if(piece.search(/^b/) !== -1) return false;
}

function makeMove() {
    let possibleMoves = game.moves();
    let bestMove = null;
    let highestEvaluation = -Infinity;
    
    for(let i = 0; i < possibleMoves.length; i++) {
        let tempGame = new Chess();
        tempGame.load(String(game.fen()));
        tempGame.move(possibleMoves[i]);
        let calcScore = minimax(tempGame, false, 2, -Infinity, Infinity);
        if(calcScore > highestEvaluation) {
            highestEvaluation = calcScore;
            bestMove = possibleMoves[i];
        }
    }
    
    game.move(bestMove);
    board.position(game.fen());
}

function minimax(game, maximizing, depth, alpha, beta) {
    if(depth === 0) {
        return calculateEvaluation(game);
    }

    let moves = game.moves();

    if(maximizing) {
        let bestScore = -Infinity;
        
        for(let i = 0; i < moves.length; i++) {
            game.move(moves[i]);
            bestScore = Math.max(bestScore, minimax(game, !maximizing, depth - 1, alpha, beta));
            game.undo();
            alpha = Math.max(alpha, bestScore);
            if (beta <= alpha) {
                return bestScore;
            }
        }

        return bestScore;
    } else {
        let bestScore = Infinity;
        
        for(let i = 0; i < moves.length; i++) {
            game.move(moves[i]);
            bestScore = Math.min(bestScore, minimax(game, !maximizing, depth - 1, alpha, beta));
            game.undo();
            beta = Math.min(beta, bestScore);
            if (beta <= alpha) {
                return bestScore;
            }
        }

        return bestScore;
    }
}

function calculateEvaluation(game) {
    let score = 0;
    for(let i = 0; i < 8; i++) {
        for(let j = 0; j < 8; j++) {
            let piece = game.get(String.fromCharCode(97 + i) + (j + 1));
            if(piece) {
                if(piece.color == 'b') {
                    if(piece.type == "p") {
                        score += 10;
                    } else if(piece.type == "n" || piece.type == "b") {
                        score += 30;
                    } else if(piece.type == "r") {
                        score += 50;
                    } else if(piece.type == "q") {
                        score += 90;
                    } else if(piece.type == "k") {
                        score += 900;
                    }
                } else {
                    if(piece.type == "p") {
                        score -= 10;
                    } else if(piece.type == "n" || piece.type == "b") {
                        score -= 30;
                    } else if(piece.type == "r") {
                        score -= 50;
                    } else if(piece.type == "q") {
                        score -= 90;
                    } else if(piece.type == "k") {
                        score -= 900;
                    }
                }
            }
        }
    }
    return score;
}

function onDrop (source, target) {
    // see if the move is legal
    var move = game.move({
        from: source,
        to: target,
        promotion: 'q' // NOTE: always promote to a queen for example simplicity
    })
    
    // illegal move
    if (move === null) return 'snapback'
    
    // make random legal move for black
    window.setTimeout(makeMove, 250)
}

// update the board position after the piece snap
// for castling, en passant, pawn promotion
function onSnapEnd () {
    board.position(game.fen())
}

var config = {
    draggable: true,
    position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd
}
board = Chessboard('board', config)