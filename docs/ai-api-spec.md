# AI API Specs:

This is for version 1 of the api. Each url should be prefixed by `/v1`, e.g http://example.com/v1/ai/register/teamname.

## Notes:

Once a teamname has been registered, it cannot be registered again until a DELETE is called using the vaild auth token for the teamname.


## Endpoints:

### POST /ai/register/{teamname}

#### Params
`teamname`: Name to use for the team


#### Example Result
```
{
   "meta": {
      "code": 201
   },
   "payload": {
      "token": "##############"
   }
}
```

#### Return codes:
`201`: Registration was successful. In this case a token will be provided. This token should be saved as it provides authentication for the calls.

`409`: Team name is already used. A token will not be provided.




### PUT /ai/join

#### Required HTTP headers
`token`: The auth token returned by `POST /ai/register/{teamname}`


#### Example Result
```
{
   "meta": {
      "code": 200
   },
   "payload": {
      "gameident": "28cba4f7-b1a9-2b98-0801-61b5d720534d"
   }
}
```

#### Return codes:
`200`: Request to join a game was successful




### GET /ai/board/{gameident}

#### Params
`gameident`: The identifier returned by `PUT /ai/join`


#### Required HTTP headers
`token`: The auth token returned by `POST /ai/register/{teamname}`


#### Example Result
```
{
   "meta": {
      "code": 200
   },
   "payload": {
      "ident": "28cba4f7-b1a9-2b98-0801-61b5d720534d",
      "players": {
         "tony": "A",
         "jose": "B",
         "fred": "C"
      },
      "turn": 1,
      "board": [
         ["_","_","_","#","_","_","_","_","_","_","_","#","_","_","_"],
         ["_","_","_","#","_","_","_","_","_","_","_","#","_","_","_"],
         ["_","_","_","#","_","_","_","_","_","_","_","#","_","_","_"],
         ["_","_","_","A","_","_","_","_","_","_","_","B","_","_","_"],
         ["_","_","_","_","_","_","_","_","_","_","_","_","_","_","_"],
         ["_","_","_","_","_","_","_","_","_","_","_","_","_","_","_"],
         ["_","_","_","_","_","_","_","_","_","_","_","_","_","_","_"],
         ["_","_","_","_","_","_","_","_","_","_","_","_","_","_","_"],
         ["_","_","_","_","_","_","_","_","_","_","_","_","_","_","_"],
         ["_","_","_","_","_","_","_","_","_","_","_","_","_","_","_"],
         ["_","_","_","_","_","_","_","_","_","_","_","_","_","_","_"],
         ["_","_","_","_","_","_","_","_","_","_","_","C","#","#","#"],
         ["_","_","_","_","_","_","_","_","_","_","_","_","_","_","_"],
         ["_","_","_","_","_","_","_","_","_","_","_","_","_","_","_"],
         ["_","_","_","_","_","_","_","_","_","_","_","_","_","_","_"]
      ],
      "markers": {
         "free": "_",
         "full": "#"
      },
      "date": 1427118215214
   }
}
```

#### Return codes:
`200`: Request successful

`202`: Game has not been started yet

`404`: Game with identifier not found




### PUT /ai/move/{gameident}/{turn}/{direction}

#### Params
`gameident`: The identifier returned by `PUT /ai/join`

`turn`: The turn number provided by `GET /ai/board/{gameident}`

`direction`: The direction to move. Vaild options are: `left`, `right`, and `forward`.


#### Required HTTP headers
`token`: The auth token returned by `POST /ai/register/{teamname}`


#### Example Result
```
{
   "meta": {
      "code": 200
   },
   "payload": {}
}
```

#### Return codes:
`200`: Request to join a game was successful

`202`: Game has not been started yet

`202`: Waiting on turns by other players

`404`: Game with identifier not found

`406`: Direction is not allowed




### DELETE /ai/register

#### Required HTTP headers
`token`: The auth token returned by `POST /ai/register/{teamname}`


#### Example Result
```
{
   "meta": {
      "code": 200
   },
   "payload": {}
}
```

#### Return codes:
`200`: Request to join a game was successful

`403`: Unauthorized
