import { useState } from 'react'


function CadastroUsuario() {
    
    const [nome, setNome] = useState("")
    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")
    
    function Cadastrar() {

    }
    
    return (
        <div>
            <h1>MY TRAVEL</h1>
            Usuário <input type="text"
           value={nome}
           onChange={(e) => setNome(e.target.value)}
           placeholder='Digite o usuário ou e-mail'/>
           <h2></h2>
            Senha <input type="text"
           value={senha} 
           onChange={(e) => setSenha(e.target.value)}
           placeholder='Digite sua senha'/>
        </div>
    )
}

export default CadastroUsuario