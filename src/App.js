import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  let [lista, setLista] = useState([]);
  let [Item, setItem] = useState('');

  function listarTarefas() {
    axios.get('http://localhost:3030/api/tarefas')
      .then(response => {
        setLista(response.data);
      })
      .catch(error => {
        console.error("Erro ao buscar tarefas:", error);
      });
  }

  useEffect(listarTarefas, []);

  function addItem() {
    axios.post('http://localhost:3030/api/tarefas', { nome: Item, concluida: 0 }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (response.status === 201) {
          console.log('Nova tarefa cadastrada:', response.data);
          setLista([...lista, { id: response.data.id, nome: Item, concluida: 0 }]);
          setItem('');
        } else {
          console.error('Erro ao cadastrar tarefa:', response.data);
        }
      })
      .catch(error => {
        console.error("Erro ao adicionar item:", error.response ? error.response.data : error.message);
      });
  }

  function deletarItem(index) {
    const id = lista[index].id;

    axios.delete(`http://localhost:3030/api/tarefas/${id}`)
      .then(response => {
        let tmpArray = [...lista];
        tmpArray.splice(index, 1);
        setLista(tmpArray);
      })
      .catch(error => {
        console.error("Erro ao deletar tarefa:", error);
      });
  }

  function marcarComoConcluida(index) {
    const id = lista[index].id;
    const isConcluida = lista[index].concluida === 0 ? 1 : 0;

    axios.patch(`http://localhost:3030/api/tarefas/${id}`, { concluida: isConcluida })
      .then(response => {
        let tmpArray = [...lista];
        tmpArray[index].concluida = isConcluida;
        setLista(tmpArray);
      })
      .catch(error => {
        console.error("Erro ao marcar tarefa como concluída:", error);
      });
  }

  return (
    <>
      <div className='container'>
        <h1>LISTA DE TAREFAS</h1>
        <div className='novoItem'>
          <input
            placeholder='Tarefa'
            value={Item}
            onChange={value => setItem(value.target.value)}
            type='text'
          />
          <button onClick={addItem}>Adicionar</button>
        </div>
        <ul className='lista'>
          {lista.map((item, index) => (
            <li key={index} className='item'>
              <input
                type='checkbox'
                checked={item.concluida}
                onChange={() => marcarComoConcluida(index)}
              />
              {item.nome}
              <button onClick={() => deletarItem(index)}>Deletar</button>
            </li>
          ))}
        </ul>
        <button onClick={listarTarefas}>Listar</button>
      </div>
    </>
  );
}

export default App;