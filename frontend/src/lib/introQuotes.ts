// Shown in the full-screen intro splash (Intro.tsx) in place of the site
// name, one at random per page load. A mix of short, widely-quoted
// dev/tech and math/astronomy lines (attributed) plus original one-liners
// (unattributed) — not persona-specific, same pool everywhere.

export type IntroQuote = {
  text: string;
  author?: string;
};

export const introQuotes: IntroQuote[] = [
  // Dev / tech
  { text: "Talk is cheap. Show me the code.", author: "Linus Torvalds" },
  {
    text: "Programs must be written for people to read, and only incidentally for machines to execute.",
    author: "Harold Abelson",
  },
  {
    text: "There are only two hard things in computer science: cache invalidation and naming things.",
    author: "Phil Karlton",
  },
  {
    text: "Simplicity is a prerequisite for reliability.",
    author: "Edsger W. Dijkstra",
  },
  { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
  {
    text: "Any fool can write code a computer can understand. Good programmers write code humans can understand.",
    author: "Martin Fowler",
  },

  // Math
  {
    text: "Mathematics is the language in which God has written the universe.",
    author: "Galileo Galilei",
  },
  {
    text: "Pure mathematics is, in its way, the poetry of logical ideas.",
    author: "Albert Einstein",
  },
  { text: "Number theory is the queen of mathematics.", author: "Carl Friedrich Gauss" },

  // Astronomy
  {
    text: "Somewhere, something incredible is waiting to be known.",
    author: "Carl Sagan",
  },
  {
    text: "The universe is under no obligation to make sense to you.",
    author: "Neil deGrasse Tyson",
  },
  { text: "We are made of star-stuff.", author: "Carl Sagan" },

  // Puns / jokes (original)
  { text: "There are 10 kinds of people: those who understand binary, and those who don't." },
  { text: "My code doesn't have bugs. It has undocumented features." },
  { text: "Parallel lines have so much in common. Shame they'll never meet." },
  { text: "I told a joke about Saturn's rings once. It really had its ups and downs." },
  { text: "If you're seeing this, help!" },
  { text: "I spent too much time on this site. I need to get a life." },
  { text: "Meow" },
  { text: "HAHAHAHAHAHAHAHAAHAHAHAHAHA" },
  { text: "Evaluate the line integral where C is the given curve. We're integrating over the curve C, y to the third ds, and C is the curve with parametric equations x = t cubed, y = t. We're going from t = 0 to t = 2. So we're going to integrate over that curve C of y to the third ds. We're going to convert everything into our parameter t in terms of our parameter t. So I'm going to be integrating from t = 0 to t = 2. Those will be my limits of integration. Now y is equal to t, so I'm going to replace y with what it's equal to in terms of t. So I'm going to be integrating the function t to the third. Now ds we're going to write as a square root of dx dt squared + dy dt squared, squared of all that as we said dt. So we're integrating now everything with respect to t. So this is going to be equal to the integral from 0 to 2 of t to the third times the square root of -- see the derivative of x with respect to t is 3 t squared. So we have 3 t squared squared + dy dt; well, that's just 1 squared dt. So we have the integral from 0 to 2 of t to the third times the square root of 9 t to the fourth + 1 dt. So this is a pretty straightforward integration here. We're going to let u be equal to 9 t to the fourth + 1 then du is equal to 36 t to the third dt and so that tells me I can replace a t to the third dt with a du over 36. And so we're going to have the integral then from -- well, new limits of integration. I'm just going to put some squiggly marks there to remind myself that we switched variables. So I'm not going from t = 0 to t = 2. I'm doing things in terms of you right now. But I have a 1 over 36. I'll put that out front, and we're going to have the square root of u. So u to the 1/2, t to the third dt was replaced by du over 36. We got the 36 out front. And so now this is a pretty easy antiderivative in terms of u. It's u to the 3/2 times 2/3. And again, different limits of integration. We could figure out what they are in terms of u, but I'm going to convert back into t. So we're going to have 1 over 36 times 2/3 times u to the 3/2. Now, u is 9 t to the fourth + 1, that to the 3/2 power. And now we can go ahead and go from original limits of integration 0 to 2. So let's see, when I put a 2 in here, we're going to have -- 1 over 36 times 2/3. That's going to be 1 over 54, isn't it? So we'll have 1 over 54 times -- putting a 2 in, we have 9 times 2 to the fourth. That's 9 times 16, which is 144 + 1, is 145. So we put the 2 in there, we get 145 to the 3/2 minus, putting the 0 in, we get 9 x 0 to the fourth. That's 0. 0 + 1 is 1. So we just get 1 to the 3/2 or 1. So let's see, what's the best way to write this. How about 1 over 54 -- I guess we could leave it like that. We could also write 145 to the 3/2 as 145 times the square root of 145 and then minus 1. And that is that line integral of y to the third ds over the given curve C." }
];
