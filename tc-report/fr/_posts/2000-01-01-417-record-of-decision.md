---
title: "Un outil pour le compte rendu des décisions"
layout: post
lang: fr
lang-ref: 417-record-of-decision
section: 4
category: 
hero:
  image:
    src: 4.17-tx-heading.jpg
    alt: Une photo de quelqu'un prenant des photos de prototypes de produits dessinés à la main.
  standards:
    - empower-staff
    - data
    - security
blocks:
  - type: tools
    tools:
      - name: Craft a Job Advertisement
        icon:
        status: disabled
        route: 
        title: Visit the job advertisement builder article.
      - name: Craft an Assessment Plan
        icon:
        status: disabled
        route: 
        title: Visit the assessment plan builder article.
      - name: Review Applications
        icon:
        status: disabled
        route: 
        title: Visit the application review article.
      - name: Record Applicant Assessment
        icon:
        status: active
        route: 
        title: Visit the record of decision article.
  - type: title
    label: Objectif de l’outil
  - Dès que les gestionnaires commencent à examiner les demandes transmises par rapport à leur offre d’emploi, ils commencent à prendre des décisions sur les candidats qui sont qualifiés et ceux qui ne le sont pas. Les gestionnaires sont tenus de consigner ces décisions afin que leur conseiller en RH puisse les consulter, en ce qu’elles font partie du dossier officiel des RH, afin d’assurer la transparence et la reddition de comptes dans les concours gouvernementaux.
  - L’outil de consignation des décisions vise à fournir aux gestionnaires un processus étape par étape pour examiner les demandes d’emploi et consigner les décisions prises sur la plateforme, en temps réel, à mesure qu’ils avancent dans le processus de dotation. L’outil organise et présente l’information fournie par le candidat, ainsi que les décisions d’évaluation prises par les gestionnaires aux étapes de l’évaluation. Le flux logique et les options de normalisation sont conçus pour faciliter un processus décisionnel rapide, responsable et cohérent. En raison des différents systèmes de RH utilisés par divers conseillers en RH, l’outil est également conçu pour produire un dossier exportable.
  - À l’avenir, l’objectif est de rendre cet outil interexploitable avec l’outil de planification d’évaluation, l’outil d’élaboration du guide de notation et le système de suivi des candidats. Cela nécessiterait également la mise en œuvre des ajustements prévus à ces autres outils afin de promouvoir une expérience utilisateur harmonieuse et de tirer le meilleur avantage de la fonctionnalité automatisée des données préchargées dans l’ensemble de la plateforme.
  - type: title
    label: État actuel
  - L’outil de consignation des décisions en est à la phase de conception avancée de notre cycle de produits, après de multiples cycles d’itération et de simulation de processus. Cependant, sans environnement de serveur Protégé B, nous ne pouvons pas afficher les dossiers d’évaluation sur la plateforme en raison du niveau de renseignements personnels qu’ils contiennent. En raison de cette restriction, l’outil n’a pas encore été diffusé.
  - Des prototypes de haute-fidélité ont été produits, avec l’aide de plusieurs dizaines de gestionnaires et de conseillers en RH dans le cadre d’ateliers et grâce à l’observation des dernières étapes de RH requises pour les processus de travail en direct dans plus d’une douzaine de ministères. Les prototypes mis au point ont ensuite fait l’objet d’essais qualitatifs auprès d’une douzaine de conseillers et de gestionnaires en RH, mais l’outil n’a pas été envoyé à l’équipe de conception en vue d’un codage.
  - type: title
    label: Perspectives
  - Il demeure difficile pour les gestionnaires de saisir un compte rendu de décisions (décisions et justification) qui répond aux exigences d’un compte rendu des RH transparent et responsable. Essentiellement, les gestionnaires doivent tenir compte de leur réflexion lorsqu’ils examinent chaque candidat pour chaque critère de sélection au cours de chaque méthode d’évaluation appliquée. Cela a également une incidence importante sur la durée du processus de dotation, car une partie du travail de consignation et d’établissement de rapports de ces décisions s’effectue souvent rétroactivement à la fin du processus. Cela peut facilement ajouter des semaines au processus d’embauche alors que les gestionnaires et les conseillers en RH multiplient les démarches afin de veiller à ce que tout soit en ordre.
  - La façon dont les conseillers en RH exigent que les décisions de sélection soient présentées découle d’années de pratique et de précédents juridiques, mais ce qui est clair pour les RH ne vient pas toujours à l’esprit des gestionnaires. Les gestionnaires gagneraient beaucoup de temps et d’efforts si la plateforme pouvait recueillir et présenter ces renseignements d’une façon simple et déclarée conforme aux exigences en matière de politique par les conseillers en RH.
  - type: title
    label: Principales composantes de l’outil
  - type: subtitle
    label: Dossier d’examen de la demande
  - type: list
    style: unordered
    items:
      - Simple processus de clics pour indiquer les candidats qui répondent aux exigences en matière d’études, avec du texte préchargé fourni pour fournir les justifications les plus courantes, avec la possibilité d’ajouter des notes ou des justifications supplémentaires.
  - type: graphic
    size: 100
    src: 4.17-fr-application-review.png
    alt: "Une saisie d’écran du dossier d’évaluation du prototype de décision. Le protocole visait à permettre aux gestionnaires de consigner leurs décisions d’évaluation de façon uniforme et fiable afin d’assurer l’équité et la documentation appropriée. Le gestionnaire pourrait déterminer si le candidat satisfait aux critères ainsi que la raison de sa décision. Le raisonnement était organisé de telle sorte que le gestionnaire pouvait choisir dans une liste prédéterminée ou écrire sa propre entrée personnalisée pour aider à atténuer la paralysie de décision."
  - type: list
    style: unordered
    items:
      - Processus de clics similaire pour les compétences requises et constituant un atout.
      - Des indications claires pour les gestionnaires lorsqu’un choix de décision nécessite une explication supplémentaire aux fins de la responsabilisation des RH.
      - Section de notes facultatives accessible à chaque étape au cas où le gestionnaire voudrait ajouter plus de détails.
      - La preuve fournie par les candidats est montrée aux gestionnaires, une compétence à la fois, afin qu’ils puissent miser sur l’information pertinente au moment de prendre chaque décision.
      - Dès qu’un candidat reçoit une note selon laquelle il ne répond pas à une exigence essentielle (et que cela est confirmé), il est déplacé dans la catégorie des candidats [traduction] « à ne plus prendre en considération » dans l’outil de suivi des candidats, et le gestionnaire reçoit une nouvelle demande. Les gestionnaires peuvent réviser et modifier cette décision en tout temps.
      - L’option [traduction] « toujours en évaluation » est offerte à chaque étape pour les gestionnaires en cas d’incertitude. Ainsi, le gestionnaire peut continuer à travailler et revenir plus tard pour prendre une décision finale.
      - Lorsqu’une méthode d’évaluation est ajoutée au plan d’évaluation, la nécessité de prendre une décision pour les critères évalués est automatiquement ajoutée au dossier.
      - Les gestionnaires peuvent voir d’un seul coup d’œil la force des divers candidats et le diagramme global du processus de dotation, c.-à-d. la portion complétée du processus, le taux d’attrition des candidats à chaque étape et le nombre de candidats jugés pleinement qualifiés.
      - Les gestionnaires peuvent également marquer les candidats très performants selon les critères et la méthode d’évaluation, ce qui aide les gestionnaires à prendre des décisions fondées sur des données probantes en utilisant des niveaux élevés de détails recueillis à chaque étape. (L’intention ici est de fournir une source de données qui peut aider à empêcher les gestionnaires d’être trop influencés par des facteurs externes susceptibles d’influencer artificiellement la prise de décisions, par exemple, les candidats initiaux et les plus récents pourraient être plus mémorables ou ceux dont le parcours de vie est plus familier pour le gestionnaire pourraient sembler plus dignes de mention que les autres.)
      - Page sommaire de toutes les décisions accessibles pour les RH, ainsi que le dossier complet des décisions par candidat par compétence par méthode d’évaluation.
  - type: graphic
    size: 100
    src: 4.17-fr-applicant-comparison.png
    alt: "Une saisie d’écran d’un prototype de résumé des résultats d’un processus d’emploi qui a permis aux conseillers en RH d’examiner les décisions des candidats dans un large contexte. Les candidats sont organisés par rangée, les résultats étant indiqués par des coches et des icônes « x ». Les résultats de chaque candidat sont organisés par compétence, afin d’aider le conseiller en RH à mieux comprendre les lacunes."
---