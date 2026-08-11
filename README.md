<div align="center">
    <br />
    <a href="#">
        <img src="./public/logo-blanco.png" width="250" alt="Logo CRM FdeFilms">
    </a>
    <br />
    <h2>Gestor de Clientes Neumórfico</h2>
    <p><i>Un espacio digital diseñado para aportar paz, orden y eficiencia a tu trabajo diario.</i></p>
</div>

---

## Introducción

Te doy la bienvenida al repo oficial del **CRM de FdeFilms**. Este proyecto es una plataforma web desarrollada a medida para gestionar de manera integral la cartera de clientes de cualquier empresa.

Destaca por tener una interfaz limpia basada en el diseño Neumórfico (*Neumorphism*), y por estar pensada para ser extremadamente facil e intuitiva de usar, eliminando la sobrecarga visual de los CRM tradicionales.

## Características principales

* **Gestión de Clientes (CRUD)**: Permite dar de alta, visualizar, editar y eliminar clientes con todos sus datos clave (fiscales, de envio, de contacto directo y notas adicionales).
* **Importación masiva inteligente**: Capacidad de subir un archivo Excel (.xlsx, .xls) o CSV para anadir decenas de clientes de golpe. Incluye una fase de previsualizacion que avisa si hay clientes duplicados y permite decidir si sobrescribirlos, ignorarlos o completar sus datos vacios.
* **Exportación a medida**: La base de datos puede descargarse en formato Excel, CSV, PDF (con diseno automatico de tabla apaisada) y JSON. Permite seleccionar mediante casillas exactamente que columnas de informacion se desean incluir en el archivo final.
* **Seguridad y Autenticación**: Sistema cerrado de login y registro. Solo los usuarios con credenciales validadas pueden acceder al panel de gestion y a las rutas protegidas.
* **Experiencia visual (fondo dinámico)**: Un fondo interactivo que renderiza un oceano animado. Su iluminacion, paleta de colores y posicion de los astros cambian automaticamente dependiendo de la hora local del usuario. Ademas, incluye un calculo matematico de la fase lunar en tiempo real.

## Tecnologías usadas

* **Frontend**: Next.js (App Router), React, Tailwind CSS
* **Backend y base de datos**: Supabase (PostgreSQL y Autenticación)
* **Utilidades extra**: `xlsx` (para lectura y generación de excels), `jspdf` y `jspdf-autotable` (para generacion de documentos PDF), `react-hot-toast` (para notificaciones visuales).

---

## Guía dev

Si eres la persona encargada en continuar trabajando este código, respira hondo. El proyecto esta organizado, modularizado y pensado para que no te pierdas. Sigue estos pasos para levantar el entorno en tu equipo..

### Requisitos previos

* Tener instalado **Node.js** en tu pc
* Tener instalado **Git**
* Disponer de las creds de acceso a la bbdd de Supabase vinculada a este proyecto.

### Descargar e instalar

Abre tu terminal, clona el repo en tu pc y entra en la carpeta generada:

```bash
git clone <https://github.com/EcoMagic/BBDD>
cd <bbdd>
```

Ahora instala todas las dependencias necesarias:

```bash
npm install
```

### Configuración del entorno (obligatorio)

Para que el login y el listado de clientes funcionen la app necesita conectarse a supabase. Debes crear un archivo en la raíz del proyecto llamado excatamente `.env.local`. Dentro pega las variables de entorno proporcionadas:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://urlDelProyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_claveAnonima
TEST_EMAIL=sugus.ecomagic@gmail.com
TEST_PASSWORD=laContraseñaDelExcel
```

### Arrancar en modo dev

Una vez instalado todo y configurado, levanta el server local:

```bash
npm run dev
```

Abre tu navegador y entra en `http://localhost:30000`.

### Estructura base del proyecto
* `app/`: Contiene el enrutamiento principal de Next.js (App Router). Si quieres modificar páginas completas como el login, el dashboard o configuraciones de perfil, busca por aquí.
* `components/`: Contiene todos los componentes visuales independientes (modales de importación, exportación, tarjetas de clientes, el canvas del fondo...)
* `lib/`: Archivos de configuración como los clientes de inicialización de Supabase

---

## Guía de trabajo con git y github

Para mantener la estabilidad de la plataforma y evitar errores críticos en producción, es **obligatorio** seguir este flujo de trabajo. No se debe programar directamente sobre el main!

### Uso de branches (ramas)

* `main` (o `master`): Es la principal e intocable. Aquí solo reside el código que ya ha sido aprobado y que funciona al 100%. Lo que hay aquí es lo que ven los usuarios
* **Ramas de funcionalidad (`feature` o lo que sea)**: Siempre que vayas a arreglar un error o programar algo nuevo, debes crear una rama exclusiva para esa tarea partiendo desde `main`!

| Rama | Explicación | Etiqueta del commit | Ejemplo del mensaje de commit|
| :---: | :--- | :--- | :--- |
| `feature` | Ramas de funciones nuevas | `feat:` | `feat: función para seleccionar todos los usuarios en dashboard` |
| `fix` | Rama de arreglos | `fix:` | `fix: corrección del renderizado del componente principal` |
| `chore` | Rama de mantenimiento | `chore:` | `chore: Actualizadas dependencias del proyecto` |
| `docs` | Rama de documentación/README | `docs:` | `docs: Actualizado el READMI con estructura del repo` |
| `refactor` | Rama de refactorización/modularización | `refactor:` | `refactor: simplificada la lógica de las llamadas a la API tal` |
| `style` | Rama de estilos y limpieza visual | `style:` | `style: mejorado UX` |

### Flujo de trabajo paso a paso

1. **Asegurate de estar sincronizado**: Antes de picar código baja los últimos cambios del repo

```bash
git checkout main
git pull origin main
```

2. **Crea tu rama de trabajo o muévete a ella si ya existe**: Si no existe la rama contemplada créala, y en el mensaje del commit ya describes los cambios de forma corta y directa

```bash
git checkout feature
```

3. **Guarda los cambios**: Según vayas terminando piezas de código dentro de la rama, guárdalas. Como puse antes, que los mensajes sean explicativos para que futuros devs sepan qué has hecho!

```bash
git add .
git commit -m "feat: añadido filtro por fecha de creación en buscador de clientes"
```
4. **Sube la rama a github**: Cuando hayas finalizado y probado en local, subelo al repo remoto

```bash
git push origin feature
```

5. **Fusionar con la rama `main` (PR)**: Ve al github del proyecto y crea un *Pull Request* solicitando unir tu rama hacia `main`. Una vez se revise tu código y se apruebe, se fusionará y estará listo para produ!

---

## Creditos y contribuciones

Proyecto estructurado, desarrollado y diseñado por **Patricia García López** aka la Sugus: [![Perfil de GitHub](https://img.shields.io/badge/GitHub-SugusGamberra-181717?logo=github&style=for-the-badge)](https://github.com/SugusGamberra)

[![Contribuidores](https://contrib.rocks/image?repo=EcoMagic/BBDD)](https://github.com/EcoMagic/BBDD/graphs/contributors)