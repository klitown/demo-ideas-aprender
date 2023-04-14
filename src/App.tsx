import MemoryGame from './components/MemoryGame'
import './App.css';
import { Route } from "wouter";
import Home from './components/Home';
import Crucigrama from './components/Crucigrama';


function App() {
  return (
    <div>
      <Route path='/' component={Home} />
      <Route path='/crucigrama' component={Crucigrama} />
      <Route path="/memory">
        {() => <MemoryGame rows={4} cols={4} />}
      </Route>
    </div>
  )
}

export default App