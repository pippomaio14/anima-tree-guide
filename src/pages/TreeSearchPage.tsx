import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Search, MapPin, TreePine, Heart } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import MobileLayout from "@/components/MobileLayout";
import { motion, AnimatePresence } from "framer-motion";
import TreeMapDialog from "@/components/TreeMapDialog";

interface AdoptedTree {
  id: string;
  tree_number: string;
  adopter_name: string;
  dedicated_to: string | null;
  dedication_message: string | null;
  adoption_period: string | null;
  tree_species: string | null;
  latitude: number | null;
  longitude: number | null;
}

const TreeSearchPage = () => {
  const [query, setQuery] = useState("");
  const [trees, setTrees] = useState<AdoptedTree[]>([]);
  const [selected, setSelected] = useState<AdoptedTree | null>(null);
  const [mapTree, setMapTree] = useState<AdoptedTree | null>(null);

  useEffect(() => {
    if (query.length < 2) {
      setTrees([]);
      return;
    }
    const search = async () => {
      const searchTerm = `%${query}%`;
      const { data } = await supabase
        .from("adopted_trees")
        .select("*")
        .or(`adopter_name.ilike.${searchTerm},dedicated_to.ilike.${searchTerm},tree_number.ilike.${searchTerm},dedication_message.ilike.${searchTerm},tree_species.ilike.${searchTerm}`)
        .limit(20);
      setTrees((data as AdoptedTree[]) || []);
    };
    const debounce = setTimeout(search, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const openMap = (tree: AdoptedTree) => {
    if (tree.latitude && tree.longitude) {
      setMapTree(tree);
    }
  };

  return (
    <MobileLayout>
      <PageHeader title="Trova il tuo Albero" />
      <div className="p-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cerca per nome, cognome, numero albero..."
            className="pl-10"
            autoFocus
          />
        </div>

        {query.length < 2 && (
          <div className="text-center py-12 space-y-3">
            <TreePine className="w-12 h-12 mx-auto text-primary/30" />
            <p className="text-muted-foreground text-sm">
              Inizia a digitare per cercare il tuo albero adottato
            </p>
          </div>
        )}

        <AnimatePresence>
          {trees.map((tree) => (
            <motion.div
              key={tree.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-xl border border-border bg-card p-4 space-y-2"
              onClick={() => setSelected(selected?.id === tree.id ? null : tree)}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-0.5 rounded">
                      #{tree.tree_number}
                    </span>
                    {tree.tree_species && (
                      <span className="text-xs text-muted-foreground">{tree.tree_species}</span>
                    )}
                  </div>
                  <p className="font-medium text-foreground mt-1">{tree.adopter_name}</p>
                </div>
                {tree.latitude && tree.longitude && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openMap(tree);
                    }}
                    className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                  >
                    <MapPin className="w-4 h-4" />
                  </button>
                )}
              </div>

              {selected?.id === tree.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  className="pt-2 border-t border-border space-y-1"
                >
                  {tree.dedicated_to && (
                    <div className="flex items-center gap-1.5 text-sm">
                      <Heart className="w-3.5 h-3.5 text-accent" />
                      <span className="text-muted-foreground">Dedicato a:</span>
                      <span className="text-foreground">{tree.dedicated_to}</span>
                    </div>
                  )}
                  {tree.dedication_message && (
                    <p className="text-sm text-muted-foreground italic">"{tree.dedication_message}"</p>
                  )}
                  {tree.adoption_period && (
                    <p className="text-xs text-muted-foreground">Periodo: {tree.adoption_period}</p>
                  )}
                </motion.div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {query.length >= 2 && trees.length === 0 && (
          <p className="text-center text-muted-foreground text-sm py-8">
            Nessun albero trovato per "{query}"
          </p>
        )}
      </div>
    </MobileLayout>
  );
};

export default TreeSearchPage;
