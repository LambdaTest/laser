export const getCookie = (cookieName) => {
  var name = cookieName + '=';
  var allCookieArray = document.cookie.split(';');
  for (var i = 0; i < allCookieArray.length; i++) {
    var temp = allCookieArray[i].trim();
    if (temp.indexOf(name) == 0) return temp.substring(name.length, temp.length);
  }
  return '';
};

export const writeCookie = (name, value, days) => {
  if (!days) {
    days = 365 * 20;
  }
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);

  const expires = '; expires=' + date.toUTCString();
  document.cookie = name + '=' + value + expires + ';domain=.lambdatest.com; path=/';
};

export const removeCookie = (name) => {
  writeCookie(name, '', -1);
};

export const getCookieOrgName = () => {
  return getCookie('tas_org_name');
};
export const createCookieOrgName = (orgname) => {
  writeCookie('tas_org_name', orgname);
};
export const getCookieOrgId = () => {
  return getCookie('tas_org_id');
};
export const createCookieOrgId = (orgId) => {
  writeCookie('tas_org_id', orgId);
};
export const getCookieGitProvider = () => {
  return getCookie('tas_git_provider');
};
export const createCookieGitProvider = (provider) => {
  writeCookie('tas_git_provider', provider);
};
export const getCookieTasRepoBranch = () => {
  return getCookie('tas_repo_branch');
};
export const getAuthToken = () => {
  return getCookie(`${process.env.NEXT_PUBLIC_AUTH_COOKIE}`);
};

export const formatDate = (date) => {
  const dateObj = new Date(date);
  const monthToShow = dateObj.getMonth() + 1;
  return `${dateObj.getDate()}/${monthToShow}/${dateObj.getFullYear()}`;
};

export const formatDateFromTimeStamp = (timestamp) => {
  // unix timestamp
  let ts = timestamp;

  // convert unix timestamp to milliseconds
  let ts_ms = ts * 1000;

  // initialize new Date object
  let date_ob = new Date(ts_ms);

  // year as 4 digits (YYYY)
  let year = date_ob.getFullYear();

  // month as 2 digits (MM)
  let month = ('0' + (date_ob.getMonth() + 1)).slice(-2);

  // date as 2 digits (DD)
  let date = ('0' + date_ob.getDate()).slice(-2);

  // hours as 2 digits (hh)
  let hours = ('0' + date_ob.getHours()).slice(-2);

  // minutes as 2 digits (mm)
  let minutes = ('0' + date_ob.getMinutes()).slice(-2);

  // seconds as 2 digits (ss)
  let seconds = ('0' + date_ob.getSeconds()).slice(-2);

  let gottenDate = year + '-' + month + '-' + date + ' ' + hours + ':' + minutes + ':' + seconds;
  const months = [
    'JAN',
    'FEB',
    'MAR',
    'APR',
    'MAY',
    'JUN',
    'JUL',
    'AUG',
    'SEP',
    'OCT',
    'NOV',
    'DEC',
  ];
  let current_datetime = new Date(gottenDate);
  let formatted_date =
    current_datetime.getDate() +
    '-' +
    months[current_datetime.getMonth() + 1] +
    '-' +
    current_datetime.getFullYear();
  return formatted_date;
};

export const isFutureDate = (comingdate) => {
  let currentDate = new Date();
  let date = new Date(comingdate);

  let currentDateTime = currentDate.getTime();
  let dateTime = date.getTime();

  if (currentDateTime < dateTime) {
    return true;
  } else {
    return false;
  }
};

export const lastDates = (daysCount) => {
  let dateObj = { start_date: Date(), end_date: Date() };
  if (daysCount > 0) {
    let startDate = new Date(new Date().setHours(0, 0, 0, 0));
    startDate.setDate(startDate.getDate() + 1);
    let endDate = new Date(new Date(startDate) - daysCount * 24 * 60 * 60 * 1000);
    dateObj.end_date = `${startDate.toDateString()}`;
    dateObj.start_date = `${endDate.toDateString()}`;
  }
  return dateObj;
};

export const minMaxDate = (type = 'week') => {
  let dateObj = { minDate: Date(), maxDate: Date() };
  if (type === 'week') {
    // let beforeOneWeek = new Date(new Date().getTime() - 60 * 60 * 24 * 7 * 1000)
    // , day = beforeOneWeek.getDay()
    // , diffToMonday = beforeOneWeek.getDate() - day + (day === 0 ? -6 : 1)
    // , lastMonday = new Date(beforeOneWeek.setDate(diffToMonday))
    // , lastSunday = new Date(beforeOneWeek.setDate(diffToMonday + 6));
    let beforeOneWeek = new Date(new Date().setHours(0, 0, 0, 0));
    beforeOneWeek.setDate(beforeOneWeek.getDate() + 1);
    let date2 = new Date(new Date(beforeOneWeek) - 7 * 24 * 60 * 60 * 1000);
    dateObj.maxDate = `${beforeOneWeek.toDateString()}`;
    dateObj.minDate = `${date2.toDateString()}`;
  }
  if (type === 'month') {
    let date = new Date(),
      y = date.getFullYear(),
      m = date.getMonth();
    let firstDay = new Date(y, m, 1);
    let lastDay = new Date(y, m + 1, 0);
    dateObj.minDate = `${firstDay.toDateString()}`;
    dateObj.maxDate = `${lastDay.toDateString()}`;
  }
  if (type === 'year') {
    let date = new Date(),
      y = date.getFullYear();
    let firstDay = new Date(y, 0, 1);
    let lastDay = new Date(y, 12, 0);
    dateObj.minDate = `${firstDay.toDateString()}`;
    dateObj.maxDate = `${lastDay.toDateString()}`;
  }
  return dateObj;
};

export const generateGraph = (array = [], labels = [], filterby, unit = '') => {
  if (array.length > 0) {
    array.sort(function (a, b) {
      return new Date(b.record_time) - new Date(a.record_time);
    });
    let arr = [];
    if (labels.length === 2) {
      arr.push(labels);
    }
    array.forEach((el) => {
      let arr2 = [];
      if (filterby === 'memory' && unit === 'GB') {
        arr2 = [new Date(el.record_time), el[filterby] / 1000000000];
      } else {
        arr2 = [new Date(el.record_time), el[filterby]];
      }
      arr.push(arr2);
    });
    return arr;
  }
};

export const getText = (str, splitBy = '(') => {
  if (str) {
    try {
      let arr = str.split(splitBy);
      if (arr && arr.length >= 2) {
        let text = arr.slice(0, arr.length - 1).join(splitBy);
        return text.replace(/^\s+|\s+$/gm,'');
      }
    } catch (err) {
      console.log('Err', err);
      return str;
    }
  }
};

export const clipText = (str, length = 5) => {
  if (str) {
    try {
      return str.substring(0, length);
    } catch (err) {
      console.log('Err', err);
      return str;
    }
  }
};

export const getStatusColor = (status) => {
  if (status) {
    switch (status) {
      case 'aborted':
        return '#000000';
      case 'skipped':
        return '#000000';
      case 'blocklisted':
        return '#000000';
      case 'quarantined':
        return '#000000';
      case 'failed':
        return '#ff8181';
      case 'error':
        return '#ff8181';
      case 'running':
        return '#ecc94b';
      case 'pending':
        return '#ecc94b';
      case 'initiating':
        return '#ecc94b';
      case 'passed':
        return '#70cb75';
      case 'completed':
        return '#70cb75';
      default:
        return '#70cb75';
    }
  }
};

export const logAmplitude = (eventName, props = {}) => {
  if (window && window.amplitude) {
    window.amplitude.getInstance().logEvent(eventName, props);
  }
};

const BytesInGB = 1000000000;
export const convertBytesToGigabyte = (value) => {
  return value / BytesInGB;
};

export const pluralize = (value, singular, plural) => {
  if (value === 1) {
    return `${value} ${singular}`;
  }
  return `${value} ${plural}`;
};

export const getCommitMsg = (str) => {
  if (str) {
    let arr = str.split('\n\n');
    if (arr.length >= 2) {
      return { name: arr[0], description: arr[1] };
    } else {
      return { name: str, description: '' };
    }
  } else {
    return { name: '', description: '' };
  }
};

export const parseJwt = (token) => {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );

  return JSON.parse(jsonPayload);
};
