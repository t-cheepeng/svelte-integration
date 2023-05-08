import moment from "moment";

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Expected format: "YYYY-MM-DDTHH:MM:ss.mmm[+|-]HH:MM"
export const convertFullTimestampToReadableDateTime = (fullTimestamp: string) => {
  const datetime = moment(fullTimestamp);
  return datetime.format("Do MMMM YYYY, HH:mm:ss")
}