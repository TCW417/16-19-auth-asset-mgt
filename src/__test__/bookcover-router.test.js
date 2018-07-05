'use strict';

import superagent from 'superagent';
import bearerAuth from 'superagent-auth-bearer';
import { startServer, stopServer } from '../lib/server';
import { createCoverMockPromise, removeCoversAndAccounts } from './lib/bookcover-mock';

bearerAuth(superagent);

const dogMp3 = `${__dirname}/asset/dog.mp3`;
const apiUrl = `http://localhost:${process.env.PORT}/api/bookcovers`;

describe('TESTING ROUTES AT /api/bookcovers', () => {
  let token;
  let cover;
  beforeAll(startServer);
  afterAll(stopServer);
  beforeEach(async () => {
    try {
      const mockData = await createCoverMockPromise();
      token = mockData.token; /*eslint-disable-line*/
      cover = mockData.cover; /*eslint-disable-line*/
    } catch (err) {
      throw err;
    }
    return undefined;
  });
  afterEach(async () => {
    await removeCoversAndAccounts();
  });

  describe('POST ROUTES TO /api/bookcovers', () => {
    test('POST 200', async () => {
      try {
        const response = await superagent.post(apiUrl)
          .authBearer(token)
          .field('title', 'lonesome dove')
          .attach('cover', dogMp3);
        expect(response.status).toEqual(200);
        expect(response.body.title).toEqual('lonesome dove');
        expect(response.body._id).toBeTruthy();
        expect(response.body.url).toBeTruthy();
        expect(response.body.url).toBeTruthy();
        Object.assign(cover, response.body);
      } catch (err) {
        expect(err).toEqual('POST 200 bookcover unexpected error');
      }
      return undefined;
    });

    test('POST 400 to /api/bookcovers with bad request', async () => {
      try {
        const response = await superagent.post(apiUrl)
          .authBearer(token)
          .field('not-title', 'lonesome dove')
          .attach('cover', dogMp3);
        expect(response).toEqual('POST 400 unexpected response');
      } catch (err) {
        expect(err.status).toEqual(400);
      }
    });

    test('POST 401 to /api/bookcovers with bad token', async () => {
      try {
        const response = await superagent.post(apiUrl)
          .authBearer('bad-token')
          .field('title', 'lonesome dove')
          .attach('cover', dogMp3);
        expect(response).toEqual('POST 401 unexpected response');
      } catch (err) {
        expect(err.status).toEqual(401);
      }
    });
  });

  describe('GET ROUTES to /api/bookcovers', () => {
    test('200 GET /api/bookcovers for succesful fetching of a cover', async () => {
      try {
        const response = await superagent.get(`${apiUrl}/${cover._id}`)
          .authBearer(token);
        expect(response.status).toEqual(200);
        expect(response.body.title).toEqual(cover.title);
        expect(response.body.accountId).toEqual(cover.accountId.toString());
        expect(response.body.url).toEqual(cover.url);
        expect(response.body.fileName).toEqual(cover.fileName);
      } catch (err) {
        expect(err).toEqual('FAILING IN GET 200 POST');
      }
    });

    test('404 GET /api/bookcovers with bad cover id', async () => {
      try {
        const response = await superagent.get(`${apiUrl}/1234567890`)
          .authBearer(token);
        expect(response).toEqual('404 GET returned unexpected response');
      } catch (err) {
        expect(err.status).toEqual(404);
      }
    });
  });

  describe('DELETE ROUTES to /api/bookcovers', () => {
    test('200 DELETE /api/bookcovers for successful deletion of a cover', async () => {
      try {
        const response = await superagent.delete(`${apiUrl}/${cover._id}`)
          .authBearer(token);
        expect(response.status).toEqual(200);
      } catch (err) {
        expect(err.message).toEqual('FAILING TO GET GOOD STATUS FROM DELETE');
      }
    });

    test('404 DELETE /api/bookcovers with bad cover id', async () => {
      try {
        const response = await superagent.get(`${apiUrl}/1234567890`)
          .authBearer(token);
        expect(response).toEqual('404 DELETE returned unexpected response');
      } catch (err) {
        expect(err.status).toEqual(404);
      }
    });
  });
});
