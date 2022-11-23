### example

```javascript
import Schedule from './Schedule';

Schedule()
  .call(() => {
    // say hello on mondays
  })
  .weekly()
  .mondays()
  .at('13:00')
  .run();

Schedule().command('npm -v').everyThirtyMinutes().run();
```

### Schedule Frequencies

| Method                      | Description                                      |
| --------------------------- | ------------------------------------------------ |
| `.cron('* * * * *');`       | Run the task on a custom Cron schedule           |
| `.everyTenSecond();`        | Run the task every ten second                    |
| `.everyThirtySecond();`     | Run the task every thirty second                 |
| `.everyFortySecond();`      | Run the task every forty second                  |
| `.everyMinute();`           | Run the task every minute                        |
| `.everyTwoMinutes();`       | Run the task every 2 minute                      |
| `.everyThreeMinutes();`     | Run the task every 3 minute                      |
| `.everyFourMinutes();`      | Run the task every 4 minute                      |
| `.everyFiveMinutes();`      | Run the task every 5 minute                      |
| `.everyTenMinutes();`       | Run the task every 10 minute                     |
| `.everyThirtyMinutes();`    | Run the task every 30 minute                     |
| `.everyFourtyFiveMinutes();`| Run the task every 45 minute                     |
| `.everyFifteenMinutes();`   | Run the task every 50 minutes                    |
| `.hourly();`                | Run the task every hour                          |
| `.hourlyAt(17);`            | Run the task every hour at 17 mins past the hour |
| `.daily();`                 | Run the task every day at midnight               |
| `.dailyAt('13:00');`        | Run the task every day at 13:00                  |
| `.twiceDaily(1, 13);`       | Run the task daily at 1:00 & 13:00               |
| `.weekly();`                | Run the task every week                          |
| `.weeklyOn(1, '8:00');`     | Run the task every week on Tuesday at 8:00       |
| `.monthly();`               | Run the task every month                         |
| `.monthlyOn(4, '15:00');`   | Run the task every month on the 4th at 15:00     |
| `.quarterly();`             | Run the task every quarter                       |
| `.yearly();`                | Run the task every year                          |
| `.weekdays();`              | Limit the task to weekdays                       |
| `.sundays();`               | Limit the task to Sunday                         |
| `.mondays();`               | Limit the task to Monday                         |
| `.tuesdays();`              | Limit the task to Tuesday                        |
| `.wednesdays();`            | Limit the task to Wednesday                      |
| `.thursdays();`             | Limit the task to Thursday                       |
| `.fridays();`               | Limit the task to Friday                         |
| `.saturdays();`             | Limit the task to Saturday                       |

link to laravel task Schedule doc : [task Schedule](https://laravel.com/docs/9.x/scheduling)

### Methods

| Method                    | Description                                     |
| ------------------------- | ----------------------------------------------- |
| `.call(function)`         | pass a callback which will triggered            |
| `.command(string/array);` | pass cli commands as string or array of strings |
| `.run();`                 | call this at the end of the chain to initiate.  |

### Adapters

`schedule` will use `node-cron` as default adapter.

### Monitor the Scheduled Executions

If you want to keep an eye on every execution and make sure they succeed or fail, or even if they execute at all, or make a report of each, you can:

```javascript
schedule()
  .command('npm run clean_trash', (error) => {
    if (error) {
      // Handle the error
    } else {
      // Report the success
    }
  })
  .everyThirtyMinutes()
  .run();
```
