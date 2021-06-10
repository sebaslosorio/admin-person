import React, { useState, useEffect } from 'react'
import { isEmpty, size } from "lodash";
import { getCollection, addDocument, updateDocument, deleteDocument } from './actions'

function App() {

  //Se crea un hub de estado para validar si hay datos para ingresar o no
  const [cedula, setCedula] = useState("")
  const [nombre, setNombre] = useState("")
  const [apellido, setApellido] = useState("")

  const [editMode, setEditMode] = useState(false)
  const [id, setId] = useState("")
  const [error, setError] = useState(null)

  //Creamos un estado de tipo array para almacenar los usuarios
  const [usuarios, setUsuarios] = useState([])
  
  //Creamos un useEffect para cargar los datos que vienen de la base de datos de firebase
  useEffect(() => {
    (async () =>{
      const result = await getCollection("usuario")
      if (result.statusResponse) {
        setUsuarios(result.data)
      }
    })()
  }, [])

  //Metodo para validar el formulrio
  const validForm = () => {
    let isValid = true
    setError(null)
    //Validamos que el usuario ingrese algo en la data
    //Para obtener el ID de la coleccion debes instala la coleccion shotID
    //Para validar campos debemos agrear una libreria que se llama lodash y en la terminal yarn add lodash
    //Utilizamos una furncion isEmpty
    if (isEmpty(cedula) || isEmpty(nombre) || isEmpty(apellido)) {
      setError("Debes ingresar datos validos")
      isValid = false
    }
    return isValid
  }

  //Creamos el metodo con una funcion tipo flecha
  const addUsuario = async (e) => {
    //Validamos que el usuario ingrese algo en la data
    //Para obtener el ID de la coleccion debes instala la coleccion shotID
    e.preventDefault()
    //Se utiliza el validForm para comprobar si hay o no datos en el formulario
    if (!validForm()) {
      return
    }

    //Consultamos la base de datos mediante el addDocument
    const result = await addDocument("usuario", { code : cedula, name : nombre, last : apellido})
    //Preguntamos si el query fue exitiso
    if (!result.statusResponse) {
      setError(result.error)
      return
    }

    //Agregamos esta tarea a la collecion que ya se tiene con el xpress operator
    setUsuarios([...usuarios, {id: result.data.id, code : cedula, name : nombre, last : apellido}])

    //Limpiamos los campos del formulario
    setCedula("")
    setNombre("")
    setApellido("")
  }

  //Creamos un metodo el cual permite estar en dos modos el de edicion o de creacion
  const editUsuario = (user) => {
    setCedula(user.code)
    setNombre(user.name)
    setApellido(user.last)
    setEditMode(true)
    setId(user.id)
  }

  //Metodo para guardar datos actualixados
  const updateUsuario = async (e) =>{
    //Validamos que el usuario ingrese algo en la data
    //Para obtener el ID de la coleccion debes instala la coleccion shotID
    //Para validar campos debemos agrear una libreria que se llama lodash y en la terminal yarn add lodash
    //Utilizamos una furncion isEmpty
    e.preventDefault()
    if (!validForm()) {
      return
    }    

    //Creamos un result y le enviamos los parametros a las acciones
    const result = await updateDocument("usuario", id, {code : cedula, name : nombre, last : apellido})
    //Preguntamos si hubo exitio
    if (!result.statusResponse) {
      setError(result.error)
      return
    }

    //Editamnos la tarea con el map, si el item es igual al parametro reemplace lo que el usuario puso en el input en caso contrqario devuelva el item
    const updatedUsers = usuarios.map( item => item.id === id ? {id, code : cedula, name : nombre, last : apellido} : item)
    setUsuarios(updatedUsers)
    //Limpiamos los campos del formulario
    setCedula("")
    setNombre("")
    setApellido("")

    //El editMode lo ponemos en false
    setEditMode(false)
    setId("")

  }

  //Funcion tipo flecha que recibe como parametro el id del registro para poder eliminarlo mediante el concepto de filter
  const deleteUsuario = async(id) => {
    //creamios el result para identificar si el proceso su exitioso o no
    const result = await deleteDocument("usuario", id)
    //Validamos las respuestas
    if (!result.statusResponse) {
      setError(result.error)
    }
    //Creamos un filter
    const filterUsers = usuarios.filter( u => u.id !== id)
    setUsuarios(filterUsers)
  }

  return (
    <div className="container">
      <hr />
      <h2>Datos Usuarios Registrados</h2>
      <div className="row">
        <div className="col-8">
          <table class="table table-striped">
            <thead>
              <tr>
                <th scope="col">Cedula</th>
                <th scope="col">Nombre</th>
                <th scope="col">Apellido</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            {
              /*  utilizamos una condicion para saber si hay o no usuarios registradis*/
              size(usuarios) === 0 ? (
                <tbody>
                  <tr>
                    <td colspan="4" className="alert alert-warning text-center bold">No hay usuarios registrados</td>
                  </tr>
                </tbody>
              ) : (
                <tbody>                         
                { 
                    usuarios.map((user) => (
                      <tr key={user.id}>
                        <td>{user.code}</td>
                        <td>{user.name}</td>
                        <td>{user.last}</td>
                        <td>
                          <button 
                            className="btn btn-danger btn-sm float-left"
                            //Agregamos un onclic al boton para poder ejecutar la accion
                            onClick={() => deleteUsuario(user.id)}  
                          >
                            <i class="fa fa-trash-o fa-lg"></i>                              
                          </button>
                          <button 
                            className= {"btn btn-warning btn-sm float-left mx-2"}
                            //Agregamos un onclic al boton para poder ejecutar la accion
                            onClick={() => editUsuario(user)}
                          >
                            <i class="fa fa-pencil-square-o fa-lg"></i>                            
                          </button>                  
                        </td>
                      </tr>
                    ))                
                  } 
                </tbody>
              )
            }
          </table>
        </div>
        <div className="col-4">
          <h4 className="text-center">{editMode ? "Actualizar Usuario" : "Registrar Usuario"}</h4>
          {/* Agregamos un metodo al formulario*/}
          <form onSubmit={editMode ? updateUsuario : addUsuario}>
            {/* preguntamos si hay errores o no */}
            { error && <span className="text-danger">{error}</span>}
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Ingrese cedula..."
              //Cuando el usuario ingrese algo validamos si hay o no datos
              onChange={(text) => setCedula(text.target.value)}
              value={cedula}
            />
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Ingrese nombre..."
              onChange={(text) => setNombre(text.target.value)}
              value={nombre}
            />
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Ingrese apellido..."
              onChange={(text) => setApellido(text.target.value)}
              value={apellido}
            />
            <button 
              className={ editMode ? "btn btn-warning btn-sm btn-block fa fa-pencil-square-o fa-lg" : "btn btn-success btn-sm btn-block fa fa-plus fa-lg"}
              type='submit'
            >
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
