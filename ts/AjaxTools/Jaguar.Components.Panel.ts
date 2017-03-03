module Jaguar.Components.Panel
{    
    /**
     * Carga el contenido definido en la clase ".data-url" en todos los elementos que contengan la clase ".panel-ajax".
     */
    export function Bind(dialogObject?: JQuery)
    {
        var counter = 0;

        $(".panel-ajax", dialogObject).each(function(index: number, element: Element)
        {
            var panelObject = $(element);
            
            if (!panelObject.attr("id")) {
                panelObject.attr("id", generateId());
            }
            
            console.log(panelObject.attr("id"), "Verificando que el componente se encuentre enlazado");
            if (ComponentIsNotBinded(panelObject)) {
                console.log(panelObject.attr("id"), "El componente no se encuentra enlazado, se actualizará");
                Update(panelObject);
                counter++;
            }
        });

        console.info("Se han enlazado %s paneles", counter);
    }

    /**
     * Actualiza un panel cargando el contenido de la URL definida en el atributo "data-url".
     * @param panelObject Objeto o identificador del panel a actualizar.
     */
    export function Update(panelObject: JQuery)
    {
        // Asignar el objeto desde el identificador en su caso.
        if (typeof panelObject === "string") {
            panelObject = $(`#${panelObject}`);
        }

        // Configuro el componente para evitar que sea cargado nuevamente.
        panelObject.attr("data-ajax", "Yes");

        // Configuro el componente al tipo: "panel" para futuros cambios.
        panelObject.attr("data-component", "panel");

        // Obtengo la ruta de acceso al recurso.
        var url = panelObject.attr("data-url");

        // Determinar si el contenido será reemplazado por una animación durante la carga del nuevo contenido.
        var showLoading : boolean = (panelObject.attr("data-load") || "animation") === "animation";

        // Configuro la interfaz para mostrar una animación.
        if (showLoading) {
            ShowLoading(panelObject);
        }

        // Determinar información del formulario.
        var ajaxSettings: JQueryAjaxSettings = {
            url: url
        };

        // Realizar la solicitud.
        console.log(panelObject.attr("id"), "Solicitando página web al servidor");
        $.ajax(ajaxSettings).done(function (response: AjaxResponseRaw, textStatus: string, jqXHR: JQueryXHR) {
            console.log(panelObject.attr("id"), "La solicitud ha finalizado para el panel y se comienza a renderizar.");
            Web.ProcessResponse(response, textStatus, jqXHR, panelObject, "panel");
        }).fail(function (jqXHR: JQueryXHR, textStatus: string, err: string) {
            console.log(panelObject.attr("id"), "La solicitud ha fallado, verifique el error en la consola.");
            Web.ConnectionFailed(jqXHR, textStatus, err, panelObject, "panel");
        });
    }

    export function OnLoad(panelObject: JQuery, data: AjaxResponse) {
        console.log(panelObject.attr("id"), "Renderización completa, verificando si se debe ejecutar una función adicional.", data);
        Components.OnLoad(panelObject, data);

        // Una vez cargado y renderizado, es importante revisar si el panel contiene más controles ajax.
        console.info(panelObject.attr("id"), "Revisando si existen controles adicionales que requieran ser enlazados.");
        Components.Bind(panelObject);
    }
}