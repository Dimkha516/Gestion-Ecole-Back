const generateMatricule = (prenom, nom) => {
  const prenomInitial = prenom.charAt(0).toUpperCase();
  const nomInitial = nom.charAt(0).toUpperCase();
  const shiftedPrenom = prenomInitial.charCodeAt(0) + 3;
  const shiftedNom = nomInitial.charCodeAt(0) + 3;
  const matricule = `ETU${String.fromCharCode(
    shiftedPrenom
  )}${String.fromCharCode(shiftedNom)}${Math.floor(Math.random() * 1000)
    .toString()
    .padStart(2, "0")}`;
  return matricule;
};

module.exports = generateMatricule;