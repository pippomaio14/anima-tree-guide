import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import PageHeader from "@/components/PageHeader";
import MobileLayout from "@/components/MobileLayout";
import { LogOut, Save } from "lucide-react";

const ProfilePage = () => {
  const { user, signOut } = useAuth();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      supabase
        .from("profiles")
        .select("full_name, phone")
        .eq("user_id", user.id)
        .maybeSingle()
        .then(({ data }) => {
          if (data) {
            setFullName(data.full_name || "");
            setPhone(data.phone || "");
          }
        });
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName, phone })
      .eq("user_id", user.id);
    if (error) toast.error("Errore nel salvataggio");
    else toast.success("Profilo aggiornato!");
    setLoading(false);
  };

  return (
    <MobileLayout>
      <PageHeader title="Il Mio Profilo" />
      <div className="p-4 space-y-6 max-w-sm mx-auto">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={user?.email || ""} disabled className="bg-muted" />
          </div>
          <div className="space-y-2">
            <Label>Nome e Cognome</Label>
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Telefono</Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
        </div>

        <div className="space-y-3">
          <Button onClick={handleSave} className="w-full gradient-forest text-primary-foreground" disabled={loading}>
            <Save className="w-4 h-4 mr-2" />
            {loading ? "Salvataggio..." : "Salva Modifiche"}
          </Button>
          <Button variant="outline" onClick={signOut} className="w-full text-destructive border-destructive/30 hover:bg-destructive/10">
            <LogOut className="w-4 h-4 mr-2" />
            Esci
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
};

export default ProfilePage;
