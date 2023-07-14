import { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import { Noti } from "../components/Notificaciones";
export const ComprasProduct = ({ setMenu }) => {
  const [notiCarrito, setNotiCarrito] = useState();
  const [activeNoti, setActiveNoti] = useState();
  const [ubica, setUbica] = useState("");
  const [CP, setCP] = useState("");
  function Comprar(ContraOferta, Marca, TempodeEntrega, descripcion, empresa, nombre, numParte, Uname, Correo, imagenes, ubica, CP) {
    if(ubica !== "" && CP !== ""){
      window.open(`https://ba-mro.mx/Server/CorreoCompra.php?CO=${ContraOferta}&MARCA=${Marca}&TempodeEntrega=${TempodeEntrega}&descripcion=${descripcion}&empresa=${empresa}&nombre=${nombre}&numParte=${numParte}&Uname=${Uname}&Correo=${Correo}&imagenes=${imagenes}&ubica=${ubica}&CP=${CP}`, '_blank');
      setNotiCarrito("CorreoEnviado2")
      setActiveNoti(true)
      setTimeout(() => {
          setActiveNoti(false)
      }, 4000);
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
  }, []);
  const location = useLocation();
  const { ContraOferta, Marca, TempodeEntrega, descripcion, empresa, nombre, numParte, Uname, Correo, img } = location.state;
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
    name = "Badger automation";
    email = "contact@badgerautomation.com"
    tel = "686 582 7223"
    ubi = "Calzada Robleo Industrial 460, Col. Huertas del Colorado, Mexicali, BC 21384, MX"
  }else{
    name = "APLINTEC";
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
          <p className="pCompras">
            <strong>Nombre:</strong> {name}
          </p>
          <p className="pCompras">
            <strong>Email:</strong> {email}
          </p>
          <p className="pCompras">
            <strong>Teléfono:</strong> {tel}
          </p>
          <p className="pCompras">
            <strong>Ubicación:</strong> {ubi}
          </p>
          <br />
          <div>
            <h2 className="h2Compras">Detalles del Comprador</h2>
            <p className="pCompras">
                <strong>Nombre:</strong> {Uname}
            </p>
            <p className="pCompras">
                <strong>Email:</strong> {Correo}
            </p>
            <p className="pCompras">
              <strong>Teléfono:</strong> Null
            </p>
            <div className="form-group mb-3"> {/* Added mb-3 class */}
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
            <div className="form-group mb-3"> {/* Added mb-3 class */}
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
            </div>
            <button onClick={ () => {Comprar(ContraOferta, Marca, TempodeEntrega, descripcion, empresa, nombre, numParte, Uname, Correo,imagenes,ubica, CP)}} id="confirmar-btn" className="btn btn-dark">
              Confirmar compra
            </button>
          </div>
        </div>
        <div className="col-sm-4 buyer-details">
          <h2 className="h2Compras">Detalles del Producto</h2>
          <p className="pCompras">
            <strong>Nombre del Producto:</strong> {nombre}
          </p>
          <p className="pCompras">
            <strong>Descripción del producto:</strong> {descripcion}
          </p>
          <p className="pCompras">
            <strong>Marca del producto:</strong> {Marca}
          </p>
          <p className="pCompras">
            <strong>Número de parte del producto:</strong> {numParte}
          </p>
          <p className="pCompras">
            <strong>Precio:</strong> ${ContraOferta}
          </p>
          <p className="pCompras">
            <strong>Tiempo de entrega:</strong> {TempodeEntrega}
          </p>
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
