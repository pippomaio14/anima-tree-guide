import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { sanitizeHtml } from "@/lib/sanitize";
import { BookOpen } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import MobileLayout from "@/components/MobileLayout";
import { motion } from "framer-motion";

const ArticlesPage = () => {
  const [articles, setArticles] = useState<any[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    supabase.from("articles").select("*").eq("published", true).order("created_at", { ascending: false }).then(({ data }) => {
      setArticles(data || []);
    });
  }, []);

  return (
    <MobileLayout>
      <PageHeader title="Letture & Articoli" />
      <div className="p-4 space-y-3">
        {articles.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 mx-auto text-primary/30 mb-3" />
            <p className="text-muted-foreground">Nessun articolo disponibile</p>
          </div>
        )}
        {articles.map((article) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-border bg-card overflow-hidden"
            onClick={() => setSelected(selected === article.id ? null : article.id)}
          >
            {article.image_url && (
              <img src={article.image_url} alt={article.title} className="w-full h-40 object-cover" />
            )}
            <div className="p-4">
              <span className="text-[10px] uppercase tracking-wider text-accent font-semibold">
                {article.category}
              </span>
              <h3 className="font-display font-semibold text-foreground mt-1">{article.title}</h3>
              {selected === article.id && article.content && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  className="mt-3 pt-3 border-t border-border"
                >
                  <div className="prose prose-sm max-w-none text-muted-foreground rich-content" dangerouslySetInnerHTML={{ __html: sanitizeHtml(article.content) }} />
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </MobileLayout>
  );
};

export default ArticlesPage;
