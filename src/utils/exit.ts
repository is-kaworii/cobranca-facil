export function exit(ms: number): void {
  setTimeout(() => {
    process.exit(1);
  }, ms);
}