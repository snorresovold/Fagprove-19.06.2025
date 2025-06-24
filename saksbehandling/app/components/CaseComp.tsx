import { useEffect, useState } from 'react';
import { NavLink } from 'react-router'
import type { Case } from '~/interfaces'
import { getUserDataFromID } from '~/utils';

function CaseComp({ c }: { c: Case }) {
      const [email, setEmail] = useState<string>();

      useEffect(() => {
        if (c.creator) {
          getUserDataFromID(c.creator).then((user) => {
            if (user) {
              setEmail(user.email);
            } else {
              setEmail("Unknown user");
            }
          });
        }
      }, [c.creator]);

  return (
      <div key={c.id} className="border border-gray-300 p-6 rounded-2xl shadow-md bg-white hover:shadow-lg transition-shadow duration-300">
        
        <p className="text-sm text-gray-600 mb-1">Prioritetsgrad: {c.priority}</p>
        <p className="text-sm text-gray-600 mb-1">
          {c.category} sak av <span className="font-medium">{email}</span>
        </p>
        <p className="text-lg font-semibold text-gray-800 mb-2">
          <strong>{c.title}</strong> 
        </p>
        <p className="text-gray-700 mb-2">{c.description}</p>
        <p className="text-sm text-gray-700 mb-1">
          <strong>Status:</strong> {c.status}
        </p>
        <p className="text-xs text-gray-500">
          Sist oppdatert: {c.updatedAt.toLocaleDateString()}
        </p>
        <NavLink to={`/case/${c.id}`} className="text-blue-600 hover:underline bg-black text-white rounded-full px-4 py-2 mt-4 inline-block">
          Se sak
        </NavLink>
      </div>
  )
}

export default CaseComp