import "./App.css";
import cards from "./data/cards.json";
// import users from "./data/users.json";

let n = Math.floor(Math.random() * cards.length);
console.log(n);
let usersCards = [];

let initialDraw = () => {
  for (let i = 0; i < 7; i++) {
    let cardSelection = Math.floor(Math.random() * cards.length);
    // if card is already in hand:
    if (usersCards.includes(cardSelection)) {
      // get new card. check if already in hand
      while (usersCards.includes(cardSelection)) {
        cardSelection = Math.floor(Math.random() * cards.length);
      }
    }
    usersCards.push(cardSelection);
  }
  console.log(usersCards);
};
initialDraw();

function App() {
  return (
    <div className="App">
      {usersCards.map((card) => {
        return <img src={cards[card].img} alt="" />;
      })}
    </div>
  );
}

export default App;
