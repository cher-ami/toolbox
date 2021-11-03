class ScrollLockService {
  _isLocked = false;

  public preventDefault(e) {
    e.preventDefault();
  }

  public lock() {
    // Stop if already locked
    if (this._isLocked) return;
    document.body.addEventListener("touchmove", this.preventDefault, {
      passive: false,
    });
    this._isLocked = true;
  }

  public unlock() {
    // Stop if already unlocked
    if (!this._isLocked) return;
    document.body.removeEventListener("touchmove", this.preventDefault);
    this._isLocked = false;
  }
}

export const scrollLockService = new ScrollLockService();
