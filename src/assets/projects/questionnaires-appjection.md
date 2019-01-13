# Appjection Questionnaire Creator

This was the final 1.5week project in the Codaisseur Code Academy.  
A UX designer and a team of 4 Code Academy graduates, including me, were assigned to help this company called Appjection by creating a frontend interface for their internal use.  
[Appjection](https://www.appjection.com) provides a mostly automated service that generates a legally grounded appeal letter when you've received an unjust fine.  
This letter is based on a questionnaire that the user fills in, with a flowchart-type of deal that branches/converges based on what they answer.  
Before our intervention Appjection was using an over-engineered Google Sheets document to store this whole complicated flow structure.  
Our job was to make it easier to add/edit/delete reusable questions and questionnaires that define relations between these questions. For this, Appjection provided an API (based on the Google Sheets) that we could POST/PATCH/DELETE to.

What we ended up with is what you can see below (the source repository isn't public so sadly you won't be able to view the code):  
a comprehensive system to add/edit/delete questions and questionnaires and a 'tree editing tool' to intuitively edit a questionnaire.  

My role in this was very focused on (though I did help out in other areas from time to time when necessary) creating this graphic tree tool, which is based on npm package [`storm-react-diagrams`](https://www.npmjs.com/package/storm-react-diagrams).  
The tool intelligently generates a nicely formatted tree structure based on a graph structure (that a team mate wrote a library for to provide a layer of abstraction) of questions, answers and the connections between them. It also detects causation loops in the graph and displays the critical connections in red.  
And thanks to STORM React Diagrams being very well thought out and also very customisable, the way that questions are added/deleted and the way that connections from an answer to a new question are added feels very intuitive, as you can see in the demo below!

The project went surprisingly well (though not without its particularities), and the people at Appjection have taken our work, improved it even further and are using the result of our efforts to this day!