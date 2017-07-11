const ABBREVS = {
  DIRS: {
    'road': 'rd.',
    'street': 'st.'
  },
  STATES: {
    'illinois': 'il',
    'california': 'ca',
    'new york': 'ny'
  }
}

// It checks if a word can be shorted and return the string either shorted or not
const checkAbbrevs = (text, type) => {
  let textToCheck = text;
  Object.keys(ABBREVS[type]).forEach(abbr => {
    textToCheck = textToCheck.replace(RegExp(abbr, 'g'), ABBREVS[type][abbr]);
  });
  return textToCheck;
}

// Returns an array of orders with duplicated email
const ordersWithDuplicated = (transactionsByDeal, field) => {
  return Object.keys(transactionsByDeal).reduce((orders, dealId) => {
    const deal = transactionsByDeal[dealId];
    deal.ops.forEach(({order, card, ...fields}) => {
      if (!deal[field][fields[field]]) {
        orders.push(order);
      }
    })
    return orders;
  }, [])
}

// It parses the dir to lowercase, joining all fields and translating abrevs
const parseDir = (street='', city='', state='', zip='') => {
  let
    str = checkAbbrevs(street.toLowerCase(), 'DIRS'),
    st  = checkAbbrevs(state.toLowerCase(), 'STATES');

  return `${str}, ${city}, ${st}, ${zip}`;
}

// It parses an email to lowercase and drops every dot and + with its after chars
const parseEmail = (email='') => {
  const [user, server] = email.toLowerCase().split('@');
  const sanitizedUser = user.replace(/\+.*|\./, '');
  return `${sanitizedUser}@${server}`
}

module.exports = {
  ordersWithDuplicated,
  parseDir,
  parseEmail
}
