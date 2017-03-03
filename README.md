# ventanas-ajax
Cargar el contenido de un enlace dentro de una ventana modal de bootstrap.

## Introducción
Este proyecto es una forma de aprender [TypeScript](https://www.typescriptlang.org/) y en el camino
desarrollar una funcionalidad para cargar contenido AJAX por medio de ventanas modales en una aplicación web.

## Usar las ventanas en una aplicación web.

Las ventanas modales se abren a partir de un enlace `<a href="/ruta-url/" class="link-ajax">enlace</a>`, la URL dentro
del enlace es la URL que se cargará en la ventana modal.

Dependiendo de la respuesta la ventana puede mantenerse abierta o cerrarse automáticamente. Por ejemplo:

### Respuesta HTML

Cuando un enlace devuelve contendo HTML, este es el que se mostrará en la ventana. Es importante que 
en este caso la respuesta contenga un botón de cerrar con la clase `btn-close`. Este botón es el que
cerrará la ventana.

El HTML impreso en la ventana puede contener formularios, pero no debería incluir otros enlaces que abran
una ventana secundaria.

Siempre se tomará el último botón con la clase `btn-close` que exista en la respuesta. Al cerrar la ventana
usando ese botón la respuesta siempre será `data.Status = "Closed"` que indica que el formulario fue
cerrado por el usuario. Es posible cambiar ese "Status" por medio de atributo `data-close-status`, como en
el ejemplo siguiente.

```
<a href="/ruta-url/" class="link-ajax" data-close-status="Cancelled">enlace</a>
```

### Respuesta JSON.

Cuando el enlace devuelva un encabezado de tipo de contenido `Content-Type: application/json`, este será
tratado como JSON y la ventana se cerrará automáticamente.

Para recuperar ese contenido JSON se debe crear un enlace con el atributo `data-callback` como en el
ejemplo siguiente:

```
<a href="/ruta-url/" class="link-ajax" data-callback="esperarRespuesta">enlace</a>

<script type="text/javascript">
    function esperarRespuesta(ajaxComponent, data)
    {
        // ajaxComponent: es el enlace (jquery) que abrió la ventana.
        // data: es la información de la respuesta que contiene el objeto JSON.
    }
</script>
``` 



### Respuesta "Ok"

Cuando el enlace devuelva una única palabra "Ok", la ventana se cerrará automáticamente. 

## Ventanas con contenido IFrame

El contenido normalmente es renderizado dentro del elemento con la clase `.modal-body` sin embargo es posible
que el contenido se cree en un `iframe` con el atributo `data-type`.

```
<a href="/ruta-url/" class="link-ajax" data-type="iframe">enlace</a>
```

En este caso, se creará automáticamente un botón para cerrar la ventana.

## Formularios

Un enlace puede abrir una página que contenga un formulario, y enviar ese formulario via AJAX. 
Es importante que el formulario contenga la clase `.form-ajax` para que se sustituya el evento `submit`
del formulario y la biblioteca tome el control del envio.

*ventanas-ajax* toma los valores del formulario y usa `form.serialize()` para enviar los datos. Así
que tome sus consideraciones al respecto. 

Si la respuesta del servidor es el mismo formulario, se repetirá el proceso hasta que la respuesta
sea JSON, "Ok" o el usuario de clic en el botón "Cerrar".

## GRUNT

Si usas GRUNT, puedes utilizar `grunt-contrib-uglify` para que elimines todos los `console.log` que se
usaron en el código.

```
module.exports = function (grunt) {    
    grunt.initConfig({
        uglify: {
            options: {
                compress: {
                    drop_console: true 
                }
            },
            production: {
                src: [                    
                    "dist/ventanas-ajax.js"
                ],
                dest: scriptsPath + 'bundle.min.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.registerTask('default', ['uglify:production']);
}
```

----

# Programación TypeScript

Aquí esta lo verdaderamente divertido de programar. 

## Ambiente de desarrollo

- [Visual Code](https://code.visualstudio.com/)
- [NPM](https://nodejs.org/es/)

## Configurar el proyecto.

Para configurar el proyecto se debe ir al directorio de `ventanas-ajax` (Visual Code trae su ventana de línea de comandos)
y teclear los siguientes comandos.

Si tiene proxy recuerde configurar bien NPM y typings.

```
# Instalar TypeScript
npm install TypeScript --global

# Instalar proyecto Typings
npm install typings --global

# Instalar dependencias del proyecto.
typings install dt~jquery --global
typings install dt~bootstrap --global

# Instalar dependencias de la prueba.
cd tests
npm install
```

Atte:
Carlos Jesús Huchim Ahumada
[twitter.com/huchim](twitter.com/huchim)
[facebook.com/huchim](facebook.com/huchim)

