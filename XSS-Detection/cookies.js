function setCookie(cookie_name, cookie_value, expires_days) {
    var date_now = new Date();
    date_now.setTime(date_now.getTime() + (expires_days * 24 * 60 * 60 * 1000));
    var expires_time = "expires="+date_now.toUTCString();
    document.cookie = cookie_name + "=" + cookie_value + ";" + expires_time + ";path=/";
}
  
function getCookie(cookie_name) {
  var get_cname = cookie_name + "=";
  var cookie_split = document.cookie.split(';');
  for(var i = 0; i < cookie_split.length; i++) {
    var cookies = cookie_split[i];
    while (cookies.charAt(0) == ' ') {
      cookies = cookies.substring(1);
    }
    if (cookies.indexOf(get_cname) == 0) {
      return cookies.substring(get_cname.length, cookies.length);
    }
  }
  return "";
}

module.exports = { setCookie, getCookie }; 