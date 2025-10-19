import { Users } from 'lucide-react'

const clubs = [
  { 
    name: "IEEE Student Branch", 
    members: 145, 
    description: "Professional development, networking, and technical excellence",
    activities: ["Technical Workshops", "Guest Lectures", "Industry Visits"],
    established: "2018"
  },
  { 
    name: "Robotics & Automation Society", 
    members: 92, 
    description: "Hands-on robotics projects and automation research",
    activities: ["Robot Competitions", "Build Sessions", "Research Projects"],
    established: "2019"
  },
  { 
    name: "Power & Energy Society", 
    members: 78, 
    description: "Specializing in electrical power systems and renewable energy",
    activities: ["Field Visits", "Research Symposiums", "Industry Collaborations"],
    established: "2020"
  },
  { 
    name: "Electronics Design Club", 
    members: 86, 
    description: "Circuit design, PCB development, and embedded systems",
    activities: ["Design Challenges", "PCB Workshops", "Hardware Projects"],
    established: "2019"
  }
]

export default function Clubs() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            Professional Societies & Clubs
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Join specialized student organizations to enhance your technical skills, build professional networks, and participate in meaningful projects.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {clubs.map((club, index) => (
            <div key={index} className="bg-white p-6 rounded-2xl text-center border border-slate-200 hover:border-slate-300 hover:shadow-xl transition-all duration-300 group flex flex-col">
              <div className="w-16 h-16 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">{club.name}</h3>
              <p className="text-sm text-slate-600 mb-4 leading-relaxed">{club.description}</p>
              <div className="space-y-2 mb-6">
                {club.activities.map((activity, actIndex) => (
                  <span key={actIndex} className="inline-block text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full mr-1 mb-1">
                    {activity}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between mb-6 text-sm text-slate-500">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {club.members} members
                </div>
                <div className="text-xs">
                  Est. {club.established}
                </div>
              </div>
              <button className="w-full bg-slate-900 text-white py-2 rounded-lg hover:bg-slate-800 transition-colors font-medium mt-auto">
                Join Society
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
