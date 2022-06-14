export enum PERFORMANCES {
  HIGH = "HIGH",
  MEDIUM = "MEDIUM",
  LOW = "LOW",
}

export enum FPS_BREAKPOINTS {
  HIGH = 30,
  MEDIUM = 20,
  LOW = 10,
}

class PerformanceWatcher {
  protected _tick: number = 0
  protected _startTime: number = 0
  protected _times = []
  protected _fpsMin: number = 20
  protected _fps: number = 0
  protected _fpsSum: number = 0
  protected _averageFps: number = 0
  protected _lastAverageFps: number = 0
  protected _framesTestLength: number = 200

  private _isDebugging: boolean = false
  private _dom: HTMLElement

  private _performances: string = PERFORMANCES.HIGH

  private _isLow: boolean = false
  constructor() {
    this.reset()
    window.addEventListener("keypress", (e) => {
      if (e.key === "f") {
        this._debug()
      }
    })
  }

  private _debug() {
    if (this._isDebugging) return

    this._isDebugging = true

    this._dom = document.createElement("div")
    document.body.appendChild(this._dom)
    this._dom.style.position = "absolute"
    this._dom.style.zIndex = "1000"
    this._dom.style.bottom = "10px"
    this._dom.style.left = "10px"
    this._dom.style.color = "white"
    this._dom.style.fontSize = "20px"
    ;(window as any).Stats = (window as any).Stats || {}
    ;(function () {
      var script = document.createElement("script")
      script.onload = function () {
        var stats = new (window as any).Stats()
        document.body.appendChild(stats.dom)
        requestAnimationFrame(function loop() {
          stats.update()
          requestAnimationFrame(loop)
        })
      }
      script.src = "//mrdoob.github.io/stats.js/build/stats.min.js"
      document.head.appendChild(script)
    })()
  }

  public reset() {
    this._tick = 0
    this._fps = 0
    this._fpsSum = 0
    this._averageFps = 0
    this._times = []
  }
  public start() {
    this._startTime = (performance || Date).now()

    if (this._tick % this._framesTestLength === 0) {
      this._lastAverageFps = this._averageFps
      this.reset()
    }
  }
  public end() {
    const now = (performance || Date).now()
    this._tick += 1

    if (this._times[0] < now - 1000) {
      if (this._dom) {
        this._dom.innerText = `fps: ${this._fps} - average: ${this._averageFps}`
      }
    }

    while (this._times.length > 0 && this._times[0] <= now - 1000) {
      this._times.shift()
    }
    this._times.push(now)
    this._fps = this._times.length
    this._fpsSum += this._fps
    this._averageFps = Math.round(this._fpsSum / this._tick)
  }

  public get isLow(): boolean {
    const isLow = (this._lastAverageFps || this._averageFps) < this._fpsMin
    this._isLow = this._isLow || isLow

    return this._isLow
  }

  public get performances(): string {
    const fps = this._lastAverageFps || this._averageFps

    if (fps > FPS_BREAKPOINTS.HIGH) {
      this._performances = PERFORMANCES.HIGH
    } else if (fps > FPS_BREAKPOINTS.MEDIUM) {
      this._performances = PERFORMANCES.MEDIUM
    } else {
      this._performances = PERFORMANCES.LOW
    }

    return this._performances
  }
}

export default PerformanceWatcher
