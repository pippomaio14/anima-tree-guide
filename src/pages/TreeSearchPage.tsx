import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Search, MapPin, TreePine, Heart, AlertCircle } from "lucide-react";
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (query.length < 2) {
      setTrees([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    const search = async () => {
      try {
        console.log('🔍 Ricerca per:', query);
        
        // Usa RPC per ottenere tutti gli alberi
        const { data, error: rpcError } = await supabase.rpc("list_trees_public");
        
        if (rpcError) {
          console.error('❌ Errore RPC:', rpcError);
          setError('Errore nel caricamento degli alberi');
          setLoading(false);
          return;
        }

        const allTrees = (data as AdoptedTree[]) || [];
        console.log(`📊 Trovati ${allTrees.length} alberi totali`);
        
        // Filtra localmente
        const q = query.toLowerCase();
        const filtered = allTrees.filter((t) =>
          [t.adopter_name, t.dedicated_to, t.tree_number, t.dedication_message, t.tree_species]
            .filter(Boolean)
            .some((f) => (f as string).toLowerCase().includes(q))
        ).slice(0, 20);

        console.log(`✅ Trovati ${filtered.length} alberi corrispondenti`);
        
        // Log delle coordinate per debug
        filtered.forEach(t => {
          console.log(`📍 Albero #${t.tree_number}: lat=${t.latitude}, lng=${t.longitude}`);
        });

        setTrees(filtered);
        setLoading(false);
        
      } catch (err) {
        console.error('❌ Errore durante la ricerca:', err);
        setError('Errore durante la ricerca');
        setLoading(false);
      }
    };

    const debounce = setTimeout(search, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const openMap = (tree: AdoptedTree) => {
    console.log('🗺️ openMap chiamato per albero:', {
      id: tree.id,
      tree_number: tree.tree_number,
      latitude: tree.latitude,
      longitude: tree.longitude
    });
    
    if (tree.latitude && tree.longitude) {
      console.log('✅ Coordinate valide, apro mappa');
      setMapTree(tree);
    } else {
      console.warn('⚠️ Coordinate mancanti per l\'albero:', tree.tree_number);
      setError(`L'albero #${tree.tree_number} non ha coordinate GPS registrate`);
      // Nascondi l'errore dopo 3 secondi
      setTimeout(() => setError(null), 3000);
    }
  };

  const hasCoordinates = (tree: AdoptedTree): boolean => {
    return !!(tree.latitude && tree.longitude);
  };

  return (
    <MobileLayout>
      <PageHeader title="Trova il tuo Albero" />
      <div className="p-4 space-y-4">
        {/* Barra di ricerca */}
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

        {/* Messaggio di errore */}
        {error && (
          <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Stato di caricamento */}
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground mt-2">Caricamento...</p>
          </div>
        )}

        {/* Messaggio quando non si digita */}
        {query.length < 2 && !loading && (
          <div className="text-center py-12 space-y-3">
            <TreePine className="w-12 h-12 mx-auto text-primary/30" />
            <p className="text-muted-foreground text-sm">
              Inizia a digitare per cercare il tuo albero adottato
            </p>
          </div>
        )}

        {/* Lista degli alberi */}
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
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-0.5 rounded">
                      #{tree.tree_number}
                    </span>
                    {tree.tree_species && (
                      <span className="text-xs text-muted-foreground">{tree.tree_species}</span>
                    )}
                    {hasCoordinates(tree) && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                        📍 GPS
                      </span>
                    )}
                  </div>
                  <p className="font-medium text-foreground mt-1">{tree.adopter_name}</p>
                </div>
                
                {/* Pulsante mappa - sempre visibile se ci sono coordinate */}
                {hasCoordinates(tree) ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openMap(tree);
                    }}
                    className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors shrink-0 ml-2"
                    title="Apri mappa"
                  >
                    <MapPin className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="p-2 rounded-lg bg-muted/50 text-muted-foreground shrink-0 ml-2" title="Coordinate non disponibili">
                    <MapPin className="w-4 h-4 opacity-50" />
                  </div>
                )}
              </div>

              {/* Dettagli espansi */}
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
                  {!hasCoordinates(tree) && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Coordinate GPS non disponibili per questo albero
                    </p>
                  )}
                </motion.div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Nessun risultato */}
        {query.length >= 2 && trees.length === 0 && !loading && (
          <div className="text-center py-8 space-y-2">
            <Search className="w-8 h-8 mx-auto text-muted-foreground/50" />
            <p className="text-center text-muted-foreground text-sm">
              Nessun albero trovato per "{query}"
            </p>
            <p className="text-xs text-muted-foreground">
              Prova a cercare per nome, cognome o numero albero
            </p>
          </div>
        )}
      </div>

      {/* Dialog mappa */}
      <TreeMapDialog
        open={!!mapTree}
        onClose={() => setMapTree(null)}
        tree={
          mapTree && mapTree.latitude && mapTree.longitude
            ? {
                tree_number: mapTree.tree_number,
                adopter_name: mapTree.adopter_name,
                latitude: mapTree.latitude,
                longitude: mapTree.longitude,
              }
            : null
        }
      />
    </MobileLayout>
  );
};

export default TreeSearchPage;
