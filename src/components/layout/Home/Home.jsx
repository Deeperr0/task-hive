import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faClose } from "@fortawesome/free-solid-svg-icons";
import { lazy, useState, useEffect } from "react";
import { useSignals } from "@preact/signals-react/runtime";
import Features from "../Features";
const LazyProject = lazy(() => import("../Project"));
const LazySideMenu = lazy(() => import("../../ui/SideMenu"));
import Footer from "../../ui/Footer";
import Navbar from "../Navbar";
import AddTeam from "../../teams/AddTeam";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import Dashboard from "../Dashboard";

export default function Home({
  currentTab,
  setCurrentTab,
  user,
  userData,
  toggleMenu,
}) {
  useSignals();
  const [toggleAddTeam, setToggleAddTeam] = useState(false);
  const [teamsList, setTeamsList] = useState({});

  async function getTeam(teamId) {
    const teamDocRef = doc(db, "teams", teamId);
    const teamDoc = await getDoc(teamDocRef);
    const data = teamDoc?.data();
    return data ? { ...data, teamId } : null;
  }
  useEffect(() => {
    async function fetchTeams() {
      if (!userData?.teams) return;

      const entries = await Promise.all(
        Object.keys(userData?.teams).map(async (teamId) => {
          const teamData = await getTeam(teamId);
          return [teamId, teamData];
        })
      );

      const mapObj = entries.reduce((acc, [id, data]) => {
        if (data) acc[id] = data;
        return acc;
      }, {});

      setTeamsList(mapObj);
    }

    fetchTeams();
  }, [userData?.teams]);

  return (
    <div className="h-full">
      {!user ? (
        <>
          <Navbar />
          <div className="h-[calc(100vh-6rem)] overflow-hidden bg-[url('/home/hero-banner.webp')] bg-cover bg-center relative mb-10">
            <div className="relative z-10 flex flex-col items-center justify-center gap-6 text-white w-10/12 h-full mx-auto text-center">
              <h1 className="font-bold  text-7xl">
                Streamline Teamwork with TaskHive
              </h1>
              <h5 className="w-2/3 text-neutral-300">
                Manage projects, assign tasks, and track progress effortlessly.
                TaskHive adapts to your team's needs, whether you're a small
                team or a large organization.
              </h5>
              <button className="bg-accent-500 px-6 py-3 rounded-xl text-xl hover:bg-accent-550 transition-all duration-300">
                Get started for free
              </button>
            </div>
            <div className="absolute w-full h-full bg-linear-to-t from-black/80 to-black/10 top-0 left-0"></div>
          </div>
          <Features />
          <div className="text-black py-10">
            <h2 className="text-center">Visualize Your Workflow</h2>
            <p className="text-center mt-6 mb-14 text-xl">
              Gain a clear understanding of project progress and team workload
              with intuitive visualizations.
            </p>
            <div className="grid grid-cols-2 h-120 px-40 gap-10">
              <div className="flex flex-col">
                <div className="mb-6 shadow-lg shadow-black/40 h-5/6 overflow-hidden bg-[url('/about-us/about-us.webp')] bg-cover bg-center w-full rounded-xl"></div>
                <h5 className="mb-2">Project dashboards</h5>
                <p>
                  Monitor project timelines, task completion rates, and team
                  performance at a glance
                </p>
              </div>
              <div className="flex flex-col">
                <div className="mb-6 shadow-lg shadow-black/40 h-5/6 overflow-hidden bg-[url('/home/hero-banner.webp')] bg-cover bg-center w-full rounded-xl"></div>
                <h5 className="mb-2">Team collaboration</h5>
                <p>
                  Facilitate seamless collaboration with real-time updates,
                  comments, and file sharing
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-8 py-40 w-1/2 mx-auto text-center">
            <h3 className="!text-6xl font-semibold text-black ">
              Ready to boost your team's productivity?
            </h3>
            <p className="text-2xl text-neutral-600">
              Sign up for TaskHive today and experience a new level of project
              management efficiency.
            </p>
            <button className="bg-accent-500 px-10 py-4 rounded-xl text-xl mt-3 font-medium hover:bg-accent-550 transition-all duration-300">
              Start your free trial
            </button>
          </div>
          <Footer />
        </>
      ) : (
        <>
          <div className="flex items-start h-full">
            <div
              className={
                toggleMenu.value == "true"
                  ? "flex flex-col gap-4 fixed top-0 left-0 px-10 md:px-5 pt-10 w-screen h-screen z-30 "
                  : "py-8 border-r border-neutral-250 px-8 text-base self-stretch hidden md:block w-80"
              }
            >
              <div className="md:hidden">
                <FontAwesomeIcon
                  icon={faClose}
                  className="text-xl"
                  onClick={() => {
                    toggleMenu.value = "false";
                  }}
                />
              </div>
              <div>
                {toggleAddTeam && (
                  <AddTeam setToggleAddTeam={setToggleAddTeam} />
                )}
              </div>
              <LazySideMenu
                setToggleAddTeam={setToggleAddTeam}
                currentTab={currentTab}
                user={user}
                setCurrentTab={setCurrentTab}
              />
            </div>
            <div className="w-full text-black">
              <div className="border-b border-neutral-250 flex justify-end items-center gap-5 px-8 py-5">
                <FontAwesomeIcon icon={faBell} className="text-2xl" />
                {userData?.firstName[0] && userData?.lastName[0] && (
                  <div className="w-10 h-10 rounded-full bg-accent-500 flex items-center justify-center text-white text-xl font-medium">
                    {userData?.firstName[0].toUpperCase() +
                      userData?.lastName[0].toUpperCase()}
                  </div>
                )}
              </div>
              <div className="px-8">
                {currentTab == "home" ? (
                  <Dashboard teams={teamsList} setTeamsList={setTeamsList} />
                ) : currentTab == "team-tasks" ? (
                  <LazyProject
                    teamsList={teamsList}
                    setTeamsList={setTeamsList}
                    user={user}
                    userData={userData}
                  />
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

Home.propTypes = {
  user: PropTypes.object,
  userData: PropTypes.object,
  toggleMenu: PropTypes.object,
};
