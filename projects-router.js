const express = require('express');

const Projects = require('./data/helpers/projectModel');

const router = express.Router();

  
router.get('/', (req, res) => {
    Projects.get().then(projects => {
        res.status(200).json({ projects: projects })
    }).catch(err => res.status(500).json({  error: "Projects not found" }))
});

router.get('/:id', validateProjectId, (req, res) => {
    res.status(200).json(req.project);
});

router.get('/:id/actions', validateProjectId, (req, res) => {
    Projects.getProjectActions(req.project.id).then(actions => {
        res.status(200).json(actions);
    }).catch(err => res.status(500).json({  error: "Not found" }));
});
  
router.post('/', validateProject, (req, res) => {
    const project = req.body;
    Projects.insert(project).then(project => {
        res.status(201).json(project);
    }).catch(err => {
        res.status(500).json({ message: "Unable to create" });
    });
});
  
router.delete('/:id', validateProjectId, (req, res) => {
    Projects.remove(req.project.id).then(project => {
        res.status(200).json(project);
    }).catch(err => res.status(500).json({  error: "Delete error" }));
});
  
router.put('/:id', validateProjectId, validateBody, (req, res) => {
    const changes = req.body;
    Projects.update(req.project.id, changes).then(updated => {
        res.status(200).json({ project: updated })
    }).catch(err => {
        res.status(404).json({ error: "Project with ID does not exist" })
    })
});
  
//   //custom middleware
  
// anything with an id needs this mw
function validateProjectId(req, res, next) {
    Projects.get(Number(req.params.id))
        .then(project => {
            if (project) {
                req.project = project
                next();
            } else {
                res.status(404).json({ message: "Project id not found" });
            }
            })
            .catch(error => {
                res.status(500).json({ message: error.message });
            });
  };

// check if a body is present before going to next()
// post needs to check if there is a body present 
function validateBody(req, res, next) {
    if (body) {
        next();
    } else {
        res.status(400).json({ message: "missing body" });
    } 
};

// used validateBody middleware inside validateProject to erase redundancies.
// must check for body before checking for project.
// put needs name and description in body 
function validateProject(req, res, next) {
    validateBody(req, res, () => {
        const body = req.body
        if (body.name && body.description) {
            next();
        } else {
            res.status(400).json({ message: "Must have name and description" });
        }
    });
};
  
  module.exports = router;