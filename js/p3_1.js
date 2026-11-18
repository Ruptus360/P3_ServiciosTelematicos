// Apartado 1.3 - Tablas paginadas con jQuery
$(document).ready(function () {

  // Da formato a la tabla del contenedor que se va a mostrar.
  // Las tablas del HTML van SIN formatear: todo el estilo se aplica aquí con selectores jQuery.
  function formatear($pagina) {
    var $tabla = $pagina.find("table");

    $tabla.css({
      "border-collapse": "collapse",
      "width": "100%",
      "margin": "10px 0"
    });

    // Todas las celdas (cabecera y datos)
    $tabla.find("th, td").css({
      "border": "1px solid #999",
      "padding": "6px 10px",
      "text-align": "center"
    });

    // Cabecera
    $tabla.find("th").css({
      "background-color": "#4a76b0",
      "color": "#fff"
    });

    // Filas alternas (:odd / :even cuentan desde 0)
    $tabla.find("tbody tr:odd").css("background-color", "#eef2f7");
    $tabla.find("tbody tr:even").css("background-color", "#ffffff");

    // Primera columna (ciudad) en negrita
    $tabla.find("tbody td:first-child").css("font-weight", "bold");

    // Última columna: la celda se pinta con su propio color de iluminación
    $tabla.find("tbody td:last-child").each(function () {
      var hex = $.trim($(this).text());                 // por ejemplo "FF0000"
      var r = parseInt(hex.substr(0, 2), 16);
      var g = parseInt(hex.substr(2, 2), 16);
      var b = parseInt(hex.substr(4, 2), 16);
      var brillo = (r * 299 + g * 587 + b * 114) / 1000; // 0 (oscuro) a 255 (claro)

      $(this).css({
        "background-color": "#" + hex,
        "color": brillo > 140 ? "#000" : "#fff"          // texto legible sobre cualquier color
      });
    });
  }

  function mostrarPagina(n) {
    var $destino = $("#pagina" + n);

    $(".pagina").hide();          // oculta todas las páginas
    formatear($destino);          // da formato justo al mostrarla
    $destino.fadeIn(250);         // y la muestra con un fundido

    // Resalta el enlace de la página activa
    $(".enlace-pagina").css({ "font-weight": "normal", "text-decoration": "underline" });
    $(".enlace-pagina[data-pagina='" + n + "']").css({ "font-weight": "bold", "text-decoration": "none" });
  }

  // El nav es flex en styles.css, así que se centra con justify-content
  $("#paginacion").css({ "justify-content": "center", "margin-top": "10px" });
  $(".enlace-pagina").css({ "margin": "0 12px" });

  $(".enlace-pagina").on("click", function (e) {
    e.preventDefault();                       // evita que el enlace "#" salte al inicio de la página
    mostrarPagina($(this).data("pagina"));    // data-pagina="3" -> 3
  });

  mostrarPagina(1);                           // al cargar se ve la página 1
});
