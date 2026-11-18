$(document).ready(function () {

  var $info = $("#info");

  $(".carrusel")
    .on("mouseenter", function () {
      var nombre = $(this).attr("src");
      $("#info-img").attr("src", $(this).attr("src"));
      $("#info-nombre").text(nombre);
      $info.stop(true, true).fadeIn(100);
    })

    .on("mousemove", function (e) {
      var izquierda = e.pageX + 15;
      if (izquierda + $info.outerWidth() > $(window).width()) {
        izquierda = e.pageX - $info.outerWidth() - 15;
      }
      $info.css({ top: e.pageY + 15, left: Math.max(0, izquierda) });
    })

    .on("mouseleave", function () {
      $info.stop(true, true).fadeOut(100);
    });


  var $lista = $("#desplazar");
  var $ventana = $(".ventana");
  var $items = $lista.children("li");
  var offset = 0;

  function maxDesplazamiento() {
    return Math.max(0, $lista.outerWidth() - $ventana.width());
  }

  function posiciones() {
    return $items.map(function () { return $(this).position().left; }).get();
  }

  function actualizarBotones() {
    $("#anterior").prop("disabled", offset <= 0);
    $("#siguiente").prop("disabled", offset >= maxDesplazamiento() - 1);
  }

  function irA(destino) {
    offset = Math.max(0, Math.min(maxDesplazamiento(), destino));
    $lista.stop(true).animate({ left: -offset }, 400);
    actualizarBotones();
  }

  $("#siguiente").on("click", function () {
    var mayores = posiciones().filter(function (x) { return x > offset + 1; });
    irA(mayores.length ? mayores[0] : maxDesplazamiento());
  });

  $("#anterior").on("click", function () {
    var menores = posiciones().filter(function (x) { return x < offset - 1; });
    irA(menores.length ? menores[menores.length - 1] : 0);
  });

  $(window).on("load resize", function () { irA(offset); });

  // Estado inicial de los botones (por si "load" ya ocurrió antes de llegar aquí)
  irA(0);

});