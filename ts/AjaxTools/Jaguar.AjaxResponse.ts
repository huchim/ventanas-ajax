/*!
 * Carlos Huchim Ahumada <huchim@live.com.mx>
 * Se autoriza el uso de este código fuente "AjaxTools" y sus derivados a CFE.
 * No se permite que sea utilizado para otro fin y su modificación sin autorización del autor.
 */
namespace Jaguar {
    /**
     * Establece el formato de la respuesta del servidor una vez que es convertido a un diccionario.
     */
    export class AjaxResponse {
        public Status: string = "Cancelled";
        public Response: { [Key: string]: any } = {};
        public Type: ResponseType = ResponseType.Automatic;
    }

    export enum ResponseType {
        Automatic, JSON, HTML, Other
    }
}