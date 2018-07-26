import getUserData from './ynab';
import dayjs from 'dayjs';
import app from './app.vue';
import Vue from 'vue';
const LAST_MONTH = dayjs().subtract(1, 'month');

const width = 1400;
const height = 1000;

function generateLinkFromTransaction(transaction) {
  return {
    source: transaction.account_name,
    target: transaction.category_name,
    value: transaction.amount / 1000,
    date: transaction.date,
  }
}

function generateNodeFromAccount(account) {
  return {
    name: account.name,
  }
}

function generateNodesFromCategoryGroups(categoryGroups) {
  return categoryGroups.reduce((nodes, group) => {
    return nodes.concat(group.categories.map((category) => ({name: category.name})))
  }, []);
}

const sameLink = (link) => (l) => l.source === link.source && l.target === link.target;

const nameMatches = (node) => (n) => n.name === node.name;

getUserData().then(({transactions, accounts, category_groups}) => {
  const nodes = accounts
    .map(generateNodeFromAccount)
    .concat(generateNodesFromCategoryGroups(category_groups))
    .filter((node, i, self) => self.findIndex(nameMatches(node)) === i)
    .concat([
      {name: "Immediate Income SubCategory"},
      {name: "Split (Multiple Categories)..."},
    ]);
  const links = transactions
    .map(generateLinkFromTransaction)
    .filter((link) => link.target && link.source && link.value)
    .filter((link) => !dayjs(link.date).isBefore(LAST_MONTH))
    .reduce((links, link) => {
      const index = links.findIndex(sameLink(link))
      if (index === -1) {
        links.push(link);
      } else {
        links[index].value += link.value;
      }
      return links;
    }, [])
    .map((link) => Object.assign(link, {value: Math.abs(link.value)}))

  new Vue({
    el: '#vue',
    render(h) {
      return h(app, {
        props: {
          height: this.height,
          width: this.width,
          links: this.links,
          nodes: this.nodes,
        }
      });
    },
    data: {
      height,
      width,
      links,
      nodes,
    }
  });
}).catch((e) => {
  console.log(e);
});

