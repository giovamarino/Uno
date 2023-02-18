import "./App.css";
import cards from "./data/cards.json";
// import users from "./data/users.json";

let usersCards = [];
let botsCards = [];
let cardsInPlay = [];

// choose random card
// put it in cardsinplay
let n;
let setFirstCard = () => {
  n = Math.floor(Math.random() * cards.length);
  cardsInPlay.push(n);
  console.log(n);
};
setFirstCard();

let initialDraw = (player) => {
  for (let i = 0; i < 7; i++) {
    let cardSelection = Math.floor(Math.random() * cards.length);
    // if card is already in play:
    if (cardsInPlay.includes(cardSelection)) {
      // get new card. check if already in play
      while (cardsInPlay.includes(cardSelection)) {
        cardSelection = Math.floor(Math.random() * cards.length);
      }
    }
    player.push(cardSelection);
    cardsInPlay.push(cardSelection);
  }
  console.log(`cards in play: ${cardsInPlay}`);
};
initialDraw(usersCards);
initialDraw(botsCards);
console.log(usersCards);
console.log(botsCards);

function App() {
  return (
    <div className="App">
      <div>
        {usersCards.map((card) => {
          return <img src={cards[card].img} alt="" />;
        })}
      </div>
      <div>
        <img src={cards[n].img} alt="" />
      </div>
      <div>
        {botsCards.map((card) => {
          return <img src={cards[card].img} alt="" />;
        })}
      </div>
    </div>
  );
}

export default App;
