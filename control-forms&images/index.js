require("dotenv").config();
const express = require("express");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;
const app = express();

const { CLOUDINARY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, PORT } = process.env
cloudinary.config({
    cloud_name: CLOUDINARY_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
});

app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
    })
);

app.get("/myget", (req, res) => {
    res.send(req.body);
});

app.post("/mypost", async (req, res) => {
    let result;
    let imageArray = [];
    let file = req.files.samplefile;
    if (req.files.samplefile.length === undefined) {
        result = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "users",
        });
        console.log(result);
        res.send(result);
    } else if (req.files) {
        for (let index = 0; index < req.files.samplefile.length; index++) {
        result = await cloudinary.uploader.upload(
            req.files.samplefile[index].tempFilePath,
            {
                folder: "users",
            }
        );
        imageArray.push({
            public_id: result.public_id,
            secure_url: result.secure_url,
        });
        }
        details = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            result,
            imageArray,
        };
        console.log(details);
        res.send(details);
    }
});

app.get("/", (req, res) => {
    res.render("home");
});
app.get("/mygetform", (req, res) => {
    res.render("getform");
});
app.get("/mypostform", (req, res) => {
    res.render("postform");
});

app.listen(PORT, () => console.log(`Server is runnning at port ${PORT}`));