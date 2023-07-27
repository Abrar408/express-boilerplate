const parseCookieString = (cookieString) => {
  return cookieString.split(";").reduce((cookies, cookie) => {
    const [name, value] = cookie.trim().split("=");
    cookies[name] = decodeURIComponent(value);
    return cookies;
  }, {});
};

module.exports = parseCookieString;
