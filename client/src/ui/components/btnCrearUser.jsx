import { useNavigate } from "react-router";

export const BtnCrearUser = () => {
    const navigate = useNavigate();
    function NewUserProveedor() {
        navigate('/NewUserProveedor', {
            replace: true
        })
    }
    return(
        <>
            
            <button onClick={() => NewUserProveedor()} className='btn btn-dark botonNewUserProveedor'><i className="bi bi-cloud-arrow-up-fill"></i> Nuevo usuario</button>
        </>
    )
}