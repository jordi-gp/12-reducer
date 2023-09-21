import React, { useEffect, useReducer } from 'react';
import { JuegoReducer } from '../reducers/JuegoReducer';

/*
    La función init se declara fuera porque su finalidad no es que sea
    cargada con el componente, sino que se va a utilizar como una dependencia
*/
const init = () => {
    //En caso de que el localStorage no tenga juegos, devuelve un array vacío
    return JSON.parse(localStorage.getItem('juegos')) || [];
}

export const MisJuegos = () => {
    /*
        En este caso el segundo parametro que se pasa es dispatch,
        ya que va a ser este el que se encargue de disparar la acción
        que en el reducer se va a ejecutar
    */
    const [ juegos, dispatch ] = useReducer(JuegoReducer, [], init);

    useEffect(() => {
        localStorage.setItem('juegos', JSON.stringify(juegos))
    }, [juegos]);

    const obtenerInformacion = e => {
        e.preventDefault();

        let juego = {
            id: new Date().getTime(),
            title: e.target.title.value,
            description: e.target.description.value
        }

        /*
            La constante 'action contiene varios elementos', el primero es el caso
            que va a realizar en el switch case definido en el reducer, el payload
            es el objeto nuevo que se quiere guardar en este caso. 
            
            Para poder lanzar la acción se ha de llamar 'dispatch', que en caso de
            estar gastando de forma normal un useState vendría a ser lo mismo que
            setJuegos, solo que en este caso, en vez de pasar el juego que queremos 
            meter le pasamos la acción para que sea el reducer quien se encargue de ello.
        */
        const action = {
            type: 'crear',
            payload: juego
        };

        dispatch(action);
        console.log(juegos);
    }

    const borrarJuego = id => {
        const action = {
            type: 'borrar',
            payload: id
        }

        dispatch(action);
    }

    const editarJuego = (e, id) => {
        let juego = {
            id: id,
            title: e.target.value,
            description: e.target.value
        }

        const action = {
            type: 'editar',
            payload: juego
        }

        dispatch(action);
    }

    return (
        <div>
            <h1>Estos son mis videojuegos</h1>
            <p>Número de videojuegos: {juegos.length}</p>
            <ul id='listado-videojuegos'>
                {
                    juegos.map(juego => (
                        <li key={juego.id}>
                            {juego.title}
                            <button onClick={e => borrarJuego(juego.id)}>X</button>
                            <input type='text' placeholder='Editar'
                                onBlur={e => editarJuego(e, juego.id)}  
                                onKeyPress={e => {
                                    if(e.key === "Enter") {
                                        editarJuego(e, juego.id);
                                        console.log('Se ha presionado Enter');
                                    }
                                }}
                            />
                        </li>
                    ))
                }
            </ul>
            <h3>Agregar videojuego</h3>
            <form onSubmit={obtenerInformacion}>
                <input type='text' name='title' placeholder='Título' />
                <textarea name='description' placeholder='Descripción' />
                <input type='submit' value='Enviar' />
            </form>
        </div>
    )
}
