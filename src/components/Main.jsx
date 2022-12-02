import { useEffect, useState } from "react";
import Todo from "./Todo";
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";
import { API } from "../backend";
import { useNavigate } from "react-router-dom";
import { account } from "../appwrite/config";


const Main = ()=>{
    // useEffect hook to check whether the user is already logged in or not
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const [user, setUser] = useState()

    // adding the autoAnimate feature
    const [parent, disableAnime] = useAutoAnimate();
    const navigate = useNavigate();
        /**
     * setting up the data  
     */
    const [todos, setTodoes] = useState([]);
    useEffect(()=>{
        // getting the data from local storage
        // console.log("runnin effect")
        const userlogged = account.get();
        userlogged.then((response)=>{
            console.log(response);
            setUser(response);
        })
        if(user){
            setIsAuthenticated(true)
            console.log("authenticated")
            axios.get(`${API.todoApi}/todoes/${user.$id}`, {
            }).then((response)=>{
                setTodoes(response.data.data);
            }).catch((error)=>{
                console.log("can not connect to backend:", error);
                toast("Loading error.... Please logout and try again")
            })

            toast(`Hey Welcome ${user.name}`);
        }

    }, []);

    if(!isAuthenticated){
        
        return (
            <>
                <h1 className="flex justify-center flex-col gap-6 items-center">You are Not Authorized to visit this page Please login
                    <a href="/">Go to Login</a>
                </h1>
            </>
        )
     }

    function addTask(event) {
        setTodoes([...todos, {title:""}]);
    }
    const signOut = async ()=>{
        try {
            await account.deleteSession();
            navigate("/");
        } catch (error) {
            toast("Somthing went wrong please try again");
        }
    }

    // console.log(jwt)
    return(
        <div className="flex justify-center  items-center">
            <ToastContainer></ToastContainer>
            <div className="card w-[986px] h-full glass">
                <div className="card-body">
                <div className="flex  gap-24">
                    <div className="side-content flex justify-center">
                        <h2 className="text-3xl pt-1">MyTODO</h2>
                        <div className="dropdown dropdown-end ">
                            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                                <div className="w-10 rounded-full">
                                <img src="https://placeimg.com/80/80/people" />
                                </div>
                            </label>
                            <ul tabIndex={0} className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-32">
                                <li><button onClick={()=>toast("We be avaiable soon")}>Settings</button></li>
                                <li><button onClick={()=>toast("We be avaiable soon")}>Search</button></li>
                                <li><button onClick={()=>toast("We be avaiable soon")}>Sort</button></li>
                                <li><button onClick={signOut}>Logout</button></li>
                            </ul>
                        </div>
                    </div>
                    <div className="main-content flex flex-col ml-12">
                    <ul id="todos" className="text-xl max-h-[526px] overflow-y-auto" ref={parent}>
                        {todos.map((item, i)=>(<Todo data={item} key={item._id || i}></Todo>))}
                    </ul>
                    <button id="addTask" className="btn btn-wide btn-outline mt-12" onClick={addTask}>
                        Add Task
                    </button>
                    </div>
                </div>
                </div>
            </div>
        </div>
    )

}


export default Main;