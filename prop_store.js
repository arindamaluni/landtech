const Company = require('./company')

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

module.exports = PropStore;