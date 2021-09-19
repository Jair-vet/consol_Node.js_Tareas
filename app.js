require('colors');

const { guardadDB, leerDB } = require('./helpers/guardarArchivo');
const { inquirerMenu, 
        pausa,
        leerInput,
        listadoTareasBorrar,
        confirmar,
        mostrarListadoChecklist
           } = require('./helpers/inquirer');
const Tareas = require('./models/tareas');


const main = async () => {

    let opt = '';
    const tareas = new Tareas();


    const tareasDB = leerDB();
    if (tareasDB){
        // Establecer las tareas
        // Cargar las tareas
        tareas.cargarTareasFromArray(tareasDB);
    }
    
    do{
        // Imprime el menu
        opt = await inquirerMenu();
        
        switch(opt){
            case '1': // Crear una  Tarea
                const desc = await leerInput('Descripcion: ');
                tareas.crearTarea(desc);
            break;
            case '2': // Listar Tareas
                tareas.listadoCompleto();
            break;
            case '3': // Listar completadas
                tareas.listarPendientesCompletadas(true);
            break;
            case '4': // Listar Pendientes
                tareas.listarPendientesCompletadas(false);
            break;
            case '5': // Completado | Pendiente
                const ids = await mostrarListadoChecklist( tareas.listadoArr );
                tareas.toggleCompletadas(ids);
            break;
            case '6': // Borrar Tareas
                const id = await listadoTareasBorrar( tareas.listadoArr );
                //Preguntar si esta seguro de Borrar
                if (id !== '0'){
                    const ok = await confirmar('¿Estas Seguro');
                    if (ok){
                        tareas.borrarTarea(id);
                        console.log(`Tarea Borrada...`.green);
                    }
                }
                
            break;
        }
        // Se guarda en la base de Datos
        guardadDB( tareas.listadoArr );

         await pausa();
        // if (opt !== '0') await pausa(); // Salirse de una manera mas rapida
        
    } while(opt !== '0');

    //pausa();

}


main();




// 
// 
// const tareas = new Tareas();
// const tarea = new Tarea('Comprar comida');
// 
// tareas._listado[tarea.id] = tarea;
// 
// console.log(tareas);