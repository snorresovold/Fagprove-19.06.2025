import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="max-w-3xl mx-auto py-10 px-6">
      <h1 className="text-3xl font-bold mb-6">Personvernerklæring</h1>

      <p className="mb-4">
        Når du registrerer deg som bruker i vår applikasjon, samler vi inn og lagrer følgende opplysninger:
      </p>

      <ul className="list-disc pl-6 mb-4">
        <li><strong>E-postadresse:</strong> Vi bruker din e-post for å sende varslinger og for å håndtere innlogging.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">Hvordan lagres opplysningene?</h2>
      <p className="mb-4">
        Opplysningene lagres sikkert i vår database (Firebase Firestore). Vi benytter også Firebase Authentication for å sørge for sikker innlogging og tilgangsstyring.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Deling av data</h2>
      <p className="mb-4">
        Vi deler ikke din e-postadresse eller andre personopplysninger med tredjeparter, med mindre dette kreves av lov eller er nødvendig for å levere tjenesten.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Sletting av data</h2>
      <p className="mb-4">
        Du kan be om å få slettet din bruker og dine tilknyttede data ved å kontakte oss. Vi vil da slette all informasjon knyttet til deg fra vår database.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Kontakt</h2>
      <p className="mb-4">
        Har du spørsmål om hvordan vi behandler dine personopplysninger? Kontakt oss gjerne på <a href="mailto:support@dittdomene.no" className="text-blue-600 underline">snorre@zebraconsulting.no</a>.
      </p>
    </div>
  );
};

export default PrivacyPolicy;
