import MoveInput from '../MoveInput';
import './Game.css'
const Game = ()=>{
    return (
        <div className="container">
          <MoveInput onSubmit={(input)=>console.log(`game: ${input}`)} />
        </div>
      );
    }




export default Game;
