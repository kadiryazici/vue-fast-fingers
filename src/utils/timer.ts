import type { Option } from '@/types'

export class Timer {
  public readonly initialSeconds: number
  private _time: number
  private _intervalId = -1

  constructor(seconds: number) {
    this.initialSeconds = seconds
    this._time = seconds
  }

  private _updateHooks = new Set<(seconds: number) => void>()
  private _finishHooks = new Set<() => void>()

  public onUpdate(fn: (seconds: number) => void) {
    this._updateHooks.add(fn)
  }

  private justUpdated() {
    this._updateHooks.forEach(hook => hook(this._time))
  }

  private justFinished() {
    this._finishHooks.forEach(hook => hook())
  }

  public onFinish(fn: () => void) {
    this._finishHooks.add(fn)
  }

  private tick() {
    this._time -= 1
    this.justUpdated()

    if (this._time <= 0) {
      clearInterval(this._intervalId)
      this.justFinished()
    }
  }

  public start() {
    clearInterval(this._intervalId)
    this._intervalId = setInterval(this.tick.bind(this), 1000)
  }

  public reset(newSeconds: Option<number> = null) {
    clearInterval(this._intervalId)
    this._time = newSeconds ?? this.initialSeconds
    this.justUpdated()
  }

  public toString() {
    return Timer.toTimeString(this._time)
  }

  public static toTimeString(timeSeconds: number) {
    const minutes = Math.floor(timeSeconds / 60)
    const seconds = timeSeconds % 60

    const minuteLabel = minutes < 10 ? `0${minutes}` : minutes.toString()
    const secondLabel = seconds < 10 ? `0${seconds}` : seconds.toString()

    return `${minuteLabel}:${secondLabel}`
  }
}
