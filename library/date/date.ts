export const time = (timeString?: string) =>
  timeString ? new Date(timeString) : new Date();
