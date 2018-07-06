![cf](https://i.imgur.com/7v5ASc8.png) Lab 16: Basic Authentication
======

[![Build Status](https://travis-ci.com/TCW417/16-19-auth-asset-mgt.svg?branch=master)](https://travis-ci.com/TCW417/16-19-auth-asset-mgt)

This lab implements a basic authentication API.

### Routes

#### POST /api/signup

This route creates a new user account.  The body of the request must include a username, password and email.

```
http POST localhost:3000/api/signup username=Larry password=McMurtry email='lonesome@dove.com'

HTTP/1.1 200 OK
Access-Control-Allow-Origin: *
Connection: keep-alive
Content-Length: 479
Content-Type: application/json; charset=utf-8
Date: Mon, 02 Jul 2018 23:51:43 GMT
ETag: W/"1df-QcYUBHTXhq3c2S6xNl8ELjEnYkY"
X-Powered-By: Express

{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlblNlZWQiOiI3ODRlMmViOTFmMDYwNzM3OGM4OTY3YzM1YmU0NDEyYjhiN2NmMzUwOWEyZjJlN2QiLCJpYXQiOjE1MzA2NTYzOTh9.Eq0g-0LulEn5G5JrQ5XRMsREklYV5KuVhEcuq6PREYY"
}
```

Returns 409 if username and email aren't unique, 400 if request is missing any required information.

#### GET /api/login

This route requires the username and password to be base64 encrypted and included as the request header's Authentication tag. The route returns a JSON Web Token whose payload includes the database ID or the user's profile. This can be used in a subsequent GET /api/profiles request.

```
http -a Larry:McMurtry localhost:3000/api/login

{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlblNlZWQiOiIyMGNiZmExODFmZmZhYTk4ZGRkMDEzNDExMTM4NDI2YmUwZGU2NTY0NTBhYTA3ZWIiLCJpYXQiOjE1MzA2NTY2MzZ9.0XAT9ltDxe34pxpVZwKLb17b7n6ZpKj_N04wVwviTLg"
}
```

Returns 400 if username not found, 500 if password is incorrect (as a benefit to hackers everywhere).

#### POST /api/profiles

Create a profile for an existing Account.  Requires a firstName and Account ID (provided by the GET /api/login route). Other properties are lastName, location, profileImageUrl, and bio.  Returns status code 200 on success.
```
request body = {
    firstName: 'Larry',
    lastName: 'McMurtry',
    location: 'Souix Falls, SD',
    bio: 'A great american author.',
    accountId: '5b3bf68e06fde67494fa7ab0'
}
```
Returns
```
{
    "_id": "5b3bf93461e2a6754b1c8cf3",
    "firstName": "Larry",
    "lastName": "McMurtry",
    "location": "Souix Falls, SD",
    "bio": "A great american author.",
    "accountId": "5b3bf68e06fde67494fa7ab0",
    "__v": 0
}
```
Returns 404 if accountId does not exist, 400 if badly formed request.

#### GET /api/profiles[?id=accountId]

With no query string, returns an array of all profiles:
```
[
    {
        "_id": "5b3bf93461e2a6754b1c8cf3",
        "firstName": "Larry",
        "lastName": "McMurtry",
        "location": "Souix Falls, SD",
        "bio": "A great american author.",
        "accountId": "5b3bf68e06fde67494fa7ab0",
        "__v": 0
    }
]
```
With an id query (id is the profile _id property, not the accountId property), returns the specific profile:
```
{
    "_id": "5b3bf93461e2a6754b1c8cf3",
    "firstName": "Larry",
    "lastName": "McMurtry",
    "location": "Souix Falls, SD",
    "bio": "A great american author.",
    "accountId": "5b3bf68e06fde67494fa7ab0",
    "__v": 0
}
```
Returns 404 if profile isn't found, 401 on bad token, 400 if query is badly formed.

#### POST /api/bookcovers

This route is used to upload a bookcover image to the server.  Never mind that there are no books in this application. There are in my Lab 13-14 code which is what I was thinking was in this lab too.  Maybe someday...

The request requires a valid bearer authorization token in the Authorization header, an attached file, and a request body that includes the image title (book title typically).  The route responds with:
```
{
        "_id": "5b3d7d7a72d67f4dcc93b9bf",
        "title": "lonesome_dove.png",
        "accountId": "5b3d7d7a72d67f4dcc93b9bd",
        "fileName": "e7f04e0787f98506936a5486732d0756.lonesome_dove.png",
        "url": "https://tcw417-cf401.s3.amazonaws.com/e7f04e0787f98506936a5486732d0756.lonesome_dove.png",
        "createdAt": "2018-07-05T02:07:54.499Z",
        "updatedAt": "2018-07-05T02:07:54.499Z",
        "__v": 0
}
```
This route returns status 400 on bad request and 401 on bad token.

#### GET /api/bookcovers/bookCoverId

This route returns a bookcover object including the AWS url required to retrieve it.  It requires a bookCoverId as part of the url path.
```
{
        "_id": "5b3d7d7a72d67f4dcc93b9bf",
        "title": "lonesome_dove.png",
        "accountId": "5b3d7d7a72d67f4dcc93b9bd",
        "fileName": "e7f04e0787f98506936a5486732d0756.lonesome_dove.png",
        "url": "https://tcw417-cf401.s3.amazonaws.com/e7f04e0787f98506936a5486732d0756.lonesome_dove.png",
        "createdAt": "2018-07-05T02:07:54.499Z",
        "updatedAt": "2018-07-05T02:07:54.499Z",
        "__v": 0
}
```
This route response with status 404 if bookCoverId isn't found, 401 if authorization token is bad.

#### DELETE /api/bookcovers/bookCoverId

This route deletes the book cover with id bookCoverId. It returns an empty object on success and status 200. If bookCoverId is not found status 404 is returned, status 401 is returned if token is invalid.

### Load Testing Analysis

The API was tested on the production environment hosted by Heroku with MongoDB provisioned by mLab. Note that both of these resources are of the "sandbox" or free variety so these results must be understood with that in mind. Provisioning the API with "paid" resources providing parallel execution of multiple server instances would significantly improve results.

#### Test Approach

Two test flows were utilized:
- Creating a new account and profile and
- Retrieving an existing profile

These tests where run in a 75% POST (create) and 25% GET (retrieve) mix.  This was done to try and simulate a typical mix of requests and defeat caching of server code that would result from only exercising a single server route.  With additional server resources, more complex test scenarios could be evaluated.

#### Results Summary

| Summary | |
|---------|-|
| Test duration | 200 seconds |
| Scenarios created | 45,564 |
| Scenarios completed | 45,084 |

| Scenario Counts | |
|-----------------|-|
| Create Users/Profiles | 34,122 (74.9%) |
| Get Users | 11,442 (25.1%) |

| HTML Code | Meaning | Count |
|------|---------|-------|
| 200 | Success | 67,278 |
| 400 | Bad Request | 11,140 |
| 401 | Invalid token | 280 |
| 409 | Conflict | 332 |
| 503 | Server error | 114 |

| Errors | |
|-------|-|
| ETIMEDOUT | 80 |

The 503 HTML codes and ETIMEDOUT errors are a result of the Heroku dyno (server instance) becoming overtaxed by the test.  Code 400, Bad Request, was caused by the mock data generator producing invalid values. This is a good simulation of users entering invalid values and is not considered an error. Likewise, codes 401 and 409 are not errors. 401 is caused by the queue of valid request tokens emptying (and a blank, invalid token being used instead), and 409 errors are caused by the mock data generator producing duplicate values. Again, simulating actual user interaction with the API.

##### Detailed Results

![](https://github.com/TCW417/16-19-auth-asset-mgt/blob/master/load-testing/assets/latency-distro.jpg)

This chart shows the distribution of latency measurements for five categories.  Latency is a measure of the delay in processing server requests resulting from network delays. As such it is largely out of our control, beyond the possible upgrading of on-site networking equipment.  This should not be confused with response time, which is a measure of the end-to-end time from submission of a request to return of a result.  

- MIN (too small to show up on the scale of this graph), 75.4ms
- MAX 41.665 seconds
- MEDIAN 4.294 seconds
- P95 15.296 seconds (95% of users experienced this latence or better)
- P99 21.782 seconds (99% of users experienced this latence or better)

These results are not adequate for a production API. It is recommended that additional server resources be allocated for these tests to measure the effect.




