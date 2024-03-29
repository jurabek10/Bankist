'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__value">${mov}</div>
    </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance} EUR`;
};

const calcDisplaySummary = function (acc) {
  const income = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${income}EUR`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}EUR`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest} EUR`;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Dispaly movements
  displayMovements(currentAccount.movements);
  // Display balance
  calcDisplayBalance(currentAccount);
  // Display summary
  calcDisplaySummary(currentAccount);
};

// Event handler
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Clear inputs
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add movements
    currentAccount.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }

  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputClosePin.value = inputCloseUsername.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
/*
let arr = ['a', 'b', 'c', 'd', 'e'];

// SLICE
console.log(arr.slice(2));
console.log(arr.slice(2, 4));
console.log(arr.slice(-2));
console.log(arr.slice(-1));
console.log(arr.slice(1, -3));
console.log([...arr]);

// SPLICE
console.log(arr.splice(2));
console.log(arr);

// REVERSE
arr = ['a', 'b', 'c', 'd', 'e'];
const arr2 = ['j', 'i', 'k', 'l'];
console.log(arr2.reverse());
console.log(arr2);

// CONCAT
const letters = arr.concat(arr2);
console.log(letters);

// JOIN
console.log(letters.join(' - '));

// AT
const arr3 = [23, 45, 26];
console.log(arr3.at(0));

// getting last element
console.log(arr3[arr3.length - 1]);
console.log(arr3.slice(-1)[0]);
console.log(arr3.at(-1));

console.log('Jurabek'.at(-1));
*/

// FOR-EACH
/*
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// for (const movement of movements) {
for (const [i, movement] of movements.entries()) {
  if (movement > 0) {
    console.log(`Movement ${i + 1}: You deposited ${movement}`);
  } else {
    console.log(`Movement ${i + 1}: You withdrew ${Math.abs(movement)}`);
  }
}

console.log('-----------');
movements.forEach(function (movement, i, array) {
  if (movement > 0) {
    console.log(`Movement ${i + 1}: You deposited ${movement}`);
  } else {
    console.log(`Movement ${i + 1}: You withdrew ${Math.abs(movement)}`);
  }
});

// With maps
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

currencies.forEach(function (value, key, map) {
  console.log(`${key}: ${value}`);
});

// With sets
const currenciesUnique = new Set(['USD', 'GBP', 'EUR', 'USD', 'EUR']);
console.log(currenciesUnique);
currenciesUnique.forEach(function (val, _, map) {
  console.log(`${val}: ${val}`);
});
*/

// CHALLENGE #1
/*
const dogsJulia = [3, 5, 2, 12, 7];
const dogsKate = [4, 1, 15, 8, 3];
// const juliaDogs = dogsJulia.slice(1, -2);
// console.log(juliaDogs);
// const allDogs = dogsKate.concat(juliaDogs);
// console.log(allDogs);

// const dogsJuliaCorrected = dogsJulia.slice();
// console.log(dogsJuliaCorrected);
// dogsJuliaCorrected.splice(0, 1);
// console.log(dogsJuliaCorrected);
// dogsJuliaCorrected.splice(-2);
// console.log(dogsJuliaCorrected);

const checkDogs = function (dogsJulia, dogsKate) {
  const juliaDogs = dogsJulia.slice(1, -2);
  const allDogs = dogsKate.concat(juliaDogs);
  
  allDogs.forEach(function (dog, i) {
    if (dog >= 3) {
      console.log(`Dog number ${i + 1} is an adult, and is ${dog} years old`);
    } else {
      console.log(`Dog number ${i + 1} is still a puppy`);
    }
  });
};

checkDogs(dogsJulia, dogsKate);
*/

// THE MAP METHODS
/*
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const euroToUsd = 1.1;

// ARROW FUNCTION
const movementsUSD = movements.map(mov => mov * euroToUsd);

// const movementsUSD = movements.map(function (mov) {
//   return mov * euroToUsd;
// });

console.log(movements);
console.log(movementsUSD);

// const movementsUSDFor = [];
// for (const mov of movements) {
//   movementsUSDFor.push(mov * euroToUsd);
// }
// console.log(movementsUSDFor);

const movementsDescription = movements.map(
  (mov, i) =>
    `Movement ${i + 1}: You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(
      mov
    )}`
);

console.log(movementsDescription);
*/

// THE FILTER METHODS
/*
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const deposits = movements.filter(function (mov) {
  return mov > 0;
});

console.log(movements);
console.log(deposits);

// With for loop
const depositsFor = [];
for (const mov of movements) if (mov > 0) depositsFor.push(mov);

console.log(depositsFor);

const withdrawals = movements.filter(function (mov) {
  return mov < 0;
});

console.log(withdrawals);
*/

// THE REDUCE METHODS
/*
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const balance = movements.reduce((acc, cur) => acc + cur, 0);

console.log(balance);

// With loop
let balance2 = 0;
for (const mov of movements) balance2 += mov;
console.log(balance2);

// Maximum value
// const maximum = movements.reduce(function (acc, cur) {
//   if (cur < acc) {
//     return acc;
//   } else {
//     return cur;
//   }
// }, movements[0]);
console.log(movements);

const maximum = movements.reduce((acc, mov) => {
  if (acc > mov) return acc;
  else return mov;
}, movements[0]);

console.log(maximum);

const minimum = movements.reduce(function (acc, mov) {
  if (acc < mov) return acc;
  else return mov;
}, movements[0]);

console.log(minimum);
*/

// CHALLENGE #2
// Let's go back to Julia and Kate's study about dogs. This time, they want to convert
// dog ages to human ages and calculate the average age of the dogs in their study.
// Your tasks:
// Create a function 'calcAverageHumanAge', which accepts an arrays of dog's
// ages ('ages'), and does the following things in order:
// 1. Calculate the dog age in human years using the following formula: if the dog is
// <= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old,
// humanAge = 16 + dogAge * 4
// 2. Exclude all dogs that are less than 18 human years old (which is the same as
// keeping dogs that are at least 18 years old)
// 3. Calculate the average human age of all adult dogs (you should already know
// from other challenges how we calculate averages �)
// 4. Run the function for both test datasets
// Test data:
// § Data 1: [5, 2, 4, 1, 15, 8, 3]
// § Data 2: [16, 6, 10, 5, 6, 1, 4]
// const ages = [5, 2, 4, 1, 15, 8, 3];
// console.log(ages);

// const calcAverageHumanAge = function (ages) {
//   const humanAges = ages.map(function (age) {
//     if (age <= 2) {
//       return 2 * age;
//     } else {
//       return 16 + age * 4;
//     }
//   });
//   console.log(humanAges);

//   const filterAges = humanAges.filter(function (age) {
//     return age >= 18;
//   });
//   console.log(filterAges);

//   const reduceAges =
//     filterAges.reduce(function (acc, age) {
//       return acc + age;
//     }, 0) / filterAges.length;

//   console.log(reduceAges);
// };

// CHALLENGE #3
// const calcAverageHumanAge = ages =>
//   ages
//     .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
//     .filter(age => age >= 18)
//     .reduce((acc, age, i, arr) => acc + age / arr.length, 0);

// console.log(calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]));
// console.log(calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]));

// CHAINING METHODS
/*
const euroToUsd = 1.1;

// PIPELINE
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const totalDepositUSD = movements
  .filter(mov => mov > 0)
  .map((mov, i, arr) => {
    // console.log(arr);
    return mov * euroToUsd;
  })
  // .map(mov => mov * euroToUsd)
  .reduce((acc, mov) => acc + mov, 0);

console.log(totalDepositUSD);
*/

// THE FIND METHOD
/*
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const firstWIthdrawal = movements.find(function (mov) {
  return mov < 0;
});

console.log(firstWIthdrawal);

console.log(accounts);

const account = accounts.find(acc => acc.owner === 'Jessica Davis');
console.log(account);

// With for loop
for (const acc of accounts) {
  if (acc.owner === 'Jessica Davis') {
    console.log(acc);
  }
}
*/

// THE SOME AND EVERY METHOD
/*
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// Equality
console.log(movements.includes(-130));

// Condition
const anyDeposit = movements.some(mov => mov > 1000);
console.log(anyDeposit);

// Every method
console.log(movements.every(mov => mov > 0));
*/

// THE FLAT AND FLAT MAP METHOD
/*
const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
console.log(arr.flat());

const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
console.log(arrDeep.flat(2));

const accountMovements = accounts.map(acc => acc.movements);
console.log(accountMovements);
const allMovements = accountMovements.flat();
console.log(allMovements);

// const overalBalance = allMovements.reduce((acc, mov) => acc + mov, 0);
// console.log(overalBalance);

const overalBalance = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);
console.log(overalBalance);

// flatMap
const overalBalance2 = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);
console.log(overalBalance2);
*/

// SORTING ARRAYS
/*
// Strings
const owners = ['Jonas', 'Zach', 'Jurabek', 'Shoh'];
console.log(owners.sort());

// Numbers
const numbers = [3, 2, 6, 8, 5];
console.log(numbers.sort());

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
console.log(movements.sort());

// Ascending
// movements.sort((a, b) => {
//   if (a > b) {
//     return 1;
//   }
//   if (b > a) {
//     return -1;
//   }
// });
movements.sort((a, b) => a - b);
console.log(movements);

// Descending
// movements.sort((a, b) => {
//   if (a > b) {
//     return -1;
//   }
//   if (b > a) {
//     return 1;
//   }
// });
movements.sort((a, b) => b - a);
console.log(movements);
*/

// CREATING AND FILLING ARRAY
/*
const arr = [1, 2, 3, 4, 5, 6, 7];
const x = new Array(7);
console.log(x);

x.fill(1, 3, 5);
console.log(x);

arr.fill(23, 2, 6);
console.log(arr);

// Array.from
const y = Array.from({ length: 7 }, () => 1);
console.log(y);

const z = Array.from({ length: 7 }, (current, i) => i + 1);
console.log(z);

labelBalance.addEventListener('click', function () {
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value')
  );

  console.log(movementsUI.map(el => el.textContent));
});
*/

// Practises
/*
// 1.
const bankDepositSum = accounts
  .flatMap(acc => acc.movements)
  .filter(acc => acc > 0)
  .reduce((acc, mov) => acc + mov, 0);
console.log(bankDepositSum);

// 2.
// const numDeposit100 = accounts
//   .flatMap(acc => acc.movements)
//   .filter(acc => acc >= 1000).length;

const numDeposit100 = accounts
  .flatMap(acc => acc.movements)
  .reduce((count, cur) => (cur >= 1000 ? count + 1 : count), 0);

console.log(numDeposit100);

// Prefixed ++ operator
let a = 10;
console.log(++a);
console.log(a);

// 3.
const { deposits, withdrawals } = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (sums, cur) => {
      // cur > 0 ? (sums.deposits += cur) : (sums.withdrawals += cur);
      sums[cur > 0 ? 'deposits' : 'withdrawals'] += cur;
      return sums;
    },
    { deposits: 0, withdrawals: 0 }
  );

console.log(deposits, withdrawals);

// 4.
const convertTitleCase = function (title) {
  const capitalize = str => str[0].toUpperCase() + str.slice(1);

  const exceptions = ['a', 'an', 'and', 'the', 'but', 'or', 'on', 'in', 'with'];

  const titleCase = title
    .toLowerCase()
    .split(' ')
    .map(word => (exceptions.includes(word) ? word : capitalize(word)))
    .join(' ');
  return capitalize(titleCase);
};
console.log(convertTitleCase('this is a nice title'));
console.log(convertTitleCase('this is a LONG title but not too long'));
console.log(convertTitleCase('and here is another title with a EXAMPLE'));
*/
