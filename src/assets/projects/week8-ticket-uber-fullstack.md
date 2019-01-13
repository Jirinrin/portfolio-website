# Ticket Uber

This application was the final assignment during the Codaisseur Codaisseur Academy, where we had 4 days to 'put all our aquired skills together' for a final evaluation.  
(See FinalAssignment.md for the formal requirements of the assignment / basically a detailed description of how the application works.)

It is a simple application where people can (re)sell tickets to events, and when you buy a ticket an Uber will be dispatched to your house (I know it's a bit weird and ambiguous, but it made for a good assignment).  
It's composed of a React.js client and a Node.js+Koa+RoutingControllers+TypeORM+Postgres server-database-combo, and uses a few extra npm packages here and there.

## Features

**`Login/logout/signup as admin/normal user`**  

**`Events list`**  
Creating/editing/deleting an event (admin only), and filtering and searching in the list of events.

**`Event description + Tickets list on an event`**  
Creating/editing/deleting a ticket that you posted, automatic color-marking of tickets based on the risk they are a fraud and possibility to sort tickets by date/author/price.

**`Ticket description + Comments list on a ticket`**  
Putting/deleting a comment on a ticket.

### Aside

As you can see, it looks like crap. This is because I chose to sacrifice aeshetics to spend my time on creating functionality, which I still think was a good decision. Maybe I'll add some styling eventually.

Oh, and yes, the 'Uber' feature from the title was actually completed by no one in the course, as integrating the app with the Uber API was the very last bonus item on the assignment page...  
That's not gonna stop me from keeping it in the title tho~!