export type IClassValue = string | undefined | null | false | [string?, boolean?] | { [className: string]: boolean | null | undefined | number };

/**
 * Combines class names into a single string.
 * @param args - The class names to combine.
 * @returns A string of combined class names.
 */
export function cs(...args: IClassValue[]): string {
  return args
    .map((v) => {
      if (Array.isArray(v)) {
        return v[1] ? v[0] : undefined;
      }
      if (v && typeof v === "object") {
        return cs(...Object.keys(v).filter((c) => !!v[c]));
      }
      return v;
    })
    .filter(Boolean)
    .join(" ");
}
export const classSet = cs;
