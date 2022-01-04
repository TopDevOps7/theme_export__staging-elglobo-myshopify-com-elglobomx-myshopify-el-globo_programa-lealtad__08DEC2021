var appUrl = 'https://0sa1.elglobo.com.mx/staging/public';

var sucursal;
var mbProductos = sessionStorage.getItem('mbProductos');
var dirsuc = sessionStorage.getItem('suc_dir');
var cartSubmit = 0;
if (dirsuc == null) {
  sucursal = null;
} else {
  sucursal = sessionStorage.getItem('sucursal');
}
console.log(sucursal);

if (sucursal == null) {
  console.log("Sucursal no ha sido seleccionada");

  //window.location.replace('https://elglobomx.myshopify.com/pages/sucursales');
} else {
  var cartAttributes = {
    attributes: {
      'sucursal': sucursal,
      'direccionSucursal': sessionStorage.getItem('suc_dir'),
      'horarioSucursal': sessionStorage.getItem('suc_horario'),
      'telefonoSucursal': sessionStorage.getItem('suc_tel'),
      'latSucursal': sessionStorage.getItem('suc_lat'),
      'lonSucursal': sessionStorage.getItem('suc_lon')

    }
  };

  //$.post('/cart/update.js', "attributes[sucursal]="+sucursal);
  $.post('/cart/update.js', cartAttributes);
  sucursal = sucursal.replace("S", "");
  console.log("La sucursal elegida es: " + sucursal);
  getProductos();
  //hideProductos();
  showBebidas();
}

function getProductos() {
  console.log("obtener los productos de la sucursal: " + sucursal);
  var params = '?';
  params += "suc=" + sucursal;

  var requestOptions = {
    method: 'GET',
    //headers: myHeaders,
    redirect: 'follow'
    //mode: 'cors'
  };

  fetch(appUrl + "/shopify/getproductos" + params, requestOptions)
    .then(response => response.json())
    .then(function (data) {
      console.log(data);
      mbProductos = data;
      sessionStorage.setItem('mbProductos', mbProductos);
      hideProductos();
    })
    .catch(error => console.log('error', error));
}

function buscarProductoInfoPorSku(sku) {
  if (typeof mbProductos !== "undefined") {
    for (var k in mbProductos) {
      if (mbProductos[k].sku == sku) {
        return mbProductos[k];
        break;
      }
    }
  }
}

function hideProductos() {
  $('#prd-loading-icon').hide();
  console.log('TYPE');
  console.log(typeof mbProductos);
  if (typeof mbProductos !== null) {
    $.each($('[data-sga-prd-sku]'), function (index, element) {
      console.log($(element).attr('data-sga-prd-sku'));
      var productoData = buscarProductoInfoPorSku($(element).attr('data-sga-prd-sku'));
      console.log(productoData);
      if (typeof productoData !== "undefined") {
        if (productoData.qty > 0) {
          $(element).show();

        } else {
          //$(element).remove();
        }
      } else {
        //$(element).remove();
      }
    });

    /*visibleProductsCount = $("[data-sga-prd-sku]:visible").length;
    if(visibleProductsCount > 0){
        $('#sga-prd-count').text("Mostrando " + visibleProductsCount + " productos")
          .removeClass('visually-hidden');
        
    }*/

  }
}


function hideBuscadorProductos() {
  if (typeof mbProductos !== null) {
    $.each($('[data-sga-prdsearch-sku]'), function (index, element) {
      console.log($(element).attr('data-sga-prdsearch-sku'));
      var productoData = buscarProductoInfoPorSku($(element).attr('data-sga-prdsearch-sku'));
      var tags = $(element).attr('data-sga-prdsch-tags');
      console.log(productoData);

      if (typeof productoData !== "undefined") {

        if (productoData.qty > 0
          || tags.indexOf("visibleallways") >= 0) {
          //$(element).show();
        } else {
          $(element).hide();
        }
      } else {
        if (tags.indexOf("visibleallways") == 0 || tags == "") {
          $(element).hide();
        }
      }
    });
  }
}

function showBebidas() {
  $.each($('[data-sga-prd-sku]'), function (index, element) {
    //console.log($(element).attr('data-sga-tags'));
    var tags = $(element).attr('data-sga-tags');

    if (tags.indexOf("visibleallways") >= 0) {
      $(element).show();
    }
  });
}

function validateMaxQty(element) {
  var qty = parseInt($(element).val());
  var frm = $(element).closest('form');
  var sku = $(frm).find('input[data-sku]').attr('data-sku');

  if (sku == "" || typeof sku === "undefined") {
    var sku = $(frm).find('input[name="sku"]').val();
  }

  var productoData = buscarProductoInfoPorSku(sku);
  //console.log(productoData);
  if (typeof productoData !== "undefined") {
    if (qty > parseInt(productoData.qty)) {
      $(element).val(productoData.qty);
    }
  }
}

function validateCartMaxQty(element, type) {
  var qty = parseInt($(element).val());
  var parent = $(element).closest('tr');
  var sku = $(parent).attr('data-sku');

  if (type == "btn-mas") {
    qty = qty + 1;
  }
  if (type == "btn-menos") {
    qty = qty - 1;
  }

  console.log("carrito val");
  console.log(sku + ":" + qty);


  var productoData = buscarProductoInfoPorSku(sku);
  console.log(productoData);
  if (typeof productoData !== "undefined") {
    if (qty > parseInt(productoData.qty)) {
      if (type == "btn-mas") {
        $(parent).find('[data-action="increase-quantity"]').attr('data-quantity', productoData.qty);
      }
      if (type == "btn-menos") {
        $(parent).find('[data-action="decrease-quantity"]').attr('data-quantity', productoData.qty - 1);
      }
      if (type == "input") {
        $(element).val(productoData.qty);
      }
    }
  }
}

function validarHorarioSucursal(element) {
  var params = '?';
  params += "suc=" + sucursal;

  var requestOptions = {
    method: 'GET',
    //headers: myHeaders,
    redirect: 'follow'
    //mode: 'cors'
  };

  fetch(appUrl + "/shopify/validarhorariosucursal" + params, requestOptions)
    .then(response => response.json())
    .then(function (data) {
      console.log(data);
      if (data.en_horario) {
        cartSubmit = 1;
        $('#frm-cart-recap button[name="checkout"]').click();
      } else {
        $('modal-horario-horarios').text(data.horario_apertura + " hrs");
        $('#modal-horario-nbrsuc').text(sessionStorage.getItem('suc_name'));
        $('#modal-horario').fadeIn('fast').focus();
      }
    }).catch(error => console.log('error', error));
}

/*$('body').on('change', 'div.collection', function(){
  console.log('changed paged');
});*/


// Options for the observer (which mutations to observe)
const config = { attributes: true, childList: true, subtree: true };
// Select the node that will be observed for mutations
const targetNode = document.getElementById('collection__dynamic-part');

if (targetNode !== null) {

  // Callback function to execute when mutations are observed
  const callback = function (mutationsList, observer) {
    // Use traditional 'for loops' for IE 11
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        console.log('A child node has been added or removed.');
        hideProductos();
        showBebidas()
      }
      /*else if (mutation.type === 'attributes') {
          console.log('The ' + mutation.attributeName + ' attribute was modified.');
      }*/
    }
  };

  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(callback);

  // Start observing the target node for configured mutations
  observer.observe(targetNode, config);

  // Later, you can stop observing
  //observer.disconnect();
}

//---OBSERVER 2
// Select the node that will be observed for mutations
const targetNode2 = document.getElementsByClassName('search-bar__inner');

if (targetNode2 !== null) {
  // Callback function to execute when mutations are observed
  const callback2 = function (mutationsList, observer) {
    // Use traditional 'for loops' for IE 11
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        console.log('Buscador actualizado');
        hideBuscadorProductos();

      }
    }
  };

  // Create an observer instance linked to the callback function
  const observer2 = new MutationObserver(callback2);

  // Start observing the target node for configured mutations
  observer2.observe(targetNode2[0], config);

  // Later, you can stop observing
  //observer.disconnect();
}
//---FIN OBSERVER 2

/*/---OBSERVER 3
// Select the node that will be observed for mutations
const targetNode3 = document.getElementById('mini-cart');

if(targetNode3 !== null){
    // Callback function to execute when mutations are observed
    const callback3 = function(mutationsList, observer) {
        // Use traditional 'for loops' for IE 11
        for(const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                console.log('mini carrito actualizado');
            }
        }
    };

    // Create an observer instance linked to the callback function
    const observer3 = new MutationObserver(callback3);

    // Start observing the target node for configured mutations
    observer3.observe(targetNode3, config);

    // Later, you can stop observing
    //observer.disconnect();
}
//---FIN OBSERVER 3 */

$(document).ready(function () {
  //Validar qty a agregar en quick view y detalle de producto
  $(document).on('input change', 'input[name="quantity"]', function () {
    validateMaxQty(this);
  });
  $("#PLLoadingImg").show();

  $(document).on('click', '[data-action="decrease-picker-quantity"]', function () {
    var frm = $(this).closest('form');
    var input = $(frm).find('input[name="quantity"]');
    validateMaxQty(input);
  });
  $(document).on('click', '[data-action="increase-picker-quantity"]', function () {
    var frm = $(this).closest('form');
    var input = $(frm).find('input[name="quantity"]');
    validateMaxQty(input);
  });

  //Validar qty a agregar en pagina de carrito
  $(document).on('input change', 'input.quantity-selector__value', function () {
    validateCartMaxQty(this, 'input');
  });
  /*$(document).on('click', '[data-action="decrease-quantity"]', function() { 
      var parent = $(this).closest('tr');
      var input = $(parent).find('input.quantity-selector__value');
      validateCartMaxQty(input,'btn-menos');
  });
  $(document).on('click', '[data-action="increase-quantity"]', function() { 
      var parent = $(this).closest('tr');
      var input = $(parent).find('input.quantity-selector__value');
      validateCartMaxQty(input,'btn-mas');
  });*/


  //Selectores de cantidad en collections o rejillas
  $(document).on('click', '[data-action="custom-increase-quantity"]', function () {
    var parent = jQuery(this).closest('div[data-sga-prd-sku]');
    var qty = jQuery(parent).find('input[name="quantity"]').val();
    qty = parseInt(qty) + 1;
    jQuery(parent).find('input[name="quantity"]').val(qty);

    var input = $(parent).find('input[name="quantity"]');
    validateMaxQty(input);
  });

  $(document).on('click', '[data-action="custom-decrease-quantity"]', function () {
    var parent = jQuery(this).closest('div[data-sga-prd-sku]');
    var qty = jQuery(parent).find('input[name="quantity"]').val();
    qty = parseInt(qty) - 1;
    if (qty < 1) {
      qty = 1;
    }
    jQuery(parent).find('input[name="quantity"]').val(qty);

    var input = $(parent).find('input[name="quantity"]');
    validateMaxQty(input);
  });
  //Fin selectores de cantidad

  //$('div.page__sub-header div.page__navigation').remove();


  //Fin validar qty en quick view y en detalle de producto

  $(document).on('submit', '#frm-cart-recap', function (e) {
    if (cartSubmit == 0) {
      e.preventDefault();
      validarHorarioSucursal(this);
    }
  });

  setTimeout(function () {
    $(".eg-megamenu-item span:contains('FAVORITOS DEL MES')").parent().parent().parent().remove();
  }, 500);
});


//---Programa lealtad---
var misPuntos = 0;
function PLConsultaPuntos() {
  var params = '?';
  params += "cliId=" + $('#PLClientId').val();

  var requestOptions = {
    method: 'GET',
    //headers: myHeaders,
    redirect: 'follow'
    //mode: 'cors'
  };

  $('#PLContainer').hide();
  $('#PLLoadingImg').show;

  fetch(appUrl + "/shopify/plconsultapuntos" + params, requestOptions)
    .then(response => response.json())
    .then(function (data) {
      console.log(data);
      $('#PLContainer').show();
      $('#PLLoadingImg').hide;

      if (data.status) {
        misPuntos = data.puntos;
        $('#misPuntosInfo').text(data.puntos);
      } else {
        $('#txtPuntos').remove();
        $('#btnUsarPuntos').remove();
        $('#programaLealtadMsg').html('<b >No estás dado de alta en el programa de lealtad o hubo un problema al consultar tus puntos.</b>');
      }
    }).catch(error => console.log('error', error));
}

function PLTmpCongelarPuntos(discount) {
  var amt = $('#txtPuntos').val();
  var params = '?';
  params += "cliId=" + $('#PLClientId').val();
  params += "&puntos=" + $('#txtPuntos').val();
  params += "&sucNum=" + sucursal;
  params += "&sucNom=" + sessionStorage.getItem('suc_name');

  var requestOptions = {
    method: 'GET',
    //headers: myHeaders,
    redirect: 'follow'
    //mode: 'cors'
  };

  $('#PLContainer').hide();
  $('#PLLoadingImg').show;

  fetch(appUrl + "/shopify/pltmpcongelarpuntos" + params, requestOptions)
    .then(response => response.json())
    .then(function (data) {
      console.log(data);
      $('#PLLoadingImg').hide();
      $('#PLContainer').show();

      if (data.status) {
        $.post('/cart/update.js', "attributes[folioRedencion]=" + data.folio);

        sessionStorage.setItem('folio', data.folio);
        sessionStorage.setItem('puntosAplicados', amt);
        sessionStorage.setItem('discount', discount);

        $('#frm-cart-recap [name="discount"]').val(discount);
        $('#puntosAplicados').text(amt);

        $('#frmPuntos').hide();
        $('#dsctoPuntosInfo').show();

        PLConsultaPuntos();
        $('#programaLealtadMsg').html('<span style="color: #8b384a"><b>Éxito!</b> ' + amt + ' punto(s) aplicados verás el resumen en la pantalla de pago</span>');
      } else {
        $('#frmPuntos').show();
        $('#programaLealtadMsg').html('<b>Hubo un problema al aplicar el descuento, vuelve a intentarlo por favor.</b>');
      }
    }).catch(error => console.log('error', error));
}

function PLCancelarPuntos(folio) {
  var params = '?';
  params += "cliId=" + $('#PLClientId').val();
  params += "&folio=" + folio;
  params += "&sucNum=" + sucursal;
  params += "&sucNom=" + sessionStorage.getItem('suc_name');

  var requestOptions = {
    method: 'GET',
    //headers: myHeaders,
    redirect: 'follow'
    //mode: 'cors'
  };

  $('#PLContainer').hide();
  $('#PLLoadingImg').show;

  fetch(appUrl + "/shopify/plcancelarpuntos" + params, requestOptions)
    .then(response => response.json())
    .then(function (data) {
      console.log(data);
      $('#PLLoadingImg').hide();
      $('#PLContainer').show();

      if (data.status) {
        PLConsultaPuntos();

        $.post('/cart/update.js', "attributes[folioRedencion]=");
        sessionStorage.removeItem('folio');
        sessionStorage.removeItem('puntosAplicados');
        sessionStorage.removeItem('discount');

        $('#frm-cart-recap [name="discount"]').val("");
        $('#frmPuntos').show();
        $('#dsctoPuntosInfo').hide();
        $('#puntosAplicados').text(0);
        $('#programaLealtadMsg').text("");
      } else {
        $('#programaLealtadMsg').html('<b >No pudimos devolver tus puntos. Por favor, vuelve a intentarlo.</b>');
      }
    }).catch(error => console.log('error', error));
}

function crearDescuento(cliente, monto) {
  var params = '?';
  params += "cli=" + cliente;
  params += "&amt=" + monto;

  var requestOptions = {
    method: 'GET',
    //headers: myHeaders,
    redirect: 'follow'
    //mode: 'cors'
  };

  fetch(appUrl + "/shopify/creardescuento" + params, requestOptions)
    .then(response => response.json())
    .then(function (data) {
      console.log(data);
      if (data.status) {
        $('#frm-cart-recap [name="discount"]').val(data.code);
        $('#programaLealtadMsg').html('<b>Listo! procede con el pago y verás tu descuento en la siguiente pantalla</b>');
      } else {
        $('#programaLealtadMsg').html('<b>' + data.message + '</b>');
      }
    }).catch(error => console.log('error', error));
}

function buscarDescuento() {
  var monto = $('#txtPuntos').val();
  var params = '?' + Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
  var discount = "";

  var requestOptions = {
    method: 'GET',
    //headers: myHeaders,
    redirect: 'follow'
    //mode: 'cors'
  };

  fetch(appUrl + "/giftcards/giftcards.json" + params, requestOptions)
    .then(response => response.json())
    .then(function (data) {
      console.log(data);
      for (var k in data) {
        if (data[k].amount == "" + monto) {
          discount = data[k].code;
          break;
        }
      }

      if (discount != "") {
        PLTmpCongelarPuntos(discount);
      } else {
        $('#programaLealtadMsg').html('<b>No pudimos devolver tus puntos. Por favor, vuelve a intentarlo.</b>');
      }
    }).catch(error => console.log('error', error));
}

$(document).ready(function () {
  var puntosAplicados = sessionStorage.getItem('puntosAplicados');
  var discount = sessionStorage.getItem('discount');
  if (puntosAplicados != null) {
    $('#dsctoPuntosInfo').show();
    $('#frmPuntos').hide();
    $('#puntosAplicados').text(puntosAplicados);
  }
  if (discount != null) {
    setTimeout(function () {
      console.log(discount);
      $('#frm-cart-recap [name="discount"]').val(discount);
    }, 2000);
  }
});

$(document).on('click', '#btnUsarPuntos', function () {
  //crearDescuento("demo@gmail.com", $('#txtPuntos').val());
  var txtPun = parseFloat($('#txtPuntos').val());
  if (txtPun > parseFloat(misPuntos)) {
    $("#PLLoadingImg").hide();
    $('#programaLealtadMsg').html('<span style="color: red">Solo puedes canjear ' + misPuntos + ' puntos como máximo');
  } else {
    buscarDescuento();
  }
});

$(document).on('click', '#btnCancelarPuntos', function () {
  console.log("btnCancelar puntos clicked");
  var folio = sessionStorage.getItem('folio');

  if (folio != null) {
    PLCancelarPuntos(folio);
  } else {
    $('#frmPuntos').show();
    $("#PLLoadingImg").show();
    $('#dsctoPuntosInfo').hide();
  }
});

//---End programa lealtad---