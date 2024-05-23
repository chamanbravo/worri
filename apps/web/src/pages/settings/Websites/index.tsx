import { Separator } from "@ui/index";
import { useParams } from "react-router";
import WebsitesTable from "./WebsitesTable";
import WebsiteEditForm from "./WebsiteEditForm";

export default function Websites() {
  const { id } = useParams();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Websites</h3>
        <p className="text-sm text-muted-foreground">
          Update the websites setting
        </p>
      </div>
      <Separator />

      {id ? <WebsiteEditForm /> : <WebsitesTable />}
    </div>
  );
}
