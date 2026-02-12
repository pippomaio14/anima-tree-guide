import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import PageHeader from "@/components/PageHeader";
import MobileLayout from "@/components/MobileLayout";
import { Users, TreePine, Calendar, BookOpen, Upload, Plus, Shield, Trash2 } from "lucide-react";

const AdminPage = () => {
  const { isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [trees, setTrees] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [articles, setArticles] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate("/");
      return;
    }
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin, loading]);

  const loadData = async () => {
    const [profilesRes, treesRes, eventsRes, articlesRes] = await Promise.all([
      supabase.from("profiles").select("*"),
      supabase.from("adopted_trees").select("*").order("tree_number"),
      supabase.from("events").select("*").order("event_date", { ascending: false }),
      supabase.from("articles").select("*").order("created_at", { ascending: false }),
    ]);
    setUsers(profilesRes.data || []);
    setTrees(treesRes.data || []);
    setEvents(eventsRes.data || []);
    setArticles(articlesRes.data || []);
  };

  // CSV import
  const handleCSVImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const lines = text.split("\n").filter((l) => l.trim());
    if (lines.length < 2) {
      toast.error("File vuoto o formato non valido");
      return;
    }
    const headers = lines[0].split(/[,;]/).map((h) => h.trim().toLowerCase());
    const rows = lines.slice(1).map((line) => {
      const vals = line.split(/[,;]/).map((v) => v.trim());
      const row: any = {};
      headers.forEach((h, i) => {
        if (h.includes("numero") || h === "number") row.tree_number = vals[i] || "";
        else if (h.includes("adottante") || h.includes("adopter")) row.adopter_name = vals[i] || "";
        else if (h.includes("dedicat") && !h.includes("messag")) row.dedicated_to = vals[i] || null;
        else if (h.includes("dedica") || h.includes("messag")) row.dedication_message = vals[i] || null;
        else if (h.includes("periodo") || h.includes("period")) row.adoption_period = vals[i] || null;
      });
      return row;
    }).filter((r) => r.tree_number && r.adopter_name);

    if (rows.length === 0) {
      toast.error("Nessun dato valido trovato nel file");
      return;
    }

    const { error } = await supabase.from("adopted_trees").insert(rows);
    if (error) toast.error("Errore nell'importazione: " + error.message);
    else {
      toast.success(`${rows.length} alberi importati con successo!`);
      loadData();
    }
  };

  // Add new tree
  const [newTree, setNewTree] = useState({ tree_number: "", adopter_name: "", dedicated_to: "", dedication_message: "", adoption_period: "", tree_species: "" });
  const addTree = async () => {
    if (!newTree.tree_number || !newTree.adopter_name) {
      toast.error("Numero e adottante sono obbligatori");
      return;
    }
    const { error } = await supabase.from("adopted_trees").insert([newTree]);
    if (error) toast.error(error.message);
    else {
      toast.success("Albero aggiunto!");
      setNewTree({ tree_number: "", adopter_name: "", dedicated_to: "", dedication_message: "", adoption_period: "", tree_species: "" });
      loadData();
    }
  };

  // Add new event
  const [newEvent, setNewEvent] = useState({ title: "", description: "", event_date: "", location: "", booking_enabled: false });
  const addEvent = async () => {
    if (!newEvent.title || !newEvent.event_date) {
      toast.error("Titolo e data sono obbligatori");
      return;
    }
    const { error } = await supabase.from("events").insert([newEvent]);
    if (error) toast.error(error.message);
    else {
      toast.success("Evento creato!");
      setNewEvent({ title: "", description: "", event_date: "", location: "", booking_enabled: false });
      loadData();
    }
  };

  // Add new article
  const [newArticle, setNewArticle] = useState({ title: "", content: "", category: "article" });
  const addArticle = async () => {
    if (!newArticle.title) {
      toast.error("Il titolo è obbligatorio");
      return;
    }
    const { error } = await supabase.from("articles").insert([newArticle]);
    if (error) toast.error(error.message);
    else {
      toast.success("Articolo pubblicato!");
      setNewArticle({ title: "", content: "", category: "article" });
      loadData();
    }
  };

  // Toggle admin
  const toggleAdmin = async (userId: string) => {
    const { data: existing } = await supabase.from("user_roles").select("id").eq("user_id", userId).eq("role", "admin");
    if (existing && existing.length > 0) {
      await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", "admin");
      toast.success("Ruolo admin rimosso");
    } else {
      await supabase.from("user_roles").insert({ user_id: userId, role: "admin" });
      toast.success("Ruolo admin assegnato");
    }
    loadData();
  };

  // Delete items
  const deleteTree = async (id: string) => {
    await supabase.from("adopted_trees").delete().eq("id", id);
    toast.success("Albero eliminato");
    loadData();
  };
  const deleteEvent = async (id: string) => {
    await supabase.from("events").delete().eq("id", id);
    toast.success("Evento eliminato");
    loadData();
  };
  const deleteArticle = async (id: string) => {
    await supabase.from("articles").delete().eq("id", id);
    toast.success("Articolo eliminato");
    loadData();
  };

  if (loading) return null;

  return (
    <MobileLayout>
      <PageHeader title="Amministrazione" />
      <div className="p-4">
        <Tabs defaultValue="trees" className="w-full">
          <TabsList className="w-full grid grid-cols-4 mb-4">
            <TabsTrigger value="trees" className="text-xs"><TreePine className="w-3.5 h-3.5 mr-1" />Alberi</TabsTrigger>
            <TabsTrigger value="events" className="text-xs"><Calendar className="w-3.5 h-3.5 mr-1" />Eventi</TabsTrigger>
            <TabsTrigger value="articles" className="text-xs"><BookOpen className="w-3.5 h-3.5 mr-1" />Articoli</TabsTrigger>
            <TabsTrigger value="users" className="text-xs"><Users className="w-3.5 h-3.5 mr-1" />Utenti</TabsTrigger>
          </TabsList>

          {/* TREES TAB */}
          <TabsContent value="trees" className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-4 space-y-3">
              <h3 className="font-semibold flex items-center gap-2"><Upload className="w-4 h-4" /> Importa CSV/Excel</h3>
              <p className="text-xs text-muted-foreground">Colonne: numero, adottante, dedicato_a, dedica, periodo</p>
              <Input type="file" accept=".csv,.txt" onChange={handleCSVImport} />
            </div>
            <div className="rounded-xl border border-border bg-card p-4 space-y-3">
              <h3 className="font-semibold flex items-center gap-2"><Plus className="w-4 h-4" /> Nuovo Albero</h3>
              <div className="grid grid-cols-2 gap-2">
                <Input placeholder="Numero" value={newTree.tree_number} onChange={(e) => setNewTree({ ...newTree, tree_number: e.target.value })} />
                <Input placeholder="Adottante" value={newTree.adopter_name} onChange={(e) => setNewTree({ ...newTree, adopter_name: e.target.value })} />
                <Input placeholder="Dedicato a" value={newTree.dedicated_to} onChange={(e) => setNewTree({ ...newTree, dedicated_to: e.target.value })} />
                <Input placeholder="Specie" value={newTree.tree_species} onChange={(e) => setNewTree({ ...newTree, tree_species: e.target.value })} />
              </div>
              <Input placeholder="Dedica" value={newTree.dedication_message} onChange={(e) => setNewTree({ ...newTree, dedication_message: e.target.value })} />
              <Input placeholder="Periodo adozione" value={newTree.adoption_period} onChange={(e) => setNewTree({ ...newTree, adoption_period: e.target.value })} />
              <Button onClick={addTree} className="gradient-forest text-primary-foreground w-full">Aggiungi Albero</Button>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Alberi ({trees.length})</h3>
              {trees.map((tree) => (
                <div key={tree.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-card text-sm">
                  <div>
                    <span className="font-mono text-xs text-primary">#{tree.tree_number}</span>
                    <span className="ml-2 text-foreground">{tree.adopter_name}</span>
                  </div>
                  <button onClick={() => deleteTree(tree.id)} className="text-destructive p-1"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* EVENTS TAB */}
          <TabsContent value="events" className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-4 space-y-3">
              <h3 className="font-semibold flex items-center gap-2"><Plus className="w-4 h-4" /> Nuovo Evento</h3>
              <Input placeholder="Titolo" value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} />
              <Textarea placeholder="Descrizione" value={newEvent.description} onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })} />
              <Input type="datetime-local" value={newEvent.event_date} onChange={(e) => setNewEvent({ ...newEvent, event_date: e.target.value })} />
              <Input placeholder="Luogo" value={newEvent.location} onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })} />
              <div className="flex items-center gap-2">
                <Switch checked={newEvent.booking_enabled} onCheckedChange={(c) => setNewEvent({ ...newEvent, booking_enabled: c })} />
                <Label className="text-sm">Abilita prenotazioni</Label>
              </div>
              <Button onClick={addEvent} className="gradient-forest text-primary-foreground w-full">Crea Evento</Button>
            </div>
            <div className="space-y-2">
              {events.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-card text-sm">
                  <span className="text-foreground">{event.title}</span>
                  <button onClick={() => deleteEvent(event.id)} className="text-destructive p-1"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* ARTICLES TAB */}
          <TabsContent value="articles" className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-4 space-y-3">
              <h3 className="font-semibold flex items-center gap-2"><Plus className="w-4 h-4" /> Nuovo Articolo</h3>
              <Input placeholder="Titolo" value={newArticle.title} onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })} />
              <Textarea placeholder="Contenuto" rows={5} value={newArticle.content} onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })} />
              <Input placeholder="Categoria (es: articolo, lettura, gioco)" value={newArticle.category} onChange={(e) => setNewArticle({ ...newArticle, category: e.target.value })} />
              <Button onClick={addArticle} className="gradient-forest text-primary-foreground w-full">Pubblica</Button>
            </div>
            <div className="space-y-2">
              {articles.map((article) => (
                <div key={article.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-card text-sm">
                  <span className="text-foreground">{article.title}</span>
                  <button onClick={() => deleteArticle(article.id)} className="text-destructive p-1"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* USERS TAB */}
          <TabsContent value="users" className="space-y-2">
            {users.map((profile) => (
              <div key={profile.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-card">
                <div>
                  <p className="text-sm font-medium text-foreground">{profile.full_name || "—"}</p>
                  <p className="text-xs text-muted-foreground">{profile.email}</p>
                  <p className="text-xs text-muted-foreground">{profile.phone}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleAdmin(profile.user_id)}
                  className="text-xs"
                >
                  <Shield className="w-3 h-3 mr-1" /> Admin
                </Button>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </MobileLayout>
  );
};

export default AdminPage;
