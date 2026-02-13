import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Shield, Trash2, Pencil, X, Check, KeyRound } from "lucide-react";

interface AdminUsersTabProps {
  users: any[];
  onReload: () => void;
}

const AdminUsersTab = ({ users, onReload }: AdminUsersTabProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});
  const [passwordId, setPasswordId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");

  const toggleAdmin = async (userId: string) => {
    const { data: existing } = await supabase.from("user_roles").select("id").eq("user_id", userId).eq("role", "admin");
    if (existing && existing.length > 0) {
      await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", "admin");
      toast.success("Ruolo admin rimosso");
    } else {
      await supabase.from("user_roles").insert({ user_id: userId, role: "admin" });
      toast.success("Ruolo admin assegnato");
    }
    onReload();
  };

  const startEdit = (profile: any) => {
    setEditingId(profile.user_id);
    setEditData({ full_name: profile.full_name || "", email: profile.email || "", phone: profile.phone || "" });
  };

  const saveEdit = async () => {
    if (!editingId) return;
    const { data, error } = await supabase.functions.invoke("admin-users", {
      body: { action: "update_profile", user_id: editingId, ...editData },
    });
    if (error || data?.error) toast.error(data?.error || error?.message);
    else { toast.success("Profilo aggiornato!"); setEditingId(null); onReload(); }
  };

  const savePassword = async () => {
    if (!passwordId || !newPassword) return;
    const { data, error } = await supabase.functions.invoke("admin-users", {
      body: { action: "update_password", user_id: passwordId, password: newPassword },
    });
    if (error || data?.error) toast.error(data?.error || error?.message);
    else { toast.success("Password aggiornata!"); setPasswordId(null); setNewPassword(""); }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm("Sei sicuro di voler eliminare questo utente?")) return;
    const { data, error } = await supabase.functions.invoke("admin-users", {
      body: { action: "delete_user", user_id: userId },
    });
    if (error || data?.error) toast.error(data?.error || error?.message);
    else { toast.success("Utente eliminato!"); onReload(); }
  };

  return (
    <div className="space-y-2">
      {users.map((profile) => (
        <div key={profile.id} className="rounded-lg border border-border bg-card p-3 space-y-2">
          {editingId === profile.user_id ? (
            <>
              <Input placeholder="Nome completo" value={editData.full_name} onChange={(e) => setEditData({ ...editData, full_name: e.target.value })} />
              <Input placeholder="Email" value={editData.email} onChange={(e) => setEditData({ ...editData, email: e.target.value })} />
              <Input placeholder="Telefono" value={editData.phone} onChange={(e) => setEditData({ ...editData, phone: e.target.value })} />
              <div className="flex gap-2">
                <Button size="sm" onClick={saveEdit} className="flex-1"><Check className="w-3 h-3 mr-1" />Salva</Button>
                <Button size="sm" variant="outline" onClick={() => setEditingId(null)} className="flex-1"><X className="w-3 h-3 mr-1" />Annulla</Button>
              </div>
            </>
          ) : passwordId === profile.user_id ? (
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Nuova password per {profile.full_name || profile.email}</p>
              <Input type="password" placeholder="Nuova password (min 6 car.)" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
              <div className="flex gap-2">
                <Button size="sm" onClick={savePassword} className="flex-1"><Check className="w-3 h-3 mr-1" />Salva</Button>
                <Button size="sm" variant="outline" onClick={() => { setPasswordId(null); setNewPassword(""); }} className="flex-1"><X className="w-3 h-3 mr-1" />Annulla</Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{profile.full_name || "—"}</p>
                <p className="text-xs text-muted-foreground truncate">{profile.email}</p>
                {profile.phone && <p className="text-xs text-muted-foreground">{profile.phone}</p>}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => toggleAdmin(profile.user_id)} title="Toggle Admin">
                  <Shield className="w-3.5 h-3.5" />
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setPasswordId(profile.user_id)} title="Cambia Password">
                  <KeyRound className="w-3.5 h-3.5" />
                </Button>
                <button onClick={() => startEdit(profile)} className="text-muted-foreground p-1 hover:text-foreground" title="Modifica">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => deleteUser(profile.user_id)} className="text-destructive p-1" title="Elimina">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AdminUsersTab;
