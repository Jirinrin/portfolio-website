# Bomberman

This repo contains a frontend and a backend of a multiplayer game.  
It was built during a 4 day interval by Jiri Swen and Jorrit Stein as a 'final hackathon' of the Codaisseur Code Academy.  

In this project, we were provided with a simplistic working turn-based TicTacToe game for two players that makes use of websockets and were asked to make a new game that can use this as a basis.  
We ended up changing it to a real-time Bomberman clone for up to 4 players :)  
Btw don't go expecting very clean or well-organized code, we needed all the time we had to implement as many features as possible xD

Information on how to start the frontend and backend is to be found in the READMEs of those respective folders.

## Logic 

Okay, so you and 1-3 other players are connected to the same port (no, we didn't manage to deploy it at the time so please use your own port-sharing ways, or simulate it by running different users in different browsers (not different tabs, this used to work but now seems to crash something)).  
* Every user needs to `SIGN UP` with a different email (and a password) and then `LOGIN`.  
* Now one player needs to `CREATE GAME` and click `WATCH`.  
* Other players can then join by also clicking `WATCH` for this new game that also popped up on their games screen, then clicking `Join game`.
  * ...or you can also play on your own, if that's your style (I'm not judging, single player games ftw amirite)
* The host will see their email addresses pop up and can click `Start game` to start the game for everyone!!

## Playing the game

### Rules

* The last man standing wins the game
* Place bombs to destroy boxes and try to get to the other players to kill them / shut them in with bombs etc.
* A player dies when hit by an(yone's) explosion, or when hit by a flame that an opponent shot at them

### Controls

* Move with the `↑ ↓ → ←` arrow keys
* Place a bomb with the `Z` key (the bomb will appear under you on the same position, so run away quickly!)
* Fire a flame with the `X` key (it's quite overpowered but very fun to use)

### Powerups

By default, the bombs you place have a `+`-shaped explosion that only reaches one square far.  
And: you can only have one active bomb at the same time.

But fret not, as the Bakudan Research Institute has developed a solution *just for you*~!  
The following powerups can drop from a box when you destroy it (we configured the odds so that powerups are pretty likely to drop, for demo purposes):

<img src="./client/src/images/df^.gif" width="40em"/><img src="./client/src/images/db^.gif" width="40em"/><img src="./client/src/images/dfv.gif" width="40em"/><img src="./client/src/images/dbv.gif" width="40em"/>  

* ***Happy :P flame***: increases your explosion size by 1
  * Always useful for killing your friends to have explosions that extend to the edges of the screen, though watch out not to kill yourself in the process
* ***Bomb***: increases your maximum active bomb count by 1
  * Rev up that efficiency by excavating multiple corridors at once~!
* ***Blue (sad)〈:( flame***: decreases your explosion size by 1 (except if it's already 1)
* ***Bomb with down arrow***: decreases your maximum active bomb count by 1 (except if it's already 1)

If you don't want to pick up a powerup but still need to pass that square, you can just *explode it with your bombssss*~~~

### What's with that weird grid thingy under the normal game board that is composed of useless HTML buttons?

Well, we decided to keep that in because this is the interface we originally developed the game in (and it's just rendered to all these fancy sprites from this 2D array),  
and it gives some fun insight into the game logic!  
So yeah, if you want to play it in a command-line-game-style, just scroll down and use this as your GUI! :D

## Thanks

Game assets are ripped by someone called Maneko from the games:
* ["Bomberman Dojo"](http://spritedatabase.net/file/15551/Bomberman_Enemies_and_Miscellaneous)
* ["Bomberman Touch: The Legend of Mystic Bomb"](http://spritedatabase.net/file/15558/Tiles_and_Miscellaneous)  

... and some of these were photoshopped by our in-house Photoshop expert.