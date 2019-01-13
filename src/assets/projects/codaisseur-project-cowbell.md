# Project Cowbell

This is a project me and a fellow coder and a UX designer made during the Codaisseur Code Academy's 1st project week.  
The assignment was to collaborate in a team to design and build a Tinder-like web app with React and Redux.  
As a team we came up with the idea to create a solution for matching of musicians and bands.

## Scope of the project

In order to prevent a ballooning scope in the week that we had, we decided to take into account the following assumptions:

1. A musician can be part of one band at max. Meaning:
    * A musician with no bands is *looking for a band*.
    * A musician with one band is *not looking for a band*.
2. A musician who is looking for a band will get recommendations for bands to (dis)like.
3. A musician who is already part of a band will get recommendations for musicians to (dis)like as a new member of his/her band.
    * The musician will (dis)like other musicians *on behalf of* his/her band
    * ...

The applicaton is limited in functionality due to the time we had for it, but it is definitely a good proof-of-concept for the idea that we had.  
In the app it is possible to like/dislike musicians/bands (depending on what you are), it is shown when a match occurred and you can view your matching musicians/bands.  
It's also possible to do some filtering on location and instruments.
