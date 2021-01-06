
  $(document).ready(function() {
    var delay = 300;
    var cookie_expire = 0;

    var cookie = localStorage.getItem("list-builder");
    if(cookie == undefined || cookie == null){
      cookie = 0;
    }
    if(((new Date()).getTime() - cookie) / (1000 * 60 * 60 * 24) > cookie_expire){
    $("#list-builder").delay(delay).fadeIn("fast", () => {
      $("#popup-box").fadeIn("fast", () => {})
    })
    $("#popup-close").click(() => {
      $("#list-builder, #popup-box").hide();
    })
    $("#button").click(() => {
      $("#list-builder, #popup-box").hide();
    })
    }
  })
