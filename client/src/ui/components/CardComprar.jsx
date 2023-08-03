
export const CardComprar = ({ id, img, descripcion, EliminarNotiFicacion,empresa,OfertaNoti, ComprarProductoNoti}) => {
    function EliminarNoti(id){
        EliminarNotiFicacion(id)
    }
    function ComprarProductoN(id) {
        ComprarProductoNoti(id)
        
    }
    let images = img?.split(',');
    let imagenes = "";
    if(images?.[0] === undefined){
       imagenes = "Box.jpg"
    }else{
        imagenes = images?.[0]
    }
    return (
        <li>
            <div className="align-items-center FilaCarritoItem d-flex" style={{ "padding": "4px" }}>
                
                <div className=" ms-3" style={{ "width": "100%" }}>
                    <p className="text-secondary OpcionesFont"  style={{ "whiteSpace": "normal","margin":"0px" }} >¡Gracias por su compra!, el proveedor: <b className="text-dark OpcionesFont">BA-MRO</b>, ha confirmado su compra, revise el correo que se le envió con los datos de su compra </p>
                    <button style={{"float":"right"}} className="btn btn-secondary ms-4"  onClick={() => EliminarNoti(id)}>Eliminar notificación</button>    
                </div>
            </div>
        </li>
    )
}