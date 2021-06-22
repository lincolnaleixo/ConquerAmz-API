# Seller-Partner-API
Node.JS wrapper for Amazon Seller Partner API

## Project setup
1 - Navigate to the project's directory.
2 - Install dependencies:
```
npm install
```
3 - Add `.env` file in the project's root directory, with the following structures:
```
NODE_ENV=
SELLING_PARTNER_APP_CLIENT_ID=
SELLING_PARTNER_APP_CLIENT_SECRET=
AWS_SELLING_PARTNER_ACCESS_KEY_ID=
AWS_SELLING_PARTNER_SECRET_ACCESS_KEY=
AWS_SELLING_PARTNER_ROLE=

AWS_REFRESH_TOKEN=
AWS_MARKETPLACE_ID=
```
where:
- NODE_ENV describes the environment, i.e. dev/test/staging/production/container
- The rest of the variables are used to initiate the SellingPartners instance with the self-authorization method (for ConquerAmazon)

4 - Add database variables to connect to Mongo Atlas Cluster:

```
DB_USERNAME=
DB_PASSWORD=
DB_NAME=
DB_CONTAINER_STRING=
```

**NB**:
- If you're running the repo with Docker, put `container` as `NODE_ENV`

5 - Run the app locally:

```
npm run start
```

Keep an eye on the console, as it will throw an error if you are not able to connect to the Mongo cluster.


- You can now make API calls to `http://localhost:3000`. Below are the descriptions for 4 routes added to the API:

-- `http://localhost:3000/` -> a test GET call that returns a simple message when the Express API is running
-- `http://localhost:3000/api/user/register` -> a POST call with the following body:

```
{
    "name": "",
    "email": "",
    "password": ""
}
```

-- `http://localhost:3000/api/user/login` -> a POST call to log the User in, with the following body:

```
{
    "email": "",
    "password": ""
}
```

-- `http://localhost:3000/api/user/me` -> a GET call that returns the User data, i.e. Email, ID and Token. This is an **authenticated** call, so in order to get a proper response, you will need to add an Authentication Bearer token in the request header. This token can be found from the `login` API response above.

### Final notes
- There are currently two collections in the DB: `users` and `userconfigs`. The first collection contains some test User data, while the latter is being used for developing the next functionality [adding the AWS configurations for each user].
- If you are running both the front end and the API from your local machine, make sure to have two separate terminals running each repository. If you are using this approach, then you can simply navigate to `http://localhost:8080` and use the App [to register a new User and log them in].
- If you are running this with Docker, you will need to create a `Docker-compose.yml` in the parent directory of both repos. So, if the FE is in `himmelsbach/conqueramazon-fe` and the API is in `himmelsbach/conqueramazon-api`, your Docker-compose will need to be in the `himmelsbach` directory. Additionally, if using this approach, make sure to name the directories as stated here, and correctly update the environment variables.
