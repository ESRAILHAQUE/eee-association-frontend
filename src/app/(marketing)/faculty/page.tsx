import React from 'react';
import Image from 'next/image';

const facultyMembers = [
  {
    name: 'Md. Salah Uddin',
    designation: 'Assistant Professor & Dept Head(EEE)',
    phone: '01737242628',
    email: 'sumeceee@mec.ac.bd',
    photo: '/images/faculty/salah-uddin.png'
  },
  {
    name: 'Salman Fazle Rabbi',
    designation: 'Assistant Professor (EEE)',
    phone: '01676033761',
    email: 'salman.fr@sec.ac.bd',
    photo: '/images/faculty/salman-fazle rabbi.png'
  },
  {
    name: 'Mahedi Kamal Ahmed',
    designation: 'Lecturer (EEE)',
    phone: '01673964407',
    email: 'mkahmed.work@gmail.com',
    photo: '/images/faculty/mehedi-kamal-hasan.png'
  },
  {
    name: 'Susanta Dev Nath',
    designation: 'Lecturer (EEE)',
    phone: '',
    email: 'susanta.eee@mec.ac.bd',
    photo: '/images/faculty/susanta-dev-nath.png'
  },
  {
    name: 'Arif Ahammad',
    designation: 'Adjunct Faculty Assistant Professor (EEE), SUST',
    phone: '01720122789',
    email: 'arif-eee@sust.edu',
    photo: '/images/faculty/arif-ahammad.png'
  },
  {
    name: 'Dr Abul Mukid Mohammad Mukaddes',
    designation: 'Adjunct Faculty Professor (IPE), SUST',
    phone: '01777891684',
    email: 'mukaddes-ipe@sust.edu',
    photo: '/images/faculty/abdul-mukid-moammand-mukaddes.png'
  },
  {
    name: 'Jahid Hasan',
    designation: 'Adjunct Faculty Assistant Professor (IPE), SUST',
    phone: '01712832699',
    email: 'j.hasan-ipe@sust.edu',
    photo: '/images/faculty/jahid-hasan.png'
  },
  {
    name: 'Pronob Kumar Biswas',
    designation: 'Adjunct Faculty Assistant Professor (IPE), SUST',
    phone: '01750887879',
    email: 'pronob-ipe@sust.edu',
    photo: '/images/faculty/pronab-kumar.png'
  },
  {
    name: 'Md Rahmot Ullah',
    designation: 'Adjunct Faculty Assistant Professor, Metropolitan University',
    phone: '01913988095',
    email: 'rahmot@metrouni.edu.bd',
    photo: '/images/faculty/rahmot-ullah.png'
  },
  {
    name: 'Md. Janibul Alam Soeb',
    designation: 'Adjunct Faculty Assistant Professor, Sylhet Agriculture University',
    phone: '01911113338',
    email: 'janibulfpm@sau.ac.bd',
    photo: '/images/faculty/janibul-alam-soeb.png'
  },
  {
    name: 'Md. Omar Faruk Sagor',
    designation: 'Adjunct Faculty',
    phone: '01711960676',
    email: 'faruksagoreee02@gmail.com',
    photo: '/images/faculty/omor-faruk-sagor.png'
  },
  {
    name: 'Md Fujael Ahmed',
    designation: 'Adjunct Faculty',
    phone: '01740632423',
    email: 'oliurrahmanfujael@gmail.com',
    photo: '/images/faculty/fujayel.png'
  }
];

export default function FacultyPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-8 text-center">Teachers & Officers </h1>
        
        <div className="bg-white rounded-lg shadow overflow-x-auto border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-center text-sm font-semibold text-slate-700 border-b border-r border-slate-200">Photo</th>
                <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-slate-700 border-b border-r border-slate-200">Name</th>
                <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-slate-700 border-b border-r border-slate-200">Designation</th>
                <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-slate-700 border-b border-slate-200">Contact</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {facultyMembers.map((faculty, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="px-1 py-1 whitespace-nowrap text-center border-r border-slate-200">
                    <div className="relative w-36 h-44 mx-auto overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                      {faculty.photo ? (
                        <Image src={faculty.photo} alt={faculty.name} fill className="object-cover" unoptimized />
                      ) : (
                        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 border-r border-slate-200">
                    {faculty.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700 max-w-xs whitespace-pre-wrap border-r border-slate-200">
                    {faculty.designation}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                    <div className="flex flex-col gap-2">
                      {faculty.phone && (
                        <div>
                          <span className="font-semibold text-slate-800">Phone:</span>{' '}
                          <a href={`tel:${faculty.phone.replace(/[^0-9+]/g, '')}`} className="text-blue-600 hover:text-blue-800 hover:underline">{faculty.phone}</a>
                        </div>
                      )}
                      {faculty.email && (
                        <div>
                          <span className="font-semibold text-slate-800">Email:</span>{' '}
                          <a href={`mailto:${faculty.email}`} className="text-blue-600 hover:text-blue-800 hover:underline">{faculty.email}</a>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
