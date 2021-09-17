# Seller-Partner-API
Node.JS wrapper for Amazon Seller Partner API

## Project setup
**1 - Navigate to the project's directory.**

**2 - Install dependencies:**
```
npm install
```

**3 - Fix environment:**

###(a): If running on the cloud or locally, add `.env` file in the project's root directory, with the following structure:
```
NODE_ENV=
DB_USERNAME=
DB_PASSWORD=
DB_NAME=
DB_CLUSTER=
```
where:
- NODE_ENV describes the environment, i.e. `dev`/`test`/`staging`/`production`/`container`
- And the rest of the variables will describe the Mongo DB/Cluster connection

**4 - Run the app locally:**

```
npm run start
```

- Keep an eye on the console, as it will throw an error if you are not able to connect to the Mongo cluster and messages for the synchronization process.


## Requirements

- Node: version 14
- MongoDB: > version 4
- Install the rest of the dependencies from `package.json`

## Existing API Routes

- You can now make API calls to `http://localhost:3000`. 

### Final notes

- **Running Locally:** If you are running both the front end and the API from your local machine, make sure to have two separate terminals running each repository. While having that, You can simply navigate to `http://localhost:8080` and use the App [to register a new User and log them in], or hit the API locally through HTTP at `http://localhost:3000`.

- **Running on Containers** If you are running this with Docker, you will need to create a `Docker-compose.yml` in the parent directory of both repositories (front end and the API).
  So, if the FrontEnd is in `himmelsbach/conqueramazon-fe` and the API is in `himmelsbach/conqueramazon-api`, your Docker-compose will need to be in the `himmelsbach` directory. Additionally, make sure to name the directories as stated (`conqueramazon-fe` and `conqueramazon-api`), and correctly update the environment variables in the docker-compose file.
  - **A template of the Docker Compose file can be found below:**

```docker
version: "3"
services:
    mongo-db:
        container_name: mongo-container
        image: mongo
        restart: always
        volumes:
            - ./db:/data/db
        ports:
            - "27017:27017"
        networks:
            - conqueramazon
    api:
        container_name: conqueramazon-api
        build: ./conqueramazon-api
        restart: always
        ports:
            - 3000:3000
        volumes:
            - ./conqueramazon-api:/data
        environment:
            NODE_ENV: "container"
            DB_USERNAME: 
            DB_NAME: 
            DB_PASSWORD: 
            DB_CLUSTER_NAME: 
        depends_on: 
            - mongo-db
        networks:
            - conqueramazon
    app:
        container_name: conqueramazon-fe
        build: ./conqueramazon-fe
        restart: always
        depends_on:
            - api
        ports:
            - 8080:80
        environment:
            NODE_ENV: "container"
            VUE_APP_API_ENDPOINT: "http://localhost:3000"
        volumes:
            - ./conqueramazon-fe:/data
        networks:
            - conqueramazon
networks:
    conqueramazon:
        driver: bridge   
```
