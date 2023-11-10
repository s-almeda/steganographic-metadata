Instructions for locally running the server: 

### 1. [Clone this repo](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository) to your computer.
Once you've got it, [navigate to the directory](https://www.macworld.com/article/221277/command-line-navigating-files-folders-mac-terminal.html)
(ex: ``$ cd starter-code``)
### 2. [Make sure you have Node and npm installed.](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) 

Check to see if you can run  ``$ node -v`` and ``$ npm -v`` (My versions are v16.15.0 for node and 8.10.0 for npm.)
### 3. Install the Express module using npm. 
ex: ``$ npm install express``
### 4. Install the qrcode library using pip. 
ex: ``$ pip install qrcode``
### 5. Run the example app using Node:
ex: ``$ node App.js``

You should see the message ``Server is running on http://localhost:8000``

If you instead see an error message like ``Error: Cannot find module 'express'`` -- see step 3. 
### 6. View your website
Open a web browser (e.g. Google Chrome) to this URL: ``http://localhost:8000/``


Edit the **HTML files** and the **CSS stylesheet** to edit the clientside website itself

Edit **App.js** to edit the serverside code, e.g. if you want to add new pages, change how pages route to one another, if you've renamed your HTML files, etc. 
```
starter-code
│   README.md
│   App.js    		// main JavaScript file
│
└───public 		// this where all of our content is stored
   │   index.html       // The initial view for our webpage
   │   a.html 		
   │   b.html 		// these are other pages our website links to
   │   c.html
   │
   └───css
   │  	│   styles.css    // our CSS stylesheet!
   │   
   └───images	         //images used by our website are stored here
   	│   bunny.jpg 	
   	└───...
```

