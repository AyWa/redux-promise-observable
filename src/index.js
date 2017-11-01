import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { combineEpics } from 'redux-observable';

const SUCCESS = 'SUCCESS'
const FAILURE = 'FAILURE'

const reduxFormObservable$ = new BehaviorSubject(combineEpics())

export const reduxPromiseObservableEpic = (actions$, store) =>
  reduxFormObservable$.mergeMap(epic =>
    epic(actions$, store),
  )

const createListennerEpic = (listenner, rxObserver) =>
  action$ =>
    action$.ofType(listenner[0])
      .do(({payload}) => rxObserver.next({type: SUCCESS, payload}))
      .race(
        action$.ofType(listenner[1])
          .do(({payload}) => rxObserver.next({type: FAILURE, payload})),
      ).ignoreElements()


export const promiseActionCreator = (action, listenner) => {
  const rxObservable = new Observable(rxObserver => {
    reduxFormObservable$.next(createListennerEpic(listenner, rxObserver))
  })
  let rxSubscriber
  return (payload, dispatch) =>
    new Promise((resolve, reject) => {
      dispatch(action(({...payload})))
      rxSubscriber = rxObservable.subscribe(({type, payload}) => {
        if (type === SUCCESS) {
          resolve(payload)
        } else {
          reject(payload)
        }
        rxSubscriber.unsubscribe();
      })
    })
}
