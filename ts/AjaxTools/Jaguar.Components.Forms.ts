namespace Jaguar.Components.Forms
{
    /**
    * Enlaza todos los formularios que contengan la clase ".form-ajax" a una función que controlará su envío.
    * @param dialogObject
    */
    export function Bind(dialogObject: JQuery): void
    {
        var counter = 0;

        $(".form-ajax", dialogObject).each(function (index, element: Element) {
            var formElement = $(element);

            if (ComponentIsNotBinded(formElement)) {                    
                InternalBindElement(formElement, dialogObject);
                counter++;
            }
        });

        console.info("Se han enlazado %s formularios para que sean enviados por medio de AJAX.", counter);
    }

    /**
     * Enlaza el formulario a la función que controlará su proceso.         
     * @param formElement Formulario a enlazar.
     * @param dialogObject Contenedor del formulario.
     */
    export function InternalBindElement(formElement: JQuery, dialogObject: JQuery): void {
        // Marcar como elemento enlazado.
        formElement.attr("data-ajax", "Yes");

        // Configuro el componente al tipo: "form" para futuros cambios.
        dialogObject.attr("data-component", "form");

        $(formElement).submit(function (event : JQueryEventObject)
        {
            // Poner en espera el formulario antes de enviarlo.
            ShowLoading(dialogObject);

            // Enviar el formulario via AJAX.
            OnSubmit(event, formElement, dialogObject);

            // Evitar que el evento continue.
            event.preventDefault();
            return false;
        });
    }

    /**
     * Convierte la información del formulario en una secuencia que se puede enviar como AJAX y la envía al servidor.
     * @param event Información del evento que ocurre cuando el usuario intenta enviar el formulario.
     * @param form Elemento del formulario que será utilizado en el envio de la información.
     * @param dialogObject Es el dialogo contenedor del formulario.
     */
    export function OnSubmit(event: JQueryEventObject, form: JQuery, dialogObject: JQuery): void
    {
        // Determinar información del formulario.
        var ajaxSettings: JQueryAjaxSettings = {
            url: form.attr("action"),
            method: form.attr("method"),
            data: form.serialize()
        };
        
        // Realizar la solicitud.
        $.ajax(ajaxSettings).done(function (response: AjaxResponseRaw, textStatus: string, jqXHR: JQueryXHR) {
            Web.ProcessResponse(response, textStatus, jqXHR, dialogObject, "form");
        }).fail(function (jqXHR : JQueryXHR, textStatus : string, err : string) {
            Web.ConnectionFailed(jqXHR, textStatus, err, dialogObject, "form");
        });
    }

    /**
     * Cierra la ventana una vez que la solicitud ha finalizado, siempre y cuando la respuesta sea JSON o Automatic.
     * @param initializerObject Contenedor del formulario o enlace que lanzó la ventana.
     * @param data Respuesta de la solicitud.
     */
    export function OnLoad(initializerObject: JQuery, data: AjaxResponse) {
        // Verificar el tipo de la respuesta.
        if (data.Type == ResponseType.HTML)
        {
            console.log("La respuesta es HTML, la ventana de mantenerse abierta.");            
            if (initializerObject.hasClass("modal-body"))
            {
                console.log("Reenlazando elementos de la ventana.");
                Links.OnLoad(initializerObject, data);
            }

            return;
        }


        // Verificar si el "initializerObject" es una ventana modal para cerrarla.
        // El contenido siempre es renderizado en el DIV anidado con la clase ".modal-body", sea un marco o una llamada AJAX.        
        if (initializerObject.hasClass("modal-body"))
        {
            // Es una ventana modal.
            // Obtiene modal-body > modal-content > modal-dialog > modal
            var modalObject = initializerObject.parent().parent().parent();

            // Cerrar la ventana modal.
            modalObject.modal('hide');

            // El enlace que esta enlazado se encuentra en el atributo "data-source".
            var linkObject = $("#" + modalObject.attr("data-source"));

            // Finalizar el proceso, permitiendo que se ejecute el callback esperado.
            Components.OnLoad(linkObject, data);
            
            return;
        }

        Components.OnLoad(initializerObject, data);
    }
}