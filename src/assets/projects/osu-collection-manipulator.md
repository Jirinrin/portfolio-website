# osu! collection manipulator

This was a small thingy I made because I needed it to exist.  
It is a makeshift-kindof environment I set up for myself so that I can easily manipulate my beatmap collections of the rhythm game [osu!](https://osu.ppy.sh) by writing scripts in C#.  

osu! stores all its collection data in a file called `collection.db`.  
I used [a NuGet package by HoLLy-HaCKeR](https://github.com/HoLLy-HaCKeR/osu-database-reader) to be able to parse this (it works via a stream reader) and extended it to also be able to write to the same file (surprise surprise, using a stream writer).  
For this I had to also slightly customise some of [the framework behind this reader](https://github.com/HoLLy-HaCKeR/osu.Shared), as its version on NuGet appears to have some sort of bug...

So _anyway_, this infrastructure now allows me to just type some code in Program.cs of my .NET app to read the collection file (and `osu.db`, which is also important for e.g. seeing maps that are not in a collection), work it through some logic and write it back to the file. Dotnet-compile it and you got yourself a nice and portable script situation!  
How I currently have it setup is that when I run the script, it puts new beatmaps that I haven't put in a collection yet (with exceptions) in a _..Unprocessed_ collection, and removes beatmaps from it that I gave a collection since the last time I ran it.  
This is what is shown in the gif below: giving a map a collection, running the script and seeing that indeed, it is no longer in _..Unprocessed_ and the size of _..Unprocessed_ has decreased by more than a hundred as I already went through a bunch of maps prior to the recording of the demo. (Noooo that's _not at all_ procrastination...)

In the future I also want to use it to e.g. automatically assign maps that I don't just keep around for their lower diffs on DoubleTime to a new collection... the possiblities are endless!!