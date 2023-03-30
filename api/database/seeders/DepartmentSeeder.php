<?php

namespace Database\Seeders;

use App\Models\Department;
use Illuminate\Database\Seeder;

class DepartmentSeeder extends Seeder
{
  /**
   * Run the database seeds.
   *
   * @return void
   */
  public function run()
  {
    $departments = [
      [
        'department_number' => 1,
        'name' => [
          'en' => 'Agriculture and Agri-Food (Department of)',
          'fr' => 'Agriculture et de l\'Agroalimentaire (Ministère de l\')',
        ],
      ],
      [
        'department_number' => 2,
        'name' => [
          'en' => 'Office of the Auditor General',
          'fr' => 'Bureau du vérificateur général',
        ],
      ],
      [
        'department_number' => 4,
        'name' => [
          'en' => 'Public Service Commission',
          'fr' => 'Commission de la fonction publique',
        ],
      ],
      [
        'department_number' => 5,
        'name' => [
          'en' => 'Foreign Affairs, Trade and Development (Department of)',
          'fr' => 'Affaires étrangères, du Commerce et du Développement (Ministère des)',
        ],
      ],
      [
        'department_number' => 6,
        'name' => [
          'en' => 'Finance (Department of)',
          'fr' => 'Finances (Ministère des)',
        ],
      ],
      [
        'department_number' => 7,
        'name' => [
          'en' => 'Environment (Department of the)',
          'fr' => 'Environnement (Ministère de l\')',
        ],
      ],
      [
        'department_number' => 8,
        'name' => [
          'en' => 'Office of the Governor General\'s Secretary',
          'fr' => 'Bureau du secrétaire du gouverneur général',
        ],
      ],
      [
        'department_number' => 9,
        'name' => [
          'en' => 'Senate',
          'fr' => 'Sénat',
        ],
      ],
      [
        'department_number' => 11,
        'name' => [
          'en' => 'Office of the Superintendent of Financial Institutions',
          'fr' => 'Bureau du surintendant des institutions financières',
        ],
      ],
      [
        'department_number' => 12,
        'name' => [
          'en' => 'Economic Development Agency of Canada for the Regions of Quebec',
          'fr' => 'Agence de développement économique du Canada pour les régions du Québec',
        ],
      ],
      [
        'department_number' => 13,
        'name' => [
          'en' => 'Justice (Department of)',
          'fr' => 'Justice (Ministère de la)',
        ],
      ],
      [
        'department_number' => 14,
        'name' => [
          'en' => 'Employment and Social Development (Department of)',
          'fr' => 'Emploi et du Développement social (Ministère de l\')',
        ],
      ],
      [
        'department_number' => 15,
        'name' => [
          'en' => 'Office of the Chief Electoral Officer',
          'fr' => 'Bureau du directeur général des élections',
        ],
      ],
      [
        'department_number' => 16,
        'name' => [
          'en' => 'Canadian Radio-television and Telecommunications Commission',
          'fr' => 'Conseil de la radiodiffusion et des télécommunications canadiennes',
        ],
      ],
      [
        'department_number' => 17,
        'name' => [
          'en' => 'Library of Parliament',
          'fr' => 'Bibliothèque du Parlement',
        ],
      ],
      [
        'department_number' => 18,
        'name' => [
          'en' => 'National Defence (Department of)',
          'fr' => 'Défense nationale (Ministère de la)',
        ],
      ],
      [
        'department_number' => 19,
        'name' => [
          'en' => 'Office of the Director of Public Prosecutions',
          'fr' => 'Bureau du directeur des poursuites pénales',
        ],
      ],
      [
        'department_number' => 21,
        'name' => [
          'en' => 'Veterans Affairs (Department of)',
          'fr' => 'Anciens Combattants (Ministère des)',
        ],
      ],
      [
        'department_number' => 22,
        'name' => [
          'en' => 'Health (Department of)',
          'fr' => 'Santé (Ministère de la)',
        ],
      ],
      [
        'department_number' => 23,
        'name' => [
          'en' => 'Atlantic Canada Opportunities Agency',
          'fr' => 'Agence de promotion économique du Canada atlantique',
        ],
      ],
      [
        'department_number' => 24,
        'name' => [
          'en' => 'International Joint Commission (Canadian Section)',
          'fr' => 'Commission mixte internationale (section canadienne)',
        ],
      ],
      [
        'department_number' => 25,
        'name' => [
          'en' => 'Privy Council Office',
          'fr' => 'Bureau du Conseil privé',
        ],
      ],
      [
        'department_number' => 27,
        'name' => [
          'en' => 'Natural Sciences and Engineering Research Council',
          'fr' => 'Conseil de recherches en sciences naturelles et en génie',
        ],
      ],
      [
        'department_number' => 30,
        'name' => [
          'en' => 'Royal Canadian Mounted Police',
          'fr' => 'Gendarmerie royale du Canada',
        ],
      ],
      [
        'department_number' => 32,
        'name' => [
          'en' => 'Immigration and Refugee Board',
          'fr' => 'Commission de l\'immigration et du statut de réfugié',
        ],
      ],
      [
        'department_number' => 33,
        'name' => [
          'en' => 'Industry (Department of)',
          'fr' => 'Industrie (Ministère de l\')',
        ],
      ],
      [
        'department_number' => 34,
        'name' => [
          'en' => 'Transport (Department of)',
          'fr' => 'Transports (Ministère des)',
        ],
      ],
      [
        'department_number' => 35,
        'name' => [
          'en' => 'National Research Council of Canada',
          'fr' => 'Conseil national de recherches du Canada',
        ],
      ],
      [
        'department_number' => 37,
        'name' => [
          'en' => 'Telefilm Canada',
          'fr' => 'Téléfilm Canada',
        ],
      ],
      [
        'department_number' => 38,
        'name' => [
          'en' => 'Canada Border Services Agency - (Administered Activities)',
          'fr' => 'Agence des services frontaliers du Canada - (activités administrées)',
        ],
      ],
      [
        'department_number' => 39,
        'name' => [
          'en' => 'National Film Board',
          'fr' => 'Office national du film',
        ],
      ],
      [
        'department_number' => 40,
        'name' => [
          'en' => 'Canadian Transportation Agency',
          'fr' => 'Office des transports du Canada',
        ],
      ],
      [
        'department_number' => 41,
        'name' => [
          'en' => 'Natural Resources (Department of)',
          'fr' => 'Ressources naturelles (Ministère des)',
        ],
      ],
      [
        'department_number' => 42,
        'name' => [
          'en' => 'Department of Crown-Indigenous Relations and Northern Affairs',
          'fr' => 'Ministère des Relations Couronne-Autochtones et des Affaires du Nord',
        ],
      ],
      [
        'department_number' => 43,
        'name' => [
          'en' => 'Canadian Intergovernmental Conference Secretariat',
          'fr' => 'Secrétariat des conférences intergouvernementales canadiennes',
        ],
      ],
      [
        'department_number' => 44,
        'name' => [
          'en' => 'Western Economic Diversification (Department of)',
          'fr' => 'Diversification de l\'économie de l\'Ouest canadien (Ministère de la)',
        ],
      ],
      [
        'department_number' => 46,
        'name' => [
          'en' => 'Office of the Public Sector Integrity Commissioner',
          'fr' => 'Commissariat à l\'intégrité du secteur public',
        ],
      ],
      [
        'department_number' => 47,
        'name' => [
          'en' => 'Canadian Nuclear Safety Commission',
          'fr' => 'Commission canadienne de sûreté nucléaire',
        ],
      ],
      [
        'department_number' => 50,
        'name' => [
          'en' => 'Citizenship and Immigration (Department of)',
          'fr' => 'Citoyenneté et de l\'Immigration (Ministère de la)',
        ],
      ],
      [
        'department_number' => 51,
        'name' => [
          'en' => 'Office of the Commissioner for Federal Judicial Affairs',
          'fr' => 'Bureau du commissaire à la magistrature fédérale',
        ],
      ],
      [
        'department_number' => 52,
        'name' => [
          'en' => 'Canada School of Public Service',
          'fr' => 'École de la fonction publique du Canada',
        ],
      ],
      [
        'department_number' => 53,
        'name' => [
          'en' => 'Correctional Service of Canada',
          'fr' => 'Service correctionnel du Canada',
        ],
      ],
      [
        'department_number' => 54,
        'name' => [
          'en' => 'Statistics Canada',
          'fr' => 'Statistique Canada',
        ],
      ],
      [
        'department_number' => 56,
        'name' => [
          'en' => 'Treasury Board Secretariat',
          'fr' => 'Secrétariat du Conseil du Trésor',
        ],
      ],
      [
        'department_number' => 57,
        'name' => [
          'en' => 'Parole Board of Canada',
          'fr' => 'Commission des libérations conditionnelles du Canada',
        ],
      ],
      [
        'department_number' => 61,
        'name' => [
          'en' => 'Canadian Institutes of Health Research',
          'fr' => 'Instituts de recherche en santé du Canada',
        ],
      ],
      [
        'department_number' => 62,
        'name' => [
          'en' => 'Federal Economic Development Agency for Southern Ontario',
          'fr' => 'Agence fédérale de développement économique pour le Sud de l\'Ontario',
        ],
      ],
      [
        'department_number' => 63,
        'name' => [
          'en' => 'Social Sciences and Humanities Research Council',
          'fr' => 'Conseil de recherches en sciences humaines',
        ],
      ],
      [
        'department_number' => 66,
        'name' => [
          'en' => 'Northern Pipeline Agency',
          'fr' => 'Administration du pipe-line du Nord',
        ],
      ],
      [
        'department_number' => 67,
        'name' => [
          'en' => 'House of Commons',
          'fr' => 'Chambre des communes',
        ],
      ],
      [
        'department_number' => 75,
        'name' => [
          'en' => 'Canadian Human Rights Commission',
          'fr' => 'Commission canadienne des droits de la personne',
        ],
      ],
      [
        'department_number' => 76,
        'name' => [
          'en' => 'Office of the Commissioner of Official Languages',
          'fr' => 'Commissariat aux langues officielles',
        ],
      ],
      [
        'department_number' => 78,
        'name' => [
          'en' => 'Canadian Northern Economic Development Agency',
          'fr' => 'Agence canadienne de développement économique du Nord',
        ],
      ],
      [
        'department_number' => 79,
        'name' => [
          'en' => 'Payroll System General Ledger',
          'fr' => 'Grand livre général du système de la paye',
        ],
      ],
      [
        'department_number' => 80,
        'name' => [
          'en' => 'Registrar of the Supreme Court of Canada',
          'fr' => 'Registraire de la Cour suprême du Canada',
        ],
      ],
      [
        'department_number' => 85,
        'name' => [
          'en' => 'Canada Border Services Agency',
          'fr' => 'Agence des services frontaliers du Canada',
        ],
      ],
      [
        'department_number' => 86,
        'name' => [
          'en' => 'Fisheries and Oceans (Department of)',
          'fr' => 'Pêches et des Océans (Ministère des)',
        ],
      ],
      [
        'department_number' => 87,
        'name' => [
          'en' => 'Public Service Superannuation',
          'fr' => 'Pension de retraite de la fonction publique',
        ],
      ],
      [
        'department_number' => 88,
        'name' => [
          'en' => 'Public Safety and Emergency Preparedness (Department of)',
          'fr' => 'Sécurité publique et de la Protection civile (Ministère de la)',
        ],
      ],
      [
        'department_number' => 91,
        'name' => [
          'en' => 'Canada Mortgage and Housing Corporation (Crown Corporation)',
          'fr' => 'Société canadienne d\'hypothèques et de logement (Société d\'État)',
        ],
      ],
      [
        'department_number' => 95,
        'name' => [
          'en' => 'Canadian Security Intelligence Service',
          'fr' => 'Service canadien du renseignement de sécurité',
        ],
      ],
      [
        'department_number' => 96,
        'name' => [
          'en' => 'Offices of the Information and Privacy Commissioners of Canada',
          'fr' => 'Commissariats à l\'information et à la protection de la vie privée au Canada',
        ],
      ],
      [
        'department_number' => 97,
        'name' => [
          'en' => 'Receiver General',
          'fr' => 'Receveur général',
        ],
      ],
      [
        'department_number' => 100,
        'name' => [
          'en' => 'Canadian Centre for Occupational Health and Safety',
          'fr' => 'Centre canadien d\'hygiène et de sécurité au travail',
        ],
      ],
      [
        'department_number' => 101,
        'name' => [
          'en' => 'Canadian Transportation Accident Investigation and Safety Board',
          'fr' => 'Bureau canadien d\'enquête sur les accidents de transport et de la sécurité des transports',
        ],
      ],
      [
        'department_number' => 102,
        'name' => [
          'en' => 'The National Battlefields Commission',
          'fr' => 'Commission des champs de bataille nationaux',
        ],
      ],
      [
        'department_number' => 109,
        'name' => [
          'en' => 'Patented Medicine Prices Review Board',
          'fr' => 'Conseil d\'examen du prix des médicaments brevetés',
        ],
      ],
      [
        'department_number' => 116,
        'name' => [
          'en' => 'Copyright Board',
          'fr' => 'Commission du droit d\'auteur',
        ],
      ],
      [
        'department_number' => 119,
        'name' => [
          'en' => 'Canadian Space Agency',
          'fr' => 'Agence spatiale canadienne',
        ],
      ],
      [
        'department_number' => 122,
        'name' => [
          'en' => 'Canada Revenue Agency - (Administered Activities)',
          'fr' => 'Agence du revenu du Canada - (activités administrées)',
        ],
      ],
      [
        'department_number' => 123,
        'name' => [
          'en' => 'Export Development Canada (Crown Corporation)',
          'fr' => 'Exportation et développement Canada (Société d\'État)',
        ],
      ],
      [
        'department_number' => 124,
        'name' => [
          'en' => 'Parks Canada Agency',
          'fr' => 'Agence Parcs Canada',
        ],
      ],
      [
        'department_number' => 127,
        'name' => [
          'en' => 'Public Works and Government Services (Department of)',
          'fr' => 'Travaux publics et des Services gouvernementaux (Ministère des)',
        ],
      ],
      [
        'department_number' => 130,
        'name' => [
          'en' => 'Canada Revenue Agency',
          'fr' => 'Agence du revenu du Canada',
        ],
      ],
      [
        'department_number' => 133,
        'name' => [
          'en' => 'Canadian Grain Commission',
          'fr' => 'Commission canadienne des grains',
        ],
      ],
      [
        'department_number' => 134,
        'name' => [
          'en' => 'Canadian Dairy Commission',
          'fr' => 'Commission canadienne du lait',
        ],
      ],
      [
        'department_number' => 135,
        'name' => [
          'en' => 'Canadian Heritage (Department of)',
          'fr' => 'Patrimoine canadien (Ministère du)',
        ],
      ],
      [
        'department_number' => 136,
        'name' => [
          'en' => 'Canadian Food Inspection Agency',
          'fr' => 'Agence canadienne d\'inspection des aliments',
        ],
      ],
      [
        'department_number' => 137,
        'name' => [
          'en' => 'Military Police Complaints Commission',
          'fr' => 'Commission d\'examen des plaintes concernant la police militaire',
        ],
      ],
      [
        'department_number' => 138,
        'name' => [
          'en' => 'Military Grievances External Review Committee',
          'fr' => 'Comité externe d\'examen des griefs militaires',
        ],
      ],
      [
        'department_number' => 139,
        'name' => [
          'en' => 'Financial Transactions and Reports Analysis Centre of Canada',
          'fr' => 'Centre d\'analyse des opérations et déclarations financières du Canada',
        ],
      ],
      [
        'department_number' => 141,
        'name' => [
          'en' => 'Financial Consumer Agency of Canada',
          'fr' => 'Agence de la consommation en matière financière du Canada',
        ],
      ],
      [
        'department_number' => 142,
        'name' => [
          'en' => 'Office of Infrastructure of Canada',
          'fr' => 'Bureau de l\'infrastructure du Canada',
        ],
      ],
      [
        'department_number' => 144,
        'name' => [
          'en' => 'Courts Administration Service',
          'fr' => 'Service administratif des tribunaux judiciaires',
        ],
      ],
      [
        'department_number' => 145,
        'name' => [
          'en' => 'Library and Archives of Canada',
          'fr' => 'Bibliothèque et Archives du Canada',
        ],
      ],
      [
        'department_number' => 147,
        'name' => [
          'en' => 'Office of the Conflict of Interest and Ethics Commissioner',
          'fr' => 'Bureau du commissaire aux conflits d\'intérêts et à l\'éthique',
        ],
      ],
      [
        'department_number' => 148,
        'name' => [
          'en' => 'Public Health Agency of Canada',
          'fr' => 'Agence de la santé publique du Canada',
        ],
      ],
      [
        'department_number' => 151,
        'name' => [
          'en' => 'Office of the Senate Ethics Officer',
          'fr' => 'Bureau du conseiller sénatorial en éthique',
        ],
      ],
      [
        'department_number' => 154,
        'name' => [
          'en' => 'Office of the Commissioner of Lobbying',
          'fr' => 'Commissariat au lobbying',
        ],
      ],
      [
        'department_number' => 163,
        'name' => [
          'en' => 'Shared Services Canada',
          'fr' => 'Services partagés Canada',
        ],
      ],
      [
        'department_number' => 165,
        'name' => [
          'en' => 'Communications Security Establishment',
          'fr' => 'Centre de la sécurité des télécommunications',
        ],
      ],
      [
        'department_number' => 170,
        'name' => [
          'en' => 'Administrative Tribunals Support Service of Canada',
          'fr' => 'Service canadien d\'appui aux tribunaux administratifs',
        ],
      ],
      [
        'department_number' => 171,
        'name' => [
          'en' => 'Canadian High Arctic Research Station',
          'fr' => 'Station canadienne de recherche dans l\'Extrême-Arctique',
        ],
      ],
      [
        'department_number' => 176,
        'name' => [
          'en' => 'Parliamentary Protective Service',
          'fr' => 'Service de protection parlementaire',
        ],
      ],
      [
        'department_number' => 180,
        'name' => [
          'en' => 'Invest in Canada Hub',
          'fr' => 'Investir au Canada',
        ],
      ],
      [
        'department_number' => 183,
        'name' => [
          'en' => 'Office of the Parliamentary Budget Officer',
          'fr' => 'Bureau du directeur parlementaire du budget',
        ],
      ],
      [
        'department_number' => 190,
        'name' => [
          'en' => 'Department for Women and Gender Equality',
          'fr' => 'Ministère des Femmes et de l\'Égalité des genres',
        ],
      ],
      [
        'department_number' => 191,
        'name' => [
          'en' => 'Department of Indigenous Services',
          'fr' => 'Ministère des Services aux Autochtones',
        ],
      ],
      [
        'department_number' => 192,
        'name' => [
          'en' => 'Secretariat of the National Security and Intelligence Committee of Parliamentarians',
          'fr' => 'Secrétariat du Comité des parlementaires sur la sécurité nationale et le renseignement',
        ],
      ],
      [
        'department_number' => 193,
        'name' => [
          'en' => 'Leaders\' Debates Commission',
          'fr' => 'Commission des débats des chefs',
        ],
      ],
      [
        'department_number' => 195,
        'name' => [
          'en' => 'Canadian Energy Regulator',
          'fr' => 'Régie canadienne de l\'énergie',
        ],
      ],
      [
        'department_number' => 196,
        'name' => [
          'en' => 'National Security and Intelligence Review Agency Secretariat',
          'fr' => 'Secrétariat de l\'Office de surveillance des activités en matière de sécurité nationale et de renseignement',
        ],
      ],
      [
        'department_number' => 197,
        'name' => [
          'en' => 'Office of the Intelligence Commissioner',
          'fr' => 'Bureau du commissaire au renseignement',
        ],
      ],
      [
        'department_number' => 199,
        'name' => [
          'en' => 'Canadian Accessibility Standards Development Organization',
          'fr' => 'Organisation canadienne d\'élaboration de normes d\'accessibilité',
        ],
      ],
    ];

    foreach ($departments as $department) {
      $identifier = [
        'department_number' => $department['department_number'],
      ];
      Department::updateOrCreate($identifier, $department);
    }
  }
}
