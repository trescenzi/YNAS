import dayjs from 'dayjs';

const uri = 'https://youneedasankey.com'
const client_id = '0324447b78bb5534a0dbd2a9fb4f45b7d2f335713ed17277fc5d8fcdf5d41f72';
const YNAB_URL = `https://app.youneedabudget.com/oauth/authorize?client_id=${client_id}&redirect_uri=${uri}&response_type=token`;
const hashTest = /#access_token=(\w+)&token_type=(\w+)&expires_in=(\d+)/;
const storageKey = 'YNAB_ACCESS_TOKEN';

export function authorize() {
  location = YNAB_URL;
}

function fromHash() {
  const hash = location.hash;
  const match = hashTest.exec(hash);
  if (match) {
    localStorage.setItem(storageKey, {
      token: match[1],
      expiresAt: dayjs().add(match[3], 'ms'),
      type: match[2],
    });
    return match[1];
  }
}

function notExpired(keyObj) {
  return keyObj && keyObj.expiresAt && dayjs().isBefore(keyObj.expiresAt);
}
function fromStorage() {
  const keyString = localStorage.getItem(storageKey);
  const keyObj = JSON.parse(keyString);
  if (notExpired(keyObj)) {
    return keyObj.token;
  }
}
  
export function getToken() {
  const key = fromHash() || fromStorage();
  if (key) {
    console.log(key);
    return key;
  }
}

window.authorize = authorize;
