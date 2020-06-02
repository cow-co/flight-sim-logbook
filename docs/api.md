# REST API `/api` #
- [REST API `/api`](#rest-api-api)
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

// TODO note the return values/status codes
## `/users` ##

### `POST /create` ###

- `name`
- `email`
- `password`
- `passwordConfirmation`

### `POST /login` (verified) ###

- `name`
- `password`

### `GET /logout` (authenticated, verified) ###

N/A

### `GET /verify/send` (authenticated) ###

N/A

### `GET /verify/:username/:token` ###

N/A

### `POST /change-password` (authenticated, verified) ###

- `password`
- `passwordConfirmation`

### `POST /request-reset-password` ###

- `email`

### `POST /reset-password` ###

- `email`
- `password`
- `passwordConfirmation`
- `resetToken`

### `DELETE /delete-user` (authenticated, verified) ###

N/A 
