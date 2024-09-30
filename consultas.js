const { Pool } = require("pg");
const format = require('pg-format');

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    password: "123456",
    database: "joyas",
    port: 5432,
    allowExitOnIdle: true
});


const obtenerJoyas = async ({ limits = 10, order_by = "id_ASC", page = 1 }) => {
    const [campo, direccion] = order_by.split("_");
    const offset = (page - 1) * limits;
    const formattedQuery = format('SELECT * FROM  inventario order by %s %s LIMIT %L OFFSET %s', campo, direccion, limits, offset);
    const { rows: joyas } = await pool.query(formattedQuery);    
    const resp = {
        totalJoyas: joyas.length,
        stockTotal: joyas.reduce((acum, joya) => acum + joya.stock, 0),
        results : joyas.map((joya) => ({
            name: joya.nombre,
            href: `/joyas/joya/${joya.id}`,
          }))
    };
    return resp;
}

const obtenerJoyasFiltro = async ({ precio_max, precio_min, categoria, metal }) => {

    let filtros = [];
    const values = [];

    const agregarFiltro = (campo, comparador, valor) => {
        values.push(valor);
        filtros.push(`${campo} ${comparador} $${filtros.length + 1}`);
    };
    
    if (precio_min) agregarFiltro('precio', '>=', precio_min);
    if (precio_max) agregarFiltro('precio', '<=', precio_max);
    if (categoria) agregarFiltro('categoria', '=', categoria);
    if (metal) agregarFiltro('metal', '=', metal);

    let consulta = 'SELECT * FROM inventario';

    if (filtros.length > 0) {
        filtros = filtros.join(' AND ');
        consulta += ` WHERE ${filtros}`;
    }

    const { rows: joyas } = await pool.query(consulta, values);
    
    return joyas;
}


module.exports = { obtenerJoyas, obtenerJoyasFiltro };