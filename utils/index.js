const now = () => {
  return new Date().toISOString();
};

const generateVoterId = () => {
  const data = "45qwga76";
  console.log(data);
  return data;
};

generateVoterId();

module.exports = {
  now,
  generateVoterId,
};
