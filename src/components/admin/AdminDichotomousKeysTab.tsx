import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Plus, Trash2, Pencil, X, Check, HelpCircle, CheckCircle2 } from "lucide-react";

const sb = supabase as any;

type KeyType = "leaf" | "flower" | "fruit" | "bud";
const KEY_LABELS: Record<KeyType, string> = {
  leaf: "Foglie",
  flower: "Fiori",
  fruit: "Frutti",
  bud: "Gemme",
};

interface Node {
  id: string;
  key_type: KeyType;
  node_id: string;
  node_type: "question" | "result";
  question: string | null;
  hint: string | null;
  option_a_label: string | null;
  option_a_next: string | null;
  option_b_label: string | null;
  option_b_next: string | null;
  species: string | null;
  scientific_name: string | null;
  description: string | null;
  characteristics: string[];
}

const emptyNode = (kt: KeyType): any => ({
  key_type: kt,
  node_id: "",
  node_type: "question",
  question: "",
  hint: "",
  option_a_label: "",
  option_a_next: "",
  option_b_label: "",
  option_b_next: "",
  species: "",
  scientific_name: "",
  description: "",
  characteristics: [""],
});

const NodeForm = ({ data, setData, nodes }: any) => {
  const isQ = data.node_type === "question";
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <Input
          placeholder="ID nodo (es. start, q_leaf_1)"
          value={data.node_id}
          onChange={(e) => setData({ ...data, node_id: e.target.value })}
        />
        <select
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={data.node_type}
          onChange={(e) => setData({ ...data, node_type: e.target.value })}
        >
          <option value="question">Domanda</option>
          <option value="result">Risultato</option>
        </select>
      </div>
      {isQ ? (
        <>
          <Textarea
            placeholder="Domanda"
            value={data.question || ""}
            onChange={(e) => setData({ ...data, question: e.target.value })}
          />
          <Input
            placeholder="Suggerimento (opzionale)"
            value={data.hint || ""}
            onChange={(e) => setData({ ...data, hint: e.target.value })}
          />
          <Label className="text-xs text-primary">Opzione A</Label>
          <Input
            placeholder="Etichetta opzione A"
            value={data.option_a_label || ""}
            onChange={(e) => setData({ ...data, option_a_label: e.target.value })}
          />
          <Input
            placeholder="ID nodo successivo (A)"
            value={data.option_a_next || ""}
            list="dk-nodes"
            onChange={(e) => setData({ ...data, option_a_next: e.target.value })}
          />
          <Label className="text-xs text-primary">Opzione B</Label>
          <Input
            placeholder="Etichetta opzione B"
            value={data.option_b_label || ""}
            onChange={(e) => setData({ ...data, option_b_label: e.target.value })}
          />
          <Input
            placeholder="ID nodo successivo (B)"
            value={data.option_b_next || ""}
            list="dk-nodes"
            onChange={(e) => setData({ ...data, option_b_next: e.target.value })}
          />
          <datalist id="dk-nodes">
            {nodes.map((n: Node) => <option key={n.id} value={n.node_id} />)}
          </datalist>
        </>
      ) : (
        <>
          <Input
            placeholder="Nome comune (specie)"
            value={data.species || ""}
            onChange={(e) => setData({ ...data, species: e.target.value })}
          />
          <Input
            placeholder="Nome scientifico"
            value={data.scientific_name || ""}
            onChange={(e) => setData({ ...data, scientific_name: e.target.value })}
          />
          <Textarea
            placeholder="Descrizione"
            value={data.description || ""}
            onChange={(e) => setData({ ...data, description: e.target.value })}
          />
          <Label className="text-xs">Caratteristiche</Label>
          {(data.characteristics || []).map((c: string, i: number) => (
            <div key={i} className="flex gap-2">
              <Input
                placeholder={`Caratteristica ${i + 1}`}
                value={c}
                onChange={(e) => {
                  const arr = [...data.characteristics];
                  arr[i] = e.target.value;
                  setData({ ...data, characteristics: arr });
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setData({
                    ...data,
                    characteristics: data.characteristics.filter((_: any, j: number) => j !== i),
                  })
                }
              >×</Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setData({ ...data, characteristics: [...(data.characteristics || []), ""] })}
          >+ Caratteristica</Button>
        </>
      )}
    </div>
  );
};

const KeyEditor = ({ kt }: { kt: KeyType }) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [newN, setNewN] = useState<any>(emptyNode(kt));
  const [editId, setEditId] = useState<string | null>(null);
  const [editN, setEditN] = useState<any>({});
  const [filter, setFilter] = useState("");

  const load = async () => {
    const { data } = await sb
      .from("dichotomous_key_nodes")
      .select("*")
      .eq("key_type", kt)
      .order("node_type")
      .order("node_id");
    setNodes(data || []);
  };
  useEffect(() => { load(); }, [kt]);

  const sanitize = (n: any) => ({
    ...n,
    characteristics: (n.characteristics || []).filter((c: string) => c.trim()),
    question: n.node_type === "question" ? n.question : null,
    hint: n.node_type === "question" ? n.hint : null,
    option_a_label: n.node_type === "question" ? n.option_a_label : null,
    option_a_next: n.node_type === "question" ? n.option_a_next : null,
    option_b_label: n.node_type === "question" ? n.option_b_label : null,
    option_b_next: n.node_type === "question" ? n.option_b_next : null,
    species: n.node_type === "result" ? n.species : null,
    scientific_name: n.node_type === "result" ? n.scientific_name : null,
    description: n.node_type === "result" ? n.description : null,
  });

  const add = async () => {
    if (!newN.node_id.trim()) return toast.error("ID nodo richiesto");
    const { error } = await sb.from("dichotomous_key_nodes").insert([sanitize(newN)]);
    if (error) return toast.error(error.message);
    setNewN(emptyNode(kt)); load(); toast.success("Nodo creato");
  };
  const save = async () => {
    const { id, ...rest } = sanitize(editN);
    const { error } = await sb.from("dichotomous_key_nodes").update(rest).eq("id", editId);
    if (error) return toast.error(error.message);
    setEditId(null); load(); toast.success("Nodo aggiornato");
  };
  const del = async (id: string) => {
    if (!confirm("Eliminare questo nodo?")) return;
    await sb.from("dichotomous_key_nodes").delete().eq("id", id); load();
  };

  const filtered = nodes.filter((n) => {
    if (!filter) return true;
    const q = filter.toLowerCase();
    return (
      n.node_id.toLowerCase().includes(q) ||
      (n.question || "").toLowerCase().includes(q) ||
      (n.species || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card p-4 space-y-2">
        <h3 className="font-semibold flex items-center gap-2">
          <Plus className="w-4 h-4" /> Nuovo nodo — {KEY_LABELS[kt]}
        </h3>
        <p className="text-xs text-muted-foreground">
          Il nodo iniziale deve avere ID <code>start</code>. Collega i nodi tramite "ID nodo successivo".
        </p>
        <NodeForm data={newN} setData={setNewN} nodes={nodes} />
        <Button onClick={add} className="w-full gradient-forest text-primary-foreground">
          Crea nodo
        </Button>
      </div>

      <Input
        placeholder="Cerca per ID, domanda o specie…"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />

      <div className="space-y-2">
        {filtered.map((n) => (
          <div key={n.id} className="rounded-lg border border-border bg-card">
            {editId === n.id ? (
              <div className="p-3 space-y-2">
                <NodeForm data={editN} setData={setEditN} nodes={nodes} />
                <div className="flex gap-2">
                  <Button size="sm" onClick={save} className="flex-1">
                    <Check className="w-3 h-3 mr-1" />Salva
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setEditId(null)} className="flex-1">
                    <X className="w-3 h-3 mr-1" />Annulla
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {n.node_type === "question" ? (
                      <HelpCircle className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    )}
                    <code className="text-xs font-mono text-muted-foreground truncate">{n.node_id}</code>
                  </div>
                  <p className="text-sm truncate">
                    {n.node_type === "question" ? n.question : `${n.species} (${n.scientific_name})`}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setEditId(n.id);
                      setEditN({
                        ...n,
                        characteristics: n.characteristics?.length ? [...n.characteristics] : [""],
                      });
                    }}
                    className="p-1"
                  ><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => del(n.id)} className="p-1 text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">Nessun nodo.</p>
        )}
      </div>
    </div>
  );
};

const AdminDichotomousKeysTab = () => {
  return (
    <Tabs defaultValue="leaf">
      <TabsList className="grid grid-cols-4 w-full mb-3">
        {(Object.keys(KEY_LABELS) as KeyType[]).map((k) => (
          <TabsTrigger key={k} value={k}>{KEY_LABELS[k]}</TabsTrigger>
        ))}
      </TabsList>
      {(Object.keys(KEY_LABELS) as KeyType[]).map((k) => (
        <TabsContent key={k} value={k}>
          <KeyEditor kt={k} />
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default AdminDichotomousKeysTab;
