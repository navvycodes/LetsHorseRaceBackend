import { Card, Rank, Suit } from "./types";

const shuffle = (array: Card[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};
export const generateDeckAndLegs = (
  numLegs: number,
  numDecks: number
): { deck: Card[]; legs: Card[] } => {
  const suits = ["Hearts", "Diamonds", "Clubs", "Spades"];
  const ranks = [
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "Jack",
    "Queen",
    "King",
    "Ace",
  ];
  const deck: Card[] = [];
  for (let i = 0; i < numDecks; i++) {
    for (const suit of suits) {
      for (const rank of ranks) {
        if (i === 0 && rank === "Ace") {
          continue; // Skip Ace for the first deck
        }
        deck.push({ suit: suit as Suit, rank: rank as Rank });
      }
    }
  }

  const shuffledDeck = shuffle(deck);
  const legs = shuffledDeck.slice(0, numLegs);
  return { deck: shuffledDeck, legs };
};
