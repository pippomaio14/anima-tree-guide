import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import PageHeader from "@/components/PageHeader";
import MobileLayout from "@/components/MobileLayout";
import { Users, TreePine, Calendar, BookOpen, Bell } from "lucide-react";
import AdminTreesTab from "@/components/admin/AdminTreesTab";
import AdminEventsTab from "@/components/admin/AdminEventsTab";
import AdminArticlesTab from "@/components/admin/AdminArticlesTab";
import AdminUsersTab from "@/components/admin/AdminUsersTab";
import AdminAnnouncementsTab from "@/components/admin/AdminAnnouncementsTab";

const AdminPage = () => {
  const { isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [trees, setTrees] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [articles, setArticles] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && !isAdmin) { navigate("/"); return; }
    if (isAdmin) loadData();
  }, [isAdmin, loading]);

  const loadData = async () => {
    const [profilesRes, treesRes, eventsRes, articlesRes, announcementsRes] = await Promise.all([
      supabase.from("profiles").select("*"),
      supabase.from("adopted_trees").select("*").order("tree_number"),
      supabase.from("events").select("*").order("event_date", { ascending: false }),
      supabase.from("articles").select("*").order("created_at", { ascending: false }),
      supabase.from("announcements").select("*").order("created_at", { ascending: false }),
    ]);
    setUsers(profilesRes.data || []);
    setTrees(treesRes.data || []);
    setEvents(eventsRes.data || []);
    setArticles(articlesRes.data || []);
    setAnnouncements(announcementsRes.data || []);
  };

  if (loading) return null;

  return (
    <MobileLayout>
      <PageHeader title="Amministrazione" />
      <div className="p-4">
        <Tabs defaultValue="trees" className="w-full">
          <TabsList className="w-full grid grid-cols-5 mb-4">
            <TabsTrigger value="trees" className="text-xs"><TreePine className="w-3.5 h-3.5 mr-1" />Alberi</TabsTrigger>
            <TabsTrigger value="events" className="text-xs"><Calendar className="w-3.5 h-3.5 mr-1" />Eventi</TabsTrigger>
            <TabsTrigger value="articles" className="text-xs"><BookOpen className="w-3.5 h-3.5 mr-1" />Articoli</TabsTrigger>
            <TabsTrigger value="announcements" className="text-xs"><Bell className="w-3.5 h-3.5 mr-1" />Avvisi</TabsTrigger>
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
          <TabsContent value="announcements">
            <AdminAnnouncementsTab announcements={announcements} onReload={loadData} />
          </TabsContent>

          <TabsContent value="users">
            <AdminUsersTab users={users} onReload={loadData} />
          </TabsContent>
        </Tabs>
      </div>
    </MobileLayout>
  );
};

export default AdminPage;
