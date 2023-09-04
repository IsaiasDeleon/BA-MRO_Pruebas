import { useContext, useEffect, useState,useRef  } from 'react';
import axios from 'axios';

import { useForm } from "../../hooks/useForm"
import { Noti } from '../components/Notificaciones';
import { AuthContext } from '../../auth/AuthContext';
const URLServer = "http://192.168.100.18:3020/"
const HTTP = axios.create({
    baseURL: "https://badgerautomation.com/MarketPlace/Server/Data.php"
})
// Importa la biblioteca de crypto-js para el hash SHA-256
const CryptoJS = require("crypto-js");
export const EditarPerfil = ({ numArticulos, setMenu }) => {

    const { user } = useContext(AuthContext);
    let idU = user?.id;
    let img = user?.img;
    if(user?.google == 1){
        img = user?.img;
    }else{
        img = (img) ? `https://badgerautomation.com/MarketPlace/Server/ImagesUser/${img}` : `https://badgerautomation.com/MarketPlace/Server/Images/Ge.jpg`;
    }
    const fileInputRef = useRef();
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
    const [Correo, setCorreo] = useState("");
    const [Google, setGoogle] = useState(0);
    const [pais, setPais] = useState("");
    const [estado, setEstado] = useState(1);
    const [municipio, setMunicipio] = useState(1);
    const [latitude, setLatitude] = useState();
    const [longitude, setLongitude] = useState();
    const [OtraUbiCheck, setOtraUbiCheck] = useState(true);

    const [valuesEstado2, setValueEstado2] = useState([]);
    const [estado2, setEstado2] = useState(1);
    const [valueMunicipio2, setValueMunicipio2] = useState([]);
    const [municipio2, setMunicipio2] = useState(1);
    const [nameEstado2, setNameEstado2] = useState("");
    const [nameMunicipio2, setNameMunicipio2] = useState("");
    const [direccion2, setDireccion2] = useState("");
    const [CP2, setCP2] = useState("");
    const handleCheckboxChange = () => {
        setOtraUbiCheck(!OtraUbiCheck);
      };
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
            case 'Direccion2':
                setDireccion2(value);
                break;
            case 'CP2':
                setCP2(value);
                break;
            case 'Pais':
                setPais(value);
                break;
            case 'Estado':
                setEstado(value);
                getMunicipios()
                break;
            case 'Estado2':
                setEstado2(value);
                getMunicipios2()
                break;
            case 'Municipio':
                setMunicipio(value);
                break;
            case 'Municipio2':
                setMunicipio2(value);
                break;
        }

    }

    useEffect(() => {
      
        if( idU !== undefined){
            const getD = async () => {
              
                let respuesta = await  HTTP.post("/getDatosGenerales",{"IdUsuario": idU}).then((response) => {
                    return response?.data[0]
                })
               
                if(respuesta !== undefined){
                    setNombre(respuesta.Nombre);
                    setTelefono(respuesta.telefono);
                    
                    setPass(respuesta.Password);
                    setDireccion(respuesta.Direccion);
                    setCP(respuesta.CP);
                    setCorreo(respuesta.Correo)
                    setGoogle(respuesta.google)
                    setPais("Mexico");
                    setEstado(1);
                    if(respuesta.estado !== null){
                        setEstado(respuesta.estado);
                    }
                    setMunicipio(1)
                    if(respuesta.municipio !== null){
                        setMunicipio(respuesta.municipio);
                    }
                    
                    setDireccion2(respuesta.Direccion2);
                    setCP2(respuesta.CP2);
                    setEstado2(1);
                    if(respuesta.Estado2 !== null){
                        setEstado2(respuesta.Estado2);
                    }
                    setMunicipio2(1)
                    if(respuesta.Municipio2 !== null){
                        setMunicipio2(respuesta.Municipio2);
                    }

                    setLatitude(respuesta.latitude);
                    setLongitude(respuesta.longitude);
                }
                
                
            }
    
            getEstados()
            getMunicipios()
            getMunicipios2()
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
        HTTP.post("/getEstado",{"N":"2"}).then((response) => {
            setValueEstado(response.data);
            setValueEstado2(response.data);
        })
    }
    //Obtenemos el nombre del estado seleccionado
    function getNameEstado() {
        HTTP.post("/getNameEstado",{"idEstado": estado}).then((response) => {
            setNameEstado(response.data[0].estado)
        })
    }
    function getNameEstado2() {
        HTTP.post("/getNameEstado",{"idEstado": estado}).then((response) => {
            setNameEstado2(response.data[0].estado)
        })
    }
    //Obtenemos todos los municipios del estado seleccionado
    function getMunicipios() {
        HTTP.post("/getMunicipio",{ "Estado": estado }).then((response) => {
            setValueMunicipio(response.data)
        })
    }
    function getMunicipios2() {
        HTTP.post("/getMunicipio",{ "Estado": estado2 }).then((response) => {
            setValueMunicipio2(response.data)
        })
    }
    //Obtenemos el nombre del municipio seleccionado
    function getNameMunicipio() {
        HTTP.post("/getNameMunicipio",{"idMunicipio": municipio}).then((response) => {
            setNameMunicipio(response.data[0].municipio);
        })
    }
    function getNameMunicipio2() {
        HTTP.post("/getNameMunicipio",{"idMunicipio": municipio}).then((response) => {
            setNameMunicipio2(response.data[0].municipio);
        })
    }
    //Obtenemos la ubicacion del cliente
    function UbicaionMessage() {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                let latitude = position.coords.latitude;
                let longitude = position.coords.longitude;
                if (latitude && longitude) {
                    HTTP.post("/saveUbicacion",{"idU":idU, "latitude": latitude, "longitude": longitude }).then((response) => {
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
                maximumAge: 0, // No utilizar caché
                timeout: 5000,
                enableHighAccuracy: true
           
            }
        );
    }
    function Mapa() {
        window.open(`https://maps.google.com/maps?q=${latitude},${longitude}`, '_blank');
    }
    function getCompras() {
        if(idU !== undefined){
            console.log(idU)
            HTTP.post("/getCompras", { "idUsuario": idU }).then((response) => {
                console.log(response)
                if (response.data == "0Elements") {
                    setElementsCarrito(0)
                } else {
                    setElementsCarrito(response.data.length)
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
        getMunicipios2();
        getNameEstado2();
    }, [estado2]);

    useEffect(() => {
        getNameMunicipio();
    }, [municipio]);
    useEffect(() => {
        getNameMunicipio2();
    }, [municipio2]);
    function message(mess) {
        setNotiCarrito(`${mess}`);
        setActiveNoti(true)
        setTimeout(() => {
            setActiveNoti(false)
        }, 5000);
    }
    //Guardar los detalles del usuario
    function SaveDetailsUser(){
        if(Nombre === ""){
            message("NombrePerfil")
            return;
        }
        if(Telefono === ""){
            message("TelefonoPerfil")
            return;
        }
        if(pass === ""){
            message("passPerfil")
            return;
        }
     
        if(direccion === ""){
            message("direccionPerfil")
            return;
        }
        if(CP === ""){
            message("CPPerfil")
            return;
        }
        let datos;
        if(OtraUbiCheck === true){
            datos={"idU":idU,"Nombre":Nombre,"Telefono":Telefono,"Password":pass,"Direccion":direccion,"CP":CP,"Estado":estado,"Municipio":municipio,"OtraUbiCheck":1 }
        }else{
            if(direccion2 === ""){
                message("direccionPerfil")
                return;
            }
            if(CP2 === ""){
                message("CPPerfil")
                return;
            }
            datos={"idU":idU,"Nombre":Nombre,"Telefono":Telefono,"Password":pass,"Direccion":direccion,"CP":CP,"Estado":estado,"Municipio":municipio,"Direccion2":direccion2,"CP2":CP2,"Estado2":estado2,"Municipio2":municipio2,"OtraUbiCheck":0 }

        }
        if(idU !== undefined){
            
            
            HTTP.post("/SaveDetailsUser",datos).then((response) => {
                if(response.data == "Actualizado"){
                    setNotiCarrito(response.data);
                    setActiveNoti(true)
                    setTimeout(() => {
                        setActiveNoti(false)
                    }, 4000);
                }
               
               })
        }
       
    }
    function togglePasswordVisibility() {
        const passwordField = document.getElementById("passwordField");
        const toggleButton = document.getElementById("toggleButton");
        
        if (passwordField.type === "password") {
          // Si el campo es de tipo "password", cambiarlo a "text" para mostrar la contraseña
          passwordField.type = "text";
          toggleButton.innerText = "Ocultar contraseña";
        } else {
          // Si el campo es de tipo "text", cambiarlo a "password" para ocultar la contraseña
          passwordField.type = "password";
          toggleButton.innerText = "Mostrar contraseña";
        }
      }
      console.log(Google)
      function inputChange(){
        let Images = document.getElementById(`Images`);
        const files = Images?.files;
        for (let i = 0; i < files.length; i++) {
            let file = files[i];
            let formData;
            if (file === undefined) {
                formData = 0;
            } else {
                formData = new FormData();
                formData.set('file', file);
            }
            if (formData !== 0) {
                HTTP.post("/ImagesUser",formData).then((response) => {
                    HTTP.post("/UpdateImagesUser",{"NameImg":response.data,"idU":idU}).then((response) => {
                        setNotiCarrito(response.data);
                        setActiveNoti(true)
                        setTimeout(() => {
                            setActiveNoti(false)
                        }, 5000);
                    })
                })
            }
        }
    }
    const openFileInput = () => {
        fileInputRef.current.click();
    };
    function inputDivChange(e) {
        const files = e.dataTransfer.files
        for (let i = 0; i < files.length; i++) {
            let file = files[i];
            let formData;
            if (file === undefined) {
                formData = 0;
            } else {
                formData = new FormData();
                formData.set('file', file);
            }
            if (formData !== 0) {
                HTTP.post("/ImagesUser",formData).then((response) => {
                    HTTP.post("/UpdateImagesUser",{"NameImg":response.data,"idU":idU}).then((response) => {
                        setNotiCarrito(response.data);
                        setActiveNoti(true)
                        setTimeout(() => {
                            setActiveNoti(false)
                        }, 5000);
                    })
                })
            }
        }
    }
    return (
        <>
            <div className="cardPerfil contenedorPerfil" >
                <div className="PrimeraSeccion text-center heightMin"  >
                    <div style={{"height":"100%","overflowX": "auto" }}>
                        <div className="marginPerfil">
                            <img src={img} style={{ "borderRadius": "20px" }} alt="IMGUsuario" className="ImgCard" />
                            <h4 className="NombrePerfil">{Nombre}</h4>
                            <hr style={{ "width": "95%", "margin": "0", "marginLeft": "2.5%" }} />
                            <div className="text-start marginPerfil">
                                <h5 className="text-left tituloPerfil">Datos generales</h5>
                                <h6 className="text-secondary datosPerfil">Correo:</h6>
                                <h6 className='datosPerfil'>{Correo}</h6>
                                <h6 className="text-secondary datosPerfil">Teléfono:</h6>
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
                                <h6 className="text-secondary datosPerfil">Dirección:</h6>
                                <h6 className='datosPerfil' >{direccion}</h6>
                                <h6 className="text-secondary datosPerfil">CP:</h6>
                                <h6 className='datosPerfil' >{CP}</h6>
                                <div className='text-end' style={{"width":"100%"}}>
                                    {
                                        latitude === null ? (
                                            <>
                                            </>
                                        ):(
                                            <button  className="btn btn-dark mb-2" onClick={Mapa}>Ver MAPA</button>
                                        )
                                    }
                                    
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
                             {/* ... Otras partes del código ... */}
                                <div style={{ "width": "100%", "border": "2px dashed #D7DBDD", "height": "110px", "textAlign": "center" }}onDrop={(e) => inputDivChange(e)}>
                                    {/* Etiqueta label sin atributo htmlFor */}
                                    <label>
                                        Arrastra y suelta tus fotos aquí o
                                        {/* Botón para activar el input de archivo */}
                                        <button onClick={openFileInput} style={{ "padding": "5px", "background": "#000", "color": "#fff", "borderRadius": "5px" }}>selecciona el archivo</button>
                                    </label>
                                    {/* El input de archivo está oculto pero se activa cuando se hace clic en el botón */}
                                    <input ref={fileInputRef} onChange={inputChange} id="Images" name="Images" type="file" className="file" accept="image/jpeg, image/png, image/jpg" style={{ display: 'none' }} />
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
                                
                                    {
                                        Google === "0"?(
                                            <div className="col-sm m-2">
                                                <h6 className='datosPerfil'>Contraseña:</h6>
                                                <div class="input-group mb-3">
                                                    <input type="password" id="passwordField" className="form-control" name="Password" value={pass} onChange={onInputChange2} />
                                                    <button className="btn btn-outline-secondary" type="button" id="toggleButton" onClick={() => togglePasswordVisibility()}>Mostrar contraseña</button>
                                                </div>
                                            </div>
                                        ):
                                        (
                                           <></>
                                        )
                                    }
                                    
                             
                                <div className="selectoresPerfil">
                                    <div className="col-sm m-2">
                                        <h6 className='datosPerfil'>País</h6>
                                        <select className="form-select" name="Pais" value={pais} onChange={onInputChange} >
                                            <option value="1">México</option>
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
                                        <h6 className='datosPerfil'>Dirección</h6>
                                        <input className="form-control" type="text" name='Direccion' value={direccion} onChange={onInputChange2} />
                                    </div>
                                    <div className="col-sm m-2">
                                        <h6 className='datosPerfil'>Código postal</h6>
                                        <input className="form-control" type="number" name='CP' value={CP} onChange={onInputChange2} />
                                    </div>
                                </div>
                                <div className="form-check text-center">
                                    <input style={{"float":"revert"}} onClick={handleCheckboxChange}  id="defaultCheck1" className="form-check-input" type="checkbox" checked={OtraUbiCheck} />
                                    <label onClick={handleCheckboxChange} className="form-check-label datosPerfil h6" >
                                        La dirección de envio es igual a la de facturación
                                    </label>
                                </div>
                                {
                                    OtraUbiCheck === false ?
                                <>
                               <div className="alert alert-primary text-center" role="alert">
                                   Ubicación de facturación
                                </div>
                                <div className="selectoresPerfil">
                                    <div className="col-sm m-2">
                                        <h6 className='datosPerfil'>Pais</h6>
                                        <select className="form-select" name="Pais" value={pais} onChange={onInputChange} >
                                            <option value="1">Mexíco</option>
                                        </select>
                                    </div>
                                    <div className="col-sm m-2">
                                        <h6 className='datosPerfil'>Estado</h6>
                                        <select className="form-select" name="Estado2" value={estado2} onChange={onInputChange2}>
                                            {valuesEstado2.map((Val) => (
                                                <option key={Val.id} value={Val.id}>{Val.estado}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-sm m-2">
                                        <h6 className='datosPerfil'>Municipio</h6>
                                        <select className="form-select" name='Municipio2' value={municipio2} onChange={onInputChange2}>
                                            {
                                                valueMunicipio2.map((Val) => (
                                                    <option key={Val.id} value={Val.id}>{Val.municipio} </option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                </div>
                                <div className="formularioPerfil">

                                    <div className="col-sm m-2">
                                        <h6 className='datosPerfil'>Dirección</h6>
                                        <input className="form-control" type="text" name='Direccion2' value={direccion2} onChange={onInputChange2} />
                                    </div>
                                    <div className="col-sm m-2">
                                        <h6 className='datosPerfil'>Código postal</h6>
                                        <input className="form-control" type="number" name='CP2' value={CP2} onChange={onInputChange2} />
                                    </div>
                                </div></>
                                    :<></>
                                }
                                
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
                                    <li key={elementsCompras.idArticulo} style={{ "margin": "5px" }}>
                                        <p style={{ "margin": "0" }} className="fw-bold datosPerfil">{elementsCompras.nombreArticulo}</p>
                                        <p style={{ "margin": "0" }} className="text-secondary FechasPerfil">{elementsCompras.fechaCompra}</p>
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