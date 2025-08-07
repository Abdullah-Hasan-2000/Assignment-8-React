import { useEffect, useState } from 'react';
import { Container, Toast, ToastContainer, Spinner } from 'react-bootstrap';
import InputField from './components/InputField/InputField';
import AddButton from './components/AddButton/AddButton';
import DeleteButton from './components/DeleteButton/DeleteButton';
import DeleteTaskButton from './components/DeleteTask/DeleteTaskButton';
import { db } from './firebase';
import { doc, setDoc, getDoc, updateDoc, getDocs, collection, deleteDoc } from "firebase/firestore";
import './App.css'

function App() {

  const [docSnap, setDocSnap] = useState();
  const [singleValue, setSingleValue] = useState("");
  const [tasks, setTasks] = useState([]);
  const [EditScreen, setEditScreen] = useState(false)
  const [KeyValue, setKeyValue] = useState()
  const [DisableBtn, setDisableBtn] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Loading states for async operations
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [deletingTaskId, setDeletingTaskId] = useState(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  
  // Toast states
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("warning");

  useEffect(() => {
    getID();
  }, [docSnap, KeyValue, loading]);

  const getID = async () => {
    try {
      const docRef = doc(db, 'ID number', '3XaM5nlqyBMjTd1Bak2M');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setDocSnap(docSnap.data().ID);
      } else {
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
      setIsInitialLoading(false); // Set initial loading to false after first load

    } catch (error) {
      console.error("Error fetching ID:", error);
      setIsInitialLoading(false);
    }
  };

  const HandlerAdd = async () => {
    if (singleValue === "") {
      setToastMessage("Please enter a task");
      setToastVariant("warning");
      setShowToast(true);
      return;
    }

    setIsAdding(true); // Start loading
    const newId = docSnap + 1;
    
    try {
      await updateDoc(doc(db, 'ID number', '3XaM5nlqyBMjTd1Bak2M'), {
        ID: newId
      });
      
      await setDoc(doc(db, 'Data', `${newId}`), { 
        "id": newId, 
        "data": singleValue 
      });
      
      setDocSnap(newId);
      setSingleValue("");
      
      // Success toast
      setToastMessage("Task added successfully!");
      setToastVariant("success");
      setShowToast(true);
      
    } catch (error) {
      console.error("Error adding task:", error);
      setToastMessage("Error adding task. Please try again.");
      setToastVariant("danger");
      setShowToast(true);
    } finally {
      setIsAdding(false); // End loading
    }
  };

  const HandlerDelete = () => {
    setToastMessage("Deleting All the tasks is not recommended. Please delete tasks individually.");
    setToastVariant("warning");
    setShowToast(true);
  }

  const DeleteTask = async (key) => {
    setDeletingTaskId(key); // Set which task is being deleted
    
    try {
      await deleteDoc(doc(db, 'Data', `${key}`));
      setSingleValue("");
      setLoading(!loading);
      
      // Success toast
      setToastMessage("Task deleted successfully!");
      setToastVariant("success");
      setShowToast(true);
      
    } catch (error) {
      console.error("Error deleting task:", error);
      setToastMessage("Error deleting task. Please try again.");
      setToastVariant("danger");
      setShowToast(true);
    } finally {
      setDeletingTaskId(null); // Reset deleting state
    }
  };

  const EditTask = (key) => {
    setKeyValue(key)
    setEditScreen(true);
    setDisableBtn(true);
    setSingleValue(tasks[key-1].data);
  }

  const UpdatedValue = async () => {
    setIsUpdating(true); // Start loading
    
    try {
      await updateDoc(doc(db, 'Data', `${KeyValue}`), {
        data: singleValue
      });
      
      setEditScreen(false);
      setDisableBtn(false); 
      setSingleValue("");
      setKeyValue(undefined);
      
      // Success toast
      setToastMessage("Task updated successfully!");
      setToastVariant("success");
      setShowToast(true);
      
    } catch (error) {
      console.error("Error updating document:", error);
      setToastMessage("Failed to update task. Please try again.");
      setToastVariant("danger");
      setShowToast(true);
      
      setDisableBtn(false);
      setEditScreen(false);
      setSingleValue("");
      setKeyValue(undefined);
    } finally {
      setIsUpdating(false); // End loading
    }
  }

  const CancelEdit = () => {
    setDisableBtn(false);
    setEditScreen(false);
    setSingleValue("");
    setKeyValue(undefined);
  }

  // Show loading spinner during initial load
  if (isInitialLoading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{minHeight: '100vh'}}>
        <div className="text-center">
          <Spinner animation="border" role="status" style={{width: '3rem', height: '3rem'}}>
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <h4 className="mt-3">Loading Todo Application...</h4>
        </div>
      </Container>
    );
  }

  return (
    <>
      <Container>
        <h1 className='text-center mt-5'>ToDo Application</h1>
        <div className='d-flex justify-content-center align-items-center mt-5'>
          <InputField value={(e) => { setSingleValue(e.target.value) }} remover={singleValue} />
          {EditScreen === true ? <>
            <button 
              onClick={UpdatedValue} 
              disabled={isUpdating}
              className='btn btn-primary ms-2'
            >
              {isUpdating ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Updating...
                </>
              ) : (
                'Confirm'
              )}
            </button>
            <button 
              onClick={CancelEdit} 
              disabled={isUpdating}
              className='btn btn-danger ms-2'
            >
              Cancel
            </button>
          </> : <>
            <button style={{width: '120px'}} 
              onClick={HandlerAdd}
              disabled={isAdding}
              className='btn btn-success ms-2'
            >
              {isAdding ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Adding...
                </>
              ) : (
                'Add Task'
              )}
            </button>
            <DeleteButton value={HandlerDelete} />
          </>}
        </div>

        <div className='mt-4'>
          {tasks.map((e, i) => {
            const isDeleting = deletingTaskId === e.id;
            return (
              <div className='d-flex justify-content-center align-items-center bg-color my-1' key={i}>
                <div className='h-100 px-3 py-2 m-2 border_setting'>Task {e.id}</div>
                <div className='version px-3 py-2 m-2 border_setting'>{e.data}</div>
                <div>
                  <button 
                    onClick={() => { EditTask(e.id) }} 
                    disabled={DisableBtn || isDeleting || isAdding || isUpdating} 
                    className='btn btn-primary ms-2'
                  >
                    Edit
                  </button>
                </div>
                <div>
                  <button 
                    onClick={() => { DeleteTask(e.id) }}
                    disabled={isDeleting || isAdding || isUpdating}
                    className='btn btn-danger ms-2'
                  >
                    {isDeleting ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        Deleting...
                      </>
                    ) : (
                      'Delete'
                    )}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </Container>

      {/* Toast Container */}
      <ToastContainer position="top-end" className="p-3" style={{ zIndex: 1050 }}>
        <Toast 
          show={showToast} 
          onClose={() => setShowToast(false)} 
          delay={4000} 
          autohide
          bg={toastVariant}
        >
          <Toast.Header>
            <strong className="me-auto">
              {toastVariant === "success" ? "Success" : 
               toastVariant === "danger" ? "Error" : "Warning"}
            </strong>
          </Toast.Header>
          <Toast.Body className={toastVariant === "success" || toastVariant === "danger" ? "text-white" : ""}>
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  )
}

export default App