import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { sanitizeHtml } from "@/lib/sanitize";
import PageHeader from "@/components/PageHeader";
import MobileLayout from "@/components/MobileLayout";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const LegalPage = () => {
  const { slug } = useParams();
  const [page, setPage] = useState<{ title: string; content: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    supabase
      .from("legal_pages")
      .select("title, content")
      .eq("slug", slug)
      .maybeSingle()
      .then(({ data }) => {
        setPage(data);
        setLoading(false);
      });
  }, [slug]);

  return (
    <MobileLayout>
      <PageHeader title={page?.title || "Informativa"} />
      <div className="p-4 space-y-4">
        <Button asChild variant="ghost" size="sm">
          <Link to="/register"><ArrowLeft className="w-4 h-4 mr-1" /> Torna indietro</Link>
        </Button>
        {loading ? (
          <p className="text-muted-foreground">Caricamento...</p>
        ) : page ? (
          <article
            className="prose prose-sm max-w-none prose-headings:font-display prose-headings:text-foreground prose-p:text-foreground/90 prose-li:text-foreground/90"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(page.content) }}
          />
        ) : (
          <p className="text-muted-foreground">Pagina non trovata.</p>
        )}
      </div>
    </MobileLayout>
  );
};

export default LegalPage;
