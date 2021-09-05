import React,{useState, useEffect } from 'react';
import { useForm} from "react-hook-form";
import './table.css'

const Main = () =>{
    const { register, handleSubmit, formState: {errors}, setValue } = useForm()
    
    const [lista, setLista] = useState([]);
    const [alterar, setAlterar] = useState(false);
    const [data_id, setData_id] = useState(0);

    const onSubmit = (data, e) => {

        //acrescenta um novo atributo dos dados vindos do form(que ira ser recuperado depois pra consulta deleta alterar)
        data.id = new Date().getTime();

        console.log(data);

        const carros = localStorage.getItem("carros")? JSON.parse(localStorage.getItem("carros")):"";

        localStorage.setItem("carros", JSON.stringify([...carros, data]));

        // atualiza a lista
        setLista([...lista, data]);
 
        // pode-se limpar cada campo 
        setValue("modelo","");
        setValue("marca","");
        setValue("ano","");
        setValue("preco","");

        //ou limpar todo o form
        // e.target.reset();
    }

    useEffect(() => {
        setLista(localStorage.getItem("carros")? JSON.parse(localStorage.getItem("carros")):[])
       
    }, [])

    const ano_atual = new Date().getFullYear();

    const handleClick = e => {

        //obtém a linha da tabela a qual o usuário clicou ou seja o elemento "tr"
        const tr = e.target.closest("tr");

        // console.log(e.target);
        // console.log(tr);
        // console.log(tr.getAttribute("data-id"));

        const id = Number(tr.getAttribute("data-id"));

        // se clicar sobre o botaro alterar
        if(e.target.classList.contains("fa-edit")){
            // console.log("Alterar");

            // recuperando os valores dos campos de elemento selecionado
            setValue("modelo", tr.cells[0].innerText);
            setValue("marca",tr.cells[1].innerText);
            setValue("ano",tr.cells[2].innerText);
            setValue("preco",tr.cells[3].innerText);

            setAlterar(true);
            setData_id(id);
        }else if(e.target.classList.contains("fa-trash-alt")){
            // console.log("Excluir");

            //obtém o modelo da linha clicada
            const modelo = tr.cells[0].innerText;

            if(window.confirm(`Confirma a exclusão do veículo "${modelo}" ?`)){
                //aplica um filtro para recuperar todas as linhas, exceti a que se quer excluir
                const novaLista = lista.filter(carro => carro.id !== id);

                //atualiza os dados de localStorage 
                localStorage.setItem("carros", JSON.stringify(novaLista));

                //refresh na lista exibida na table
                setLista(novaLista);
            }

        }
    }// end handleClick

    const onUpdate = data => {

        const carros = JSON.parse(localStorage.getItem("carros"));

        //cria um novo array que irá conter os dados originais e a linha alterada
        const carros2 = [];

        for(const carro of carros){
            if(carro.id === data_id){
                data.id = data_id;
                carros2.push(data)
            }else{
                carros2.push(carro);
            }
        }

        //atualiza o localStorage com os dados de carros2
        localStorage.setItem("carros", JSON.stringify(carros2));

        // atualiza a lista
        setLista(carros2);
 
        // pode-se limpar cada campo 
        setValue("modelo","");
        setValue("marca","");
        setValue("ano","");
        setValue("preco","");

        //altera o botão para incluir (padrão)
        setAlterar(false);
    }

    const handleSearch = (data, e) =>{
        e.preventDefault();
        console.log(data)
    }
    
    return(
        <div className="row">
            <div className="col-sm-3">
                <img 
                    src="imagemRevenda.jpg"
                    alt="Revenda herbie"
                    className="img-fluid mx-auto d=block"
                />
            </div>

            <div className="col-sm-9 mt-2">
                <form onSubmit={alterar ? handleSubmit(onUpdate) : handleSubmit( onSubmit )}>
                    <div className="input-group mb-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text">Modelo:</span>
                        </div>
                        <input 
                            type="text" 
                            className="form-control" 
                            {...register("modelo",{
                                required:true,
                                minLength:2,
                                maxLength:30,
                            })}
                            autoFocus
                        />

                        <div className="input-group-prepend">
                            <span className="input-group-text">Marca:</span>
                        </div>
                        <select 
                            className="form-control"
                            {...register("marca",{
                                required:true
                            })}
                        >
                            <option value="">-- Selecione a Marca --</option>
                            <option value="Chevrolet">Chevrolet</option>
                            <option value="Fiat">Fiat</option>
                            <option value="Ford">Ford</option>
                            <option value="Volkswagen">Volkswagen</option>
                        </select>     
                    </div>
                    <div className="input-group mb-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text">Ano:</span>
                        </div>
                        <input
                            type="number"
                            className="form-control"
                            {...register("ano",{
                                required:true,
                                min: ano_atual -30,
                                max: ano_atual + 1
                            })}
                        />
                        <div className="input-group-prepend">
                            <span className="input-group-text">Preço R$:</span>
                        </div>
                        <input 
                            type="number"
                            className="form-control"
                            {...register("preco",{
                                required:true,
                                min: 5000,
                                max: 100000
                            })}
                        />
                        <div className="input-group-append">
                            <input 
                                type="submit"
                                className={alterar ? "d-none" : "btn btn-primary"}
                                value="Adicionar"
                            />
                            <input 
                                type="submit"
                                className={alterar ? "btn btn-success" : "d-none"}
                                value="Alterar"
                            />
                        </div>
                    </div>
                </form>
                <nav className="navbar navbar-expand-sm  navbar-dark">
                    <form className="form-inline" onSubmit={handleSearch( onSubmit)} >
                        <input 
                        className="form-control mr-sm-2" 
                        type="text" 
                        placeholder="Search" 
                        {...register("search")}
                        />
                        <button className="btn btn-success" type="submit">Search</button>
                    </form>
                </nav>
                <div
                    className={
                        (errors.modelo || errors.marca || errors.ano || errors.preco) && "alert alert-danger"
                    }
                >
                    {errors.modelo && (
                        <span>Modelo deve ser preenchido (ate 30 caracteres);</span>
                    )}
                    {errors.marca && <span>Marca deve ser selecionada;</span>}
                    {errors.ano && (
                        <span>
                            Ano deve ser preenchido (entre {ano_atual - 30} e {ano_atual + 10});
                        </span>
                    )}
                    {errors.preco && (
                        <span>Preço deve ser preenchido (entre 5000 e 100000);</span>
                    )}
                </div>

                <table className="table table-striped">
                    <thead>
                        <tr>
                        <th>Modelo do  Veículo</th>
                        <th>Marca</th>
                        <th>Ano</th>
                        <th>Preço</th>
                        <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            lista.map(carro =>{
                                return(
                                    <tr 
                                      key={carro.id} 
                                      data-id={carro.id}
                                      onClick={handleClick}  
                                    >
                                        <td>{carro.modelo}</td>
                                        <td>{carro.marca}</td>
                                        <td>{carro.ano}</td>
                                        <td>{carro.preco}</td>
                                        <td>
                                        <i className="fas fa-edit text-success mr-2" title="Alterar"></i>
                                        <i className="fas fa-trash-alt text-danger " title="Excluir"></i>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Main;