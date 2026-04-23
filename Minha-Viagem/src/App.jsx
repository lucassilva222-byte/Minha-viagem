import { useState } from 'react'
import './App.css'
import CadastroUsuario from './cadastro/CadastroUsuario';
import Home from './home/Home';
import Login from './login/LoginViagem';

function App() {
  const [tela, setTela] = useState(<Home />)

  return (
    <>
      <div className="cont-app">
        <header className={"cont-header"}>
        <h1>MY TRAVEL</h1>
          <nav>
            <button className={"botoes-nav"} onClick={() => setTela(<Home />)}>HOME</button>
            <button className={"botoes-nav"} onClick={() => setTela(<CadastroUsuario />)}>CADASTRO</button>
            <button className={"botoes-nav"} onClick={() => setTela(<Login />)}>LOGIN</button>
          </nav>
        </header>
        <main className={"cont-main"}>
          {tela}
        </main>

      </div>
    </>
  )
}

export default App
