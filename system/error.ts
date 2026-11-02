export class GyrominaError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GyrominaError";
  }
}