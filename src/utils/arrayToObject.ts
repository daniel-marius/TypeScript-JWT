// This function converts Object.entries (array of [key, value]) to JavaScript Object
export function convertArrayToObject<T>(entries: [keyof T, T[keyof T]][]): T {
  return entries.reduce(
    (newObj, [key, value]) => ({ ...newObj, [key]: value }),
    <T>{}
  );
}

export function convertArrayToObject2<T>(input: T): T {
  const objEntries = Object.entries(input);
  const updatedBody = objEntries.reduce((newObj: any, [key, value]: any) => {
    // if (value) {
    //   newObj[key] = value;
    // }
    // return newObj;
    return { ...newObj, [key]: value };
  }, {});
  return updatedBody;
}
