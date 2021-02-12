
class Company {
  #totalParcels = -1;
  constructor(id, parent=null, name='', parcel=0) {
    this.id = id;
    this.parent = parent;
    this.name = name;
    this.children = []; 
    this.parcel=parcel;
  }
  setParent(_parent) { this.parent = _parent; }
  setName(_name) { this.name = _name; }
  addParcel(noOfParcel) { 
    this.parcel+=noOfParcel; 
    this.#totalParcels=-1
  }
  getOwnParcel() { return this.parcel }
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
      this.#totalParcels = -1;
    }
  }
  getChildren() {
    return this.children;
  }
  toString() {
    return `${this.id}; ${this.name}; owner of ${this.getParcelCount()} land parcel` + (this.getParcelCount()>1? 's':'');
  }
}

module.exports = Company;