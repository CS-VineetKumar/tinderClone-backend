# TinderClone API

## Auth Router
- POST /signUp
- POST /logOut
- POST /login

## Profile Router
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

## Connection Request Router
- POST /request/send/:status/:userId
- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId

## User Router
- GET /user/connections
- GET /user/request
- GET /user/feed