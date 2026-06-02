import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { sanitizeHtml } from "@/lib/sanitize";
import { useAuth } from "@/hooks/useAuth";
import { Calendar, MapPin, Users, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import PageHeader from "@/components/PageHeader";
import MobileLayout from "@/components/MobileLayout";
import { motion } from "framer-motion";

const EventsPage = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<any[]>([]);
  const [bookings, setBookings] = useState<string[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    supabase.from("events").select("*").order("event_date", { ascending: true }).then(({ data }) => {
      setEvents(data || []);
    });
    if (user) {
      supabase.from("event_bookings").select("event_id").eq("user_id", user.id).then(({ data }) => {
        setBookings((data || []).map((b: any) => b.event_id));
      });
    }
  }, [user]);

  const toggleBooking = async (eventId: string) => {
    if (!user) return;
    if (bookings.includes(eventId)) {
      await supabase.from("event_bookings").delete().eq("event_id", eventId).eq("user_id", user.id);
      setBookings(bookings.filter((id) => id !== eventId));
      toast.success("Prenotazione annullata");
    } else {
      const { error } = await supabase.from("event_bookings").insert({ event_id: eventId, user_id: user.id });
      if (error) toast.error("Errore nella prenotazione");
      else {
        setBookings([...bookings, eventId]);
        toast.success("Prenotato con successo!");
      }
    }
  };

  const now = new Date();
  const upcoming = events.filter((e) => new Date(e.event_date) >= now);
  const past = events.filter((e) => new Date(e.event_date) < now);

  const renderEvent = (event: any) => {
    const isBooked = bookings.includes(event.id);
    const isPast = new Date(event.event_date) < now;
    const isExpanded = expandedId === event.id;
    return (
      <motion.div
        key={event.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-xl border border-border bg-card overflow-hidden ${isPast ? "opacity-60" : ""}`}
      >
        {event.image_url && (
          <img src={event.image_url} alt={event.title} className="w-full h-40 object-cover" />
        )}
        <div className="p-4 space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-lg gradient-forest flex flex-col items-center justify-center text-primary-foreground shrink-0">
              <span className="text-xs font-bold">{format(new Date(event.event_date), "dd", { locale: it })}</span>
              <span className="text-[10px] uppercase">{format(new Date(event.event_date), "MMM", { locale: it })}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-foreground cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : event.id)}>{event.title}</h3>
              <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {format(new Date(event.event_date), "HH:mm", { locale: it })}
                </span>
                {event.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {event.location}
                  </span>
                )}
              </div>
            </div>
          </div>
          {isExpanded && event.description && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              className="pt-3 border-t border-border"
            >
              <div className="prose prose-sm max-w-none text-muted-foreground rich-content" dangerouslySetInnerHTML={{ __html: sanitizeHtml(event.description) }} />
            </motion.div>
          )}
          {event.booking_enabled && !isPast && (
            <Button
              variant={isBooked ? "outline" : "default"}
              size="sm"
              className={isBooked ? "border-primary text-primary" : "gradient-forest text-primary-foreground"}
              onClick={() => toggleBooking(event.id)}
            >
              {isBooked ? (
                <><CheckCircle className="w-3.5 h-3.5 mr-1.5" /> Prenotato</>
              ) : (
                <><Users className="w-3.5 h-3.5 mr-1.5" /> Prenota</>
              )}
            </Button>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <MobileLayout>
      <PageHeader title="Eventi" />
      <div className="p-4 space-y-6">
        {upcoming.length > 0 && (
          <section>
            <h2 className="font-display text-lg font-semibold mb-3">Prossimi Eventi</h2>
            <div className="space-y-3">{upcoming.map(renderEvent)}</div>
          </section>
        )}
        {past.length > 0 && (
          <section>
            <h2 className="font-display text-lg font-semibold mb-3 text-muted-foreground">Eventi Passati</h2>
            <div className="space-y-3">{past.map(renderEvent)}</div>
          </section>
        )}
        {events.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 mx-auto text-primary/30 mb-3" />
            <p className="text-muted-foreground">Nessun evento in programma</p>
          </div>
        )}
      </div>
    </MobileLayout>
  );
};

export default EventsPage;
