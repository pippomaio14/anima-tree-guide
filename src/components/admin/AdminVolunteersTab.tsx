import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Heart } from "lucide-react";

interface AdminVolunteersTabProps {
  users: any[];
}

const AdminVolunteersTab = ({ users }: AdminVolunteersTabProps) => {
  const volunteers = users.filter((u) => u.is_volunteer);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Heart className="w-4 h-4 text-primary" />
        <h3 className="font-semibold text-sm">{volunteers.length} volontari registrati</h3>
      </div>

      {volunteers.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">Nessun volontario registrato</p>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Nome</TableHead>
                <TableHead className="text-xs">Telefono</TableHead>
                <TableHead className="text-xs">Registrato il</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {volunteers.map((v) => (
                <TableRow key={v.id}>
                  <TableCell className="text-sm font-medium">{v.full_name || "—"}</TableCell>
                  <TableCell className="text-sm">{v.phone || <Badge variant="outline" className="text-xs">Mancante</Badge>}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{new Date(v.created_at).toLocaleDateString("it-IT")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default AdminVolunteersTab;
