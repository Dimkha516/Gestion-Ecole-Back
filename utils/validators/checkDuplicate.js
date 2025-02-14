const checkDuplicate = async (attribute, value, model) => {
  const existingAttribute = await model.findOne({ [attribute]: value });
  if (existingAttribute) {
    throw new Error(`${attribute} "${value}" est déjà utilisé.`);
  }
};
module.exports = checkDuplicate;

const checkDuplicates = async (fields, model) => {
  const query = {};
  for (const [key, value] of Object.entries(fields)) {
    query[key] = value;
  }

  const existingEntry = await model.findOne(query);
  if (existingEntry) {
    throw new Error(`Un étudiant avec ces informations existe déjà.`);
  }
};

module.exports = checkDuplicates;
