var Jaguar;
(function (Jaguar) {
    Jaguar.version = "2.0.6";
    Jaguar.ajaxError = "<div class=\"alert alert-danger\"><span class=\"fa fa-warning\"></span> Lo sentimos, algo esta funcionando mal, actualice la página e intente nuevamente.</div>";
    function parseJsonResponse(serverResponse) {
        var results = new Jaguar.AjaxResponse();
        results.Status = "Ok";
        results.Response = {};
        results.Type = Jaguar.ResponseType.Other;
        console.log("Normalizando respuesta del servidor", serverResponse);
        for (var key in serverResponse) {
            results.Response[key] = serverResponse[key];
        }
        return results;
    }
    Jaguar.parseJsonResponse = parseJsonResponse;
    function generateId(preffix) {
        var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        return (preffix || "") + randLetter + Date.now();
    }
    Jaguar.generateId = generateId;
    function ComponentIsNotBinded(ajaxComponent) {
        return ajaxComponent.attr("data-ajax") !== "Yes";
    }
    Jaguar.ComponentIsNotBinded = ComponentIsNotBinded;
    function ShowLoading(dialogObject) {
        dialogObject.empty();
        dialogObject.html("<br />");
        dialogObject.addClass("loading");
    }
    Jaguar.ShowLoading = ShowLoading;
})(Jaguar || (Jaguar = {}));
if (!console)
    console = { log: function () { }, info: function () { }, warn: function () { }, error: function () { } };
$(function () {
    Jaguar.Components.Bind();
});
var Jaguar;
(function (Jaguar) {
    var AjaxResponse = (function () {
        function AjaxResponse() {
            this.Status = "Cancelled";
            this.Response = {};
            this.Type = ResponseType.Automatic;
        }
        return AjaxResponse;
    }());
    Jaguar.AjaxResponse = AjaxResponse;
    var ResponseType;
    (function (ResponseType) {
        ResponseType[ResponseType["Automatic"] = 0] = "Automatic";
        ResponseType[ResponseType["JSON"] = 1] = "JSON";
        ResponseType[ResponseType["HTML"] = 2] = "HTML";
        ResponseType[ResponseType["Other"] = 3] = "Other";
    })(ResponseType = Jaguar.ResponseType || (Jaguar.ResponseType = {}));
})(Jaguar || (Jaguar = {}));
var Jaguar;
(function (Jaguar) {
    var AjaxResponseRaw = (function () {
        function AjaxResponseRaw() {
        }
        return AjaxResponseRaw;
    }());
    Jaguar.AjaxResponseRaw = AjaxResponseRaw;
})(Jaguar || (Jaguar = {}));
var Jaguar;
(function (Jaguar) {
    var Components;
    (function (Components) {
        var Forms;
        (function (Forms) {
            function Bind(dialogObject) {
                var counter = 0;
                $(".form-ajax", dialogObject).each(function (index, element) {
                    var formElement = $(element);
                    if (Jaguar.ComponentIsNotBinded(formElement)) {
                        InternalBindElement(formElement, dialogObject);
                        counter++;
                    }
                });
                console.info("Se han enlazado %s formularios para que sean enviados por medio de AJAX.", counter);
            }
            Forms.Bind = Bind;
            function InternalBindElement(formElement, dialogObject) {
                formElement.attr("data-ajax", "Yes");
                dialogObject.attr("data-component", "form");
                $(formElement).submit(function (event) {
                    Jaguar.ShowLoading(dialogObject);
                    OnSubmit(event, formElement, dialogObject);
                    event.preventDefault();
                    return false;
                });
            }
            Forms.InternalBindElement = InternalBindElement;
            function OnSubmit(event, form, dialogObject) {
                var ajaxSettings = {
                    url: form.attr("action"),
                    method: form.attr("method"),
                    data: form.serialize()
                };
                $.ajax(ajaxSettings).done(function (response, textStatus, jqXHR) {
                    Jaguar.Web.ProcessResponse(response, textStatus, jqXHR, dialogObject, "form");
                }).fail(function (jqXHR, textStatus, err) {
                    Jaguar.Web.ConnectionFailed(jqXHR, textStatus, err, dialogObject, "form");
                });
            }
            Forms.OnSubmit = OnSubmit;
            function OnLoad(initializerObject, data) {
                if (data.Type == Jaguar.ResponseType.HTML) {
                    console.log("La respuesta es HTML, la ventana de mantenerse abierta.");
                    if (initializerObject.hasClass("modal-body")) {
                        console.log("Reenlazando elementos de la ventana.");
                        Components.Links.OnLoad(initializerObject, data);
                    }
                    return;
                }
                if (initializerObject.hasClass("modal-body")) {
                    var modalObject = initializerObject.parent().parent().parent();
                    modalObject.modal('hide');
                    var linkObject = $("#" + modalObject.attr("data-source"));
                    Components.OnLoad(linkObject, data);
                    return;
                }
                Components.OnLoad(initializerObject, data);
            }
            Forms.OnLoad = OnLoad;
        })(Forms = Components.Forms || (Components.Forms = {}));
    })(Components = Jaguar.Components || (Jaguar.Components = {}));
})(Jaguar || (Jaguar = {}));
var Jaguar;
(function (Jaguar) {
    var Components;
    (function (Components) {
        var Links;
        (function (Links) {
            function Bind(dialogObject) {
                var counter = 0;
                $(".link-ajax", dialogObject).each(function (index, element) {
                    var linkObject = $(element);
                    if (!linkObject.attr("id")) {
                        linkObject.attr("id", Jaguar.generateId());
                    }
                    console.log(linkObject.attr("id"), "Verificando que el componente se encuentre enlazado");
                    if (Jaguar.ComponentIsNotBinded(linkObject)) {
                        console.log(linkObject.attr("id"), "El componente no se encuentra enlazado, se actualizará");
                        BindLink(linkObject);
                        counter++;
                    }
                });
                console.info("Se han enlazado %s enlaces a una ventana modal", counter);
            }
            Links.Bind = Bind;
            function BindLink(linkObject) {
                var url = linkObject.attr("href");
                var linkType = linkObject.attr("data-type") || "content";
                var callback = linkObject.attr("data-callback");
                var modalWindow = new Components.ModalWindow(url, callback, linkType, linkObject.attr("id"));
                linkObject.data("Window", modalWindow);
                linkObject.attr("data-ajax", "Yes");
                linkObject.attr("data-component", "dialog");
                linkObject.click(function (event) {
                    if (linkObject.is("[disabled]")) {
                        event.preventDefault();
                        console.log(linkObject.attr("id"), "En enlace esta deshabilitado y no se abrirá ninguna ventana.");
                        return;
                    }
                    console.log(linkObject.attr("id"), "El usuario ha dado clic en el enlace.");
                    var modalWindow = linkObject.data("Window");
                    event.preventDefault();
                    modalWindow.OpenDialog();
                });
                console.log(linkObject.attr("id"), "El enlace esta preparado para abrir una ventana al darle click.", url, linkType);
            }
            Links.BindLink = BindLink;
            function GetDialogFromObject(dialogObject) {
                return dialogObject.parent().parent().parent();
            }
            Links.GetDialogFromObject = GetDialogFromObject;
            function OnLoad(ajaxComponent, data) {
                var modalObject = GetDialogFromObject(ajaxComponent);
                var linkObject = $("#" + modalObject.attr("data-source"));
                console.log(linkObject.attr("id"), "El contenido de la ventana ha sido cargado.");
                if (data.Type == Jaguar.ResponseType.Automatic || data.Type == Jaguar.ResponseType.JSON) {
                    console.log(linkObject.attr("id"), "La respuesta fue en automático o tipo JSON que no es compatible, la ventana se cerrará.");
                    modalObject.modal('hide');
                    Components.OnLoad(linkObject, data);
                    return;
                }
                console.log(linkObject.attr("id"), "Analizando si existen formularios internos.");
                Components.Forms.Bind(ajaxComponent);
                console.log(linkObject.attr("id"), "Analizando si existen enlaces internos.");
                $(".link-ajax", ajaxComponent).each(function (index, element) {
                    var linkEmbedObject = $(element);
                    var url = linkEmbedObject.attr("href");
                    linkEmbedObject.attr("data-ajax", "Yes");
                    linkEmbedObject.click(function (event) {
                        Jaguar.Web.Load(url, ajaxComponent, "link");
                        event.preventDefault();
                    });
                });
                if ($(".btn-close", ajaxComponent).length) {
                    var closeButton = $(".btn-close", ajaxComponent).last();
                    var closeResponse = new Jaguar.AjaxResponse();
                    closeResponse.Status = closeButton.attr("data-close-status") || "Closed";
                    closeResponse.Type = Jaguar.ResponseType.Other;
                    closeResponse.Response = data.Response;
                    console.log(linkObject.attr("id"), "La ventana contiene un botón para cerrar, cuando el usuario de clic se cerrará.");
                    closeButton.click(function (event) {
                        console.log(linkObject.attr("id"), "El usuario ha solicitado que se cierre la ventana.");
                        modalObject.modal('hide');
                        modalObject.empty();
                        Components.OnLoad(linkObject, closeResponse);
                    });
                }
            }
            Links.OnLoad = OnLoad;
        })(Links = Components.Links || (Components.Links = {}));
    })(Components = Jaguar.Components || (Jaguar.Components = {}));
})(Jaguar || (Jaguar = {}));
var Jaguar;
(function (Jaguar) {
    var Components;
    (function (Components) {
        var ModalWindow = (function () {
            function ModalWindow(url, closeCallback, modalType, sourceElementId) {
                this.IsInitialized = false;
                this.Url = url;
                this.CloseCallback = closeCallback;
                this.ModalType = modalType;
                this.SourceElementId = sourceElementId;
            }
            ModalWindow.prototype.Initialize = function () {
                this.Id = Jaguar.generateId();
                var internalOpenHandler = this.OnShow;
                var url = this.Url;
                var modalType = this.ModalType;
                console.log(this.SourceElementId, "Inicializando ventana modal");
                var modalElement = $("<div class=\"modal\" role=\"dialog\" data-keyboard=\"false\" data-backdrop=\"static\"><div class=\"modal-dialog\"><div class=\"modal-content\"><div class=\"modal-body\"><\/div><\/div><\/div><\/div>")
                    .attr("id", this.Id)
                    .attr("data-callback", this.CloseCallback)
                    .attr("data-source", this.SourceElementId);
                modalElement.on('show.bs.modal', function (event) {
                    var dialogObject = $(".modal-body", modalElement).first();
                    console.log(modalElement.attr("data-source"), "La ventana se ha abierto y se ha identificado el espacio para renderizar el contenido.", dialogObject);
                    internalOpenHandler.call(modalElement, url, dialogObject, modalType);
                });
                $("body").append(modalElement);
                console.log(this.SourceElementId, "Se ha insertado en el DOM la ventana en espera de que sea abierta.");
                this.IsInitialized = true;
            };
            ModalWindow.prototype.OnShow = function (url, ajaxComponent, modalType) {
                console.log("Solicitando información", url);
                switch (modalType) {
                    case "iframe":
                        Jaguar.Web.LoadFrameContent(url, ajaxComponent, "link");
                        break;
                    default:
                        Jaguar.Web.Load(url, ajaxComponent, "link");
                        break;
                }
            };
            ModalWindow.prototype.OpenDialog = function () {
                console.log(this.SourceElementId, "Vamos a abrir la ventana correspondiente al enlace.");
                if (!this.IsInitialized) {
                    this.Initialize();
                }
                $("#" + this.Id).modal('show');
            };
            return ModalWindow;
        }());
        Components.ModalWindow = ModalWindow;
    })(Components = Jaguar.Components || (Jaguar.Components = {}));
})(Jaguar || (Jaguar = {}));
var Jaguar;
(function (Jaguar) {
    var Components;
    (function (Components) {
        var Panel;
        (function (Panel) {
            function Bind(dialogObject) {
                var counter = 0;
                $(".panel-ajax", dialogObject).each(function (index, element) {
                    var panelObject = $(element);
                    if (!panelObject.attr("id")) {
                        panelObject.attr("id", Jaguar.generateId());
                    }
                    console.log(panelObject.attr("id"), "Verificando que el componente se encuentre enlazado");
                    if (Jaguar.ComponentIsNotBinded(panelObject)) {
                        console.log(panelObject.attr("id"), "El componente no se encuentra enlazado, se actualizará");
                        Update(panelObject);
                        counter++;
                    }
                });
                console.info("Se han enlazado %s paneles", counter);
            }
            Panel.Bind = Bind;
            function Update(panelObject) {
                if (typeof panelObject === "string") {
                    panelObject = $("#" + panelObject);
                }
                panelObject.attr("data-ajax", "Yes");
                panelObject.attr("data-component", "panel");
                var url = panelObject.attr("data-url");
                var showLoading = (panelObject.attr("data-load") || "animation") === "animation";
                if (showLoading) {
                    Jaguar.ShowLoading(panelObject);
                }
                var ajaxSettings = {
                    url: url
                };
                console.log(panelObject.attr("id"), "Solicitando página web al servidor");
                $.ajax(ajaxSettings).done(function (response, textStatus, jqXHR) {
                    console.log(panelObject.attr("id"), "La solicitud ha finalizado para el panel y se comienza a renderizar.");
                    Jaguar.Web.ProcessResponse(response, textStatus, jqXHR, panelObject, "panel");
                }).fail(function (jqXHR, textStatus, err) {
                    console.log(panelObject.attr("id"), "La solicitud ha fallado, verifique el error en la consola.");
                    Jaguar.Web.ConnectionFailed(jqXHR, textStatus, err, panelObject, "panel");
                });
            }
            Panel.Update = Update;
            function OnLoad(panelObject, data) {
                console.log(panelObject.attr("id"), "Renderización completa, verificando si se debe ejecutar una función adicional.", data);
                Components.OnLoad(panelObject, data);
                console.info(panelObject.attr("id"), "Revisando si existen controles adicionales que requieran ser enlazados.");
                Components.Bind(panelObject);
            }
            Panel.OnLoad = OnLoad;
        })(Panel = Components.Panel || (Components.Panel = {}));
    })(Components = Jaguar.Components || (Jaguar.Components = {}));
})(Jaguar || (Jaguar = {}));
var Jaguar;
(function (Jaguar) {
    var Components;
    (function (Components) {
        function Bind(ajaxComponent) {
            Components.Forms.Bind(ajaxComponent);
            Components.Links.Bind(ajaxComponent);
            Components.Panel.Bind(ajaxComponent);
        }
        Components.Bind = Bind;
        function OnLoad(ajaxComponent, data) {
            var componentCallback = ajaxComponent.attr("data-callback") || "";
            if (componentCallback) {
                if (typeof window[componentCallback] === "function") {
                    console.log(ajaxComponent.attr("id"), "Ejecutando función de retorno", componentCallback);
                    window[componentCallback](ajaxComponent, data);
                }
            }
        }
        Components.OnLoad = OnLoad;
    })(Components = Jaguar.Components || (Jaguar.Components = {}));
})(Jaguar || (Jaguar = {}));
var Jaguar;
(function (Jaguar) {
    var KeyValuePair = (function () {
        function KeyValuePair() {
        }
        return KeyValuePair;
    }());
    Jaguar.KeyValuePair = KeyValuePair;
})(Jaguar || (Jaguar = {}));
var Jaguar;
(function (Jaguar) {
    var Web;
    (function (Web) {
        function SetContent(dialogObject, dialogContent) {
            dialogObject.empty();
            dialogObject.removeClass("loading");
            dialogObject.html(dialogContent);
        }
        Web.SetContent = SetContent;
        function ProcessResponse(response, textStatus, jqXHR, ajaxComponent, componentType) {
            var isJson = (jqXHR.getResponseHeader("Content-Type") || "").substring(0, 16) === "application/json";
            var isAutomaticResponse = response === "Ok";
            var isHtml = !isJson && !isAutomaticResponse;
            var serverResponse = new Jaguar.AjaxResponse();
            serverResponse.Status = "Ok";
            if (isAutomaticResponse) {
                console.log(ajaxComponent.attr("id"), "La respuesta es de tipo automática");
                serverResponse.Type = Jaguar.ResponseType.Automatic;
            }
            if (isJson) {
                console.log(ajaxComponent.attr("id"), "La respuesta es de tipo JSON.");
                serverResponse = Jaguar.parseJsonResponse(response);
                serverResponse.Type = Jaguar.ResponseType.JSON;
            }
            if (isHtml) {
                console.log(ajaxComponent.attr("id"), "La respuesta es de tipo HTML");
                SetContent(ajaxComponent, response);
                serverResponse.Type = Jaguar.ResponseType.HTML;
            }
            console.log("Se ha finalizado una solicitud a página web via AJAX", ajaxComponent, serverResponse, componentType);
            switch (componentType) {
                case "panel":
                    Jaguar.Components.Panel.OnLoad(ajaxComponent, serverResponse);
                    break;
                case "link":
                    Jaguar.Components.Links.OnLoad(ajaxComponent, serverResponse);
                    break;
                case "form":
                    Jaguar.Components.Forms.OnLoad(ajaxComponent, serverResponse);
                    break;
            }
        }
        Web.ProcessResponse = ProcessResponse;
        function ConnectionFailed(jqXHR, textStatus, err, ajaxComponent, componentType) {
            var errorMsg = Jaguar.ajaxError;
            console.warn(ajaxComponent, "La conexión a la página ha fallado", err, componentType);
            if (componentType == "link") {
                errorMsg += "<button class=\"btn btn-default btn-close\" type=\"button\">Cerrar</button>";
            }
            SetContent(ajaxComponent, errorMsg);
            if (componentType == "link") {
                Jaguar.Components.Links.OnLoad(ajaxComponent, { Status: "Error", Response: null, Type: Jaguar.ResponseType.Other });
            }
        }
        Web.ConnectionFailed = ConnectionFailed;
        function LoadFrameContent(url, ajaxComponent, componentType) {
            var id = Jaguar.generateId("jg");
            var frameId = "f" + id;
            var frameContainerId = "c" + id;
            var htmlContent = "<div id=\"" + frameContainerId + "\" style=\"display: none;\" >\n<iframe id =\"" + frameId + "\" width=\"100%\" height=\"349\" frameborder=\"0\"></iframe>\n<button class=\"btn btn-default btn-close\" type=\"button\">Cerrar</button></div>";
            if (!$("#" + frameContainerId, ajaxComponent).length) {
                Web.SetContent(ajaxComponent, htmlContent);
                ajaxComponent.addClass("loading");
                $("#" + frameId).load(function (event) {
                    console.log("La página web ha devuelto el contenido solicitado.");
                    ajaxComponent.removeClass("loading");
                    $("#" + frameContainerId).css("display", "block");
                    switch (componentType) {
                        case "panel":
                            Jaguar.Components.Panel.OnLoad(ajaxComponent, { Status: "Ok", Response: null, Type: Jaguar.ResponseType.HTML });
                            break;
                        case "link":
                            Jaguar.Components.Links.OnLoad(ajaxComponent, { Status: "Ok", Response: null, Type: Jaguar.ResponseType.HTML });
                            break;
                        case "form":
                            Jaguar.Components.Forms.OnLoad(ajaxComponent, { Status: "Ok", Response: null, Type: Jaguar.ResponseType.HTML });
                            break;
                    }
                });
                console.log("Solicitando la página web al servidor.");
                $("#" + frameId).attr("src", url);
            }
        }
        Web.LoadFrameContent = LoadFrameContent;
        function Load(url, dialogObject, componentType) {
            Jaguar.ShowLoading(dialogObject);
            var ajaxSettings = {
                url: url
            };
            $.ajax(ajaxSettings).done(function (response, textStatus, jqXHR) {
                ProcessResponse(response, textStatus, jqXHR, dialogObject, componentType);
            }).fail(function (jqXHR, textStatus, err) {
                ConnectionFailed(jqXHR, textStatus, err, dialogObject, componentType);
            });
        }
        Web.Load = Load;
    })(Web = Jaguar.Web || (Jaguar.Web = {}));
})(Jaguar || (Jaguar = {}));
//# sourceMappingURL=ventanas-ajax.js.map