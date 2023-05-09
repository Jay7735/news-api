Setting up .env variables

In order to be able to connect to the two databases locally, two .env files need to be created; a test file and a development file. They should reference the test database and development database respectively. 

.env.test should contain:
PGDATABASE=nc_news_test

.env.development should contain:
PGDATABASE=nc_news