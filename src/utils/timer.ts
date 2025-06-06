export class GameTimer {
  private timer: number | null = null;
  private startTime: number = 0;
  private currentTime: number = 0;

  startTimer(callback: (time: number) => void) {
    if (this.timer) return;
    this.startTime = Date.now() - this.currentTime;
    this.timer = window.setInterval(() => {
      this.currentTime = Math.floor((Date.now() - this.startTime) / 1000);
      callback(this.currentTime);
    }, 1000);
  }

  stopTimer() {
    if (this.timer) {
      window.clearInterval(this.timer);
      this.timer = null;
    }
  }

  resetTimer() {
    this.stopTimer();
    this.currentTime = 0;
    this.startTime = 0;
  }

  getCurrentTime(): number {
    return this.currentTime;
  }
} 