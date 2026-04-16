import { useState } from 'react'
import './CadastroUsuario.css'

function CadastroUsuario() {

    const [nome, setNome] = useState("")
    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")
    const [confirmarSenha, setConfirmarSenha] = useState("")

    function Cadastrar() {

    }

    return (
        <div className={"cont-cadastro"}>
        <h1>MY TRAVEL</h1>
            <div className={"cont-form"}>
                <h1>Crie sua conta</h1>
                <div className={"cont-inputs"}>
                    <label>Nome</label> <input type="text"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        placeholder='Digite seu nome completo' />
                </div>
                <div className={"cont-inputs"}>
                    <label>
                        E-mail
                </label>
                    <input type="mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder='Digite o seu e-mail' />
                </div>
                <div className={"cont-inputs"}>
                    <label>
                        Senha
                </label>
                    <input type="text"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        placeholder='Crie sua senha' />
                </div>
                <div className={'cont-inputs'}>
                    <label>
                        Confirmar Senha
                </label>
                    <input type="text"
                        value={confirmarSenha}
                        onChange={(e) => setConfirmarSenha(e.target.value)}
                        placeholder='Digite novamente sua senha' />
                </div>
            </div>
        </div>
    )
}

export default CadastroUsuario
