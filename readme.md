# Dave's Super Simple and Super Inefficient Sudoku Solver

One of the things I resolved to do this year was get better at Javascript. I've dabbled in coding here and there and have always enjoyed it, so why not try and get better at it?

A colleague of mine posed a challenge recently: try and build a script that can solve Sudoku puzzles.

Alright, then. Let's try it!

## Does this really work?
Yes! Mostly. As long as the puzzle can be considered somewhat easy (give it a minimum of about 30 complete cells or so), it will go ahead and solve it!

One thing to note: there's currently no way to just feed this any random puzzle. I've actually added the puzzles to an object and a puzzle is randomly selected when the page loads.

Another thing to note: this actually doesn't know the solutions ahead of time. They are generated on the fly, using two functions I wrote that are based on actual simple Sudoku strategies: The "only choice rule" and the "single possibility rule." These are enough to probably solve really simple puzzles, but it's going to choke on the really hard stuff until I implement some more advanced logic.

## How to use

Download this project, open up index.html in your favorite browser and click the "solve" button. Tada!

## You're doing things weird

Probably! Please let me know what I could have done better. I'm eager to learn more. I'm like a sponge, ready to soak up all this knowledge.

-@davely