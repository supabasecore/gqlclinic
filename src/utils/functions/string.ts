export function removeUnnecessarySpaces(
    inputString: string | null
  ): string | null {
    if (inputString !== null && inputString !== undefined) {
      return inputString.trim().replace(/\s+/g, " ");
    } else {
      return inputString;
    }
  }
  