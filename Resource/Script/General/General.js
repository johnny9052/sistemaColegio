$(document).ready(function () {
    //Parametrizacion del modal
    $('.modal-trigger').leanModal({
        dismissible: false, // Modal can be dismissed by clicking outside of the modal
        opacity: .5, // Opacity of modal background
        in_duration: 300, // Transition in duration
        out_duration: 200, // Transition out duration
        ready: function () {
        }, // Callback for Modal open
        complete: function () {
        } // Callback for Modal close
    }
    );

    $('select').material_select();

    $('.datepicker').pickadate({
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 15, // Creates a dropdown of 15 years to control year
        onSet: function () {
            this.close();//Cuando selecciona una fecha, cierra automaticamente
            //el calendario
        },
        format: 'yyyy-mm-dd',
        container: 'body'//Con esto se evita que cuando esta en un modal, 
                //quede oculto detras del modal 
    });

    //Inicializa los carruseles de la pagina
    $(document).ready(function () {
        $('.slider').slider({full_width: true});
    });
});


/**
 * Muestra un mensaje en un toast 
 * @param {String} message Mensaje a mostrar en la ventana emergente
 * @returns {void} 
 * @author Johnny Alexander Salazar
 * @version 0.1
 */
function showToast(message) {
    Materialize.toast(message, 2000);
}



/**
 * Muestra un mensaje en un toast con bordes redondeados
 * @param {String} message Mensaje a mostrar en la ventana emergente
 * @returns {void} 
 * @author Johnny Alexander Salazar
 * @version 0.1
 */
function showRoundedToast(message) {
    Materialize.toast(message, 2000, 'rounded');
}


/**
 * Muestra u oculta una barra de progreso
 * @param {boolena} status Se indica con true y false si se muestra o no la barra de progreso
 * @returns {void} 
 * @author Johnny Alexander Salazar
 * @version 0.1
 */
function showLoadBar(status) {

    if (status) {
        $(".progress").show();
    } else {

        $(".progress").hide();
    }
}


/**
 * Ejecuta una funcion por Ajax
 * @param {Array} dataSend Array nombrado con los datos a enviar
 * @param {String} url Paquete y nombre del controlador a ejecutar
 * @param {String} before Codigo javascript que se quiere ejecutar antes de enviar la informacion
 * @param {String} success Codigo javascript que se quiere ejecutar cuando se recibe una respuesta
 * @returns {void} 
 * @author Johnny Alexander Salazar
 * @version 0.2
 */
function Execute(dataSend, url, before, success) {

    $.ajax({
        type: 'post',
        url: "Controller/" + url + ".php",
        beforeSend: function () {
            showLoadBar(true);
            if (before !== "") {
                eval(before);
            }
        },
        data: dataSend,
        success: function (data) {
            //alert(data);
            //$("#txtDireccionPedido").val(data);
            showLoadBar(false);
            var info = eval("(" + data + ")");
            var response = (info.res !== undefined) ? info.res : info[0].res;
            var msg = (info.msg !== undefined) ? info.msg : "";
            switch (response) {

                case "Success":
                    /*Funcion que refresca la pagina*/
                    showToast(info.msg);

                    if (success !== "") {
                        /*Si en la estructura enviada se tienen datos, entonces
                         * se sacan, parseandolos como objetos*/
                        info = (info.data !== undefined || info.data !== "") ? eval("(" + info.data + ")") : info;
                        eval(success);
                    }

                    break;

                case "NotInfo":
                    if (success !== "") {
                        info = "";
                        eval(success);
                    }
                    break;

                case "Error":
                    showToast(info.msg);
                    break;
                case undefined:
                default :
                    /*En el caso de que sea un listar info, buscar o pintar menu*/
                    if (dataSend.action === "list" || dataSend.action === "menu" || dataSend.action === "search"
                            || dataSend.action === "detail" || dataSend.action.indexOf("load") > -1) {
                        if (success !== "") {
                            eval(success);
                        }
                    }

                    break;
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            showToast("Error detectado: " + textStatus + "\nExcepcion: " + errorThrown);
            showToast("Verifique la ruta del archivo");
        }
    });
}



/**
 * Scanea un formulario, detecta los input tipo text y password, y añade
 * sus valores a un array para ser enviados por post. Adicionalmente añade por 
 * defecto el valor type mandado por parametro 
 * @param {String} type : Accion que se ejecutara en el server
 * @param {String} form : Id del formulario donde se encuentran los inputs
 * @param {Array} dataPlus : Array con datos adicionales, la primera posicion
 * de cada objeto en cada posicion del array, es el nombre que se le asignara
 * a dichos datos
 * @param {Boolean} status : Determina si escanea los campos del formulario
 * @returns {Object} Objeto o array nombrado que se enviara por POST
 * @author Johnny Alexander Salazar
 * @version 0.3
 */
function scanInfo(type, status, form, dataPlus) {
    var arrayParameters = new Array();
    form = defualtForm(form);
    arrayParameters.push(newArg("action", type));

    /*Inputs sencillos*/
    if (status) {
        var campos = '#' + form + ' :input,\n\
                 #' + form + ' select, \n\
                 #' + form + ' textarea';
//        var campos = '#' + form + ' :input:text,\n\
//                  #' + form + ' :input:password, \n\
//                  #' + form + ' textarea, \n\
//                  #' + form + ' select';

        $(campos).each(function () {
            var elemento = this;
            /*Si es un radio, retornamos 1 si esta checkeado, 0 si no*/
            if (elemento.type === "checkbox") {
                arrayParameters.push(newArg(elemento.name, (elemento.checked) ? 1 : 0));
            } else {
                arrayParameters.push(newArg(elemento.name, elemento.value));
            }

            //alert("detectado");
        });
    }

    //SI EXISTE INFO ADICIONAL
    if (dataPlus !== undefined) {
        if (dataPlus.length > 0) {
            for (var x in dataPlus) {
                var valTemp = new Array();
                for (var y in dataPlus[x].datos) {
                    valTemp.push(dataPlus[x].datos[y]);
                }
                var nombreData = valTemp.shift();
                arrayParameters.push(newArg(nombreData, valTemp.toString()));
            }
        }

    }

    //alert(arrayToObject(arrayParameters));
    return arrayToObject(arrayParameters);
}



/**
 * Ingresa un codigo html al listado general
 * @param {String-html} info : html con la tabla
 * @param {String} id : Id del contenedor de la lista
 * @author Johnny Alexander Salazar
 * @version 0.3
 */
function buildPaginator(info, id) {
    id = DefaultTableList(id);
    $("#" + id).html(info[0].res);
}


/**
 * Carga un combo especificado, con los datos que se envian por parametro
 * @param {json} info : Datos que seran agragados
 * @param {int} idSelect : Id del select
 * @author Johnny Alexander Salazar
 * @version 0.3
 */
function buildSelect(info, idSelect) {

    //alert(info);

    var combo = document.getElementById(idSelect);

    while (combo.length > 1) {
        combo.remove(combo.length - 1);
    }

    for (var x in info) {
        combo.options[combo.length] = new Option(info[x].nombre, info[x].id);
    }

    refreshSelect(idSelect, -1);
}


/**
 * Refresca un select
 * @param {string} id : id del select a refrescar
 * @param {string} val : valor por defecto que sera seleccionado
 * @author Johnny Alexander Salazar
 * @version 0.1
 */
function refreshSelect(id, val) {
    $("#" + id).val(val);
    $('#' + id).material_select('destroy');
    $('#' + id).material_select();
}


/**
 * Valida todos los inputs required de un formulario (si recibe el parametro
 * tomara el id, si no evaluara el form "fMain"), para determinar si son 
 * validos o no, si no son validos muestra un mensaje emergente con los campos
 * que se solicita que sean llenados
 * @param {String} form id del formulario
 * @returns {boolean} true si es correctamente validado, false si tiene errores
 * en la validacion
 * @author Johnny Alexander Salazar
 * @version 0.3
 */
function validateForm(form) {
    var status = true;
    form = defualtForm(form);


    var campos = '#' + form + ' :input,\n\
                 #' + form + ' select, \n\
                 #' + form + ' textarea';

    $(campos).each(function () {
        var elemento = this;

        /*Si es un select se valida que no sea -1*/
        if (elemento.type === "select-one") {
            if (elemento.value === "-1") { //es valido?                                   
                $("#" + elemento.id).addClass("invalid");
                status = false; // si no es valido retorne falso                               
            } else {
                $("#" + elemento.id).removeClass("invalid");
            }
        } else {
            /*Si es cualquier otro elementos diferente a select*/
            if (!elemento.validity.valid) { //es valido?                                   
                $("#" + elemento.id).addClass("invalid");
                status = false; // si no es valido retorne falso                               
            } else {
                $("#" + elemento.id).removeClass("invalid");
            }
        }

    });

    if (!status) {
        showToast("Ingrese o valide los datos requeridos");
    }

    return status;
}




/**
 * Prepara un dato para ser añadido al array de datos que seran enviados por 
 * ajax
 * @param {String} key Nombre del dato
 * @param {String} value Valor del dato
 * @returns {String} el dato codificado
 * @author Johnny Alexander Salazar
 * @version 0.2
 */
function newArg(key, value) {
    return key + "=" + value;
}



/**
 * Determina si debe o no colocar el form generico, si no recibe
 * un parametro tomara el id como "FormContainer"
 * @param {String} form id del formulario
 * @returns {String} id del form generico si no recibe parametro
 * @author Johnny Alexander Salazar
 * @version 0.2
 */
function defualtForm(form) {
    return (form === undefined || form === "") ? 'FormContainer' : form;
}


/**
 * Convierte un array de datos a un objeto, y debe tener separado el nombre de
 * la futura variable y su valor por = 
 * @param {Array} arrayParameters : Array que sera pasado a un objeto
 * @returns {Object} Objeto o array nombrado que se enviara por POST
 * @author Johnny Alexander Salazar
 * @version 0.1
 */
function arrayToObject(arrayParameters) {
    var myObj = new Object;
    for (var x in arrayParameters) {
        myObj[((arrayParameters[x]).split("="))[0]] = ((arrayParameters[x]).split("="))[1];
    }
    return myObj;
}


/**
 * Limpia los input tipo text, password, label de error, textarea de un formulario, si no recibe
 * un parametro tomara el id como "FormContainer"
 * @param {String} form id del formulario
 * @returns {void}
 * @author Johnny Alexander Salazar
 * @version 0.2
 */
function cleanForm(form) {

    form = DefaultModal(form);

    var campos = '#' + form + ' :input,\n\
                 #' + form + ' select, \n\
                 #' + form + ' textarea';


//    var campos = '#' + form + ' :input:text,\n\
//                  #' + form + ' :input:password, \n\
//                  #' + form + ' :input:email, \n\
//                  #' + form + ' textarea';

    $(campos).each(function () {
        var elemento = this;
        if (elemento.value) {
            /*Si es un select, coloca el -1*/
            if (elemento.type === "select-one") {
                $("#" + elemento.id).val("-1");
                $('#' + elemento.id).material_select('destroy');
                $('#' + elemento.id).material_select();
            } else {
                $("#" + elemento.id).val("");
            }

        }
        /*Si esta pintado como invalido se le quita*/
        $("#" + elemento.id).removeClass("invalid");
    });

}




/**
 * A partir de los menus de la base de datos, los genera y los pinta en pantalla
 * @param {Array} data JSON con la informacion de la base de datos
 * @returns {void}
 * @author Johnny Alexander Salazar
 * @version 0.1
 */
function BuildMenu(data) {

    data = eval(data);
    var padres = new Array();
    /*Se sacan los codigos de los padres*/
    for (var x in data) {
        if (data[x].codpadre === "-1") {
            padres.push({id: data[x].id, nombre: data[x].nombre, prioridad: data[x].prioridad, hijos: ""});
        }
    }

    /*Por cada padre se sacan sus hijos*/
    for (var x in padres) {
        var temp = new Array();
        for (var y in data) {
            if (padres[x].id === data[y].codpadre) {
                temp.push([{id: data[y].id, nombre: data[y].nombre, prioridad: data[y].prioridad, codigo: data[y].codigo}]);
            }
        }
        padres[x].hijos = temp;
    }

    var menu = "";
    /*Se pinta el menu*/
    for (var x in padres) {

        //SI TIENE HIJOS PINTA EL PADRE Y SUS HIJOS
        if (padres[x].hijos.length > 0) {
            //INICIA EL PADRE
            menu += '<li class="no-padding"><ul class="collapsible collapsible-accordion"><li>';
            menu += '<a class="collapsible-header">' + padres[x].nombre + '<i class="mdi-navigation-arrow-drop-down"></i></a>';
            menu += '<div class="collapsible-body"><ul>';
            for (var y in padres[x].hijos) {
                //SE AÑADE CADA HIJO POR CADA PADRE
                menu += '<li><a href="index.php?page=estudiantes">' + padres[x].hijos[y].nombre + '</a></li>';
                //SE CIERRA EL HIJO
            }
            menu += '</ul></div></li></ul></li>';
            //SE CIERRA EL PADRE
        }
    }

    //CERRAR SESION
    menu += '<li class="left"><a href="#" id="btnDesconectar" class="right" onclick="LogOut();">Cerrar sesion<i class="small mdi-action-account-circle"></i></a></li>';
    $("#slide-out").html(menu);
}


/**
 * Cierra el modal que se especique
 * @param {String} idModal id del modal a cerrar
 * @returns {void}
 * @author Johnny Alexander Salazar
 * @version 0.1
 */
function closeWindow(idModal) {
    idModal = DefaultModal(idModal);
    $('#' + idModal).closeModal();
    cleanForm(idModal);
}


/**
 * Navega entre modales
 * @param {String} close id del modal a cerrar
 * @param {String} open id del modal a abrir
 * @returns {void}
 * @author Johnny Alexander Salazar
 * @version 0.1
 */
function goNavigation(close, open) {
    $('#' + close).closeModal();
    $('#' + open).openModal();
}


/**
 * Abre el modal que se especifique
 * @param {String} idModal id del modal a cerrar
 * @returns {void}
 * @author Johnny Alexander Salazar
 * @version 0.1
 */
function openWindow(idModal) {
    idModal = DefaultModal(idModal);
    $('#' + idModal).openModal();
}

/**
 * Retorna el id del modal por defecto si no se le especifica uno 
 * @param {int} idModal : Id del modal
 * @author Johnny Alexander Salazar
 * @version 0.1
 */
function DefaultModal(idModal) {
    return (idModal === undefined || idModal === "") ? 'ModalNew' : idModal;
}



/**
 * Retorna el id del paginador por defecto si no se le especifica uno 
 * @param {int} idTable : Id del contenedor
 * @author Johnny Alexander Salazar
 * @version 0.1
 */
function DefaultTableList(idTable) {
    return (idTable === undefined || idTable === "") ? 'TblList' : idTable;
}


/**
 * Oculta o muestra las acciones de un formulario segun se necesiten
 * @param {boolean} status : Indica si se muestra las acciones de guardar o de 
 * editar y eliminar
 * @author Johnny Alexander Salazar
 * @version 0.1
 */
function showButton(status) {
    if (status) {
        $(".newActionButton").show();
        $(".updateActionButton").hide();
    } else {
        $(".newActionButton").hide();
        $(".updateActionButton").show();
    }
}


/**
 * Redirecciona a otro formulario del sistema
 * @param {string} url : Ruta archivo a abrir
 * @author Johnny Alexander Salazar
 * @version 0.1
 */
function refreshPage(url) {
    window.location.href = "Helper/Content/Content.php?page=" + url;
}



/**
 * Valida si se ha realizado una busqueda previa, validando si el campo por defecto
 * se encuentra bien, o si se especifica por parametro el campo que se desea validar,
 * lo valida
 * @param {string} id : id del campo a validar si se desea uno diferente al que se valida
 * por defecto
 * @author Johnny Alexander Salazar
 * @version 0.1
 */
function validateSearch(id) {

    id = (id === undefined || id === "") ? 'txtId' : id;

    if ($("#" + id).val() !== "") {
        return true;
    } else {
        showToast("No se ha realizado una busqueda previa");
        return false;
    }
}




/**
 * Muestra en un modal el detalle de un conjunto de registros
 * @param {string - JSON} info : Informacion en formato JSON que se desea mostrar
 * @param {string} idList : Id de la tabla contenedora
 * @param {string} idModal : Id del modal que se abrira para mostrar el detalle
 * @author Johnny Alexander Salazar
 * @version 0.1
 */
function showDetail(info, idList, idModal) {

    idList = (idList === undefined || idList === "") ? 'TblListDetail' : idList;
    idModal = (idModal === undefined || idModal === "") ? 'ModalDetail' : idModal;

    buildPaginator(info, idList);
    openWindow(idModal);

    showButton(false);
}
