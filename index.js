const express = require("express");
require('dotenv').config();
const path = require('path')
const bodyParser = require('body-parser');
var cors = require('cors');
const { addContact, getContact, deleteContact, changeContactStatus } = require("./Controller/Contact");
const { addDonation, getDonation, deleteDonation, updateDonation } = require("./Controller/Donation");
const { addAdminUser, getAdminUser, deleteAdminUser, changeAdminUser, setAdminPassword, adminSignIn, resetPassword, checkAdminSessionMiddleware } = require("./Controller/AdminUser");
const { getMetaDetails, updateMetaStatus, addNewMeta, getAllMeta, deleteMeta } = require("./Controller/Meta");
const { addNewProgram, getPrograms, editProgram, deleteProgram, changeProgramImage } = require("./Controller/Programs");
const { getVideos, addNewVideo, deleteVideo, videoProgramMapping, getVideoByProgramId } = require("./Controller/youtube");
const app = express();
require('./Database/db');
 
let PORT = process.env.PORT || 5000;
 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({ exposedHeaders: 'X-Session-Token' }));

app.use('/static', express.static(path.join(__dirname, 'public')));
app.use('/admin', checkAdminSessionMiddleware);
 
app.post("/contact", addContact);
app.get("/contact", getContact);
app.get('/donation', getDonation);
app.get("/page-meta", getMetaDetails);
app.get("/programs", getPrograms);
app.get("/youtube-videos", getVideos);
app.get("/program-videos", getVideoByProgramId);


app.delete("/admin/contact", deleteContact);
app.patch("/admin/contact", changeContactStatus);
app.post('/admin/donation', addDonation);
app.delete('/admin/donation', deleteDonation);
app.patch('/admin/donation', updateDonation);
app.post('/admin/user', addAdminUser);
app.get('/admin/user', getAdminUser);
app.delete('/admin/user', deleteAdminUser);
app.patch('/admin/user', changeAdminUser);
app.patch('/admin/set-password', setAdminPassword);
app.post('/admin/sign-in', adminSignIn);
app.post('/admin/reset-password', resetPassword);
app.patch("/admin/page-meta-status", updateMetaStatus);
app.post("/admin/page-meta", addNewMeta);
app.get("/admin/page-meta", getAllMeta);
app.delete("/admin/page-meta/:id", deleteMeta);
app.post("/admin/programs", addNewProgram);
app.put("/admin/programs", editProgram);
app.delete("/admin/programs/:id", deleteProgram);
app.patch("/admin/programs/change-image/:id", changeProgramImage);
app.post("/admin/youtube-video", addNewVideo);
app.delete("/admin/youtube-video/:id", deleteVideo);
app.post("/admin/video-program-mapping", videoProgramMapping);

 
app.listen(PORT, function (error) {
    if (error) throw error;
    console.log("Server created Successfully on PORT", PORT);
});

app.on('error', err => {
    console.log('app error', err);
});
