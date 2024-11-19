import { useState, useEffect } from "react";
import MainGame from "./MainGame"
import Intro from "./Intro"



function App() {

const [mainGame, setMainGame] = useState(false)
const [appLang, setAppLang] = useState(false)

 
console.log('Limba selectata acum este ' + appLang)


  return (
    <div>
       
     {mainGame ? <MainGame appLang={appLang} /> :
     <Intro 
     selectRo={()=> setAppLang(true)}
     selectEn={()=> setAppLang(false)}
     onButtonClick={()=> setMainGame(true)}/>
      
      }
    </div>
  );
}

export default App;
