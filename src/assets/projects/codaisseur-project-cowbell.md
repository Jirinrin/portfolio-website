# Project Cowbell

Cowbell is the working title of the project we've been working on during Codaisseur Academy's 1st project week.
The assignment was to collaborate in a team to design and build a Tinder-like web-app with React and Redux.
Our team consisted of one designer from Codaisseur Design Academy and two developers from Codaisseur Code Academy.
As a team we came up with the idea to create a solution for matching of musicians and bands.

## Scope of the project

Due to time-constraints, and limited experience, we have decided to limit the scope of our project and limit the amount of features to implement.
Besides that, for the sake of simplicity we've taken into account a couple of assumptions to prevent for ballooning scope.

1. A musician can be part of one band at max. Meaning:
    * A musician with no bands is *looking for a band*.
    * A musician with one band is *not looking for a band*.
2. A musician who is looking for a band will get recommendations for bands to (dis)like.
3. A musician who is already part of a band will get recommendations for musicians to (dis)like as a new member of his/her band.
    * The musician will (dis)like other musicians *on behalf of* his/her band
    * ...