import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Button, Modal, Table } from 'react-bootstrap';
import './index.css';

function App() {
    const [usuarios, setUsuarios] = useState([]);
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [email, setEmail] = useState("");
    const [dni, setDni] = useState(""); 
    const [direccion, setDireccion] = useState(""); 
    const [usuarioActualizado, setUsuarioActualizado] = useState(null);
    const [showModal, setShowModal] = useState(false); // Estado para manejar el modal

    useEffect(() => {
        obtenerUsuarios();
    }, []);

    const obtenerUsuarios = () => {
        axios.get("http://localhost:8080/api/usuarios")
            .then(response => setUsuarios(response.data))
            .catch(error => console.error(error));
    };

    const crearUsuario = () => {
        axios.post("http://localhost:8080/api/usuarios", { nombre, apellido, correo: email, direccion, dni })
            .then(response => {
                setUsuarios([...usuarios, response.data]);
                resetForm();
                Swal.fire('Éxito', 'Usuario creado correctamente', 'success');
                setShowModal(false); // Cerrar el modal
            })
            .catch(error => Swal.fire('Error', 'No se pudo crear el usuario', 'error'));
    };

    const eliminarUsuario = (id) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "¡No podrás revertir esto!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminarlo!'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`http://localhost:8080/api/usuarios/${id}`)
                    .then(() => {
                        setUsuarios(usuarios.filter(usuario => usuario.id !== id));
                        Swal.fire('Eliminado!', 'El usuario ha sido eliminado.', 'success');
                    })
                    .catch(error => Swal.fire('Error', 'Error al eliminar el usuario', 'error'));
            }
        });
    };

    const editarUsuario = (usuario) => {
        setNombre(usuario.nombre);
        setApellido(usuario.apellido);
        setEmail(usuario.correo);
        setDni(usuario.dni);
        setDireccion(usuario.direccion);
        setUsuarioActualizado(usuario.id);
        setShowModal(true); // Abrir el modal para editar
        console.log("Usuario a editar:", usuario); // Verificar el usuario
    };
    

    const actualizarUsuario = () => {
        if (usuarioActualizado) {
            const usuarioData = { nombre, apellido, correo: email, dni, direccion };
            console.log("Datos a enviar:", usuarioData); // Verificar los datos
            axios.put(`http://localhost:8080/api/usuarios/${usuarioActualizado}`, usuarioData)
                .then(response => {
                    console.log("Respuesta del servidor:", response.data); // Verificar la respuesta
                    const usuariosActualizados = usuarios.map(usuario => 
                        usuario.id === usuarioActualizado ? { ...usuario, ...response.data } : usuario
                    );
                    setUsuarios(usuariosActualizados);
                    resetForm();
                    setUsuarioActualizado(null);
                    Swal.fire('Éxito', 'Usuario actualizado correctamente', 'success');
                    setShowModal(false); // Cerrar el modal
                })
                .catch(error => {
                    console.error('Error al actualizar el usuario:', error);
                    Swal.fire('Error', 'No se pudo actualizar el usuario', 'error');
                });
        }
    };
       
    

    const resetForm = () => {
        setNombre("");
        setApellido("");
        setEmail("");
        setDni("");
        setDireccion("");
    };

    const handleModalShow = () => {
        resetForm();
        setShowModal(true); // Abrir el modal para agregar usuario
    };

    const handleModalClose = () => {
        resetForm();
        setShowModal(false); // Cerrar el modal
    };

    return (
        <div className="container" style={{ padding: "20px" }}>
            <h1 className="text-center">Lista de Usuarios</h1>
            <Button className= "buttonagregar" variant="primary" onClick={handleModalShow}>
                Agregar Usuario
            </Button>
            <Table striped bordered hover className="mt-4">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Email</th>
                        <th>DNI</th>
                        <th>Dirección</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                {usuarios.map(usuario => (
                    <tr key={usuario.id}>
                        <td>{usuario.nombre}</td>
                        <td>{usuario.apellido}</td>
                        <td>{usuario.correo}</td>
                        <td>{usuario.dni}</td>
                        <td>{usuario.direccion}</td>
                        <td>
                            <Button variant="info" className="mx-1" onClick={() => editarUsuario(usuario)}>Editar</Button>
                            <Button variant="danger" onClick={() => eliminarUsuario(usuario.id)}>Eliminar</Button>
                        </td>
                    </tr>
                ))}
            </tbody>
            </Table>

            {/* Modal para agregar/editar usuario */}
            <Modal show={showModal} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{usuarioActualizado ? 'Actualizar Usuario' : 'Agregar Usuario'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <div className="mb-3">
                            <label className="form-label">Nombre</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Nombre"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Apellido</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Apellido"
                                value={apellido}
                                onChange={(e) => setApellido(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">DNI</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="DNI"
                                value={dni}
                                onChange={(e) => setDni(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Dirección</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Dirección"
                                value={direccion}
                                onChange={(e) => setDireccion(e.target.value)}
                            />
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleModalClose}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={usuarioActualizado ? actualizarUsuario : crearUsuario}>
                        {usuarioActualizado ? 'Actualizar' : 'Agregar'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default App;
