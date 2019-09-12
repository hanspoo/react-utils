const destructure = a => {
  const sinSaltoLinea = a.replace(/\n/g, "");
  const match1 = sinSaltoLinea.match(/ (\w+) = \{(.*)\}/);

  const nombreVar = match1[1];
  const contenidoEntreLlaves = match1[2];

  console.log(contenidoEntreLlaves);
  const soloCampos = contenidoEntreLlaves
    .match(/\b(\w+)\b:/g)
    .map(s => s.replace(/[^A-Z]/i, ""));
  return `const {${soloCampos.join(",")}} = ${nombreVar};`;
};

module.exports.destructure = destructure;
