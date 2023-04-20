/**
 * It takes a string like '1s' or '2m' or '3h' or '4d' and returns a new Date object that is the
 * current date plus the number of seconds, minutes, hours, or days specified in the string
 *
 * @param {string} timeUnitString - The string that contains the time unit
 * @param {Date} date - The date to add the time unit to
 * @returns A Date object
 */
export function addTime(timeUnitString: string, date: Date = new Date()): Date {
  if (timeUnitString.includes('s')) {
    return addSeconds(Number(timeUnitString.split('s')[0]))
  }
  if (timeUnitString.includes('m')) {
    return addMinutes(Number(timeUnitString.split('m')[0]))
  }
  if (timeUnitString.includes('h')) {
    return addHours(Number(timeUnitString.split('h')[0]))
  }
  if (timeUnitString.includes('d')) {
    return addDays(Number(timeUnitString.split('d')[0]))
  }
  return new Date()
}

/**
 * Add a number of seconds to a date and return the new date
 *
 * @param {number} numOfSeconds - number - The number of seconds to add to the date
 * @param {Date} date - The date to add the seconds to
 * @returns A Date object with the number of seconds added to the date
 */
export function addSeconds(numOfSeconds: number, date: Date = new Date()): Date {
  date.setTime(date.getTime() + numOfSeconds * 1000)
  return date
}

/**
 * Add a number of minutes to a date and return the new date
 *
 * @param {number} numOfMinutes - number - The number of minutes to add to the date
 * @param {Date} date - The date to add minutes to
 * @returns A Date object with the number of minutes added to the date
 */
export function addMinutes(numOfMinutes: number, date: Date = new Date()): Date {
  date.setTime(date.getTime() + numOfMinutes * 60 * 1000)
  return date
}

/**
 * Add a number of hours to a date and return the new date
 *
 * @param {number} numOfHours - number - The number of hours to add to the date
 * @param {Date} date - The date to add hours to
 * @returns A Date object with the number of hours added to the date
 */
export function addHours(numOfHours: number, date: Date = new Date()): Date {
  date.setTime(date.getTime() + numOfHours * 60 * 60 * 1000)
  return date
}

/**
 * Add a number of days to a date, and return the new date
 *
 * @param {number} numOfDays - number - The number of days to add to the date
 * @param {Date} date - The date to add days to
 * @returns A Date object with the number of days added to the date
 */
export function addDays(numOfDays: number, date: Date = new Date()): Date {
  date.setTime(date.getTime() + numOfDays * 24 * 60 * 60 * 1000)
  return date
}
