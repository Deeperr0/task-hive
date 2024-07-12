import { faCalendarCheck } from "@fortawesome/free-regular-svg-icons";
import {
  faCaretDown,
  faCaretRight,
  faEllipsis,
  faFilter,
  faHome,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
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
import { db } from "./firebase";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import "./SideMenu.css";
import filterIcon from "./Filter-outline.svg";
import { useEffect } from "react";

export default function SideMenu(props) {
  const [currentWorkSpace, setCurrentWorkSpace] = useState(1);
  const [expandWorkSpace, setExpandWorkSpace] = useState(false);
  const [usersList, setUsersList] = useState([]);
  const [teams, setTeams] = useState([]);
  console.log("CURRENT USER IN SIDE MENU:", props.user);
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        let usersQuery = collection(db, "users");
        const usersSnapshot = await getDocs(usersQuery);
        usersSnapshot.docs.map((doc) => {
          if (doc.data().email === props.user.email) {
            console.log(doc.data().teams);
          }
        });
        // usersSnapshot.docs.map((doc) => {
        // 	if(doc.)
        // });
        // setTasks(tasksList);
        // setFilteredTasks(tasksList);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
      //   finally {
      //     // setLoading(false);
      //   }
    };

    const fetchUsers = async () => {
      try {
        const response = await fetch(
          "https://luckily-resolved-lamb.ngrok-free.app/users"
        );
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
  }, []);
  const workspaces = [
    {
      id: 1,
      name: "Personal",
      subWorkSpaces: [
        {
          id: 1,
          name: "Digital planner",
        },
        {
          id: 2,
          name: "Tower cranes",
        },
      ],
    },
    {
      id: 2,
      name: "Work",
      subWorkSpaces: [
        {
          id: 1,
          name: "Business",
        },
        {
          id: 2,
          name: "Plan",
        },
      ],
    },
  ];
  return (
    <div className="side-menu-container">
      <ul className="side-menu">
        <li>
          <FontAwesomeIcon icon={faHome} />
          Home
        </li>
        <li>
          <FontAwesomeIcon icon={faCalendarCheck} />
          Projects
        </li>
      </ul>
      <hr />
      <div className="workspace-menu">
        <select onChange={(e) => setCurrentWorkSpace(e.target.value)}>
          {workspaces.map((workspace) => (
            <option value={workspace.id} key={workspace.id}>
              {workspace.name}
            </option>
          ))}
        </select>
        <button>
          <FontAwesomeIcon icon={faEllipsis} />
        </button>
      </div>
      <div className="workspace-filter">
        <div className="search">
          <input type="text" />
          <button>
            <img src={filterIcon} />
          </button>
        </div>
        <button>
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>
      <div className="workspace-sub-menu">
        <div className="workspace">
          {expandWorkSpace ? (
            <FontAwesomeIcon icon={faCaretDown} />
          ) : (
            <FontAwesomeIcon icon={faCaretRight} />
          )}
          {workspaces.map(
            (workspace) =>
              workspace.id == currentWorkSpace && (
                <div
                  key={workspace.id}
                  className={currentWorkSpace === workspace.id ? "active" : ""}
                  onClick={() => {
                    setCurrentWorkSpace(workspace.id);
                    setExpandWorkSpace(!expandWorkSpace);
                  }}
                >
                  {workspace.name}
                </div>
              )
          )}
        </div>
        <div className="sub-workspace">
          <ul>
            {workspaces[currentWorkSpace - 1].subWorkSpaces.map(
              (subWorkSpace) => (
                <li key={subWorkSpace.id}>{subWorkSpace.name}</li>
              )
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
