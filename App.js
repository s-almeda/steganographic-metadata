/*
steganographic metadata site 
*/

//Node modules to *require*
//if these cause errors, be sure you've installed them, ex: 'npm install express'
const express = require('express');
const fileUpload = require('express-fileupload');
const { exec } = require('child_process');
const pythonScriptPath = 'path/to/python_script.py';    
const router = express.Router();
const app = express();
const path = require('path');
const { Client } = require("@notionhq/client")



const client = new Client({
    auth: "secret_L3sgvYtiLhQPlbT6LYuCmC8xLigzRi6JiOborAxNgPC"
});

//specify that we want to run our website on 'http://localhost:8000/'
const host = 'localhost';
const port = 8000;

var publicPath = path.join(__dirname, 'public'); //get the path to use our "public" folder where we stored our html, css, images, etc
app.use(express.static(publicPath));  //tell express to use that folder
app.use(fileUpload());


//here's where we specify what to send to users that connect to our web server...
//if there's no url extension, it will show "index.html"
router.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "/"));
});


//This runs the QRCode Python Script (currently called python_script)
app.post('/run-python', (req, res) => {
    const pythonScriptPath = 'python_script.py';
    const userInputedData = req.body.userInputedData;

    exec(`python ${pythonScriptPath} ${userInputedData}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            res.status(500).send(`Error: ${error.message}`);
        } else {
            console.log(`Python script output: ${stdout}`);
            res.send(stdout);
        }
    });
});

app.post('/notion/ping', async (req, res) => {

    const resp = await client.users.list({});

    res.send(resp);
});

app.post('/notion/createDB', async (req, res) => {

    try {
        const resp = await client.databases.create({
            parent: {
                type: "page_id",
                "page_id": "942ee638392a4ce0b6982848b7a8f678"
            },
            title: [
                {
                    type: "text",
                    text: {
                        content: "image_metadata"
                    }
                }
            ],
            properties: {
                uuid8: {
                    type: "text",
                    title: {}
                },
                uploader: {
                    type: "text"
                },
                attr_url: {
                    type: "text"
                },
                attr_alias: {
                    type: "text"
                },
                attr_date: {
                    type: "date"
                },
            }
        });
        res.send(resp);
    } catch (err) {
        res.err("Error :(");
    }

})


//This will save the image in the upload folder:
app.post('/upload', (req, res) => {
    const { image } = req.files;

    // If no image submitted, exit
    if (!image) return res.sendStatus(400);

    // Move the uploaded image to our upload folder
    image.mv(__dirname + '/public/upload/' + image.name);

    res.sendStatus(200);
});

//run this server by entering "node App.js" using your command line. 
   app.listen(port, () => {
     console.log(`Server is running on http://${host}:${port}`);
   });



