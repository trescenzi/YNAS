import * as ynab from 'ynab';
import {getToken, authorize} from './oauth';

const ACCOUNT_TYPES = {
  credit: 'creditCard',
  checking: 'checking',
  savings: 'savings',
  asset: 'otherAsset',
  liability: 'otherLiability',
}


function generateCacheKey(budget) {
  return `NAME:${budget.name};LAST_MODIFIED:${budget.last_modified_on}`;
}

export default async function getUserData() {
  const token = getToken();
  if (!token) {
    console.log('AUTHORIZING');
    authorize();
    return;
  }

  const ynabAPI = new ynab.api(token);
  try {
    var {data: {budgets}} = await ynabAPI.budgets.getBudgets();
  } catch (e) {
    if (e.message === "Failed to fetch") {
      return JSON.parse(localStorage.getItem('YNAB_DATA'));
    }

    throw new Error(`YNAB API Rejected request:\n${JSON.stringify(e)}`);
  }
  const budget = budgets.find((b) => b.name === 'Comprehensive');
  const currentlyCachedBudget = localStorage.getItem('YNAB_CACHE_KEY');
  const currentBudgetCacheKey = generateCacheKey(budget);
  if (currentlyCachedBudget === currentBudgetCacheKey) {
    return JSON.parse(localStorage.getItem('YNAB_DATA'));
  }

  const {data: {transactions}} = await ynabAPI.transactions.getTransactions(budget.id);
  const {data: {accounts}} = await ynabAPI.accounts.getAccounts(budget.id);
  const {data: {payees}} = await ynabAPI.payees.getPayees(budget.id);
  const {data: {category_groups}} = await ynabAPI.categories.getCategories(budget.id);
  const data = {
    transactions,
    accounts,
    payees,
    category_groups,
  };
  localStorage.setItem('YNAB_CACHE_KEY', currentBudgetCacheKey);
  localStorage.setItem('YNAB_DATA', JSON.stringify(data));

  return data;
}
