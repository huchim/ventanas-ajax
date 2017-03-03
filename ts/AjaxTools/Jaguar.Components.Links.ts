module Jaguar.Components.Links
{
    /**
        * Enlaza todos los enlaces a una ventana modal.
        * @param dialogObject Contenedor de los enlaces.
        */
    export function Bind(dialogObject?: JQuery)
    {
        var counter = 0;

        $(".link-ajax", dialogObject).each(function(index: number, element: Element)
        {
            var linkObject = $(element);
            
            if (!linkObject.attr("id")) {
                linkObject.attr("id", generateId());
            }
            
            console.log(linkObject.attr("id"), "Verificando que el componente se encuentre enlazado");
            if (ComponentIsNotBinded(linkObject)) {
                console.log(linkObject.attr("id"), "El componente no se encuentra enlazado, se actualizará");
                BindLink(linkObject);
                counter++;
            }
        });

        console.info("Se han enlazado %s enlaces a una ventana modal", counter);
    }

    export function BindLink(linkObject: JQuery)
    {
        // Dirección URL del enlace.
        var url = linkObject.attr("href");

        // Tipo de enlace: content | iframe | other
        var linkType = linkObject.attr("data-type") || "content";

        // Nombre de la función a ejecutarse al final.
        var callback = linkObject.attr("data-callback");

        // Crear una ventana e inicializarla.
        var modalWindow: ModalWindow = new ModalWindow(url, callback, linkType, linkObject.attr("id"));

        // Enlazarla al elemento.
        linkObject.data("Window", modalWindow);

        // Especificar explícitamente que este enlace ya esta vinculado.
        linkObject.attr("data-ajax", "Yes");

        // Configuro el componente al tipo: "panel" para futuros cambios.
        linkObject.attr("data-component", "dialog");                

        // Vincular en enlace para que abra su propia ventana.
        linkObject.click(function (event: JQueryEventObject) {            
            if (linkObject.is("[disabled]")) {
                event.preventDefault();
                console.log(linkObject.attr("id"), "En enlace esta deshabilitado y no se abrirá ninguna ventana.");
                return;
            }

            console.log(linkObject.attr("id"), "El usuario ha dado clic en el enlace.");

            // Recuperar la ventana enlazada.
            var modalWindow = <ModalWindow>linkObject.data("Window");

            // Cancelar el evento natural del click en el enlace.
            event.preventDefault();

            // Abro la ventana que ya he configurado.
            modalWindow.OpenDialog();
        });

        console.log(linkObject.attr("id"), "El enlace esta preparado para abrir una ventana al darle click.", url, linkType);
    }    

    export function GetDialogFromObject(dialogObject: JQuery) : JQuery
    {
        // Obtiene modal-body > modal-content > modal-dialog > modal
        return dialogObject.parent().parent().parent();
    }

    /**
     * El contenido del "iframe" o de la ventana se ha cargado.
     * @param initializerObject
     * @param data
     */
    export function OnLoad(ajaxComponent: JQuery, data: AjaxResponse)
    {
        // El contenido siempre es renderizado en el DIV anidado con la clase ".modal-body", sea un marco o una llamada AJAX.
        var modalObject = GetDialogFromObject(ajaxComponent);

        // El enlace que esta enlazado se encuentra en el atributo "data-source".
        var linkObject : JQuery = $(`#${modalObject.attr("data-source")}`);

        console.log(linkObject.attr("id"), "El contenido de la ventana ha sido cargado.");

        if (data.Type == ResponseType.Automatic || data.Type == ResponseType.JSON)
        {
            console.log(linkObject.attr("id"), "La respuesta fue en automático o tipo JSON que no es compatible, la ventana se cerrará.");
                
            // Cerrar la ventana modal.
            modalObject.modal('hide');

            // Transferir el control a la función de retorno.
            Components.OnLoad(linkObject, data);

            return;
        }
        
        console.log(linkObject.attr("id"), "Analizando si existen formularios internos.");
        Components.Forms.Bind(ajaxComponent);

        console.log(linkObject.attr("id"), "Analizando si existen enlaces internos.");
        // Los enlaces que se encuentran en el contenido deben cargarse en la misma ventana.
        $(".link-ajax", ajaxComponent).each(function (index: number, element: Element) {
            var linkEmbedObject = $(element);

            // Dirección URL del enlace.
            var url = linkEmbedObject.attr("href");

            // No es necesario marcar este enlace.
            linkEmbedObject.attr("data-ajax", "Yes");

            // Cargar el contenido en este contenedor.
            linkEmbedObject.click(function (event: JQueryEventObject) {
                Web.Load(url, ajaxComponent, "link");
                event.preventDefault();
            });
        });

        // La función de retorno se llama hasta que esta ventana se ha cerrado.
        // la ventana se cerrará cuando la respuesta sea "automática" o se haya
        // presionado el botón de cerrar presente en la respuesta.
        if ($(".btn-close", ajaxComponent).length)
        {
            var closeButton = $(".btn-close", ajaxComponent).last();
            var closeResponse: AjaxResponse = new AjaxResponse();
            closeResponse.Status = "Closed";
            closeResponse.Type = ResponseType.Other;

            console.log(linkObject.attr("id"), "La ventana contiene un botón para cerrar, cuando el usuario de clic se cerrará.");

            closeButton.click(function (event: JQueryEventObject)
            {
                console.log(linkObject.attr("id"), "El usuario ha solicitado que se cierre la ventana.");
                
                // Cerrar la ventana modal.
                modalObject.modal('hide');

                Components.OnLoad(linkObject, data);
            });
        }
    }
}