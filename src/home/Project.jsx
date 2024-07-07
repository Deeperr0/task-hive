import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import Tasks from "./Tasks";
import "./Project.css";

export default function Project({ user, role }) {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        let tasksQuery;
        if (role === "admin") {
          console.log("Fetching tasks for admin");
          tasksQuery = collection(db, "tasks");
        } else {
          console.log("Fetching tasks for user:", user.uid);
          tasksQuery = query(
            collection(db, "tasks"),
            where("ownerUid", "==", user.uid)
          );
        }
        const tasksSnapshot = await getDocs(tasksQuery);
        const tasksList = tasksSnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setTasks(tasksList);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await fetch(
          " https://17a5-46-186-203-187.ngrok-free.app/users"
        ); // Replace with your ngrok URL
        const text = await response.text();
        console.log("Response text:", text); // Log the raw response text
        const usersList = JSON.parse(text);
        console.log("Fetched users:", usersList);
        setUsers(usersList);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchTasks();
    fetchUsers();
  }, [user, role]);

  if (loading) {
    return <p>Loading tasks...</p>;
  }

  const addTask = async () => {
    if (role !== "admin") return; // Ensure only admin can add tasks
    const newTask = {
      content: "New Task",
      owner: user.email,
      ownerUid: user.uid,
      status: "Not started",
      deadline: new Date().toISOString().split("T")[0],
      priority: "Normal",
      notes: "",
      lastUpdated: new Date().toISOString(),
    };
    const docRef = await addDoc(collection(db, "tasks"), newTask);
    setTasks([...tasks, { ...newTask, id: docRef.id }]);
  };

  const updateStatus = async (taskId, newStatus) => {
    const taskDocRef = doc(db, "tasks", taskId);
    await updateDoc(taskDocRef, {
      status: newStatus,
      lastUpdated: new Date().toISOString(),
    });
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  const updateDeadline = async (taskId, newDeadline) => {
    const taskDocRef = doc(db, "tasks", taskId);
    await updateDoc(taskDocRef, {
      deadline: newDeadline,
      lastUpdated: new Date().toISOString(),
    });
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, deadline: newDeadline } : task
      )
    );
  };

  const updatePriority = async (taskId, newPriority) => {
    const taskDocRef = doc(db, "tasks", taskId);
    await updateDoc(taskDocRef, {
      priority: newPriority,
      lastUpdated: new Date().toISOString(),
    });
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, priority: newPriority } : task
      )
    );
  };

  const updateContent = async (taskId, newContent) => {
    const taskDocRef = doc(db, "tasks", taskId);
    await updateDoc(taskDocRef, {
      content: newContent,
      lastUpdated: new Date().toISOString(),
    });
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, content: newContent } : task
      )
    );
  };

  const updateOwner = async (taskId, newOwnerEmail) => {
    const user = users.find((u) => u.email === newOwnerEmail);
    if (user) {
      const taskDocRef = doc(db, "tasks", taskId);
      await updateDoc(taskDocRef, {
        owner: newOwnerEmail,
        ownerUid: user.uid,
        lastUpdated: new Date().toISOString(),
      });
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId
            ? { ...task, owner: newOwnerEmail, ownerUid: user.uid }
            : task
        )
      );
    } else {
      console.error("No user found with email:", newOwnerEmail);
    }
  };

  const updateNotes = async (taskId, newNotes) => {
    const taskDocRef = doc(db, "tasks", taskId);
    await updateDoc(taskDocRef, {
      notes: newNotes,
      lastUpdated: new Date().toISOString(),
    });
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, notes: newNotes } : task
      )
    );
  };

  const deleteTask = async (taskId) => {
    const taskDocRef = doc(db, "tasks", taskId);
    await deleteDoc(taskDocRef);
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

  return (
    <div className="project">
      <h2 className="project-title">Project Tasks</h2>
      {role === "admin" && (
        <button onClick={addTask} className="add-button">
          New task
        </button>
      )}
      <Tasks
        name="To do"
        tasksList={tasks.filter((task) => task.status !== "Done")}
        updateStatus={updateStatus}
        updateDeadline={updateDeadline}
        updatePriority={updatePriority}
        updateContent={updateContent}
        updateOwner={updateOwner}
        updateNotes={updateNotes}
        deleteTask={deleteTask}
        role={role}
        users={users} // Pass users list to Tasks component
        currentUserUid={user.uid} // Pass current user UID to Tasks component
      />
      <Tasks
        name="Done"
        tasksList={tasks.filter((task) => task.status === "Done")}
        updateStatus={updateStatus}
        updateDeadline={updateDeadline}
        updatePriority={updatePriority}
        updateContent={updateContent}
        updateOwner={updateOwner}
        updateNotes={updateNotes}
        deleteTask={deleteTask}
        role={role}
        users={users} // Pass users list to Tasks component
        currentUserUid={user.uid} // Pass current user UID to Tasks component
      />
    </div>
  );
}
