import { useContext, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AuthContext } from "../../auth/AuthContext"
import { CardGustos } from "./CardGustos"
import { CardNoti } from "./CarNoti"
import { CardNotiAceptar } from "./CardNotiAceptar"
import { CardComprar } from "./CardComprar"
export const Head = ({ setEstadoMenu, numArticulos, numGustos,numNoti, elemntsGustos, DeleteItemGustos, setMenu, setClickProducto,setFiltros, filtros, elemntsNoti,EliminarNotiFicacion,ComprarProductoNoti }) => {
    const onSubmitShowMenu = () => {
        setEstadoMenu(true)
    }

    const { LogOut, user } = useContext(AuthContext);
    
    let idU = user?.id;
    let img = user?.img;
   
    if(user?.google == 1){
        img = user?.img;
    }else{
        img = (img) ? `https://badgerautomation.com/MarketPlace/Server/ImagesUser/${img}` : `https://badgerautomation.com/MarketPlace/Server/Images/Ge.jpg`;
    }
    const navigate = useNavigate();
    const onLogout = () => {
        LogOut();
        setMenu(3);
        navigate('/Login', {
            replace: true
        })
    }
    function IngresarLog(){
        if(!idU){
            LogOut();
            setMenu(3);
            navigate('/Login', {
                replace: true
            })
        }
    }

    const handleChange = (event) => {
        setFiltros({ ...filtros, text: event.target.value })
    };
    
    return (
        <>
            <div style={{"zIndex":"2"}} className="text-center contenedorH">
                <div className="d-flex justify-content-around ContendorHeight">
                    <div className="d-flex justify-content-around ContenedorWidthH">
                        <i className="bi bi-list menuShow" onClick={() => { onSubmitShowMenu() }}></i>
                        <Link to={"/Inicio"} className="nav-link fw-bold TextShadowH HeadEnlaces paginasHead"  >Inicio</Link>
                        {/* <a className="nav-link fw-bold TextSinShadowH HeadEnlaces paginasHead"  >Productos nuevos</a> */}
                        <div className="input-group justify-content-center BuscadorH" >
                            <input type="text" className="form-control align-middle" value={filtros.text} onChange={handleChange} placeholder="Buscar producto..." aria-label="Recipient's username" aria-describedby="button-addon2" />
                            <button className="btn btn-outline-secondary" type="button" id="button-addon2"><i className="bi bi-search"></i></button>
                        </div>
                    </div>
                    <div className="d-flex justify-content-around InconosRight">
                        {
                            idU ?
                                <>
                                    {/* <div>
                                        <Link className="nav-link">
                                        </Link>
                                    </div> */}
                                    <div>
                                        <Link className="nav-link">
                                        </Link>
                                    </div>

                                </>
                                :
                                <>
                                    {/* <div>
                                        <Link className="nav-link">
                                            <div className="text-center"><p style={{ "margin": "0" }}>Crea tu cuenta</p></div>
                                        </Link>
                                    </div> */}
                                    <div>
                                        <Link to={"/Login"} className="nav-link">
                                            <div className="text-center"><p style={{ "margin": "0" }}>Ingresar</p></div>
                                        </Link>
                                    </div>
                                </>
                        }

                        <div>
                            <div className="dropdown">
                                <div className="nav-link  col-2 dropdown-toggle"  data-bs-toggle="dropdown" aria-expanded="false" title="Contra ofertas">
                                    <i className="bi bi-bell h5"></i>
                                    <div className="text-center Notificaciones"><p style={{ "marginTop": "-3px", "color": "#fff" }} > {numNoti} </p>
                                    </div>
                                    <ul style={{"maxHeight":"375px", "overflowY":"auto" }} className="dropdown-menu ulcarrito" aria-labelledby="dropdownMenuButton1">
                                    {
                                        elemntsNoti?.map((data) => {
                                            if (data.TipoNoti === "ContraOferta") {
                                            return (
                                                <CardNoti key={data.id} {...data} EliminarNotiFicacion={EliminarNotiFicacion} setClickProducto={setClickProducto} ComprarProductoNoti={ComprarProductoNoti} />
                                            );
                                            } else if (data.TipoNoti === "AceptarOferta") {
                                            return (
                                                <CardNotiAceptar key={data.id} {...data} EliminarNotiFicacion={EliminarNotiFicacion} setClickProducto={setClickProducto} ComprarProductoNoti={ComprarProductoNoti} />
                                            );
                                            } else if (data.TipoNoti === "Compra") {
                                            return (
                                                <CardComprar key={data.id} {...data} EliminarNotiFicacion={EliminarNotiFicacion} setClickProducto={setClickProducto} ComprarProductoNoti={ComprarProductoNoti} />
                                            );
                                            } else {
                                            // Si no coincide con ninguna de las opciones anteriores, puedes mostrar un componente por defecto o simplemente devolver null
                                            return null;
                                            }                                       
                                        })
                                       }
                                     
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div >
                            <div className="dropdown">
                                <div className="nav-link  col-2 dropdown-toggle"  data-bs-toggle="dropdown" aria-expanded="false" title="Articulos que te gustaron">
                                    <i className="bi bi-heart h5"></i>
                                    <div className="text-center Notificaciones"><p style={{ "marginTop": "-3px", "color": "#fff" }} > {numGustos} </p>
                                    </div>
                                    <ul style={{"maxHeight":"375px", "overflowY":"auto" }} className="dropdown-menu ulcarrito" aria-labelledby="dropdownMenuButton1">
                                       {
                                        elemntsGustos?.map((data) => (
                                            <CardGustos key={data.id} {...data} DeleteItemGustos={DeleteItemGustos} setClickProducto={setClickProducto} />
                                        ))
                                       }
                                     
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div>
                            <Link to={(idU) ? "/Carrito" : "/Login"} title="Carrito de compras" className="nav-link" > <i className="bi bi-cart h5"></i>
                                <div className="text-center Notificaciones"><p style={{ "marginTop": "-3px", "color": "#fff" }} > {numArticulos} </p></div></Link>
                        </div>

                        <div style={{ "alignItems": "center" }} className="d-flex">
                            <div className="dropdown">
                                <div className=" col-2 dropdown-toggle UserIcon" onClick={() => IngresarLog()} style={{ "backgroundImage": `url(${img})` }} data-bs-toggle="dropdown" aria-expanded="false"></div>
                                {
                                    idU ?
                                        (
                                            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                                <li><Link to={"/Perfil"} className="dropdown-item" >Editar perfil</Link></li>
                                                <li><a onClick={onLogout} className="dropdown-item" >Cerrar sesion</a></li>
                                            </ul>
                                        ) :
                                        <>
                                        </>
                                }
                            </div>

                        </div>
                    </div>
                </div>
                <hr style={{ "width": "95%", "margin": "0", "marginLeft": "2.5%" }} />
                <ul style={{ "width": "500px" }} className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                        <li>
                                            <div className=" align-items-center FilaCarritoItem" style={{"display":"grid","gridTemplateColumns":"20% 80%"}}>

                                                <div >
                                                  
                                                    <img src={`./assets/${img}.jpg`} alt="IMGCompra" className="GustosIMG" />
                                                </div>
                                                <div className=" ms-3" style={{ "width": "100%" }}>
                                                   
                                                    <h5 className="TitulosMenu">Descripción:</h5>
                                                    <p className="text-secondary OpcionesFont" >Tenis Puma Junior Unisex St Activate Zapato Deportivo Comodo </p>
                                                    <div className="d-flex justify-content-end">
                                                        <div className="d-flex justify-content-around" style={{ "width": "20%" }}>
                                                            <button className="btn btn-danger" style={{ "float": "right", "borderRadius": "40px" }}><i className="bi bi-heart-fill"></i></button>
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                        <li><a onClick={onLogout} className="dropdown-item" >Cerrar sesion</a></li>
                                    </ul>
            </div>
        </>
    )
}