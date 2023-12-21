import React, { useContext, useEffect, useState } from 'react';
import axios from "axios";
import { AuthContext } from '../../auth/AuthContext';
import { Noti } from '../components/Notificaciones';

const HTTP = axios.create({
  baseURL: "https://badgerautomation.com/MarketPlace/Server/Data.php"
})
function AdminUserTable({ setMenu }) {
  const { user } = useContext(AuthContext);
  let IdEmpresaDB = user?.empresa ?? 0;
  const [users, setUsers] = useState([]);

  const [notiCarrito, setNotiCarrito] = useState();
  const [activeNoti, setActiveNoti] = useState();

  const [newUser, setNewUser] = useState({
    Nombre: '',
    Correo: '',
    Password: '',
    tipoUser: 2,
    Estatus: ""
  });

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editUserIndex, setEditUserIndex] = useState(null);

  const handleTogglePasswordVisibility = (index) => {
    const updatedUsers = [...users];
    updatedUsers[index].showPassword = !updatedUsers[index].showPassword;
    setUsers(updatedUsers);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleCreateUser = () => {
   
    console.log(newUser)
    if(newUser.Nombre === ""){
      setNotiCarrito("newUserNombre");
      setActiveNoti(true)
      setTimeout(() => {
          setActiveNoti(false)
      }, 5000);
      return;
    }
    if(newUser.Correo === ""){
      setNotiCarrito("newUserCorreo");
      setActiveNoti(true)
      setTimeout(() => {
          setActiveNoti(false)
      }, 5000);
      return;
    }
    if(newUser.Password === ""){
      setNotiCarrito("newUserPassword");
      setActiveNoti(true)
      setTimeout(() => {
          setActiveNoti(false)
      }, 5000);
      return;
    }
    HTTP.post("/NewUserByProveedor", { "Nombre": newUser.Nombre, "Password" : newUser.Password, "TipoUser" : newUser.tipoUser,  "idEmpresa" : IdEmpresaDB, "Correo" : newUser.Correo }).then((response) => {
      console.log(response.data)
      setNotiCarrito(response.data);
      setActiveNoti(true)
      setTimeout(() => {
          setActiveNoti(false)
      }, 5000);
      if(response.data === "RegistroUsuario"){
        HTTP.post("/GetUserByProveedor", { "Empresa": IdEmpresaDB }).then((response) => {
          setUsers(response.data)
        })
      }
    })
    
    setNewUser({
      Nombre: '',
      Correo: '',
      Password: '',
      tipoUser: '2',
      Estatus: ""
    });
    
    setShowCreateModal(false);
  };

  const handleEditUser = () => {
    // Aquí puedes agregar la lógica para editar un usuario en el estado o enviarlo al servidor
    if (editUserIndex !== null) {
      const updatedUsers = [...users];
      updatedUsers[editUserIndex] = newUser;
      setUsers(updatedUsers);
      setNewUser({
        Nombre: '',
        Correo: '',
        Password: '',
        tipoUser: '2',
        Estatus: ""
      });
      setEditUserIndex(null);
      setShowEditModal(false);
      let data = updatedUsers[editUserIndex];
      if(data.Nombre !== "" && data.Password !== ""){
        HTTP.post("/EditUserByProveedor", { "Nombre": data.Nombre, "Password" : data.Password, "TipoUser" : data.tipoUser, "Estatus" : data.Estatus, "id" : data.id }).then((response) => {
          setNotiCarrito("UpdateUserByProveedor");
          setActiveNoti(true)
          setTimeout(() => {
              setActiveNoti(false)
          }, 5000);
        })
      }else{
        setNotiCarrito("UserByProveedor");
        setActiveNoti(true)
        setTimeout(() => {
            setActiveNoti(false)
        }, 5000);
      }
    }
  };
  const handleCancelEdit = () => {
    setNewUser({
      Nombre: '',
      Correo: '',
      Password: '',
      tipoUser: '2',
      Estatus: ""
    });
    
    setEditUserIndex(null);
    setShowEditModal(false);
  };

  useEffect(() => {
    setMenu(2);
    
    setTimeout(() => {
      setNewUser({
        Nombre: '',
        Correo: '',
        Password: '',
        tipoUser: '2',
        Estatus: ""
      });
    }, "3000");
    HTTP.post("/GetUserByProveedor", { "Empresa": IdEmpresaDB }).then((response) => {
      setUsers(response.data)
    })
  }, []);

  return (
    <div className="divNewProducto mt-3">
      <h2>Usuarios</h2>
      <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
        Crear Nuevo Usuario
      </button>

      <table className="table table-bordered table-striped mt-3">
        <thead style={{ background: '#303030', color: '#fff' }}>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Password</th>
            <th>Tipo de Usuario</th>
            <th>Estatus</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.id}>
              <td>{user.Nombre}</td>
              <td>{user.Correo}</td>
              <td>
                {user.showPassword ? user.Password : '********'}{' '}
                {user.showPassword ? (
                  <button className="btn btn-dark" style={{ float: "right" }} onClick={() => handleTogglePasswordVisibility(index)}>
                    <i className="bi bi-eye-slash"></i> {/* Ícono de ocultar */}
                  </button>
                ) : (
                  <button className="btn btn-dark" style={{ float: "right" }} onClick={() => handleTogglePasswordVisibility(index)}>
                    <i className="bi bi-eye"></i> {/* Ícono de mostrar */}
                  </button>
                )}
              </td>
              <td>{user.tipoUser === "2" ? 'Tipo 2' : user.tipoUser === "3" ? 'Tipo 3' : user.tipoUser === "4" ? 'Master' : ''}</td>
              
              <td>
                {user.Estatus === "1"? "Activo" : "Inactivo"}
              </td>
              <td>
                {user.tipoUser === "4" ? (
                  <></>
                ) : (
                  <button className="btn btn-primary" onClick={() => {
                    setEditUserIndex(index);
                    setNewUser(user);
                    setShowEditModal(true);
                  }}>
                    Editar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="modal" tabIndex="-1" role="dialog" style={{ display: showCreateModal ? 'block' : 'none' }}>
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Crear Nuevo Usuario</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => {
                setShowCreateModal(false);
                setNewUser({ Nombre: '', Correo: '', Password: '', tipoUser: '2' });
              }}></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="form-group">
                  <label htmlFor="Nombre">Nombre:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="NombreNuevo"
                    name="Nombre"
                    value={newUser.Nombre}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="Correo">Correo:</label>
                  <input
                    type="email"
                    className="form-control"
                    id="CorreoNuevo"
                    name="Correo"
                    value={newUser.Correo}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="Password">Password:</label>
                  <input
                    type="Password"
                    className="form-control"
                    id="PasswordNuevo"
                    name="Password"
                    value={newUser.Password}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="tipoUser">Tipo de Usuario:</label>
                  <select
                    className="form-control"
                    id="tipoUserNuevo"
                    name="tipoUser"
                    value={newUser.tipoUser}
                    onChange={handleInputChange}
                  >
                    <option value={'2'}>Tipo 2</option>
                    <option value={'3'}>Tipo 3</option>
                  </select>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                Cancelar
              </button>
              <button type="button" className="btn btn-primary" onClick={handleCreateUser}>
                Crear
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="modal" tabIndex="-1" role="dialog" style={{ display: showEditModal ? 'block' : 'none' }}>
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Editar Usuario</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleCancelEdit}></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="form-group">
                  <label htmlFor="Nombre">Nombre:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="Nombre"
                    name="Nombre"
                    value={newUser.Nombre}
                    onChange={handleInputChange}
                  />
                </div>
         
                <div className="form-group">
                  <label htmlFor="Password">Password:</label>
                  <input
                    type="Password"
                    className="form-control"
                    id="Password"
                    name="Password"
                    value={newUser.Password}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="tipoUser">Tipo de Usuario:</label>
                  <select
                    className="form-control"
                    id="tipoUser"
                    name="tipoUser"
                    value={newUser.tipoUser}
                    onChange={handleInputChange}
                  >
                    <option value={'2'}>Tipo 2</option>
                    <option value={'3'}>Tipo 3</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="Estatus">Estatus:</label>
                  <select
                    className="form-control"
                    id="Estatus"
                    name="Estatus"
                    value={newUser.Estatus}
                    onChange={handleInputChange}
                  >
                    <option value="1">Activo</option>
                    <option value="0">Inactivo</option>
                  </select>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={handleCancelEdit}>
                Cancelar
              </button>
              <button type="button" className="btn btn-primary" onClick={handleEditUser}>
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      </div>
      <Noti notiCarrito={notiCarrito} activeNoti={activeNoti} />
    </div>
  );
}

export default AdminUserTable;
