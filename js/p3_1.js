$(document).ready(function () {

  // Guarda los datos de la página activa 
  var datosActuales = [];
  var cargadaAjax = { 2: false, 3: false };

  // Construye una tabla HTML a partir de un array
  function construirTablaHTML(filas) {
    var html = "<table><thead>" +
      "<tr>" +
      "<th>Ciudad</th>" +
      "<th>Temperatura (º)</th>" +
      "<th>Humedad (%)</th>" +
      "<th>Ruido</th>" +
      "<th>Nivel de luz</th>" +
      "<th>Color de Iluminación</th>" +
      "</tr></thead><tbody>";

    filas.forEach(function (f) {
      html += "<tr>" +
        "<td>" + f.ciudad + "</td>" +
        "<td>" + f.temperatura + "</td>" +
        "<td>" + f.humedad + "</td>" +
        "<td>" + f.ruido + "</td>" +
        "<td>" + f.luz + "</td>" +
        "<td>" + f.color + "</td>" +
        "</tr>";
    });

    html += "</tbody></table>";
    return html;
  }

  // Extrae los datos de la tabla visible
  function extraerDatosDeTabla($pagina) {
    var lista = [];
    $pagina.find("tbody tr").each(function () {
      var $celdas = $(this).find("td");
      if ($celdas.length >= 6) {
        lista.push({
          ciudad: $.trim($celdas.eq(0).text()),
          temperatura: parseFloat($.trim($celdas.eq(1).text())) || 0,
          humedad: parseFloat($.trim($celdas.eq(2).text())) || 0,
          ruido: parseFloat($.trim($celdas.eq(3).text())) || 0,
          luz: parseFloat($.trim($celdas.eq(4).text())) || 0
        });
      }
    });
    return lista;
  }

  
  function actualizarHistograma(campo, tituloColumna) {
    var $cont = $("#histograma");
    var $filasCont = $("#histograma-filas");
    $("#histograma-titulo").text(tituloColumna);
    $filasCont.empty();

    if (!campo || !datosActuales.length) {
      $cont.hide();
      return;
    }

    var maxVal = Math.max.apply(null, datosActuales.map(function (d) { return d[campo]; }));
    if (maxVal <= 0) maxVal = 1;

    datosActuales.forEach(function (item) {
      var valor = item[campo];
      var pct = Math.round((valor / maxVal) * 100);

      var $fila = $("<div>").css({
        "display": "flex",
        "align-items": "center",
        "margin": "8px 0",
        "gap": "12px",
        "background": "transparent",
        "border": "none",
        "padding": "0"
      });

      var $etiqueta = $("<span>").text(item.ciudad).css({
        "width": "130px",
        "flex-shrink": "0",
        "font-weight": "bold"
      });

      var $pista = $("<div>").css({
        "flex": "1",
        "background-color": "#eef2f7",
        "border": "1px solid #cbd5e1",
        "height": "22px",
        "padding": "0"
      });

      var $barra = $("<div>").css({
        "width": pct + "%",
        "height": "100%",
        "background-color": "#7ea1c4",
        "padding": "0",
        "border": "none",
        "transition": "width 0.25s ease"
      });

      var $valorTxt = $("<span>").text(valor).css({
        "width": "45px",
        "text-align": "right",
        "font-size": "0.9em"
      });

      $pista.append($barra);
      $fila.append($etiqueta, $pista, $valorTxt);
      $filasCont.append($fila);
    });

    $cont.show();
  }

  
  function formatear($pagina) {
    var $tabla = $pagina.find("table");
    if (!$tabla.length) return;

   
    if ($tabla.find("tr.fila-checks").length === 0) {
      var campos = [null, "temperatura", "humedad", "ruido", "luz", null];
      var $filaChecks = $('<tr class="fila-checks"></tr>');

      $tabla.find("thead th").each(function (idx) {
        var titulo = $.trim($(this).text());
        var campo = campos[idx];
        var $td = $("<td></td>");

        if (campo) {
          var $chk = $('<input type="checkbox" class="chk-columna">')
            .attr("data-campo", campo)
            .attr("data-titulo", titulo);
          $td.append($chk);
        }
        $filaChecks.append($td);
      });

      $tabla.find("thead").append($filaChecks);
    }

    
    $tabla.find(".chk-columna").prop("checked", false);
    actualizarHistograma(null, "");

    
    $tabla.off("change", ".chk-columna").on("change", ".chk-columna", function () {
      var $actual = $(this);
      if ($actual.is(":checked")) {
        $tabla.find(".chk-columna").not($actual).prop("checked", false);
        actualizarHistograma($actual.data("campo"), $actual.data("titulo"));
      } else {
        actualizarHistograma(null, "");
      }
    });

    
    $tabla.css({
      "border-collapse": "collapse",
      "width": "100%",
      "margin": "10px 0"
    });

    $tabla.find("th, td").css({
      "border": "1px solid #999",
      "padding": "6px 10px",
      "text-align": "center"
    });

    $tabla.find("th").css({
      "background-color": "#4a76b0",
      "color": "#fff"
    });

    $tabla.find("tr.fila-checks td").css({
      "background-color": "#dce6f2"
    });

    $tabla.find("tbody tr:odd").css("background-color", "#eef2f7");
    $tabla.find("tbody tr:even").css("background-color", "#ffffff");
    $tabla.find("tbody td:first-child").css("font-weight", "bold");

    $tabla.find("tbody td:last-child").each(function () {
      var hex = $.trim($(this).text());
      if (/^[0-9A-Fa-f]{6}$/.test(hex)) {
        var r = parseInt(hex.substr(0, 2), 16);
        var g = parseInt(hex.substr(2, 2), 16);
        var b = parseInt(hex.substr(4, 2), 16);
        var brillo = (r * 299 + g * 587 + b * 114) / 1000;

        $(this).css({
          "background-color": "#" + hex,
          "color": brillo > 140 ? "#000" : "#fff"
        });
      }
    });

    datosActuales = extraerDatosDeTabla($pagina);
  }

  // Carga Página 2 mediante XML
  function cargarPagina2XML(callback) {
    if (cargadaAjax[2]) {
      callback();
      return;
    }
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "datos/pagina2.xml", true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        var xmlDoc = xhr.responseXML;
        var nodos = xmlDoc.getElementsByTagName("estacion");
        var filas = [];

        for (var i = 0; i < nodos.length; i++) {
          var n = nodos[i];
          filas.push({
            ciudad: n.getElementsByTagName("ciudad")[0].textContent,
            temperatura: n.getElementsByTagName("temperatura")[0].textContent,
            humedad: n.getElementsByTagName("humedad")[0].textContent,
            ruido: n.getElementsByTagName("ruido")[0].textContent,
            luz: n.getElementsByTagName("luz")[0].textContent,
            color: n.getElementsByTagName("color")[0].textContent
          });
        }

        $("#pagina2").html(construirTablaHTML(filas));
        cargadaAjax[2] = true;
        callback();
      }
    };
    xhr.send();
  }

  // Carga Página 3 mediante JSON con jQuery AJAX
  function cargarPagina3JSON(callback) {
    if (cargadaAjax[3]) {
      callback();
      return;
    }
    $.ajax({
      url: "datos/pagina3.json",
      method: "GET",
      dataType: "json",
      success: function (data) {
        $("#pagina3").html(construirTablaHTML(data));
        cargadaAjax[3] = true;
        callback();
      }
    });
  }

  function finalizarVista(n) {
    var $destino = $("#pagina" + n);
    formatear($destino);
    $destino.fadeIn(250);
  }

  function mostrarPagina(n) {
    n = parseInt(n, 10);
    var $destino = $("#pagina" + n);

    $(".pagina").hide();
    $(".enlace-pagina").css({ "font-weight": "normal", "text-decoration": "underline" });
    $(".enlace-pagina[data-pagina='" + n + "']").css({ "font-weight": "bold", "text-decoration": "none" });

    if (n === 2) {
      cargarPagina2XML(function () { finalizarVista(2); });
    } else if (n === 3) {
      cargarPagina3JSON(function () { finalizarVista(3); });
    } else {
      finalizarVista(n);
    }
  }

  $("#paginacion").css({ "justify-content": "center", "margin-top": "10px" });
  $(".enlace-pagina").css({ "margin": "0 12px" });

  $(".enlace-pagina").on("click", function (e) {
    e.preventDefault();
    mostrarPagina($(this).data("pagina"));
  });

  mostrarPagina(1);
});
