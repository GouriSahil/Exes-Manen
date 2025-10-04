"use client";

import { Team } from "@/types/employee";

interface TeamTableProps {
  teams: Team[];
  isProcessing: boolean;
  onEditTeam: (team: Team) => void;
  onDeleteTeam: (team: Team) => void;
}

export default function TeamTable({
  teams,
  isProcessing,
  onEditTeam,
  onDeleteTeam,
}: TeamTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-4 font-semibold text-foreground">
              Team Name
            </th>
            <th className="text-left py-3 px-4 font-semibold text-foreground">
              Description
            </th>
            <th className="text-left py-3 px-4 font-semibold text-foreground">
              Team Leader
            </th>
            <th className="text-left py-3 px-4 font-semibold text-foreground">
              Department
            </th>
            <th className="text-center py-3 px-4 font-semibold text-foreground">
              Members
            </th>
            <th className="text-left py-3 px-4 font-semibold text-foreground">
              Created
            </th>
            <th className="text-center py-3 px-4 font-semibold text-foreground">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team) => (
            <tr
              key={team.id}
              className="border-b border-border hover:bg-muted/50 transition-colors"
            >
              <td className="py-4 px-4">
                <div className="font-medium text-foreground">{team.name}</div>
              </td>
              <td className="py-4 px-4">
                <div className="text-muted-foreground max-w-xs truncate">
                  {team.description}
                </div>
              </td>
              <td className="py-4 px-4">
                <div className="text-foreground">{team.teamLeaderName}</div>
              </td>
              <td className="py-4 px-4">
                <div className="text-muted-foreground">{team.department}</div>
              </td>
              <td className="py-4 px-4 text-center">
                <div className="text-foreground font-medium">
                  {team.memberCount}
                </div>
              </td>
              <td className="py-4 px-4">
                <div className="text-muted-foreground">{team.createdAt}</div>
              </td>
              <td className="py-4 px-4">
                <div className="flex justify-center space-x-2">
                  <button
                    onClick={() => onEditTeam(team)}
                    className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-xs font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDeleteTeam(team)}
                    disabled={isProcessing}
                    className="px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs font-medium"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
