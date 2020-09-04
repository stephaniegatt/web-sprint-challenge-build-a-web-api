const express = require('express');

const Actions = require('./data/helpers/actionModel');

const router = express.Router();

router.get('/', (req, res) => {
    Actions.get().then(actions => {
        res.status(200).json(actions)
    }).catch(err => res.status(500).json({  error: "Actions not found" }))
});

router.get('/:id', validateActionId, (req, res) => {
    const id = Number(req.params.id);
    Actions.get(id).then(action => {
        if (action) {
            res.status(200).json(action)
        } else {
            res.status(404).json({ message: "Action with ID was not found" })
        }
    }).catch(err => res.status(500).json({  error: "Not found" }))
});

  
router.post('/', validateBody, (req, res) => {
    const action = req.body;
    Actions.insert(action).then(action => {
        res.status(201).json(action);
    }).catch(err => {
        res.status(500).json({ message: "Unable to create" });
    });
});
  
  router.delete('/:id', validateActionId, (req, res) => {
    const id = Number(req.params.id)
    Actions.remove(id).then(action => {
        res.status(200).json(action);
    }).catch(err => res.status(500).json({  error: "Delete error" }));
  });
  
  router.put('/:id', validateActionId, validateAction, (req, res) => {
    const id = Number(req.params.id);
    const changes = req.body;
      Actions.update(id, changes).then(updated => {
        res.status(200).json({ actions: updated })
      }).catch(err => {
        res.status(404).json({ error: "Action with ID does not exist" })
      })
  });

  function validateActionId(req, res, next) {
    Actions.get(Number(req.params.id))
        .then(action => {
            if (action) {
                req.action = action
                next();
            } else {
                res.status(404).json({ message: "Action id not found" });
            }
        })
        .catch(error => {
            res.status(500).json({ message: error.message });
        });
  }

  function validateBody(req, res, next) {
    if (body) {
        next();
    } else {
      res.status(400).json({ message: "missing body" });
    } 
  }

  function validateAction(req, res, next) {
    validateBody(req, res, () => {
        const body = req.body
        if (body.project_id && body.description && body.notes) {
            next();
        } else {
            res.status(400).json({ message: "Must have project_id, description, and notes" });
        }
    })
  }

module.exports = router;