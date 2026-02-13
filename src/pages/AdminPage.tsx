import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import PageHeader from "@/components/PageHeader";
import MobileLayout from "@/components/MobileLayout";
import { Users, TreePine, Calendar, BookOpen, Shield } from "lucide-react";
import AdminTreesTab from "@/components/admin/AdminTreesTab";
import AdminEventsTab from "@/components/admin/AdminEventsTab";
import AdminArticlesTab from "@/components/admin/AdminArticlesTab";

const AdminPage = () => {
  const { isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [trees, setTrees] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [articles, setArticles] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && !isAdmin) { navigate("/"); return; }
    if (isAdmin) loadData();
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

          <TabsContent value="trees">
            <AdminTreesTab trees={trees} onReload={loadData} />
          </TabsContent>
          <TabsContent value="events">
            <AdminEventsTab events={events} onReload={loadData} />
          </TabsContent>
          <TabsContent value="articles">
            <AdminArticlesTab articles={articles} onReload={loadData} />
          </TabsContent>

          <TabsContent value="users" className="space-y-2">
            {users.map((profile) => (
              <div key={profile.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-card">
                <div>
                  <p className="text-sm font-medium text-foreground">{profile.full_name || "—"}</p>
                  <p className="text-xs text-muted-foreground">{profile.email}</p>
                  <p className="text-xs text-muted-foreground">{profile.phone}</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => toggleAdmin(profile.user_id)} className="text-xs">
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
