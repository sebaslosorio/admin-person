import { firebaseApp} from './firebase'
import * as firebase from 'firebase'
import 'firebase/firestore'

const db = firebase.firestore(firebaseApp)

//Metodo generico que permite traer una coleccion de datos//
//El parametro collection es el nombre de la coleccion en firebase
export const getCollection = async (collection) => {
    //validamos si funciona o no, creamos un objeto con tres paramentos
    const result = { statusResponse : false, data : null, error : null}
    try {
        //Si hay datos en la coleccion se hace lo siguiente
        //Creamos una constante para almacenar la data
        const data = await db.collection(collection).get()
        //Mapeamos el objeto data
        const arrayData = data.docs.map(doc => ({ id : doc.id, ...doc.data()}))
        //Si la consulta llena el objeto arrayData retornamos
        result.statusResponse = true
        result.data = arrayData
    } catch (error) {
        result.error = error 
    }
    return result
}

//Metodo para crear un usuario en una coleccion de datos y recibe como parametro el nombre de la collecion y los datos
//parametros colletion es el nombre de la coleccion en firebase y data son los datos que se quieren guardar
export const addDocument = async (collection, data) => {
    //Validamos si funciona o no con un objeto
    const result = {statusResponse : false, data : null, error : null}
    //Creamos una variable para almacenar los datos a enviar.
    try {
        const responde = await db.collection(collection).add(data)
        //Respondemos el id de la nueva tarea ya que no se que ID me dara la base de datos
        result.data = {id: responde.id}
        //exito en el result
        result.statusResponse = true
    } catch (error) {
        result.error = error
    }
    return result
}

//Metodo que permite traer un solo usuario de la base de datos, estos metodos son genericos
export const getDocument = async (collection, id) => {
    //validamos si funciona o no la data de la coleccion
    const result = {statusResponse : false, data : null, error : null}
    try {
        //con esta linea de codigo vamos a firebase y consultamos si ese documento existe o no mediate los paramwetros que hay en la funcion
        const response = await db.collection(collection).doc(id).get()
        //Mediante este metodo obtenemos la data con el xpress operator
        result.data = {id : response.id, ...response.data()}
        result.statusResponse = true
    } catch (error) {
        result.error = error
    }
    return result
}

export const updateDocument = async (collection, id, data) => {
    const result = {statusResponse : false, data : null, error : null}
    try {
        //con esta linea de codigo vamos a firebase y consultamos si ese documento existe 
        //o no mediate los paramwetros que hay en la funcion, lo que se hace es que que
        const response = await db.collection(collection).doc(id).update(data)
        result.statusResponse = true
    } catch (error) {
        result.error = error
    }
    return result
}


//Metodo para eliminar un documento de la coleccion en firebase
export const deleteDocument = async (collection, id) => {
    const result = {statusResponse : false, data : null, error : null}
    try {
        //con esta linea de codigo vamos a firebase y consultamos si ese documento existe 
        //o no mediate los paramwetros que hay en la funcion, lo que se hace es que que
        const response = await db.collection(collection).doc(id).delete()
        result.statusResponse = true
    } catch (error) {
        result.error = error
    }
    return result
}