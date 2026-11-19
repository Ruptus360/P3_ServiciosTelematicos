function crearTabla(estaciones, pagina) {
  var t = "<table><thead><tr><th>Ciudad</th><th>Temperatura (º)</th><th>Humedad (%)</th><th>Ruido</th><th>Nivel de luz</th><th>Color de Iluminación</th></tr>";
  t += "<tr><td>Mostrar histograma</td>";
  t += "<td><input type='checkbox' onclick='histograma(this, 1, " + pagina + ")'></td>";
  t += "<td><input type='checkbox' onclick='histograma(this, 2, " + pagina + ")'></td>";
  t += "<td><input type='checkbox' onclick='histograma(this, 3, " + pagina + ")'></td>";
  t += "<td><input type='checkbox' onclick='histograma(this, 4, " + pagina + ")'></td>";
  t += "<td>-</td></tr></thead><tbody>";

  for (var i = 0; i < estaciones.length; i++) {
    t += "<tr><td>" + estaciones[i].ciudad + "</td>";
    t += "<td>" + estaciones[i].temperatura + "</td>";
    t += "<td>" + estaciones[i].humedad + "</td>";
    t += "<td>" + estaciones[i].ruido + "</td>";
    t += "<td>" + estaciones[i].luz + "</td>";
    t += "<td>" + estaciones[i].color + "</td></tr>";
  }

  t += "</tbody></table>";
  return t;
}

function cargarXML() {
  var peticion = new XMLHttpRequest();

  peticion.onload = function () {
    var xml = peticion.responseXML;
    var nodos = xml.getElementsByTagName("estacion");
    var estaciones = [];

    for (var i = 0; i < nodos.length; i++) {
      estaciones.push({
        ciudad: nodos[i].getElementsByTagName("ciudad")[0].textContent,
        temperatura: nodos[i].getElementsByTagName("temperatura")[0].textContent,
        humedad: nodos[i].getElementsByTagName("humedad")[0].textContent,
        ruido: nodos[i].getElementsByTagName("ruido")[0].textContent,
        luz: nodos[i].getElementsByTagName("luz")[0].textContent,
        color: nodos[i].getElementsByTagName("color")[0].textContent
      });
    }

    document.getElementById("pagina3").innerHTML = crearTabla(estaciones, 3);
    formatearTabla($("#pagina3"));
  };

  peticion.open("GET", "datos/pagina3.xml", true);
  peticion.send();
}

function histograma(casilla, columna, pagina) {
  var marcada = casilla.checked;

  $("#pagina" + pagina + " input").prop("checked", false);
  casilla.checked = marcada;

  if (marcada == false) {
    $("#histograma").hide();
    return;
  }

  var titulo = $("#pagina" + pagina + " th").eq(columna).text();
  var filas = $("#pagina" + pagina + " tbody tr");
  var maximo = 0;

  filas.each(function () {
    var valor = Number($(this).find("td").eq(columna).text());
    if (valor > maximo) {
      maximo = valor;
    }
  });

  var html = "<h2>" + titulo + "</h2>";

  filas.each(function () {
    var ciudad = $(this).find("td").eq(0).text();
    var valor = $(this).find("td").eq(columna).text();
    var ancho = valor / maximo * 100;

    html += "<div class='hist-fila'>";
    html += "<span class='hist-etiqueta'>" + ciudad + "</span>";
    html += "<div class='hist-pista'><div class='hist-barra' style='width:" + ancho + "%'></div></div>";
    html += "<span class='hist-valor'>" + valor + "</span>";
    html += "</div>";
  });

  $("#histograma").html(html).show();
}

$(document).ready(function () {

  $(".enlace-pagina").on("click", function () {
    $("#histograma").hide();
  });

  $(".enlace-pagina[data-pagina='3']").on("click", function () {
    cargarXML();
  });

  $(".enlace-pagina[data-pagina='4']").on("click", function () {
    $.getJSON("datos/pagina4.json", function (respuesta) {
      $("#pagina4").html(crearTabla(respuesta.estaciones, 4));
      formatearTabla($("#pagina4"));
    });
  });

});
