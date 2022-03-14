export const getDateDetail = (input, offset = 0) => {
  const date = new Date(input);
  if (offset >= 0) {
    date.setDate(date.getDate() + Math.abs(offset));
  } else {
    date.setDate(date.getDate() - Math.abs(offset));
  }

  const day = date.getDay();

  const fullNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednusday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const shortNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return {
    full: fullNames[day],
    short: shortNames[day],
    weekDay: day,
    value: date.getDate(),
    date: YYYYMMDD(date),
    month: date.getMonth() + 1,
    year: date.getFullYear(),
  };
};

export const getDayName = (input) => {
  const date = new Date(input);
  const day = date.getDay();
  const fullNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednusday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const shortNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return {
    full: fullNames[day],
    short: shortNames[day],
    weekDay: day,
    value: date.getDate(),
  };
};

export const getMonthName = (input) => {
  const date = new Date(input);
  const month = date.getMonth();
  const fullNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const shortNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return {
    full: fullNames[month],
    short: shortNames[month],
    value: month + 1,
    year: date.getFullYear(),
  };
};

export const YYYYMMDD = (input) => {
  const date = new Date(input);
  const YYYY = date.getFullYear();
  const MM = date.getMonth() + 1;
  const DD = date.getDate();
  return YYYY + "-" + doubleNumber(MM) + "-" + doubleNumber(DD);
};

export const doubleNumber = (month) => {
  if (Number(month) <= 9) {
    return "0" + month;
  } else {
    return month;
  }
};

export const firstLastDate = (input) => {
  const date = new Date(input);
  const year = date.getFullYear();
  const month = date.getMonth();
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);
  const res = {
    totalDays: endDate.getDate(),
    start: {
      date: startDate,
      day: getDayName(startDate),
      month: getMonthName(startDate),
      year: year,
    },
    end: {
      date: endDate,
      dayName: getDayName(endDate),
      month: getMonthName(endDate),
      year: year,
    },
  };
  return res;
};

const loop = (data, startingIndex) => {
  const arr = [];
  for (let i = startingIndex; i < startingIndex + 42; i++) {
    const date = getDateDetail(data, i).date;
    arr.push(date);
  }
  return weekSegregation(arr);
};

const weekSegregation = (array) => {
  const one = array.slice(0, 7);
  const two = array.slice(7, 14);
  const three = array.slice(14, 21);
  const four = array.slice(21, 28);
  const five = array.slice(28, 35);
  const six = array.slice(35, 42);
  return [one, two, three, four, five, six];
};

export const firstWeekData = (dt) => {
  if (dt.start.day.weekDay == 0) {
    return loop(dt.start.date, 0);
  } else if (dt.start.day.weekDay == 1) {
    return loop(dt.start.date, -1);
  } else if (dt.start.day.weekDay == 2) {
    return loop(dt.start.date, -2);
  } else if (dt.start.day.weekDay == 3) {
    return loop(dt.start.date, -3);
  } else if (dt.start.day.weekDay == 4) {
    return loop(dt.start.date, -4);
  } else if (dt.start.day.weekDay == 5) {
    return loop(dt.start.date, -5);
  } else if (dt.start.day.weekDay == 6) {
    return loop(dt.start.date, -6);
  }
};

export const isCurrentMonth = (input, selectedMonth) => {
  const date = new Date(input);
  return date.getMonth() + 1 === selectedMonth;
};

export const isToday = (input) => {
  const date = new Date(input);
  const proper_date =
    date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
  const today = new Date();
  const proper_today =
    today.getFullYear() + "-" + today.getMonth() + "-" + today.getDate();
  return proper_date === proper_today;
};

export const search = (data = [], key) => {
  const date = new Date(key);
  const res = data.filter((e) => {
    const _date = new Date(e.date);
    if (_date.getTime() === date.getTime()) {
      return e;
    }
  });
  return res;
};

export const dateSearch = (data = [], date) => {
  const res = data.filter((d) => {
    if (d === date) {
      return true;
    }
  });
  return res.length > 0;
};

export const dateSearchBetween = (data, dateCheck) => {
  const dateFrom = data.firstDate.date;
  const dateTo = data.lastDate.date;

  var from = new Date(dateFrom);
  var to = new Date(dateTo);
  var check = new Date(dateCheck);

  const res = check >= from && check <= to;

  return res;
};
