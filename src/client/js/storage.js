/* =====================================================
   EXPENSE TRACKER — Local Storage Helpers
   ===================================================== */

const Storage = {
  // ---- Users ----
  getUsers() {
    return JSON.parse(localStorage.getItem('et_users') || '[]');
  },

  saveUsers(users) {
    localStorage.setItem('et_users', JSON.stringify(users));
  },

  findUserByEmail(email) {
    return this.getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
  },

  emailExists(email) {
    return this.getUsers().some(u => u.email.toLowerCase() === email.toLowerCase());
  },

  addUser(user) {
    const users = this.getUsers();
    users.push(user);
    this.saveUsers(users);
  },

  deleteUser(email) {
    const users = this.getUsers().filter(u => u.email.toLowerCase() !== email.toLowerCase());
    this.saveUsers(users);
    localStorage.removeItem(`et_tx_${email.toLowerCase()}`);
  },

  // ---- Sessions ----
  setCurrentUser(email) {
    localStorage.setItem('et_currentUser', email.toLowerCase());
  },

  getCurrentUser() {
    return localStorage.getItem('et_currentUser');
  },

  clearCurrentUser() {
    localStorage.removeItem('et_currentUser');
  },

  setAdminLoggedIn(val) {
    localStorage.setItem('et_adminLoggedIn', val ? 'true' : 'false');
  },

  isAdminLoggedIn() {
    return localStorage.getItem('et_adminLoggedIn') === 'true';
  },

  clearAdmin() {
    localStorage.removeItem('et_adminLoggedIn');
  },

  // ---- Transactions (per user) ----
  getTransactions(email) {
    const key = `et_tx_${email.toLowerCase()}`;
    return JSON.parse(localStorage.getItem(key) || '[]');
  },

  saveTransactions(email, txs) {
    const key = `et_tx_${email.toLowerCase()}`;
    localStorage.setItem(key, JSON.stringify(txs));
  },

  addTransaction(email, tx) {
    const txs = this.getTransactions(email);
    tx.id = Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
    txs.unshift(tx);
    this.saveTransactions(email, txs);
    return tx;
  },

  deleteTransaction(email, id) {
    const txs = this.getTransactions(email).filter(t => t.id !== id);
    this.saveTransactions(email, txs);
  },

  // ---- Aggregates ----
  getTotals(email) {
    const txs = this.getTransactions(email);
    let income = 0, expense = 0;
    txs.forEach(t => {
      if (t.type === 'income') income += Number(t.amount);
      else expense += Number(t.amount);
    });
    return { income, expense, balance: income - expense };
  },

  getGlobalStats() {
    const users = this.getUsers();
    let totalIncome = 0, totalExpense = 0, totalTx = 0;
    users.forEach(u => {
      const txs = this.getTransactions(u.email);
      totalTx += txs.length;
      txs.forEach(t => {
        if (t.type === 'income') totalIncome += Number(t.amount);
        else totalExpense += Number(t.amount);
      });
    });
    return {
      userCount: users.length,
      txCount: totalTx,
      totalIncome,
      totalExpense
    };
  },

  // ---- Seed demo data (runs only once) ----
  seedDemoData() {
    if (localStorage.getItem('et_seeded') === 'true') return;

    const users = [
      {
        name: 'Hari Babu',
        email: 'hari@gmail.com',
        password: 'hari123',
        createdAt: '2026-08-12T10:00:00.000Z'
      },
      {
        name: 'Rahul Sharma',
        email: 'rahul@gmail.com',
        password: 'rahul123',
        createdAt: '2026-08-20T11:30:00.000Z'
      },
      {
        name: 'Priya Patel',
        email: 'priya@gmail.com',
        password: 'priya123',
        createdAt: '2026-09-01T09:15:00.000Z'
      }
    ];
    this.saveUsers(users);

    // Hari Babu transactions
    const hariTx = [
      { id: 'h1', type: 'income',  amount: 45000, category: 'Salary',    note: 'Monthly salary - September', date: '2026-09-01', method: 'Bank' },
      { id: 'h2', type: 'income',  amount: 12000, category: 'Freelance', note: 'Website design project',     date: '2026-09-05', method: 'Net Banking' },
      { id: 'h3', type: 'expense', amount: 3500,  category: 'Education', note: 'SDC Project Lab Components', date: '2026-09-08', method: 'Credit Card' },
      { id: 'h4', type: 'expense', amount: 820,   category: 'Food',      note: 'Weekend dinner',             date: '2026-09-10', method: 'Cash' },
      { id: 'h5', type: 'expense', amount: 1500,  category: 'Travel',    note: 'Uber to college',            date: '2026-09-12', method: 'UPI' },
      { id: 'h6', type: 'expense', amount: 2499,  category: 'Shopping',  note: 'Headphones from Amazon',     date: '2026-09-15', method: 'Credit Card' },
      { id: 'h7', type: 'expense', amount: 1200,  category: 'Bills',     note: 'Electricity bill',           date: '2026-09-18', method: 'Net Banking' },
      { id: 'h8', type: 'income',  amount: 5000,  category: 'Gift',      note: 'Birthday gift from uncle',   date: '2026-09-20', method: 'Cash' },
      { id: 'h9', type: 'expense', amount: 450,   category: 'Food',      note: 'Canteen lunch',              date: '2026-09-22', method: 'Cash' },
      { id: 'h10',type: 'expense', amount: 3200,  category: 'Bills',     note: 'Mobile + Internet recharge', date: '2026-09-25', method: 'UPI' },
      { id: 'h11',type: 'expense', amount: 1800,  category: 'Travel',    note: 'Train ticket home',          date: '2026-09-28', method: 'Bank' },
      { id: 'h12',type: 'income',  amount: 8000,  category: 'Freelance', note: 'Logo design work',           date: '2026-10-02', method: 'Net Banking' },
      { id: 'h13',type: 'expense', amount: 999,   category: 'Shopping',  note: 'Notebooks & stationery',     date: '2026-10-04', method: 'Cash' },
      { id: 'h14',type: 'expense', amount: 650,   category: 'Food',      note: 'Swiggy order',               date: '2026-10-05', method: 'UPI' },
    ];
    this.saveTransactions('hari@gmail.com', hariTx);

    // Rahul Sharma transactions
    const rahulTx = [
      { id: 'r1', type: 'income',  amount: 38000, category: 'Salary',    note: 'Internship stipend',         date: '2026-09-01', method: 'Bank' },
      { id: 'r2', type: 'expense', amount: 2200,  category: 'Travel',    note: 'Petrol',                     date: '2026-09-07', method: 'Cash' },
      { id: 'r3', type: 'expense', amount: 4500,  category: 'Shopping',  note: 'New shoes',                  date: '2026-09-14', method: 'Credit Card' },
      { id: 'r4', type: 'expense', amount: 1100,  category: 'Food',      note: 'Team lunch',                 date: '2026-09-21', method: 'UPI' },
      { id: 'r5', type: 'income',  amount: 3000,  category: 'Freelance', note: 'Content writing',            date: '2026-10-01', method: 'Net Banking' },
    ];
    this.saveTransactions('rahul@gmail.com', rahulTx);

    // Priya Patel transactions
    const priyaTx = [
      { id: 'p1', type: 'income',  amount: 42000, category: 'Salary',    note: 'Monthly salary',             date: '2026-09-01', method: 'Bank' },
      { id: 'p2', type: 'expense', amount: 1800,  category: 'Education', note: 'Online course fee',          date: '2026-09-09', method: 'Credit Card' },
      { id: 'p3', type: 'expense', amount: 3200,  category: 'Bills',     note: 'PG rent contribution',       date: '2026-09-15', method: 'Net Banking' },
      { id: 'p4', type: 'expense', amount: 750,   category: 'Food',      note: 'Groceries',                  date: '2026-09-28', method: 'Cash' },
      { id: 'p5', type: 'expense', amount: 2100,  category: 'Shopping',  note: 'Clothes',                    date: '2026-10-03', method: 'UPI' },
    ];
    this.saveTransactions('priya@gmail.com', priyaTx);

    localStorage.setItem('et_seeded', 'true');
  }
};

// Auto-seed on first load
Storage.seedDemoData();