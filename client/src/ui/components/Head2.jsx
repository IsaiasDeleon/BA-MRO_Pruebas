import { useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AuthContext } from "../../auth/AuthContext"
import { types } from "../../types/types";
import { CardGustos } from "./CardGustos";

export const Head2 = ({  numArticulos, numGustos, elemntsGustos, DeleteItemGustos, setMenu, setClickProducto }) => {
    const { LogOut, user } = useContext(AuthContext); 
    const navigate = useNavigate(); 
    const onLogout = () =>{
        LogOut();
        setMenu(3)
        navigate('/Login',{
            replace:true
        })
    }
    const ShowLogin = () => {
        setMenu(3)
        navigate('/Login',{
            replace:true
        })
    }
    let idU = user?.id;
    let img = user?.img;
    
    if(user?.google == 1){
        img = user?.img;
    }else{
        img = (img) ? `url(./assets/${img}.jpg)` : `url(./assets/Ge.jpg)`;
    }
    return (
        <>
            <div style={{"zIndex":"2"}} className="text-center contenedorH2">
                <div className="d-flex justify-content-around ContendorHeight">
                    <div className="d-flex justify-content-around ContenedorWidthH">
                        {/* <i className="bi bi-list menuShow" onClick={() => { onSubmitShowMenu() }}></i> */}
                        <Link to={"/Inicio"} className="nav-link fw-bold TextShadowH HeadEnlaces "  >Inicio</Link>
                        {/* <a className="nav-link fw-bold TextSinShadowH HeadEnlaces paginasHead"  >Productos nuevos</a> */}
                        {/* <div className="input-group justify-content-center BuscadorH" >
                            <input type="text" className="form-control align-middle" placeholder="Buscar producto..." aria-label="Recipient's username" aria-describedby="button-addon2" />
                            <button className="btn btn-outline-secondary" type="button" id="button-addon2"><i className="bi bi-search"></i></button>
                        </div> */}
                    </div>
                    <div className="d-flex justify-content-around InconosRight">
                    {
                            idU ?
                                <>
                                    <div>
                                        <Link className="nav-link">
                                        </Link>
                                    </div>
                                    <div>
                                        <Link className="nav-link">
                                        </Link>
                                    </div>

                                </>
                                :
                                <>
                                    <div>
                                        <Link className="nav-link">
                                            <div className="text-center"><p style={{ "margin": "0" }}>Crea tu cuenta</p></div>
                                        </Link>
                                    </div>
                                    <div>
                                        <Link onClick={ () => ShowLogin() } className="nav-link">
                                            <div className="text-center"><p style={{ "margin": "0" }}>Ingresar</p></div>
                                        </Link>
                                    </div>
                                </>
                        }
                         <div>
                            <a className="nav-link" ><i className="bi bi-bell h5"></i>
                                <div className="text-center Notificaciones"><p style={{ "marginTop": "-3px", "color": "#fff" }} >1</p></div></a>
                        </div>
                        <div >
                            <div className="dropdown">
                                <div className="nav-link  col-2 dropdown-toggle"  data-bs-toggle="dropdown" aria-expanded="false" title="Articulos que te gustaron">
                                    <i class="bi bi-heart h5"></i>
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
                            <Link to={"/Carrito"} className="nav-link" > <i className="bi bi-cart h5"></i>
                                <div className="text-center Notificaciones"><p style={{ "marginTop": "-3px", "color": "#fff" }} > {numArticulos} </p></div></Link>

                        </div>
                        <div style={{ "alignItems": "center" }} className="d-flex">
                            <div className="dropdown">
                            <div className=" col-2 dropdown-toggle UserIcon" style={{"backgroundImage": `url(${img})`}} data-bs-toggle="dropdown" aria-expanded="false"></div>
                                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                    <li><Link to={"/Perfil"} className="dropdown-item" >Editar perfil</Link></li>
                                    <li><a onClick={onLogout} className="dropdown-item" >Cerrar sesion</a></li>

                                </ul>
                            </div>

                        </div>
                    </div>
                </div>
                <hr style={{ "width": "95%", "margin": "0", "marginLeft": "2.5%" }} />
            </div>
        </>
    )
}