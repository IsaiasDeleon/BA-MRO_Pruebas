import { useContext, useEffect, useState } from 'react';
import axios from 'axios';

import { useForm } from "../../hooks/useForm"
import { Noti } from '../components/Notificaciones';
import { AuthContext } from '../../auth/AuthContext';
const URLServer = "http://192.168.100.18:3020/"

export const EditarPerfil = ({ numArticulos, setMenu }) => {

    const { user } = useContext(AuthContext);
    let idU = user?.id;
    let imgU = user?.img;

    const [valuesEstado, setValueEstado] = useState([]);
    const [valueMunicipio, setValueMunicipio] = useState([]);
    const [nameEstado, setNameEstado] = useState("");
    const [nameMunicipio, setNameMunicipio] = useState("");
    const [elementsCarrito, setElementsCarrito] = useState(2);
    const [compras, setCompras] = useState([]);

    const [notiCarrito, setNotiCarrito] = useState();
    const [activeNoti, setActiveNoti] = useState();


    const [Nombre, setNombre] = useState("");
    const [Telefono, setTelefono] = useState("1");
    const [pass, setPass] = useState("");
    const [direccion, setDireccion] = useState("");
    const [CP, setCP] = useState("");
    const [pais, setPais] = useState("");
    const [estado, setEstado] = useState(1);
    const [municipio, setMunicipio] = useState(1);
    const [latitude, setLatitude] = useState();
    const [longitude, setLongitude] = useState();
    const onInputChange2 = ({ target }) => {
        const { name, value } = target;
        switch (name) {
            case 'Nombre':
                setNombre(value);
                break;
            case 'Telefono':
                setTelefono(value);
                break;
            case 'Password':
                setPass(value);
                break;
            case 'Direccion':
                setDireccion(value);
                break;
            case 'CP':
                setCP(value);
                break;
            case 'Pais':
                setPais(value);
                break;
            case 'Estado':
                setEstado(value);
                getMunicipios()
                break;
            case 'Municipio':
                setMunicipio(value);
                break;
        }

    }

    useEffect(() => {
        if( idU !== undefined){
            const getD = async () => {
                let respuesta = await axios.post(URLServer + "getDatosGenerales", { "IdUsuario": idU }).then((response) => {
                    console.log(response)
                    return response?.data[0]
                })
                if(respuesta !== undefined){
                    setNombre(respuesta.Nombre);
                    setTelefono(respuesta.telefono);
                    setPass(respuesta.Password);
                    setDireccion(respuesta.Direccion);
                    setCP(respuesta.CP);
                    setPais("Mexico");
                    setEstado(1);
                    console.log(respuesta.estado)
                    if(respuesta.estado !== null){
                        console.log("Entro")
                        setEstado(respuesta.estado);
                    }
                    setMunicipio(1)
                    if(respuesta.municipio !== null){
                        setMunicipio(respuesta.municipio);
                    }
                    
                    
                    setLatitude(respuesta.latitude);
                    setLongitude(respuesta.longitude);
                }
                
                
            }
    
            getEstados()
            getMunicipios()
            getD()
            getCompras()
        }
        setMenu(2)
    }, [])

    const { onInputChange } = useForm({
        Pais: 1,
    })
    //Obtenemos los estados 
    function getEstados() {
        axios.get(URLServer + "getEstado").then((response) => {
            setValueEstado(response.data);
        })
    }
    //Obtenemos el nombre del estado seleccionado
    function getNameEstado() {
        axios.post(URLServer + "getNameEstado", { "idEstado": estado }).then((response) => {
            setNameEstado(response.data[0].estado)
        })
    }
    //Obtenemos todos los municipios del estado seleccionado
    function getMunicipios() {
        axios.post(URLServer + "getMunicipio", { "Estado": estado }).then((response) => {
            setValueMunicipio(response.data)
        })
    }
    //Obtenemos el nombre del municipio seleccionado
    function getNameMunicipio() {
        axios.post(URLServer + "getNameMunicipio", { "idMunicipio": municipio }).then((response) => {
            setNameMunicipio(response.data[0].municipio);
        })
    }
    //Obtenemos la ubicacion del cliente
    function UbicaionMessage() {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                let latitude = position.coords.latitude;
                let longitude = position.coords.longitude;
                if (latitude && longitude) {
                    axios.post(URLServer + "saveUbicacion", { "latitude": latitude, "longitude": longitude }).then((response) => {
                        if (response.data == "Guardada") {
                            setNotiCarrito(response.data);
                            setActiveNoti(true)
                            setTimeout(() => {
                                setActiveNoti(false)
                            }, 4000);
                        }
                    })
                }
            },
            function (error) {
                setNotiCarrito("UbicacionError");
                setActiveNoti(true)
                setTimeout(() => {
                    setActiveNoti(false)
                }, 7000);
            }, {
            enableHighAccuracy: true
            , timeout: 5000
        }
        );
    }
    function Mapa() {
        window.open(`https://maps.google.com/maps?q=${latitude},${longitude}`, '_blank');
    }
    function getCompras() {
        if(idU !== undefined){
            axios.post(URLServer + "getCompras", { "idUsuario": idU }).then((response) => {
                if (response.data == "0Elements") {
                    setElementsCarrito(0)
                } else {
                    setCompras(response.data)
                }
            })
        }
    }
    useEffect(() => {
        getMunicipios();
        getNameEstado();
    }, [estado]);

    useEffect(() => {
        getNameMunicipio();
    }, [municipio]);

    //Guardar los detalles del usuario
    function SaveDetailsUser(){
        if(idU !== undefined){
            axios.post(URLServer + "SaveDetailsUser", {"idU":idU,"Nombre":Nombre,"Telefono":Telefono,"Password":pass,"Direccion":direccion,"CP":CP,"Estado":estado,"Municipio":municipio }).then((response) => {
                if(response.data == "Actualizado"){
                    setNotiCarrito(response.data);
                    setActiveNoti(true)
                    setTimeout(() => {
                        setActiveNoti(false)
                    }, 4000);
                }
                console.log(response)
               })
        }
       
    }

    return (
        <>
            <div className="cardPerfil contenedorPerfil" >
                <div className="PrimeraSeccion text-center heightMin"  >
                    <div style={{"height":"100%","overflowX": "auto" }}>
                        <div className="marginPerfil">
                            <img src={`./assets/${imgU}.jpg`} style={{ "borderRadius": "20px" }} alt="IMGUsuario" className="ImgCard" />
                            <h4 className="NombrePerfil">{Nombre}</h4>
                            <hr style={{ "width": "95%", "margin": "0", "marginLeft": "2.5%" }} />
                            <div className="text-start marginPerfil">
                                <h5 className="text-left tituloPerfil">Datos generales</h5>
                                <h6 className="text-secondary datosPerfil">Correo:</h6>
                                <h6 className='datosPerfil'>isaiasdeleonsalazar@gmail.com</h6>
                                <h6 className="text-secondary datosPerfil">Telefono:</h6>
                                <h6 className='datosPerfil'>{Telefono}</h6>
                            </div>
                            <hr style={{ "width": "95%", "margin": "0", "marginLeft": "2.5%" }} />
                            <div className="text-start marginPerfil">
                                <h5 className="text-left tituloPerfil">Ubicación</h5>
                                <h6 className="text-secondary datosPerfil">País:</h6>
                                <h6 className='datosPerfil' >Mexico</h6>
                                <h6 className="text-secondary datosPerfil">Estado:</h6>
                                <h6 className='datosPerfil' >{nameEstado}</h6>
                                <h6 className="text-secondary datosPerfil">Municipio:</h6>
                                <h6 className='datosPerfil' >{nameMunicipio}</h6>
                                <h6 className="text-secondary datosPerfil">Direccion:</h6>
                                <h6 className='datosPerfil' >{direccion}</h6>
                                <h6 className="text-secondary datosPerfil">CP:</h6>
                                <h6 className='datosPerfil' >{CP}</h6>
                                <div className='text-end' style={{"width":"100%"}}>
                                    <button  className="btn btn-dark mb-2" onClick={Mapa}>Ver MAPA</button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                <div className="PrimeraSeccion text-center heightMin">
                <div style={{"height":"100%","overflowX": "auto" }}>
                    <div className="marginPerfil">
                        
                        <h4 className='NombrePerfil'>Editar datos</h4>
                        <div className="text-start">
                            <h6 className='tituloPerfil'>Actualizar foto:</h6>
                            <div className="text-center " style={{ "width": "100%", "border": "2px dashed #D7DBDD", "height": "110px" }}>
                                <h5 className='tituloPerfil'>Arrastra y suelta la imagen</h5>
                                <span className='tituloPerfil' style={{ "margin": "0" }}>O</span>
                                <form method="POST" id="fileimgOPM">
                                    <label htmlFor="fileimgOPM2" className="btn btn-secondary">Selecciona la imagen</label>
                                    <input id="fileimgOPM2" type="file" name="fileimgOPM2" className="file_multi_video" hidden />
                                </form>
                            </div>
                            <div className="marginPerfil">
                                <div className="formularioPerfil">
                                    <div className="col-sm m-2" >
                                        <h6 className='datosPerfil'>Nombre:</h6>
                                        <input name="Nombre" value={Nombre} onChange={(e) => onInputChange2(e)} type="text" className="form-control" />
                                    </div>
                                    <div className="col-sm m-2">
                                        <h6 className='datosPerfil'>Telefono:</h6>
                                        <input name="Telefono"  value={Telefono} onChange={onInputChange2} type="text" className="form-control" />
                                    </div>
                                </div>
                                <div className="col-sm m-2">
                                    <h6 className='datosPerfil'>Contraseña:</h6>
                                    <input name="Password" value={pass} onChange={onInputChange2} type="password" className="form-control" />
                                </div>
                                <div className="selectoresPerfil">
                                    <div className="col-sm m-2">
                                        <h6 className='datosPerfil'>Pais</h6>
                                        <select className="form-select" name="Pais" value={pais} onChange={onInputChange} >
                                            <option value="1">Mexico</option>
                                        </select>
                                    </div>
                                    <div className="col-sm m-2">
                                        <h6 className='datosPerfil'>Estado</h6>
                                        <select className="form-select" name="Estado" value={estado} onChange={onInputChange2}>
                                            {valuesEstado.map((Val) => (
                                                <option key={Val.id} value={Val.id}>{Val.estado}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-sm m-2">
                                        <h6 className='datosPerfil'>Municipio</h6>
                                        <select className="form-select" name='Municipio' value={municipio} onChange={onInputChange2}>
                                            {
                                                valueMunicipio.map((Val) => (
                                                    <option key={Val.id} value={Val.id}>{Val.municipio} </option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                </div>
                                <div className="formularioPerfil">

                                    <div className="col-sm m-2">
                                        <h6 className='datosPerfil'>Direccion</h6>
                                        <input className="form-control" type="text" name='Direccion' value={direccion} onChange={onInputChange2} />
                                    </div>
                                    <div className="col-sm m-2">
                                        <h6 className='datosPerfil'>Codigo postal</h6>
                                        <input className="form-control" type="number" name='CP' value={CP} onChange={onInputChange2} />
                                    </div>
                                </div>
                                <div className='marginBottom'>
                                    <button onClick={UbicaionMessage} className="btn btn-secondary m-2" >Guardar ubicación por GPS</button>
                                    <button onClick={SaveDetailsUser} className="btn btn-success m-2" style={{ "float": "right" }}>Guardar datos</button>
                                </div>
                            </div>

                        </div>
                    </div>
                    </div>
                </div>
                <div className="PrimeraSeccion text-center" style={{ "height": "min-content"}} >
                    <div className="marginPerfil">
                        <h4 className='NombrePerfil'>Articulos</h4>
                        <div style={{ "display": "grid", "gridTemplateColumns": "50% 50%" }}>

                            <div className=" text-center">
                                <h6 className='datosPerfil'>Comprados:</h6>
                                <h4 className="fw-bold text-success CantidadesPerfil  ">{elementsCarrito}</h4>
                            </div>
                            <div className=" text-center">
                                <h6 className='datosPerfil'>Carrito:</h6>
                                <h4 className=" fw-bold text-success CantidadesPerfil">{numArticulos}</h4>

                            </div>
                        </div>
                        <hr style={{ "width": "100%" }} />
                        <div className="text-start marginPerfil">
                            <h5 className='tituloPerfil'>Historial de compras</h5>
                            <ul>
                                {compras.map((elementsCompras) => (
                                    <li style={{ "margin": "5px" }}>
                                        <p style={{ "margin": "0" }} className="fw-bold datosPerfil">{elementsCompras.Name}</p>
                                        <p style={{ "margin": "0" }} className="text-secondary FechasPerfil">{elementsCompras.Fecha}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <button style={{ "float": "right" }} className="btn btn-danger mb-4">Convertirse en vendedor</button>
                    </div>


                </div>
            </div>
            <Noti notiCarrito={notiCarrito} activeNoti={activeNoti} />
        </>
    )
}