![clue to drip.](cover.png)

A simple tool that allows you to smoothly import all of your data from [Clue](https://helloclue.com/) into [drip.](https://bloodyhealth.gitlab.io/index.html). <br>Supports all types of bleeding data and most tags!
<br><br> While not finished yet, the core functionality is already available at [https://fabfabretti.github.io/clue-to-drip/](https://fabfabretti.github.io/clue-to-drip/). :)
  
## Is my data saved anywhere? Is it safe?
Everything is done inside your browser, there is no server at all. I used Github's GitHub Pages feature to host the site, so it's all just a static page running a script that converts the file and lets you download it. :)

If you want to be *really* picky, GitHub Pages does store your IP address when visiting. From the doc:
> When a GitHub Pages site is visited, the visitor's IP address is logged and stored for security purposes, regardless of whether the visitor has signed into GitHub or not.

However, the file conversion is completely local. Hence, your sensitive data is not uploaded (nor saved) anywhere 👌

If you would still prefer to run the whole project locally to avoid logging your IP, I suggest opening the project in VS Code and using the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension to run the project offline.


## Conversion rules
If you want to check how I decided to convert Clue data into drip. data, and in particular how I decided to manage tags that are available in Clue but not in drip., you can check the file [conversionrules-md](conversionrules.md). 


## Upcoming
> [!NOTE]  
> While the tool is functional, testing was very limited because of the difficulty in getting my hands on Clue data. If you want to help, I'd be more than happy to get some more data to test on!
* ~A decent UI is on its way, I promise~ ✅
* Excluded cycle data
* Checks on input file
* Birth-control related tags (currently, all tags except custon tags and these ones are already supported)


## Changelog
* 2024.01.09 Fixed missing conversion for "period/very_heavy" tag.
* 2024.01.30 Fixed Clue email, and changed conversion logic so that spotting is not counted as a period.


## Credits
Both Clue and drip. are owned by their respective owners. UI design is shamelessly inspired by drip.'s official site and [flo-to-drip](https://github.com/SaraVieira/flo-to-drip).
