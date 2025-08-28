const GameStatus = Object.freeze({
    IN_PROGRESS: Symbol('IN_PROGRESS'),
    WHITE_TURN: Symbol('WHITE_TURN'),
    BLACK_TURN: Symbol('BLACK_TURN'),
    ENDED: Symbol('ENDED')
  });

  const PLAYER = Object.freeze({
    WHITE: Symbol('WHITE'),
    BLACK: Symbol('BLACK')
  });