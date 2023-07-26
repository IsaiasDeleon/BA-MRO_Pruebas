import { useContext, useEffect, useState } from "react";
import { AuthContext } from '../../auth/AuthContext';
import { useLocation } from 'react-router-dom';
import { Noti } from "../components/Notificaciones";
import axios from 'axios';
const HTTP = axios.create({
  baseURL: "https://badgerautomation.com/MarketPlace/Server/Data.php"
})
export const ComprasProduct = ({ setMenu }) => {
  const { user } = useContext(AuthContext);
  let idU = user?.id;
  const [notiCarrito, setNotiCarrito] = useState();
  const [activeNoti, setActiveNoti] = useState();
  const [ubica, setUbica] = useState("");
  
  const [Telefono, setTelefono] = useState("1");
  const [direccion, setDireccion] = useState("");
  const [CP, setCP] = useState("");
  const [pais, setPais] = useState("");
  const [estado, setEstado] = useState(1);
  const [municipio, setMunicipio] = useState(1);
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  function Comprar(ContraOferta, Marca, TempodeEntrega, descripcion, empresa, nombre, numParte, Uname, Correo, imagenes, Oferta, Tipo, Telefono, direccion, CP, estado,municipio, almacen, ubiAlma, id, idU, latitude, longitude ) {
   
      let pre = 0;
      if(Tipo === "ContraOferta"){
        pre = ContraOferta;
      }else{
        pre = Oferta;
      }
      window.open(`https://ba-mro.mx/Server/CorreoCompra.php?CO=${pre}&MARCA=${Marca}&TempodeEntrega=${TempodeEntrega}&descripcion=${descripcion}&empresa=${empresa}&nombre=${nombre}&numParte=${numParte}&Uname=${Uname}&Correo=${Correo}&imagenes=${imagenes}&Telefono=${Telefono}&direccion=${direccion}&CP=${CP}&estado=${estado}&municipio=${municipio}&almacen=${almacen}&ubiAlma=${ubiAlma}&id=${id}&idU=${idU}&latitude=${latitude}&longitude=${longitude}`, '_blank');
      // window.open(`https://ba-mro.mx/Server/CorreoCompraProveedor.php?CO=${pre}&MARCA=${Marca}&TempodeEntrega=${TempodeEntrega}&descripcion=${descripcion}&empresa=${empresa}&nombre=${nombre}&numParte=${numParte}&Uname=${Uname}&Correo=${Correo}&imagenes=${imagenes}&Telefono=${Telefono}&direccion=${direccion}&CP=${CP}&estado=${estado}&municipio=${municipio}&almacen=${almacen}&ubiAlma=${ubiAlma}&id=${id}&idU=${idU}`, '_blank');
      setNotiCarrito("CorreoEnviado2")
      setActiveNoti(true)
      setTimeout(() => {
          setActiveNoti(false)
      }, 4000);
    
      
  }
  const getD = async () => {
    let respuesta = await  HTTP.post("/getDatosGenerales2",{"IdUsuario": idU}).then((response) => {
        return response?.data[0]
    }) 
    if(respuesta !== undefined){
        setTelefono(respuesta.telefono);
        setDireccion(respuesta.Direccion);
        setCP(respuesta.CP);
        setPais("Mexico");
        setEstado(respuesta.estado);
        setMunicipio(respuesta.municipio);
        setLatitude(respuesta.latitude);
        setLongitude(respuesta.longitude)
    }
    
}
  const onInputChange2 = ({ target }) => {
    const { name, value } = target;
    switch (name) {
        case 'Direc':
          setUbica(value);
          break;
        case 'CodP':
          setCP(value);
          break;
       
    }
}
  useEffect(() => {
    setMenu(2);
    getD();
  }, []);
  const location = useLocation();
  const { ContraOferta, Marca, TempodeEntrega, descripcion, empresa, nombre, numParte, Uname, Correo, img, Oferta, Tipo, almacen, ubiAlma, id } = location.state;
  let name = "";
  let email = "";
  let tel = "";
  let ubi = "";
  let images = img?.split(',');
  let imagenes = "";
  if(images?.[0] === undefined){
     imagenes = "Box.jpg"
  }else{
      imagenes = images?.[0]
  }
  if(empresa === "Badger"){
    name = "BA-MRO";
    email = "contact@badgerautomation.com"
    tel = "686 582 7223"
    ubi = "Calzada Robleo Industrial 460, Col. Huertas del Colorado, Mexicali, BC 21384, MX"
  }else{
    name = "BA-MRO";
    email = "contact@badgerautomation.com"
    tel = "686 582 7223"
    ubi = "Calzada Robleo Industrial 460, Col. Huertas del Colorado, Mexicali, BC 21384, MX"
  }
  return (
    <div  style={{"padding":"80px 50px"}}>
      <div className="row">
        <div
          className="col-sm-8 product-details"
          style={{ paddingBottom: "60px" }}
        >
          <h2 className="h2Compras">Detalles del Proveedor</h2>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ flex: '1', padding: '10px' }}>
                  <h5 className='TitulosMenu'>Nombre:</h5>
                  <h6 className="text-secondary OpcionesFont">{name}</h6>
              </div>
              <div style={{ flex: '1', padding: '10px' }}>
                  <h5 className='TitulosMenu'>Email:</h5>
                  <h6 className="text-secondary OpcionesFont">{email}</h6>
              </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ flex: '2', padding: '10px' }}>
                  <h5 className='TitulosMenu'>Ubicación:</h5>
                  <h6 className="text-secondary OpcionesFont">{ubi}</h6>
              </div>
              <div style={{ flex: '1', padding: '10px' }}>
                  <h5 className='TitulosMenu'>Teléfono:</h5>
                  <h6 className="text-secondary OpcionesFont">{tel}</h6>
              </div>
          </div>
  
          <div>
            <h2 className="h2Compras">Detalles del Comprador</h2>
          
            {
                  direccion !== ""? (
              <div >
                  <div className="alert alert-primary" role="alert">
                      Si quiere actualizar sus datos antes de comprar visite su perfil para poder modificarlos
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div style={{ flex: '1', padding: '10px' }}>
                          <h5 className='TitulosMenu'>Nombre:</h5>
                          <h6 className="text-secondary OpcionesFont">{Uname}</h6>
                      </div>
                      <div style={{ flex: '1', padding: '10px' }}>
                          <h5 className='TitulosMenu'>Email:</h5>
                          <h6 className="text-secondary OpcionesFont">{Correo}</h6>
                      </div>
                     
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div style={{ flex: '1', padding: '10px' }}>
                          <h5 className='TitulosMenu'>País:</h5>
                          <h6 className="text-secondary OpcionesFont">México</h6>
                      </div>
                      <div style={{ flex: '1', padding: '10px' }}>
                          <h5 className='TitulosMenu'>Estado:</h5>
                          <h6 className="text-secondary OpcionesFont">{estado}</h6>
                      </div>
                      <div style={{ flex: '1', padding: '10px' }}>
                          <h5 className='TitulosMenu'>Municipio:</h5>
                          <h6 className="text-secondary OpcionesFont">{municipio}</h6>
                      </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div style={{ flex: '2', padding: '10px' }}>
                          <h5 className='TitulosMenu'>Dirección:</h5>
                          <h6 className="text-secondary OpcionesFont">{direccion}</h6>
                      </div>
                      <div style={{ flex: '1', padding: '10px' }}>
                          <h5 className='TitulosMenu'>Código postal:</h5>
                          <h6 className="text-secondary OpcionesFont">{CP}</h6>
                      </div>
                      <div style={{ flex: '1', padding: '10px' }}>
                          <h5 className='TitulosMenu'>Teléfono:</h5>
                          <h6 className="text-secondary OpcionesFont">{Telefono}</h6>
                      </div>
                  </div>
              </div>
                  ):
                  (
                      <div className="alert alert-primary" role="alert">
                          Sus datos no han sido proporcionados, le sugerimos que vaya a su perfil y los ingrese
                      </div> 
                  )
              }
            {/* <div className="form-group mb-3">
              <label htmlFor="direccion">Dirección:</label>
              <input
                type="text"
                className="form-control w-100"
                id="direccion"
                placeholder="Ingrese su dirección"
                name="Direc"
                value={ubica} 
                onChange={(e) => onInputChange2(e)}
              />
            </div>
            <div className="form-group mb-3"> 
              <label htmlFor="codigo-postal">Código Postal:</label>
              <input
                type="text"
                className="form-control w-100"
                id="codigo-postal"
                placeholder="Ingrese su código postal"
                name="CodP"
                value={CP} 
                onChange={(e) => onInputChange2(e)}
              />
            </div> */}
            <button  disabled={direccion !== ""? false:true}  onClick={ () => {Comprar(ContraOferta, Marca, TempodeEntrega, descripcion, empresa, nombre, numParte, Uname, Correo,imagenes, Oferta, Tipo, Telefono, direccion, CP, estado,municipio, almacen, ubiAlma, id, idU, latitude, longitude )}} id="confirmar-btn" className="btn btn-dark">
              Confirmar compra
            </button>
          </div>
        </div>
        <div className="col-sm-4 buyer-details">
          <h2 className="h2Compras">Detalles del Producto</h2>
          <h6 className="text-secondary OpcionesFont">
            <h5 className="TitulosMenu text-dark">Nombre del Producto:</h5> {nombre}
          </h6>
          <h6 className="text-secondary OpcionesFont">
            <h5 className="TitulosMenu text-dark">Descripción del producto:</h5> {descripcion}
          </h6>
          <h6 className="text-secondary OpcionesFont">
            <h5 className="TitulosMenu text-dark">Marca del producto:</h5> {Marca}
          </h6>
          <h6 className="text-secondary OpcionesFont">
            <h5 className="TitulosMenu text-dark">Número de parte del producto:</h5> {numParte}
          </h6>
          <h6 className="text-secondary OpcionesFont">
            <h5 className="TitulosMenu text-dark">Precio:</h5> ${Tipo === "ContraOferta" ? ContraOferta : Oferta}
          </h6>
          <h6 className="text-secondary OpcionesFont">
            <h5 className="TitulosMenu text-dark">Tiempo de entrega:</h5> {TempodeEntrega}
          </h6>
          <div className="product-image" style={{ textAlign: "center" }}>
            <img
              src={`https://ba-mro.mx/Server/Images/${imagenes}`}
              alt="Imagen del producto"
              style={{ maxWidth: "40%" }}
            />
          </div>
        </div>
      </div>
      <Noti notiCarrito={notiCarrito} activeNoti={activeNoti} />
    </div>
  );
};
