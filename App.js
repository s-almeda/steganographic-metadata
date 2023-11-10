/*
steganographic metadata site 
*/

//Node modules to *require*
//if these cause errors, be sure you've installed them, ex: 'npm install express'
const express = require('express');
//const fileUpload = require('express-fileupload');
const { exec } = require('child_process');
const pythonScriptPath = 'path/to/python_script.py';    
const router = express.Router();
const app = express();
app.use(express.json());
const path = require('path');
const request = require('request'); //allows us to make requests to Flask server
const multer = require('multer'); //handles file uploads and storage
const axios = require('axios');

//specify that we want to run our website on 'http://localhost:8000/'
const host = 'localhost';
const port = 8000;

const storage = multer.memoryStorage();
const upload = multer({
    limits: {
        fileSize: 16000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload a valid image file'))
        }
        cb(undefined, true)
    }
})

const apiEndpoint = 'http://127.0.0.1:8001/process'; // Replace with your actual API endpoint

var publicPath = path.join(__dirname, 'public'); //get the path to use our "public" folder where we stored our html, css, images, etc

app.use(express.static(publicPath));  //tell express to use that folder



//here's where we specify what to send to users that connect to our web server...
//if there's no url extension, it will show "index.html"
router.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "/"));
});

app.get('/qrcode', function (req, res) {
    res.sendFile(publicPath + '/qrcode.html');
});

app.get('/rosteals', function (req, res) {
    res.sendFile(publicPath + '/rosteals.html');
});

function generateImageID(){
    //TODO: placeholder! replace with actual ID generation (ie. the next unused id in the database) later!! 
    return 1234; 
}


//This will save the image in the upload folder, and send it to the flask server:
app.post('/image', upload.single('image'), async (req, res) => {
    try {
    const image = req.file.buffer.toString('base64')
    const imageId = generateImageId();
    const fileName = "cover"+req.file.originalname.split('.')[1];

    console.log("sending to API endpoint...");
    // Create FormData for sending the image to Flask API endpoint
    const formData = new FormData();
    formData.append('image', image, { filename: fileName, contentType: 'image/*' });
    formData.append('id', imageId);


    res.status(201).send('Image uploaded succesfully')
    } catch (error) {
    console.log(error)
    res.status(400).send(error)
    }
    })

/*
app.post('/upload', (req, res) => {
    // Get the file that was set to our field named "image"
    const { image } = req.files;

    // If no image submitted, exit
    if (!image) return res.sendStatus(400);

    // If does not have image mime type prevent from uploading
    if (/^image/.test(image.mimetype)) return res.sendStatus(400);

    // Move the uploaded image to our upload folder
    image.mv(__dirname + '/upload/' + image.name);

    // All good
    res.sendStatus(200);
});
/*
app.post('/upload', async (req, res) => {

    try {
        console.log("server received submission!");
        console.log(req.files);
        const { image } = req.files;
        if (!image) return res.sendStatus(400);

    
        // If does not have image mime type prevent from uploading
        if (/^image/.test(image.mimetype)) return res.sendStatus(400);

        // Save the image to the public/upload folder
        image.mv(__dirname + 'public/upload/' + image.name);





        // Send the image to the Flask API endpoint using Axios
        const response = await axios.post(apiUrl, formData, {
            headers: {
                ...formData.getHeaders(),
            },
        });// Respond with success message (you may customize this based on your needs)
        res.send('Image uploaded successfully to Flask API. User ID: ' + userId + ', Filename: ' + fileName);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send('Internal Server Error');
    }
    
});
*/
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


//run this server by entering "node App.js" using your command line. 
   app.listen(port, () => {
     console.log(`Server is running on http://${host}:${port}`);
   });



