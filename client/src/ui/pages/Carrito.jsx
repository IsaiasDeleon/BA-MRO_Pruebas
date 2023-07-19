import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { CardCarrito } from '../components/CardCarrito';
import { Noti } from '../components/Notificaciones';
import { AuthContext } from '../../auth/AuthContext';
import { useNavigate } from 'react-router';
const URLServer = "http://192.168.100.18:3020/"
const HTTP = axios.create({
    baseURL: "https://badgerautomation.com/MarketPlace/Server/Data.php"
})

export const Carrito = ({ NumElementsCarrito,setMenu }) => {
    const { user } = useContext(AuthContext);
    let idU = user?.id;
    const [elementsCarrito, setElementsCarrito] = useState([]);
    const [numArticulos, setNumArticulos] = useState(0);
    const [totalPrecio, setTotalPrecio] = useState(0);
    const [notiCarrito, setNotiCarrito] = useState();
    const [activeNoti, setActiveNoti] = useState();
    const [imgProducts, setImgProducts] = useState(true);
    const [valueCP, setValueCP] = useState("");
    const [valueUbi, setValueUbi] = useState("");

    const onInputChange2 = ({ target }) => {
        const { name, value } = target;
        switch (name) {
            case 'Ubicación':
                setValueUbi(value);
                break;
            case 'CP':
                setValueCP(value);
                break;
           
        }
    }
    //Function para obtener los elementos en el carrito
    function getItemCarrito() {
        if( idU !== undefined ){
            HTTP.post("/readCarrito",{"idU": idU}).then((response) => {
                if(response.data !== ""){
                    //Si la respuesta es correacta modificaremos el array con los objetos que obtenga desde la busqueda
                    setElementsCarrito(response.data);
                    setImgProducts(false);
                }else{
                    setElementsCarrito([]);
                    setImgProducts(true);
                }
            })
        }
    }

    //Hacemos una peticion para obtener los primero resultados que mostraremos
    useEffect(() => {
        //Peticion para obtener los elemtos del carrito
        getItemCarrito();
        Totales()
        setMenu(2)
    }, [])

    //Funcion para eliminar elemento del carrito enviamos el id del elemento clickeado
    function DeletItem(id) {
        if( idU !== undefined ){
            HTTP.post("/deleteItem", {"idU":idU, "id": id }).then((response) => {
                //Si la operacion se hizo correctamente nos regresara Eliminado
                if (response.data == "Eliminado") {
                    //Mandamos a llamar a la funcion de getItemCarrito para obtener la actualizacion de los elementos 
                    getItemCarrito()
                    //Llamamos a la funcion NumELementsCarrito para obtener ka actualizacion de los elementos en el carrito
                    NumElementsCarrito()
                    //Enviamos el mensaje a las notificaciones para mostrar la alerta al usuario
                    setNotiCarrito(response.data)
                    setActiveNoti(true)
                    setTimeout(() => {
                        setActiveNoti(false)
                    }, 4000);
                    //Llamamos a la funcion de totales para actualizar la cantida de productos y el total del precio
                    Totales()
                }
            })
            
        }
    }
    function Totales() {
        if(idU !== undefined){
            HTTP.post("/readCarrito",{"idU":idU}).then((response) => {
                if(response.data !== ""){
                    let num = 0;
                    let total = 0;
                    //recorremos los datos que nos arrojo para poder hacer una sumatoria del precio y los elementos ya que el usuario tendra la opcion de elegir la cantidad de stock que necesite
                    response.data.map((elementsCarrito) => {
                        let element;
                        try {
                            element = document.getElementById(`VItem${elementsCarrito.id}`).value;
                        } catch (error) {
                            element = 1;
                        }
    
                        //Validamos que no venga vacio
                        if (element == "") {
                            element = 0;
                        }
    
                        // Lo parseamos ya que necesitamos un tipo numerico
                        element = parseInt(element);
                        let multi = 0;
                        if(elementsCarrito.Oferta === 1){
                            multi = elementsCarrito.montoOferta * element;
                        }else{
                            multi =  elementsCarrito.monto * element;
                        }
                        
                        total = total + multi;
    
                        //Sumamos las cantidades que se píden 
                        num = num + element;
                    })
                    setNumArticulos(num)
                    setTotalPrecio(total.toFixed(2))
                }  
            })
           
        }
       
    }
    function Cotizar() {
        let ids = [];
        let cantidadByProducto = [];
        elementsCarrito.map((element) => {
            ids.push(element.id);
            let elements = document.getElementById(`VItem${element.id}`).value;
            cantidadByProducto.push(elements);
        });
        if(idU !== undefined){
            window.open(`https://ba-mro.mx/Server/Script.php?IP=${ids}&IU=${idU}&cantidades=${cantidadByProducto.toString()}`, '_blank');
        }
        
    }
    function Comprar(){
        let ids = [];
        let cantidadByProducto = [];
        elementsCarrito.map((element) => {
            ids.push(element.id);
            let elements = document.getElementById(`VItem${element.id}`).value;
            cantidadByProducto.push(elements);
        });
        if(valueUbi !=="" & valueCP !==""){
            if(idU !== undefined){
                window.open(`https://ba-mro.mx/Server/CorreoComprasCarrito.php?IP=${ids}&IU=${idU}&cantidades=${cantidadByProducto.toString()}&Ubi=${valueUbi}&CP=${valueCP}`, '_blank');
            }
        }else{
            alert("Ubicacion o CP vacio")
        }
       
    }
    const navigate = useNavigate();
    function inicio (){
            navigate('/Inicio', {
                replace: true
            })
        
    }
    return (
        <>
            <div className="contenedorCarrito" style={{ "overflowY": "auto" }}>
                {elementsCarrito.map((elementsCarrito) => (
                    <CardCarrito key={elementsCarrito.id} {...elementsCarrito} DeletItem={DeletItem} variable={`VItem${elementsCarrito.id}`} Totales={Totales} />
                ))}
                {
                  imgProducts  && (
                    <div className='CarritoVacio'>
                        <img src={`https://ba-mro.mx/Server/Images/CarritoVacio.png`} alt="IMGVacio" />
                        <h3>No hay productos agregados</h3>
                        <button className='btn btn-dark' onClick={() => inicio()}>Agregar nuevo producto</button>
                    </div>

                    
                  )
                }
            </div>
            <div className='ContenedorBottonTotales'>
                <hr style={{ "width": "95%", "margin": "0", "marginLeft": "2.5%" }} />
                <div className="d-flex justify-content-evenly align-items-center" style={{ "height": "95%" }}>
                    <div className=" text-center">
                        <h5 className='TotalesFont text-white'>Total de productos:</h5>
                        <h4 className="fw-bold text-secondary TotalesFont  text-white">{numArticulos}</h4>
                    </div>
                    <div className=" text-center">
                        <h5 className='TotalesFont text-white'>Precio total:</h5>
                        <h4 className=" fw-bold text-success TotalesFont">${totalPrecio}</h4>
                    </div>
                    <div className=" text-center">
                        <button className="btn btn-success btn-lg m-2" data-bs-toggle="modal" data-bs-target="#exampleModal" >Comprar</button>
                        <button className="btn btn-light btn-lg m-2" onClick={ () => Cotizar()}>Cotizar</button>
                    </div>
                </div>
            </div>
            <Noti notiCarrito={notiCarrito} activeNoti={activeNoti} />
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Compras</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div class="alert alert-success" role="alert">
                            Realice el pago de <b>${totalPrecio}</b> al siguiente número de cuenta 123456789098765, por un total de <b>{numArticulos}</b> artículos. Una vez que el proveedor confirme su pago se le enviara su producto. se le enviara un correo con todos los datos de sus productos y proveedores 
                            </div>
                            <div class="form-group">
                                <label htmlFor="ubicacion">Ubicación:</label>
                                <input name="Ubicación" value={valueUbi} onChange={(e) => onInputChange2(e)}  type="text" className="form-control" id="ubicacion"/>
                            </div>
                            <div class="form-group">
                                <label htmlFor="codigo-postal">Código Postal:</label>
                                <input name="CP" value={valueCP} onChange={(e) => onInputChange2(e)}  className="form-control"id="codigo-postal" type="number"/>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" onClick={() => Comprar()} className="btn btn-primary" data-bs-dismiss="modal">Comprar</button>
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}