import { CurrentUserContext } from "../../../App";
import { useContext, useState } from "react";
import DeleteTeam from "../../teams/DeleteTeam/DeleteTeam";
import { fmtDate } from "../../../utils/manageDates";

export default function Dashboard({ teams, setTeamsList }) {
  const { user } = useContext(CurrentUserContext);
  const [toggleDeleteTeam, setToggleDeleteTeam] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState(null);

  return (
    <div className="flex flex-col py-10">
      {toggleDeleteTeam && (
        <DeleteTeam
          teamId={selectedTeamId}
          setToggleAddTeam={setToggleDeleteTeam}
          userId={user.uid}
          setTeamsList={setTeamsList}
        />
      )}
      <h2>Dashboard</h2>
      <p>Oversee all teams and activities across the application</p>
      <div className="mt-5">
        <h5>All Teams</h5>
        <div className="mt-5 w-full rounded-2xl border border-neutral-300/30 overflow-hidden [&_tr]:border-t [&_tr]:border-neutral-300/30">
          <table className="w-full text-left [&_th]:py-4 [&_td]:py-4 [&_th]:px-4 [&_td]:px-4">
            <colgroup>
              <col span={1} style={{ width: "20%" }} />
              <col span={1} style={{ width: "20%" }} />
              <col span={1} style={{ width: "20%" }} />
              <col span={1} style={{ width: "20%" }} />
              <col span={1} style={{ width: "20%" }} />
            </colgroup>
            <thead>
              <tr>
                <th>Team Name</th>
                <th>Members</th>
                <th>Active Tasks</th>
                <th>Creation Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(teams).map((teamId) => (
                <tr key={teamId}>
                  <td>{teams[teamId].teamName}</td>
                  <td>{teams[teamId].teamMembers.length}</td>
                  <td>{teams[teamId].tasks.length}</td>
                  <td>{fmtDate(teams[teamId].created)}</td>
                  <td className="flex gap-2 font-medium">
                    <button className="text-accent-500 hover:text-accent-400 duration-200 transition-colors">
                      Manage
                    </button>
                    <button
                      onClick={() => {
                        setSelectedTeamId(teamId);
                        setToggleDeleteTeam(true);
                      }}
                      className="text-danger hover:text-danger/60 duration-200 transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
