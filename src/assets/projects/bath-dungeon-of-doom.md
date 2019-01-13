# Dungeon of Doom

This project was the final coursework of the `Principles of Programming` Computer Science module I followed at the University of Bath.  
It is a fun (and dare I say, actually sort of claustrophobia-/fear-inducing) command-line-based game where you explore a dungeon and have to watch out not to be killed by a bot.  
I poured lots of passion into it and even went so far as to figure out Dijkstra's algorithm for pathfinding :)  
(And my hard work paid off, as I got basically the equivalent of a 100% as a grade~)  
I would consider this code base a good example of how ordered I like (my/anyone's) code to look if I have the time to spend on documenting/refactoring.

### How to win

Winning is (at least seemingly) very simple: collect the gold and get to the exit of the dungeon!  
The dungeon that you have to collect the gold in is made up out of square tiles and you can only move up, down, left and right.  
  
When you start the game, the amount of gold required to win is displayed and you can always remind yourself later with the HELLO command (:  
Collect a GOLD tile when you find it using the PICKUP command, and when you've got enough gold move onto an EXIT tile to finish the game!  

### Watch out

Watch out though, as there is a BOT of terror moving around the dungeon that's out to catch you!  
However, as it's dark the bot can see just as much as you can, so it doesn't have any edge over except that you cannot touch it by with even so much as a hair.  
And that it's got cool algorithms to hunt you down as efficiently as possible when it sees you.  
But anyways, you're smart so you'll be just fine!!  
Concretely put: when the bot ends up on the same tile as you, your dead. ಠ_ಠ  

### Turns

The way the game works is in TURNS, which means that you and the bot each take turns doing a thing.  
This means that as you're carelessly PICKUP-ing gold, the BOT has another opportunity to move even closer to you!  
An additional possibly game-changing observation is that when you LOOK and see the BOT, it will in its next turn probably MOVE from that square to a new space: so try to anticipate its movements!   
By the way, even the COMMAND command takes up a turn, so better exercise those memory muscles!  