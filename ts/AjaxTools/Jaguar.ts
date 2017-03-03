namespace Jaguar {
    /*    
     * Determina la versión del archivo.
     */
    export var version = "2.0.6";

    export type ComponentType = "default" | "form" | "panel" | "link";

    /**
     * Determina el mensaje que será enviado en caso de una solicitud incorrecta.
     */
    export var ajaxError : string = "<div class=\"alert alert-danger\"><span class=\"fa fa-warning\"></span> Lo sentimos, algo esta funcionando mal, actualice la página e intente nuevamente.</div>";
    
    /**
     * Prepara la respuesta.
     */
    export function parseJsonResponse(serverResponse: any): AjaxResponse
    {
        var results: AjaxResponse = new AjaxResponse();
        results.Status = "Ok";
        results.Response = {};
        results.Type = ResponseType.Other;
        
        console.log("Normalizando respuesta del servidor", serverResponse);
        for (var key in serverResponse) {
            results.Response[key] = serverResponse[key];
        }

        return results;
    }

    /**
     * Genera un nuevo identificador del enlace en base a una letra aleatorio y el segundo actual.
     */
    export function generateId(preffix?:string) : string {
        var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        return (preffix || "") + randLetter + Date.now();
    }
    
    /**
    * Determina si en enlace no ha sido enlazado como un componente ajax.
    * @param {JQuery} ajaxComponent Componente a verificar.
    */
    export function ComponentIsNotBinded(ajaxComponent: JQuery) {
        return ajaxComponent.attr("data-ajax") !== "Yes";
    }

    /**
        * Agrega la clase ".loading" al elemento para notificar el usuario que el contenido se esta cargando.
        * @param dialogObject Elemento a marcar.
        */
    export function ShowLoading(dialogObject : JQuery): void {
        dialogObject.empty();
        dialogObject.html("<br />");        
        dialogObject.addClass("loading");
    }    
}
