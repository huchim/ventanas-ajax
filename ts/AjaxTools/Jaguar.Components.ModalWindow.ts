module Jaguar.Components
{
    export class ModalWindow {
        private Id: string;
        private Url: string
        private CloseCallback: string;
        private ModalType: string;
        private SourceElementId: string;

        /**
         * Determina si el HTML de la ventana ha sido inicializado o no.
         */
        private IsInitialized: boolean = false;

        /**
         * Inicializa una nueva instancia de la clase ModalWindow.
         * @param url Dirección URL de la ventana a abrir.
         * @param closeCallback Nombre de la función que se ejecutará al cerrarse la ventana.
         * @param modalType Tipo de contenido que contendrá la ventana.
         * @param sourceElementId Identificador del elemento que abrió la ventana.
         */
        constructor(url: string, closeCallback: string, modalType : string, sourceElementId: string) {
            this.Url = url;
            this.CloseCallback = closeCallback;
            this.ModalType = modalType;
            this.SourceElementId = sourceElementId;
            // No inicializar hasta que se solicite que se abra.
            // this.Initialize();
        }

        public Initialize(): void {
            // Generar un número identificador único del elemento.
            this.Id = generateId();
            var internalOpenHandler : Function = this.OnShow;
            var url: string = this.Url;
            var modalType = this.ModalType;

            console.log(this.SourceElementId, "Inicializando ventana modal");

            // Crear el etiquetado del cuadro de dialogo.
            var modalElement = $("<div class=\"modal\" role=\"dialog\" data-keyboard=\"false\" data-backdrop=\"static\"><div class=\"modal-dialog\"><div class=\"modal-content\"><div class=\"modal-body\"><\/div><\/div><\/div><\/div>")
                .attr("id", this.Id)
                .attr("data-callback", this.CloseCallback)
                .attr("data-source", this.SourceElementId);

            // Enlazo una función que se ejecutará al abrirse la ventana.
            modalElement.on('show.bs.modal', function (event: JQueryEventObject)
            {
                var dialogObject = $(".modal-body", modalElement).first();

                console.log(modalElement.attr("data-source"), "La ventana se ha abierto y se ha identificado el espacio para renderizar el contenido.", dialogObject);

                internalOpenHandler.call(modalElement, url, dialogObject, modalType);
            });
            
            // Anexar la ventana al documento.
            $("body").append(modalElement);

            console.log(this.SourceElementId, "Se ha insertado en el DOM la ventana en espera de que sea abierta.");
            this.IsInitialized = true;
        }

        private OnShow(url: string, ajaxComponent: JQuery, modalType: string)
        {
            console.log("Solicitando información", url);
            switch (modalType) {
                case "iframe":
                    Web.LoadFrameContent(url, ajaxComponent, "link");
                    break;
                default:
                    Web.Load(url, ajaxComponent, "link");
                    break;
            }
        }

        public CloseDialog(): void
        {
            console.log(this.SourceElementId, this.Id, "Liberando recursos al cerrar la ventana.");           
            
            // Eliminar la ventana una vez que se haya cerrado.
            $(`#${this.Id}`).on('hidden.bs.modal', function () {
                console.log("Se va eliminar de la memoria la ventana.");
                $(this).data('bs.modal', null);

                console.log( "Eliminando HTML del documento.");
                $(this).remove();
            });

            console.log("Ocultando ventana...");
            // Cerrar la ventana.
            $(`#${this.Id}`).modal('hide');

            console.log("Establecer el valor de la bandera de inicialización.");
            this.IsInitialized = false;
        }
        
        public OpenDialog(): void {
            console.log(this.SourceElementId, "Vamos a abrir la ventana correspondiente al enlace.");

            if (!this.IsInitialized) {
                this.Initialize();
            }

            $(`#${this.Id}`).modal('show');
        }
    }
}