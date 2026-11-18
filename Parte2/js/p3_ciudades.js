$(document).ready(function () {

  $("#pais").on("change", function () {
    var pais = $(this).val();

    $.get("datos/ciudades_" + pais + ".txt", function (datos) {
      var ciudades = datos.split("\n");

      $("#ciudad").empty();

      for (var i = 0; i < ciudades.length; i++) {
        $("#ciudad").append("<option>" + ciudades[i] + "</option>");
      }
    });
  });

});
