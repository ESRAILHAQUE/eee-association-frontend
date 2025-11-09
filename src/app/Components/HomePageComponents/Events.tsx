import { Calendar, Clock, MapPin, Users, ArrowRight } from 'lucide-react'

const upcomingEvents = [
  {
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&h=400&fit=crop",
    date: "Dec 15, 2024",
    time: "2:00 PM - 6:00 PM",
    title: "IEEE International Tech Symposium 2024",
    category: "Conference",
    location: "Engineering Auditorium",
    attendees: 250,
    status: "Registration Open"
  },
  {
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop",
    date: "Dec 20, 2024",
    time: "10:00 AM - 4:00 PM",
    title: "Advanced Robotics & AI Workshop",
    category: "Workshop",
    location: "Innovation Lab",
    attendees: 75,
    status: "Limited Seats"
  },
  {
    image: "https://images.unsplash.com/photo-1523582407565-efee5cf4a353?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170",
    date: "Jan 5, 2025",
    time: "7:00 PM - 9:00 PM",
    title: "Student Chapter Leadership Meeting",
    category: "Meeting",
    location: "Conference Room A",
    attendees: 45,
    status: "Members Only"
  },
  {
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop",
    date: "Jan 12, 2025",
    time: "9:00 AM - 5:00 PM",
    title: "Senior Design Project Showcase",
    category: "Exhibition",
    location: "Main Hall",
    attendees: 300,
    status: "Public Event"
  }
]

export default function Events() {
  return (
    <section id="events" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            Events & Workshops
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Stay engaged with our comprehensive calendar of technical events, workshops, and professional development opportunities.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {upcomingEvents.map((event, index) => (
            <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200">
              <div className="relative">
                <img src={event.image} alt={event.title} className="w-full h-48 sm:h-56 object-cover" />
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
                <button className="w-full bg-slate-900 text-white py-3 rounded-lg hover:bg-slate-800 transition-colors font-medium flex items-center justify-center">
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