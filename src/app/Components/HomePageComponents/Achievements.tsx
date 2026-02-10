import Image from 'next/image'
import { Trophy } from 'lucide-react'

const achievements = [
  {
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop",
    title: "IEEE Outstanding Student Branch Award",
    description: "Recognized nationally for exceptional technical activities, professional development initiatives, and community impact programs.",
    year: "2024",
    category: "Institutional Excellence"
  },
  {
    image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=300&fit=crop",
    title: "National Robotics Competition Champions",
    description: "First place victory in autonomous navigation challenge, demonstrating superior engineering design and implementation.",
    year: "2024",
    category: "Student Achievement"
  },
  {
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&h=300&fit=crop",
    title: "Industry Partnership Excellence Award",
    description: "Outstanding collaboration with leading technology companies on innovative research projects and internship programs.",
    year: "2023",
    category: "Industry Relations"
  }
]

export default function Achievements() {
  return (
    <section id="achievements" className="md:py-20 py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl lg:text-5xl font-bold text-slate-900 mb-4">
            Notable Achievements
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Celebrating outstanding accomplishments that demonstrate our commitment to excellence in education, research, and professional development.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {achievements.map((achievement, index) => (
            <div key={index} className="bg-white rounded-sm overflow-hidden border border-slate-200 hover:border-slate-300 hover:shadow-xl transition-all duration-300">
              <div className="relative h-48">
                <Image src={achievement.image} alt={achievement.title} fill className="object-cover" unoptimized />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                <div className="absolute top-4 right-4">
                  <span className="inline-block bg-white/90 backdrop-blur-sm text-slate-800 text-xs font-semibold px-3 py-1 rounded-full">
                    {achievement.year}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center mb-4">s
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mr-3 shadow-md">
                    <Trophy className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-medium text-slate-600 px-3 py-1 bg-slate-100 rounded-full">
                    {achievement.category}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{achievement.title}</h3>
                <p className="text-slate-600 leading-relaxed">{achievement.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
