const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const multer = require('multer');

const path = require('path');
const cookieParser = require('cookie-parser');
const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');
const postRoute = require('./routes/post');
const commentRoute = require('./routes/comments');

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};

app.use(cors(corsOptions));

const ConnectDB = async() => {
  try {
    await mongoose.connect(process.env.MONGO_URL)
    console.log('Database connection estabilished');
  }
  catch(err){
    console.log(err);
  }
}

//MIDDLEWARE
dotenv.config()
app.use(express.json())

app.use('/images', express.static(path.join(__dirname, "/images")))
console.log(cors())

app.use(cookieParser())
app.use("/api/auth",authRoute)
app.use("/api/users",userRoute)
app.use("/api/posts",postRoute)
app.use("/api/comments",commentRoute)

//Upload Image
const storage = multer.diskStorage({
  destination: (req, file, fn) => {
    fn(null, 'images');
  },
  filename: (req, file, fn) => {
    fn(null, req.body.img);
  }
}) // This is to get the image, now we'll see how to upload the image

const upload = multer({storage: storage})
app.post('/api/upload', upload.single("file"), (req,res) => {
  res.status(200).json("Image uploaded successfully")
})

app.listen(process.env.PORT, () => {
  ConnectDB();
  console.log("App is listening on port "+ process.env.PORT);
})