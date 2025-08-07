import { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import InputField from './components/InputField/InputField';
import AddButton from './components/AddButton/AddButton';
import DeleteButton from './components/DeleteButton/DeleteButton';
import DeleteTaskButton from './components/DeleteTask/DeleteTaskButton';
import { db } from './firebase';
import { doc, setDoc, getDoc, updateDoc, getDocs, collection } from "firebase/firestore";
import './App.css'

function App() {

  const [docSnap, setDocSnap] = useState();
  const [singleValue, setSingleValue] = useState("");
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    getID();
    console.log("DocSnap:", docSnap);
  }, [docSnap]);


  const getID = async () => {
    try {
      const docRef = doc(db, 'ID number', '3XaM5nlqyBMjTd1Bak2M');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setDocSnap(docSnap.data().ID);
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }
    } catch (error) {
      console.error("Error getting document:", error);
    }

    try {
      const docRef1 = getDocs(collection(db, 'Data'));
      const querySnapshot = await docRef1;
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push(doc.data());
      });
      setTasks(data);

    } catch (error) {
      console.error("Error fetching ID:", error);
    }

  };

  const HandlerAdd = async () => {
    if (singleValue === "") {
      alert("Please enter a task");
      return;
    }

    const newId = docSnap + 1; // Calculate new ID first
    
    try {
      // Update the ID counter in Firebase
      await updateDoc(doc(db, 'ID number', '3XaM5nlqyBMjTd1Bak2M'), {
        ID: newId // Use the calculated new ID
      });
      
      // Add the new task with the new ID
      await setDoc(doc(db, 'Data', `${newId}`), { 
        "id": newId, 
        "data": singleValue 
      });
      
      // Update local state last
      setDocSnap(newId);
      setSingleValue("");
      
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const HandlerDelete = () => {
    setTasks([])
    setSingleValue("");
  }


  const DeleteTask = (key) => {
    let NewArr = tasks.filter((e, i) => i !== key)
    setTasks(NewArr);
    setSingleValue("");
  }

  const [EditScreen, setEditScreen] = useState(false)
  const [KeyValue, setKeyValue] = useState()
  const [DisableBtn, setDisableBtn] = useState(false);

  const EditTask = (key) => {
    setKeyValue(key)
    setEditScreen(true);
    setDisableBtn(true);
    console.log("KeyValue:", key);
    setSingleValue(tasks[key-1].data);
    
  }

  const updateDocData = async (key) => {
    try {
      await updateDoc(doc(db, 'Data', `${key}`), {
        data: singleValue
      });
      UpdatedValue();

    } catch (error) {
      console.error("Error updating document:", error);
      alert("Failed to update task. Please try again.");
      setDisableBtn(false);
      setEditScreen(false);
      setSingleValue("");
      setKeyValue(undefined);     
    }
  }

  const UpdatedValue = () => {
    const updatedTasks = tasks.map((e, i) => i === KeyValue ? singleValue : e);
    setTasks(updatedTasks);
    setDisableBtn(false);
    setEditScreen(false);
    setSingleValue("");
    setKeyValue(undefined);
  }

  const CancelEdit = () => {
    setDisableBtn(false);
    setEditScreen(false);
    setSingleValue("");
    setKeyValue(undefined);
  }

  return (
    <>
      <Container>
        <h1 className='text-center mt-5'>ToDo Application</h1>
        <div className='d-flex justify-content-center align-items-center mt-5'>
          <InputField value={(e) => { setSingleValue(e.target.value) }} remover={singleValue} />
          {EditScreen === true ? <>
            <button onClick={UpdatedValue} className='btn btn-primary ms-2'>Confirm</button>
            <button onClick={CancelEdit} className='btn btn-danger ms-2'>Cancel</button>
          </> : <>
            <AddButton value={HandlerAdd} />
            <DeleteButton value={HandlerDelete} />
          </>}
        </div>

        <div className='mt-4'>
          {tasks.map((e, i) => {
            return (

              <div className='d-flex justify-content-center align-items-center bg-color my-1' key={i}>
                <div className='h-100 px-3 py-2 m-2 border_setting'>Task {e.id}</div>
                <div className='version px-3 py-2 m-2 border_setting'>{e.data}</div>
                <div><button onClick={() => { EditTask(e.id) }} disabled={DisableBtn} className='btn btn-primary ms-2 '>Edit</button></div>
                <div><DeleteTaskButton value={() => { DeleteTask(e.id) }} /></div>

              </div>
            )
          })}
        </div>


      </Container>
    </>
  )
}

export default App
