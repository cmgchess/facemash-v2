## FaceMash V2
Simple, Reusable, Prototypical solution inspired by FaceMash ( As seen in [The Social Network (2010)](https://www.imdb.com/title/tt1285016/) ) that allows users to rate two Pokemons against each other. The game uses Glicko 2 rating system to calculate the relative strength of each Pokemon, and features a leaderboard that is automatically updated at GMT midnight. 
### Inspiration
[![FaceMash](https://img.youtube.com/vi/KdtPNRzuKrk/0.jpg)](https://www.youtube.com/watch?v=KdtPNRzuKrk)

### Data
The dataset is collected from [fanzeyi](https://github.com/fanzeyi)/**[pokemon.json](https://github.com/fanzeyi/pokemon.json)**
#### Seed Data for MongoDB
Initial seed data for MongoDB can be found [here](https://github.com/cmgchess/facemash-v2/blob/master/sync/data/pokemon-db.json). Initial `rating`,`deviation` and `sigma` are set to 1500, 350 and 0.06 respectively. The initial rank values are set to the same value as the `currRank` field, and `prevRank` is also initialized to the same value. Below is an example of what the seed data for a Pokemon in the database would look like: 
```json
{
  "id": "1",
  "name": "Bulbasaur",
  "img": "https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/images/001.png",
  "currRank": 1,
  "prevRank": 1,
  "rating": 1500,
  "deviation": 350,
  "sigma": 0.06
}
```
#### Seed Data for Algolia
Initial seed data for Algolia can be found [here](https://github.com/cmgchess/facemash-v2/blob/master/sync/data/pokemon-algolia.json). Below is an example of what the seed data for a Pokemon in Algolia would look like: 
```json
{
  "objectID": "1",
  "name": "Bulbasaur",
  "img": "https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/images/001.png",
  "currRank": 1,
  "prevRank": 1,
  "rating": 1500
}
```
Note that the `id` field in the database seed data corresponds to the `objectID` field in the Algolia seed data, and that the `deviation` and `sigma` fields are only included in the database seed data.
### Deploying your own
#### Backend
The backend for this game is a Serverless API that is hosted on Vercel. To deploy the backend, follow these steps:

 1. Fork the repository to your GitHub account.
 2. Open the Vercel dashboard and "Import Project".
 3. Select the [`serverless`](https://github.com/cmgchess/facemash-v2/tree/master/serverless) directory as the source directory.
 4. Set the Environment Variables according to the given [`.env.example`](https://github.com/cmgchess/facemash-v2/blob/master/serverless/.env.example).

#### Frontend
The frontend for this game can also be hosted on Vercel. To deploy the frontend, follow these steps:
 1. Fork the repository to your GitHub account.
 2. Open the Vercel dashboard and "Import Project".
 3. Select the [`frontend`](https://github.com/cmgchess/facemash-v2/tree/master/frontend) directory as the source directory.
 4. Set the Environment Variables according to the given [`.env.example`](https://github.com/cmgchess/facemash-v2/blob/master/frontend/.env.example).

#### Sync server
The sync server for this game can be hosted on [Render](https://render.com/) or any other platform of your choice. The sync server contains 2 endpoints which can be used to automatically update the ratings in the database and Algolia search index, as well as delete any unfinished matches from the database. To deploy the sync server using Render, follow these steps:

 1. Fork the repository to your GitHub account.
 2. Create a new Render project and connect it to your GitHub repository.
 3. Select the [`sync`](https://github.com/cmgchess/facemash-v2/tree/master/sync) directory as the source directory.
 4. Set the Environment Variables according to the given [`.env.example`](https://github.com/cmgchess/facemash-v2/blob/master/sync/.env.example).

#### Setting up Cron Jobs
To automatically call the endpoints of the sync server, you can use a third-party service like [cron-job.org](https://cron-job.org/en/).  
The 2 endpoints will be `https://deployedUrl/sync/rating` and `https://deployedUrl/sync/delete`. Set the desired interval for the cron job. By default, the sync server is set to update the ratings every day at midnight GMT. If you need to change the duration, make sure to update the time difference in the [`sync.js`](https://github.com/cmgchess/facemash-v2/blob/master/sync/controllers/sync.js) file in the `sync/controllers` directory of the repository. 

### Contributing
This project is open-source and contributions are welcome. If you have any suggestions or would like to contribute to the project, please feel free to submit a pull request or open an issue.

### License
FaceMash is an open-source project released under the MIT License.
