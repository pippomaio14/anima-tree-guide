import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { sanitizeHtml } from "@/lib/sanitize";
import PageHeader from "@/components/PageHeader";
import MobileLayout from "@/components/MobileLayout";
import { TreePine, Target, Heart, Globe, Leaf, Sun, Mountain, Flower2 } from "lucide-react";
import { motion } from "framer-motion";

const ICON_MAP: Record<string, any> = { TreePine, Target, Heart, Globe, Leaf, Sun, Mountain, Flower2 };

const ParkInfoPage = () => {
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("park_sections")
      .select("*")
      .eq("published", true)
      .order("sort_order")
      .then(({ data }) => {
        setSections(data || []);
        setLoading(false);
      });
  }, []);

  if (loading) return <MobileLayout><PageHeader title="Il Parco" showBack /><div className="p-4 text-center text-muted-foreground text-sm">Caricamento...</div></MobileLayout>;

  return (
    <MobileLayout>
      <PageHeader title="Il Parco" showBack />
      <div className="p-4 space-y-4">
        {sections.map((section, i) => {
          const IconComponent = ICON_MAP[section.icon] || TreePine;
          return (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl border border-border bg-card p-4"
            >
              {section.image_url && (
                <img src={section.image_url} alt={section.title} className="w-full h-40 object-cover rounded-lg mb-3" />
              )}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg gradient-forest flex items-center justify-center">
                  <IconComponent className="w-5 h-5 text-primary-foreground" />
                </div>
                <h2 className="font-display font-semibold text-foreground">{section.title}</h2>
              </div>
              <div className="text-sm text-muted-foreground leading-relaxed rich-content" dangerouslySetInnerHTML={{ __html: sanitizeHtml(section.content) }} />
            </motion.div>
          );
        })}
        {sections.length === 0 && (
          <p className="text-center text-muted-foreground text-sm py-8">Nessun contenuto disponibile</p>
        )}
      </div>
    </MobileLayout>
  );
};

export default ParkInfoPage;
