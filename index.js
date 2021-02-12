const PropStore = require('./prop_store')

const propStore = new PropStore();
const fs = require("fs");

fs.readFileSync("./company_relations.csv", "utf8")
  .split("\n")
  .slice(1) // header row
  .forEach((line) => {
    const [id, name, parentId] = line.split(",");
    propStore.addCompany(id, name, parentId);
  });

fs.readFileSync("./land_ownership.csv", "utf8")
  .split("\n")
  .slice(1) // header row
  .forEach((line) => {
    const [landId, companyId] = line.split(",");
    propStore.addParcelForCompany(companyId)
  }); 

propStore.printAll();
propStore.fromRoot('C949357294459')

