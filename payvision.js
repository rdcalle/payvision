'use strict';

// Libraries declaration to be used
const { ordersWithDuplicated, parseDir, parseEmail } = require('./utilities');
const fs = require('fs');
const argv = require('yargs')
  .usage('Usage: $0 --file [file]')
  .demand(['file'])
  .showHelpOnFail(true)
  .argv;

// Reading the file into array structure
const [numTransactions, ...transactions] = fs.readFileSync(argv.file, 'utf-8')
  .replace(/\r/g,'')  // To get the break line return code of the window's files off
  .split('\n');

// Parsing transactions to get every field.
// Besides, we gonna build an object of grouped deal IDs to get a very fast check by deal
const transactionsByDeal = transactions.reduce((transByDeal, transaction) => {
  const
    [order, deal, email, street, city, state, zip, card] = transaction.split(','),
    fields = {
      order,
      email: parseEmail(email),
      dir: parseDir(street, city, state, zip),
      card
    };

  if (deal) {
    transByDeal[deal] = transByDeal[deal]
    ?
      {
        ...transByDeal[deal],
        ops: [...transByDeal[deal].ops, fields],
        email: {
          ...transByDeal[deal].email,
          [fields.email]: transByDeal[deal].email[fields.email]
            ? transByDeal[deal].email[fields.email] === card ? card : false
            : card
        },
        dir: {
          ...transByDeal[deal].dir,
          [fields.dir]: transByDeal[deal].dir[fields.dir]
            ? transByDeal[deal].dir[fields.dir] === card ? card : false
            : card
        }
      }
    :
      {
        ops: [fields],
        email: {
          [fields.email]: card
        },
        dir: {
          [fields.dir]: card
        }
      };
  }
  return transByDeal;
}, {});

// console.log(JSON.stringify(transactionsByDeal, null, 2));
console.log(Array.from(new Set([
  ...ordersWithDuplicated(transactionsByDeal, 'email'),
  ...ordersWithDuplicated(transactionsByDeal, 'dir')
])).sort().join());
