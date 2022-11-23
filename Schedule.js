import cron from 'node-cron'
import childProcess from 'child_process'

const adapter = (data) => cron.schedule(data.expression, data.callback)

const shellExec = (cmd, cb) => {
  // this would be way easier on a shell/bash script :P
  // fix for windows
  if (!cmd.includes('npm.cmd')) {
    cmd = cmd.replace('npm', /^win/.test(process.platform) ? 'npm.cmd' : 'npm')
  }
  const parts = cmd.split(/\s+/g)
  const p = childProcess.spawn(parts[0], parts.slice(1), {
    stdio: 'inherit',
    windowsHide: true
  })

  p.on('exit', (code) => {
    let err = null

    if (code) {
      err = new Error(
        `command "${cmd}" exited with wrong status code "${code}"`
      )
      err.code = code
      err.cmd = cmd
    }
    if (cb) {
      cb(err)
    }
  })
}

class Schedule {
  constructor () {
    this.expression = '* * * * * *'
    this.callback = () => { }
  }

  everyTenSecond () {
    return this.spliceIntoPosition(1, '*/10')
  }

  everyThirtySecond () {
    return this.spliceIntoPosition(1, '*/30')
  }

  everyFortySecond () {
    return this.spliceIntoPosition(1, '*/40')
  }

  everyMinute () {
    return this.spliceIntoPosition(1, 0).spliceIntoPosition(2, '*/1')
  }

  everyTwoMinutes () {
    return this.spliceIntoPosition(1, 0).spliceIntoPosition(2, '*/2')
  }

  everyThreeMinutes () {
    return this.spliceIntoPosition(1, 0).spliceIntoPosition(2, '*/3')
  }

  everyFourMinutes () {
    return this.spliceIntoPosition(1, 0).spliceIntoPosition(2, '*/4')
  }

  everyFiveMinutes () {
    return this.spliceIntoPosition(1, 0).spliceIntoPosition(2, '*/5')
  }

  everyTenMinutes () {
    return this.spliceIntoPosition(1, 0).spliceIntoPosition(2, '*/10')
  }

  everyThirtyMinutes () {
    return this.spliceIntoPosition(1, 0).spliceIntoPosition(2, '*/30')
  }

  everyFourtyFiveMinutes () {
    return this.spliceIntoPosition(1, 0).spliceIntoPosition(2, '*/45')
  }

  everyFifteenMinutes () {
    return this.spliceIntoPosition(1, 0).spliceIntoPosition(2, '*/15')
  }

  hourly () {
    return this.spliceIntoPosition(1, 0).spliceIntoPosition(2, 0).spliceIntoPosition(3, '*/1')
  }

  hourlyAt (offset) {
    return this.spliceIntoPosition(1, offset)
  }

  daily () {
    return this.spliceIntoPosition(1, 0).spliceIntoPosition(2, 0)
  }

  dailyAt (time) {
    const segments = time.split(':')

    return this.spliceIntoPosition(1, Number(segments[0])).spliceIntoPosition(
      2,
      segments.length === 2 ? Number(segments[0]) : '0'
    )
  }

  twiceDaily (first = 1, second = 13) {
    const hours = `${first},${second}`

    return this.spliceIntoPosition(1, 0).spliceIntoPosition(2, hours)
  }

  weekdays () {
    return this.spliceIntoPosition(6, '1-5')
  }

  weekends () {
    return this.spliceIntoPosition(6, '0,6')
  }

  mondays () {
    return this.days(1)
  }

  tuesdays () {
    return this.days(2)
  }

  wednesdays () {
    return this.days(3)
  }

  thursdays () {
    return this.days(4)
  }

  fridays () {
    return this.days(5)
  }

  saturdays () {
    return this.days(6)
  }

  sundays () {
    return this.days(0)
  }

  weekly () {
    return this.spliceIntoPosition(1, 0)
      .spliceIntoPosition(2, 0)
      .spliceIntoPosition(5, 0)
  }

  weeklyOn (day, time = '0:0') {
    this.dailyAt(time)
    return this.spliceIntoPosition(5, day)
  }

  monthly () {
    return this.spliceIntoPosition(1, 0)
      .spliceIntoPosition(2, 0)
      .spliceIntoPosition(3, 1)
  }

  monthlyOn (day = 1, time = '0:0') {
    this.dailyAt(time)
    return this.spliceIntoPosition(3, day)
  }

  twiceMonthly (first = 1, second = 16) {
    const days = `${first},${second}`

    return this.spliceIntoPosition(1, 0)
      .spliceIntoPosition(2, 0)
      .spliceIntoPosition(3, days)
  }

  quarterly () {
    return this.spliceIntoPosition(1, 0)
      .spliceIntoPosition(2, 0)
      .spliceIntoPosition(3, 1)
      .spliceIntoPosition(4, '1-12/3')
  }

  yearly () {
    return this.spliceIntoPosition(1, 0)
      .spliceIntoPosition(2, 0)
      .spliceIntoPosition(3, 1)
      .spliceIntoPosition(4, 1)
  }

  days (value) {
    let days

    if (Array.isArray(value)) {
      days = value.join(',')
    } else {
      days = Object.keys(value).map((key) => value[key])
    }

    return this.spliceIntoPosition(6, days)
  }

  spliceIntoPosition (position, value) {
    const segments = this.expression.split(' ')

    segments[Number(position) - 1] = value
    return this.cron(segments.join(' '))
  }

  timezone (timezone) {
    this.timezone = timezone
    return this
  }

  call (callback = () => { }) {
    this.callback = callback
    return this
  }

  cron (expression) {
    this.expression = expression
    return this
  }

  command (commands, callback) {
    this.callback = () => {
      if (Array.isArray(commands)) {
        const execNext = function () {
          shellExec(commands.shift(), (err) => {
            if (err) {
              callback(err)
            } else if (commands.length) {
              execNext()
            } else {
              callback(null)
            }
          })
        }

        execNext()
        return
      }
      shellExec(commands, callback)
    }
    return this
  }

  run () {
    return adapter({
      expression: this.expression,
      callback: this.callback,
      timezone: this.timezone
    })
  }
};


export default () => new Schedule()
