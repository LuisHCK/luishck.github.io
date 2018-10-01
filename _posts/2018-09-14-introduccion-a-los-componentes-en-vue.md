---
layout: post
title: Introducción a los Componentes en Vue
date: 2018-09-14 12:13 -0600
author: luishck
description: Aprenderemos conceptos básicos para trabajar con componentes en Vue
cover: ../assets/img/introduccion-vue-componentes.jpg
categories:
  - tutorial
  - Vue
  - basico
  - componentes
permalink: /posts/introduccion-componentes-en-vuejs
---
Hola, sean bienvenidos nuevamente a esta serie de videos en la cual crearemos un clon de instagram usando Vue.

En el video anterior aprendimos a instalar vue cli y crear nuestro primer proyecto.

En este video aprenderemos que son y como funcionan los componentes en vue.

En definición: “Los componentes son instancias reusables de Vue, tienen un nombre y las podemos usar como elementos personalizados”  según la documentación oficial.
Pero mas simplificado aun, piensa en un componente como una pieza de Lego cada una tiene sus particularidades, pero se ensablan con otros componentes mas complejos.

Para crear componentes debemos cumplir con algunas buenas prácticas que nos ayudarán crear componentes faciles de usar y mantener

Primero: Un componente debe unicamente hacer una función y debe hacerla bien,
Segundo: Debes mantener el componente los más pequeño posible y esto se relaciona con la regla anterior.

Hasta este punto lo que hemos aprendido sobre los componentes aplica para cualquier otro framework, la teoría siempre es la misma, pero ahora vamos a aprender específicamente sobre los componentes de Vue.

En vue normalmente se usan los Single File Componentes o Componentes de un solo archivo, por que es así? Pues vamos a nuestro editor y veámoslo en práctica, creamos un nuevo archivo, lo llamamos component.vue y lo guardamos en cualquier carpeta.

Los componentes de vue se distinguen por su extención .vue y no son más que un archivo HTML,
un componente de vue consta de 3 etiquetas:
- template
- script
- style

Template:
Acá escribiremos nuestro html, la etiqueta template tiene una regla: Unicamente puede tener una etiqueta hija, ejemplo: crearemos un div y dentro de el irá el resto de nuestro html.
Si ya conoces HTML no hay nada nuevo que te pueda mostrar por ahora, ejemplo creamos un botón y un hola mundo.

Ahora podemos probar este componente, para ello instalaremos un complemento  de Vue CLI
en la consola escribirmos: 
npm install -g @vue/cli-service-global

Una vez instalado podemos probar nuestro componente.
Navegamos hasta la carpeta donde guardamos nuestro archivo y escribimos
vue serve componente.vue
Etiqueta script
Esta es la parte donde nosotros escribiremos nuestro codigo JS y construiremos las funcionalidades de nuestro componente.
Todo componente de Vue debe exportar un objeto, para ello definimos el objeto a exportar.
Export default {}
dentro de éste objeto irá toda la lógica de nuestro componente.
Bien, acá dentro Vue espera que nosotros definamos ciertas propiedades, la primera es el nombre de nuestro componente, para ello escribimos
name: “componente”
Siempre en minúsculas e igual a como llamamos a nuestro archivo. Si el archivo se llama NuevoComponente.vue el name será: “nuevo-componente”
Otra propiedad importante Data:
Definiremos una función data() que retornará un objeto, en el cual manejaremos los datos de nuestro componente, estos datos unicamente se aplican a el objeto en cuestión, no pueden ser accedidos desde otro objeto, o al menos no directamente.
Por ultimo la propiedad methods, este será un objeto que contendrá las funciones de nuestro componente.
Existen muchas mas propiedades de un componente de vue, pero las veremos poco a poco a medida que las vayamos necesitando a lo largo de esta serie de videos.

Bien ahora hagamos una práctica.

