import { useContext, useEffect, useState } from "react";
import { Head } from "../ui/components/Head";
import { Menu } from "../ui/components/Menu";
import { Inicio } from "../ui/pages";
import { AuthContext } from "../auth/AuthContext";
import axios from "axios";
import { Noti } from "../ui/components/Notificaciones";
import { Head2 } from "../ui/components/Head2";
import { Carrito } from "../ui/pages/Carrito";
import { EditarPerfil } from "../ui/pages/EditarPerfil";
import { Producto } from "../ui/pages/Producto";
import { Navigate, Route, Routes, useNavigate } from "react-router";
import { Login } from "../ui/pages/Login";
import { MyProducts } from "../ui/pages/myProducts";
import { NewProduct } from "../ui/pages/NewProduct";
import { ComprasProduct } from "../ui/pages/Compras";
import { Somos } from "../ui/pages/QuienesSomos";
import AdminUserTable from "../ui/pages/NewUserProveedor";
const URLServer = "http://192.168.100.18:3020/"
const HTTP = axios.create({
    baseURL: "https://badgerautomation.com/MarketPlace/Server/Data.php"
})

export const AppRoute = () => { 

            const navigate = useNavigate();
            //Obtenemos el id logueado
            const { user } = useContext( AuthContext );
            let idU = user?.id;
            let IdEmpresaDB = user?.empresa ?? 0;
            //Global estado de menu
            const [estadoMenu, setEstadoMenu] = useState(false);
            //Get data 
            const [data, setData] = useState([])
            //Data de filtros
            const [dataFiltrado, setDataFiltrado] = useState([])
            //Get Numero de articulos en el carrito
            const [numArticulos, setNumArticulos] = useState(0);
            //Get numero de articulos en gustos
            const [numGustos, setNumGustos] = useState(0);
            //Get numero de articulos en gustos
            const [numNoti, setNumNoti] = useState(0);
            const [elemntsNoti, setElementsNoti] = useState([]);
            //Elementos de la tabla gustos
            const [elemntsGustos, setElementsGustos] = useState([]);
            const [notiCarrito, setNotiCarrito] = useState();
            const [activeNoti, setActiveNoti] = useState();
    
            //Identificador para ver si quitamos el menu y cambiamos de head
            const [menu, setMenu] = useState(1);
            //ELemento clickeado PRODUCTO
            const [clickProducto, setClickProducto] = useState();
            //ELemento clickeado PRODUCTO noti
            const [clickNoti, setClickNoti] = useState();
    
            const [idCard, setIdCard] = useState();
            const [idCard2, setIdCard2] = useState();

            //Acomodo de productos en pantalla Inicio
            const [acomodoCars, setAcomodoCards] = useState(false);

            //PRODUCTO NUEVO
            const [imagesArray, setImagenesArray] = useState([]);

            //GEtCategorias
            const [dataCategrorias, setCataCategrorias] = useState([])
           
            //Obtenemos los productos de MISPRODUCTOS filtrados
            const [misProductos,setMisProductos] = useState([]);
            
            //FILTROS Object
            const [value, setValue] = useState([1000, 4000]);
            const [filtros, setFiltros] = useState({
                Catego:"",
                text:"",
                value: value,
                Oferta: 0,
                Estado: 3
            });
            function getCate(){
                HTTP.post("/getCat",{"id":1}).then((response) => {
                    if(response.data != ""){
                        setCataCategrorias(response.data)
                    }else{
                        setCataCategrorias([])
                    }
                })
            }
            useEffect(() => {
                getCate();
            },[])
            function busquedas(){
                HTTP.post("/PruebasBusqueda",filtros).then((response) => {
                   
                    setDataFiltrado(response.data)
                })
            }
            useEffect(() => {
                busquedas()
            }, [filtros])
            
            function NumElementsNoti(){
                setNumNoti(0)
                if(idU !== undefined){
                    HTTP.post("/GetNumNoti",{"id":idU}).then((response) => {
                        if(response.data !== ""){
                            setNumNoti(response.data)
                        }
                        
                    })
                }
               
            }
            function ElementsNoti(){
                setElementsNoti([])
                if(idU !== undefined){
                    HTTP.post("/GetElementsNoti", {"id":idU}).then((response) => {
                        console.log(response.data)
                        if(response.data !== ""){
                            setElementsNoti(response?.data);
                        }
                    })
                }
            }
            function NumElementsGustos(){
                setNumGustos(0)
                if(idU !== undefined){
                    HTTP.post("/GetNumGustos",{"id":idU}).then((response) => {
                        if(response.data !== ""){
                            setNumGustos(response.data)
                        }
                        
                    })
                }
               
            }
            function NumElementsCarrito() {
                setNumArticulos(0)
                if(idU !== undefined){
                    //Peticion para obtener el numero de productosque tiene en el carrito
                    HTTP.post("/GetNumCarrito",{"id":idU}).then((response) => {
                        if(response.data !== ""){
                            setNumArticulos(response.data)
                        }
                    })   
                } 
            }
            function ElementsGustos(){
                setElementsGustos([])
                if(idU !== undefined){
                    HTTP.post("/GetElementsGustos", {"id":idU}).then((response) => {
                        if(response.data !== ""){
                            setElementsGustos(response?.data);
                        }
                    })
                }
            }
            function DeleteItemGustos(id) {
                console.log("entro")
                if( idU !== undefined ){
                    console.log("idU"+ idU + "id"+ id)
                    HTTP.post("/deleteItemGustos", {"idU":idU, "id": id }).then((response) => {
                        //Si la operacion se hizo correctamente nos regresara Eliminado
                        if (response.data == "EliminadoGusto") {
                            //Mandamos a llamar a la funcion de getItemCarrito para obtener la actualizacion de los elementos 
                            ElementsGustos()
                            //Llamamos a la funcion NumELementsCarrito para obtener ka actualizacion de los elementos en el carrito
                            NumElementsGustos()
                            //Enviamos el mensaje a las notificaciones para mostrar la alerta al usuario
                            setNotiCarrito(response.data)
                            setActiveNoti(true)
                            setTimeout(() => {
                                setActiveNoti(false)
                            }, 4000);
                        }
                    })
                }
                
            }
            
            function EliminarNotiFicacion(id) {
                if( idU !== undefined ){
                   
                    HTTP.post("/EliminarNotiFicacion", {"idU":idU, "id": id }).then((response) => {
                        //Si la operacion se hizo correctamente nos regresara Eliminado
                        console.log(response)
                        if (response.data == "ContraRechazada") {
                            
                            ElementsNoti()
                       
                            NumElementsNoti()
                            //Enviamos el mensaje a las notificaciones para mostrar la alerta al usuario
                            setNotiCarrito(response.data)
                            setActiveNoti(true)
                            setTimeout(() => {
                                setActiveNoti(false)
                            }, 4000);
                        }
                    })
                }
                
            }
            function ComprarProductoNoti(id){
                if( idU !== undefined){
                    HTTP.post("/ComprarPoductoNoti",{"idU":idU, "id":id}).then((response) => {
                       
                        
                        setMenu(2);
                        const dataToPass = {
                            idU: idU,
                            id: id,
                            ...response.data?.[0] // Incluimos los datos de response.data si es necesario
                          };
                        navigate('/Compras', {
                            replace: true,
                            state: dataToPass
                        })
                    })
                }
            }
            function head2misproductos(Busiden){
                HTTP.post("/head2misproductos",{"idU":IdEmpresaDB,"BusIden":Busiden}).then((response) => {
                    console.log(response)
                    setMisProductos(response.data);
                })
            }

            useEffect(() => {
                if(clickProducto !== undefined){
                    localStorage.setItem('idProduct', JSON.stringify(clickProducto))
                }
            },[clickProducto])
            useEffect(() => {
                if(idU !== undefined){
                    NumElementsCarrito();
                    NumElementsGustos();
                    ElementsGustos();
                    ElementsNoti();
                    NumElementsNoti();
                }
            }, [idU])
          
        
            useEffect(() => {
                //Comrpobamos que el idCard no venga vacio
                if (idCard != undefined) {
                    if(idU == undefined){ 
                         //Actualizamo el mensaje que nos envio el server para mostrar en pantalla
                         setNotiCarrito("NotUserGustos");
                         //Activamos y desactivamos la alerta para atener una animacion
                         setActiveNoti(true);
                         setTimeout(() => {
                             setActiveNoti(false)
                         }, 4000);
                        return;
                    }
                    //Peticion para agregar un nuevo producto al carrito
                    HTTP.post("/gustos", { "idU": idU,"Num": idCard }).then((response) => {
                        //Actualizamos el mensaje que nos envio el server para mostarr la alerta
                        setNotiCarrito(response.data)
                        //Activamos y desactivamos la alerta para tener una animacion
                        setActiveNoti(true)
                        setTimeout(() => {
                            setActiveNoti(false)
                        }, 4000);
                        NumElementsGustos();
                        ElementsGustos();
                    })
                }
            }, [idCard])
            
            const actualizarCarrito = () => {
                // Comprobamos que el idCard2 no esté vacío
                if (idCard2 !== undefined) {
                    if (idU === undefined) {
                        // Actualizamos el mensaje que nos envió el servidor para mostrar en pantalla
                        setNotiCarrito("NotUserCarrito");
                        // Activamos y desactivamos la alerta para tener una animación
                        setActiveNoti(true);
                        setTimeout(() => {
                            setActiveNoti(false);
                        }, 4000);
                        return;
                    }
                    HTTP.post("/carrito", { "idU": idU, "Num": idCard2 }).then((response) => {
                        // Actualizamos el mensaje que nos envió el servidor para mostrar en pantalla
                        setNotiCarrito(response.data);
                        // Activamos y desactivamos la alerta para tener una animación
                        setActiveNoti(true);
                        setTimeout(() => {
                            setActiveNoti(false);
                        }, 4000);
                        NumElementsCarrito();
                    });
                }
            };
            // useEffect(() => {
               
            //     //Comprobamos que el idCar2 no este vacio
            //     if(idCard2 !== undefined){
            //         if(idU === undefined){
                        
            //              //Actualizamo el mensaje que nos envio el server para mostrar en pantalla
            //              setNotiCarrito("NotUserCarrito");
            //              //Activamos y desactivamos la alerta para atener una animacion
            //              setActiveNoti(true);
            //              setTimeout(() => {
            //                  setActiveNoti(false)
            //              }, 4000);
            //              return;
            //         }
            //         HTTP.post("/carrito", {"idU":idU,"Num":idCard2}).then((response) => {
            //             //Actualizamo el mensaje que nos envio el server para mostrar en pantalla
            //             setNotiCarrito(response.data);
            //             //Activamos y desactivamos la alerta para atener una animacion
            //             setActiveNoti(true);
            //             setTimeout(() => {
            //                 setActiveNoti(false)
            //             }, 4000);
            //             NumElementsCarrito();
            //         })
            //     }
            // },[idCard2])
    return (
        <>
            <Routes>
                <Route path="Inicio" element={<Inicio data={data} dataFiltrado={dataFiltrado} setData={setData} NumElementsCarrito={NumElementsCarrito} setMenu={setMenu} NumElementsGustos={NumElementsGustos} ElementsGustos={ElementsGustos} setClickProducto={setClickProducto} acomodoCars={acomodoCars} setAcomodoCards={setAcomodoCards} setFiltros={setFiltros} filtros={filtros} />} />
                <Route path="Carrito" element={<Carrito NumElementsCarrito={NumElementsCarrito} setMenu={setMenu} />} />
                <Route path="Perfil" element={<EditarPerfil numArticulos={numArticulos} setMenu={setMenu} />} />
                <Route path="Producto" element={<Producto actualizarCarrito={actualizarCarrito} setIdCard={setIdCard} setIdCard2={setIdCard2} clickProducto={clickProducto} setClickProducto={setClickProducto} setMenu={setMenu} />} />
                <Route path="/*" element={<Navigate to={"Inicio"} />} />
                <Route path="/Login" element={<Login setMenu={setMenu}/>} />
                <Route path="MisProductos" element={<MyProducts setMenu={setMenu} misProductos={misProductos} />}/>
                <Route path="ProductoNuevo" element={<NewProduct imagesArray={imagesArray} setImagenesArray={setImagenesArray} setMenu={setMenu} busquedas={busquedas} />} />
                <Route path="Compras" element={<ComprasProduct setMenu={setMenu} />} />
                <Route path="Somos" element={<Somos setMenu={setMenu}/>} />
                <Route path="NewUserProveedor" element={<AdminUserTable setMenu={setMenu} />}/>
            </Routes>
            {
                
                menu  === 1
                ? (
                    <>
                        <Head setEstadoMenu={setEstadoMenu} numArticulos={numArticulos} numGustos={numGustos} numNoti={numNoti} elemntsGustos={elemntsGustos} DeleteItemGustos={DeleteItemGustos} setMenu={setMenu} clickProducto={clickProducto} setClickProducto={setClickProducto}  setFiltros={setFiltros} filtros={filtros} elemntsNoti={elemntsNoti} EliminarNotiFicacion={EliminarNotiFicacion} ComprarProductoNoti={ComprarProductoNoti} />
                        <Menu estado={estadoMenu} setEstadoMenu={setEstadoMenu} setFiltros={setFiltros} filtros={filtros} setValue={setValue} value={value} dataCategrorias={dataCategrorias} />
                    </>
                )
                :(
                    <></>
                )
                
            }
            {
                menu === 2
                ? (
                    <>
                        <Head2 numArticulos={numArticulos} numGustos={numGustos} elemntsGustos={elemntsGustos} DeleteItemGustos={DeleteItemGustos} setMenu={setMenu}  setClickProducto={setClickProducto} numNoti={numNoti} elemntsNoti={elemntsNoti} EliminarNotiFicacion={EliminarNotiFicacion} ComprarProductoNoti={ComprarProductoNoti} head2misproductos={head2misproductos} />
                    </>
                )
                :(
                    <></>
                )
            }
             <Noti notiCarrito={notiCarrito} activeNoti={activeNoti} />
        </>
    )
}