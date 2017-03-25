# Developing the logic

The fun starts now! We have to make this thing interactive.

## Designing the interaction: human vs. human
As always, let's hold back, let's stop coding and reflect upon what it is we want to achieve. What kind of experience do we want our players to have?

In our first attempt, we are going to let 2 players confront each other, 2 human players. Since we need to make things simple for now, we are going to have the players use the same PC and, in turns, move pieces one at a time.

## Designing the moving of an horse
How to move horses?

1. One player will move one horse by first clicking on the horse he want to move.
2. The house will highlight and show a different color to indicate that house was selected.
3. The player will then select the house where he wants the horse to be moved.
4. The initial house will go back to its normal color and the horse will be removed from there.
5. The horse will appear in the house the player has lastly selected.

This is a very basic interaction, but we can improve it later.
