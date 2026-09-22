// Default instruction block bundled at the top of every "Export for AI (JSON)" file.
//
// It ships with the export rather than living in the dialog because it is the same every time and
// is long enough that showing it in the UI would bury the actual controls. The dialog's prompt box
// stays empty; anything typed there replaces this block entirely (see handleConfirmAiExport).
//
// This is prompt copy, not code — it is the wording the business wants the model to follow. Edit
// the text here rather than reproducing it at the call site, so every export stays consistent.

export const DEFAULT_AI_EXPORT_CONTEXT = {
    purpose:
      "This JSON contains information collected from Dashboard's Reco Hub for a specific domain. The information is provided to an AI system to help evaluate the domain and determine an appropriate acquisition recommendation.",
  
    how_to_interpret_the_data:
      "The JSON contains information about the domain itself as well as information discovered about potential prospects that may have an interest in acquiring or using the domain. Domain-level fields may describe characteristics, market signals, auction information, existing recommendations, historical recommendations, lead counts, and many other available data associated with the domain. The 'prospects' field contains individual potential prospects identified through AI or human research. Each prospect may contain its own company information, location, industry information, contact information, website information, social-media information, and other available attributes.",
  
    field_names:
      "Domain-level field names are internal abbreviations used by the Dashboard and are not self-explanatory. The 'field_glossary' below gives the meaning of each abbreviation that appears in this file. Use the glossary when interpreting a field rather than inferring meaning from the abbreviation itself, because several abbreviations are similar but measure different things — for example 'bl' and 'sbl' are backlink counts from two different providers, 'sg' and 'svs' are keyword search volume from two different providers, and 'traffic' is visits to the site rather than any search volume. A field that does not appear in the glossary should be interpreted from its name and values with appropriate caution, and should not be assumed to mean something similar to a glossary entry.",
  
    field_glossary: {
      // Identity and basics
      domain: 'The domain name itself.',
      len: 'Length of the domain name.',
      host: 'Registrar or platform hosting the auction/listing.',
      tld: 'Top-level domain (the extension).',
      domaincc: 'The domain written in camel case, showing intended word breaks (e.g. RioBrands.com).',
      age: 'Domain age in years, as supplied by the source sheet.',
      wby: 'Domain creation date (the date the domain was first registered).',
      wbyYear: 'Domain creation year.',
      aby: 'Last-changed / last-updated date for the domain registration.',
      extensionsTaken: 'Other TLD extensions of the same name that are already registered.',
  
      // Auction and listing
      edate: 'Auction end date (expiry / drop date).',
      ogEdate: 'Original auction end date, before any extension or relisting.',
      aDate: 'Auction date.',
      fDate: 'Date of the first bid on the listing, from the auction feed.',
      createdAt: 'Date the record was added to the Dashboard.',
      dz1: 'First day of the 14-day dropzone window, over which the asking price falls to zero. PD-DZ domains only.',
      dz14: 'Last day of the dropzone window, when the price hits zero. Always dz1 plus 13 days.',
      endTimeist: 'Auction end time in IST.',
      list: 'The source list the domain came in on.',
      oldListType: 'Lists the domain previously appeared on.',
      nkAuctionType: 'Internal listing/auction type.',
      listingType: 'Listing status, e.g. Buy Now, Make Offer, Bid / In Auction, Pre-Release, Pending Delete, Available.',
      apiRefreshStatus: 'Result of the last attempt to refresh this listing from the platform API.',
      lastAuctionRefreshTime: 'When the auction data was last successfully refreshed.',
      lastAuctionRefreshAttemptTime: 'When a refresh was last attempted, successful or not.',
  
      // Pricing and bidding
      price: 'Starting price — the opening, minimum or backorder price. This is NOT the live bid.',
      current: 'Current live / high bid.',
      increment: 'Bid increment (price minus current bid).',
      bids: 'Number of bids placed.',
      bidders: 'Number of distinct bidders.',
      highBidder: 'The current leading bidder.',
      renewalPrice: 'Cost to renew the domain.',
      minBackorderPrice: 'Minimum backorder price for this TLD.',
  
      // Valuations. Different providers/methods; they are not interchangeable.
      est: 'A domain valuation estimate.',
      esw: 'A domain valuation estimate, paired with est.',
      gdv: "Estimated value / valuation figure (the source sheet's 'Valuation' or 'Estimated Value' column).",
      gdw: 'A domain valuation estimate, paired with gdv.',
      spr500: 'A scoring percentage used internally.',
      sprGdv: 'A scoring percentage used internally, relative to gdv.',
  
      // Keyword / traffic signals
      sg: 'Keyword search volume, from Estibot.',
      svs: 'Keyword search volume, from SEMRush. Measures the same concept as sg but from a different provider.',
      cpc: 'Cost per click for the keyword.',
      cpcs: 'Cost per click, from SEMRush.',
      comp: 'Keyword competition.',
      traffic: 'Visits to the site. This is site traffic, not keyword search volume.',
      mx: 'Whether the domain has MX (mail) DNS records: 1 = yes, 0 = no.',
      geo: 'Whether the name is a geographic match.',
      geoc: 'Geographic countries associated with the name.',
  
      // Authority — Majestic
      cf: 'Citation Flow (Majestic) — link quantity signal.',
      tf: 'Trust Flow (Majestic) — link quality signal.',
      ttf: 'Topical Trust Flow (Majestic).',
      mdp: 'Majestic Domain Pop — count of referring domains.',
      mrdl: 'Majestic referring domains, live.',
      mrdf: 'Majestic referring domains, follow.',
      mrdd: 'Majestic referring domains, direct.',
      bl: 'Backlink count (Majestic).',
      wpl: 'Number of Wikipedia links pointing to the domain.',
  
      // Authority — SEMRush. Same concepts as the Majestic block, different provider.
      as: 'SEMRush Authority Score.',
      srdl: 'SEMRush referring domains.',
      sbl: 'SEMRush backlinks. Measures the same concept as bl but from a different provider.',
      sip: 'SEMRush indexed pages.',
      stp: 'SEMRush top referring domains.',
      srusr: 'SEMRush US organic search rank.',
      srusk: 'SEMRush US organic keyword count.',
      srusc: 'SEMRush US organic traffic cost.',
  
      // Registration footprint
      reg: 'Count of exact-match TLDs already registered for this name.',
      tld_count: 'Count of TLDs registered for this name.',
      tld_count_dev: 'Count of TLDs for this name that host a developed website.',
  
      // Prospect / lead counts
      totalLeads: 'Total number of prospects found for this domain.',
      officialLeadsCount: 'Number of prospects classified as official.',
      officialEmailsCount: 'Number of official email addresses found.',
      primaryEmailLeadsCount: 'Number of prospects that have a primary email address.',
      impCount: 'Number of prospects marked important.',
      pqCount: 'Number of price queries received for this domain.',
      dotdbFilteredCount: 'Number of filtered DotDB leads.',
      dotdbUnfilteredCount: 'Number of unfiltered DotDB leads.',
  
      // Recommendation and status
      reco: 'The current recommendation value for the domain.',
      recoCount: 'How many recommendations have been made.',
      recoRemark: 'Remark attached to the current recommendation.',
      priorHumanRecommendations: 'History of past recommendations, each with the analyst, the value, any previous value, a remark and a timestamp.',
      remarks: 'Free-text internal remarks.',
      notes: 'Free-text internal notes.',
      aprRemark: 'Remark relating to the APR (auction price recommendation).',
      aprPred1: 'Model-predicted auction price (prediction 1).',
      aprPred2: 'Model-predicted auction price (prediction 2).',
      aprAgent: 'Auction price predicted by the AI agent.',
      aprRangeAgent: 'Price range predicted by the AI agent.',
      aprConfidenceAgent: "Confidence level attached to the AI agent's prediction.",
      aprReasoningAgent: "Reasoning given for the AI agent's prediction.",
      flag: 'Internal flag marker on the domain.',
      active: 'Whether any associated social profile is currently active.',
      noLeadsAvailable: 'Whether research concluded no leads are available for this domain.',
      aiNoLead: 'Whether AI research concluded no leads are available.',
      mNoLeads: 'Combined human and AI view of whether no leads are available.',
      aiQueueRank: "Position of this domain in the AI processing queue.",
      predIsApr2: 'Whether an APR2 prediction exists for this domain.',
      predIsAprConfidence2: 'Confidence level attached to the APR2 prediction.',
      imputedCls: 'Imputed classification for the domain.',
      imputedVal: 'Imputed value for the domain.',
      extensions: 'Other TLD extensions of the same name that are already registered.',
  
      // Prospect collections. These overlap on purpose: each corresponds to a different view in the
      // Dashboard, so the same prospect can appear under more than one of them. Do not treat the
      // repetition as extra evidence — count a prospect once.
      leads: 'Prospects identified through human research.',
      aiProspect: 'Prospects identified through AI research.',
      aiProspectInsights: 'Prospects identified through AI research, with additional insight fields.',
      mProspects: 'All prospects for the domain, both human-researched and AI-identified.',
      mProspectsWithPreviews: 'All prospects for the domain, as shown with site previews.',
      prospectMaster: 'All prospects for the domain, the consolidated view.',
      shortlistingLead: 'The prospect recorded at the time the domain was shortlisted.',
  
      // Social collections. As above, these are different views over the same profiles.
      socials: 'Social media profiles associated with the prospects.',
      aiSocials: 'Social media profiles found through AI research.',
      mSocials: 'Combined view of social media profiles, human and AI.',
      masterSocial: 'Consolidated view of social media profiles.',
      socialColumn: 'Selected social media profiles for the prospects.',
      keySocials: 'The most significant social media profiles found.',
      linkedinData: 'LinkedIn profile information for the prospects.',
  
      // Recommendation history
      allReco: 'All recommendations recorded for this domain, with the analyst and value for each.',
      recommenders: 'The analysts who recorded a recommendation for this domain.',
      versionHistory:
        "Version history for this domain: 'versionNumber' is the current version, 'isLatestVersion' says whether it is the newest, and 'versions' lists each recorded version in ascending order. Each entry is a snapshot of the domain's fields at that version, so comparing consecutive entries shows what changed and when.",
  
      // People who handled the record. Useful as provenance, not as a quality signal.
      agents: 'The people assigned to work on this domain.',
      uploader: 'The person who first uploaded the domain.',
      shortlister: 'The person who shortlisted the domain.',
      researcher: 'The person who researched the domain.',
      processor: 'The person who processed the domain.',
      approver: 'The person who approved the domain.',
      contributingUser: 'The people who contributed to this record.',
    },
  
    prospect_definition:
      'A prospect is a company, organization, or other entity that may potentially have an interest in the domain based on the available research. A prospect should not be treated as a confirmed buyer or as evidence that the entity is willing to purchase the domain. Prospect information should be considered as supporting evidence of potential buyer demand and relevance.',
  
    source_interpretation:
      "The source field indicates how a prospect was identified. 'AI' means the prospect was identified through AI research, while a human source indicates human research. Treat the source as an indicator of how the information was discovered, not as an automatic measure of prospect quality.",
  
    reco_interpretation:
      "The 'recommendation' fields represent bidding recommendations made by individual junior analysts in the organisation. These recommendations reflect the individual analyst's assessment at the time based on the information available to them. Historical human recommendations if available can be used as supporting and contextual evidence.",
  
    missing_data:
      'Null values, empty arrays, zero values, or missing fields indicate that the corresponding information is unavailable or was not found. Do not assume that missing information is negative evidence unless the available data supports that conclusion.',
  
    recommendation_guidance:
      'The objective is to determine a reasonable acquisition price or price range for the domain based on the evidence available in this file. Consider both the potential value of the domain and the likelihood that there are credible potential buyers or use cases for it. Where the evidence is limited, inconsistent, or uncertain, reflect that uncertainty in the recommendation rather than assuming missing information.',
  
    important_rules: [
      "Do not treat an existing 'reco' as the correct or final answer.",
      "The 'recommendations' fields are individual bidding recommendations made by junior analysts and should be treated as supporting information rather than objective valuation or ground truth.",
      'Do not treat a prospect as a confirmed buyer.',
      'Do not assume that every prospect has equal relevance or purchasing potential.',
      'Evaluate prospect relevance using the information available about the prospect and its relationship to the domain.',
      'Use multiple available signals together when determining the recommendation.',
      'Do not invent information that is not present in the JSON.',
    ],
    output_format: {
        description:
          "After analysing the Reco Hub domains, respond with ONLY valid JSON in this shape. No markdown, no extra text.",
        example: {
          recos: [
            {
              domainId: 18314,
              domain: "dallemini.ai",
              claudeReco: 1200,
              reasoning: "short why",
            },
          ],
        },
        field_meanings: {
          domainId: "The numeric id from the Reco Hub row (required for saving later).",
          domain: "The domain name string.",
          claudeReco: "Your recommended acquisition bid as an integer (USD).",
          reasoning: "One or two short sentences explaining the main reasons.",
        },
      },

  };
  
  export default DEFAULT_AI_EXPORT_CONTEXT;
  