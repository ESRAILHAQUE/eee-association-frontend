import { Calendar, Clock, MapPin, Users, ArrowRight } from 'lucide-react'
import Image from 'next/image'

const defaultEvents = [
  {
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&h=400&fit=crop",
    date: "Dec 15, 2024",
    time: "2:00 PM - 6:00 PM",
    title: "IEEE International Tech Symposium 2024",
    category: "Conference",
    location: "Engineering Auditorium",
    attendees: 250,
    status: "Registration Open"
  }
];

export default function Events({ events = [] }: { events?: any[] }) {
  const displayEvents = events.length > 0 ? events : defaultEvents;
  return (
    <section id="events" className="md:py-20 py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl lg:text-5xl font-bold text-slate-900 mb-4">
            Events & Workshops
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Stay engaged with our comprehensive calendar of technical events, workshops, and professional development opportunities.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {displayEvents.map((event, index) => (
            <div key={index} className="bg-white rounded-sm overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200">
              <div className="relative">
                <Image src={event.image} alt={event.title} width={600} height={400} className="w-full h-48 sm:h-56 object-cover" unoptimized />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="inline-block bg-white/90 backdrop-blur-sm text-slate-800 text-xs font-semibold px-3 py-1 rounded-full">
                    {event.category}
                  </span>
                  <span className={`inline-block backdrop-blur-sm text-xs font-semibold px-3 py-1 rounded-full ${
                    event.status === 'Registration Open' ? 'bg-green-100 text-green-800' :
                    event.status === 'Limited Seats' ? 'bg-orange-100 text-orange-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {event.status}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4 text-sm text-slate-600">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {event.date}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {event.time}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{event.title}</h3>
                <div className="flex items-center justify-between mb-4 text-sm text-slate-600">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {event.location}
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {event.attendees} attendees
                  </div>
                </div>
                <button className="w-full bg-[#0F172B] text-white py-3 rounded-sm cursor-pointer hover:bg-[#1a233a] transition-colors font-medium flex items-center justify-center">
                  Register Now
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}