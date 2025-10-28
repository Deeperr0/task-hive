import { doc, deleteDoc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import Overlay from "../../ui/Overlay";
export default function DeleteTeam({
  userId,
  teamId,
  setToggleAddTeam,
  setTeamsList,
}) {
  async function handleDeleteTeam(userId, teamId) {
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists()) {
      return;
    }
    const userDocData = userDoc.data();
    const teamDocRef = doc(db, "teams", teamId);
    const teamDoc = await getDoc(teamDocRef);
    if (!teamDoc.exists()) {
      return;
    }
    const teamData = teamDoc.data();
    if (teamData.createdById == userId) {
      await deleteDoc(doc(db, "teams", teamId));
      let updatedTeams = {};
      for (const team in userDocData.teams) {
        if (team == teamId) {
          continue;
        }
        updatedTeams[team] = userDocData.teams[team];
      }
      await updateDoc(userDocRef, {
        ...userDocData,
        teams: updatedTeams,
      });
      setTeamsList((prev) => {
        const next = { ...prev };
        delete next[teamId];
        return next;
      });
    } else {
      console.log(
        "Team to be deleted was not created by user attempting to delete it."
      );
    }
  }

  return (
    <Overlay>
      <div className="py-10 flex flex-col gap-5">
        <h5>Are you sure you want to delete the team?</h5>
        <div className="flex gap-2 justify-end w-full">
          <button
            onClick={() => setToggleAddTeam(false)}
            className="bg-neutral-500/10 py-2 px-4 rounded-lg hover:bg-neutral-500/20 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            className="bg-accent-500 hover:bg-accent-600 text-customBackground py-2 px-3 rounded-lg transition-all duration-300 text-accent-50"
            onClick={() => {
              handleDeleteTeam(userId, teamId);
              setToggleAddTeam(false);
            }}
          >
            Delete Team
          </button>
        </div>
      </div>
    </Overlay>
  );
}
