process.argv.
forEach((value, index)=> console.log(value))

class Company {
  #totalParcels = -1;
  constructor(id, parent=null, name='') {
    this.id = id;
    this.parent = parent;
    this.name = name;
    this.children = []; 
    this.parcel=0;
  }
  setParent(_parent) { this.parent = _parent; }
  setName(_name) { this.name = _name; }
  addParcel() { this.parcel++; }
  getParcelCount() {
    if (this.#totalParcels<0) {
      let totalCount = this.parcel;

      this.children.length && 
        this.children.forEach(child => 
          totalCount+= child.getParcelCount());

      this.#totalParcels = totalCount;
    }
    return this.#totalParcels;
  }
  addChildCompany(child) {
    if (!this.children.includes(child)) {
      this.children.push(child);
    }
  }
  getChildren() {
    return this.children;
  }
  toString() {
    return `${this.id}; ${this.name}; owner of ${this.getParcelCount()} land parcel` + (this.getParcelCount()>1? 's':'');
  }
}

class PropStore {
  storeMap = new Map();
  addCompany(id, name, parentId) {
    let parent = this.storeMap.get(parentId);

    if (parent == null && parentId.trim() !== '') {
      this.storeMap.set(parentId, new Company(parentId));
    } 

    let childCompany = this.storeMap.get(id);
    if (childCompany == null) {
      childCompany = new Company(id, parent, name); 
      this.storeMap.set(id, childCompany)
    } else {parentId
      childCompany.setName(name);
      childCompany.setParent(parent);
    }
    parentId.trim() !== '' && this.storeMap.get(parentId).addChildCompany(childCompany)
  }

  addParcelForCompany(companyId) {
    let company = this.storeMap.get(companyId);
    if (company == null) {console.log('Not found:' + companyId)}
    else company.addParcel();
  }

  printAll() {
    this.storeMap.forEach((entry, key)=> console.log(key, entry.toString()));
  }

  fromRoot(companyId) { 
    let expansionPath = [];
    let company = this.storeMap.get(companyId);
    if (company == null) return '| - null';
    // expansionPath.unshift(company)
    while(company.parent) {
      expansionPath.unshift(company.parent)
      company = company.parent;
    }
    function print(index, path, node) {
      console.log('| '.repeat(index) + '- ' + node.toString())
      if (path[index] === node) {
        for (let child of node.children) {
          print(index+1, path, child)
        }
      }
    }
    print (0, expansionPath, expansionPath[0]);
  }
}

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

