var selected_suc;
var selected_suc_name;
var selected_suc_dir;
var selected_suc_horario;
var selected_suc_tel;
var selected_suc_lat;
var selected_suc_lon;
var suc_prods;
var preload_sucs;
var no_dispon = [];
var input = document.getElementById('find-sucursales1');
var initialized = false;
var notInSucList = false;
var sucList = [[]];
var redirectTo = (!sessionStorage.getItem('selectedPage')) ? '/' : sessionStorage.getItem('selectedPage');
var tabla;
var movil;
var sucData = [];
//var iconBase = 'https://cdn.shopify.com/s/files/1/0262/5080/5306/files/pin-el-globo.svg?v=1606015769';

if ($(window).width() > 1000) {
    tabla = 'sucursales1';
    movil = false;
} else {
    tabla = 'sucursales-movil1';
    movil = true;
}


var iconBase = {
    url: 'https://cdn.shopify.com/s/files/1/0262/5080/5306/files/pin-el-globo_8b59ddd8-1697-4500-9e2c-32e5539aa525.svg?v=1614310719', // url
    scaledSize: new google.maps.Size(40, 40), // scaled size
    origin: new google.maps.Point(0, 0), // origin
    anchor: new google.maps.Point(0, 0) // anchor
};

var sucs;
var grayStyles = [
    {
        "featureType": "all",
        "elementType": "labels.text.fill",
        "stylers": [

            {
                "color": "#757575"
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "visibility": "off"
            },
            {
                "color": "#797979"
            },
            {
                "lightness": 16
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#efefef"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#797979"
            },

            {
                "weight": 1.2
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#e8e8e8"
            },

        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#dadada"
            }

        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#797979"
            },

            {
                "weight": 0.2
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#e3e3e3"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#a3a3a3"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#dadada"
            }
        ]
    }
];
var map;
function initialize() {


    if (notInSucList) {
        if (!initialized) {
            var autocomplete = new google.maps.places.Autocomplete(input);
            const searchBox = new google.maps.places.SearchBox(input);



            searchBox.addListener("places_changed", () => {
                const places = searchBox.getPlaces();
                console.log('search bots');

                if (places.length == 0) {
                    return;
                } else {

                    places.forEach((place) => {
                        if (!place.geometry) {
                            console.log("Returned place contains no geometry");
                            return;
                        } else {
                            console.log("lat1" + place.geometry.location.lat() + ' long ' + place.geometry.location.lng());
                            document.getElementById('lat1').value = place.geometry.location.lat();
                            document.getElementById('lon1').value = place.geometry.location.lng();
                            getSucursales();
                            initMap(place.geometry.location.lat(), place.geometry.location.lng());
                            $('#suc-content').show();
                            $([document.documentElement, document.body]).animate({
                            }, 800);
                        }
                    });


                }
            });
            initialized = true;
        }

    }

}






function disableAutocomplete() {
    var input = document.getElementById('find-sucursales1');
    if (initialized) {
        google.maps.event.clearInstanceListeners(input);
        $('.pac-container').remove();

        initialized = false;
    }



}



google.maps.event.addDomListener(window, 'load', initialize);

$("#suc-form").submit(function (event) {
    event.preventDefault();
    getSucursales();
    initMap();

    $('#suc-content').show();
    $([document.documentElement, document.body]).animate({
        // scrollTop: $(".suc-spacer").offset().top
    }, 800);




});

//appUrl = 'https://elglobo.comcaz.com';
appUrl = 'https://0sa1.elglobo.com.mx/staging/public';

function getSucursales() {
    //var myHeaders = new Headers();
    //myHeaders.append("Authorization", "Bearer " + accessToken);
    if (notInSucList) {
        backdrop('on');
        var sucursales;
        var params = '?';

        params += "lat=" + $('#lat1').val();
        params += "&lon=" + $('#lon1').val();

        var requestOptions = {
            method: 'GET',
            //headers: myHeaders,
            redirect: 'follow'
            //mode: 'cors'
        };

        fetch(appUrl + "/shopify/getsucursales" + params, requestOptions)
            // fetch(appUrl+"/shopify/getsucursales")
            .then(response => response.json())
            .then(function (data) {
                if (data.length > 0) {
                    var botonsuc;
                    $.each(data, function (key, value) {
                        if (value.ecommerce == 1) {
                            botonsuc = '<div class="select-suc1" data-key="' + key + '">SELECCIONAR</div>';
                            console.log('si viene en 1: ' + value.ecommerce);
                        } else {
                            botonsuc = '';
                            console.log('ecomers: ' + value.ecommerce);
                        }



                        if (movil) {

                            console.log('boton movil: ' + value.ecommerce);

                            sucursales += '<tbody><tr><td class="suc-th" >' + value.nombre + '</td></tr>'
                                + '<tr>'
                                + '<td>' + value.direccion + '</td>'
                                + '</tr>'
                                + '<tr>'
                                + '<td><strong>Tel. ' + value.telefono + '</strong></td>'
                                + '</tr>'
                                + '<tr>'
                                + ' <td class="suc-th " >Horarios</td>'
                                + '</tr>'
                                + '<tr>'
                                + '<td >' + value.horario + '</td>'
                                + '</tr>'
                                + '<tr><td class="suc-th " >' + botonsuc + '</td></tr>'

                                + '</tbody>';


                        } else {
                            sucursales += '<tbody><tr><td class="suc-th" width="50%">' + value.nombre + '</td><td class="suc-th pad-left" width="50%">Horarios</td></tr>'
                                + '<tr>'
                                + '<td>' + value.direccion + '</td><td class="pad-left">' + value.horario + '</td>'
                                + '</tr>'
                                + '<tr>'

                                + '<td><strong>Tel. ' + value.telefono + '</strong></td><td></td>'
                                + '</tr>'
                                + '<tr>'
                                + '<td>' + botonsuc + '</td><td></td>'
                                + '</tr></tbody>';
                        }
                    });

                } else {
                    sucursales = '<tr>'
                        + '<td><strong>No hay sucursales cerca de esta ubicación</strong><br/></td>'
                        + '</tr>';
                }

                $('#' + tabla).html(sucursales)
                console.log(data);
                sucs = data;
                backdrop('off');
            })
            .catch(error => console.log('error', error));

    }
}




$(document).on('click', '.more-info', function () {


    var key = $(this).data('key');
    moreInfo(key)
});


$(document).on('click', '.select-suc1', function () {
    var key = $(this).data('key');
    validarHorarioSucursal(key);
});
function setSucursal(key) {
    backdrop('on');
    console.log('la key: ' + key);
    console.log('se selecciono una sucursal');
    if (notInSucList) {
        var obj = sucs[key];


    } else {

        var obj = preload_sucs[key];

    }
    sucData['selected_suc'] = obj.numero;
    sucData['selected_suc_name'] = obj.nombre;
    sucData['selected_suc_dir'] = obj.direccion;
    sucData['selected_suc_horario'] = obj.horario;
    sucData['selected_suc_tel'] = obj.telefono;
    sucData['selected_suc_lat'] = obj.lat;
    sucData['selected_suc_lon'] = obj.lon;
    setSucCookie(sucData);
    getProductos(sucData['selected_suc']);

}

function validarHorarioSucursal(key) {
    if (notInSucList) {
        var obj = sucs[key];

    } else {
        var obj = preload_sucs[key];
    }


    obj.numero;

    var params = '?';
    params += "suc=" + obj.numero;

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
            console.log('key', key);
            if (data.en_horario) {
                setSucursal(key);
            } else {
                $('modal-horario-horarios').text(data.horario_apertura + " hrs");
                $('#modal-horario-nbrsuc').text(obj.nombre);
                $('#modal-horario').fadeIn('fast').focus();
            }
        }).catch(error => console.log('error', error));
}

function moveToSuc() {
    $.post('/cart/update.js', "attributes[sucursal]=" + selected_suc);
    console.log('sucData ', sucData);
    sessionStorage.setItem('sucursal', sucData['selected_suc']);
    sessionStorage.setItem('suc_name', sucData['selected_suc_name']);
    sessionStorage.setItem('suc_dir', sucData['selected_suc_dir']);
    sessionStorage.setItem('suc_horario', sucData['selected_suc_horario']);
    sessionStorage.setItem('suc_tel', sucData['selected_suc_tel']);
    sessionStorage.setItem('suc_lat', sucData['selected_suc_lat']);
    sessionStorage.setItem('suc_lon', sucData['selected_suc_lon']);
    window.location.replace(site_url + redirectTo);

}

function checkProducts() {
    var that = this;


    var prod;
    var html = '';
    jQuery.ajax({
        type: 'GET',
        url: '/cart.js',
        data: {},
        dataType: 'json',
        success: function (response) {
            console.log(response);
            $.each(response.items, function (key, value) {
                //	if (key=='product_id') {
                /*
                $.each( value, function( key2, value2 ) {
                    console.log("key: "+key2+" value: "+value2);
             }); */

                var __FOUND = -1;
                for (var i = 0; i < that.suc_prods.length; i++) {
                    if (that.suc_prods[i].sku == value.sku) {

                        __FOUND = i;
                        break;
                    }
                }

                if (__FOUND == -1) {
                    that.no_dispon.push({ title: value.title, id: value.variant_id });
                    console.log('not found ' + value.sku);
                } else {
                    console.log('found ' + value.sku + ' in key: ' + __FOUND);
                }


            });



            if (no_dispon.length > 0) {
                console.log(no_dispon);

                $.each(that.no_dispon, function (key2, value2) {
                    html += '<p>&bull; ' + value2.title + '</p>';
                });

                $('#g-modal-cont').html(html);
                backdrop('on');
                g_modal('on');
            } else {
                moveToSuc();

            }

        },
        error: function () {
            console.log("Error de ejecucion de Ajax");
        }
    });
}


$(document).on('click', '#new-find', function () {
    event.preventDefault();
    $('#suc-content').hide();
    $([document.documentElement, document.body]).animate({
        scrollTop: $(".suc-nav").offset().top
    }, 800);

    $('#' + tabla).html('');
    $('#find-sucursales1').val('').focus();
    $('#suc-links').html('<a class="buscar-otra" id="new-find" href="#">BUSCAR OTRA SUCURSAL</a>');
});
$(document).on('click', '#back-sucs', function () {
    event.preventDefault();
    getSucursales();
    $([document.documentElement, document.body]).animate({
        scrollTop: $(".suc-spacer").offset().top
    }, 800);
    $('#suc-links').html('<a class="buscar-otra" id="new-find" href="#">BUSCAR OTRA SUCURSAL</a>');

});

$(document).on('click', '#my-position', function () {
    getLocation();
});


$(document).on('click', '.go-suc', function () {


    var key = $(this).data('key');
    setSucursal(key);


});



function initMap(lat, long) {



}



$("#find-sucursales1").focus(function () {
    if (!$("#find-sucursales1").val()) {
    }


});
$("#find-sucursales1").focusout(function () {
});

$("#find-sucursales1").keyup(function () {
});

var x = document.getElementById("my-position");
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        x.innerHTML = "Tu navegador no soporta la geolocalización.";
    }
}
function showPosition(position) {

    document.getElementById('lat1').value = position.coords.latitude;
    document.getElementById('lon1').value = position.coords.longitude;
    getSucursales();
    initMap(position.coords.latitude, position.coords.longitude);

    $('#suc-content').show();
    $([document.documentElement, document.body]).animate({
        scrollTop: $(".suc-spacer").offset().top
    }, 800);


}

function getProductos(suc) {
    console.log("productos de la sucursal: " + suc.substring(1));
    var params = '?';
    params += "suc=" + suc.substring(1);
    var that = this;
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    console.log(appUrl + "/shopify/getproductos" + params, requestOptions);
    fetch(appUrl + "/shopify/getproductos" + params, requestOptions)
        .then(response => response.json())
        .then(function (data) {
            console.log(data);
            that.suc_prods = data;
            checkProducts();


        })
        .catch(error => console.log('error', error));
}

function backdrop(_switch) {
    if (_switch == 'on') {
        $('.backdrop1').show();
    } else {
        $('.backdrop1').hide();
    }
}

function g_modal(_switch) {
    if (_switch == 'on') {
        $('#g-modal').show();
    } else {
        $('#g-modal').hide();
    }
}

$(document).on('click', '#accept-suc', function () {
    g_modal('off');

    var j = '';
    var coma;
    for (var i = 0; i < no_dispon.length; i++) {
        if (i < (no_dispon.length - 1)) {
            coma = '&'
        } else {
            coma = '';
        }

        j += 'updates[' + no_dispon[i].id + ']=0' + coma;
    }

    if ($.post('/cart/update.js', j)) {
        moveToSuc();
        console.log(no_dispon);
        console.log('j: ' + j);

    } else {

        console.log('no se vacio el carrito');

    }


});

$(document).on('click', '#cancel-suc', function () {
    g_modal('off');
    backdrop('off');
    no_dispon = [];

});

function removeItems(variantId) {

    jQuery.ajax({
        type: 'POST',
        url: '/cart/update.js',
        data: {
            items: [
                {
                    quantity: 0,
                    id: variantId
                }
            ]
        },
        dataType: 'json',
        success: function (response) {
            console.log(response);
            if (typeof response.items !== "undefined") {
                console.log("carrito actualizado");
            } else {
                console.log("carrito NO actualizado");
            }
        },
        error: function () {
            console.log("Error de ejecucion de Ajax");
        }
    });

}

$(document).ready(function () {
    $("button.announcement-bar__button.hidden-phone").mouseenter(function () {
        console.log("mouseenter");
        $(".dropdown-content").show();
    });
    $("button.announcement-bar__button.hidden-phone").mouseleave(function () {
        console.log("mouseleave");
        $(".dropdown-content").hide();
    });
    navigator.geolocation.getCurrentPosition(function (position) {
        notInSucList = true;
        initialized = false;
        initMap(position.coords.latitude, position.coords.longitude);
        document.getElementById('lat1').value = position.coords.latitude;
        document.getElementById('lon1').value = position.coords.longitude;
        getSucursales();

    });
    initMap(19.432608, -99.133209);
    backdrop('on');
    var sucursales;
    var params = '?';

    params += "lat=" + $('#lat1').val();
    params += "&lon=" + $('#lon1').val();
    var requestOptions = {
        method: 'GET',
        //headers: myHeaders,
        redirect: 'follow'
        //mode: 'cors'
    };

    fetch(appUrl + "/shopify/getsucursales")
        .then(response => response.json())
        .then(function (data) {
            if (data.length > 0) {
                var sucvalues;
                $.each(data, function (key, value) {
                    sucvalues = [];
                    sucvalues['tipo'] = value.tipo;
                    sucvalues['nombre'] = value.nombre;
                    sucvalues['direccion'] = value.direccion;
                    sucList[key] = sucvalues;
                });
                console.log('sucList ', sucList);


            } else {
                sucursales = '<tr>'
                    + '<td><strong>No hay sucursales cerca de esta ubicación</strong><br/></td>'
                    + '</tr>';
            }

            $('#' + tabla).html(sucursales)

            preload_sucs = data;
            backdrop('off');
        })
        .catch(error => console.log('error', error));

});






function autocomplete(inp, arr) {

    var currentFocus;

    inp.addEventListener("input", function (e) {
        var a, b, i, val = this.value;

        closeAllLists();
        if (!val) {
            return false;


        }


        var suc_tring;

        currentFocus = -1;

        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list1");
        a.setAttribute("class", "autocomplete-items1");

        this.parentNode.appendChild(a);

        for (i = 0; i < arr.length; i++) {

            var regex = new RegExp(val.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ""), 'g');

            var suc_string = arr[i]['tipo'] + ' ' + arr[i]['nombre'] + ' ' + arr[i]['direccion'];


            if (suc_string.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").match(regex)) {


                b = document.createElement("DIV");

                b.innerHTML = arr[i]['nombre'].toLowerCase();

                b.innerHTML += "<input type='hidden' value='" + arr[i][' nombre'] + "' data-key='" + i + "'>";

                b.addEventListener("click", function (e) {

                    inp.value = this.getElementsByTagName("input")[0].value;
                    var suc_input = this.getElementsByTagName("input")[0];


                    closeAllLists(this.getElementsByTagName("input")[0].value);


                    selectListSuc(suc_input.getAttribute('data-key'))
                });
                a.appendChild(b);
            }
        }

        if (b == null) {
            console.log('no se encontro')
            console.log(initialized);
            if (!initialized) {
                notInSucList = true;
                initialize();
            }


        } else {
            notInSucList = false;
            disableAutocomplete();
        }
    });



    inp.addEventListener("keydown", function (e) {
        var x = document.getElementById(this.id + "autocomplete-list1");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {

            currentFocus++;

            addActive(x);
        } else if (e.keyCode == 38) { //up

            currentFocus--;

            addActive(x);
        } else if (e.keyCode == 13) {

            e.preventDefault();
            if (currentFocus > -1) {

                if (x) x[currentFocus].click();
            }
        }
    });
    function addActive(x) {

        if (!x) return false;

        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);

        x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {

        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }
    function closeAllLists(elmnt) {

        var x = document.getElementsByClassName("autocomplete-items1");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }

    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}




autocomplete(document.getElementById("find-sucursales1"), sucList);


function selectListSuc(key) {


    var sucursales;

    var value = preload_sucs[key];

    initMap(parseFloat(value.lat), parseFloat(value.lon));



    if (value.ecommerce == 1) {
        botonsuc = '<div class="select-suc1" data-key="' + key + '">SELECCIONAR</div>';

    } else {
        botonsuc = '';
        console.log('ecomers: ' + value.ecommerce);
    }

    if (movil) {

        console.log('boton movil: ' + value.ecommerce);

        sucursales += '<tbody><tr><td class="suc-th" >' + value.nombre + '</td></tr>'
            + '<tr>'
            + '<td>' + value.direccion + '</td>'
            + '</tr>'
            + '<tr>'
            + '<td><strong>Tel. ' + value.telefono + '</strong></td>'
            + '</tr>'
            + '<tr>'
            + ' <td class="suc-th " >Horarios</td>'
            + '</tr>'
            + '<tr>'
            + '<td >' + value.horario + '</td>'
            + '</tr>'
            + '<tr><td class="suc-th " >' + botonsuc + '</td></tr>'

            + '</tbody>';


    } else {
        sucursales += '<tbody><tr><td class="suc-th" width="50%">' + value.nombre + '</td><td class="suc-th pad-left" width="50%">Horarios</td></tr>'
            + '<tr>'
            + '<td>' + value.direccion + '</td><td class="pad-left">' + value.horario + '</td>'
            + '</tr>'
            + '<tr>'

            + '<td><strong>Tel. ' + value.telefono + '</strong></td><td></td>'
            + '</tr>'
            + '<tr>'
            + '<td>' + botonsuc + '</td><td></td>'
            + '</tr></tbody>';
    }


    $('#' + tabla).html(sucursales)

}

