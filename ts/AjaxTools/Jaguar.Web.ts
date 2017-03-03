namespace Jaguar.Web
{
    /**
     * Establece el contenido de la ventana que abrió el formulario.
     */
    export function SetContent(dialogObject: JQuery, dialogContent: any): void {
        dialogObject.empty();
        dialogObject.removeClass("loading");
        dialogObject.html(dialogContent);
    }

    export function ProcessResponse(response: string | AjaxResponseRaw, textStatus: string, jqXHR: JQueryXHR, ajaxComponent: JQuery, componentType : ComponentType): void {
        // Es posible que la respuesta, sea nuevamente otro formulario.
        // En ese escenario, se deben enlazar nuevamente el formulario con los eventos.
        var isJson = (jqXHR.getResponseHeader("Content-Type") || "").substring(0, 16) === "application/json";            
        var isAutomaticResponse = response === "Ok";
        var isHtml = !isJson && !isAutomaticResponse;
        var serverResponse: AjaxResponse = new AjaxResponse();
        serverResponse.Status = "Ok";

        if (isAutomaticResponse) {
            console.log(ajaxComponent.attr("id"), "La respuesta es de tipo automática");
            serverResponse.Type = ResponseType.Automatic;
        }

        if (isJson) {
            console.log(ajaxComponent.attr("id"), "La respuesta es de tipo JSON.");
            serverResponse = parseJsonResponse(<AjaxResponseRaw>response);
            serverResponse.Type = ResponseType.JSON;
        }

        if (isHtml)
        {
            console.log(ajaxComponent.attr("id"), "La respuesta es de tipo HTML");
            SetContent(ajaxComponent, response);
            serverResponse.Type = ResponseType.HTML;
        } 

        console.log("Se ha finalizado una solicitud a página web via AJAX", ajaxComponent, serverResponse, componentType);

        // Notificar al contenedor que se ha finalizado el proceso.
        switch (componentType) {
            case "panel":
                Components.Panel.OnLoad(ajaxComponent, serverResponse);
                break;
            case "link":
                Components.Links.OnLoad(ajaxComponent, serverResponse);
                break;
            case "form":
                Components.Forms.OnLoad(ajaxComponent, serverResponse);
                break;
        }
    }    

    /**
     * Muestra un mensaje de error en la ventana.
     * @param {JQueryXHR} jqXHR Información sobre la conexión.
     * @param {string} textStatus Mensaje corto del error.
     * @param {string} err Mensaje completo del error.
     * @param {JQuery} dialogObject Ventana contenedora del formulario.
     */
    export function ConnectionFailed(jqXHR : JQueryXHR, textStatus : string, err : string, ajaxComponent: JQuery, componentType : ComponentType) {
        // La conexión ha fallado.
        var errorMsg = ajaxError;

        console.warn(ajaxComponent, "La conexión a la página ha fallado", err, componentType);
        if (componentType == "link") {
            errorMsg += `<button class="btn btn-default btn-close" type="button">Cerrar</button>`;
        }

        SetContent(ajaxComponent, errorMsg);        

        if (componentType == "link") {            
            Components.Links.OnLoad(ajaxComponent, { Status: "Error", Response: null, Type: ResponseType.Other });
        }
    }
    
    export function LoadFrameContent(url: string, ajaxComponent: JQuery, componentType : ComponentType)
    {
        var id = generateId("jg");
        var frameId = `f${id}`;
        var frameContainerId = `c${id}`;
        var htmlContent = `<div id="${frameContainerId}" style="display: none;" >
<iframe id ="${frameId}" width="100%" height="349" frameborder="0"></iframe>
<button class="btn btn-default btn-close" type="button">Cerrar</button></div>`;

        // Determinar si al cuadro ya esta cargado previamente.
        if (!$(`#${frameContainerId}`, ajaxComponent).length)
        {
            // Establecer cuadro en el contenido, este será invisible hasta que se haya cargado.
            Web.SetContent(ajaxComponent, htmlContent);

            // Mostrar mensaje de espera en el cuadro.
            ajaxComponent.addClass("loading");
            
            $(`#${frameId}`).load(function (event: JQueryEventObject) {
                // TODO: Controlar errores al cargar la página web por medio de un recuadro.
                // if (event.data) {
                // Web.ConnectionFailed(jqXHR, "Error", status, ajaxComponent, componentType);
                //return;
                // }

                // Hacer visible el cuadro.
                console.log("La página web ha devuelto el contenido solicitado.");
                ajaxComponent.removeClass("loading");
                $(`#${frameContainerId}`).css("display", "block");

                // Notificar al contenedor que se ha finalizado el proceso.
                switch (componentType) {
                    case "panel":
                        Components.Panel.OnLoad(ajaxComponent, { Status: "Ok", Response: null, Type: ResponseType.HTML });
                        break;
                    case "link":
                        Components.Links.OnLoad(ajaxComponent, { Status: "Ok", Response: null, Type: ResponseType.HTML });
                        break;
                    case "form":
                        Components.Forms.OnLoad(ajaxComponent, { Status: "Ok", Response: null, Type: ResponseType.HTML });
                        break;
                }
            });

            // Realizar la solicitud.
            console.log("Solicitando la página web al servidor.");
            $(`#${frameId}`).attr("src", url);
        }
    }

    export function Load(url: string, dialogObject: JQuery, componentType : ComponentType)
    {
        // Configuro la interfaz para mostrar una animación.
        ShowLoading(dialogObject);

        // Determinar información del formulario.
        var ajaxSettings: JQueryAjaxSettings = {
            url: url
        };

        // Realizar la solicitud.
        $.ajax(ajaxSettings).done(function (response: AjaxResponseRaw, textStatus: string, jqXHR: JQueryXHR) {
            ProcessResponse(response, textStatus, jqXHR, dialogObject, componentType);
        }).fail(function (jqXHR : JQueryXHR, textStatus : string, err : string) {
            ConnectionFailed(jqXHR, textStatus, err, dialogObject, componentType);
        });
    }
}