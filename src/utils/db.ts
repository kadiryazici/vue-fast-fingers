import localforage, { INDEXEDDB } from 'localforage'

export interface TestHistoryItem {
  correctCount: number
  wrongCount: number
  seconds: number
  date: number
}

export const historyDb = localforage.createInstance({
  driver: INDEXEDDB,
  version: 1,
  name: 'histories',
})
