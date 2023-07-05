import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../auth/AuthContext";
import axios from "axios";
import { CardMisProductos } from "../components/CardMisProductos";
import { BtnProducto } from "../components/buttonProducto";
import { BtnSaveAll } from "../components/btnSaveAllProducts";
import { Noti } from "../components/Notificaciones";
const URLServer = "http://192.168.100.18:3020/"
const HTTP = axios.create({
    baseURL: "https://badgerautomation.com/MarketPlace/Server/Data.php"
})
export const MyProducts = ({ setMenu }) => {
    const { user } = useContext(AuthContext);
    let idU = user?.id;

    const [productos, setProductos] = useState([]);
    // const [data, setData ] = useState([]);

    const [notiCarrito, setNotiCarrito] = useState();
    const [activeNoti, setActiveNoti] = useState();


    function getMyProducts() {
        HTTP.post("/getMyProducts",{"idU": idU }).then((response) => {
            //Si la respuesta es correacta modificaremos el array con los objetos que obtenga desde la busqueda
            setProductos(response.data)
            console.log(response.data)
        })
        
    }
    useEffect(() => {
        setMenu(2);
        getMyProducts();
    }, [])
    // function Estrellas(){

    // }
    async function saveOne(data, datos) {
        if (data !== 0) {
            try {
                const response = await HTTP.post("/updatePro",data);
                //const response = await axios.post(URLServer + 'updatePro', data);
                let Alldata = { ...datos, PDF: response.data }
                console.log(Alldata)
                HTTP.post("/updateProducto",Alldata).then((response) => {
                    if (response.data === "Actualizado") {
                        setNotiCarrito("ArticuloUpdate");
                        setActiveNoti(true)
                        setTimeout(() => {
                            setActiveNoti(false)
                        }, 5000);
                    }
                })
            } catch (error) {
                console.error(error);
            }
        } else {
            console.log(datos);
            HTTP.post("/updateProducto",datos).then((response) => {
                if (response.data === "Actualizado") {
                    setNotiCarrito("ArticuloUpdate");
                    setActiveNoti(true)
                    setTimeout(() => {
                        setActiveNoti(false)
                    }, 5000);
                }
            })
        }



    }
    function saveAll() {
        let datos = [];
       const d =  productos.map(async (element) => {
            let id = element.id;
            let Nombre = document.getElementById(`nombreIN${id}`).value;
            let Categoria = document.getElementById(`categoriaIN${id}`).value;
            let Estado = document.getElementById(`estadoIN${id}`).value;
            let Oferta = document.getElementById(`ofertaIN${id}`).value;
            let Descripcion = document.getElementById(`descripcionIN${id}`).value;
            let Precio = document.getElementById(`precioIN${id}`).value;
            let PrecioOferta = document.getElementById(`precioOfertaIN${id}`).value;
            let Stock = document.getElementById(`stokIN${id}`).value;
            let Marca = document.getElementById(`marcaIN${id}`).value;
            let CodigoProveedor = document.getElementById(`CodigoProveedorIN${id}`).value;
            let Peso = document.getElementById(`PesoIN${id}`).value;
            let TempodeEntrega = document.getElementById(`TempodeEntregaIN${id}`).value;
            let TempoDdeEntregaAgotado = document.getElementById(`TempoDdeEntregaAgotadoIN${id}`).value;
            let pdf = document.getElementById(`file${id}`);
            let file = pdf.files[0];
            console.log(file + "-" + id)
            let arr;
            if (file !== undefined) {
                try {
                    let formData = new FormData();
                    formData.set('file', file);
                    const response = await HTTP.post("/updatePro",formData);
                    //const response = await axios.post(URLServer + 'updatePro', formData);
                    arr = { Nombre, Categoria, Estado, Oferta, Descripcion, Precio, PrecioOferta, Stock, id, Marca, CodigoProveedor, Peso, TempodeEntrega, TempoDdeEntregaAgotado, PDF: response.data };
                    datos.push(arr)
                } catch (error) {
                    console.error(error);
                }
            }else{
                arr = { Nombre, Categoria, Estado, Oferta, Descripcion, Precio, PrecioOferta, Stock, id, Marca, CodigoProveedor, Peso, TempodeEntrega, TempoDdeEntregaAgotado, PDF:1 };
                datos.push(arr)
            }
        
            if(datos.length === productos.length){
                console.log(datos)
                HTTP.post("/updateProductos", datos).then((response) => {
                    if(response.data === "ElementosActualizados")
                        setNotiCarrito("ElementosActualizados");
                        setActiveNoti(true)
                        setTimeout(() => {
                            setActiveNoti(false)
                        }, 5000);
                })
            }
        });
        
    }
    return (
        <>
            <div style={{ "width": "100%", "height": "100%", "marginTop": "80px" }} >
                {productos.map((productos) => (
                    <CardMisProductos key={productos.id} {...productos} saveOne={saveOne} />
                ))}
            </div>
            <BtnProducto />
            <BtnSaveAll saveAll={saveAll} />
            <Noti notiCarrito={notiCarrito} activeNoti={activeNoti} />
        </>
    )
}