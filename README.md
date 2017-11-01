# Redux-Promise-Observable   
## Install
`npm i redux-observable-promise`   
or `yarn add redux-observable-promise`   
## Goal
The goal of redux-promise-observable is to return a promise while dispatching an action. Then resolve/reject this promise when a choosen action has been dispatch.   
It can be use for example for redux-form submit function etc.
## Dependencies
- redux-observable
- rxjs
## Doc
### Setup
you just need to add `reduxPromiseObservableEpic` to your rootEpics
```
import { createEpicMiddleware, combineEpics } from 'redux-observable';
import {reduxPromiseObservableEpic} from 'redux-observable-promise'
export default createEpicMiddleware(
  combineEpics(
    // your other epics
    reduxPromiseObservableEpic,
  )
)
```
## Helper function
redux-promise-observable is composed of 1 helper function:
- promiseActionCreator
### promiseActionCreator(actionCreator, listenner)  
#### Return value
`promiseActionCreator(actionCreator, listenner)`   
return a promise. You can do what ever you want with it.
 - `.catch(p => //your logic)` p will be the payload of the error listenner (see below)
 - `.then(p => //your logic)` p will be the payload of the success listenner (see below)
#### Parameters
- actionCreator is a normal action creator like:
```
actionCreator = (payload) => ({
  type: 'ACTION',
  payload,
})
```
or `createAction(ACTION)` if you are using `createAction` package

- listenner is an array which has to contain an ACTION TYPE when the promise has to be resolve, and the ACTION TYPE when the promise has to be reject. like:
```
[ACTION_TYPE_SUCCEED, ACTION_TYPE_FAILURE]
```
#### Full example:
```
import {promiseActionCreator} from 'redux-observable-promise'
loginActionRequest = (payload) => ({
  type: 'LOGIN_REQUEST',
  payload,
)}
export const loginRequest = promiseActionCreator(
  loginActionRequest,
  ['LOGIN_SUCCESS', 'LOGIN_FAILURE'],
)
```
## Inspiration:
- `redux-form-saga` : https://github.com/mhssmnn/redux-form-saga (I used it when I was using redux-sagas)
