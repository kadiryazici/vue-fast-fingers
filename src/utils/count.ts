type Callback<T extends any[]> = (item: T[number], index: number, array: T) => boolean

export function count<T extends any[]>(array: T, callback: Callback<T>) {
  let count = 0

  for (let index = 0; index < array.length; index++) {
    const element = array[index]
    const result = callback(element, index, array)
    if (result)
      count += 1
  }

  return count
}
