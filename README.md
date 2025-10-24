# electron-study
데스크톱 앱 공부용 - Household Account Book (가계부)

## Features
- 💰 Household account book (income and expense tracking)
- 💾 Local file storage for data persistence
- 📥 Import data from JSON file
- 📤 Export data to JSON file
- 🔍 Search and filter transactions
- 📊 Summary statistics (total income, expense, balance)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/minseo0214/electron-study.git
cd electron-study
```

2. Install dependencies:
```bash
npm install
```

## Usage

Run the application:
```bash
npm start
```

## How to Use

1. **Add Transaction**: Fill in the form with date, type (income/expense), category, amount, and optional description
2. **View Transactions**: See all your transactions listed below with summary statistics
3. **Search/Filter**: Use the search box to find transactions by category or description, and filter by type
4. **Delete Transaction**: Click the "Delete" button on any transaction to remove it
5. **Export Data**: Click the "Export" button to save your data to a JSON file
6. **Import Data**: Click the "Import" button to load data from a previously exported JSON file

## Data Storage

- Data is automatically saved to your local file system
- Location: Application data directory (varies by OS)
- Format: JSON
- Sample data file (`sample-data.json`) is included to demonstrate the data format

## Data Format

The application uses JSON format for storing transactions. Each transaction has:
```json
{
  "id": "unique-id",
  "date": "YYYY-MM-DD",
  "type": "income" or "expense",
  "category": "Category name",
  "amount": number,
  "description": "Optional description"
}
```

## Technologies Used

- Electron
- HTML/CSS/JavaScript
- Node.js
