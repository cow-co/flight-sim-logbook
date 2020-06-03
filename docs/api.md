# REST API `/api` #
- [REST API `/api`](#rest-api-api)
  - [Authentication](#authentication)
  - [`/users`](#users)
    - [`POST /create`](#post-create)
    - [`POST /login` (verified)](#post-login-verified)
    - [`GET /logout` (authenticated, verified)](#get-logout-authenticated-verified)
    - [`GET /verify/send` (authenticated)](#get-verifysend-authenticated)
    - [`GET /verify/:username/:token`](#get-verifyusernametoken)
    - [`POST /change-password` (authenticated, verified)](#post-change-password-authenticated-verified)
    - [`POST /request-reset-password`](#post-request-reset-password)
    - [`POST /reset-password`](#post-reset-password)
    - [`DELETE /delete-user` (authenticated, verified)](#delete-delete-user-authenticated-verified)

## Authentication ##
Set the `Authorization` HTTP Header to `Bearer ${token from /users/login}`

## `/users` ##

### `POST /create` ###

**Request**

- `name`
- `email`
- `password`
- `passwordConfirmation`

**Response**

<ins>Success:</ins>

Status: 201

Body:
- `user`
  - `name`
  - `email`
- `errors` (Array)

<ins>Failures:</ins>

| Status        | Reason        |
| ------------- | ------------- |
| 400           | Invalid request body (user already exists, non-matching password confirmation, etc.) |
| 500           | Unexpected server error      |

### `POST /login` (verified) ###

**Request**

- `name`
- `password`

**Response**

<ins>Success:</ins>

Status: 200

Body:
- `jwt`

<ins>Failures</ins>

| Status        | Reason        |
| ------------- | ------------- |
| 401           | Incorrect credentials, or user email unverified |
| 500           | Unexpected server error      |

### `GET /logout` (authenticated, verified) ###

**Request**
N/A

**Response**
"Successfully Logged Out"

### `GET /verify/send` (authenticated) ###

**Request**
N/A

**Response**
N/A

### `GET /verify/:username/:token` ###

**Request**
N/A

**Response**
N/A

### `POST /change-password` (authenticated, verified) ###


**Request**
- `password`
- `passwordConfirmation`

**Response**
N/A

### `POST /request-reset-password` ###

- `email`

### `POST /reset-password` ###

- `email`
- `password`
- `passwordConfirmation`
- `resetToken`

### `DELETE /delete-user` (authenticated, verified) ###

N/A 
