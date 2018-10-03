---
layout: post
title: 'Tutorial: Instalar Vuejs en Ubuntu y Windows'
layout: post
author: luishck
date: 2018-06-25 00:46:21 -0600
cover: ../assets/img/vuejs-windows-linux.jpg
description: Guia para instalar Vue CLI en Windows o Linux (Ubuntu)
categories:
  - tutorial
  - Vuejs
  - windows
  - Ubuntu
permalink: /posts/:title:output_ext
---
# Introducción

Vue.js es uno de los frameworks para el desarrollo de Aplicaciones Web mas populares en la actualidad.

Si estás interesado en aprender, pues ¡Enorabuena! Te guiaré en el proceso de instalación.

Primero deberás instalar NodeJS en tu PC. Se recomienda nodejs en su versión **8.9** o superior. Nosotros optaremos por usar la ultima versión estable **10.x**

## Linux (Ubuntu)

Instalar NodeJS en linux es extremadamente sencillo:

Nos dirijimos a nuestra consola y escribiremos uno a uno los siguientes comandos:

```bash
sudo apt update

sudo apt install curl

curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -

sudo apt-get install -y nodejs
```

Una vez terminada la instalación procedemos a comprovar la version de NodeJS que instalamos, para ello escribimos en la consola:

```bash
node --version
# 10.x.x <- Nos deberá mostrar algo similar a esto
```

## Windows (7, 8, 10)
En windows también es muy facil instalar node tendremos 2 opciones.

1. Instlar NodeJS usando un instalador tradicional
2. Usando un manejador de paquetes: Chocolatey

### Instalación Normal

Si te decides por la primera opción, simplemente deberás visitar la pagina oficial de NodeJS y descargar el instalador:

[Descargar Instalador de Node](https://nodejs.org/es/download/current/)

### Instalación medante gestor de paquetes (Chocolatey)

Alternativamente recomiendo de forma personal para mayor comodidad usar Chocolatey, debido a que centraliza los programas que instalamos y podemos acceder a todo desde la misma consola de CMD o PowerShell.

* Paso 1:

En el menú inicio busca CMD y ejecutalo como **Administrador** y en la consola escribe:

```bash
@"%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -InputFormat None -ExecutionPolicy Bypass -Command "iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))" && SET "PATH=%PATH%;%ALLUSERSPROFILE%\chocolatey\bin"
```

Te preguntará si deseas instlar Chocolatey, scribes `S` y presionas `ENTER`
Cuando filalize escribes en la consola:

```bash
choco --version
# Te mostrará la versión instalada
```

> En caso que no te muestre nada o un error, cierra la consola y abrela de nuevo, siempre como **Administrador**

Finalmente instalamos NodeJS escribiendo los siguientes comandos:

```bash
choco install nodejs

refreshEnv

node --version
# 10.x.x <- Version de Node Instalada
```

> En caso que este ultimo comando te retorne un error, intenta cerrando el CMD y abriéndolo nuevamente como Administrador.

## Instalando Vue CLI

Vue CLI es una **Herramienta estándar para el desarrollo de Vue.js** la cual nos facilitará un montón el trabajo.
Para instalarla nos dirijimos nuevamente a la consola y escribimos el siguiente comando:

```bash
sudo npm install -g @vue/cli
```

La instalación tomará un par de minutos, una vez finalizada comprobamos que todo se instalaó correctamente, para ello en la consola escribimos:

```bash
vue --version
# 3.x.x <- Nos deberá mostrar algo similar a esto
```

Y eso es todo, si deseas aprender mas sobre Vue pásate por [mi canal de YouTube](https://www.youtube.com/c/LuisJCenteno), estamos creando un [**Clon de Instagram**](https://www.youtube.com/c/LuisJCenteno) con el cual aprendemos muchas cosas súper interesantes que te podrían gustar.
