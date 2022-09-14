# EduTech API

> Backend API for EduTech application, which is a bootcamp directory website

## Usage

Rename "config/config.env.env" to "config/config.env" and update the values/settings to your own

## Install Dependencies

```
npm install
```

## Run App

```
# Run in dev mode
npm run dev

# Run in prod mode
npm start
```

## Database Seeder

To seed the database with users, bootcamps, courses and reviews with data from the "\_data" folder, run

```
# Destroy all data
node seeder -d

# Import all data
node seeder -i
```

## Demo

The API is live at [paras-code-007.github.io/EduTech/](https://paras-code-007.github.io/EduTech/)
Extensive documentation with examples [here](https://documenter.getpostman.com/view/10906996/2s7YYvaNWP)

# EduTech Api

Backend Api for the EduTech application to manage bootcamps, courses, reviews, users and authentication

## Indices

* [Authentication](#authentication)

  * [http://localhost:3000/api/v1/auth/register/verify/4ab37663187802dba0ec5f5dc5698c7b15ebf9ca2436dbf1a942128fcb8b87af](#1-http:localhost:3000apiv1authregisterverify4ab37663187802dba0ec5f5dc5698c7b15ebf9ca2436dbf1a942128fcb8b87af)
  * [http://localhost:3000/api/v1/auth/resetpassword/a002638e353794f994ba99dc745bb24180f58207](#2-http:localhost:3000apiv1authresetpassworda002638e353794f994ba99dc745bb24180f58207)
  * [{{URI}}/api/v1/auth/forgotpassword](#3-{{uri}}apiv1authforgotpassword)
  * [{{URI}}/api/v1/auth/login](#4-{{uri}}apiv1authlogin)
  * [{{URI}}/api/v1/auth/me](#5-{{uri}}apiv1authme)
  * [{{URI}}/api/v1/auth/register](#6-{{uri}}apiv1authregister)
  * [{{URI}}/api/v1/auth/register](#7-{{uri}}apiv1authregister)
  * [{{URI}}/api/v1/auth/register](#8-{{uri}}apiv1authregister)

* [Bootcamps](#bootcamps)

  * [Sample Requests](#1-sample-requests)
  * [dbconnected CRUD requests](#2-dbconnected-crud-requests)
  * [http://localhost:4444/](#3-http:localhost:4444)
  * [http://localhost:5000/](#4-http:localhost:5000)
  * [testing express](#5-testing-express)

* [Courses](#courses)

  * [{{URI}}/api/v1/bootcamps/5d725a1b7b292f5f8ceff788/courses](#1-{{uri}}apiv1bootcamps5d725a1b7b292f5f8ceff788courses)
  * [{{URI}}/api/v1/courses/](#2-{{uri}}apiv1courses)
  * [{{URI}}/api/v1/courses/](#3-{{uri}}apiv1courses)
  * [{{URI}}/api/v1/courses/](#4-{{uri}}apiv1courses)
  * [{{URI}}/api/v1/courses/5d725a4a7b292f5f8ceff789](#5-{{uri}}apiv1courses5d725a4a7b292f5f8ceff789)
  * [{{URI}}/api/v1/courses/5d725a4a7b292f5f8ceff789](#6-{{uri}}apiv1courses5d725a4a7b292f5f8ceff789)
  * [{{URI}}/api/v1/courses/5d725c84c4ded7bcb480eaa0](#7-{{uri}}apiv1courses5d725c84c4ded7bcb480eaa0)

* [Me](#me)

  * [{{URI}}/api/v1/auth/me](#1-{{uri}}apiv1authme)
  * [{{URI}}/api/v1/auth/me](#2-{{uri}}apiv1authme)
  * [{{URI}}/api/v1/auth/me](#3-{{uri}}apiv1authme)

* [Reviews](#reviews)

  * [{{URI}}/api/v1/auth/logout](#1-{{uri}}apiv1authlogout)
  * [{{URI}}/api/v1/bootcamps/5ff3025f1b0fc34f4cb31c78/reviews](#2-{{uri}}apiv1bootcamps5ff3025f1b0fc34f4cb31c78reviews)
  * [{{URI}}/api/v1/bootcamps/5ff3025f1b0fc34f4cb31c78/reviews/](#3-{{uri}}apiv1bootcamps5ff3025f1b0fc34f4cb31c78reviews)
  * [{{URI}}/api/v1/bootcamps/5ff99342244706c0e4d2b6e4/reviews](#4-{{uri}}apiv1bootcamps5ff99342244706c0e4d2b6e4reviews)
  * [{{URI}}/api/v1/reviews/](#5-{{uri}}apiv1reviews)
  * [{{URI}}/api/v1/reviews/5ff89c629aa161b862363dba](#6-{{uri}}apiv1reviews5ff89c629aa161b862363dba)
  * [{{URI}}/api/v1/reviews/5ff99435bd7a08c12d9cad75](#7-{{uri}}apiv1reviews5ff99435bd7a08c12d9cad75)
  * [{{URI}}/api/v1/reviews/5ff9c425648e4ec5a0f6e5ed](#8-{{uri}}apiv1reviews5ff9c425648e4ec5a0f6e5ed)

* [Users(Admin Only)](#users(admin-only))

  * [{{URI}}/api/v1/users](#1-{{uri}}apiv1users)
  * [{{URI}}/api/v1/users](#2-{{uri}}apiv1users)
  * [{{URI}}/api/v1/users/5ff756e0948b1392652e7cbd](#3-{{uri}}apiv1users5ff756e0948b1392652e7cbd)
  * [{{URI}}/api/v1/users/5ff756e0948b1392652e7cbd](#4-{{uri}}apiv1users5ff756e0948b1392652e7cbd)
  * [{{URI}}/api/v1/users/5ff77626d520b29b195d31dd](#5-{{uri}}apiv1users5ff77626d520b29b195d31dd)
  * [{{URI}}/api/v1/users/unverifiedusers](#6-{{uri}}apiv1usersunverifiedusers)
  * [{{URI}}/api/v1/users/unverifiedusers](#7-{{uri}}apiv1usersunverifiedusers)
  * [{{URI}}/api/v1/users?role=User&page=1&limit=1](#8-{{uri}}apiv1users?role=user&page=1&limit=1)


--------


## Authentication
Routes for user authentication including register, login, resetPassword etc



### 1. http://localhost:3000/api/v1/auth/register/verify/4ab37663187802dba0ec5f5dc5698c7b15ebf9ca2436dbf1a942128fcb8b87af


Route to Verify the User and redirect to login


***Endpoint:***

```bash
Method: GET
Type:
URL: {{URI}}/api/v1/auth/register/verify/6273321e5c9fc3941af08112f17901d19874f2bb9493f66d5acf0bbe337daddd
```



### 2. http://localhost:3000/api/v1/auth/resetpassword/a002638e353794f994ba99dc745bb24180f58207


Reset password using the url sent to the mail



***Endpoint:***

```bash
Method: PUT
Type: RAW
URL: http://localhost:3000/api/v1/auth/resetpassword/e3efefad490e2afba281f99019c159b7ee709131
```



***Body:***

```js
{
    "password": "helloworld"
}
```



### 3. {{URI}}/api/v1/auth/forgotpassword


Forgot Password route to generate a resetPassword Token
Generate password token and send Email



***Endpoint:***

```bash
Method: POST
Type: RAW
URL: {{URI}}/api/v1/auth/forgotpassword
```



***Body:***

```js
{
    "email": "johndoe@gmail.com"
}
```



### 4. {{URI}}/api/v1/auth/login


Login a user using email and password


***Endpoint:***

```bash
Method: POST
Type: RAW
URL: {{URI}}/api/v1/auth/login
```



***Body:***

```js
{
    "email": "johndoe@gmail.com",
    "password": "qwertyuiop"
}
```



### 5. {{URI}}/api/v1/auth/me


Get Personal Profile of login User
Loginned Using Authorisation token header or in cookie


***Endpoint:***

```bash
Method: GET
Type:
URL: {{URI}}/api/v1/auth/me
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| Auth | Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmZjIyYTVmN2E0NWQ1MzgzNzUxNzRjZiIsImlhdCI6MTYwOTcwODIwMywiZXhwIjoxNjEyMzAwMjAzLCJhdWQiOiJQdWJsaXNoZXIiLCJpc3MiOiJEZXZjYW1wZXJTZWNBc3NvY2lhdGUiLCJzdWIiOiJzb21lQHVzZXIuY29tIn0.j4keIWAiaMWHkJ_Z9l1RcZI3OMuNh2NuF1U8mjjKUP8 |  |



### 6. {{URI}}/api/v1/auth/register


Register a User and add it into database


***Endpoint:***

```bash
Method: POST
Type: RAW
URL: {{URI}}/api/v1/auth/register
```



***Body:***

```js
{
    "name": "John Doe",
    "email": "johndoe@gmail.com",
    "password": "qwertyuiop",
    "role": "Publisher"
}
```



### 7. {{URI}}/api/v1/auth/register


Register a User



***Endpoint:***

```bash
Method: POST
Type: RAW
URL: {{URI}}/api/v1/auth/register
```



***Body:***

```js
{
    "name": "Jane Dane",
    "email": "janedane@gmail.com",
    "password": "asdfghjkl",
    "role": "User"
}
```



### 8. {{URI}}/api/v1/auth/register


Register another user



***Endpoint:***

```bash
Method: POST
Type: RAW
URL: {{URI}}/api/v1/auth/register
```



***Body:***

```js
{
    "name": "Sara Kensing",
    "email": "sara@gmail.com",
    "role": "User",
    "password": "12345678"
}
```



## Bootcamps
Bootcamps CRUD functionality



### 1. Sample Requests



***Endpoint:***

```bash
Method:
Type:
URL:
```



### 2. dbconnected CRUD requests



***Endpoint:***

```bash
Method:
Type:
URL:
```



### 3. http://localhost:4444/



***Endpoint:***

```bash
Method: GET
Type:
URL: http://localhost:4444/
```



### 4. http://localhost:5000/



***Endpoint:***

```bash
Method: GET
Type:
URL: http://localhost:4444/
```



### 5. testing express



***Endpoint:***

```bash
Method:
Type:
URL:
```



## Courses
Create, Read, Update, and Delete courses



### 1. {{URI}}/api/v1/bootcamps/5d725a1b7b292f5f8ceff788/courses


get courses in a specefic bootcamp


***Endpoint:***

```bash
Method: GET
Type:
URL: {{URI}}/api/v1/bootcamps/5d725a1b7b292f5f8ceff788/courses
```



### 2. {{URI}}/api/v1/courses/


get all courses in database



***Endpoint:***

```bash
Method: GET
Type:
URL: {{URI}}/api/v1/courses/
```



### 3. {{URI}}/api/v1/courses/



***Endpoint:***

```bash
Method: GET
Type:
URL: {{URI}}/api/v1/courses
```



***Query params:***

| Key | Value | Description |
| --- | ------|-------------|
| page | 2 |  |
| limit | 2 |  |



### 4. {{URI}}/api/v1/courses/



***Endpoint:***

```bash
Method: GET
Type:
URL: {{URI}}/api/v1/courses
```



***Query params:***

| Key | Value | Description |
| --- | ------|-------------|
| select | title,description |  |



### 5. {{URI}}/api/v1/courses/5d725a4a7b292f5f8ceff789


update a single course with given id


***Endpoint:***

```bash
Method: PUT
Type: RAW
URL: {{URI}}/api/v1/courses/5d725a4a7b292f5f8ceff789
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/json | Json Body type |



***Body:***

```js
{
    "tuition": 14000,
    "minimumSkill": "advanced"
}
```



### 6. {{URI}}/api/v1/courses/5d725a4a7b292f5f8ceff789


add a course corresponding to a specefic bootcamp


***Endpoint:***

```bash
Method: POST
Type: RAW
URL: {{URI}}/api/v1/bootcamps/5d725a1b7b292f5f8ceff788/courses
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/json | Json Body type |



***Body:***

```js
{
    "title": "Full Stack Web Dev",
    "description": "In this course you will learn all about the front end with HTML, CSS and JavaScript. You will master tools like Git and Webpack and also learn C# and ASP.NET with Postgres",
    "weeks": 10,
    "tuition": 12000,
    "minimumSkill": "intermediate",
    "scholarhipsAvailable": true
}
```



### 7. {{URI}}/api/v1/courses/5d725c84c4ded7bcb480eaa0


delete a course with specefic Id



***Endpoint:***

```bash
Method: DELETE
Type:
URL: {{URI}}/api/v1/courses/5d725c84c4ded7bcb480eaa0
```



## Me



### 1. {{URI}}/api/v1/auth/me


Delete Me
Delete current logged in user


***Endpoint:***

```bash
Method: DELETE
Type: RAW
URL: {{URI}}/api/v1/auth/me
```



***Body:***

```js
{
    "email": "johndoe@gmail.com",
    "password": "qwertyuiop"
}
```



### 2. {{URI}}/api/v1/auth/me


Get Me
get my profile details


***Endpoint:***

```bash
Method: GET
Type:
URL: {{URI}}/api/v1/auth/me
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| Auth | Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmZjIyYTVmN2E0NWQ1MzgzNzUxNzRjZiIsImlhdCI6MTYwOTcwODIwMywiZXhwIjoxNjEyMzAwMjAzLCJhdWQiOiJQdWJsaXNoZXIiLCJpc3MiOiJEZXZjYW1wZXJTZWNBc3NvY2lhdGUiLCJzdWIiOiJzb21lQHVzZXIuY29tIn0.j4keIWAiaMWHkJ_Z9l1RcZI3OMuNh2NuF1U8mjjKUP8 |  |



### 3. {{URI}}/api/v1/auth/me


Update user profile details


***Endpoint:***

```bash
Method: PUT
Type: RAW
URL: {{URI}}/api/v1/auth/me
```



***Body:***

```js
{
    "name": "Sara Kensing",
    "email": "sara@gmail.com",
    "role": "user",
    "password": "12345678"
}
```



## Reviews



### 1. {{URI}}/api/v1/auth/logout


Logout the user(clear cookies)


***Endpoint:***

```bash
Method: GET
Type:
URL: {{URI}}/api/v1/auth/logout
```



### 2. {{URI}}/api/v1/bootcamps/5ff3025f1b0fc34f4cb31c78/reviews


Add a new review by user and admin only


***Endpoint:***

```bash
Method: POST
Type: RAW
URL: {{URI}}/api/v1/bootcamps/5ff99342244706c0e4d2b6e4/reviews
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/json | Json Body type |



***Body:***

```js
{
    "title": "Great bootcampss",
    "body": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec viverra feugiat mauris id viverra. Duis luctus ex sed facilisis ultrices. Curabitur scelerisque bibendum ligula, sssquis condimentum libero fermentum in. Aenean erat erat, aliquam in purus a, rhoncus hendrerit tellus. Donec accumsan justo in felis consequat sollicitudin. Fusce luctus mattis nunc vitae maximus. Curabitur semper felis eu magna laoreet scelerisque",
    "rating": "7"
}
```



### 3. {{URI}}/api/v1/bootcamps/5ff3025f1b0fc34f4cb31c78/reviews/


Get all reviews for a specefic bootcamp


***Endpoint:***

```bash
Method: GET
Type:
URL: {{URI}}/api/v1/bootcamps/5ff3025f1b0fc34f4cb31c78/reviews/
```



### 4. {{URI}}/api/v1/bootcamps/5ff99342244706c0e4d2b6e4/reviews


Add Review of a bootcamp


***Endpoint:***

```bash
Method: POST
Type: RAW
URL: {{URI}}/api/v1/bootcamps/5ff99342244706c0e4d2b6e4/reviews
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/json | Json Body type |



***Body:***

```js
{
    "title": "Not worth the money",
    "body": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec viverra feugiat mauris id viverra. Duis luctus ex sed facilisis ultrices. Curabitur scelerisque bibendum ligula, quis condimentum libero fermentum in. Aenean erat erat, aliquam in purus a, rhoncus hendrerit tellus. Donec accumsan justo in felis consequat sollicitudin. Fusce luctus mattis nunc vitae maximus. Curabitur semper felis eu magna laoreet scelerisque",
    "rating": "5"
}
```



### 5. {{URI}}/api/v1/reviews/


Get all reviews


***Endpoint:***

```bash
Method: GET
Type:
URL: {{URI}}/api/v1/reviews/
```



### 6. {{URI}}/api/v1/reviews/5ff89c629aa161b862363dba


Get information about a single specefic review


***Endpoint:***

```bash
Method: GET
Type:
URL: {{URI}}/api/v1/reviews/5ff89c629aa161b862363dba
```



### 7. {{URI}}/api/v1/reviews/5ff99435bd7a08c12d9cad75


Update a review(Restricted to change only rating name and body)


***Endpoint:***

```bash
Method: PUT
Type: RAW
URL: {{URI}}/api/v1/reviews/5ff9c3e8648e4ec5a0f6e5ec
```



***Body:***

```js
{
    "user": "5ff99a6b46adb7c20e5d8918",
    "bootcamp": "5d725a037b292f5f8ceff787",
    "title": "Hello world"
}
```



### 8. {{URI}}/api/v1/reviews/5ff9c425648e4ec5a0f6e5ed


User can delete their own review


***Endpoint:***

```bash
Method: DELETE
Type:
URL: {{URI}}/api/v1/reviews/5ff9c425648e4ec5a0f6e5ed
```



## Users(Admin Only)



### 1. {{URI}}/api/v1/users


Create a user (admin only)


***Endpoint:***

```bash
Method: POST
Type: RAW
URL: {{URI}}/api/v1/users
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/json | Json Body type |



***Body:***

```js
{
    "name": "Sara Kensing",
    "email": "sara@gmail.com",
    "role": "User",
    "password": "12345678",
    "verifyStatus": true
}
```



### 2. {{URI}}/api/v1/users


Get all users (admin only)


***Endpoint:***

```bash
Method: GET
Type:
URL: {{URI}}/api/v1/users
```



### 3. {{URI}}/api/v1/users/5ff756e0948b1392652e7cbd


Update any user details even his email and password (admin only)


***Endpoint:***

```bash
Method: PUT
Type: RAW
URL: {{URI}}/api/v1/users/5ff756e0948b1392652e7cbd
```



***Body:***

```js
{
    "email": "hello@world.com",
    "password": "hello12345",
    "role": "Publisher"
}
```



### 4. {{URI}}/api/v1/users/5ff756e0948b1392652e7cbd


Delete any single user (admin only)


***Endpoint:***

```bash
Method: DELETE
Type:
URL: {{URI}}/api/v1/users/5ff756e0948b1392652e7cbd
```



### 5. {{URI}}/api/v1/users/5ff77626d520b29b195d31dd


get a single user given id (admin only)


***Endpoint:***

```bash
Method: GET
Type:
URL: {{URI}}/api/v1/users/5ff77626d520b29b195d31dd
```



### 6. {{URI}}/api/v1/users/unverifiedusers


Get all unverified users


***Endpoint:***

```bash
Method: GET
Type:
URL: {{URI}}/api/v1/users/unverifiedusers
```



### 7. {{URI}}/api/v1/users/unverifiedusers


Delete all unverified users


***Endpoint:***

```bash
Method: DELETE
Type:
URL: {{URI}}/api/v1/users/unverifiedusers
```



### 8. {{URI}}/api/v1/users?role=User&page=1&limit=1


Get all users details (Admin Only)


***Endpoint:***

```bash
Method: GET
Type:
URL: {{URI}}/api/v1/users
```



***Query params:***

| Key | Value | Description |
| --- | ------|-------------|
| role | User |  |
| page | 1 |  |
| limit | 1 |  |



---
[Back to top](#edutech-api)
> Made with &#9829; by [thedevsaddam](https://github.com/thedevsaddam) | Generated at: 2021-01-09 23:05:44 by [docgen](https://github.com/thedevsaddam/docgen)
