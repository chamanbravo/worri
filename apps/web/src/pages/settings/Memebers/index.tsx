import { Separator } from "@ui/index";
import { useParams } from "react-router";
import MembersTable from "./MembersTable";
import MemebersEditForm from "./MembersEditForm";

export default function Members() {
  const { username } = useParams();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Members</h3>
        <p className="text-sm text-muted-foreground">
          Update the members settings
        </p>
      </div>
      <Separator />

      {username ? <MemebersEditForm /> : <MembersTable />}
    </div>
  );
}
