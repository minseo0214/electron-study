// Global state
let transactions = [];

// Initialize app
document.addEventListener('DOMContentLoaded', async () => {
  // Set today's date as default
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('date').value = today;

  // Load existing data
  await loadTransactions();

  // Set up event listeners
  document.getElementById('transactionForm').addEventListener('submit', handleAddTransaction);
  document.getElementById('importBtn').addEventListener('click', handleImport);
  document.getElementById('exportBtn').addEventListener('click', handleExport);
  document.getElementById('searchInput').addEventListener('input', filterTransactions);
  document.getElementById('filterType').addEventListener('change', filterTransactions);
});

// Load transactions from file
async function loadTransactions() {
  try {
    const data = await window.electronAPI.loadData();
    transactions = data || [];
    renderTransactions();
    updateSummary();
  } catch (error) {
    console.error('Error loading data:', error);
    alert('Failed to load data: ' + error.message);
  }
}

// Save transactions to file
async function saveTransactions() {
  try {
    const result = await window.electronAPI.saveData(transactions);
    if (!result.success) {
      throw new Error(result.error || 'Failed to save data');
    }
  } catch (error) {
    console.error('Error saving data:', error);
    alert('Failed to save data: ' + error.message);
  }
}

// Handle adding a new transaction
async function handleAddTransaction(e) {
  e.preventDefault();

  const transaction = {
    id: Date.now().toString(),
    date: document.getElementById('date').value,
    type: document.getElementById('type').value,
    category: document.getElementById('category').value,
    amount: parseFloat(document.getElementById('amount').value),
    description: document.getElementById('description').value
  };

  transactions.push(transaction);
  await saveTransactions();
  
  // Reset form
  e.target.reset();
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('date').value = today;

  renderTransactions();
  updateSummary();
}

// Handle deleting a transaction
async function handleDeleteTransaction(id) {
  if (confirm('Are you sure you want to delete this transaction?')) {
    transactions = transactions.filter(t => t.id !== id);
    await saveTransactions();
    renderTransactions();
    updateSummary();
  }
}

// Render transactions list
function renderTransactions() {
  const container = document.getElementById('transactionsList');
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  const filterType = document.getElementById('filterType').value;

  // Filter transactions
  let filtered = transactions;
  
  if (searchTerm) {
    filtered = filtered.filter(t => 
      t.category.toLowerCase().includes(searchTerm) ||
      t.description.toLowerCase().includes(searchTerm)
    );
  }

  if (filterType !== 'all') {
    filtered = filtered.filter(t => t.type === filterType);
  }

  // Sort by date (newest first)
  filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <p>📝 No transactions found</p>
        <p>Add your first transaction above!</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(transaction => `
    <div class="transaction-item ${transaction.type}">
      <div class="transaction-info">
        <div class="transaction-header">
          <span class="transaction-date">${formatDate(transaction.date)}</span>
          <span class="transaction-category">${transaction.category}</span>
        </div>
        ${transaction.description ? `<div class="transaction-description">${transaction.description}</div>` : ''}
      </div>
      <div class="transaction-amount ${transaction.type}">
        ${transaction.type === 'income' ? '+' : '-'}₩${formatNumber(transaction.amount)}
      </div>
      <div class="transaction-actions">
        <button class="btn-delete" onclick="handleDeleteTransaction('${transaction.id}')">Delete</button>
      </div>
    </div>
  `).join('');
}

// Update summary statistics
function updateSummary() {
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  document.getElementById('totalIncome').textContent = `₩${formatNumber(totalIncome)}`;
  document.getElementById('totalExpense').textContent = `₩${formatNumber(totalExpense)}`;
  document.getElementById('balance').textContent = `₩${formatNumber(balance)}`;
}

// Handle import
async function handleImport() {
  try {
    const result = await window.electronAPI.importData();
    
    if (result.cancelled) {
      return;
    }

    if (result.success && result.data) {
      if (confirm('This will replace all existing data. Are you sure?')) {
        transactions = result.data;
        await saveTransactions();
        renderTransactions();
        updateSummary();
        alert('Data imported successfully!');
      }
    } else {
      throw new Error(result.error || 'Failed to import data');
    }
  } catch (error) {
    console.error('Error importing data:', error);
    alert('Failed to import data: ' + error.message);
  }
}

// Handle export
async function handleExport() {
  try {
    const result = await window.electronAPI.exportData(transactions);
    
    if (result.cancelled) {
      return;
    }

    if (result.success) {
      alert('Data exported successfully!');
    } else {
      throw new Error(result.error || 'Failed to export data');
    }
  } catch (error) {
    console.error('Error exporting data:', error);
    alert('Failed to export data: ' + error.message);
  }
}

// Filter transactions
function filterTransactions() {
  renderTransactions();
}

// Format number with commas
function formatNumber(num) {
  return num.toLocaleString('ko-KR');
}

// Format date
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

// Make delete function available globally
window.handleDeleteTransaction = handleDeleteTransaction;
