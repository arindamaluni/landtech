const Company = require('./company')
describe('Company module test suit', () => {
  let parent = null;
  let parcelCount = 0;
  
  beforeEach(() => {
    parcelCount = 0;
    parent =  new Company('parent', null, 'Parent Company', 1)
    for (let i=0; i<5; i++) {
      parent.addChildCompany(new Company(i, parent, `Child Company:${i}`, i))
      parcelCount+=i;
    }
  });

  it('Should be able to calculate the owned parcels', () => {
    expect(parent.getParcelCount()).toEqual(parcelCount + 1);
  });

  it('Should be able to re-calculate the owned parcels after addition of a child company', () => {
    parent.getChildren()[0].addChildCompany(new Company('Subchild', null, 'Subchild:1', 5))
    expect(parent.getParcelCount()).toEqual(parcelCount + 1 + 5);
  });

  it('Should be able to re-calculate the owned parcels after addition of parcel to a child company', () => {
    //TBD: Won't work in current impl
  });
});