const express = require('express');
const router = express.Router();
const axios = require('axios');

// Model and util imports
const Incidents = require('./incidentsModel');
const { post } = require('../dsService/dsRouter');
const { validateIncidents } = require('./middleware/index');

// ###Incidents Routes###
router.get('/showallincidents', async (req, res) => {
  try {
    const incidents = await Incidents.getAllIncidents();
    const sources = await Incidents.getAllSources();
    const tofTypes = await Incidents.getAllTags();
    const typeLinks = await Incidents.getAllTagTypes();

    const responseArray = [];
    const tagsArray = [];

    tofTypes.forEach((tof) => {
      typeLinks.forEach((connection) => {
        if (connection.type_of_force_id === tof.type_of_force_id) {
          tagsArray.push({ ...tof, incident_id: connection.incident_id });
        }
      });
    });

    incidents.forEach((incident) => {
      incident['categories'] = [];
      tagsArray.forEach((tag) => {
        if (tag.incident_id === incident.incident_id) {
          incident.categories.push(tag.type_of_force);
        }
      });
    });

    // Reconstructs the incident object with it's sources to send to front end
    incidents.forEach((incident) => {
      incident['src'] = [];
      sources.forEach((source) => {
        if (source.incident_id === incident.incident_id) {
          incident.src.push(source);
        }
      });

      responseArray.push(incident);
    });
    res.json(responseArray);
  } catch (e) {
    res.status(500).json({ message: 'Request Error' });
  }
});

router.get('/incident/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const incidentQuery = await Incidents.getIncidentById(id);
    
    const incident = incidentQuery[0];
    const src = incidentQuery[1];
    const tagLinks = incidentQuery[2];
    incident['src'] = src;
    
    const tagItems = await Incidents.createCategories(tagLinks);
    
    const categories = [];
    
    await tagItems.forEach(async (tag) => {
      await categories.push(tag.type_of_force)
    });
    
    res.status(200).json({...incident, categories: categories });
  } catch (e) {
    res.status(500).json(e);
  }
})

router.post('/createincidents',(req, res) => {
  req.body.forEach((incident) => {
    Incidents.createIncident(incident)

      .then((post) => {
        console.log("Added")
        res.status(201).json(post);
      })
      .catch((err) => {
        res.status(500).json({ message: 'Error creating Record' });
      });
  });
});

// ###Sources Routes###
router.get('/sources', (req, res) => {
  Incidents.getAllSources()
    .then((response) => {
      res.status(201).json(response);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// returns all sources associated with incident ID provided
router.get('/sources/:id', (req, res) => {
  const { id } = req.params;
  Incidents.getSourcesById(id).then((response) => {
    res.json(response);
  });
});

router.post('/createsource', (req, res) => {
  Incidents.createSingleSource(req.body)
    .then((response) => {
      res.json(response);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

// ###Types of Force (tags) Routes###
router.get('/tags', (req, res) => {
  Incidents.getAllTags()
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

router.get('/tagtypes', (req, res) => {
  Incidents.getAllTagTypes()
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// ###Utility Routes###
router.delete('/cleardb', (req, res) => {
  Incidents.deleteDB()
    .then((response) => {
      res.json({ message: 'All database contents have been deleted' });
    })
    .catch((error) => {
      res.json(error);
    });
});

router.post('/fetchfromds', (req, res) => {
  axios
    .get(process.env.DS_API_URL)
    .then((response) => {
      response.data.forEach((element) => {
        Incidents.createIncident(element);
      });
      res.json({ message: 'complete' });
    })
    .catch((err) => {
      res.json(error);
    });
});

module.exports = router;
