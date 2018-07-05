import 'babel-polyfill';
import faker from 'faker';
import { createAccountMockPromise } from './account-mock';
import Bookcover from '../../model/bookcover';
import Account from '../../model/account';

const createCoverMockPromise = async () => {
  const mockData = {};
  // mockAcctResponse will equal:
  /*
    {
      originalRequest: {},
      token: some token,
      account: { mongDb account}
    }
  */
  const mockAcctResponse = await createAccountMockPromise();
  // console.log(mockAcctResponse, 'inside async await');
  mockData.account = mockAcctResponse.account;
  mockData.token = mockAcctResponse.token;
  const cover = await new Bookcover({
    title: faker.lorem.words(2),
    url: faker.random.image(),
    fileName: faker.system.fileName(),
    accountId: mockData.account._id,
  }).save();
  // console.log(COVER, cover);
  mockData.cover = cover;
  return mockData;
};

const removeCoversAndAccounts = () => {
  return Promise.all([
    Bookcover.remove({}),
    Account.remove({}),
  ]);
};


export { createCoverMockPromise, removeCoversAndAccounts };
