const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const zip = require("express-easy-zip");

const skillManager = require("./skillManager.js");

let locale;

// enable the template engine and configure some express-js settings
app.set('views', `${__dirname}/webinterface/views`);
app.set('view engine', 'jade');

app.use(fileUpload({
    createParentPath: true
}));
app.use(zip());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));


// Main-Page, which is showing the installed and activated skills
app.get("/", (req, res) => {
    res.render('index', { data : { skills: skillManager.getSkillsOverview(locale) }});
});

// Details-Page with some information and sentences for a specific skill
app.get("/details/:skillName", (req, res) => {
    res.render('details', { data : skillManager.getSkillDetails(req.params.skillName, locale)});
});

// Download-Page with all available Skills on the Server
app.get("/download", async (req, res) => {
    skillManager.getRemoteSkills(locale)
        .then(skills => res.render('download', {data: {skills: skills}}))
        .catch(() => res.render('download', {data: {skills: [{ name: "No connection to Server!", versions: ["0"], latest: "0", installed: [] }]}}))
});

// Simple Endpoint, which is used to download the skill files
app.get("/download/:skillName/:versionTag", (req, res) => {
    skillManager.downloadSkill(req.params.skillName, req.params.versionTag).then((versionTag) => {
        skillManager.setActivateFlag(req.params.skillName, false).then(()=> {
            skillManager.setVersion(req.params.skillName, versionTag);
            skillManager.loadSkills(locale);
            res.json({
                skill: req.params.skillName,
                success: true,
                message: `Successfully downloaded ${req.params.skillName}`
            });
        });
    }).catch(err => {
        res.json({
            skill: req.params.skillName,
            success: false,
            message: err.toString()
        });
    });

});

// Simple Endpoint, which is used to deactivate a skill and delete the skill files
app.get("/delete/:skillName", (req, res) => {
    skillManager.deactivateSkill(req.params.skillName, locale).then(() => {
            skillManager.deleteLocalSkillFiles(req.params.skillName, locale).then(msg => {
                skillManager.loadSkills(locale);
                res.json({
                    skill: req.params.skillName,
                    success: true,
                    message: msg
                });
            })
        }).catch(err => {
           res.json({
               skill: req.params.skillName,
               success: false,
               message: err.toString()
           });
        });
});

// Simple Endpoint, which is used to de-/activate a skill
app.get("/setActive/:skillName/:state", (req, res) => {
    switch (req.params.state){
        case "true":
            skillManager.activateSkill(req.params.skillName, locale)
                .then(msg => {
                    res.json({
                        skill: req.params.skillName,
                        success: true,
                        message: msg
                    });
                })
                .catch(err => {
                    res.json({
                        skill: req.params.skillName,
                        success: false,
                        message: err.toString()
                    });
                });
            break;
        case "false":
            skillManager.deactivateSkill(req.params.skillName, locale)
                .then(msg => {
                    res.json({
                        skill: req.params.skillName,
                        success: true,
                        message: msg
                    });
                })
                .catch(err => {
                    res.json({
                        skill: req.params.skillName,
                        success: false,
                        message: err.toString()
                    });
                });
            break;
        default:
            res.json({
                skill: req.params.skillName,
                success: false,
                message: "Bad!"
            });
    }
});

// Endpoint to change the options on the Details-Page
app.post("/edit/:skillName", (req, res) => {
    skillManager.saveConfig(req.params.skillName, req.body, locale)
        .then(msg => {
            res.json({
                skill: req.params.skillName,
                success: true,
                message: msg
            });
        }).catch(err => {
            res.json({
                skill: req.params.skillName,
                success: false,
                message: err.toString()
            });
        });
});

// Upload-Page to install a skill manually
app.get('/upload', (req, res) => {
    res.render("upload", {data: {}});
});

// Endpoint used by the Upload-Page to extract and save the .zip file and set all required settings
app.post('/upload/:skillName/:versionTag', (req, res) => {
    skillManager.uploadSkill(req.params.skillName, req.params.versionTag, req.files.zipped.data).then(() => {
        skillManager.setActivateFlag(req.params.skillName, false).then(()=> {
            skillManager.setVersion(req.params.skillName, req.params.versionTag);
            skillManager.loadSkills(locale);

            res.json({
                skill: req.params.skillName,
                success: true,
                message: `Successfully uploaded ${req.params.skillName}`
            });
        });
    }).catch(err => {
        res.json({
            skill: req.params.skillName,
            success: false,
            message: err.toString()
        });
    });
});

// Simple function to start the webinterface
function startUI(loc = "de_DE", port = 3000){
    locale = loc;
    app.use(express.static(`${__dirname}/webinterface/public`));

    app.listen(port, () => {
        console.log(`Server listening on: http://localhost:${port}`);
    })
}

module.exports = {
    startUI
}