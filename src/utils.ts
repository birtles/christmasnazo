/**
 * A variant on Pick that excludes the listed members from T.
 */
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

/**
 * Intersection of T & U but with the types of U being used where they overlap.
 */
export type Overwrite<T, U> = Omit<T, Extract<keyof T, keyof U>> & U;

/**
 * A helper to strip certain fields from an object.
 */
export function stripFields<T extends object, K extends keyof T>(
  o: T,
  fields: K[]
): Omit<T, K> {
  const result: Partial<T> = { ...(<object>o) };
  for (const field of fields) {
    delete result[field];
  }
  return <Omit<T, K>>result;
}

/**
 * Generates a unique ID that should at least roughly reflect the current
 * timestamp such that subsequent calls to this produce IDs that are in
 * ascending order.
 */
let prevTimeStamp = 0;
export const generateUniqueTimestampId = (): string => {
  // Start off with the number of milliseconds since 1 Jan 2016.
  let timestamp = Date.now() - Date.UTC(2016, 0, 1);

  // We need to make sure we don't overlap with previous records however.
  // If we do, we just keep incrementing the timestamp---that might mean the
  // sorting results are slightly off if, for example, we do a bulk import of
  // 10,000 cards while simultaneously adding cards on another device, but
  // it's good enough.
  if (timestamp <= prevTimeStamp) {
    timestamp = ++prevTimeStamp;
  }
  prevTimeStamp = timestamp;

  const id =
    // We take the timestamp, converted to base 36, and zero-pad it so it
    // collates correctly for at least 50 years...
    `0${timestamp.toString(36)}`.slice(-8) +
    // ...then add a random 3-digit sequence to the end in case we
    // simultaneously add a card on another device at precisely the same
    // millisecond.
    `00${Math.floor(Math.random() * 46656).toString(36)}`.slice(-3);
  return id;
};
