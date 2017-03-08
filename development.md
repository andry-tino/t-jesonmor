# Development

We can start developing the game now! In order to do that, we just follow the phases we introduced in the previous chapter. And we start with something called **concept design**.

## Concept design
Before digging into coding, a lot happens and without writing a single line of code! This is the time where we sit and think about how our application should look like, what it is supposed to do and how the user should interact with it. 

This phase, in the context of very big projects, is usually carried on by people that are not developers. I am telling you this because at this stage we need to forget about programming and think as users. We must sit down and write our ideas, polish them until we have a good concept of what our game will look like once developed and distributed (released).

### What are we going to create?
Sounds silly, but this simple question starts it all. And we need to give a clear answer, otherwise we won't be precise when developing whatever it is we want to create.

What we want to build is a game and that game is JM. This game is played by 2 players only. So, speaking more generally, the application we want to build is a game and the users of our applications are the players. Throughout this tutorial we will refer to players as users and vice versa, the same goes when we refer to application as game.

### How will the user interact with the application?
How do we want our players to play this game? Should it be an online game with both players sitting in 2 different locations in the world? Will the users use the mouse? The keyboard? Or maybe we want to optimize the game for a tablet or a phone?

Here we are going to build the simplest scenario ever: 2 players sitting in front of the same computer which is running the game. Each player waits for its turn and uses the mouse to click on the board and move pieces, one at a time.

## Defining the architecture
In Software Development this is a very crucial phase. Again no coding is involved, but we move from the user perspective and start thinking as programmers. The question we ask ourselves is:

> What are the components we need to build and how should they interact together?

This question embodies the definition of [Software Architecture](https://en.wikipedia.org/wiki/Software_architecture). Why is it important for us to define the architecture before developing our application? Because when an architecture is defined, the development can be organized. If you are a team of developers, it is possible to better organize work and even parallelize it!

### The components
So, for our exercise, we are going to define a simple architecture. The components we need are the following:

- **Board:** The board of the game. This is going to be the an interactive object defining a 9x9 Chessboard. This object will also be responsible for implementin the rules of the game.
- **Houses:** In Chess, every place where a piace can stay is called _house_. Our board will need 81 houses, but they will all be the same type of object.
- **Horses:** We need to define a component for horses. A horse can be black or white and can be moved across houses.

### Interactions and relations
How should these 3 components interact with each other? This is about defining relations between them. If we define components in an architecture that do not interact with each other, then our application would do nothing, we need to have these objects communicate to each other. So now we need to define these communication channels.