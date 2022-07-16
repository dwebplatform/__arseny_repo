import React, {useState,useEffect} from 'react';
import './App.css';
import { IStage, Stage } from './components/Stage';
/**
 * const response = await fetch(url, {
    method: 'POST', // или 'PUT'
    body: JSON.stringify(data), // данные могут быть 'строкой' или {объектом}!
    headers: {
      'Content-Type': 'application/json'
    }
  });
 */


interface ILevel {
  id:number;
  name: string;
  stages: IStage[];
}


function App() {
  const [levels,setLevels] = useState<ILevel[]>([]);
  const [levelName, setLevelName] = useState('');

  const addStageToLevel= async (levelId:number)=>{
    try {
      const response = await fetch(`http://localhost:5000/level/add-stage-to-level`,{
        method: 'POST',  
        body: JSON.stringify({id:levelId}), 
        headers: {
          'Content-Type': 'application/json'
        }
        })
        const createdStage = await response.json();
        console.log(createdStage)
    } catch(err){
      console.log(err)
    }
  }
  useEffect(()=>{
    async function getLevels(){
      try {
        const response = await fetch('http://localhost:5000/level/all')
        const levelsData = await response.json() as any;
        if(levelsData.status=="ok"){
          setLevels(levelsData.levels)
        }
      } catch(err){
        console.log(err,"ERR")
      } 
    }
    getLevels();
  },[]);


  const addLevel = async ()=>{
    try {
      const response = await fetch('http://localhost:5000/level/create-level',{
        method:'POST',
        body: JSON.stringify({name:levelName}),
        headers: {
          'Content-Type': 'application/json',
        },
      })
    } catch(err){
      console.log(err,"ERR")
    }
  }
  
  return (
    <div className="level-admin">
      <div>
        Добавить уровень
        <input value={levelName} onChange={(e)=>{
          setLevelName(e.target.value)
        }} placeholder="Введите название"/>
        <button onClick={addLevel}>Добавить уровень</button>
      </div>
        {levels.map(level=>{
          return <div key={level.id} className="level-element">
            <div className="level-title">
            {level.name}
            </div>
            Добавить этап
            <div className="add-stage">
              <button className="add-stage-btn"
              onClick={()=>addStageToLevel(level.id)}
              >+</button>
            </div>
            <div className="level-stages">
              {level.stages.length ? level.stages.map(stage=>{
                return <Stage stage={stage} key={stage.id}/>
              }):"У данного уровня нет этапов"}
            </div>
          </div>
        })}
    </div>
  );
}

export default App;
