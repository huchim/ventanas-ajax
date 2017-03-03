namespace Jaguar.Components {

    export function Bind(ajaxComponent?: JQuery) {
        Forms.Bind(ajaxComponent);
        Links.Bind(ajaxComponent);
        Panel.Bind(ajaxComponent);
    }

    export function OnLoad(ajaxComponent: JQuery, data: AjaxResponse)
    {
        // Busco alguna función que desee ejecutarse cuando todo finalice.
        var componentCallback = ajaxComponent.attr("data-callback") || "";

        if (componentCallback) {
            if (typeof window[componentCallback] === "function") {
                console.log(ajaxComponent.attr("id"), "Ejecutando función de retorno", componentCallback);
                window[componentCallback](ajaxComponent, data);
            }
        }
    }
}