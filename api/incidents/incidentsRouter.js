const express = require('express');
const router = express.Router();

// Model and util imports
const Incidents = require('./incidentsModel');
const { dsFetch } = require('../dsService/dsUtil');

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

    const queryResponse = incidents.map((incident) => {
      incident.src = JSON.parse(incident.src);
      incident.categories = JSON.parse(incident.categories);
      return incident;
    });
    res.json(queryResponse);
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

    incidentQuery[0].src = JSON.parse(incidentQuery[0].src);
    incidentQuery[0].categories = JSON.parse(incidentQuery[0].categories);

    res.status(200).json(incidentQuery);
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
        res.status(201).json(post);
      })
      .catch((err) => {
        res.status(500).json({ message: 'Error creating Record' });
      });
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

router.post('/fetchfromds', async (req, res) => {
  try {
    await dsFetch();
    res.json({ message: 'Operation successful' });
  } catch (e) {
    res.json({ message: 'Error with operation', error: e });
  }
});

module.exports = router;
