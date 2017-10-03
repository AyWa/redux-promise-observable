import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { combineEpics } from 'redux-observable';

const SUCCESS = 'SUCCESS'
const FAILURE = 'FAILURE'

const reduxFormObservable$ = new BehaviorSubject(combineEpics())

export const rxFromObservableEpic = (actions$, store) =>
  reduxFormObservable$.mergeMap(epic =>
    epic(actions$, store),
  )

const createRxFormEpic = (listenner, rxObserver) =>
  action$ =>
    action$.ofType(listenner[0])
      .do(_ => rxObserver.next(SUCCESS))
      .race(
        action$.ofType(listenner[1])
          .do(_ => rxObserver.next(FAILURE)),
      ).ignoreElements()


export const rxFormActionCreator = (action, listenner) => {
  const rxObservable = new Observable(rxObserver => {
    reduxFormObservable$.next(createRxFormEpic(listenner, rxObserver))
  })
  let rxSubscriber
  return (payload, dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch(action(({...payload})))
      rxSubscriber = rxObservable.subscribe((m) => {
        if (m === SUCCESS) {
          resolve()
        } else {
          reject()
        }
      })
    })
    .then(_ => rxSubscriber.unsubscribe())
    .catch(_ => rxSubscriber.unsubscribe())
  }
}
