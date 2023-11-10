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
const fs = require('fs');
app.use(express.json());
const path = require('path');
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

/*-- define API here... --*/
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

function generateImageId(){
    //TODO: placeholder! replace with actual ID generation (ie. the next unused id in the database) later!! 
    return 1234; 
}


//This will save the image in the upload folder, and send it to the flask server:
app.post('/image', upload.single('image'), async (req, res) => {
    console.log("ugh");
    
    try {
        
        //const image = req.file.buffer.toString('base64')
        var imageId = generateImageId();
        console.log(imageId);
        // Save the file to the filesystem- TODO: change this to save to database instead! 
        const fileName = "cover"+ imageId + "." + req.file.originalname.split('.')[1];
        // TODO: this should grab and save the URL where this specific image would be found, rather than sending the local filepath.
        const filePath = path.join(publicPath, '/upload', fileName); 
        fs.writeFileSync(filePath, req.file.buffer);



        

        // Create FormData for sending to to Flask API endpoint...
        const formData = new FormData();
        formData.append('imagePath', filePath);
        formData.append('id', imageId);

        console.log("waiting for API endpoint response...");
        const response = await axios.post(apiEndpoint, formData, {
            headers: {
                'Content-Type': 'multipart/form-data', // Adjust content type as needed
            },
        });// Respond with success message (you may customize this based on your needs)
        console.log('Server received a successful response from Flask encoding server! ID: ' + imageId + ', Filename: ' + fileName);
        
        

        // Create a response object to send to client...            
        
        //TODO: we'll receive the URL to the encoded image from the Flask API
            // and then we'll send that URL to the client to show up on the webpage.
            // for now, we're just using the local file path. 
        const responseObject = {
            imageId: imageId,
            encodedImagePath: (response.data.encodedImagePath),

        };
        res.send(responseObject);
        

        } catch (error) {
        console.log(error)
        res.status(400).send(error)
        }
    })


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



