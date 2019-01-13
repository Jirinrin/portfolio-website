# Bomberman clone

This bomberman clone was built during a 4 day interval by me and a classmate as a 'final hackathon' of the Codaisseur Code Academy.  

In this project, we were provided with a simplistic working turn-based TicTacToe game for two players that makes use of websockets and were asked to make a new game that can use this as a basis.
We ended up changing it to a real-time Bomberman clone for up to 4 players :)  
Btw don't go expecting very clean or well-organized code, we needed all the time we had to implement as many features as possible xD

### Rules

The last man standing wins the game;  
Place bombs to destroy boxes and try to get to the other players to kill them / shut them in with bombs etc.;  
A player dies when hit by an(yone's) explosion, or when hit by a flame that an opponent shot at them

### Controls

Move with the `↑ ↓ → ←` arrow keys;  
Place a bomb with the `Z` key (the bomb will appear under you on the same position, so run away quickly!);  
Fire a flame with the `X` key (it's quite overpowered but very fun to use)

### Powerups

By default, the bombs you place have a `+`-shaped explosion that only reaches one square far.  
And: you can only have one active bomb at the same time.

But fret not, as the Bakudan Research Institute has developed a solution *just for you*~!  

Powerups exists to increase/decrease your explosion size and to increase/decrease the maximum number of concurrent active bombs!  
Kill your friends with explosions that go all the way accross the screen and excavate five corridors at once!

If you don't want to pick up a powerup but still need to pass that square, you can just *explode it with your bombssss*~~~