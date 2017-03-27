# Moving an horse

We need to write down the code for `_onClickHandler` as it was showed in the previous diagrams. However we will need a few things first. One of the functionalities we need to have in place is the code for moving an horse from one house to the other.

## Common grounding
Let's enstablish some naming and a terminology we are going to use. Everytime we have a move, we recognize the following things:

- **Source house:** It is the house the horse is moving from. Or, conversely, it is the horse's initial house.
- **Destination house:** It is the house where the horse wants to move.

With this in mind, we need to create a function that makes the movement of an horse from one house to another. Please be aware that this function will not take into consideration the color of the horse or whether the horse can move to the final house, all of this will be taken care of by `_onClickHandler`. The function we are going to write just makes the move and that's it!
