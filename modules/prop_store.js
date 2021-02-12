const Company = require('./company')

class PropStore {
  storeMap = new Map();
  addCompany(id, name, parentId) {
    let parent = this.storeMap.get(parentId);

    if (parent == null && (parentId !== null && parentId.trim() !== '')) {
      this.storeMap.set(parentId, new Company(parentId));
    } 

    let childCompany = this.storeMap.get(id);
    if (childCompany == null) {
      childCompany = new Company(id, parent, name); 
      this.storeMap.set(id, childCompany)
    } else {
      childCompany.setName(name);
      childCompany.setParent(parent);
    }
    if (parentId !== null && parentId.trim() !== '' ) {
        this.storeMap.get(parentId).addChildCompany(childCompany)
    }
    return childCompany;
  }

  getCompany(id) {
    return this.storeMap.get(id);
  }

  addParcelForCompany(companyId) {
    let company = this.storeMap.get(companyId);
    if (company != null) 
      company.addParcel(1);
  }

  printAll() {
    this.storeMap.forEach((entry, key)=> console.log(key, entry.toString()));
  }

  getCompanyDetailsFormRoot(companyId) { 
    let expansionPath = [];
    let company = this.storeMap.get(companyId);
    if (company == null) return '| - null';
    // expansionPath.unshift(company)
    while(company.parent) {
      expansionPath.unshift(company.parent)
      company = company.parent;
    }
    function print(index, path, node) {
      let returnString = ('| '.repeat(index) + '- ' + node.toString() + '\n')
      if (path[index] === node) {
        for (let child of node.children) {
          returnString += print(index+1, path, child)
        }
      } 
      return returnString;
    }
    return print (0, expansionPath, expansionPath[0]);
  }
}

module.exports = PropStore;