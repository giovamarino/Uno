import cards from "./data/cards.json";

// let [typedCity, setTypedCity] = useState("");

let usersCards = [];
let botsCards = [];
let centerCard;
let cardsInPlay = [];

// choose random card
// put it in cardsinplay
let n;
let setFirstCard = () => {
  n = Math.floor(Math.random() * cards.length);
  centerCard = n;
  cardsInPlay.push(n);
  // get number value of n
};
setFirstCard();
console.log(`center card value: ${centerCard}`);

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

let playCard = (currentCard) => {
  // if card color or number === table card color/number:
  if (
    cards[currentCard].number === cards[centerCard].number ||
    cards[currentCard].color === cards[centerCard].color
  ) {
    // set new center card
    // you can use the number to select the object in json file
    // todo: remove it from usersCards
    // todo: remove old centerCard from cardsInPlay
    centerCard = currentCard;
    console.log(
      `usersCards:${usersCards} botsCards:${botsCards} centerCard:${centerCard} cardsInPlay:${cardsInPlay}`
    );
  }
};

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
          return (
            <img
              onClick={() => {
                console.log(`${cards[card].color} ${cards[card].number}`);
                playCard(card);
              }}
              src={cards[card].img}
              alt=""
            />
          );
        })}
      </div>
    </div>
  );
}

export default App;
