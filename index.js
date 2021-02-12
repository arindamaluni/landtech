const PropStore = require('./modules/prop_store')

const propStore = new PropStore();
const fs = require("fs");

fs.readFileSync("./data/company_relations.csv", "utf8")
  .split("\n")
  .slice(1) // header row
  .forEach((line) => {
    const [id, name, parentId] = line.split(",");
    propStore.addCompany(id, name, parentId);
  });

fs.readFileSync("./data/land_ownership.csv", "utf8")
  .split("\n")
  .slice(1) // header row
  .forEach((line) => {
    const [landId, companyId] = line.split(",");
    propStore.addParcelForCompany(companyId)
  }); 

// propStore.printAll();
console.log(propStore.traceFormRoot('CR866406850481'))
console.log(propStore.expandTree('C949357294459'))

