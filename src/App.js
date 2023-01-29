import "./App.css";
import cards from "./data/cards.json";
// import users from "./data/users.json";

// console.log(cards[1].test[Math.floor(Math.random() * cards[1].test.length)]);
// console.log(cards[1].test[Math.floor(Math.random() * cards[1].test.length)]);

let n = Math.floor(Math.random() * cards.length);
console.log(n);

let startDraw = () => {
  let usersCards = [];
  for (let i = 0; i < 7; i++) {
    let cardSelection = Math.floor(Math.random() * cards.length);

    // push into userCards if no duplicates
    if (!usersCards.includes(cardSelection)) {
      usersCards.push(cardSelection);
    }
  }
  console.log(usersCards);
  // users[0].hand.push(usersCards);
};
startDraw();

function App() {
  return (
    <div className="App">
      <img src={cards[n].img} alt="" />
    </div>
  );
}

export default App;
