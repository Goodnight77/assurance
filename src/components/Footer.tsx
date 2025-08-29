import React from "react";

const Footer: React.FC = () => (
  <footer className="bg-[#1a2233] text-white pt-10 pb-6 mt-16">
    <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
      <div>
        <h3 className="font-bold mb-2">BH ASSURANCE</h3>
        <p className="text-sm mb-2">Leader de l'assurance en Tunisie, au service de votre avenir.</p>
        <a href="mailto:commercial@bh-assurance.com" className="text-xs text-gray-300 hover:text-white">commercial@bh-assurance.com</a>
      </div>
      <div>
        <h4 className="font-semibold mb-2">Contactez-nous</h4>
        <p className="text-xs">Immeuble BH Assurance, Centre Urbain Nord - Tunis</p>
        <p className="text-xs">+216 71 184 200</p>
      </div>
      <div>
        <h4 className="font-semibold mb-2">Particuliers</h4>
        <ul className="text-xs space-y-1">
          <li>Assurance Automobile</li>
          <li>Assurance Habitation</li>
          <li>Assurance Voyage</li>
          <li>Epargne Retraite</li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold mb-2">BH Assurance</h4>
        <ul className="text-xs space-y-1">
          <li>A propos de nous</li>
          <li>Nos agences</li>
          <li>Actualités</li>
          <li>Contact</li>
        </ul>
      </div>
    </div>
    <div className="border-t border-gray-700 mt-8 pt-4 text-center text-xs text-gray-400">
      © Copyright BH Assurance 2025. | Créé avec ❤️ par BH Assurance
    </div>
  </footer>
);

export default Footer;
