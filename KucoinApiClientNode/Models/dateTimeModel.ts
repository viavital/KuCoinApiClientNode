function getDateTimeNow (): string{
   return new Date().toLocaleTimeString() + " " + new Date().toLocaleDateString();
}
export {getDateTimeNow};