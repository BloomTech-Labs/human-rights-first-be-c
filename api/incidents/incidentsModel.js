const db = require('../../data/db-config');

module.exports = {
  getAllIncidents,
  getIncidentById,
  getTagById,
  createIncident,
  getAllSources,
  getAllTags,
  getAllTagTypes,
  getSourcesById,
  createSingleSource,
  deleteDB,
  createCategories,
};

async function getAllIncidents() {
  return await db('incidents');
}

async function getSourcesById(incident_id) {
  return await db('sources').where('incident_id', incident_id);
}

async function createIncident(incident) {
  const newIncident = {
    id: incident.case_id,
    city: incident.city,
    state: incident.state,
    title: incident.title,
    lat: incident.lat,
    long: incident.long,
    desc: incident.description,
    date: incident.dates,
    verbalization: incident.verbalization,
    empty_hand_soft: incident.empty_hand_soft,
    empty_hand_hard: incident.empty_hand_hard,
    less_lethal_methods: incident.less_lethal_methods,
    lethal_force: incident.lethal_force,
    uncategorized: incident.uncategorized,
  };
  const incidentID = await db('incidents').insert(newIncident, 'incident_id');
  await createSource(incident.links, incidentID[0]);
  await createTags(incident.tags, incidentID[0]);
  return { message: 'Success!' };
}

async function createTags(tags, incidentID) {
  // iterate over array of tags
  await tags.forEach(async (tag) => {
      // for each tag, create a new typeOfForce entry
      const tof = await createTypeOfForce(tag, incidentID);
  });
  return;
}

async function createSource(sources, incidentID) {
  await sources.forEach(async (sourceURL) => {
    const source = {
      incident_id: incidentID,
      src_url: sourceURL,
    };
    await db('sources').insert(source);
  });
  return;
}

async function createTypeOfForce(tof, incidentID) {
  const incomingTOF = {type_of_force: tof};
  
  // check if entry already exists
  const typeOfForce = await db('type_of_force').where('type_of_force', tof);
  
  if (typeOfForce.length < 1) {
    // if yes, return it, if no, create it and return it
    const newTof = await db('type_of_force').insert(incomingTOF, 'type_of_force_id');
    const newLink = await db('incident_type_of_force').insert({"incident_id": incidentID, "type_of_force_id": newTof[0]})
  
  
    return newLink;
      } else {
    return typeOfForce;
  }
}

function getAllSources() {
  return db('sources');
}

function getAllTags() {
  return db('type_of_force');
}

function getAllTagTypes() {
  return db('incident_type_of_force');
}

async function createSingleSource(source) {
  return await db('sources').insert(source, 'src_id');
}

async function deleteDB() {
  await db('incident_type_of_force').del();
  await db('type_of_force').del();
  await db('sources').del();
  return await db('incidents').del();
}

async function getIncidentById(id) {
  let incident = await db('incidents').where('incident_id', id);
  const sources = await getSourcesById(id);
  const typeLinks = await db('incident_type_of_force').where('incident_id', id);
  
  return [incident, sources, typeLinks];
}

async function getTagById(id) {
  const tag = await db('type_of_force').where('type_of_force_id', id);

  return tag[0];
}

function createCategories(array) {
  return Promise.all(array.map((link) => getTagById(link.type_of_force_id)))
  .then(response => {
    return response
  })
  .catch(error => error)
}