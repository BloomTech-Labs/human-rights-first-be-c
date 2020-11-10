const express = require('express');
const router = express.Router();
const axios = require('axios');

// Model and util imports
const Incidents = require('./incidentsModel');
const { post } = require('../dsService/dsRouter');
const { validateIncidents } = require('./middleware/index');

// ''' ---------> Incidents Routes <--------- '''
// ### GET /showallincidents ###
// - returns all incidents in the BE database
// ⬇️ swagger docs code generation ⬇️
/**
 * @swagger
 * /incidents/showallincidents:
 *  get:
 *    summary: path returning all incidents in database
 *    tags:
 *      - incidents
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        description: success ... returns an incident object with all sources
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - api
 *              properties:
 *                data:
 *                  type: array
 *                  example: [
  {
    "id": 1,
    "dates": "2020-05-26 00:00:00",
    "added_on": "2020-11-09 10:27:02.184009",
    "links": "['https://www.facebook.com/1462345700/posts/10220863688809651', 'https://www.facebook.com/1462345700/posts/10220863812572745']",
    "case_id": "mn-minneapolis-14",
    "city": "Minneapolis",
    "state": "Minnesota",
    "lat": 44.94811,
    "long": -93.2369906,
    "title": "Police shoot flashbang grenades into crowd",
    "description": "Police on the rooftop of the 3rd precinct fire flashbang grenades into crowd of peaceful protesters.",
    "tags": "['less-lethal', 'rubber-bullet', 'stun-grenade', 'tear-gas']",
    "verbalization": 0,
    "empty_hand_soft": 0,
    "empty_hand_hard": 0,
    "less_lethal_methods": 1,
    "lethal_force": 0,
    "uncategorized": 0
  },
  {
    "id": 2,
    "dates": "2020-05-26 00:00:00",
    "added_on": "2020-11-09 10:27:02.369103",
    "links": "['https://www.facebook.com/damicedsota.thespiritflow/videos/10216865788705633/UzpfSTEwMDAxMTAzODkyNjEwMzpWSzoyNjczNDU4ODUyOTMzODE2/']",
    "case_id": "mn-minneapolis-28",
    "city": "Minneapolis",
    "state": "Minnesota",
    "lat": 44.9413248,
    "long": -93.2626097,
    "title": "Man has his gun confiscated in an open carry state, violating his 2nd amendment rights",
    "description": "Man encounters police arresting people open carrying (~3 minutes in), man is then also put in handcuffs (~5 minutes in) and his gun taken.",
    "tags": "['abuse-of-power', 'arrest']",
    "verbalization": 0,
    "empty_hand_soft": 0,
    "empty_hand_hard": 0,
    "less_lethal_methods": 0,
    "lethal_force": 0,
    "uncategorized": 1
  },
]
 *      500:
 *        description: Server response error
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                -api
 *              properties:
 *                message:
 *                  type: string
 *                  example: "Request Error"
 */
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
// ### GET /incident/{id} ###
// - returns a singular incident per {id} passed in
// ⬇️ swagger docs code generation ⬇️
/**
 * @swagger
 * /incidents/incident/{id}:
 *  get:
 *    summary: path returning single incident associated with ID provided
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: integer
 *        required: true
 *        description: Numeric ID of the incident to get data for
 *    tags:
 *      - incidents
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        description: success ... returns an incident object
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - api
 *              properties:
 *                data:
 *                  type: array
 *                  example: [
  {
    "id": 1,
    "dates": "2020-05-26 00:00:00",
    "added_on": "2020-11-09 10:27:02.184009",
    "links": "['https://www.facebook.com/1462345700/posts/10220863688809651', 'https://www.facebook.com/1462345700/posts/10220863812572745']",
    "case_id": "mn-minneapolis-14",
    "city": "Minneapolis",
    "state": "Minnesota",
    "lat": 44.94811,
    "long": -93.2369906,
    "title": "Police shoot flashbang grenades into crowd",
    "description": "Police on the rooftop of the 3rd precinct fire flashbang grenades into crowd of peaceful protesters.",
    "tags": "['less-lethal', 'rubber-bullet', 'stun-grenade', 'tear-gas']",
    "verbalization": 0,
    "empty_hand_soft": 0,
    "empty_hand_hard": 0,
    "less_lethal_methods": 1,
    "lethal_force": 0,
    "uncategorized": 0
  }
]
 *      500:
 *        description: Server response error
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                -api
 *              properties:
 *                message:
 *                  type: string
 *                  example: "Request Error"
 */
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
      await categories.push(tag.type_of_force);
    });

    res.status(200).json({ ...incident, categories: categories });
  } catch (e) {
    res.status(500).json(e);
  }
});

// ### POST /createincidents ###
// - returns success / error response message from BE
// ⬇️ swagger docs code generation ⬇️
// NOT COMPLETE <--> TODO: @NIC
/**
 * @swagger
 * /incidents/createincidents:
 *  post:
 *    summary: SHOULDN"T BE USED (NIC) ... path to add an incident to the the database
 *    tags:
 *      - incidents
 *    produces:
 *      - application/json
 *    responses:
 *      201:
 *        description: Server response success
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - api
 *              properties:
 *                 message:
 *                    type: string
 *                    example: "Success"
 *      500:
 *        description: Server response error
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                -api
 *              properties:
 *                message:
 *                  type: string
 *                  example: "Request Error"
 */

router.post('/createincidents', (req, res) => {
  req.body.forEach((incident) => {
    Incidents.createIncident(incident)

      .then((post) => {
        console.log('Added');
        res.status(201).json(post);
      })
      .catch((err) => {
        res.status(500).json({ message: 'Error creating Record' });
      });
  });
});

// ''' ---------> Sources Routes <--------- '''
// ### GET /sources ###
// - returns all incident source data
// ⬇️ swagger docs code generation ⬇️
/**
 * @swagger
 * /incidents/sources:
 *  get:
 *    summary: path returning all sources in database
 *    tags:
 *      - incidents
 *    produces:
 *      - application/json
 *    responses:
 *      201:
 *        description: success ... returns object containing all source data
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - api
 *              properties:
 *                data:
 *                  type: array
 *                  example: [
 *                            {
 *                              "src_id": 1,
 *                              "incident_id": 1,
 *                              "src_url": "twitter.com",
 *                              "src_type": "level 2"
 *                            },
 *                            {
 *                              "src_id": 2,
 *                              "incident_id": 1,
 *                              "src_url": "facebook.com",
 *                              "src_type": "level 2"
 *                            },
 *                          ]
 *      500:
 *        description: Server response error
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                -api
 *              properties:
 *                message:
 *                  type: string
 *                  example: "Request Error"
 */

router.get('/sources', (req, res) => {
  Incidents.getAllSources()
    .then((response) => {
      res.status(201).json(response);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// ### GET sources/{id} ###
// - returns all sources associated with incident ID provided
// ⬇️ swagger docs code generation ⬇️
/**
 * @swagger
 * /incidents/sources/{id}:
 *  get:
 *    summary: path returning all sources associated with incident ID provided
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: integer
 *        required: true
 *        description: Numeric ID of the incident to get all sources for
 *    tags:
 *      - incidents
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        description: success ... returns object containing all source data
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - api
 *              properties:
 *                data:
 *                  type: array
 *                  example: [
 *                            {
 *                              "src_id": 1,
 *                              "incident_id": 1,
 *                              "src_url": "twitter.com",
 *                              "src_type": "level 2"
 *                            },
 *                            {
 *                              "src_id": 2,
 *                              "incident_id": 1,
 *                              "src_url": "facebook.com",
 *                              "src_type": "level 2"
 *                            },
 *                          ]
 *      500:
 *        description: Server response error
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                -api
 *              properties:
 *                message:
 *                  type: string
 *                  example: "Request Error"
 */
router.get('/sources/:id', (req, res) => {
  const { id } = req.params;
  Incidents.getSourcesById(id).then((response) => {
    res.json(response);
  });
});
// creates a single source by inserting into the database
router.post('/createsource', (req, res) => {
  Incidents.createSingleSource(req.body)
    .then((response) => {
      res.json(response);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

// ---------> Types of Force (tags) Routes <---------

// ### GET /tags ###
// - returns all all possible tags for incident type of force
// ⬇️ swagger docs code generation ⬇️
/**
 * @swagger
 * /incidents/tags:
 *  get:
 *    summary: path returning all types-of-force tags for each incident
 *    tags:
 *      - incidents
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        description: success ... returns array containing types-of-force tags for each incident
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - api
 *              properties:
 *                data:
 *                  type: array
 *                  example: []
 *      500:
 *        description: Server response error
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                -api
 *              properties:
 *                message:
 *                  type: string
 *                  example: "Request Error"
 */
router.get('/tags', (req, res) => {
  Incidents.getAllTags()
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});
// ### GET /tagtypes ###
// - returns all all possible types-of-force tags (categories)
// ⬇️ swagger docs code generation ⬇️
/**
 * @swagger
 * /incidents/tagtypes:
 *  get:
 *    summary: path returning all types-of-force tags
 *    tags:
 *      - incidents
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        description: success ... returns array containing all types-of-force tags
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - api
 *              properties:
 *                data:
 *                  type: array
 *                  example: []
 *      500:
 *        description: Server response error
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                -api
 *              properties:
 *                message:
 *                  type: string
 *                  example: "Request Error"
 */
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
