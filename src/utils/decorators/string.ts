import { removeUnnecessarySpaces } from "../functions/string";

export function TrimmedStringField(): (target: any, key: string) => void {
  return (target: any, key: string) => {
    let value: string | null;

    Object.defineProperty(target, key, {
      get() {
        return value;
      },
      set(newValue: string) {
        value = removeUnnecessarySpaces(newValue);
      },
    });
  };
}
