import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import React, { useState, useEffect } from 'react';

const API_URL = 'https://playground.4geeks.com/apis/fake/todos/user/luisacc';

function App() {
  const [item, setItem] = useState('');
  const [list, setList] = useState([]);

  useEffect(() => {
    obtenerListaDesdeAPI();
  }, []);

  const obtenerListaDesdeAPI = () => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => {
        console.log('Datos recibidos de la API (GET):', data);
        setList(Array.isArray(data) ? data : []);
      })
      .catch((error) => {
        console.error('Error al obtener datos (GET):', error);
      
      })
      .finally(() => {
        // ...
      });
  };

  const addItemToAPI = () => {
    try {
      if (item.trim() !== '') {
        const newItem = { label: item, done: false };
        const updatedList = [...list, newItem];

        fetch(API_URL, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedList),
        })
          .then((response) => response.json())
          .then((data) => {
            if (Array.isArray(data)) {
              setList(data);
            } else {
              console.error('Error in API response (PUT):', data);
            }
          })
          .catch((error) => {
            console.error('Error adding item:', error);
          });

        setItem('');
      }
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const deleteItem = (index) => {
    try {
      const updatedList = list.filter((_, i) => i !== index);

      fetch(API_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedList),
      })
        .then((response) => response.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setList(data);
          } else {
            console.error('Error in API response (PUT):', data);
          }
        })
        .catch((error) => {
          console.error('Error updating list after deleting item:', error);
        });
    } catch (error) {
      console.error('Error getting item to delete:', error);
    }
  };

  const handleKeyPressed = (event) => {
    if (event.key === 'Enter') {
      addItemToAPI();
    }
  };

  return (
    <div className="todo-container">
      <div className="paper">
        <h1>TO DO LIST</h1>
        <input
          type="text"
          value={item}
          onChange={(event) => setItem(event.target.value)}
          onKeyDown={handleKeyPressed}
          placeholder="Ingrese una tarea"
        />

        {Array.isArray(list) && list.length === 0 ? (
          <p>No hay tareas pendientes</p>
        ) : (
          <ul>
            {list.map((element, index) => (
              <li key={index}>
                {element.label}
                <button onClick={() => deleteItem(index)}>X</button>
              </li>
            ))}
          </ul>
        )}

        <p>{Array.isArray(list) ? list.length : 0} tarea(s) restante(s)</p>
      </div>
    </div>
  );
}

export default App;
