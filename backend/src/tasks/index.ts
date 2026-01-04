import cron from 'node-cron';

const task = () => {
    cron.schedule('30 2 * * *', () => (console.log('Ejecutando tarea programada')));
}

export default task;