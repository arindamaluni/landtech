const PropStore = require('./prop_store')

describe('Property store module test suit - Integration with Company Module', () => {
  let store = null;
  
  beforeEach(() => {
    store = new PropStore()
    store.addCompany('parent', 'Parent Company', null)
    for (let i=0; i<2; i++) {
      let child = store.addCompany('L1'+ i, `Child Company:L1${i}`, 'parent')
      store.addParcelForCompany('L1' + i);
      store.addCompany('L2'+ i, `Child Company:L2${i}`, 'L1'+ i)
    }
  });

  it('Should be possible to fetch the company and all the child companies from store', () => {
    expect(store.getCompany('parent')).not.toBeNull();
    expect(store.getCompany('parent').getChildren().length).toEqual(2);
  });

  it('Should be possible to set the parent refernce of companies correctly', () => {
    const parentCompany = store.getCompany('parent')
    expect(store.getCompany('parent').getChildren().length).toEqual(2);
    expect(store.getCompany('parent').getChildren()[0].parent).toEqual(parentCompany);
  });

  it('Should be possible to add property parcel to the companies', () => {
    const company = store.getCompany('parent');
    const previousCount = company.getOwnParcel()
    store.addParcelForCompany('parent')
    expect(company.getOwnParcel()).toEqual(previousCount + 1);
  });

  it('Should be possible to roll up parcel count after adding property parcel', () => {
    const company = store.getCompany('parent');
    const previousTotalCount = company.getParcelCount()
    store.addParcelForCompany('parent')
    expect(company.getParcelCount()).toEqual(previousTotalCount + 1);
  });

  /**
   * Expected output structure for L20
   *  - parent; Parent Company; owner of 2 land parcels
      | - L10; Child Company:L10; owner of 1 land parcel
      | | - L20; Child Company:L20; owner of 0 land parcel
      | - L11; Child Company:L11; owner of 1 land parcel
   * Expected output structure for L21
   *  - parent; Parent Company; owner of 2 land parcels
      | - L10; Child Company:L10; owner of 1 land parcel
      | - L11; Child Company:L11; owner of 1 land parcel
      | | - L21; Child Company:L21; owner of 0 land parcel
   */
  it('Should be possible to trace the root of a company given an id with child details only for companies in trace', () => {
    let trace = store.traceFormRoot('L20');
    expect(trace.trim().split('\n').length).toEqual(4)
    expect(trace.indexOf('L21')).toEqual(-1);
    expect(trace.indexOf('L20')).not.toEqual(-1);
    expect(trace.indexOf('parent')).not.toEqual(-1);
    expect(trace.indexOf('L10')).not.toEqual(-1);
    expect(trace.indexOf('L11')).not.toEqual(-1);

    trace = store.traceFormRoot('L21');
    expect(trace.trim().split('\n').length).toEqual(4)
    expect(trace.indexOf('L20')).toEqual(-1);
    expect(trace.indexOf('L21')).not.toEqual(-1);
    expect(trace.indexOf('parent')).not.toEqual(-1);
    expect(trace.indexOf('L10')).not.toEqual(-1);
    expect(trace.indexOf('L11')).not.toEqual(-1);
  });

  /**
   * Expected output structure 
  - parent; Parent Company; owner of 2 land parcels
  | - L10; Child Company:L10; owner of 1 land parcel
  | | - L20; Child Company:L20; owner of 0 land parcel
  | | | - L30; Child Company:L30; owner of 0 land parcel
  | - L11; Child Company:L11; owner of 1 land parcel
  | | - L21; Child Company:L21; owner of 0 land parcel
  | | | - L31; Child Company:L31; owner of 0 land parcel 
  */
  it('Should be possible to expand a section of the tree to all the child nodes with full hierarchy', () => {
    store.addCompany('L30', `Child Company:L30`, 'L20')
    store.addCompany('L31', `Child Company:L31`, 'L21')
    let trace = store.expandTree('parent');
    
    expect(trace.trim().split('\n').length).toEqual(7)
    
    expect(trace.indexOf('parent')).not.toEqual(-1);
    expect(trace.indexOf('L10')).not.toEqual(-1);
    expect(trace.indexOf('L11')).not.toEqual(-1);    
    expect(trace.indexOf('L20')).not.toEqual(-1);
    expect(trace.indexOf('L21')).not.toEqual(-1);
    expect(trace.indexOf('L30')).not.toEqual(-1);
    expect(trace.indexOf('L31')).not.toEqual(-1); 
  
  });

});