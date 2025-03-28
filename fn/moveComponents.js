const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Función para copiar recursivamente una carpeta
function copyFolderSync(from, to) {
    fs.mkdirSync(to, { recursive: true });
    fs.readdirSync(from).forEach(element => {
        const fromPath = path.join(from, element);
        const toPath = path.join(to, element);
        if (fs.lstatSync(fromPath).isFile()) {
            if (!fs.existsSync(toPath)) {
                fs.copyFileSync(fromPath, toPath);
            }
        } else {
            copyFolderSync(fromPath, toPath);
        }
    });
}

function transformPath(pathString) {
    const transformedSegments = pathString.split('/');
    const pathJoin = path.resolve(__dirname, "..", "src", "components", ...transformedSegments);
    return pathJoin;
}

// Rutas preestablecidas
const predefinedPaths = {
    alanaLayout: transformPath('layout/ecommerce/alana'),
    algolia: transformPath('algolia'),
    headerToolTip: transformPath('layout/tooltip'),
    btnLoki: transformPath('btns/hamburguesa/btnLoki'),
    btnNormalBasic: transformPath('btns/basic/btnNormalBasic'),
    navBasic: transformPath('layout/nav'),

    sliderBackground: transformPath('swiper/sliderBackgroud'),
    swiperStructure: transformPath('swiper/estructura'),
    sectionCategoriaSlider: transformPath('sections/ecomerce/categoriaSlider'),

    formLoki: transformPath('form/formLoki'),
    btnText: transformPath('btns/basic/btnText'),
    btnRowCircle: transformPath('btns/animate/btnRowCircle'),

    viewLoginLoki: transformPath('view/authAlana'),

    nano: transformPath('nano'),

    tabletExample: transformPath('view/example/agTablet'),
    tabletAg: transformPath('tablet'),

    mentorBasicImgcomponent: transformPath('mentor/basico/bentorgrid'),

};

// Dependencias de cada opción
const dependencies = {
    /* nano */
    nano: [""],
    /* layout */
    alanaLayout: ['algolia', 'headerToolTip', 'btnLoki', "btnNormalBasic", "navBasic"],
    sliderBackground: ['btnNormalBasic', "swiperStructure"],
    formLoki: ["btnText", "btnRowCircle"],
    /* view */
    viewLoginLoki: ["formLoki", "swiperStructure", "btnText"],
    tabletExample:["tabletAg"],

    mentorBasicImgcomponent: [''],

};

// Opciones disponibles (excluyendo dependencias)
const availableOptions = Object.keys(predefinedPaths).filter(key => !Object.values(dependencies).flat().includes(key));

// Configura readline para leer la entrada del usuario
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Muestra las opciones al usuario
console.log('Opciones disponibles:');
availableOptions.forEach(key => {
    console.log(`- ${key}`);
});

// Pregunta al usuario por la opción
rl.question('Introduce la opción del directorio a copiar: ', (option) => {
    const source = predefinedPaths[option];
    if (!source) {
        console.error('Opción no válida');
        rl.close();
        return;
    }

    // Pregunta al usuario por el nombre del directorio de destino
    rl.question('Introduce el nombre del directorio de destino (deja en blanco para usar la opción): ', (destDir) => {
        console.log('Copiando archivos...');
        const targetDir = destDir || option;
        const target = path.join(__dirname, "..", '..', '..', 'src', "components", targetDir);
        const dirName = targetDir.toUpperCase();

        // Verifica si la carpeta de destino ya existe
        if (!fs.existsSync(target)) {
            try {
                copyFolderSync(source, target);
                console.log(`Carpeta copiada ${dirName}`);

                // Copia las dependencias si existen
                if (dependencies[option]) {
                    dependencies[option].forEach(dep => {
                        const depSource = predefinedPaths[dep];
                        const depTarget = path.join(__dirname, "..", '..', '..', 'src', "components", path.relative(path.join(__dirname, "..", 'src', 'components'), depSource));
                        if (!fs.existsSync(depTarget)) {
                            copyFolderSync(depSource, depTarget);
                            console.log(`Dependencia copiada ${dep.toUpperCase()}`);
                        } else {
                            console.log(`La carpeta de destino ${dep.toUpperCase()} ya existe. No se copian los archivos.`);
                        }
                    });
                }
            } catch (error) {
                console.error(`Error al copiar la carpeta ${dirName}`, error);
            }
        } else {
            console.log(`La carpeta de destino ${dirName} ya existe. No se copian los archivos.`);
        }
        rl.close();
    });
});