import React, {useState, useEffect} from "react";

function App() { 

    const i = 0
    const [editId, setEditId] = useState(0)
    const [taskl, taskLoader] = useState([])
    const [task, setTask] = useState({title:"", description:""})
    
    useEffect(() => {loadTasks()}, [i])

    const handleChange = event =>{

        if (event.target.name == "title"){

            setTask({title: event.target.value, description: task.description})

        } else if (event.target.name == "description"){

            setTask({title: task.title, description: event.target.value})

        }

    }
    
    const editTask = ({_id, title, description}) => {
        
        setTask({title, description})
        setEditId(_id)

    }

    const saveChanges = (id) =>{

        if (task.title && task.description){

            fetch("/api/tasks/" + id, {

                method: "PUT",
                body: JSON.stringify(task),
                headers: {
    
                    "Accept": "application/json",
                    "Content-Type": "application/json"
    
                }
    
            })
            .then(res => res.json())
            .then(data => {console.log(data) 
                        M.toast({html: "Task Updated"})
                        const matchId = (array) => array._id === id
                        if (taskl.findIndex(matchId) !== -1){
                            taskl[taskl.findIndex(matchId)].title = task.title
                            taskl[taskl.findIndex(matchId)].description = task.description
                            taskLoader([...taskl])
                        }
                        setEditId(0)
                        })
            .catch(err => console.error(err))

        }else{

            if (task.description){alert ("Ingresa un titulo para la tarea")}else if(task.title){alert ("Falta la descripcion de la tarea")}else{alert("La tarea no puede estar vacia")}

        }  

    }

    const loadTasks = ()=>{

        fetch("/api/tasks")
        .then(res => res.json())
        .then(data => taskLoader(data))
        .catch(err => console.error(err))

    }
    
    const saveTask = (event) =>{
        
        event.preventDefault()
        if (task.title && task.description){

            fetch("/api/tasks", {

                method: "POST",
                body: JSON.stringify(task),
                headers: {
    
                    "Accept": "application/json",
                    "Content-Type": "application/json"
    
                }
    
            })
            .then(res => res.json())
            .then(data => {console.log(data) 
                        M.toast({html: "Task Saved"})
                        loadTasks()
                        //taskLoader([...taskl, ...[task]])
                        })
            .catch(err => console.error(err))

            event.target.reset()

        }else{

            if (task.description){alert ("Ingresa un titulo para la tarea")}else if(task.title){alert ("Falta la descripcion de la tarea")}else{alert("La tarea no puede estar vacia")}

        }  
        
        
    }

    const deleteTask = (id)=>{

        if (confirm("Are you sure you want to delete? THIS CANNOT BE UNDONE")){

            fetch("/api/tasks/" + id, {

                method: "DELETE",
                headers:{
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                    }
                })
            .then(res => res.json()) 
            .then(result => {console.log(result)
                            const matchId = (array) => array._id === id
                            
                            M.toast({html: "Task deleted"})
                            if (taskl.findIndex(matchId) !== -1){
                                taskl.splice(taskl.findIndex(matchId), 1)
                                taskLoader([...taskl])

                            }
                            })
            .catch(err => console.error(err))

        }

    }

    return(

        <div>

            <nav className="light-blue darken-4">

                <div className="container">

                    <a className="brand-logo" href="/">Puto el que lee</a>

                </div>
                

            </nav>
            <div className="container">

                <div className="row">

                    <div className="col s5">

                        <div className="card">
                            <div className="card-content">
                                <form onSubmit={saveTask}>
                                    <div className="row">
                                        <div className="input-field col s12">
                                            <input name="title" type="text" onChange={handleChange} placeholder="Task title"/>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="input-field col s12">
                                            <textarea name="description" onChange={handleChange} type="text" placeholder="Task description" className="materialize-textarea" style={{minHeight: "100px"}}/>
                                        </div>
                                    </div>
                                    <button className="btn light-blue darken-4" type="submit">Save</button>

                                </form>
                            </div>
                        </div>

                    </div>
                    <div className="col s7">

                        <table>
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Description</th>
                                </tr>
                            </thead>
                            <tbody>{
                                
                                    taskl.map(item =>{
                                        if (editId === item._id){
                                            return(<tr id={item._id} key={item._id}>
                                                <td>
                                                    <input type="text" onChange={handleChange} name="title" value={task.title}/>
                                                </td>
                                                <td>
                                                    <textarea type="text" className="materialize-textarea" onChange={handleChange} name="description" value={task.description} style={{minHeight: "75px"}}/>
                                                </td>
                                                <td>
                                                    <div className="container" style={{width: "100%"}}>
                                            
                                                            <button onClick={() => saveChanges(item._id)} className="btn darken-4" style={{width:"50%", display:"inline-flex", justifyContent: "center"}}>
                                                                <i className="material-icons">check</i>
                                                            </button>
                                                    
                                                        
                                                            <button onClick={() => setEditId(1)} className="btn darken-4" style={{width:"50%", display:"inline-flex", justifyContent: "center"}}>
                                                                <i className="material-icons">cancel</i>
                                                            </button>
                                                    
                                                    </div>
                                                </td>
                                            </tr>)
                                        }else{
                                            return(<tr id={item._id} key={item._id}>
                                                <td>
                                                    {item.title}
                                                </td>
                                                <td>
                                                    {item.description}
                                                </td>
                                                <td>
                                                    <div className="container" style={{width: "100%"}}>
                                            
                                                            <button onClick={() => editTask(item)} className="btn darken-4" style={{width: "50%", display:"inline-flex", justifyContent: "center"}}>
                                                                <i className="material-icons">edit</i>
                                                            </button>
                                                    
                                                        
                                                            <button onClick={() => deleteTask(item._id)} className="btn darken-4" style={{width: "50%", display:"inline-flex", justifyContent: "center"}}>
                                                                <i className="material-icons">delete</i>
                                                            </button>
                                                    
                                                    </div>
                                                </td>
                                            </tr>)
                                        }
                                        })

                                    }</tbody>
                        </table>

                    </div>

                </div>

            </div>

        </div>

    )

}

export default App