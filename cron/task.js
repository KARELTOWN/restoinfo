import cron from "node-cron";
let task = cron.schedule(
  "* * * * * *",
  () => {
    console.log("SCHEDULE");
  },
  { scheduled: false }
);
export default task