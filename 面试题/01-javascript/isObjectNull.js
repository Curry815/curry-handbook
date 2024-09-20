function isEmpty(obj) {
    if (obj === null || obj === undefined) {
      return true;
    }
  
    if (typeof obj === 'object') {
      return Reflect.ownKeys(obj).length === 0;
    }    
  
    return false;
  }

  isEmpty({}); // true
  isEmpty({ a: 1 }); // false
  isEmpty(null); // true
  isEmpty(undefined); // true

  console.log(null == undefined); // true